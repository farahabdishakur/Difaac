"""Industries API endpoints."""

from fastapi import APIRouter, HTTPException, Path

from app.database import get_connection
from app.models import IndustryResponse

router = APIRouter(prefix="/industries", tags=["Industries"])


def _row_to_industry(row) -> dict:
    return {
        "slug": row["slug"],
        "name": row["name"],
        "tagline": row["tagline"],
        "description": row["description"],
        "icon": row["icon"],
    }


@router.get("", response_model=list[IndustryResponse])
async def list_industries():
    """Get all industries ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM industries ORDER BY sort_order").fetchall()
        return [_row_to_industry(r) for r in rows]


@router.get("/{slug}", response_model=IndustryResponse)
async def get_industry(
    slug: str = Path(..., pattern=r"^[a-z0-9-]+$", description="The industry slug")
):
    """Get a single industry by its slug."""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM industries WHERE slug = %s", (slug,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Industry not found")
        return _row_to_industry(row)
