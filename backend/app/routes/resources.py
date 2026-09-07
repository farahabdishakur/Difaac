"""Resources API endpoints."""

from fastapi import APIRouter, HTTPException, Path

from app.database import get_connection
from app.models import ResourceResponse

router = APIRouter(prefix="/resources", tags=["Resources"])


def _row_to_resource(row) -> dict:
    return {
        "slug": row["slug"],
        "title": row["title"],
        "type": row["type"],
        "excerpt": row["excerpt"],
        "isNew": bool(row["is_new"]),
    }


@router.get("", response_model=list[ResourceResponse])
async def list_resources():
    """Get all resources ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM resources ORDER BY sort_order").fetchall()
        return [_row_to_resource(r) for r in rows]


@router.get("/{slug}", response_model=ResourceResponse)
async def get_resource(
    slug: str = Path(..., pattern=r"^[a-z0-9-]+$", description="The resource slug")
):
    """Get a single resource by its slug."""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM resources WHERE slug = %s", (slug,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Resource not found")
        return _row_to_resource(row)
