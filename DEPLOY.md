# Deploying Difaac

This deploys the whole platform — marketing site, app, and API — onto one
server, behind Caddy, which fetches an HTTPS certificate automatically. It is
written for a **Hostinger VPS**, but any Ubuntu VPS with Docker works the same
way.

## Before you start: which Hostinger plan

This will only run on a **VPS plan**. Hostinger's shared and cloud hosting run
PHP against a managed MySQL database and cannot run a Python process or Docker,
so the backend cannot start there. If you are on shared hosting, upgrade to a
VPS first — the smallest one is enough for this.

## What you need

- A Hostinger VPS running Ubuntu, with root or sudo.
- A domain name, with an `A` record pointing at the VPS IP. Caddy needs this
  to issue the certificate. (You can test by IP over plain HTTP first — see
  the note at the end.)
- Docker and the Compose plugin on the VPS:

```bash
curl -fsSL https://get.docker.com | sh
```

  Docker Engine on a Linux server is free and open source. The subscription
  that costs money covers Docker **Desktop** — the Windows and macOS app — and
  only at companies above 250 staff or $10M revenue. Neither applies here, and
  a VPS does not run Desktop anyway.

  If you would still rather not run containers, everything below has a
  Docker-free equivalent: see [Appendix: running it without
  Docker](#appendix-running-it-without-docker).

## 1. Get the code onto the server

```bash
git clone <your-repo-url> difaac
cd difaac
```

## 2. Configure the backend

Copy the template and fill it in:

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Three values must be set, and the rest have sensible defaults.

The first goes in a `.env` file at the repository root, next to
`docker-compose.yml`, because it is read by compose rather than by the app:

- **`POSTGRES_PASSWORD`** — the database password. Generate one:

  ```bash
  echo "POSTGRES_PASSWORD=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')" > .env
  ```

  `docker compose up` refuses to start without it rather than falling back to
  a default, because a known password on a database is a known password
  whether or not the port is published.

The other two go in `backend/.env`:

- **`DIFAAC_SECRET_KEY`** — the token-signing key. Generate one and paste it:

  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(48))"
  ```

  The server refuses to start without this outside debug mode. It is what
  every session token is signed with; if it leaks, rotate it and every
  session is invalidated.

- **`DIFAAC_FRONTEND_URL`** — your real URL, `https://difaac.com`. It is used
  in the password-reset links the API sends, and a wrong value does not fail
  loudly: the mail is sent and the link in it points at the wrong host.

- **`DIFAAC_CORS_ORIGINS`** — the origins allowed to call the API, which in
  production is the site itself and nothing else:
  `https://difaac.com,https://www.difaac.com`. Leaving the localhost entries
  from the template in place means a page served from a developer's machine can
  call the live API with a live session.

- **`DIFAAC_TRUSTED_PROXIES`** — already set for you in `docker-compose.yml`
  (`172.16.0.0/12`, the range Docker gives its internal networks). You only
  need to think about this if you run the backend somewhere other than that
  compose file.

  It is what lets the API see past Caddy. Every connection reaches the backend
  *from* Caddy, so without it the rate limiter counts the whole internet as one
  client: the ten-per-minute limit on sign-in applies to everybody combined,
  and a handful of simultaneous visitors exhausts the general budget for
  everyone. Sessions and detections are recorded against Caddy's address too,
  so the audit trail cannot say where anything came from.

  Set it to the address the proxy connects from, never to `0.0.0.0/0` — that
  would let any caller write its own address into a header and escape the rate
  limit entirely. If the value is wrong the backend says so in its startup
  log; check `docker compose logs backend | grep -i proxies` after the first
  start.

- **`DIFAAC_SMTP_HOST`** and **`DIFAAC_SMTP_FROM`** (plus port, username and
  password) — needed for password reset. Without them a user who forgets their
  password cannot recover it: the endpoint answers 503 rather than saying a
  link is on its way that nothing will send. Any SMTP relay works — one on this
  VPS, Gmail, SES, Postmark, Resend. Port 587 with `DIFAAC_SMTP_STARTTLS=true`
  is the usual setup; 465 is implicit TLS.

  Until this is set, an administrator resets a password with
  `manage_users.py set-password`.

Leave `DIFAAC_DEBUG=false`. Leave `DIFAAC_SEED_DEMO` unset — it defaults to
false in production, so the sample threat data is **not** loaded on a live
server. Your platform starts empty except for the admin account.

## 2b. The database role (read this even if you already deployed)

