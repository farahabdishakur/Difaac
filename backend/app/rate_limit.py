"""In-process rate limiting.

Two limits are applied: a general per-IP budget across the API, and a much
tighter budget on authentication endpoints, where an unbounded request rate is
an offline-speed password guessing oracle.

State lives in process memory, which is the right trade-off for a single-process
deployment and the SQLite database this service already uses. Behind multiple
workers each process keeps its own counters, so the effective limit multiplies by
the worker count — move to a shared store (Redis) before scaling out.
"""

from __future__ import annotations

import logging
import time
from collections import defaultdict, deque

from fastapi import Request
from fastapi.responses import JSONResponse

from app.config import RATE_LIMIT_AUTH_RPM, RATE_LIMIT_RPM

logger = logging.getLogger(__name__)

_WINDOW_SECONDS = 60.0

# client key -> timestamps of requests inside the current window
_hits: dict[str, deque[float]] = defaultdict(deque)

# Paths that need the tighter budget.
#
# The auth endpoints are here because guessing is the threat. `/demo-requests`
# is here for a different reason: it is the one endpoint an unauthenticated
# caller can use to *write* a row, so the same low ceiling is what stops the
# table being flooded. A human filling in a form never approaches it.
# Endpoints that verify a credential, or that an unauthenticated caller can
# write through. These get the strict per-minute budget rather than the
# general one.
#
# `change-password` belongs here for the same reason `login` does: it checks
# the caller's *current* password, so a hijacked session could otherwise be
# used to guess it at the general rate. Refresh is deliberately absent — its
# token is 256 bits of entropy, not something a rate limit meaningfully
# protects.
_AUTH_PATHS = (
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/change-password",
    "/demo-requests",
)

# Never let the bookkeeping itself become the memory leak.
_MAX_TRACKED_CLIENTS = 10_000


def _client_key(request: Request) -> str:
    """Identify the caller.

    `request.client.host` is the peer address. Behind a reverse proxy every peer
    is the proxy, so a forwarded header would be needed to tell callers apart —
    but only when the proxy is trusted, since clients can set that header
    themselves. Until a trusted proxy is configured, the peer address is the
    only value that cannot be spoofed.
    """
    return request.client.host if request.client else "unknown"


def _prune(timestamps: deque[float], now: float) -> None:
    cutoff = now - _WINDOW_SECONDS
    while timestamps and timestamps[0] < cutoff:
        timestamps.popleft()


def _limit_for(path: str) -> int:
    return RATE_LIMIT_AUTH_RPM if path in _AUTH_PATHS else RATE_LIMIT_RPM


async def rate_limit_middleware(request: Request, call_next):
    """Reject callers that exceed their per-minute budget with HTTP 429."""
    path = request.url.path

    # Preflight carries no credentials and must not consume budget, or a busy
    # page can rate-limit itself before a single real request is sent.
    if request.method == "OPTIONS":
        return await call_next(request)

    now = time.monotonic()
    limit = _limit_for(path)

    # Auth attempts are counted in their own bucket so a burst of ordinary page
    # traffic cannot exhaust the (much smaller) login budget, and vice versa.
    bucket = "auth" if path in _AUTH_PATHS else "api"
    key = f"{bucket}:{_client_key(request)}"

    timestamps = _hits[key]
    _prune(timestamps, now)

    if len(timestamps) >= limit:
        retry_after = max(1, int(_WINDOW_SECONDS - (now - timestamps[0])))
        logger.warning("Rate limit exceeded for %s on %s", key, path)
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down and try again shortly."},
            headers={"Retry-After": str(retry_after)},
        )

    timestamps.append(now)

    if len(_hits) > _MAX_TRACKED_CLIENTS:
        _evict_idle(now)

    return await call_next(request)


def _evict_idle(now: float) -> None:
    """Drop clients with no requests left inside the window."""
    for key in [k for k, v in _hits.items() if not v or v[-1] < now - _WINDOW_SECONDS]:
        del _hits[key]


def reset() -> None:
    """Clear all counters. Intended for tests."""
    _hits.clear()
