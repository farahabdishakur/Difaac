"""Database-facing authentication logic.

Keeping this out of the route handlers means the rules that matter — lockout
thresholds, refresh-token rotation, reuse detection — are stated once and can
be read without wading through HTTP concerns.
"""

from __future__ import annotations

import logging
import sqlite3
from datetime import datetime, timedelta, timezone

from app.auth_utils import generate_refresh_token, hash_refresh_token, new_family_id
from app.config import (
    LOCKOUT_MINUTES,
    MAX_FAILED_LOGINS,
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)

logger = logging.getLogger(__name__)

# Stored as ISO-8601 UTC. SQLite has no native datetime type, and a consistent
# sortable text format keeps comparisons correct in SQL as well as in Python.
_TS_FORMAT = "%Y-%m-%dT%H:%M:%S%z"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _to_text(value: datetime) -> str:
    return value.strftime(_TS_FORMAT)


def _from_text(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.strptime(value, _TS_FORMAT)
    except ValueError:
        # Rows written before this format was settled, or by hand.
        try:
            parsed = datetime.fromisoformat(value)
        except ValueError:
            logger.warning("Unparseable timestamp in database: %r", value)
            return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


# ---------------------------------------------------------------------------
# Audit trail
# ---------------------------------------------------------------------------

def record_event(
    conn: sqlite3.Connection,
    event: str,
    *,
    email: str | None = None,
    user_id: int | None = None,
    detail: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    """Append an authentication event.

    Auditing must never be the reason a login fails, so any storage error is
    logged and swallowed rather than raised.
    """
    try:
        conn.execute(
            """
            INSERT INTO auth_events (user_id, email, event, detail, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, email, event, detail, ip_address, (user_agent or "")[:400] or None),
        )
    except sqlite3.Error as exc:
        logger.error("Failed to record auth event %r: %s", event, exc)


# ---------------------------------------------------------------------------
# Account lockout
# ---------------------------------------------------------------------------

def lockout_remaining(row: sqlite3.Row) -> int:
    """Seconds until the account unlocks, or 0 if it is not locked."""
    locked_until = _from_text(_get(row, "locked_until"))
    if not locked_until:
        return 0
    remaining = (locked_until - _now()).total_seconds()
    return max(0, int(remaining))


def register_failed_login(conn: sqlite3.Connection, user_id: int) -> bool:
    """Count a failed attempt. Returns True if the account is now locked."""
    row = conn.execute(
        "SELECT failed_login_attempts FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    attempts = (row["failed_login_attempts"] if row else 0) + 1

    if attempts >= MAX_FAILED_LOGINS:
        locked_until = _to_text(_now() + timedelta(minutes=LOCKOUT_MINUTES))
        conn.execute(
            "UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?",
            (attempts, locked_until, user_id),
        )
        return True

    conn.execute(
        "UPDATE users SET failed_login_attempts = ? WHERE id = ?", (attempts, user_id)
    )
    return False


def clear_failed_logins(conn: sqlite3.Connection, user_id: int) -> None:
    """Reset the failure counter after a successful authentication."""
    conn.execute(
        """
        UPDATE users
           SET failed_login_attempts = 0, locked_until = NULL, last_login_at = ?
         WHERE id = ?
        """,
        (_to_text(_now()), user_id),
    )


# ---------------------------------------------------------------------------
# Refresh tokens
# ---------------------------------------------------------------------------

def issue_refresh_token(
    conn: sqlite3.Connection,
    user_id: int,
    *,
    family_id: str | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[str, datetime]:
    """Create a refresh token and store only its hash.

    Passing an existing `family_id` marks the new token as a rotation of that
    family; omitting it starts a new family, which is what a fresh login does.
    """
    token = generate_refresh_token()
    expires_at = _now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    conn.execute(
        """
        INSERT INTO refresh_tokens
            (user_id, token_hash, family_id, issued_at, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            hash_refresh_token(token),
            family_id or new_family_id(),
            _to_text(_now()),
            _to_text(expires_at),
            ip_address,
            (user_agent or "")[:400] or None,
        ),
    )
    return token, expires_at


def revoke_family(conn: sqlite3.Connection, family_id: str) -> int:
    """Revoke every unrevoked token in a rotation family."""
    cursor = conn.execute(
        "UPDATE refresh_tokens SET revoked_at = ? WHERE family_id = ? AND revoked_at IS NULL",
        (_to_text(_now()), family_id),
    )
    return cursor.rowcount


def revoke_all_for_user(conn: sqlite3.Connection, user_id: int) -> int:
    """Revoke every session belonging to a user."""
    cursor = conn.execute(
        "UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL",
        (_to_text(_now()), user_id),
    )
    return cursor.rowcount


class RefreshOutcome:
    """Result of presenting a refresh token."""

    def __init__(
        self,
        *,
        status: str,
        user_id: int | None = None,
        family_id: str | None = None,
    ) -> None:
        self.status = status  # "ok" | "unknown" | "expired" | "revoked" | "reused"
        self.user_id = user_id
        self.family_id = family_id

    @property
    def ok(self) -> bool:
        return self.status == "ok"


def consume_refresh_token(conn: sqlite3.Connection, token: str) -> RefreshOutcome:
    """Validate a refresh token and mark it used.

    A token that has already been used is the important case. The legitimate
    client rotates its token away and never presents the old one again, so a
    second presentation means the token was captured. Because we cannot tell
    the attacker's copy from the victim's, the entire family is revoked and
    both parties are forced to sign in again.
    """
    row = conn.execute(
        """
        SELECT id, user_id, family_id, expires_at, revoked_at, used_at
          FROM refresh_tokens
         WHERE token_hash = ?
        """,
        (hash_refresh_token(token),),
    ).fetchone()

    if row is None:
        return RefreshOutcome(status="unknown")

    family_id = row["family_id"]

    if row["used_at"] is not None:
        revoked = revoke_family(conn, family_id)
        logger.warning(
            "Refresh token reuse detected for user %s; revoked %d token(s) in family %s",
            row["user_id"], revoked, family_id,
        )
        return RefreshOutcome(status="reused", user_id=row["user_id"], family_id=family_id)

    if row["revoked_at"] is not None:
        return RefreshOutcome(status="revoked", user_id=row["user_id"], family_id=family_id)

    expires_at = _from_text(row["expires_at"])
    if expires_at is None or expires_at <= _now():
        return RefreshOutcome(status="expired", user_id=row["user_id"], family_id=family_id)

    conn.execute(
        "UPDATE refresh_tokens SET used_at = ? WHERE id = ?",
        (_to_text(_now()), row["id"]),
    )
    return RefreshOutcome(status="ok", user_id=row["user_id"], family_id=family_id)


def revoke_token(conn: sqlite3.Connection, token: str) -> bool:
    """Revoke a single refresh token. Returns False if it was not found."""
    cursor = conn.execute(
        "UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL",
        (_to_text(_now()), hash_refresh_token(token)),
    )
    return cursor.rowcount > 0


def revoke_session_by_id(conn: sqlite3.Connection, user_id: int, session_id: int) -> bool:
    """Revoke one session by its row id, scoped to its owner.

    The `user_id` filter is what stops one account from revoking another's
    session by guessing ids — this is called with the id of the
    authenticated caller, never a caller-supplied user id.
    """
    cursor = conn.execute(
        """
        UPDATE refresh_tokens
           SET revoked_at = ?
         WHERE id = ? AND user_id = ? AND revoked_at IS NULL
        """,
        (_to_text(_now()), session_id, user_id),
    )
    return cursor.rowcount > 0


def list_sessions(conn: sqlite3.Connection, user_id: int, current_token: str | None) -> list[dict]:
    """Active sessions for a user, newest first."""
    current_hash = hash_refresh_token(current_token) if current_token else None
    rows = conn.execute(
        """
        SELECT id, token_hash, issued_at, expires_at, ip_address, user_agent
          FROM refresh_tokens
         WHERE user_id = ? AND revoked_at IS NULL AND used_at IS NULL
      ORDER BY issued_at DESC
        """,
        (user_id,),
    ).fetchall()

    return [
        {
            "id": row["id"],
            "issued_at": row["issued_at"],
            "expires_at": row["expires_at"],
            "ip_address": row["ip_address"],
            "user_agent": row["user_agent"],
            "current": row["token_hash"] == current_hash,
        }
        for row in rows
    ]


def purge_expired_tokens(conn: sqlite3.Connection) -> int:
    """Delete refresh tokens that expired more than a day ago."""
    cutoff = _to_text(_now() - timedelta(days=1))
    cursor = conn.execute("DELETE FROM refresh_tokens WHERE expires_at < ?", (cutoff,))
    return cursor.rowcount


# ---------------------------------------------------------------------------
# Password reset tokens
# ---------------------------------------------------------------------------
# Same opaque-token-hashed-at-rest mechanics as refresh tokens (reusing
# `generate_refresh_token`/`hash_refresh_token`, which are generic — nothing
# about them is specific to refresh tokens), but a short expiry and a
# separate table: a reset token authorises exactly one action and does not
# belong mixed in with session tokens.

def issue_reset_token(
    conn: sqlite3.Connection, user_id: int, *, ip_address: str | None = None
) -> tuple[str, datetime]:
    """Create a password reset token and store only its hash."""
    token = generate_refresh_token()
    expires_at = _now() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

    conn.execute(
        """
        INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, ip_address)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, hash_refresh_token(token), _to_text(expires_at), ip_address),
    )
    return token, expires_at


def consume_reset_token(conn: sqlite3.Connection, token: str) -> int | None:
    """Validate a reset token and mark it used. Returns the user id, or None.

    A used or expired token is rejected the same way an unknown one is — the
    caller cannot tell which case it was, which is what keeps a leaked or
    guessed token from being usable twice.
    """
    row = conn.execute(
        "SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token_hash = ?",
        (hash_refresh_token(token),),
    ).fetchone()

    if row is None or row["used_at"] is not None:
        return None

    expires_at = _from_text(row["expires_at"])
    if expires_at is None or expires_at <= _now():
        return None

    conn.execute(
        "UPDATE password_reset_tokens SET used_at = ? WHERE id = ?",
        (_to_text(_now()), row["id"]),
    )
    return row["user_id"]


def _get(row: sqlite3.Row, key: str):
    """Read a column that may not exist on an un-migrated row."""
    try:
        return row[key]
    except (IndexError, KeyError):
        return None
