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

Three details matter and are easy to get wrong. Each has the same failure
shape: the policies stay in place, the catalogue keeps reporting the tables as
protected, and none of it applies.

*The role.* A superuser — and any role with BYPASSRLS — is exempt from
row-level security, and no amount of FORCE changes that. The application must
connect as an ordinary role. This is not theoretical: the deployment ran as
one, because the `postgres` image creates `POSTGRES_USER` as a superuser. See
`assert_rls_enforced` at the end of this module, which now refuses to start in
that state.

*Force.* A table's owner is also exempt from its own policies, and the
application owns every table it creates. `ENABLE ROW LEVEL SECURITY` alone
would therefore leave the policies switched on and doing nothing. `FORCE ROW
LEVEL SECURITY` is what makes them apply to the owner too.

*Fail closed.* The policy compares `tenant_id` against a session setting read
with the missing-ok form, which yields NULL when nothing set it. `tenant_id =
NULL` is NULL, never true, so a connection that never announced its tenant
sees no rows at all. Forgetting to set the tenant cannot widen access; it can
only remove it.
"""

from __future__ import annotations

import logging
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
    # Everything an integrated application reports. This is the most sensitive
    # stream on the platform for a healthcare customer, because `subject_ref`
    # says which record was touched.
    "app_events",
)

# Tables that carry a tenant_id without a policy of their own: `users` for the
# reason above, and it is the anchor the rest hangs from.
# `api_keys` carries a tenant without a policy for the same reason as `users`:
# a key has to be found before anyone knows whose it is.
TENANT_COLUMN_ONLY: tuple[str, ...] = ("users", "api_keys")

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
            # Without FORCE the owner — which is what the application
            # connects as — is exempt, and every policy below is decoration.
            # This handles the owner; `assert_rls_enforced` handles the
            # superuser case, which FORCE cannot reach.
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


def assert_rls_enforced(conn: Any) -> None:
    """Refuse to run as a role that row-level security does not apply to.

    This is the third way to switch tenant isolation off silently, and the one
    that was actually live. The docstring above covers the first two — policies
    enabled but not forced, and a query that forgets its WHERE. Neither
    mattered next to this: **a superuser bypasses row-level security entirely,
    and FORCE does not change that.** So does any role holding BYPASSRLS.

    The official `postgres` image creates `POSTGRES_USER` as a superuser. The
    deployment set `POSTGRES_USER=difaac` and pointed the application's
    `DATABASE_URL` at it, so every policy this module installs was inert on the
    live server: each policy existed, `pg_tables` reported `rowsecurity = true`
    and `forcerowsecurity = true`, and every query still returned every
    tenant's rows. The database reported itself as protected and was not.

    Nothing in the application can detect that by reading its own rows — one
    tenant simply sees more than it should, which looks like data rather than
    like a fault. So it is checked once, at startup, against the catalogue, and
    the process refuses to serve rather than serve everyone's data to everyone.

    In DEBUG this logs instead of raising: a developer running against a
    throwaway database as a superuser should be told, not blocked.
    """
    row = conn.execute(
        """
        SELECT rolsuper, rolbypassrls
          FROM pg_roles
         WHERE rolname = current_user
        """
    ).fetchone()

    if row is None:  # pragma: no cover - current_user is always in pg_roles
        return
    if not (row["rolsuper"] or row["rolbypassrls"]):
        return

    reason = "a superuser" if row["rolsuper"] else "a role with BYPASSRLS"
    message = (
        f"The database role this application connects as is {reason}, so PostgreSQL "
        "row-level security does not apply to it and tenant isolation is not in "
        "effect — every query returns every tenant's rows. Connect as a role created "
        "with NOSUPERUSER NOBYPASSRLS that owns the tables (see DEPLOY.md), and point "
        "DATABASE_URL at that role."
    )

    from app.config import DEBUG

    if DEBUG:
        logging.getLogger(__name__).error("%s (allowed because DIFAAC_DEBUG is on)", message)
        return

    raise RuntimeError(message)
