"""Database seeder — inserts all initial data into a fresh database.

Called once by ``init_db()`` when the products table is empty.
Each entity is inserted in a single batch for clarity and speed.
"""

import json
import logging
import os
import secrets
from typing import Any
from datetime import datetime, timedelta, timezone

from app.seed_data.products import PRODUCTS
from app.seed_data.industries import INDUSTRIES
from app.seed_data.solutions import SOLUTIONS
from app.seed_data.services import SERVICES
from app.seed_data.resources import RESOURCES
from app.seed_data.blog_posts import BLOG_POSTS
from app.seed_data.site_content import SITE_CONTENT
from app.seed_data.workspace import (
    ASM_ASSETS,
    BEP_MESSAGES,
    DRP_ITEMS,
    FRAUD_CASES,
    INCIDENTS,
    TI_ACTORS,
    TI_ALERTS,
    TI_IOCS,
    XDR_DETECTIONS,
)
from app.auth_utils import hash_password

logger = logging.getLogger(__name__)


def seed_all(conn: Any) -> None:
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
    _seed_site_content(conn)
    _seed_users(conn)


def seed_workspace_demo(conn: Any) -> None:
    """Fill empty SOC workspace tables with demonstration data.

    Called on every start rather than only on a fresh database, because these
    tables were introduced after the first seed ran and an existing install
    would otherwise show an empty workspace forever.

    Each table is checked independently and skipped when it already holds
    rows, so this never duplicates data and never overwrites anything real
    that has been collected since.
    """
    _seed_ti_iocs(conn)
    _seed_ti_actors(conn)
    _seed_ti_alerts(conn)
    _seed_fraud_cases(conn)
    _seed_asm_assets(conn)
    _seed_bep_messages(conn)
    _seed_xdr_detections(conn)
    _seed_drp_items(conn)
    _seed_incidents(conn)


def _is_empty(conn: Any, table: str) -> bool:
    return conn.execute(f"SELECT COUNT(*) AS n FROM {table}").fetchone()["n"] == 0


def _hours_ago(hours: int) -> datetime:
    """A timezone-aware moment `hours` in the past.

    Returned as a datetime, not a string: the timestamp columns are
    `timestamptz`, and psycopg adapts a datetime to them directly.
    """
    return datetime.now(timezone.utc) - timedelta(hours=hours)


def _seed_ti_iocs(conn: Any) -> None:
    if not _is_empty(conn, "ti_iocs"):
        return
    conn.executemany(
        "INSERT INTO ti_iocs (value, type, severity, source, created_at)"
        " VALUES (%s, %s, %s, %s, %s)",
        [
            (value, ioc_type, severity, source, _hours_ago(idx * 5 + 1))
            for idx, (value, ioc_type, severity, source) in enumerate(TI_IOCS)
        ],
    )
    conn.commit()
    logger.info("  Seeded %d indicators of compromise.", len(TI_IOCS))


def _seed_ti_actors(conn: Any) -> None:
    if not _is_empty(conn, "ti_actors"):
        return
    conn.executemany(
        "INSERT INTO ti_actors (name, aliases, origin, description)"
        " VALUES (%s, %s, %s, %s)",
        TI_ACTORS,
    )
    conn.commit()
    logger.info("  Seeded %d threat actors.", len(TI_ACTORS))


def _seed_incidents(conn: Any) -> None:
    if not _is_empty(conn, "incidents"):
        return
    conn.executemany(
        "INSERT INTO incidents (title, severity, status, reported_by, created_at)"
        " VALUES (%s, %s, %s, %s, %s)",
        [
            (title, severity, status, reported_by, _hours_ago(idx * 8 + 2))
            for idx, (title, severity, status, reported_by) in enumerate(INCIDENTS)
        ],
    )
    conn.commit()
    logger.info("  Seeded %d incidents.", len(INCIDENTS))


