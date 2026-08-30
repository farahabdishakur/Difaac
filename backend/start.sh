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
# Two things in this service keep state in process memory: the rate limiter's
# counters, and SQLite's single-writer lock. With four workers each process
# would hold its own rate-limit counters, so the configured limit of 10 auth
# requests per minute would in practice allow 40 — four times weaker than
# intended, and silently so.
#
# Concurrency does not suffer: a Uvicorn worker is async and handles many
# simultaneous connections in one process. SQLite is the write bottleneck here,
# not the Python process.
#
# Before raising this, move the rate limiter to shared storage and move the
# database off SQLite. Until then, one worker is the correct configuration.
exec gunicorn app.main:app \
    -w 1 \
    -k uvicorn.workers.UvicornWorker \
    -b 0.0.0.0:8000 \
    --timeout 60 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile -
