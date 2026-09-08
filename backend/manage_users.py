"""Account administration for the Difaac platform.

Creating an account is deliberately not an API endpoint. ``/auth/register``
exists for self-service sign-up and always assigns the default role, because a
route that accepted a role from its caller would let anyone register as an
administrator. Privileged accounts therefore have to be made by someone with
access to the machine, which is what this script is for.

Usage:

    python manage_users.py list
    python manage_users.py create ops@difaac.io --role admin --name "Ops Lead"
    python manage_users.py set-role ops@difaac.io admin
    python manage_users.py set-password analyst@difaac.io
    python manage_users.py unlock analyst@difaac.io
    python manage_users.py deactivate old@difaac.io

A password may be supplied with --password; when it is omitted one is
generated and printed once. It is printed once because there is nowhere to
recover it from afterwards — only its hash is stored — and that single line is
the reason to change it after first sign-in.
"""

from __future__ import annotations

import argparse
import secrets
import sys
from typing import Any

from app.auth_utils import hash_password
from app.permissions import Role, permissions_for
from app.database import _Conn, close_pool, get_connection
from app.tenancy import DEFAULT_TENANT_SLUG
from app.models import MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH

# Read from the permission model rather than restated here, so a role added
# to `app/permissions.py` is immediately creatable without touching this file.
ROLES = tuple(r.value for r in Role)


def _normalise(email: str) -> str:
    """Match the normalisation the auth routes apply, so the CLI and the API
    can never disagree about whether two addresses are the same account."""
    return email.strip().lower()


def _resolve_tenant(conn: _Conn, slug: str | None) -> int:
    """The id of the tenant named by `slug`, or the default one.

    Creating an account without saying which organisation it belongs to used to
    be unambiguous. It is not any more, and guessing would put a hospital's
    analyst in Difaac's own tenant — where they would see Difaac's data and
    none of their own.
    """
    row = conn.execute(
        "SELECT id FROM tenants WHERE slug = %s", (slug or DEFAULT_TENANT_SLUG,)
    ).fetchone()
    if not row:
        known = [
            r["slug"] for r in conn.execute("SELECT slug FROM tenants ORDER BY slug").fetchall()
        ]
        sys.exit(f"No tenant '{slug}'. Known tenants: {', '.join(known)}")
    return row["id"]


def _find(conn: _Conn, email: str) -> dict[str, Any] | None:
    return conn.execute(
        "SELECT id, email, full_name, role, is_active FROM users WHERE email = %s",
        (email,),
    ).fetchone()


def _resolve_password(supplied: str | None) -> tuple[str, bool]:
    """Return (password, was_generated), enforcing the same length policy the
    API enforces — an account made here must not be weaker than one made
    through the sign-up route."""
    if supplied is None:
        return secrets.token_urlsafe(18), True
    if not MIN_PASSWORD_LENGTH <= len(supplied) <= MAX_PASSWORD_LENGTH:
        sys.exit(
            f"Password must be between {MIN_PASSWORD_LENGTH} and "
            f"{MAX_PASSWORD_LENGTH} characters."
        )
    return supplied, False


def _report_password(email: str, password: str, generated: bool) -> None:
    if not generated:
        print(f"Password set for {email}.")
        return
    print("-" * 62)
    print("  Generated password, shown once and not recoverable:")
    print(f"      email:    {email}")
    print(f"      password: {password}")
    print("  Sign in and change it.")
    print("-" * 62)