def _seed_ti_alerts(conn: Any) -> None:
    if not _is_empty(conn, "ti_alerts"):
        return
    conn.executemany(
        "INSERT INTO ti_alerts"
        " (title, category, severity, source, actor, is_tailored, detected_at)"
        " VALUES (%s, %s, %s, %s, %s, %s, %s)",
        [
            (title, category, severity, source, actor, bool(tailored), _hours_ago(hours))
            for title, category, severity, source, actor, tailored, hours in TI_ALERTS
        ],
    )
    conn.commit()
    logger.info("  Seeded %d threat intelligence alerts.", len(TI_ALERTS))


def _seed_fraud_cases(conn: Any) -> None:
    """Replace the placeholder fraud rows with cases carrying full context.

    Unlike the other seeds this one also runs when the table is non-empty but
    every row predates the `signal` column, since those rows cannot populate
    the dashboard's breakdown and are demo data themselves.
    """
    unclassified = conn.execute(
        "SELECT COUNT(*) AS n FROM fraud_cases WHERE signal IS NULL"
    ).fetchone()["n"]
    total = conn.execute("SELECT COUNT(*) AS n FROM fraud_cases").fetchone()["n"]

    if total and unclassified != total:
        return
    if total:
        conn.execute("DELETE FROM fraud_cases")

    conn.executemany(
        "INSERT INTO fraud_cases"
        " (session_id, risk_score, status, signal, channel, country, detected_at)"
        " VALUES (%s, %s, %s, %s, %s, %s, %s)",
        [
            (session, score, status, signal, channel, country, _hours_ago(hours))
            for session, score, status, signal, channel, country, hours in FRAUD_CASES
        ],
    )
    conn.commit()
    logger.info("  Seeded %d fraud cases.", len(FRAUD_CASES))


def _seed_asm_assets(conn: Any) -> None:
    if not _is_empty(conn, "asm_assets"):
        return
    conn.executemany(
        "INSERT INTO asm_assets"
        " (host, asset_type, service, port, issue, exposure_score, is_shadow_it, status, discovered_at)"
        " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        [
            (host, kind, service, port, issue, score, bool(shadow), status, _hours_ago(hours))
            for host, kind, service, port, issue, score, shadow, status, hours in ASM_ASSETS
        ],
    )
    conn.commit()
    logger.info("  Seeded %d attack surface assets.", len(ASM_ASSETS))


def _seed_bep_messages(conn: Any) -> None:
    if not _is_empty(conn, "bep_messages"):
        return
    conn.executemany(
        "INSERT INTO bep_messages"
        " (subject, sender, recipient, threat_type, verdict, has_payload, confidence, detected_at)"
        " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        [
            (subject, sender, to, kind, verdict, bool(payload), confidence, _hours_ago(hours))
            for subject, sender, to, kind, verdict, payload, confidence, hours in BEP_MESSAGES
        ],
    )
    conn.commit()
    logger.info("  Seeded %d email messages.", len(BEP_MESSAGES))


def _seed_xdr_detections(conn: Any) -> None:
    if not _is_empty(conn, "xdr_detections"):
        return
    conn.executemany(
        "INSERT INTO xdr_detections"
        " (rule, layer, severity, status, host, technique, detected_at)"
        " VALUES (%s, %s, %s, %s, %s, %s, %s)",
        [
            (rule, layer, severity, status, host, technique, _hours_ago(hours))
            for rule, layer, severity, status, host, technique, hours in XDR_DETECTIONS
        ],
    )
    conn.commit()
    logger.info("  Seeded %d XDR detections.", len(XDR_DETECTIONS))


