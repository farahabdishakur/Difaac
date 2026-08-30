"""Testimonials API endpoints."""

from fastapi import APIRouter

from app.database import get_connection
from app.models import TestimonialResponse

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


def _row_to_testimonial(row) -> dict:
    return {
        "quote": row["quote"],
        "name": row["name"],
        "title": row["title"],
        "company": row["company"],
    }


@router.get("", response_model=list[TestimonialResponse])
async def list_testimonials():
    """Get all testimonials ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM testimonials ORDER BY sort_order").fetchall()
        return [_row_to_testimonial(r) for r in rows]
