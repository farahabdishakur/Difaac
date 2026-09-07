"""Solutions API endpoints."""

import json

from fastapi import APIRouter, HTTPException, Path

from app.database import get_connection
from app.models import SolutionResponse

router = APIRouter(prefix="/solutions", tags=["Solutions"])


def _row_to_solution(row) -> dict:
    return {
        "slug": row["slug"],
        "name": row["name"],
        "group": row["grp"],
        "tagline": row["tagline"],
        "description": row["description"],
        "icon": row["icon"],
        "highlights": json.loads(row["highlights_json"]) if row["highlights_json"] else None,
    }


@router.get("", response_model=list[SolutionResponse])
async def list_solutions():
    """Get all solutions ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM solutions ORDER BY sort_order").fetchall()
        return [_row_to_solution(r) for r in rows]


@router.get("/{slug}", response_model=SolutionResponse)
async def get_solution(
    slug: str = Path(..., pattern=r"^[a-z0-9-]+$", description="The solution slug")
):
    """Get a single solution by its slug."""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM solutions WHERE slug = %s", (slug,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Solution not found")
        return _row_to_solution(row)
