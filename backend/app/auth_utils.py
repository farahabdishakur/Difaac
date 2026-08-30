"""Security primitives for password hashing and token handling.

Passwords are hashed with bcrypt. Access tokens are short-lived signed JWTs.
Refresh tokens are opaque random strings stored only as SHA-256 hashes, so a
copy of the database yields no usable credentials.
"""

from __future__ import annotations

import hashlib
import logging
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.config import ALGORITHM, SECRET_KEY

logger = logging.getLogger(__name__)

# bcrypt silently truncates at 72 bytes. Rejecting longer input is clearer than
# letting two different passwords authenticate the same account.
_BCRYPT_MAX_BYTES = 72

# Verified against a real hash when the account does not exist, so that a
# missing account costs the same time as a wrong password. Without this,
# response timing tells an attacker which addresses are registered.
_DUMMY_HASH = bcrypt.hashpw(b"difaac-timing-equaliser", bcrypt.gensalt()).decode()


# ---------------------------------------------------------------------------
# Passwords
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    """Hash a password with bcrypt and a freshly generated salt."""
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > _BCRYPT_MAX_BYTES:
        raise ValueError("Password exceeds the maximum supported length")
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:_BCRYPT_MAX_BYTES],
            hashed_password.encode("utf-8"),
        )
    except (ValueError, TypeError) as exc:
        # A malformed stored hash must fail closed, and must not look different
        # from a wrong password to the caller.
        logger.error("Password verification failed against a malformed hash: %s", exc)
        return False


def waste_password_comparison() -> None:
    """Burn one bcrypt verification against a dummy hash.

    Called on the no-such-account path so that login timing does not reveal
    whether an email address is registered.
    """
    verify_password("difaac-timing-equaliser", _DUMMY_HASH)


# ---------------------------------------------------------------------------
# Access tokens (signed, short-lived, not revocable)
# ---------------------------------------------------------------------------

def create_access_token(
    subject: str,
    role: str,
    expires_delta: timedelta,
) -> str:
    """Mint a signed access token for `subject`.

    Carries `typ: "access"` so a refresh token can never be replayed as an
    access token, and a random `jti` so individual tokens are identifiable in
    logs without exposing the token itself.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": role,
        "typ": "access",
        "iat": now,
        "exp": now + expires_delta,
        "jti": uuid.uuid4().hex,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decode and validate an access token, or return None if unusable."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        logger.info("Access token rejected: expired")
        return None
    except jwt.InvalidTokenError as exc:
        logger.warning("Access token rejected: %s", exc)
        return None

    if payload.get("typ") != "access":
        logger.warning("Access token rejected: wrong token type %r", payload.get("typ"))
        return None

    return payload


# ---------------------------------------------------------------------------
# Refresh tokens (opaque, stored hashed, revocable)
# ---------------------------------------------------------------------------

def generate_refresh_token() -> str:
    """Return a new opaque refresh token with 256 bits of entropy."""
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
    """Hash a refresh token for storage and lookup.

    SHA-256 rather than bcrypt: the token is already high-entropy random, so
    there is nothing to brute force, and refresh happens often enough that a
    deliberately slow hash would be a needless cost.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def new_family_id() -> str:
    """Return an identifier grouping a refresh token with its rotations."""
    return uuid.uuid4().hex
