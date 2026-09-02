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
import sqlite3
import sys

from app.auth_utils import hash_password
from app.database import get_connection
from app.models import MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH

# The roles the platform recognises. `analyst` is what self-service
# registration assigns; `admin` is only ever set from here.
ROLES = ("analyst", "admin")


def _normalise(email: str) -> str:
    """Match the normalisation the auth routes apply, so the CLI and the API
    can never disagree about whether two addresses are the same account."""
    return email.strip().lower()


def _find(conn: sqlite3.Connection, email: str) -> sqlite3.Row | None:
    return conn.execute(
        "SELECT id, email, full_name, role, is_active FROM users WHERE email = ?",
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
            SELECT email, full_name, role, is_active,
                   failed_login_attempts, locked_until, last_login_at
              FROM users
          ORDER BY id
            """
        ).fetchall()

    if not rows:
        print("No accounts.")
        return

    print(f"{'EMAIL':<28} {'ROLE':<9} {'STATE':<10} LAST LOGIN")
    for r in rows:
        if not r["is_active"]:
            state = "disabled"
        elif r["locked_until"]:
            state = "locked"
        else:
            state = "active"
        print(
            f"{r['email']:<28} {r['role']:<9} {state:<10} "
            f"{r['last_login_at'] or 'never'}"
        )


def cmd_create(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    password, generated = _resolve_password(args.password)

    with get_connection() as conn:
        if _find(conn, email):
            sys.exit(f"{email} already exists. Use set-role or set-password instead.")
        conn.execute(
            """
            INSERT INTO users (email, hashed_password, full_name, role, password_changed_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """,
            (email, hash_password(password), args.name, args.role),
        )
        conn.commit()

    print(f"Created {email} with role {args.role}.")
    _report_password(email, password, generated)


def cmd_set_role(args: argparse.Namespace) -> None:
    email = _normalise(args.email)
    with get_connection() as conn:
        row = _find(conn, email)
        if not row:
            sys.exit(f"No account for {email}.")
        conn.execute("UPDATE users SET role = ? WHERE id = ?", (args.role, row["id"]))
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
               SET hashed_password = ?, password_changed_at = CURRENT_TIMESTAMP,
                   failed_login_attempts = 0, locked_until = NULL
             WHERE id = ?
            """,
            (hash_password(password), row["id"]),
        )
        # Existing sessions were established under the old password, so they
        # are revoked. Otherwise a reset would not actually end the access it
        # was most likely being performed to end.
        conn.execute(
            "UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP"
            " WHERE user_id = ? AND revoked_at IS NULL",
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
            "UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?",
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
            "UPDATE users SET is_active = ? WHERE id = ?", (1 if active else 0, row["id"])
        )
        if not active:
            conn.execute(
                "UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP"
                " WHERE user_id = ? AND revoked_at IS NULL",
                (row["id"],),
            )
        conn.commit()
    print(f"{email} {'activated' if active else 'deactivated'}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Difaac account administration")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="list every account").set_defaults(func=cmd_list)

    create = sub.add_parser("create", help="create an account")
    create.add_argument("email")
    create.add_argument("--role", choices=ROLES, default="analyst")
    create.add_argument("--name", default=None, help="full name")
    create.add_argument("--password", default=None, help="omit to generate one")
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
    args.func(args)


if __name__ == "__main__":
    main()
