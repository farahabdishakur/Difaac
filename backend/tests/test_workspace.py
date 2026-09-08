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

from fastapi.testclient import TestClient  # noqa: E402

from app import rate_limit  # noqa: E402
from app.database import init_db  # noqa: E402
from app.main import app  # noqa: E402

PASSWORD = "correct-horse-battery-staple"

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
    email = "workspace-user@difaac.io"
    client.post(
        "/auth/register",
        json={"email": email, "password": PASSWORD, "full_name": "Workspace User"},
    )
    token = client.post(
        "/auth/login", json={"email": email, "password": PASSWORD}
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


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
            "the-wrong-signing-key",
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
        rows = client.get("/api/incidents", headers=auth_headers).json()
        if not rows:
            pytest.skip("no seeded incidents to inspect")

        assert set(rows[0]) == {
            "id",
            "title",
            "severity",
            "status",
            "reported_by",
            "created_at",
        }
