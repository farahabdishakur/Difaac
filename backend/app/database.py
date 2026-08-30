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
from app.seeder import seed_all

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
            
        # Ensure at least one user exists
        user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if user_count == 0:
            logger.info("Users table is empty — seeding default user ...")
            from app.seeder import _seed_users
            _seed_users(conn)
            conn.commit()
            logger.info("Default user seeded successfully.")

