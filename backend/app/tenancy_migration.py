"""Bring an existing database under tenant isolation.

Runs on every start and does nothing once applied. The order matters and each
step is safe to repeat:

  1. Create the `tenants` table and the organisation Difaac itself operates as.
  2. Add a nullable `tenant_id` to every scoped table.
  3. Backfill existing rows to the default tenant. They were written when there
     was only one, so that is genuinely whose they are.
  4. Make the column NOT NULL and add the foreign key and index. NOT NULL comes
     after the backfill, because a table with rows would reject it before.
  5. Enable and force row-level security, and install the policies.

Step 5 is deliberately last. A policy applied before the column is populated
would hide every existing row from the very migration trying to fill it.
"""

from __future__ import annotations

import logging
from typing import Any

from app.tenancy import (
    ALL_TENANT_TABLES,
    DEFAULT_TENANT_SLUG,
    TENANT_SETTING,
    TENANT_TABLES,
    rls_statements,
)

logger = logging.getLogger(__name__)

# The default for every tenant_id column: the tenant this transaction
# announced, or — when nothing announced one, which is the case while seeding a
# fresh database — the organisation Difaac itself operates as.
#
# Falling back is safe here only because the row-level policy still applies on
# top of it. A request acting as tenant 2 that forgot to supply a tenant_id
# gets 1 from this default and is then refused by WITH CHECK, so the fallback
# can rescue a seed script but can never quietly file one customer's row under
# another.
TENANT_DEFAULT_FN = """
CREATE OR REPLACE FUNCTION difaac_current_tenant() RETURNS integer
LANGUAGE sql STABLE AS $$
    SELECT COALESCE(
        NULLIF(current_setting('difaac.tenant_id', true), '')::int,
        (SELECT id FROM tenants WHERE slug = 'difaac')
    )
$$
"""

TENANTS_TABLE = """
CREATE TABLE IF NOT EXISTS tenants (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)
"""


def _has_column(conn: Any, table: str, column: str) -> bool:
    return bool(
        conn.execute(
            "SELECT 1 FROM information_schema.columns"
            " WHERE table_schema = 'public' AND table_name = %s AND column_name = %s",
            (table, column),
        ).fetchone()
    )


def _table_exists(conn: Any, table: str) -> bool:
    return bool(
        conn.execute(
            "SELECT 1 FROM information_schema.tables"
            " WHERE table_schema = 'public' AND table_name = %s",
            (table,),
        ).fetchone()
    )


def run_tenancy_migration(conn: Any) -> int:
    """Apply tenant isolation. Idempotent. Returns the default tenant's id."""
    conn.execute(TENANTS_TABLE)

    # The default tenant has to exist before anything can reference it.
    conn.execute(
        "INSERT INTO tenants (slug, name) VALUES (%s, %s) ON CONFLICT (slug) DO NOTHING",
        (DEFAULT_TENANT_SLUG, "Difaac"),
    )
    default_id = conn.execute(
        "SELECT id FROM tenants WHERE slug = %s", (DEFAULT_TENANT_SLUG,)
    ).fetchone()["id"]

    conn.execute(TENANT_DEFAULT_FN)

    added = 0
    for table in ALL_TENANT_TABLES:
        if not _table_exists(conn, table):
            # A fresh database creates it complete from schemas.py.
            continue
        if _has_column(conn, table, "tenant_id"):
            continue

        # Nullable first: an existing table with rows cannot take a NOT NULL
        # column without a default, and a default would be a lie for any row
        # added later.
        conn.execute(f"ALTER TABLE {table} ADD COLUMN tenant_id INTEGER")
        conn.execute(f"UPDATE {table} SET tenant_id = %s", (default_id,))
        conn.execute(f"ALTER TABLE {table} ALTER COLUMN tenant_id SET NOT NULL")
        conn.execute(
            f"ALTER TABLE {table} ALTER COLUMN tenant_id SET DEFAULT difaac_current_tenant()"
        )
        conn.execute(
            f"ALTER TABLE {table} ADD CONSTRAINT {table}_tenant_fk"
            " FOREIGN KEY (tenant_id) REFERENCES tenants(id)"
        )
        # Every policy check filters on this column, so every read touches it.
        conn.execute(f"CREATE INDEX IF NOT EXISTS idx_{table}_tenant ON {table} (tenant_id)")
        added += 1
        logger.info("Tenancy: added tenant_id to %s", table)

    # Safe to re-run: each statement either drops and recreates the policy or
    # sets a flag that is already set.
    for statement in rls_statements():
        conn.execute(statement)

    # The rest of start-up — the seeder above all — writes into tables that now
    # enforce a policy, and a connection that has not announced a tenant is
    # refused by WITH CHECK. Announced here on this connection only, and scoped
    # to the transaction, so it disappears when start-up finishes rather than
    # becoming a default that later requests inherit.
    conn.execute("SELECT set_config(%s, %s, true)", (TENANT_SETTING, str(default_id)))

    if added:
        logger.info(
            "Tenancy: %d tables scoped, row-level security forced on %d",
            added,
            len(TENANT_TABLES),
        )

    return default_id
