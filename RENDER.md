# Deploying Difaac on Render

Difaac ships as a docker-compose stack for a single VPS (see `DEPLOY.md`).
Render does not run compose; it runs each service on its own. So the same three
parts — a database, the API, and the built site — become three Render
resources.

The one thing to get right is that the site and the API end up on **two
different domains** on Render, where on the VPS they shared one behind Caddy.
The code already supports that: the browser calls the API by its full URL
(`VITE_API_URL`), sends the session cookie cross-site (`credentials: 'include'`
is already set), and the cookie is marked `SameSite=None` when you tell it to.
Everything below is wiring, not new code.

You need a Render account and this repository pushed to GitHub (Render deploys
from a Git repo).

---

## 1. PostgreSQL

Render → **New → PostgreSQL**.

- **Name:** `difaac-db`
- **Database:** `difaac`
- **User:** leave Render's default, or set `difaac_app`
- **Plan:** Free is enough to start; move to a paid plan before real data.

When it finishes, copy the **Internal Database URL** — the API uses that, not
the external one. (Internal is faster and never leaves Render's network.)

> Render's database user is **not** a superuser, which is exactly what the
> tenant isolation needs. The API checks this on boot and refuses to start if
> the role can bypass row-level security — so if it starts, isolation is real.

---

## 2. The API (backend)

Render → **New → Web Service** → connect this repo.

- **Root Directory:** `backend`
- **Runtime:** Docker (Render reads `backend/Dockerfile`)
- **Health Check Path:** `/health`
- **Plan:** Free to start.

**Environment variables:**

| Key | Value |
| --- | --- |
| `DIFAAC_DEBUG` | `false` |
| `DATABASE_URL` | the **Internal Database URL** from step 1 |
| `DIFAAC_SECRET_KEY` | click **Generate** (or paste 48+ random chars) |
| `DIFAAC_FRONTEND_URL` | `https://difaac-site.onrender.com` (the site URL from step 3) |
| `DIFAAC_CORS_ORIGINS` | `https://difaac-site.onrender.com` |
| `DIFAAC_COOKIE_SAMESITE` | `none` |
| `DIFAAC_TRUSTED_PROXIES` | `10.0.0.0/8` (see the note below) |

Email (password reset needs it; skip only if you will reset passwords from the
server with `manage_users.py set-password`):

| Key | Value |
| --- | --- |
| `DIFAAC_SMTP_HOST` | your relay, e.g. `smtp.gmail.com` |
| `DIFAAC_SMTP_PORT` | `587` |
| `DIFAAC_SMTP_USERNAME` | the relay account |
| `DIFAAC_SMTP_PASSWORD` | the relay password / app password |
| `DIFAAC_SMTP_FROM` | `no-reply@difaac.com` |

The first boot creates the schema, applies the tenant policies, and prints the
initial admin password **once** — read it from the service's **Logs** and
change it after you sign in.

> **Trusted proxy note.** On Render every request reaches the API through
> Render's load balancer, so without `DIFAAC_TRUSTED_PROXIES` the rate limiter
> counts the whole internet as one client. `10.0.0.0/8` trusts Render's
> internal network, which is where the balancer sits. If sign-in rate limiting
> misbehaves, that is the value to revisit — never set it to `0.0.0.0/0`,
> which would let any caller forge its own address.

---

## 3. The site (frontend)

Render → **New → Static Site** → same repo.

- **Root Directory:** `frontend`
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`

**Environment variable:**

| Key | Value |
| --- | --- |
| `VITE_API_URL` | `https://difaac-api.onrender.com` (the API URL from step 2) |

**Redirect/Rewrite rule** (so a hard refresh of a client-side route works):

- **Source:** `/*` **Destination:** `/index.html` **Action:** Rewrite

That is the whole site. It builds to static files and calls the API on its own
domain.

---

## 4. Order and first run

Render is chicken-and-egg on the URLs: the API wants the site URL and the site
wants the API URL, and neither exists until created. Do it in this order:

1. Create the database (step 1).
2. Create the API (step 2). Its URL is predictable — `difaac-api.onrender.com`
   — so you can set `DIFAAC_FRONTEND_URL` / `DIFAAC_CORS_ORIGINS` to the site
   URL now even though the site does not exist yet.
3. Create the site (step 3) with `VITE_API_URL` set to the API URL.
4. If Render assigned different names than `difaac-api` / `difaac-site`, fix
   the three URL variables to match and redeploy both.

Add real accounts once it is up, from the API service's **Shell**:

```bash
python manage_users.py create analyst@yourorg.com --role analyst --name "Analyst Name"
```

---

## Alternative: one domain instead of two

The two-domain setup above needs `SameSite=None` because the cookie travels
between the site's domain and the API's. If you would rather keep everything on
one origin — closer to the Caddy setup, and the cookie stays the simpler
`SameSite=Lax` — put the site on a Static Site and add **proxy rewrites**
instead of `VITE_API_URL`:

- Build the site with `VITE_API_URL` left **empty**.
- Add rewrite rules on the static site, most specific first:
  - `/api/*` → `https://difaac-api.onrender.com/api/*` (Rewrite)
  - `/auth/*` → `https://difaac-api.onrender.com/auth/*` (Rewrite)
  - `/*` → `/index.html` (Rewrite)
- On the API, drop `DIFAAC_COOKIE_SAMESITE` (back to `lax`) and set
  `DIFAAC_CORS_ORIGINS` to the **site** URL.

The browser then only ever talks to the site's domain and Render forwards the
API calls behind it. Use this if the two-domain cookie gives you trouble; the
default guide above works without it.

---

## What is different from the VPS deploy

- No Caddy. Render terminates TLS and gives each service an HTTPS URL, so the
  `Caddyfile` and the `caddy` / `frontend` nginx containers are unused here.
- No `POSTGRES_PASSWORD` to set — Render manages the database credentials and
  hands them to you as `DATABASE_URL`.
- The security headers Caddy added (CSP, HSTS, Referrer-Policy) are **not**
  applied by a Render Static Site by default. The API sets its own; the site
  does not. If you serve the marketing site to the public, add those headers
  as **Response Headers** on the static site, copying the values from the
  `header { … }` block in `Caddyfile`.
