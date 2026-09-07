"""One-off migration: copy the SQLite database into PostgreSQL.

Run it once, against a *fresh* Postgres database, after the Docker stack has
brought the `db` service up:

    # from the backend/ directory, with DATABASE_URL pointing at Postgres
    python -m scripts.migrate_sqlite_to_postgres

    # or point at a specific SQLite file:
    python -m scripts.migrate_sqlite_to_postgres path/to/difaac.db

What it does, in order:

  1. Creates the Postgres schema (the same `SCHEMA_SQL` the app uses) and runs
     the column migrations, so the target has every column the source has.
  2. Copies every table, preserving primary-key ids. Identity columns need
     `OVERRIDING SYSTEM VALUE` to accept an explicit id, so that is used for
     the tables that have one.
  3. Advances each identity sequence past the largest id copied, so the next
     row the application inserts does not collide with a migrated one.

It is not idempotent: run it against an empty database. Re-running against a
populated one raises unique-violation errors rather than silently duplicating.
"""

from __future__ import annotations

import sqlite3
import sys
from datetime import date, datetime, timezone
from pathlib import Path

# Make the app package importable when run as `python -m scripts.…` or directly.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import psycopg
from psycopg.rows import dict_row

from app.config import DATABASE_URL
from app.database import _Conn
from app.migrations import run_migrations
from app.schemas import SCHEMA_SQL

# Copy order: a table is copied only after any table it references. The only
# foreign keys are user_id columns pointing at users, so users precedes them.
COPY_ORDER = [
    "products",
    "industries",
    "solutions",
    "services",
    "resources",
    "blog_posts",
    "site_content",
    "users",
    "ti_iocs",
    "ti_actors",
    "ti_alerts",
    "drp_phishing",
    "fraud_cases",
    "asm_assets",
    "bep_messages",
    "xdr_detections",
    "incidents",
    "refresh_tokens",
    "password_reset_tokens",
    "auth_events",
    "demo_requests",
]

# Tables whose `id` is GENERATED ALWAYS AS IDENTITY: an explicit id can only be
# inserted with OVERRIDING SYSTEM VALUE, and the sequence must be advanced after.
IDENTITY_TABLES = {
    "users",
    "ti_iocs",
    "ti_actors",
    "ti_alerts",
    "drp_phishing",
    "fraud_cases",
    "asm_assets",
    "bep_messages",
    "xdr_detections",
    "incidents",
    "refresh_tokens",
    "password_reset_tokens",
    "auth_events",
    "demo_requests",
}


def _pg_column_types(conn: psycopg.Connection, table: str) -> dict[str, str]:
    """The target column types, so values can be converted to match them."""
    rows = conn.execute(
        "SELECT column_name, data_type FROM information_schema.columns"
        " WHERE table_schema = 'public' AND table_name = %s",
        (table,),
    ).fetchall()
    return {r["column_name"]: r["data_type"] for r in rows}


def _convert(value: object, pg_type: str) -> object:
    """Convert one SQLite value to what its PostgreSQL column expects.

    SQLite has neither a boolean nor a timestamp type: it stored booleans as
    0/1 and timestamps as text. Postgres will not coerce either — an integer
    into a boolean column is an error, and a bare timestamp string would be
    read in the server's timezone rather than the UTC it was written in.
    """
    if value is None:
        return None
    if pg_type == "boolean":
        return bool(value)
    if pg_type in ("timestamp with time zone", "timestamp without time zone"):
        if isinstance(value, datetime):
            moment = value
        else:
            # Accept both "YYYY-MM-DD HH:MM:SS" and full ISO-8601.
            moment = datetime.fromisoformat(str(value).replace(" ", "T"))
        return moment if moment.tzinfo else moment.replace(tzinfo=timezone.utc)
    if pg_type == "date" and not isinstance(value, date):
        return date.fromisoformat(str(value)[:10])
    return value


def _sqlite_columns(src: sqlite3.Connection, table: str) -> list[str]:
    return [row[1] for row in src.execute(f"PRAGMA table_info({table})").fetchall()]


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(
            "Usage: python -m scripts.migrate_sqlite_to_postgres <path-to-difaac.db>\n"
            "The old database is no longer kept in the tree — pass the backup you kept."
        )
    sqlite_path = sys.argv[1]
    if not Path(sqlite_path).exists():
        raise SystemExit(f"SQLite database not found: {sqlite_path}")

    print(f"Source (SQLite):     {sqlite_path}")
    print(f"Target (Postgres):   {DATABASE_URL}")

    src = sqlite3.connect(sqlite_path)
    src.row_factory = sqlite3.Row

    # dict rows, matching the application: run_migrations reads columns by name.
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as pg:
        conn = _Conn(pg)

        # 1. Schema + column migrations.
        conn.executescript(SCHEMA_SQL)
        pg.commit()
        run_migrations(conn)
        pg.commit()
        print("Schema created.")

        # 2. Copy each table.
        total = 0
        for table in COPY_ORDER:
            columns = _sqlite_columns(src, table)
            if not columns:
                print(f"  {table}: (absent in source, skipped)")
                continue
            rows = src.execute(f"SELECT {', '.join(columns)} FROM {table}").fetchall()
            if not rows:
                print(f"  {table}: 0 rows")
                continue

            col_list = ", ".join(columns)
            placeholders = ", ".join(["%s"] * len(columns))
            overriding = (
                "OVERRIDING SYSTEM VALUE "
                if table in IDENTITY_TABLES and "id" in columns
                else ""
            )
            types = _pg_column_types(pg, table)
            converted = [
                tuple(_convert(v, types.get(c, "")) for c, v in zip(columns, row))
                for row in rows
            ]
            with pg.cursor() as cur:
                cur.executemany(
                    f"INSERT INTO {table} ({col_list}) {overriding}VALUES ({placeholders})",
                    converted,
                )
            pg.commit()
            total += len(rows)
            print(f"  {table}: {len(rows)} rows")

        # 3. Advance identity sequences past the copied ids.
        for table in IDENTITY_TABLES:
            with pg.cursor() as cur:
                cur.execute(f"SELECT MAX(id) AS max_id FROM {table}")
                max_id = cur.fetchone()["max_id"]
                if max_id is not None:
                    cur.execute(
                        "SELECT setval(pg_get_serial_sequence(%s, 'id'), %s)",
                        (table, max_id),
                    )
            pg.commit()

        print(f"\nDone. Copied {total} rows in total.")

    src.close()


if __name__ == "__main__":
    main()
