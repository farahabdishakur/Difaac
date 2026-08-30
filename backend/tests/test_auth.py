"""Authentication tests.

Each test states a security property the system must hold, so a regression
shows up as a named failure rather than as a subtly weaker system.

Run with:  python -m pytest tests/ -v
"""

from __future__ import annotations

import os
import tempfile

import pytest

# Must be set before importing the app: config reads the environment at import.
os.environ.setdefault("DIFAAC_DEBUG", "true")
os.environ.setdefault("DIFAAC_DB_PATH", os.path.join(tempfile.mkdtemp(), "test.db"))
os.environ.setdefault("DIFAAC_SEED_PASSWORD", "seeded-password-for-tests")

from fastapi.testclient import TestClient  # noqa: E402

from app import rate_limit  # noqa: E402
from app.config import REFRESH_COOKIE_NAME  # noqa: E402
from app.database import init_db  # noqa: E402
from app.main import app  # noqa: E402

VALID_PASSWORD = "correct-horse-battery-staple"


@pytest.fixture(scope="session", autouse=True)
def _database():
    init_db()


@pytest.fixture
def client():
    """A fresh client with rate-limit counters reset.

    Without the reset, tests that make many login attempts would leak their
    budget into unrelated tests.
    """
    rate_limit.reset()
    with TestClient(app) as test_client:
        yield test_client


def _register(client, email: str, password: str = VALID_PASSWORD, **extra):
    body = {"email": email, "password": password, "full_name": "Test User"}
    body.update(extra)
    return client.post("/auth/register", json=body)


def _login(client, email: str, password: str = VALID_PASSWORD):
    return client.post("/auth/login", json={"email": email, "password": password})


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class TestRegistration:
    def test_role_cannot_be_chosen_by_the_client(self, client):
        """A caller must not be able to grant itself a privileged role."""
        response = _register(client, "escalate@difaac.io", role="admin")
        assert response.status_code == 201
        assert response.json()["role"] == "analyst"

    def test_role_is_not_elevated_via_the_jwt_either(self, client):
        _register(client, "escalate2@difaac.io", role="admin")
        token = _login(client, "escalate2@difaac.io").json()["access_token"]

        import jwt as pyjwt

        claims = pyjwt.decode(token, options={"verify_signature": False})
        assert claims["role"] == "analyst"

    def test_short_password_is_rejected(self, client):
        assert _register(client, "short@difaac.io", password="abc123").status_code == 422

    def test_malformed_email_is_rejected(self, client):
        assert _register(client, "not-an-email").status_code == 422

    def test_email_is_normalised(self, client):
        response = _register(client, "  MiXeD@Difaac.IO  ")
        assert response.status_code == 201
        assert response.json()["email"] == "mixed@difaac.io"

    def test_duplicate_registration_is_rejected(self, client):
        _register(client, "dupe@difaac.io")
        assert _register(client, "dupe@difaac.io").status_code == 400

    def test_password_hash_is_never_returned(self, client):
        response = _register(client, "nohash@difaac.io")
        assert "hashed_password" not in response.json()
        assert "password" not in response.json()


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Refresh token rotation
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Protected endpoints
# ---------------------------------------------------------------------------

class TestProtectedEndpoints:
    def test_me_requires_a_token(self, client):
        """401, not 403: the caller is unauthenticated, not forbidden."""
        assert client.get("/auth/me").status_code == 401

    def test_me_rejects_a_forged_token(self, client):
        import jwt as pyjwt

        forged = pyjwt.encode(
            {"sub": "admin@difaac.io", "role": "admin", "typ": "access"},
            "the-wrong-signing-key",
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


# ---------------------------------------------------------------------------
# Logout and password change
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Rate limiting
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Public content — the site must keep working
# ---------------------------------------------------------------------------

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
