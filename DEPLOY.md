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

Two values must be set, and the rest have sensible defaults:

- **`DIFAAC_SECRET_KEY`** — the token-signing key. Generate one and paste it:

  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(48))"
  ```

  The server refuses to start without this outside debug mode. It is what
  every session token is signed with; if it leaks, rotate it and every
  session is invalidated.

- **`DIFAAC_FRONTEND_URL`** — your real URL, e.g. `https://difaac.example.com`.
  It is used in the password-reset links the API sends.

Leave `DIFAAC_DEBUG=false`. Leave `DIFAAC_SEED_DEMO` unset — it defaults to
false in production, so the sample threat data is **not** loaded on a live
server. Your platform starts empty except for the admin account.

## 3. Set your domain

Edit `Caddyfile` and replace `difaac.example.com` with your domain, in the
one place it appears at the top.

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

The admin account is created for you. Add the rest from the server — account
creation is deliberately not an API endpoint, so nobody can register
themselves an elevated role:

```bash
docker compose exec backend python manage_users.py create \
    analyst@yourorg.com --role analyst --name "Analyst Name"
```

Roles: `admin`, `security_manager`, `analyst`, `intel_analyst`,
`incident_responder`, `viewer`. Run `manage_users.py list` to see accounts,
`set-role` to change one, `unlock` to clear a lockout.

## Updating

```bash
git pull
docker compose up -d --build
```

The database volume is untouched by a rebuild, so accounts and data survive.

## Backups

The database is one file on the `difaac_data` volume. The simplest backup is a
scheduled copy off the box:

```bash
docker compose exec backend sh -c 'sqlite3 /data/difaac.db ".backup /data/backup.db"'
docker compose cp backend:/data/backup.db ./difaac-$(date +%F).db
```

For continuous, point-in-time backup to object storage, add
[Litestream](https://litestream.io) as a sidecar mounting the same volume and
streaming to an S3-compatible bucket (Hostinger object storage, Backblaze B2,
or AWS S3). It replicates every write, so a lost VPS costs seconds of data
rather than a day. This is worth adding before you hold real customer data.

## Testing without a domain first

To check the stack before DNS is ready, change the first line of `Caddyfile`
from `difaac.example.com {` to `:80 {`, set `DIFAAC_FRONTEND_URL` to
`http://<your-vps-ip>`, and run the same `docker compose up`. Caddy then serves
plain HTTP on the IP. Switch back to the domain line for real use — the auth
cookie is marked secure and needs HTTPS to be sent.

## What is deliberately not here yet

The platform is **single-tenant**: every account sees the same organisation's
data. That is correct for Difaac running its own SOC. Before onboarding a
second, separate customer, every workspace table needs a `tenant_id` and every
query needs to filter on it — ideally enforced in the database with row-level
security, which is a reason to move to PostgreSQL at that point. Until then,
keep all accounts inside one organisation.
