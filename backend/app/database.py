"""SQLite connection management for the Difaac platform.

Provides a context-managed connection with WAL mode enabled for
better concurrent read performance and data integrity pragmas.
"""

import logging
import sqlite3
from contextlib import contextmanager
from typing import Generator

from app.config import DB_PATH
from app.migrations import run_migrations
from app.schemas import SCHEMA_SQL
from app.seeder import seed_all, seed_workspace_demo

logger = logging.getLogger(__name__)


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    """Yield a SQLite connection with Row factory enabled.

    The connection is automatically closed when the context exits.
    WAL journal mode allows concurrent readers while a write is in progress.
    """
    # `timeout` is what prevents the classic "database is locked" error: without
    # it a writer that finds the database busy fails immediately instead of
    # waiting for the current write to finish.
    conn = sqlite3.connect(DB_PATH, timeout=15.0)
    conn.row_factory = sqlite3.Row

    # WAL lets readers continue while a write is in progress, which matters
    # because every request here opens its own connection.
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")

    # Retry inside SQLite rather than surfacing SQLITE_BUSY to the caller.
    conn.execute("PRAGMA busy_timeout = 15000")

    # NORMAL is the correct pairing with WAL: a commit is durable against a
    # process crash, and only a full power loss can lose the last transaction.
    # FULL would add an fsync per commit for a guarantee this workload does not
    # need.
    conn.execute("PRAGMA synchronous = NORMAL")

    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    """Create tables (if missing) and seed initial data on first run.

    This function is idempotent — it checks whether the products table
    already contains rows before inserting seed data.
    """
    with get_connection() as conn:
        conn.executescript(SCHEMA_SQL)
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
        seed_workspace_demo(conn)

        # Ensure at least one user exists
        user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if user_count == 0:
            logger.info("Users table is empty — seeding default user ...")
            from app.seeder import _seed_users
            _seed_users(conn)
            conn.commit()
            logger.info("Default user seeded successfully.")

        prune_spent_tokens(conn)


def prune_spent_tokens(conn: sqlite3.Connection) -> None:
    """Delete refresh and reset tokens that can no longer authorise anything.

    A token that is revoked or past its expiry is dead to the auth code, but
    without this it stays in the table forever: every sign-in writes a row and
    nothing ever removes one. Left alone the table grows without bound and
    keeps a record of every session a user ever held, which is retained data
    nobody asked for and nothing reads.

    Run at startup rather than on a schedule because this deployment has no
    scheduler, and the cost is one indexed DELETE against rows that are
    already unusable.
    """
    refresh = conn.execute(
        "DELETE FROM refresh_tokens"
        " WHERE revoked_at IS NOT NULL OR expires_at < datetime('now')"
    ).rowcount
    reset = conn.execute(
        "DELETE FROM password_reset_tokens"
        " WHERE used_at IS NOT NULL OR expires_at < datetime('now')"
    ).rowcount
    conn.commit()

    if refresh or reset:
        logger.info("Pruned %d spent refresh and %d spent reset tokens.", refresh, reset)

