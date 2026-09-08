"""Write frontend/public/sitemap.xml from the routes and the database.

A sitemap typed by hand is wrong within a month: a product is added, a
solution is renamed, and the file still lists what was true when someone
last remembered it. This reads the static routes from the list below and the
slugs from the same tables the site renders from, so the two cannot disagree.

    python scripts/generate_sitemap.py            # uses DATABASE_URL
    python scripts/generate_sitemap.py --base https://staging.difaac.com

Run it before a deploy, and commit the result.
"""

from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "backend"))

import psycopg
from psycopg.rows import dict_row

from app.config import DATABASE_URL

# Pages that are not behind sign-in and are worth a crawler's time. The
# workspace, the sign-in form and the password flows are deliberately absent —
# they render nothing without a session and robots.txt disallows them.
STATIC = [
    ("/", 1.0, "weekly"),
    ("/products", 0.9, "weekly"),
    ("/solutions", 0.9, "weekly"),
    ("/services", 0.9, "weekly"),
    ("/industries", 0.8, "monthly"),
    ("/pricing", 0.8, "monthly"),
    ("/resources", 0.8, "weekly"),
    ("/company", 0.7, "monthly"),
    ("/company/team", 0.6, "monthly"),
    ("/company/careers", 0.6, "weekly"),
    ("/company/partners", 0.5, "monthly"),
    ("/company/contact", 0.6, "monthly"),
    ("/privacy", 0.3, "yearly"),
    ("/terms", 0.3, "yearly"),
]

# Each collection and the prefix its detail pages are served under.
COLLECTIONS = [
    ("products", "/products", 0.8),
    ("solutions", "/solutions", 0.8),
    ("services", "/services", 0.8),
    ("industries", "/industries", 0.7),
    ("resources", "/resources", 0.6),
]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", default="https://difaac.com",
                        help="site origin, without a trailing slash")
    parser.add_argument("--out", default=str(REPO / "frontend" / "public" / "sitemap.xml"))
    args = parser.parse_args()
    base = args.base.rstrip("/")

    urls: list[tuple[str, float, str]] = list(STATIC)

    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        for table, prefix, priority in COLLECTIONS:
            rows = conn.execute(
                f"SELECT slug FROM {table} WHERE slug IS NOT NULL ORDER BY slug"
            ).fetchall()
            urls += [(f"{prefix}/{r['slug']}", priority, "monthly") for r in rows]
            print(f"  {table:<12} {len(rows):>3} pages")

    today = date.today().isoformat()
    body = "\n".join(
        "  <url>\n"
        f"    <loc>{escape(base + path)}</loc>\n"
        f"    <lastmod>{today}</lastmod>\n"
        f"    <changefreq>{freq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
        for path, priority, freq in urls
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{body}\n"
        "</urlset>\n"
    )
    Path(args.out).write_text(xml, encoding="utf-8")
    print(f"\n{len(urls)} URLs written to {args.out}")


if __name__ == "__main__":
    main()