The application must **not** connect to PostgreSQL as a superuser.

PostgreSQL exempts superusers from row-level security, and row-level security
is the whole of Difaac's tenant isolation. `FORCE ROW LEVEL SECURITY` does not
help — it makes policies apply to a table's *owner*, and says nothing about a
superuser. So a deployment that connects as one has every policy installed,
`pg_tables` reporting `rowsecurity = true`, and every query returning every
tenant's rows. The database reports itself as protected and is not.

The `postgres` image creates `POSTGRES_USER` as a superuser, and earlier
versions of this stack pointed `DATABASE_URL` at exactly that user.

**New deployments** need nothing: `scripts/init-app-role.sql` runs on the first
start and creates `difaac_app` with `NOSUPERUSER NOBYPASSRLS`, and the compose
file already connects as it. Set `DIFAAC_APP_DB_PASSWORD` in the root `.env`
alongside `POSTGRES_PASSWORD` — two different secrets, because the one the
application holds is the one that is exposed to the application.

**An existing deployment** does not run that script, because it only runs on an
empty data volume. Create the role by hand, once:

```bash
docker compose exec db psql -U difaac -d difaac -v ON_ERROR_STOP=1 -c "
  CREATE ROLE difaac_app LOGIN PASSWORD 'PUT-A-STRONG-PASSWORD-HERE'
      NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  ALTER SCHEMA public OWNER TO difaac_app;
  GRANT ALL ON SCHEMA public TO difaac_app;
"
docker compose exec db psql -U difaac -d postgres -c "ALTER DATABASE difaac OWNER TO difaac_app;"
```

Existing tables are still owned by the old superuser, so hand them over too:

```bash
docker compose exec db psql -U difaac -d difaac -tAc   "SELECT 'ALTER TABLE '||tablename||' OWNER TO difaac_app;' FROM pg_tables WHERE schemaname='public'"   | docker compose exec -T db psql -U difaac -d difaac
docker compose exec db psql -U difaac -d difaac -tAc   "SELECT 'ALTER SEQUENCE '||sequencename||' OWNER TO difaac_app;' FROM pg_sequences WHERE schemaname='public'"   | docker compose exec -T db psql -U difaac -d difaac
```

Then put the same password in `DIFAAC_APP_DB_PASSWORD` in the root `.env` and
`docker compose up -d`.

You do not have to remember to check afterwards. The backend verifies its own
role on every start and **refuses to run** if row-level security does not apply
to it, rather than serving one customer's data to another:

```bash
docker compose logs backend | grep -i "row-level security"
```

Nothing there means the check passed. Keep the superuser for backups, restores,
and anything that has to cross tenants deliberately.

## 3. Check the domain

`Caddyfile` is already set to `difaac.com` and `www.difaac.com`. If you are
deploying somewhere else, change the site line at the top. Both names need an
`A` record pointing at this server before Caddy can get a certificate.

## 4. Start it

```bash
docker compose up -d --build
```

The first backend start creates the database on a persistent volume, applies
the schema, and prints the initial admin account's generated password **once**
in the logs — copy it now, it is not recoverable:

```bash
docker compose logs backend | grep -A4 "Initial account"
```

Sign in at your domain, then change that password immediately from Settings.

## 5. Create the real accounts

The admin account is created for you. Add the rest from the server:

```bash
docker compose exec backend python manage_users.py create \
    analyst@yourorg.com --role analyst --name "Analyst Name"
```

Roles: `admin`, `security_manager`, `analyst`, `intel_analyst`,
`incident_responder`, `viewer`. Run `manage_users.py list` to see accounts,
`set-role` to change one, `unlock` to clear a lockout.

There is also `POST /auth/register`, which does the same thing over the API.
It requires the `users:manage` permission — held only by `admin` — and creates
the account inside the *calling* administrator's tenant, with `viewer` as the
role unless another is named. There is no self-service signup on this
platform: a caller without a session, or with one that lacks `users:manage`,
is refused.

Note for anyone upgrading an existing deployment: that endpoint was previously
reachable without any credential and granted `analyst` on the default tenant.
If your server ran a version before this change and was exposed to the
internet, list the accounts and confirm you recognise every one of them:

```bash
docker compose exec backend python manage_users.py list
```

## Updating

```bash
git pull
docker compose up -d --build
```

The database volume is untouched by a rebuild, so accounts and data survive.

## Backups

The database is PostgreSQL, running as the `db` service with its data on the
`difaac_pgdata` volume. Take a logical dump off the box on a schedule:

```bash
docker compose exec -T db pg_dump -U difaac difaac | gzip > difaac-$(date +%F).sql.gz
```

Restore into an empty database with:

```bash
gunzip -c difaac-2026-09-05.sql.gz | docker compose exec -T db psql -U difaac -d difaac
```

`scripts/backup.sh` does all of this on a schedule — dump, verify the dump is
readable, prune, and copy off the box:

```bash
sudo cp scripts/backup.sh /usr/local/bin/difaac-backup && sudo chmod +x /usr/local/bin/difaac-backup
sudo crontab -e
# 15 2 * * *  DIFAAC_BACKUP_REMOTE=you@elsewhere:/backups /usr/local/bin/difaac-backup >> /var/log/difaac-backup.log 2>&1
```

Set `DIFAAC_BACKUP_REMOTE` or the backup exists only on the machine it came
from, and the failure that destroys the database is usually the one that
destroys the disk under it. Then restore one into a scratch database, once,
before you need it — an untested backup is a guess, not a backup.

A nightly dump loses at most a day. For point-in-time recovery, archive the
write-ahead log to an S3-compatible bucket (Hostinger object storage, Backblaze
B2, AWS S3) with [pgBackRest](https://pgbackrest.org) or
[WAL-G](https://github.com/wal-g/wal-g), or move to a managed Postgres that
does it for you. Worth having in place before you hold real customer data.

## Testing without a domain first

To check the stack before DNS is ready, change the site line of `Caddyfile`
from `difaac.com, www.difaac.com {` to `:80 {`, set `DIFAAC_FRONTEND_URL` to
`http://<your-vps-ip>`, and run the same `docker compose up`. Caddy then serves
plain HTTP on the IP. Switch back to the domain line for real use — the auth
cookie is marked secure and needs HTTPS to be sent.

## What is deliberately not here yet

Nothing here blocks a second customer any more — see **Tenants** below.

## Tenants

Each customer organisation is a tenant, and every workspace table carries a
`tenant_id` with a PostgreSQL row-level security policy behind it. A request
announces its tenant from the signed-in account, and a query that forgets to
filter returns nothing rather than somebody else's rows.

```bash
docker compose exec backend python manage_users.py tenants
docker compose exec backend python manage_users.py tenants --add borama-hospital     --name "Borama General Hospital"
docker compose exec backend python manage_users.py create soc@hospital.example     --role analyst --tenant borama-hospital
```

An account created without `--tenant` belongs to `difaac`, the organisation
Difaac itself operates as. That default is right for your own analysts and
wrong for a customer's, so state it when the account is theirs.

Two things are worth knowing about how this is enforced.

The policies are `FORCE`d. A table's owner is otherwise exempt from its own
row-level security, and the application connects as the owner — without FORCE
every policy would be present, reported as enabled, and applying to nobody.
`tests/test_tenancy.py` asserts it directly, because that is not a mistake you
would notice any other way.

It fails closed. The policy compares against a session setting read with the
missing-ok form, so a connection that never announced a tenant matches no rows
at all. Forgetting to set the tenant empties a dashboard; it cannot widen one.

## Appendix: running it without Docker

Same three pieces, installed directly on the VPS instead of in containers:
PostgreSQL, the API under gunicorn, and Caddy serving the built frontend and
proxying the API. The application code is identical — only the packaging
changes.

Everything below assumes the repository is at `/opt/difaac` and runs as a
dedicated unprivileged user:

```bash
sudo adduser --system --group --home /opt/difaac difaac
sudo git clone <your-repo-url> /opt/difaac
sudo chown -R difaac:difaac /opt/difaac
```

### A. PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE USER difaac WITH PASSWORD 'paste-a-strong-one';"
sudo -u postgres createdb -O difaac difaac
```

Ubuntu's package listens on `127.0.0.1` only, which is what you want — the API
is the sole client, and a database reachable from the internet is a database
being brute-forced. Leave `listen_addresses` alone.

### B. The API

```bash
sudo apt install -y python3-venv
sudo -u difaac python3 -m venv /opt/difaac/backend/.venv
sudo -u difaac /opt/difaac/backend/.venv/bin/pip install \
    -r /opt/difaac/backend/requirements.txt gunicorn
```

No `libpq-dev` is needed: `psycopg[binary]` ships the driver compiled in.
`gunicorn` is installed alongside the requirements rather than listed in them,
because it is a deployment choice — the development server does not use it.

`backend/.env` takes the same values as the Docker path, plus the connection
string. The built-in default is a development one (`difaac:difaac@localhost`),
so it must be set explicitly here — a known password is a known password even
on a loopback-only port:

```
DIFAAC_DEBUG=false
DATABASE_URL=postgresql://difaac:the-password-you-set@127.0.0.1:5432/difaac
DIFAAC_SECRET_KEY=<python3 -c "import secrets; print(secrets.token_urlsafe(48))">
DIFAAC_FRONTEND_URL=https://difaac.com
DIFAAC_CORS_ORIGINS=https://difaac.com,https://www.difaac.com
```

Lock it down — it holds the signing key and the database password:

```bash
sudo chmod 600 /opt/difaac/backend/.env
sudo chown difaac:difaac /opt/difaac/backend/.env
```

Then `/etc/systemd/system/difaac-api.service`:

```ini
[Unit]
Description=Difaac API
After=network.target postgresql.service
Requires=postgresql.service

[Service]
User=difaac
Group=difaac
WorkingDirectory=/opt/difaac/backend
EnvironmentFile=/opt/difaac/backend/.env
ExecStart=/opt/difaac/backend/.venv/bin/gunicorn app.main:app \
    --workers 1 --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 --timeout 60 --graceful-timeout 30 \
    --access-logfile - --error-logfile -
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/difaac/backend

[Install]
WantedBy=multi-user.target
```

**One worker, deliberately** — the same reason `start.sh` gives. The rate
limiter counts requests in process memory, so four workers would each keep
their own tally and let four times the configured attempts through. That is the
limit protecting `/auth/login` from password guessing. Scale by putting a
second machine behind the proxy, or move the counter to Redis first.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now difaac-api
sudo journalctl -u difaac-api -n 50
```

The first start creates the schema — `init_db()` runs from the app's lifespan
hook, so nothing needs running by hand — and prints the initial admin password
once. Copy it from that log; it is not recoverable.

Add the other accounts from the server, the same as the Docker path without the
`docker compose exec` in front:

```bash
cd /opt/difaac/backend
sudo -u difaac .venv/bin/python manage_users.py create     analyst@yourorg.com --role analyst --name "Analyst Name"
```

### C. The frontend and TLS

```bash
cd /opt/difaac/frontend
sudo -u difaac npm ci
sudo -u difaac npm run build
```

Do **not** set `VITE_API_URL`. Left empty, the browser calls `/api/...` on the
origin it is already on and Caddy routes it to the backend. That same-origin
arrangement is what lets the refresh cookie stay `SameSite=Lax` instead of
needing `SameSite=None`, which any site could then trigger a request with.

Install Caddy, then replace `/etc/caddy/Caddyfile` with the same routing the
container stack uses, pointed at local paths:

```
difaac.com, www.difaac.com {
	encode zstd gzip
	root * /opt/difaac/frontend/dist

	# The API and the auth endpoints go to gunicorn.
	handle /api/* {
		reverse_proxy 127.0.0.1:8000
	}
	handle /auth/* {
		reverse_proxy 127.0.0.1:8000
	}

	# Everything else is the built SPA. try_files is what makes a deep link
	# like /workspace/managed-xdr work: routing happens in the browser, so
	# any path that is not a real file has to be answered with index.html.
	handle {
		try_files {path} /index.html
		file_server
	}

	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
	}
}
```

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy fetches the certificate on first request to the domain, so the `A` record
has to resolve before this works.

### D. Firewall

Only 80, 443 and SSH should be reachable. Postgres and gunicorn are bound to
loopback, but close the rest anyway:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
```

### E. Bringing your existing data across

If you are moving from the old SQLite database, copy the backup file to the
server and run the one-off migration against the empty Postgres database:

```bash
cd /opt/difaac/backend
sudo -u difaac .venv/bin/python -m scripts.migrate_sqlite_to_postgres \
    /path/to/difaac.db
```

It is not idempotent — run it once, before anyone signs in and creates rows.

### F. Updating and backups

```bash
cd /opt/difaac
sudo -u difaac git pull
sudo -u difaac backend/.venv/bin/pip install -r backend/requirements.txt
sudo -u difaac npm --prefix frontend ci && sudo -u difaac npm --prefix frontend run build
sudo systemctl restart difaac-api
```

Backups are the same dump as above, without the container indirection:

```bash
pg_dump -U difaac -h 127.0.0.1 difaac | gzip > difaac-$(date +%F).sql.gz
```

Put that in a nightly cron job and copy the file off the machine. A backup that
only exists on the server it backs up is not a backup.