def _seed_drp_items(conn: Any) -> None:
    """Seed brand-abuse items, replacing rows that predate the channel column.

    Like the fraud seed, this also runs when the table holds only rows written
    before the widening — those cannot populate the channel or takedown
    figures and are demo data themselves.
    """
    total = conn.execute("SELECT COUNT(*) AS n FROM drp_phishing").fetchone()["n"]
    unclassified = conn.execute(
        "SELECT COUNT(*) AS n FROM drp_phishing WHERE channel IS NULL"
    ).fetchone()["n"]

    if total and unclassified != total:
        return
    if total:
        conn.execute("DELETE FROM drp_phishing")

    rows = []
    for name, status, channel, risk, hours, takedown_after in DRP_ITEMS:
        discovered = _hours_ago(hours)
        # A takedown lands some hours after discovery, never before it.
        taken = _hours_ago(hours - takedown_after) if takedown_after is not None else None
        rows.append((name, status, channel, risk, taken, discovered))

    conn.executemany(
        "INSERT INTO drp_phishing (domain, status, channel, risk, takedown_at, discovered_at)"
        " VALUES (%s, %s, %s, %s, %s, %s)",
        rows,
    )
    conn.commit()
    logger.info("  Seeded %d digital risk items.", len(DRP_ITEMS))


# Private helpers — one per table

