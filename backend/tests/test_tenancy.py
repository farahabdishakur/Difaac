"""Tenant isolation, proved against the database rather than asserted.

These do not test that the application remembers to filter. They test that it
cannot fail to: the queries here deliberately omit any tenant condition, and
PostgreSQL is expected to return nothing anyway. If a future change breaks the
policy, a test that filtered correctly would still pass and the leak would ship.

The most important test in the file is `test_owner_does_not_bypass`. The
application connects as the role that owns every table, and a table owner is
exempt from its own row-level security unless FORCE is set. Without that one
line every other guarantee here is theatre — the policies exist, the database
reports them as enabled, and they apply to nobody.
"""

from __future__ import annotations

import psycopg
import pytest
from psycopg.rows import dict_row

from app.config import DATABASE_URL
from app.tenancy import TENANT_SETTING, TENANT_TABLES, tenant_scope
from app.database import get_connection


@pytest.fixture
def two_tenants():
    """A second tenant alongside the default, with one detection each."""
    with psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True) as conn:
        conn.execute(
            "INSERT INTO tenants (slug, name) VALUES ('hospital-test', 'Test Hospital')"
            " ON CONFLICT (slug) DO NOTHING"
        )
        rows = conn.execute(
            "SELECT id, slug FROM tenants WHERE slug IN ('difaac', 'hospital-test')"
        ).fetchall()
        ids = {r["slug"]: r["id"] for r in rows}

        # Written with the policy deliberately satisfied for each tenant in
        # turn, which is the only way to get rows into two tenants at all.
        for slug, tenant_id in ids.items():
            conn.execute("SELECT set_config(%s, %s, false)", (TENANT_SETTING, str(tenant_id)))
            conn.execute(
                """
                INSERT INTO xdr_detections
                    (tenant_id, rule, layer, severity, status, host, technique)
                VALUES (%s, %s, 'endpoint', 'high', 'open', %s, 'T1059')
                """,
                (tenant_id, f"TEST-{slug}", f"host-{slug}"),
            )
        conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))

    yield ids

    # The rows have to be removed tenant by tenant: a connection that has not
    # announced one cannot see them, so a single DELETE would quietly remove
    # nothing and the tenant row would then fail its foreign key. That the
    # cleanup has to work this way is itself the isolation being real.
    with psycopg.connect(DATABASE_URL, autocommit=True) as conn:
        for tenant_id in ids.values():
            conn.execute("SELECT set_config(%s, %s, false)", (TENANT_SETTING, str(tenant_id)))
            conn.execute("DELETE FROM xdr_detections WHERE rule LIKE 'TEST-%'")
        conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))
        conn.execute("DELETE FROM tenants WHERE slug = 'hospital-test'")


class TestIsolation:
    def test_a_tenant_sees_only_its_own_rows(self, two_tenants):
        """The query asks for every detection. It gets one."""
        with tenant_scope(two_tenants["difaac"]), get_connection() as conn:
            rows = conn.execute(
                "SELECT rule FROM xdr_detections WHERE rule LIKE 'TEST-%'"
            ).fetchall()

        ids = {r["rule"] for r in rows}
        assert ids == {"TEST-difaac"}, "a tenant saw another tenant's detections"

    def test_the_other_tenant_sees_the_other_row(self, two_tenants):
        with tenant_scope(two_tenants["hospital-test"]), get_connection() as conn:
            rows = conn.execute(
                "SELECT rule FROM xdr_detections WHERE rule LIKE 'TEST-%'"
            ).fetchall()

        assert {r["rule"] for r in rows} == {"TEST-hospital-test"}

    def test_no_tenant_announced_sees_nothing(self, two_tenants):
        """The fail-closed case: a connection that never said who it is."""
        with tenant_scope(None), get_connection() as conn:
            rows = conn.execute("SELECT * FROM xdr_detections").fetchall()

        assert rows == [], "an unscoped connection could read tenant data"

    def test_count_matches_the_policy_not_the_table(self, two_tenants):
        """COUNT(*) is the query most likely to be written without a filter."""
        with tenant_scope(two_tenants["hospital-test"]), get_connection() as conn:
            n = conn.execute("SELECT COUNT(*) AS n FROM xdr_detections").fetchone()["n"]

        assert n == 1, f"an aggregate crossed the tenant boundary: counted {n}"


