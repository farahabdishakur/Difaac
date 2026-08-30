"""Blog API endpoints."""

from fastapi import APIRouter

from app.database import get_connection
from app.models import BlogPostResponse

router = APIRouter(prefix="/blog", tags=["Blog"])


def _row_to_blog_post(row) -> dict:
    return {
        "slug": row["slug"],
        "title": row["title"],
        "excerpt": row["excerpt"],
        "date": row["date"],
        "category": row["category"],
    }


@router.get("", response_model=list[BlogPostResponse])
async def list_blog_posts():
    """Get all blog posts ordered by sort_order."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM blog_posts ORDER BY sort_order").fetchall()
        return [_row_to_blog_post(r) for r in rows]
