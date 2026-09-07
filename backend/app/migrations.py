"""Schema migrations for existing databases.

`CREATE TABLE IF NOT EXISTS` in `schemas.py` builds a correct database from
nothing, but it cannot alter a table that already exists. A database created
before a column was introduced therefore needs that column adding here.

Every migration must be idempotent: `init_db` runs this on every start, and it
must be safe to run against a database that is already current.
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# (table, column, DDL for the column definition)
#
# Each DDL fragment is valid PostgreSQL. Columns added to a table that already
# holds rows carry a constant default so the existing rows get a defined value.
_ADD_COLUMNS: list[tuple[str, str, str]] = [
    # Per-account lockout. IP rate limiting cannot protect one targeted account
    # against an attacker spreading attempts across many addresses.
    ("users", "failed_login_attempts", "INTEGER NOT NULL DEFAULT 0"),
    ("users", "locked_until", "TIMESTAMPTZ"),
    ("users", "last_login_at", "TIMESTAMPTZ"),
    ("users", "password_changed_at", "TIMESTAMPTZ"),
    # Fraud case context, added when the fraud dashboard began breaking cases
    # down by detector, channel, and region. Nullable because rows written
    # before this existed genuinely do not know their values — backfilling a
    # guess would put invented attribution in front of an analyst.
    ("fraud_cases", "signal", "TEXT"),
    ("fraud_cases", "channel", "TEXT"),
    ("fraud_cases", "country", "TEXT"),
    # Digital risk widened from "phishing domains" to brand abuse across every
    # channel, and to tracking how long a takedown actually took.
    ("drp_phishing", "channel", "TEXT"),
    ("drp_phishing", "risk", "TEXT"),
    ("drp_phishing", "takedown_at", "TIMESTAMPTZ"),
]


def _existing_columns(conn: Any, table: str) -> set[str]:
    """The column names of `table`, or an empty set if it does not exist yet."""
    rows = conn.execute(
        "SELECT column_name FROM information_schema.columns"
        " WHERE table_schema = 'public' AND table_name = %s",
        (table,),
    ).fetchall()
    return {row["column_name"] for row in rows}


def run_migrations(conn: Any) -> None:
    """Bring an existing database up to the current schema."""
    applied = 0

    for table, column, ddl in _ADD_COLUMNS:
        columns = _existing_columns(conn, table)
        if not columns:
            # Table does not exist yet; schemas.py will create it complete.
            continue
        if column in columns:
            continue
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}")
        logger.info("Migration: added %s.%s", table, column)
        applied += 1

    if applied:
        conn.commit()
        logger.info("Applied %d schema migration(s).", applied)
