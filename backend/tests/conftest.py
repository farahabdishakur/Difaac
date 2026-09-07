"""Database isolation for the test suite.

Under SQLite each test module pointed `DIFAAC_DB_PATH` at its own temporary
file, and that was enough to keep a test run away from real data. PostgreSQL
does not read that variable, so without this the suite would connect to
whatever `DATABASE_URL` names — the development database, or worse — and every
account a test registers would be written there.

pytest imports this file before it collects any test module, which is the only
moment early enough to matter: `app.config` reads the environment at import
time, so `DATABASE_URL` has to be redirected before the application is
imported. It is redirected to a database named after the real one with a
`_test` suffix, dropped and recreated at the start of each run so a run never
inherits rows from the last one.
"""

from __future__ import annotations

import os
from urllib.parse import urlparse, urlunparse

import psycopg

_DEFAULT_URL = "postgresql://difaac:difaac@localhost:5432/difaac"
_parts = urlparse(os.environ.get("DATABASE_URL") or _DEFAULT_URL)
_TEST_DB = (_parts.path.lstrip("/") or "difaac") + "_test"

# Redirect the application before it is imported. Nothing below this line may
# import `app`.
os.environ["DATABASE_URL"] = urlunparse(_parts._replace(path=f"/{_TEST_DB}"))


def _admin_connection() -> psycopg.Connection:
    """A connection to the maintenance database.

    CREATE DATABASE and DROP DATABASE cannot run inside a transaction, so this
    is autocommit, and it connects to `postgres` rather than to the database it
    is about to drop.
    """
    return psycopg.connect(
        urlunparse(_parts._replace(path="/postgres")), autocommit=True
    )


def pytest_configure(config: object) -> None:
    """Create the test database fresh for this run."""
    with _admin_connection() as conn:
        # FORCE closes any connection still held by a previous run, which would
        # otherwise make the drop fail rather than the run start clean.
        conn.execute(f'DROP DATABASE IF EXISTS "{_TEST_DB}" WITH (FORCE)')
        conn.execute(f'CREATE DATABASE "{_TEST_DB}"')
