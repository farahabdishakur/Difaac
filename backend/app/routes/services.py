"""Services API endpoints."""

from fastapi import APIRouter, HTTPException, Path

from app.database import get_connection
from app.models import ServiceResponse

router = APIRouter(prefix="/services", tags=["Services"])


def _row_to_service(row) -> dict:
    return {
        "slug": row["slug"],
        "name": row["name"],
        "group": row["grp"],
        "tagline": row["tagline"],
        "description": row["description"],
        "icon": row["icon"],
    }


@router.get("", response_model=list[ServiceResponse])
async def list_services():
    """Get all services ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM services ORDER BY sort_order").fetchall()
        return [_row_to_service(r) for r in rows]


@router.get("/{slug}", response_model=ServiceResponse)
async def get_service(
    slug: str = Path(..., pattern=r"^[a-z0-9-]+$", description="The service slug")
):
    """Get a single service by its slug."""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM services WHERE slug = ?", (slug,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Service not found")
        return _row_to_service(row)
