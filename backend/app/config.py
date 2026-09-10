"""Application configuration loaded from environment variables.

All deployment-specific values (CORS origins, database path, debug flags)
live here so they never leak into business logic.
"""

import logging
import os
import secrets
from pathlib import Path

# Load a local .env when one is present, so running the app directly behaves the
# same as running it under Docker (which supplies the same values via env_file).
# Real environment variables win: `override=False` means an explicitly exported
# value is never silently replaced by a stale file.
try:
    from dotenv import load_dotenv

    _ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
    if _ENV_FILE.is_file():
        load_dotenv(_ENV_FILE, override=False)
except ImportError:
    # python-dotenv is a development convenience, not a runtime requirement.
    pass

# Database

# PostgreSQL connection string. Override with the DATABASE_URL environment
# variable in every real deployment; the default points at the local
# docker-compose Postgres service so a developer can bring the stack up with no
# extra configuration.
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", "postgresql://difaac:difaac@localhost:5432/difaac"
)

# Server

DEBUG: bool = os.getenv("DIFAAC_DEBUG", "false").lower() in ("1", "true", "yes")

# CORS — allowed frontend origins
# Comma-separated list.  Falls back to the Vite dev-server defaults.

_DEFAULT_ORIGINS = (
    "http://localhost:5173,"
    "http://localhost:5174,"
    "http://localhost:5175,"
    "http://localhost:5176,"
    "http://127.0.0.1:5173,"
    "http://127.0.0.1:5174,"
    "http://127.0.0.1:5175,"
    "http://127.0.0.1:5176,"
    "https://localhost:5173,"
    "https://localhost:5174,"
    "https://localhost:5175,"
    "https://localhost:5176,"
    "https://127.0.0.1:5173,"
    "https://127.0.0.1:5174,"
    "https://127.0.0.1:5175,"
    "https://127.0.0.1:5176"
)

CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv("DIFAAC_CORS_ORIGINS", _DEFAULT_ORIGINS).split(",")
    if origin.strip()
]

# Reverse proxies whose X-Forwarded-For header may be believed
#
# Behind Caddy every connection reaches the backend from Caddy, so without this
# the rate limiter sees one client for the entire internet: the 10-per-minute
# auth budget becomes 10 for everybody combined, and ordinary page traffic
# exhausts the general budget for every visitor at once. The site rate-limits
# itself, and a login flood still cannot be attributed to whoever is sending
# it.
#
# The value is a comma-separated list of addresses or CIDR blocks. Empty by
# default — meaning the header is ignored and the peer address is used — which
# is right for a directly exposed service and is the safe way to be wrong: an
# unset value merges callers together, while a too-wide value would let a
# caller name its own address and escape the limit entirely.
#
# Under docker compose the backend is only reachable on the internal network
# (it is `expose`d, never published), so the compose file trusts that network.
TRUSTED_PROXIES: list[str] = [
    entry.strip()
    for entry in os.getenv("DIFAAC_TRUSTED_PROXIES", "").split(",")
    if entry.strip()
]

# Rate Limiting (requests per minute per client IP)

RATE_LIMIT_RPM: int = int(os.getenv("DIFAAC_RATE_LIMIT_RPM", "120"))

# Authentication endpoints get a far tighter budget. Content reads are cheap and
# repeated; login attempts are neither, and an unbounded rate turns the endpoint
# into a password guessing oracle.
RATE_LIMIT_AUTH_RPM: int = int(os.getenv("DIFAAC_RATE_LIMIT_AUTH_RPM", "10"))

# Ingest is a different shape of traffic: one integration, posting batches, all
# day. The batch size cap bounds what a single request can carry, so the limit
# here is about how often rather than how much.
RATE_LIMIT_INGEST_RPM: int = int(os.getenv("DIFAAC_RATE_LIMIT_INGEST_RPM", "600"))

# Security & JWT Authentication

# JWT signing key. There is deliberately no usable default: a fallback baked
# into source is public the moment the repository is, and anyone holding it can
# mint tokens for any account. Outside DEBUG the process refuses to start
# without DIFAAC_SECRET_KEY set. In DEBUG a random key is generated per run,
# which invalidates tokens on restart — correct for local work, and impossible
# to accidentally ship.
_SECRET_KEY_ENV = os.getenv("DIFAAC_SECRET_KEY", "").strip()

if _SECRET_KEY_ENV:
    if len(_SECRET_KEY_ENV) < 32:
        raise RuntimeError(
            "DIFAAC_SECRET_KEY must be at least 32 characters. "
            "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
        )
    SECRET_KEY: str = _SECRET_KEY_ENV
