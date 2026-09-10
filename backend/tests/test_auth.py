"""Authentication tests.

Each test states a security property the system must hold, so a regression
shows up as a named failure rather than as a subtly weaker system.

Run with:  python -m pytest tests/ -v
"""

from __future__ import annotations

import os

import pytest

# Must be set before importing the app: config reads the environment at import.
# conftest.py has already pointed DATABASE_URL at a throwaway test database.
os.environ.setdefault("DIFAAC_DEBUG", "true")
os.environ.setdefault("DIFAAC_SEED_PASSWORD", "seeded-password-for-tests")

from app.config import REFRESH_COOKIE_NAME  # noqa: E402
from app.database import init_db  # noqa: E402

from tests.helpers import make_account, sign_in  # noqa: E402

VALID_PASSWORD = "correct-horse-battery-staple"


@pytest.fixture(scope="session", autouse=True)
def _database():
    init_db()


def _register(client, email: str, password: str = VALID_PASSWORD, **extra):
    """Provision an account the way an operator does, not through the API.

    This used to post to `/auth/register`, which worked because that endpoint
    was reachable by anyone. That was the vulnerability, not a convenience: an
    unauthenticated caller received an `analyst` account on the default tenant,
    and with it read access to that tenant's entire console. The endpoint now
    requires `users:manage`, and the tests that exercise it as an endpoint are
    in `TestAccountCreation` below.

    Kept under its original name and shape so the call sites that only need an
    account to exist read exactly as they did.
    """
    make_account(email, password, role=extra.get("role_override", "analyst"))


def _login(client, email: str, password: str = VALID_PASSWORD):
    return client.post("/auth/login", json={"email": email, "password": password})


def _admin_headers(client, email: str = "provisioner@difaac.io"):
    """A signed-in administrator, for the endpoints that require one."""
    make_account(email, VALID_PASSWORD, role="admin")
    return sign_in(client, email, VALID_PASSWORD)


# Registration

