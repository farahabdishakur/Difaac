"""Tenant isolation.

Difaac began as a single organisation watching its own estate, so every table
held one customer's data and no query needed to say whose. Taking on a second
customer — a hospital, in the case this was built for — changes that: two
organisations' detections, phishing domains and incidents now sit in the same
tables, and one missing `WHERE` is a breach rather than a bug.

The isolation is therefore enforced by PostgreSQL, not by the application.
Every tenant-scoped table carries a `tenant_id` and a row-level security
policy, and each request sets `difaac.tenant_id` for the transaction it runs
in. A query that forgets to filter returns nothing instead of returning
somebody else's rows: the failure mode is an empty dashboard, which someone
reports, rather than a silent leak, which nobody notices.

Two details matter and are easy to get wrong.

*Force.* A table's owner bypasses its own row-level security. The application
connects as `difaac`, which owns every table, so `ENABLE ROW LEVEL SECURITY`
alone would leave the policies switched on and doing nothing — the worst
outcome available, because the database would report itself as protected.
`FORCE ROW LEVEL SECURITY` is what makes them apply to the owner too.

*Fail closed.* The policy compares `tenant_id` against a session setting read
with the missing-ok form, which yields NULL when nothing set it. `tenant_id =
NULL` is NULL, never true, so a connection that never announced its tenant
sees no rows at all. Forgetting to set the tenant cannot widen access; it can
only remove it.
"""

from __future__ import annotations

from contextlib import contextmanager
from contextvars import ContextVar
from typing import Any, Generator

# The setting name is prefixed because PostgreSQL only permits custom GUCs
# that contain a dot, and the prefix keeps ours away from anything else that
# might set session variables on the same connection.
TENANT_SETTING = "difaac.tenant_id"

# Tables holding one customer's data. Marketing content — products, solutions,
# services, industries, resources, blog posts, site content — is the same for
# everyone and is deliberately absent: putting it behind a tenant check would
# mean a signed-out visitor sees an empty website.
#
# `users` is absent for a different reason. Sign-in has to find an account by
# email before anyone knows which tenant it belongs to, so a policy on `users`
# would make logging in impossible. The column is still there, and it is what
# every session's tenant is read from; user administration filters on it in
# the application, where the lookup order leaves no choice.
TENANT_TABLES: tuple[str, ...] = (
    "ti_iocs",
    "ti_actors",
    "ti_alerts",
    "drp_phishing",
    "fraud_cases",
    "asm_assets",
    "bep_messages",
    "xdr_detections",
    "incidents",
    "demo_requests",
)

# Tables that carry a tenant_id without a policy of their own: `users` for the
# reason above, and it is the anchor the rest hangs from.
TENANT_COLUMN_ONLY: tuple[str, ...] = ("users",)

ALL_TENANT_TABLES: tuple[str, ...] = TENANT_TABLES + TENANT_COLUMN_ONLY

# The organisation Difaac itself operates as. Existing rows belong to it, and
# a single-customer deployment never needs a second.
DEFAULT_TENANT_SLUG = "difaac"

_current_tenant: ContextVar[int | None] = ContextVar("difaac_current_tenant", default=None)


def set_current_tenant(tenant_id: int | None) -> None:
    """Announce the tenant every subsequent query in this task belongs to."""
    _current_tenant.set(tenant_id)


def current_tenant() -> int | None:
    """The tenant this task is acting for, or None outside a request."""
    return _current_tenant.get()


@contextmanager
def tenant_scope(tenant_id: int | None) -> Generator[None, None, None]:
    """Act as `tenant_id` for the duration of the block, then restore.

    Used by the tests and by anything that has to touch another tenant
    deliberately, such as a migration or an operator script. Restoring through
    the token rather than by assignment keeps nesting honest.
    """
    token = _current_tenant.set(tenant_id)
    try:
        yield
    finally:
        _current_tenant.reset(token)


def apply_to_connection(conn: Any) -> None:
    """Set `difaac.tenant_id` for the current transaction on `conn`.

    `set_config(..., is_local => true)` scopes the value to the transaction, so
    a pooled connection cannot carry one request's tenant into the next. When
    no tenant is set the value is cleared to the empty string rather than left
    alone, which is what makes a reused connection fail closed instead of
    inheriting.
    """
    tenant = _current_tenant.get()
    conn.execute(
        "SELECT set_config(%s, %s, true)",
        (TENANT_SETTING, "" if tenant is None else str(tenant)),
    )


def rls_statements() -> list[str]:
    """The DDL that turns isolation on. Idempotent: safe to run on every start."""
    statements: list[str] = []
    for table in TENANT_TABLES:
        statements += [
            f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY",
            # Without FORCE the owner — which is what the application connects
            # as — is exempt, and every policy below is decoration.
            f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY",
            f"DROP POLICY IF EXISTS tenant_isolation ON {table}",
            # USING filters what a query may read, update or delete; WITH CHECK
            # filters what it may write. Both are needed: without WITH CHECK a
            # tenant could insert a row addressed to another tenant and then be
            # unable to see the thing it had just created.
            f"""
            CREATE POLICY tenant_isolation ON {table}
                USING (tenant_id = NULLIF(current_setting('{TENANT_SETTING}', true), '')::int)
                WITH CHECK (tenant_id = NULLIF(current_setting('{TENANT_SETTING}', true), '')::int)
            """,
        ]
    return statements
