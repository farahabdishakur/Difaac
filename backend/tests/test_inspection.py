"""The detection engine, and the write that carries its verdicts.

Two halves, and only one of them was ever working.

The engine scores correctly — `' OR 1=1--` trips the tautology rule at 45
against a threshold of 25, and always did. What did not work was recording the
verdict. The inspection middleware runs *before* authentication, which is the
point of it: an attacker never signs in. But that means no tenant is announced
when it fires, and `xdr_detections` carries a row-level policy, so every insert
was refused. The middleware catches everything by design — a bug in a rule must
never be the reason a request fails — so the refusal was swallowed, the console
stayed empty, and Difaac's own perimeter detected attacks it then threw away.

That failure only became visible once the application stopped connecting to
PostgreSQL as a superuser. As a superuser the policy did not apply and the
insert succeeded, so the bug was hidden behind a larger one: fixing the role
is what surfaced it, and shipping the role fix without this one would have
turned a silent leak into a silent detection gap.

So these tests assert the whole path — scored, written, and readable in the
console — rather than only the scoring, which never needed defending.
"""

from __future__ import annotations

import os

import pytest

os.environ.setdefault("DIFAAC_DEBUG", "true")
os.environ.setdefault("DIFAAC_SEED_PASSWORD", "seeded-password-for-tests")

from app.database import get_connection, init_db  # noqa: E402
from app.inspection import FLAG_AT, inspect  # noqa: E402

from tests.helpers import make_account, sign_in  # noqa: E402

PASSWORD = "correct-horse-battery-staple"


@pytest.fixture(scope="session", autouse=True)
def _database():
    init_db()


@pytest.fixture
def admin_headers(client):
    email = "inspection-admin@difaac.io"
    make_account(email, PASSWORD, role="admin", full_name="Inspection Admin")
    return sign_in(client, email, PASSWORD)


def _detection_count() -> int:
    """Counted directly, bypassing the API, so the test does not depend on the
    console's own filtering to tell whether a row was written."""
    from app.tenancy import DEFAULT_TENANT_SLUG, tenant_scope

    with get_connection() as conn:
        tenant_id = conn.execute(
            "SELECT id FROM tenants WHERE slug = %s", (DEFAULT_TENANT_SLUG,)
        ).fetchone()["id"]
    with tenant_scope(tenant_id), get_connection() as conn:
        return conn.execute("SELECT COUNT(*) AS n FROM xdr_detections").fetchone()["n"]


class TestTheEngineScores:
    """These never broke. They are here so a rule edit cannot quietly gut them."""

    @pytest.mark.parametrize(
        "path,query,rule",
        [
            ("/products/x", "q=' OR '1'='1", "sqli-tautology"),
            ("/products/<script>alert(1)</script>", "", "xss-script-tag"),
            ("/api/x", "limit=1 UNION SELECT", "sqli-union"),
            ("/products/../../etc/passwd", "", "traversal-dotdot"),
        ],
    )
    def test_a_known_attack_shape_is_flagged(self, path, query, rule):
        verdict = inspect(path=path, query=query, user_agent="curl/8.0")
        assert verdict.score >= FLAG_AT
        assert rule in [f.rule_id for f in verdict.findings]

    def test_ordinary_traffic_is_not_flagged(self):
        """A rule that fires on the marketing site is a rule nobody keeps on."""
        for path in ("/products", "/solutions/ransomware-protection", "/company/team"):
            verdict = inspect(path=path, query="", user_agent="Mozilla/5.0")
            assert verdict.score < FLAG_AT, f"{path} was flagged: {verdict.findings}"


class TestTheVerdictIsActuallyRecorded:
    """The half that was broken."""

    def test_an_attack_against_the_api_lands_in_the_console(self, client, admin_headers):
        before = _detection_count()

        # Unauthenticated, exactly as an attacker arrives. The middleware runs
        # with no tenant announced, which is what used to make the write fail.
        client.get("/products/x", params={"q": "' OR '1'='1"})

        assert _detection_count() == before + 1, (
            "the request was scored but nothing was written -- the insert is being "
            "refused by the row-level policy because no tenant was announced"
        )

        rows = client.get("/api/xdr/detections", headers=admin_headers).json()
        assert any("SQL injection" in row["rule"] for row in rows)

    def test_the_detection_names_where_it_came_from(self, client, admin_headers):
        client.get("/products/y", params={"q": "' OR '1'='1"})
        rows = client.get("/api/xdr/detections", headers=admin_headers).json()
        recent = [r for r in rows if "/products/y" in (r["host"] or "")]
        assert recent, "the detection did not record the path it fired on"

    def test_ordinary_traffic_writes_nothing(self, client):
        """Otherwise the console fills with the site's own visitors."""
        before = _detection_count()
        client.get("/products")
        client.get("/health")
        assert _detection_count() == before

    def test_inspection_never_fails_the_request(self, client):
        """A detection gap is acceptable; an outage caused by a rule is not."""
        response = client.get("/products/x", params={"q": "' OR '1'='1"})
        assert response.status_code < 500