class TestAccountCreation:
    """`POST /auth/register` is an administrative endpoint, not a signup form.

    It was reachable unauthenticated, and because the insert left `tenant_id`
    to its column default -- which falls back to the `difaac` tenant -- anyone
    who could reach the API could mint themselves an `analyst` account with
    read access to that tenant's whole console: its threat intelligence, its
    incidents, and for a healthcare customer its record-access trail. These
    tests exist so that cannot come back quietly.
    """

    def test_anonymous_callers_are_refused(self, client):
        """401, not 403: no credential was presented at all.

        The distinction is worth keeping. 401 says "authenticate"; 403 says
        "you did authenticate, and it is still no" -- which is what an
        analyst gets from the test below. Collapsing the two would make a
        missing token and an insufficient one look the same in the logs.
        """
        response = client.post(
            "/auth/register",
            json={"email": "stranger@difaac.io", "password": VALID_PASSWORD},
        )
        assert response.status_code == 401
        # And no account was created as a side effect of being refused.
        assert _login(client, "stranger@difaac.io").status_code != 200

    def test_an_ordinary_analyst_cannot_create_accounts(self, client):
        """Holding a session is not the same as holding `users:manage`."""
        make_account("plain-analyst@difaac.io", VALID_PASSWORD, role="analyst")
        headers = sign_in(client, "plain-analyst@difaac.io", VALID_PASSWORD)

        response = client.post(
            "/auth/register",
            json={"email": "made-by-analyst@difaac.io", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert response.status_code == 403

    def test_an_administrator_creates_an_account(self, client):
        headers = _admin_headers(client)
        response = client.post(
            "/auth/register",
            json={
                "email": "new-colleague@difaac.io",
                "password": VALID_PASSWORD,
                "full_name": "New Colleague",
                "role": "analyst",
            },
            headers=headers,
        )
        assert response.status_code == 201
        assert response.json()["role"] == "analyst"
        assert _login(client, "new-colleague@difaac.io").status_code == 200

    def test_the_role_defaults_to_the_least_privileged_one(self, client):
        """An omitted role must not mean an investigative one."""
        headers = _admin_headers(client, "provisioner-default@difaac.io")
        response = client.post(
            "/auth/register",
            json={"email": "unspecified-role@difaac.io", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert response.status_code == 201
        assert response.json()["role"] == "viewer"

    def test_an_unknown_role_is_rejected(self, client):
        """A role resolving to no permissions is a lockout, not an account."""
        headers = _admin_headers(client, "provisioner-badrole@difaac.io")
        response = client.post(
            "/auth/register",
            json={
                "email": "typo-role@difaac.io",
                "password": VALID_PASSWORD,
                "role": "adminn",
            },
            headers=headers,
        )
        assert response.status_code == 422

    def test_the_account_lands_in_the_creator_tenant(self, client):
        """Never in the default one, and never in a tenant the payload names."""
        from app.database import get_connection
        from app.tenancy import tenant_scope

        with get_connection() as conn:
            conn.execute(
                "INSERT INTO tenants (slug, name) VALUES (%s, %s)"
                " ON CONFLICT (slug) DO NOTHING",
                ("clinic", "Clinic"),
            )
            conn.commit()
            clinic_id = conn.execute(
                "SELECT id FROM tenants WHERE slug = %s", ("clinic",)
            ).fetchone()["id"]

        make_account(
            "clinic-admin@difaac.io", VALID_PASSWORD, role="admin", tenant_slug="clinic"
        )
        headers = sign_in(client, "clinic-admin@difaac.io", VALID_PASSWORD)

        created = client.post(
            "/auth/register",
            json={"email": "clinic-nurse@difaac.io", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert created.status_code == 201

        with tenant_scope(clinic_id), get_connection() as conn:
            row = conn.execute(
                "SELECT tenant_id FROM users WHERE email = %s",
                ("clinic-nurse@difaac.io",),
            ).fetchone()
        assert row["tenant_id"] == clinic_id

    def test_a_weak_password_is_refused(self, client):
        headers = _admin_headers(client, "provisioner-weak@difaac.io")
        response = client.post(
            "/auth/register",
            json={"email": "short@difaac.io", "password": "abc123"},
            headers=headers,
        )
        assert response.status_code == 422

    def test_a_malformed_address_is_refused(self, client):
        headers = _admin_headers(client, "provisioner-email@difaac.io")
        response = client.post(
            "/auth/register",
            json={"email": "not-an-email", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert response.status_code == 422

    def test_the_address_is_normalised(self, client):
        headers = _admin_headers(client, "provisioner-norm@difaac.io")
        response = client.post(
            "/auth/register",
            json={"email": "  MiXeD@Difaac.IO  ", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert response.status_code == 201
        assert response.json()["email"] == "mixed@difaac.io"

    def test_a_duplicate_address_is_refused(self, client):
        headers = _admin_headers(client, "provisioner-dupe@difaac.io")
        make_account("dupe@difaac.io", VALID_PASSWORD)
        response = client.post(
            "/auth/register",
            json={"email": "dupe@difaac.io", "password": VALID_PASSWORD},
            headers=headers,
        )
        assert response.status_code == 400

    def test_the_password_hash_never_leaves_the_server(self, client):
        headers = _admin_headers(client, "provisioner-hash@difaac.io")
        response = client.post(
            "/auth/register",
            json={"email": "nohash@difaac.io", "password": VALID_PASSWORD},
            headers=headers,
        )
        body = response.json()
        assert "hashed_password" not in body and "password" not in body


# Login

class TestLogin:
    def test_valid_credentials_return_a_token_and_profile(self, client):
        _register(client, "good@difaac.io")
        response = _login(client, "good@difaac.io")
        body = response.json()

        assert response.status_code == 200
        # These two field names are the published contract with the web client.
        assert body["access_token"]
        assert body["user"]["email"] == "good@difaac.io"

    def test_refresh_token_is_httponly_and_absent_from_the_body(self, client):
        """The refresh token must be unreachable from page scripts."""
        _register(client, "cookie@difaac.io")
        response = _login(client, "cookie@difaac.io")

        assert REFRESH_COOKIE_NAME not in response.text
        set_cookie = response.headers.get("set-cookie", "")
        assert REFRESH_COOKIE_NAME in set_cookie
        assert "httponly" in set_cookie.lower()

    def test_unknown_account_and_wrong_password_are_indistinguishable(self, client):
        """The response must not reveal whether an address is registered."""
        _register(client, "known@difaac.io")

        wrong_password = _login(client, "known@difaac.io", "definitely-not-the-password")
        no_account = _login(client, "nobody@difaac.io", "definitely-not-the-password")

        assert wrong_password.status_code == no_account.status_code == 401
        assert wrong_password.json()["detail"] == no_account.json()["detail"]

    def test_account_locks_after_repeated_failures(self, client):
        """Per-account lockout, so rotating source IPs does not defeat it."""
        _register(client, "lockme@difaac.io")

        statuses = [
            _login(client, "lockme@difaac.io", "wrong-password-attempt").status_code
            for _ in range(9)
        ]

        assert 429 in statuses, f"expected a lockout, saw {statuses}"

    def test_correct_password_is_refused_while_locked(self, client):
        """Lockout must hold even for the real password, or it achieves nothing."""
        _register(client, "stilllocked@difaac.io")
        for _ in range(9):
            _login(client, "stilllocked@difaac.io", "wrong-password-attempt")

        assert _login(client, "stilllocked@difaac.io").status_code == 429


# Refresh token rotation

class TestRefreshRotation:
    def test_refresh_issues_a_new_access_token(self, client):
        _register(client, "refresh@difaac.io")
        _login(client, "refresh@difaac.io")

        response = client.post("/auth/refresh")
        assert response.status_code == 200
        assert response.json()["access_token"]

    def test_refresh_rotates_the_token(self, client):
        _register(client, "rotate@difaac.io")
        _login(client, "rotate@difaac.io")
        first = client.cookies.get(REFRESH_COOKIE_NAME)

        client.post("/auth/refresh")
        second = client.cookies.get(REFRESH_COOKIE_NAME)

        assert first and second and first != second

    def test_reusing_a_rotated_token_revokes_the_whole_family(self, client):
        """A replayed refresh token means it was captured.

        We cannot tell the attacker's copy from the victim's, so both are
        invalidated and both must sign in again.
        """
        _register(client, "reuse@difaac.io")
        _login(client, "reuse@difaac.io")
        stolen = client.cookies.get(REFRESH_COOKIE_NAME)

        client.post("/auth/refresh")  # legitimate rotation
        live = client.cookies.get(REFRESH_COOKIE_NAME)

        # Attacker replays the captured token.
        client.cookies.set(REFRESH_COOKIE_NAME, stolen)
        replay = client.post("/auth/refresh")
        assert replay.status_code == 401

        # The victim's current token is now dead too.
        client.cookies.set(REFRESH_COOKIE_NAME, live)
        assert client.post("/auth/refresh").status_code == 401

    def test_refresh_without_a_cookie_is_rejected(self, client):
        client.cookies.clear()
        assert client.post("/auth/refresh").status_code == 401

    def test_access_token_cannot_be_used_as_a_refresh_token(self, client):
        _register(client, "swap@difaac.io")
        access = _login(client, "swap@difaac.io").json()["access_token"]

        client.cookies.set(REFRESH_COOKIE_NAME, access)
        assert client.post("/auth/refresh").status_code == 401


# Protected endpoints

class TestProtectedEndpoints:
    def test_me_requires_a_token(self, client):
        """401, not 403: the caller is unauthenticated, not forbidden."""
        assert client.get("/auth/me").status_code == 401

    def test_me_rejects_a_forged_token(self, client):
        import jwt as pyjwt

        forged = pyjwt.encode(
            {"sub": "admin@difaac.io", "role": "admin", "typ": "access"},
            "the-wrong-signing-key-long-enough-to-be-realistic",
            algorithm="HS256",
        )
        response = client.get("/auth/me", headers={"Authorization": f"Bearer {forged}"})
        assert response.status_code == 401

    def test_me_returns_the_authenticated_profile(self, client):
        _register(client, "profile@difaac.io")
        token = _login(client, "profile@difaac.io").json()["access_token"]

        response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json()["email"] == "profile@difaac.io"

    def test_refresh_token_is_not_accepted_as_a_bearer_token(self, client):
        _register(client, "notbearer@difaac.io")
        _login(client, "notbearer@difaac.io")
        refresh_token = client.cookies.get(REFRESH_COOKIE_NAME)

        response = client.get(
            "/auth/me", headers={"Authorization": f"Bearer {refresh_token}"}
        )
        assert response.status_code == 401


# Logout and password change

class TestSessionTermination:
    def test_logout_revokes_the_session(self, client):
        _register(client, "logout@difaac.io")
        _login(client, "logout@difaac.io")

        assert client.post("/auth/logout").status_code == 200
        assert client.post("/auth/refresh").status_code == 401

    def test_logout_works_without_a_valid_access_token(self, client):
        """Signing out must not require a token that may already have expired."""
        _register(client, "expiredlogout@difaac.io")
        _login(client, "expiredlogout@difaac.io")

        assert client.post("/auth/logout").status_code == 200

    def test_password_change_revokes_all_sessions(self, client):
        _register(client, "changepw@difaac.io")
        token = _login(client, "changepw@difaac.io").json()["access_token"]

        response = client.post(
            "/auth/change-password",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "current_password": VALID_PASSWORD,
                "new_password": "an-entirely-different-password",
            },
        )
        assert response.status_code == 200
        assert client.post("/auth/refresh").status_code == 401

    def test_password_change_requires_the_current_password(self, client):
        _register(client, "wrongcurrent@difaac.io")
        token = _login(client, "wrongcurrent@difaac.io").json()["access_token"]

        response = client.post(
            "/auth/change-password",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "current_password": "not-the-current-password",
                "new_password": "an-entirely-different-password",
            },
        )
        assert response.status_code == 401

    def test_new_password_must_differ_from_the_old_one(self, client):
        _register(client, "samepw@difaac.io")
        token = _login(client, "samepw@difaac.io").json()["access_token"]

        response = client.post(
            "/auth/change-password",
            headers={"Authorization": f"Bearer {token}"},
            json={"current_password": VALID_PASSWORD, "new_password": VALID_PASSWORD},
        )
        assert response.status_code == 400


# Rate limiting

class TestRateLimiting:
    def test_login_endpoint_is_throttled(self, client):
        statuses = [
            client.post(
                "/auth/login", json={"email": "flood@difaac.io", "password": "guessing"}
            ).status_code
            for _ in range(14)
        ]
        assert 429 in statuses

    def test_content_endpoints_are_not_throttled_by_login_traffic(self, client):
        """A burst of failed logins must not take the public site down."""
        for _ in range(14):
            client.post("/auth/login", json={"email": "flood2@difaac.io", "password": "x"})

        assert client.get("/products").status_code == 200

    def test_rate_limited_response_carries_retry_after(self, client):
        last = None
        for _ in range(14):
            last = client.post(
                "/auth/login", json={"email": "retry@difaac.io", "password": "guessing"}
            )
        assert last.status_code == 429
        assert "retry-after" in {k.lower() for k in last.headers}


# Public content — the site must keep working

class TestPublicContent:
    @pytest.mark.parametrize(
        "path,expected_count",
        [
            ("/products", 6),
            ("/industries", 6),
            ("/solutions", 13),
            ("/services", 12),
        ],
    )
    def test_content_endpoints_serve_the_expected_rows(self, client, path, expected_count):
        response = client.get(path)
        assert response.status_code == 200
        assert len(response.json()) == expected_count

    def test_content_requires_no_authentication(self, client):
        assert client.get("/products").status_code == 200

    def test_security_headers_are_present(self, client):
        headers = client.get("/products").headers
        assert headers["X-Content-Type-Options"] == "nosniff"
        assert headers["X-Frame-Options"] == "DENY"
        assert "frame-ancestors 'none'" in headers["Content-Security-Policy"]