class TestWrites:
    def test_cannot_insert_into_another_tenant(self, two_tenants):
        """WITH CHECK: writing a row addressed to someone else is refused."""
        with tenant_scope(two_tenants["difaac"]), get_connection() as conn:
            with pytest.raises(psycopg.errors.InsufficientPrivilege):
                conn.execute(
                    """
                    INSERT INTO xdr_detections
                        (tenant_id, rule, layer, severity, status, host, technique)
                    VALUES (%s, 'TEST-smuggled', 'endpoint', 'low', 'open', 'h', 'T1059')
                    """,
                    (two_tenants["hospital-test"],),
                )

    def test_cannot_update_another_tenants_row(self, two_tenants):
        """USING applies to UPDATE too, so the row is simply not there to change."""
        with tenant_scope(two_tenants["difaac"]), get_connection() as conn:
            cur = conn.execute(
                "UPDATE xdr_detections SET status = 'closed'"
                " WHERE rule = 'TEST-hospital-test'"
            )
            assert cur.rowcount == 0, "updated a row belonging to another tenant"

    def test_cannot_delete_another_tenants_row(self, two_tenants):
        with tenant_scope(two_tenants["difaac"]), get_connection() as conn:
            cur = conn.execute(
                "DELETE FROM xdr_detections WHERE rule = 'TEST-hospital-test'"
            )
            assert cur.rowcount == 0, "deleted a row belonging to another tenant"


class TestTheConfiguration:
    def test_owner_does_not_bypass(self):
        """FORCE is set, so the role that owns the tables is still subject to them.

        Without this the application — which connects as the owner — sees every
        tenant's rows while the database reports row-level security as enabled.
        """
        with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
            rows = conn.execute(
                "SELECT relname, relrowsecurity, relforcerowsecurity"
                "  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace"
                " WHERE n.nspname = 'public' AND c.relname = ANY(%s)",
                (list(TENANT_TABLES),),
            ).fetchall()

        assert len(rows) == len(TENANT_TABLES), "a scoped table is missing"
        not_enabled = [r["relname"] for r in rows if not r["relrowsecurity"]]
        not_forced = [r["relname"] for r in rows if not r["relforcerowsecurity"]]
        assert not not_enabled, f"row-level security is off on {not_enabled}"
        assert not not_forced, f"FORCE is missing on {not_forced} — the owner bypasses it"

    def test_every_scoped_table_has_a_policy(self):
        with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
            rows = conn.execute(
                "SELECT tablename FROM pg_policies"
                " WHERE schemaname = 'public' AND policyname = 'tenant_isolation'"
            ).fetchall()

        covered = {r["tablename"] for r in rows}
        missing = set(TENANT_TABLES) - covered
        assert not missing, f"no isolation policy on {sorted(missing)}"

    def test_every_scoped_table_has_the_column_not_null(self):
        with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
            rows = conn.execute(
                "SELECT table_name, is_nullable FROM information_schema.columns"
                " WHERE table_schema = 'public' AND column_name = 'tenant_id'"
                "   AND table_name = ANY(%s)",
                (list(TENANT_TABLES),),
            ).fetchall()

        found = {r["table_name"]: r["is_nullable"] for r in rows}
        missing = set(TENANT_TABLES) - set(found)
        nullable = [t for t, n in found.items() if n == "YES"]
        assert not missing, f"tenant_id missing from {sorted(missing)}"
        assert not nullable, f"tenant_id is nullable on {nullable} — a row could escape the policy"
