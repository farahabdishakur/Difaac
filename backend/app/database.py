"""PostgreSQL connection management for the Difaac platform.

The application was written against SQLite's ``sqlite3`` module, so two habits
of that module are preserved here rather than rewritten across every query:

  * Queries use ``?`` placeholders. A thin wrapper translates them to the
    ``%s`` psycopg expects at execute time, so the 70-odd existing queries did
    not have to change. (None of the SQL contains a literal ``%`` or a ``?``
    outside a placeholder, which is what makes the swap safe.)

  * Rows are read both by name (``row["email"]``) and by position
    (``row[0]`` for a ``COUNT(*)``). A custom row factory returns objects that
    support both, exactly as ``sqlite3.Row`` did, and ``dict(row)`` still
    yields a plain ``{column: value}`` mapping.

Connections come from a pool: unlike SQLite, every request no longer opens a
file — it borrows a live TCP connection, so a pool is what keeps request
latency down.
"""

import logging
from contextlib import contextmanager
from typing import Any, Generator, Sequence

import psycopg
from psycopg_pool import ConnectionPool

from app.config import DATABASE_URL, SEED_DEMO_DATA
from app.migrations import run_migrations
from app.schemas import SCHEMA_SQL
from app.seeder import seed_all, seed_workspace_demo

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Row factory: name- and position-addressable, like sqlite3.Row
# ---------------------------------------------------------------------------


class Row(dict):
    """A result row addressable by column name or by position.

    ``row["col"]`` is a plain dict lookup; ``row[0]`` returns the first column's
    value (dict preserves column order). ``dict(row)`` copies at the dict level
    and so yields ``{column: value}`` without going through the integer path.
    """

    __slots__ = ()

    def __getitem__(self, key: Any) -> Any:
        if isinstance(key, int):
            return list(self.values())[key]
        return dict.__getitem__(self, key)


def _row_factory(cursor: psycopg.Cursor) -> Any:
    description = cursor.description
    columns = [c.name for c in description] if description else []

    def make(values: Sequence[Any]) -> Row:
        return Row(zip(columns, values))

    return make


# ---------------------------------------------------------------------------
# Connection wrapper: keeps the sqlite3-style `?` placeholder API
# ---------------------------------------------------------------------------


def _to_pg(sql: str) -> str:
    """Translate sqlite ``?`` placeholders to psycopg ``%s``.

    Safe because none of the application's SQL contains a literal ``%`` (which
    psycopg would treat as a placeholder marker) or a ``?`` that is not a
    placeholder — the two ``?`` in the codebase that are not placeholders live
    in a regex and a URL, neither of which is ever passed to ``execute``.
    """
    return sql.replace("?", "%s")


class _Conn:
    """Wraps a psycopg connection so route code written for sqlite3 runs
    unchanged: ``conn.execute(sql, params)`` returns a cursor to fetch from,
    and ``conn.commit()`` behaves as before."""

    def __init__(self, raw: psycopg.Connection) -> None:
        self._raw = raw

    def execute(self, sql: str, params: Sequence[Any] | None = None) -> psycopg.Cursor:
        # psycopg only substitutes when params are given; queries without a
        # placeholder pass params=None and are sent verbatim.
        return self._raw.execute(_to_pg(sql), params)

    def executemany(self, sql: str, seq_of_params: Sequence[Sequence[Any]]) -> None:
        """Run one statement against many parameter rows, as the seeder does.

        psycopg's ``executemany`` lives on the cursor, so a cursor is opened for
        the batch; the ``?`` placeholders are translated the same way.
        """
        with self._raw.cursor() as cur:
            cur.executemany(_to_pg(sql), seq_of_params)

    def executescript(self, script: str) -> None:
        """Run a multi-statement DDL script, as sqlite3's executescript did.

        Sent as one parameterless query: psycopg then uses the simple query
        protocol, which accepts several statements separated by semicolons.

        Splitting the script on ``;`` here instead would be wrong — the schema
        carries comments that contain semicolons, and a naive split cuts one in
        half and hands the tail to the server as though it were SQL.
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
        # `row_factory` is set per connection so every cursor returns `Row`
        # objects without each call having to ask for them.
        _pool = ConnectionPool(
            conninfo=DATABASE_URL,
            min_size=1,
            max_size=10,
            max_idle=300,
            kwargs={"row_factory": _row_factory},
            open=True,
        )
    return _pool


@contextmanager
def get_connection() -> Generator[_Conn, None, None]:
    """Yield a pooled connection wrapped to keep the sqlite3-style API.

    The pool commits the transaction when the block exits cleanly and rolls it
    back on an exception, then returns the connection to the pool. Code that
    calls ``conn.commit()`` itself still works — the final commit is then a
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

        row = conn.execute("SELECT COUNT(*) FROM products").fetchone()
        count: int = row[0] if row else 0

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
        user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
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

    ``expires_at`` is stored as an ISO-8601 string, so it is cast to a
    timestamp for the comparison rather than compared as text — which also
    fixes a latent bug where the ``T`` in the ISO value made the old text
    comparison unreliable.
    """
    refresh = conn.execute(
        "DELETE FROM refresh_tokens"
        " WHERE revoked_at IS NOT NULL OR expires_at::timestamptz < now()"
    ).rowcount
    reset = conn.execute(
        "DELETE FROM password_reset_tokens"
        " WHERE used_at IS NOT NULL OR expires_at::timestamptz < now()"
    ).rowcount
    conn.commit()

    if refresh or reset:
        logger.info("Pruned %d spent refresh and %d spent reset tokens.", refresh, reset)
