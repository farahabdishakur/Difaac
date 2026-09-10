"""Shared fixtures-as-functions for the test suite.

These live here rather than in `conftest.py` so a test can import them by
name. conftest is discovered by pytest, not imported by tests; importing it
directly loads a second copy of the module under a different name, and every
fixture in it is then defined twice.
"""

from __future__ import annotations


def make_account(
    email: str,
    password: str,
    role: str = "analyst",
    full_name: str = "Test User",
    tenant_slug: str | None = None,
) -> int:
    """Create an account directly in the database. Returns its id.

    Tests used to build their fixtures by posting to `/auth/register`, which
    worked only because that endpoint was unauthenticated — and that was the
    vulnerability, not a convenience. Account creation is now administrative,
    so the suite provisions the way an operator does (`manage_users.py`)
    rather than through an endpoint that no longer exists in that shape.

    Creating accounts here rather than through the API also stops the fixtures
    depending on the behaviour they are meant to be testing: a test of
    sign-in should not fail because account creation broke.
    """
    from app.auth_utils import hash_password
    from app.database import get_connection
    from app.tenancy import DEFAULT_TENANT_SLUG, tenant_scope

    with get_connection() as conn:
        tenant_id = conn.execute(
            "SELECT id FROM tenants WHERE slug = %s",
            (tenant_slug or DEFAULT_TENANT_SLUG,),
        ).fetchone()["id"]

    # The scope has to wrap the checkout, not sit inside it: the tenant is
    # announced to the connection when it is taken from the pool, so setting
    # it afterwards would change nothing. `users` carries no row-level policy
    # of its own, but a fixture that only appears to be tenant-scoped is worse
    # than one that plainly is not.
    with tenant_scope(tenant_id), get_connection() as conn:
        row = conn.execute(
            """
            INSERT INTO users
                (email, hashed_password, full_name, role, tenant_id, password_changed_at)
            VALUES (%s, %s, %s, %s, %s, now())
            ON CONFLICT (email) DO UPDATE
                SET hashed_password = EXCLUDED.hashed_password,
                    role = EXCLUDED.role,
                    is_active = TRUE,
                    failed_login_attempts = 0,
                    locked_until = NULL
            RETURNING id
            """,
            (email.strip().lower(), hash_password(password), full_name, role, tenant_id),
        ).fetchone()
        conn.commit()
    return row["id"]


def sign_in(client, email: str, password: str) -> dict[str, str]:
    """An Authorization header for `email`. The account must already exist."""
    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