def _seed_products(conn: Any) -> None:
    for i, p in enumerate(PRODUCTS):
        conn.execute(
            "INSERT INTO products"
            " (slug, name, tagline, description, icon,"
            "  bullets_json, capabilities_json, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
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


def _seed_industries(conn: Any) -> None:
    for i, ind in enumerate(INDUSTRIES):
        conn.execute(
            "INSERT INTO industries"
            " (slug, name, tagline, description, icon, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s)",
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


def _seed_solutions(conn: Any) -> None:
    for i, s in enumerate(SOLUTIONS):
        highlights = s["highlights"]
        conn.execute(
            "INSERT INTO solutions"
            " (slug, name, grp, tagline, description, icon,"
            "  highlights_json, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
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


def _seed_services(conn: Any) -> None:
    for i, s in enumerate(SERVICES):
        conn.execute(
            "INSERT INTO services"
            " (slug, name, grp, tagline, description, icon, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s, %s)",
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


def _seed_resources(conn: Any) -> None:
    for i, r in enumerate(RESOURCES):
        conn.execute(
            "INSERT INTO resources"
            " (slug, title, type, excerpt, is_new, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s)",
            (
                r["slug"],
                r["title"],
                r["type"],
                r["excerpt"],
                bool(r["isNew"]),
                i,
            ),
        )
    logger.info("  Seeded %d resources.", len(RESOURCES))


def _seed_blog_posts(conn: Any) -> None:
    for i, b in enumerate(BLOG_POSTS):
        conn.execute(
            "INSERT INTO blog_posts"
            " (slug, title, excerpt, date, category, sort_order)"
            " VALUES (%s, %s, %s, %s, %s, %s)",
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


def _seed_site_content(conn: Any) -> None:
    for key, value in SITE_CONTENT.items():
        conn.execute(
            "INSERT INTO site_content (key, value_json) VALUES (%s, %s)",
            (key, json.dumps(value)),
        )
    logger.info("  Seeded %d site content entries.", len(SITE_CONTENT))


def _seed_users(conn: Any) -> None:
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
        " VALUES (%s, %s, %s, %s, now())",
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


# Demo showcase accounts and healthcare events
#
# Everything below is gated by the caller on DIFAAC_SEED_DEMO_ACCOUNTS and is
# for the public onrender.com showcase only. The passwords are intentionally
# known — this is a demo — and must never guard real data. See config.py.

# email, password, role, full name, tenant slug (None = the default Difaac tenant)
_DEMO_ACCOUNTS: list[tuple[str, str, str, str, str | None]] = [
    ("admin@difaac.io", "S6ySvgIp8k30AZmmpPzpC_bN", "admin", "Difaac Admin", None),
    ("analyst@difaac.io", "U21fc58U6u7BK7xN", "analyst", "Difaac Analyst", None),
    ("viewer@difaac.io", "ViewerTest12345", "viewer", "Difaac Viewer", None),
    ("ciso@banadir.so", "HospitalCiso2026", "admin", "Hospital CISO", "hospital"),
]

_DEMO_HOSPITAL_SLUG = "hospital"
_DEMO_HOSPITAL_NAME = "Banadir Hospital"

# A few record-access events so the Record Access console shows something on the
# live demo. subject_ref is an identifier, never a name — the same rule the real
# integration contract enforces.
_DEMO_APP_EVENTS: list[dict] = [
    {"source": "banadir-ehr", "action": "record.view", "outcome": "success", "severity": "info", "actor": "dr.axmed", "subject_ref": "PATIENT-40318", "ip_address": "10.2.0.9"},
    {"source": "banadir-ehr", "action": "record.export", "outcome": "denied", "severity": "high", "actor": "nurse.fadumo", "subject_ref": "PATIENT-99012", "ip_address": "10.2.0.14"},
    {"source": "banadir-ehr", "action": "login.failed", "outcome": "failure", "severity": "medium", "actor": "unknown", "subject_ref": None, "ip_address": "197.0.0.5"},
    {"source": "banadir-ehr", "action": "record.view", "outcome": "success", "severity": "info", "actor": "nurse.amina", "subject_ref": "PATIENT-40318", "ip_address": "10.2.0.21"},
    {"source": "banadir-ehr", "action": "record.update", "outcome": "success", "severity": "info", "actor": "dr.cabdi", "subject_ref": "PATIENT-51120", "ip_address": "10.2.0.9"},
]


def seed_demo_accounts(conn: Any) -> int | None:
    """Upsert the demo logins and the hospital tenant. Returns the hospital id.

    Idempotent: each account is inserted or brought back to its demo password
    and role, so a redeploy keeps them working and the pre-seeded analyst
    account is reconciled to a known password. `users` carries no row-level
    policy, so this runs correctly whatever tenant the connection announced.
    """
    conn.execute(
        "INSERT INTO tenants (slug, name) VALUES (%s, %s) ON CONFLICT (slug) DO NOTHING",
        (_DEMO_HOSPITAL_SLUG, _DEMO_HOSPITAL_NAME),
    )

    slugs = {r["slug"]: r["id"] for r in conn.execute("SELECT id, slug FROM tenants").fetchall()}
    default_id = slugs.get("difaac")
    hospital_id = slugs.get(_DEMO_HOSPITAL_SLUG)

    for email, password, role, full_name, tenant_slug in _DEMO_ACCOUNTS:
        tenant_id = slugs.get(tenant_slug) if tenant_slug else default_id
        conn.execute(
            """
            INSERT INTO users
                (email, hashed_password, full_name, role, tenant_id, password_changed_at)
            VALUES (%s, %s, %s, %s, %s, now())
            ON CONFLICT (email) DO UPDATE
                SET hashed_password = EXCLUDED.hashed_password,
                    full_name = EXCLUDED.full_name,
                    role = EXCLUDED.role,
                    tenant_id = EXCLUDED.tenant_id,
                    is_active = TRUE,
                    failed_login_attempts = 0,
                    locked_until = NULL
            """,
            (email, hash_password(password), full_name, role, tenant_id),
        )

    logger.warning(
        "Demo accounts seeded (DIFAAC_SEED_DEMO_ACCOUNTS is on): %s. "
        "These are public, known-password logins — never enable this where real data lives.",
        ", ".join(a[0] for a in _DEMO_ACCOUNTS),
    )
    return hospital_id


def seed_demo_app_events(conn: Any) -> None:
    """Seed a few record-access events for the hospital tenant.

    Must be called with a connection already scoped to the hospital tenant, so
    the row-level policy on app_events accepts the inserts. Only seeds when the
    tenant has no events yet, so it never piles up on every redeploy.
    """
    existing = conn.execute("SELECT COUNT(*) AS n FROM app_events").fetchone()["n"]
    if existing:
        return
    for ev in _DEMO_APP_EVENTS:
        conn.execute(
            """
            INSERT INTO app_events
                (source, action, outcome, severity, actor, subject_ref, ip_address, occurred_at)
            VALUES (%(source)s, %(action)s, %(outcome)s, %(severity)s,
                    %(actor)s, %(subject_ref)s, %(ip_address)s, now())
            """,
            ev,
        )
    logger.info("Seeded %d demo record-access events for the hospital tenant.", len(_DEMO_APP_EVENTS))

