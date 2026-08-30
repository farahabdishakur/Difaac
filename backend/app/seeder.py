"""Database seeder — inserts all initial data into a fresh database.

Called once by ``init_db()`` when the products table is empty.
Each entity is inserted in a single batch for clarity and speed.
"""

import json
import logging
import os
import secrets
import sqlite3

from app.seed_data.products import PRODUCTS
from app.seed_data.industries import INDUSTRIES
from app.seed_data.solutions import SOLUTIONS
from app.seed_data.services import SERVICES
from app.seed_data.resources import RESOURCES
from app.seed_data.blog_posts import BLOG_POSTS
from app.seed_data.testimonials import TESTIMONIALS
from app.seed_data.site_content import SITE_CONTENT
from app.auth_utils import hash_password

logger = logging.getLogger(__name__)


def seed_all(conn: sqlite3.Connection) -> None:
    """Insert every seed dataset into the database.

    The caller is responsible for calling ``conn.commit()`` after this
    function returns so the entire seed is committed atomically.
    """
    _seed_products(conn)
    _seed_industries(conn)
    _seed_solutions(conn)
    _seed_services(conn)
    _seed_resources(conn)
    _seed_blog_posts(conn)
    _seed_testimonials(conn)
    _seed_site_content(conn)
    _seed_users(conn)


# ---------------------------------------------------------------------------
# Private helpers — one per table
# ---------------------------------------------------------------------------

def _seed_products(conn: sqlite3.Connection) -> None:
    for i, p in enumerate(PRODUCTS):
        conn.execute(
            "INSERT INTO products"
            " (slug, name, tagline, description, icon,"
            "  bullets_json, capabilities_json, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                p["slug"],
                p["name"],
                p["tagline"],
                p["description"],
                p["icon"],
                json.dumps(p["bullets"]),
                json.dumps(p["capabilities"]),
                i,
            ),
        )
    logger.info("  Seeded %d products.", len(PRODUCTS))


def _seed_industries(conn: sqlite3.Connection) -> None:
    for i, ind in enumerate(INDUSTRIES):
        conn.execute(
            "INSERT INTO industries"
            " (slug, name, tagline, description, icon, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                ind["slug"],
                ind["name"],
                ind["tagline"],
                ind["description"],
                ind["icon"],
                i,
            ),
        )
    logger.info("  Seeded %d industries.", len(INDUSTRIES))


def _seed_solutions(conn: sqlite3.Connection) -> None:
    for i, s in enumerate(SOLUTIONS):
        highlights = s["highlights"]
        conn.execute(
            "INSERT INTO solutions"
            " (slug, name, grp, tagline, description, icon,"
            "  highlights_json, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                s["slug"],
                s["name"],
                s["group"],
                s["tagline"],
                s["description"],
                s["icon"],
                json.dumps(highlights) if highlights else None,
                i,
            ),
        )
    logger.info("  Seeded %d solutions.", len(SOLUTIONS))


def _seed_services(conn: sqlite3.Connection) -> None:
    for i, s in enumerate(SERVICES):
        conn.execute(
            "INSERT INTO services"
            " (slug, name, grp, tagline, description, icon, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                s["slug"],
                s["name"],
                s["group"],
                s["tagline"],
                s["description"],
                s["icon"],
                i,
            ),
        )
    logger.info("  Seeded %d services.", len(SERVICES))


def _seed_resources(conn: sqlite3.Connection) -> None:
    for i, r in enumerate(RESOURCES):
        conn.execute(
            "INSERT INTO resources"
            " (slug, title, type, excerpt, is_new, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                r["slug"],
                r["title"],
                r["type"],
                r["excerpt"],
                1 if r["isNew"] else 0,
                i,
            ),
        )
    logger.info("  Seeded %d resources.", len(RESOURCES))


def _seed_blog_posts(conn: sqlite3.Connection) -> None:
    for i, b in enumerate(BLOG_POSTS):
        conn.execute(
            "INSERT INTO blog_posts"
            " (slug, title, excerpt, date, category, sort_order)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (
                b["slug"],
                b["title"],
                b["excerpt"],
                b["date"],
                b["category"],
                i,
            ),
        )
    logger.info("  Seeded %d blog posts.", len(BLOG_POSTS))


def _seed_testimonials(conn: sqlite3.Connection) -> None:
    for i, t in enumerate(TESTIMONIALS):
        conn.execute(
            "INSERT INTO testimonials"
            " (quote, name, title, company, sort_order)"
            " VALUES (?, ?, ?, ?, ?)",
            (
                t["quote"],
                t["name"],
                t["title"],
                t["company"],
                i,
            ),
        )
    logger.info("  Seeded %d testimonials.", len(TESTIMONIALS))


def _seed_site_content(conn: sqlite3.Connection) -> None:
    for key, value in SITE_CONTENT.items():
        conn.execute(
            "INSERT INTO site_content (key, value_json) VALUES (?, ?)",
            (key, json.dumps(value)),
        )
    logger.info("  Seeded %d site content entries.", len(SITE_CONTENT))


def _seed_users(conn: sqlite3.Connection) -> None:
    """Create the initial account on an empty database.

    The password is taken from DIFAAC_SEED_PASSWORD, or generated randomly when
    that is unset. It is never hardcoded: a fixed password in source is a known
    credential for every deployment that ever runs this seeder.

    A generated password is printed once, and only once, because there is
    nowhere else to recover it from. That single line is the reason to rotate it
    after first sign-in.
    """
    analyst_email = os.getenv("DIFAAC_SEED_EMAIL", "analyst@difaac.io").strip().lower()

    supplied = os.getenv("DIFAAC_SEED_PASSWORD", "").strip()
    password = supplied or secrets.token_urlsafe(18)

    conn.execute(
        "INSERT INTO users (email, hashed_password, full_name, role, password_changed_at)"
        " VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
        (analyst_email, hash_password(password), "Difaac Security Analyst", "analyst"),
    )

    if supplied:
        # Never echo a password the operator already holds.
        logger.info("  Seeded initial user %s using DIFAAC_SEED_PASSWORD.", analyst_email)
    else:
        logger.warning(
            "\n"
            "  ------------------------------------------------------------\n"
            "  Initial account created. This password is shown once:\n"
            "      email:    %s\n"
            "      password: %s\n"
            "  Sign in and change it. It cannot be recovered from here.\n"
            "  ------------------------------------------------------------",
            analyst_email,
            password,
        )

