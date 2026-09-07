"""PostgreSQL connection management for the Difaac platform.

Queries use psycopg's native `%s` placeholders and rows come back as plain
dicts, so there is no translation layer between the application and the
driver — what a query says is what Postgres receives.

Connections come from a pool: a request borrows a live TCP connection rather
than opening one, which is what keeps request latency down.
"""

import logging
from contextlib import contextmanager
from typing import Any, Generator, Sequence

import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from app.config import DATABASE_URL, SEED_DEMO_DATA
from app.migrations import run_migrations
from app.schemas import SCHEMA_SQL
from app.seeder import seed_all, seed_workspace_demo

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Connection adapter
# ---------------------------------------------------------------------------


class _Conn:
    """A psycopg connection with two conveniences psycopg keeps on the cursor.

    `execute`, `commit` and `rollback` forward untouched. `executemany` and
    `executescript` exist because the seeder and the schema bootstrap want them
    on the connection; both are thin, and neither rewrites the SQL it is given.
    """

    def __init__(self, raw: psycopg.Connection) -> None:
        self._raw = raw

    def execute(self, sql: str, params: Sequence[Any] | None = None) -> psycopg.Cursor:
        return self._raw.execute(sql, params)

    def executemany(self, sql: str, seq_of_params: Sequence[Sequence[Any]]) -> None:
        """Run one statement against many parameter rows."""
        with self._raw.cursor() as cur:
            cur.executemany(sql, seq_of_params)

    def executescript(self, script: str) -> None:
        """Run a multi-statement DDL script.

        Sent as one parameterless query, which psycopg issues with the simple
        query protocol — the one that accepts several statements separated by
        semicolons. Splitting the script here instead would be wrong: the
        schema carries comments containing semicolons, and a naive split cuts
        one in half and hands the tail to the server as though it were SQL.
        """
        self._raw.execute(script)

    def commit(self) -> None:
        self._raw.commit()

    def rollback(self) -> None:
        self._raw.rollback()


# ---------------------------------------------------------------------------
# Pool
# ---------------------------------------------------------------------------

_pool: ConnectionPool | None = None


def _get_pool() -> ConnectionPool:
    global _pool
    if _pool is None:
        _pool = ConnectionPool(
            conninfo=DATABASE_URL,
            min_size=1,
            max_size=10,
            max_idle=300,
            # `row_factory` is set per connection so every cursor returns dicts
            # without each call having to ask for them. The session runs in UTC
            # so a stored moment reads back the same way on a developer's
            # machine and on a server in another zone — the values are the same
            # instants either way, but the text in logs and API responses is
            # not, and that difference is the kind that wastes an afternoon.
            kwargs={"row_factory": dict_row, "options": "-c timezone=UTC"},
            # Without this the pool hands out whatever it is holding. A
            # connection killed by a database restart, a failover or an idle
            # timeout in between requests is dead, and the request that borrows
            # it is the one that discovers this. `check_connection` tests a
            # connection on the way out and replaces it if it has gone.
            check=ConnectionPool.check_connection,
            # A request should fail fast and say so rather than hang for the
            # 30-second default while the caller waits on an exhausted pool.
            timeout=10,
            open=True,
        )
    return _pool


@contextmanager
def get_connection() -> Generator[_Conn, None, None]:
    """Yield a pooled connection.

    The pool commits the transaction when the block exits cleanly and rolls it
    back on an exception, then returns the connection to the pool. Code that
    calls `conn.commit()` itself still works — the final commit is then a
    no-op.
    """
    with _get_pool().connection() as raw:
        yield _Conn(raw)


def init_db() -> None:
    """Create tables (if missing) and seed initial data on first run.

    Idempotent: it checks whether the products table already contains rows
    before inserting seed data, and every CREATE uses IF NOT EXISTS.
    """
    with get_connection() as conn:
        conn.executescript(SCHEMA_SQL)
        conn.commit()
        run_migrations(conn)

        row = conn.execute("SELECT COUNT(*) AS n FROM products").fetchone()
        count: int = row["n"] if row else 0

        if count == 0:
            logger.info("Database is empty — seeding initial data …")
            seed_all(conn)
            conn.commit()
            logger.info("Seed data inserted successfully.")
        else:
            logger.info("Database already contains %d products — skipping seed.", count)

        # Workspace tables are seeded separately: they were added after the
        # first release, so an existing database has products but no SOC data.
        # Gated, because this is illustrative data — never something a real
        # customer should find in their console.
        if SEED_DEMO_DATA:
            seed_workspace_demo(conn)
        else:
            logger.info("Demo workspace data disabled (DIFAAC_SEED_DEMO is off).")

        # Ensure at least one user exists
        user_count = conn.execute("SELECT COUNT(*) AS n FROM users").fetchone()["n"]
        if user_count == 0:
            logger.info("Users table is empty — seeding default user ...")
            from app.seeder import _seed_users

            _seed_users(conn)
            conn.commit()
            logger.info("Default user seeded successfully.")

        prune_spent_tokens(conn)


def prune_spent_tokens(conn: _Conn) -> None:
    """Delete refresh and reset tokens that can no longer authorise anything.

    A token that is revoked or past its expiry is dead to the auth code, but
    without this it stays in the table forever: every sign-in writes a row and
    nothing ever removes one.

    `expires_at` is a `timestamptz`, so it compares against `now()` directly.
    """
    refresh = conn.execute(
        "DELETE FROM refresh_tokens"
        " WHERE revoked_at IS NOT NULL OR expires_at < now()"
    ).rowcount
    reset = conn.execute(
        "DELETE FROM password_reset_tokens"
        " WHERE used_at IS NOT NULL OR expires_at < now()"
    ).rowcount
    conn.commit()

    if refresh or reset:
        logger.info("Pruned %d spent refresh and %d spent reset tokens.", refresh, reset)
