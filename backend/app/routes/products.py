"""Products API endpoints."""

import json

from fastapi import APIRouter, HTTPException, Path

from app.database import get_connection
from app.models import ProductResponse

# Served under /api. The site is a single-page app on the same origin, so
# "/{name}" is the page a browser navigates to; the JSON has to live
# somewhere the reverse proxy actually forwards, and that is /api.
router = APIRouter(prefix="/api/products", tags=["Products"])


def _row_to_product(row) -> dict:
    return {
        "slug": row["slug"],
        "name": row["name"],
        "tagline": row["tagline"],
        "description": row["description"],
        "icon": row["icon"],
        "bullets": json.loads(row["bullets_json"]),
        "capabilities": json.loads(row["capabilities_json"]),
    }


@router.get("", response_model=list[ProductResponse])
async def list_products():
    """Get all products ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM products ORDER BY sort_order").fetchall()
        return [_row_to_product(r) for r in rows]


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(
    slug: str = Path(..., pattern=r"^[a-z0-9-]+$", description="The product slug")
):
    """Get a single product by its slug."""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM products WHERE slug = %s", (slug,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return _row_to_product(row)