elif DEBUG:
    SECRET_KEY = secrets.token_urlsafe(48)
    logging.getLogger(__name__).warning(
        "DIFAAC_SECRET_KEY is not set. Using a random key for this DEBUG run; "
        "existing sessions will not survive a restart."
    )
else:
    raise RuntimeError(
        "DIFAAC_SECRET_KEY environment variable is required when DIFAAC_DEBUG is off. "
        "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
    )

ALGORITHM: str = "HS256"

# Access tokens are bearer credentials that cannot be revoked before they
# expire, so they are kept short-lived. Continuity comes from the refresh
# token, which lives in the database and can be revoked instantly.
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("DIFAAC_ACCESS_TOKEN_EXPIRE_MINUTES", "15"))

# Refresh token lifetime. Rotated on every use, so this is the maximum idle
# period before a user must sign in again, not a fixed session length.
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("DIFAAC_REFRESH_TOKEN_EXPIRE_DAYS", "30"))

# Password reset links are short-lived: the whole point is that a link
# intercepted after the legitimate window has closed is useless.
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv("DIFAAC_PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", "30")
)

# Where the frontend is served, for building links that go in outbound
# messages (currently just the password reset link). Falls back to the Vite
# dev server so local development works without extra configuration.
FRONTEND_URL: str = os.getenv("DIFAAC_FRONTEND_URL", "https://localhost:5173")

# Account lockout
# IP rate limiting does not protect a single targeted account against an
# attacker with many source addresses, so failures are also counted per account.

MAX_FAILED_LOGINS: int = int(os.getenv("DIFAAC_MAX_FAILED_LOGINS", "8"))
LOCKOUT_MINUTES: int = int(os.getenv("DIFAAC_LOCKOUT_MINUTES", "15"))

# Cookies
# The refresh token is delivered as an HttpOnly cookie so JavaScript — and
# therefore any XSS on the page — cannot read it. `Secure` is dropped only in
# DEBUG, where local dev may be served over plain HTTP.

COOKIE_SECURE: bool = not DEBUG
COOKIE_SAMESITE: str = os.getenv("DIFAAC_COOKIE_SAMESITE", "lax")
REFRESH_COOKIE_NAME: str = "difaac_refresh"

# Outbound email (SMTP)
#
# The password reset link is the one message this service sends. Without these
# it cannot be sent at all, and the endpoint says so rather than claiming a
# delivery it did not make — see app/routes/auth.py.
#
# Any provider that speaks SMTP works: a relay on the VPS, Gmail, SES,
# Postmark, Resend. Port 465 means implicit TLS and the STARTTLS flag is
# ignored; 587 means STARTTLS, which is the usual choice.
SMTP_HOST: str = os.getenv("DIFAAC_SMTP_HOST", "").strip()
SMTP_PORT: int = int(os.getenv("DIFAAC_SMTP_PORT", "587"))
SMTP_USERNAME: str = os.getenv("DIFAAC_SMTP_USERNAME", "").strip()
SMTP_PASSWORD: str = os.getenv("DIFAAC_SMTP_PASSWORD", "")
SMTP_STARTTLS: bool = os.getenv("DIFAAC_SMTP_STARTTLS", "true").lower() in ("1", "true", "yes")

# The envelope sender. Must be an address the relay is willing to send as, or
# the message is refused or silently filed as spam.
SMTP_FROM: str = os.getenv("DIFAAC_SMTP_FROM", "").strip()

# Kept short. A slow relay must not hold a request open; a reset that fails
# fast and says so is better than one that hangs.
SMTP_TIMEOUT_SECONDS: int = int(os.getenv("DIFAAC_SMTP_TIMEOUT_SECONDS", "10"))

# Error tracking
# Unset by default, which leaves Sentry fully inert — sentry_sdk.init() is
# only called when a DSN is present (see main.py). Nothing is sent anywhere
# until an operator opts in by setting this.

SENTRY_DSN: str = os.getenv("DIFAAC_SENTRY_DSN", "").strip()

# Whether to fill empty workspace tables with demonstration data.
#
# Defaults to on in DEBUG and off everywhere else, which is the safe way round:
# a production deployment that forgets to set this shows a customer an empty
# console, while the reverse would show them fabricated alerts about threat
# actors that were never seen anywhere near their estate.
SEED_DEMO_DATA: bool = os.getenv(
    "DIFAAC_SEED_DEMO", "true" if DEBUG else "false"
).lower() in ("1", "true", "yes")

