#!/bin/sh
set -e

echo "Starting Difaac Backend..."

# Fail fast on a missing signing key rather than starting and rejecting every
# request later. config.py raises when DIFAAC_SECRET_KEY is unset outside DEBUG,
# so this only makes the reason visible in the container logs.
python -c "import app.config" || {
    echo "Startup aborted: configuration is invalid (see the error above)." >&2
    exit 1
}

# Create tables, apply migrations, and seed on first run.
python -c "from app.database import init_db; init_db()"

# One worker, deliberately.
#
# The rate limiter keeps its counters in this process's memory. With four
# workers each process would hold its own counters, so the configured limit of
# 10 auth requests per minute would in practice allow 40 — four times weaker
# than intended, and silently so.
#
# Concurrency does not suffer: a Uvicorn worker is async and serves many
# simultaneous connections in one process, and Postgres handles concurrent
# writes from the connection pool — it is no longer the single-writer
# bottleneck SQLite was.
#
# So the database no longer caps this. Before raising the worker count, move
# the rate limiter to shared storage (Redis, or a table); that is now the only
# thing keeping it at one.
exec gunicorn app.main:app \
    -w 1 \
    -k uvicorn.workers.UvicornWorker \
    -b 0.0.0.0:8000 \
    --timeout 60 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile -
