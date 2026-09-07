"""Demo requests submitted from the product marketing pages.

Two endpoints with deliberately opposite exposure:

  * ``POST /demo-requests`` is public — a prospective customer has no
    account yet, so requiring one would defeat the purpose. It is therefore
    treated as hostile input: every field is bounded by the Pydantic model,
    and the path is rate limited alongside the authentication endpoints so
    the form cannot be used to flood the table.

  * ``GET /api/demo-requests`` is authenticated. The submissions contain
    named individuals at named companies, which is exactly the sort of list
    that must not be readable by an anonymous caller.
"""

from __future__ import annotations

import logging
import psycopg

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from app.database import get_connection
from app.models import DemoRequestCreate, DemoRequestResponse, MessageResponse
from app.permissions import Permission
from app.routes.auth import require_permission

logger = logging.getLogger(__name__)

public_router = APIRouter(tags=["Demo Requests"])

# Reading submissions is workspace data, so it sits behind the same
# authentication dependency as the rest of the SOC endpoints.
private_router = APIRouter(
    prefix="/api",
    tags=["Demo Requests"],
    dependencies=[Depends(require_permission(Permission.LEADS_READ))],
)

DEFAULT_LIMIT = 100
MAX_LIMIT = 500


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@public_router.post(
    "/demo-requests", response_model=MessageResponse, status_code=status.HTTP_201_CREATED
)
async def create_demo_request(payload: DemoRequestCreate, request: Request):
    """Record a demo request.

    The response says only that the request was received. It deliberately
    does not echo back what was stored, or confirm whether the product slug
    matched a real product — neither is useful to the sender, and both would
    turn this into a probe.
    """
    try:
        with get_connection() as conn:
            conn.execute(
                """
                INSERT INTO demo_requests
                    (product_slug, name, company, email, role, context, ip_address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    payload.product_slug,
                    payload.name,
                    payload.company,
                    payload.email,
                    payload.role,
                    payload.context,
                    _client_ip(request),
                ),
            )
            conn.commit()
    except psycopg.Error as exc:
        logger.error("Failed to store demo request from %s: %s", payload.email, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Your request could not be submitted. Please try again shortly.",
        )

    logger.info("Demo request recorded for %s (%s)", payload.company, payload.product_slug)
    return {"detail": "Request received. A Difaac specialist will be in touch."}


@private_router.get("/demo-requests", response_model=list[DemoRequestResponse])
def list_demo_requests(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Demo requests, newest first."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, product_slug, name, company, email, role, context, status, created_at
              FROM demo_requests
          ORDER BY created_at DESC, id DESC
             LIMIT %s
            """,
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]
