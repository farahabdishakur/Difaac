"""The way an integrated application reports what happened to it.

A customer's own system — a hospital's patient record application, in the case
this was built for — posts the security-relevant things it sees: sign-ins,
failed sign-ins, privileged actions, and record access. Difaac stores them
against that customer's tenant and shows them in the console beside everything
else it knows.

Two decisions worth stating.

*Batches, and a cap.* An application under attack produces events faster than
one at rest, which is exactly when the ingest path must not become the outage.
Events arrive in batches with a hard limit per request, and the whole batch is
written in one transaction: a partial write would leave a customer's audit
trail with a hole in it and no record that there was one.

*The application's clock is recorded, and so is ours.* `occurred_at` comes from
the caller and `received_at` from us. When they disagree by hours the caller's
clock is wrong or the events were replayed, and an investigator needs to be
able to see that rather than have it averaged away.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app import api_keys
from app.database import get_connection
from app.models import AppEventBatch
from app.tenancy import set_current_tenant

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["ingest"])

MAX_CLOCK_SKEW = timedelta(hours=24)


async def require_api_key(x_api_key: str = Header(default="", alias="X-API-Key")) -> dict:
    """Authenticate an integration and scope the request to its tenant.

    The tenant comes from the key, never from the payload. A caller that could
    name its own tenant would be able to write into somebody else's console,
    and the row-level policy would let it — the policy enforces that a row
    matches the announced tenant, not that the announcement was honest.

    `async` matters here and is not decoration. FastAPI runs a synchronous
    dependency in a worker thread, which is handed a *copy* of the context —
    so the tenant set inside one is discarded before the endpoint runs, and
    every insert is then refused by the policy for having no tenant. The
    session dependency in `auth.py` is async for the same reason.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="An X-API-Key header is required",
        )

    with get_connection() as conn:
        key = api_keys.resolve(conn, x_api_key)
        if key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key"
            )
        api_keys.touch(conn, key["id"])
        conn.commit()

    set_current_tenant(key["tenant_id"])
    return key


@router.post("/ingest/events", status_code=status.HTTP_202_ACCEPTED)
def ingest_events(batch: AppEventBatch, key: dict = Depends(require_api_key)):
    """Accept a batch of application security events.

    202 rather than 201: the events are stored, but Difaac makes no promise
    here about having finished reasoning over them, and a caller should not
    read one into the response.
    """
    now = datetime.now(timezone.utc)
    accepted = 0
    skewed = 0

    with get_connection() as conn:
        for event in batch.events:
            occurred = event.occurred_at
            if occurred.tzinfo is None:
                occurred = occurred.replace(tzinfo=timezone.utc)
            if abs(occurred - now) > MAX_CLOCK_SKEW:
                skewed += 1

            conn.execute(
                """
                INSERT INTO app_events
                    (tenant_id, source, action, outcome, severity, actor,
                     subject_ref, ip_address, user_agent, detail, occurred_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    key["tenant_id"],
                    event.source,
                    event.action,
                    event.outcome,
                    event.severity,
                    event.actor,
                    event.subject_ref,
                    event.ip_address,
                    event.user_agent,
                    event.detail,
                    occurred,
                ),
            )
            accepted += 1
        conn.commit()

    if skewed:
        # Worth saying out loud: a clock adrift by more than a day makes an
        # incident timeline unreadable, and the customer is the only one who
        # can fix it.
        logger.warning(
            "Ingest: %d of %d events from key '%s' are more than %s from now",
            skewed,
            accepted,
            key["name"],
            MAX_CLOCK_SKEW,
        )

    return {"accepted": accepted, "clock_skew_warnings": skewed}
