"""Service credentials, for applications rather than people.

A person signs in and holds a token for fifteen minutes. An application cannot:
it has nobody to type a password, nowhere safe to keep one, and no way to
answer a lockout. So an integration authenticates with a key it was issued
once and can present forever, until somebody revokes it.

The shape is `dfc_<prefix>_<secret>`. The prefix is stored in the clear and is
what the lookup is done on; the secret is 256 bits of randomness and only its
SHA-256 is stored. A leaked database therefore yields no usable key.

SHA-256 and not bcrypt, deliberately. A password is short, human-chosen and
worth grinding, which is what a slow KDF exists to prevent. A key is random
and full-entropy — there is nothing to grind — and hashing it slowly would only
add that cost to every request an integration makes, which for an event stream
is every event.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timezone
from typing import Any

KEY_PREFIX = "dfc"
PREFIX_BYTES = 6
SECRET_BYTES = 32


def generate() -> tuple[str, str, str]:
    """A new key: the full string to hand over, its prefix, and its hash.

    The full string is returned once and never stored. If it is lost the key is
    gone, and the answer is to issue another — which is the same answer as for
    a key that might have leaked, so nothing is lost by not being able to
    recover it.
    """
    prefix = secrets.token_hex(PREFIX_BYTES)
    secret = secrets.token_urlsafe(SECRET_BYTES)
    full = f"{KEY_PREFIX}_{prefix}_{secret}"
    return full, prefix, _hash(secret)


def _hash(secret: str) -> str:
    return hashlib.sha256(secret.encode("utf-8")).hexdigest()


def split(presented: str) -> tuple[str, str] | None:
    """Break a presented key into (prefix, secret), or None if malformed."""
    parts = presented.strip().split("_", 2)
    if len(parts) != 3 or parts[0] != KEY_PREFIX or not parts[1] or not parts[2]:
        return None
    return parts[1], parts[2]


def verify(secret: str, stored_hash: str) -> bool:
    """Compare in constant time, so the comparison cannot be timed."""
    return hmac.compare_digest(_hash(secret), stored_hash)


def resolve(conn: Any, presented: str) -> dict | None:
    """The tenant and key behind a presented credential, or None.

    Returns None for every kind of failure — malformed, unknown, revoked, or
    belonging to a disabled tenant — so a caller cannot tell which of those it
    hit and probe the difference.
    """
    parts = split(presented)
    if parts is None:
        return None
    prefix, secret = parts

    row = conn.execute(
        """
        SELECT k.id, k.tenant_id, k.name, k.key_hash, k.revoked_at, t.is_active
          FROM api_keys k
          JOIN tenants t ON t.id = k.tenant_id
         WHERE k.prefix = %s
        """,
        (prefix,),
    ).fetchone()

    if not row or row["revoked_at"] is not None or not row["is_active"]:
        return None
    if not verify(secret, row["key_hash"]):
        return None

    return {"id": row["id"], "tenant_id": row["tenant_id"], "name": row["name"]}


def touch(conn: Any, key_id: int) -> None:
    """Record that a key was used.

    Written on every accepted request, which is what makes an unused key
    visible: a key nobody has presented for months is one nobody would miss.
    """
    conn.execute(
        "UPDATE api_keys SET last_used_at = %s WHERE id = %s",
        (datetime.now(timezone.utc), key_id),
    )
