#!/bin/sh
# Nightly database backup.
#
# A backup you have to remember to take is not a backup, and one that lives
# only on the machine it came from is not one either: the failure that destroys
# the database is usually the failure that destroys the disk under it.
#
# This dumps, compresses, verifies the dump is readable, prunes old ones, and
# optionally copies the newest off the box. Install it as a cron job:
#
#     sudo cp scripts/backup.sh /usr/local/bin/difaac-backup
#     sudo chmod +x /usr/local/bin/difaac-backup
#     sudo crontab -e
#     15 2 * * *  /usr/local/bin/difaac-backup >> /var/log/difaac-backup.log 2>&1
#
# Then verify a restore into a scratch database once, before you need it. An
# untested backup is a guess.

set -eu

DIR="${DIFAAC_BACKUP_DIR:-/var/backups/difaac}"
KEEP_DAYS="${DIFAAC_BACKUP_KEEP_DAYS:-14}"
COMPOSE_DIR="${DIFAAC_COMPOSE_DIR:-/opt/difaac}"
STAMP=$(date +%F-%H%M)
OUT="$DIR/difaac-$STAMP.sql.gz"

mkdir -p "$DIR"
# The dump holds every account and every hash in the system. 0700 on the
# directory and 0600 on the file keep it readable only by the user that runs
# this, which is the one place root privilege is actually needed here.
chmod 700 "$DIR"

echo "[$(date -Is)] dumping to $OUT"

if command -v docker >/dev/null 2>&1 && [ -f "$COMPOSE_DIR/docker-compose.yml" ]; then
    # Containerised deployment: reach the database through compose.
    ( cd "$COMPOSE_DIR" && docker compose exec -T db pg_dump -U difaac difaac ) | gzip -9 > "$OUT"
else
    # Native deployment: DATABASE_URL, or the local socket as difaac.
    pg_dump "${DATABASE_URL:-postgresql://difaac@127.0.0.1:5432/difaac}" | gzip -9 > "$OUT"
fi

chmod 600 "$OUT"

# A dump that cannot be read back is worse than no dump, because it is
# believed. gzip -t catches a truncated write; the tail check catches a dump
# that ended early, which pg_dump marks with its own completion line.
gzip -t "$OUT"
if ! gunzip -c "$OUT" | tail -5 | grep -q "PostgreSQL database dump complete"; then
    echo "[$(date -Is)] FAILED: dump is incomplete, keeping it for inspection" >&2
    exit 1
fi

SIZE=$(du -h "$OUT" | cut -f1)
echo "[$(date -Is)] ok: $OUT ($SIZE)"

# Prune, but only after a good dump — a failing backup should never be the
# thing that deletes the last working one.
find "$DIR" -name 'difaac-*.sql.gz' -type f -mtime "+$KEEP_DAYS" -delete
echo "[$(date -Is)] kept $(find "$DIR" -name 'difaac-*.sql.gz' | wc -l) backups"

# Off-box copy. Set DIFAAC_BACKUP_REMOTE to an rsync/scp destination —
# "user@host:/path" or an rclone remote — or leave it unset to skip.
if [ -n "${DIFAAC_BACKUP_REMOTE:-}" ]; then
    echo "[$(date -Is)] copying to $DIFAAC_BACKUP_REMOTE"
    if command -v rclone >/dev/null 2>&1 && echo "$DIFAAC_BACKUP_REMOTE" | grep -q ':'; then
        rclone copy "$OUT" "$DIFAAC_BACKUP_REMOTE"
    else
        scp -q "$OUT" "$DIFAAC_BACKUP_REMOTE"
    fi
    echo "[$(date -Is)] copied"
else
    echo "[$(date -Is)] NOTE: DIFAAC_BACKUP_REMOTE unset — this backup exists only on this server"
fi
