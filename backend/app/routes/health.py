"""Health check endpoint."""

import logging

from fastapi import APIRouter, HTTPException, status

from app.database import get_connection

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Health"])


@router.get("/health")
async def health() -> dict[str, str]:
    """Report whether the API and its database are reachable.

    This endpoint is unauthenticated so that orchestrators and load balancers
    can call it, which is also why the failure detail is logged rather than
    returned: a raw SQLite error discloses filesystem paths to anyone probing.
    """
    try:
        with get_connection() as conn:
            conn.execute("SELECT 1").fetchone()
    except Exception as exc:
        logger.error("Health check failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unavailable",
        )
    return {"status": "ok", "database": "connected"}
