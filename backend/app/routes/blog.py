"""Blog API endpoints."""

from fastapi import APIRouter

from app.database import get_connection
from app.models import BlogPostResponse

# Served under /api. The site is a single-page app on the same origin, so
# "/{name}" is the page a browser navigates to; the JSON has to live
# somewhere the reverse proxy actually forwards, and that is /api.
router = APIRouter(prefix="/api/blog", tags=["Blog"])


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
