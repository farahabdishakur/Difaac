"""Site content API endpoints."""

import json

from fastapi import APIRouter

from app.database import get_connection

router = APIRouter(prefix="/site-content", tags=["Site Content"])


@router.get("")
async def get_site_content() -> dict:
    """Get miscellaneous site content used across the frontend."""
    with get_connection() as conn:
        rows = conn.execute("SELECT key, value_json FROM site_content").fetchall()
        return {row["key"]: json.loads(row["value_json"]) for row in rows}
