"""SOC workspace access control tests.

These endpoints carry a customer's security posture — indicators, phishing
against their brand, fraud cases, live incidents. Serving any of it without
authentication is a data breach, so each endpoint is asserted individually
rather than through a loop over a list that a future edit might quietly shorten.
"""

from __future__ import annotations

import os

import pytest

# conftest.py has already pointed DATABASE_URL at a throwaway test database.
os.environ.setdefault("DIFAAC_DEBUG", "true")
os.environ.setdefault("DIFAAC_SEED_PASSWORD", "seeded-password-for-tests")

from app.database import get_connection, init_db  # noqa: E402
from app.tenancy import DEFAULT_TENANT_SLUG, tenant_scope  # noqa: E402

from tests.helpers import make_account, sign_in  # noqa: E402

PASSWORD = "correct-horse-battery-staple"


def _default_tenant_id() -> int:
    """The tenant the test accounts belong to."""
    with get_connection() as conn:
        return conn.execute(
            "SELECT id FROM tenants WHERE slug = %s", (DEFAULT_TENANT_SLUG,)
        ).fetchone()["id"]


# Every authenticated workspace endpoint. Adding a route to the workspace
# router without adding it here means nothing checks that it is actually
# protected, which is the one property this whole module exists to prove.
WORKSPACE_ENDPOINTS = [
    "/api/ti/iocs",
    "/api/ti/actors",
    "/api/ti/alerts",
    "/api/ti/summary",
    "/api/drp/phishing",
    "/api/fraud/cases",
    "/api/fraud/summary",
    "/api/incidents",
]

# The subset that returns an array of rows. The two summary endpoints return a
# single aggregate object instead, so they are excluded from the shape check
# rather than being forced into a list they have no reason to be.
WORKSPACE_COLLECTIONS = [p for p in WORKSPACE_ENDPOINTS if not p.endswith("/summary")]


@pytest.fixture(scope="session", autouse=True)
def _database():
    init_db()


@pytest.fixture
def auth_headers(client):
    """An ordinary analyst -- the least privileged account that can work a queue.

    Provisioned directly rather than through `/auth/register`, which is now an
    administrative endpoint. Using the API here would have meant an admin
    fixture creating an analyst fixture, and a failure in account creation
    would then look like a failure in workspace authorisation.
    """
    email = "workspace-user@difaac.io"
    make_account(email, PASSWORD, role="analyst", full_name="Workspace User")
    return sign_in(client, email, PASSWORD)


@pytest.fixture
def viewer_headers(client):
    """The least privileged role the product has."""
    email = "workspace-viewer@difaac.io"
    make_account(email, PASSWORD, role="viewer", full_name="Workspace Viewer")
    return sign_in(client, email, PASSWORD)


@pytest.fixture
def admin_headers(client):
    email = "workspace-admin@difaac.io"
    make_account(email, PASSWORD, role="admin", full_name="Workspace Admin")
    return sign_in(client, email, PASSWORD)


class TestWorkspaceRequiresAuthentication:
    @pytest.mark.parametrize("path", WORKSPACE_ENDPOINTS)
    def test_anonymous_access_is_refused(self, client, path):
        """No customer security data may be served without a token."""
        assert client.get(path).status_code == 401

    @pytest.mark.parametrize("path", WORKSPACE_ENDPOINTS)
    def test_forged_token_is_refused(self, client, path):
        import jwt as pyjwt

        forged = pyjwt.encode(
            {"sub": "attacker@difaac.io", "role": "admin", "typ": "access"},
            "the-wrong-signing-key-long-enough-to-be-realistic",
            algorithm="HS256",
        )
        response = client.get(path, headers={"Authorization": f"Bearer {forged}"})
        assert response.status_code == 401

    @pytest.mark.parametrize("path", WORKSPACE_ENDPOINTS)
    def test_authenticated_access_succeeds(self, client, auth_headers, path):
        response = client.get(path, headers=auth_headers)
        assert response.status_code == 200

    @pytest.mark.parametrize("path", WORKSPACE_COLLECTIONS)
    def test_collections_return_a_list(self, client, auth_headers, path):
        """The row endpoints return an array; the summaries deliberately do not."""
        assert isinstance(client.get(path, headers=auth_headers).json(), list)


class TestQueryBounds:
    def test_limit_above_the_maximum_is_rejected(self, client, auth_headers):
        """An unbounded limit lets one request ask for the whole table."""
        response = client.get("/api/ti/iocs?limit=999999999", headers=auth_headers)
        assert response.status_code == 422

    def test_zero_and_negative_limits_are_rejected(self, client, auth_headers):
        assert client.get("/api/ti/iocs?limit=0", headers=auth_headers).status_code == 422
        assert client.get("/api/ti/iocs?limit=-5", headers=auth_headers).status_code == 422

    def test_limit_at_the_maximum_is_accepted(self, client, auth_headers):
        assert client.get("/api/ti/iocs?limit=500", headers=auth_headers).status_code == 200


class TestResponseShape:
    def test_columns_are_explicit_not_select_star(self, client, auth_headers):
        """A column added to the table later must not be exposed automatically.

        Asserting the exact key set means adding a column to `incidents` fails
        this test until someone decides, deliberately, to expose it.
        """
        # The row is created here rather than relied on from the seed. This
        # test used to skip when the table was empty, which is exactly what
        # happens with DIFAAC_SEED_DEMO off -- so in CI, where demo data is
        # deliberately absent, the one assertion that guards against
        # `SELECT *` never ran at all.
        with tenant_scope(_default_tenant_id()), get_connection() as conn:
            conn.execute(
                """
                INSERT INTO incidents (title, severity, status, reported_by, tenant_id)
                VALUES (%s, %s, %s, %s, %s)
                """,
                ("Shape check incident", "low", "open", "tests", _default_tenant_id()),
            )
            conn.commit()

        rows = client.get("/api/incidents", headers=auth_headers).json()
        assert rows, "the row inserted above should be visible to this tenant"

        assert set(rows[0]) == {
            "id",
            "title",
            "severity",
            "status",
            "reported_by",
            "created_at",
        }


class TestRecordAccessTrailIsNarrower:
    """`/api/app-events` is not ordinary console data.

    For a healthcare customer it is the record-access trail: which patient
    record was opened, by whom, and when. Every other route in this module is
    gated on `consoles:read`, which sits in the base permission set and is
    therefore held by every role including `viewer`. That is the right gate
    for detections and phishing domains and the wrong one here, so this
    endpoint asks for `audit:read` instead.
    """

    PATH = "/api/app-events"

    def test_anonymous_access_is_refused(self, client):
        assert client.get(self.PATH).status_code == 401

    def test_a_viewer_is_refused(self, client, viewer_headers):
        assert client.get(self.PATH, headers=viewer_headers).status_code == 403

    def test_an_analyst_is_refused(self, client, auth_headers):
        """An analyst works alerts and incidents, not the patient record log."""
        assert client.get(self.PATH, headers=auth_headers).status_code == 403

    def test_an_administrator_is_allowed(self, client, admin_headers):
        response = client.get(self.PATH, headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_the_rest_of_the_console_stays_open_to_a_viewer(self, client, viewer_headers):
        """Narrowing this one route must not have narrowed the others."""
        assert client.get("/api/ti/iocs", headers=viewer_headers).status_code == 200