def cmd_list(_: argparse.Namespace) -> None:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT u.email, u.full_name, u.role, u.is_active,
                   u.failed_login_attempts, u.locked_until, u.last_login_at,
                   t.slug AS tenant
              FROM users u
              JOIN tenants t ON t.id = u.tenant_id
          ORDER BY t.id, u.id
            """
        ).fetchall()

    if not rows:
        print("No accounts.")
        return

    print(f"{'EMAIL':<28} {'TENANT':<14} {'ROLE':<9} {'STATE':<10} LAST LOGIN")
    for r in rows:
        if not r["is_active"]:
            state = "disabled"
        elif r["locked_until"]:
            state = "locked"
        else:
            state = "active"
        print(
            f"{r['email']:<28} {r['tenant']:<14} {r['role']:<9} {state:<10} "
            f"{r['last_login_at'] or 'never'}"
        )


def cmd_tenants(args: argparse.Namespace) -> None:
    """List the organisations, or add one."""
    with get_connection() as conn:
        if args.add:
            conn.execute(
                "INSERT INTO tenants (slug, name) VALUES (%s, %s)"
                " ON CONFLICT (slug) DO NOTHING",
                (args.add, args.name or args.add.replace("-", " ").title()),
            )
            conn.commit()
            print(f"Tenant '{args.add}' ready.")

        rows = conn.execute(
            """
            SELECT t.slug, t.name, t.is_active,
                   (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id) AS accounts
              FROM tenants t
          ORDER BY t.id
            """
        ).fetchall()

    print(f"{'SLUG':<20} {'NAME':<26} {'STATE':<10} ACCOUNTS")
    for r in rows:
        state = "active" if r["is_active"] else "disabled"
        print(f"{r['slug']:<20} {r['name']:<26} {state:<10} {r['accounts']}")


def cmd_create(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    password, generated = _resolve_password(args.password)

    with get_connection() as conn:
        if _find(conn, email):
            sys.exit(f"{email} already exists. Use set-role or set-password instead.")
        tenant_id = _resolve_tenant(conn, args.tenant)
        conn.execute(
            """
            INSERT INTO users
                (email, hashed_password, full_name, role, tenant_id, password_changed_at)
            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            """,
            (email, hash_password(password), args.name, args.role, tenant_id),
        )
        conn.commit()

    print(f"Created {email} with role {args.role} in tenant {args.tenant or DEFAULT_TENANT_SLUG}.")
    _report_password(email, password, generated)


def cmd_set_role(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    with get_connection() as conn:
        row = _find(conn, email)
        if not row:
            sys.exit(f"No account for {email}.")
        conn.execute("UPDATE users SET role = %s WHERE id = %s", (args.role, row["id"]))
        conn.commit()
    print(f"{email}: role {row['role']} -> {args.role}")


def cmd_set_password(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    password, generated = _resolve_password(args.password)

    with get_connection() as conn:
        row = _find(conn, email)
        if not row:
            sys.exit(f"No account for {email}.")
        # Clearing the lockout alongside the password is the behaviour an
        # operator wants here: resetting a password for someone who is locked
        # out and leaving them locked out would be a surprise.
        conn.execute(
            """
            UPDATE users
               SET hashed_password = %s, password_changed_at = CURRENT_TIMESTAMP,
                   failed_login_attempts = 0, locked_until = NULL
             WHERE id = %s
            """,
            (hash_password(password), row["id"]),
        )
        # Existing sessions were established under the old password, so they
        # are revoked. Otherwise a reset would not actually end the access it
        # was most likely being performed to end.
        conn.execute(
            "UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP"
            " WHERE user_id = %s AND revoked_at IS NULL",
            (row["id"],),
        )
        conn.commit()

    _report_password(email, password, generated)
    print("Existing sessions revoked.")


def cmd_unlock(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    with get_connection() as conn:
        row = _find(conn, email)
        if not row:
            sys.exit(f"No account for {email}.")
        conn.execute(
            "UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = %s",
            (row["id"],),
        )
        conn.commit()
    print(f"{email} unlocked.")


def _set_active(email: str, active: bool) -> None:
    with get_connection() as conn:
        row = _find(conn, email)
        if not row:
            sys.exit(f"No account for {email}.")
        conn.execute(
            "UPDATE users SET is_active = %s WHERE id = %s", (active, row["id"])
        )
        if not active:
            conn.execute(
                "UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP"
                " WHERE user_id = %s AND revoked_at IS NULL",
                (row["id"],),
            )
        conn.commit()
    print(f"{email} {'activated' if active else 'deactivated'}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Difaac account administration")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="list every account").set_defaults(func=cmd_list)

    tenants = sub.add_parser("tenants", help="list organisations, or add one")
    tenants.add_argument("--add", metavar="SLUG", default=None, help="create this tenant")
    tenants.add_argument("--name", default=None, help="display name for --add")
    tenants.set_defaults(func=cmd_tenants)

    create = sub.add_parser("create", help="create an account")
    create.add_argument("email")
    create.add_argument("--role", choices=ROLES, default="analyst")
    create.add_argument("--name", default=None, help="full name")
    create.add_argument("--password", default=None, help="omit to generate one")
    create.add_argument(
        "--tenant", default=None,
        help=f"tenant slug the account belongs to (default: {DEFAULT_TENANT_SLUG})",
    )
    create.set_defaults(func=cmd_create)

    role = sub.add_parser("set-role", help="change an account's role")
    role.add_argument("email")
    role.add_argument("role", choices=ROLES)
    role.set_defaults(func=cmd_set_role)

    pwd = sub.add_parser("set-password", help="set a password and revoke sessions")
    pwd.add_argument("email")
    pwd.add_argument("--password", default=None, help="omit to generate one")
    pwd.set_defaults(func=cmd_set_password)

    unlock = sub.add_parser("unlock", help="clear a lockout after failed logins")
    unlock.add_argument("email")
    unlock.set_defaults(func=cmd_unlock)

    deactivate = sub.add_parser("deactivate", help="disable sign-in for an account")
    deactivate.add_argument("email")
    deactivate.set_defaults(func=lambda a: _set_active(_normalise(a.email), False))

    activate = sub.add_parser("activate", help="re-enable a disabled account")
    activate.add_argument("email")
    activate.set_defaults(func=lambda a: _set_active(_normalise(a.email), True))

    args = parser.parse_args()
    try:
        args.func(args)
    finally:
        # The commands are short-lived, so the pool has to be shut down
        # explicitly; left to the interpreter's finaliser it prints a thread
        # error after the command has already done its work.
        close_pool()


if __name__ == "__main__":
    main()
