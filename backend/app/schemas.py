"""PostgreSQL schema definitions for the Difaac platform.

Each CREATE TABLE statement uses IF NOT EXISTS so the script is safe
to run on every application startup.
"""

SCHEMA_SQL = """\
-- Products offered by Difaac
CREATE TABLE IF NOT EXISTS products (
    slug              TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    tagline           TEXT NOT NULL,
    description       TEXT NOT NULL,
    icon              TEXT NOT NULL,
    bullets_json      TEXT NOT NULL,
    capabilities_json TEXT NOT NULL,
    sort_order        INTEGER NOT NULL
);

-- Industry verticals Difaac serves
CREATE TABLE IF NOT EXISTS industries (
    slug        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    tagline     TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT NOT NULL,
    sort_order  INTEGER NOT NULL
);

-- Solutions grouped by use-case or role
CREATE TABLE IF NOT EXISTS solutions (
    slug            TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    grp             TEXT NOT NULL,
    tagline         TEXT NOT NULL,
    description     TEXT NOT NULL,
    icon            TEXT NOT NULL,
    highlights_json TEXT,
    sort_order      INTEGER NOT NULL
);

-- Professional services grouped by category
CREATE TABLE IF NOT EXISTS services (
    slug        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    grp         TEXT NOT NULL,
    tagline     TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT NOT NULL,
    sort_order  INTEGER NOT NULL
);

-- Downloadable resources (reports, white papers, guides)
CREATE TABLE IF NOT EXISTS resources (
    slug       TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    type       TEXT NOT NULL,
    excerpt    TEXT NOT NULL,
    is_new     BOOLEAN NOT NULL,
    sort_order INTEGER NOT NULL
);

-- Blog articles
CREATE TABLE IF NOT EXISTS blog_posts (
    slug       TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    excerpt    TEXT NOT NULL,
    date       DATE NOT NULL,
    category   TEXT NOT NULL,
    sort_order INTEGER NOT NULL
);

-- Miscellaneous site-wide content stored as JSON blobs
CREATE TABLE IF NOT EXISTS site_content (
    key        TEXT PRIMARY KEY,
    value_json TEXT NOT NULL
);

-- Users table for platform authentication
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name       TEXT,
    role            TEXT NOT NULL DEFAULT 'analyst',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- SOC workspace tables
-- ==========================================

-- Threat Intelligence: Indicators of Compromise (IOCs)
CREATE TABLE IF NOT EXISTS ti_iocs (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value       TEXT UNIQUE NOT NULL,
    type        TEXT NOT NULL,
    severity    TEXT NOT NULL,
    source      TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Threat Intelligence: Threat Actors
CREATE TABLE IF NOT EXISTS ti_actors (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    aliases     TEXT,
    origin      TEXT,
    description TEXT NOT NULL
);

-- Threat Intelligence: the analyst-facing alert feed.
--
-- Separate from `ti_iocs` because the two answer different questions. An IOC
-- is a machine-matchable artefact (a hash, a domain) that belongs in a
-- detection rule; an alert is the human-readable event an analyst triages
-- and closes. One alert can reference many IOCs, and most alerts — a dark
-- web mention, a leaked credential set — carry no IOC at all.
--
-- `is_tailored` marks an alert raised because it matches this customer's own
-- assets, brand, or sector, as opposed to general intelligence. It is the
-- first thing an analyst filters on, so it is stored rather than derived.
CREATE TABLE IF NOT EXISTS ti_alerts (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title        TEXT    NOT NULL,
    category     TEXT    NOT NULL,
    severity     TEXT    NOT NULL,
    source       TEXT    NOT NULL,
    actor        TEXT,
    is_tailored  BOOLEAN NOT NULL DEFAULT FALSE,
    detected_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ti_alerts_detected ON ti_alerts(detected_at);
CREATE INDEX IF NOT EXISTS idx_ti_alerts_severity ON ti_alerts(severity);

-- Digital Risk Protection: brand abuse found outside the perimeter.
--
-- Named for phishing domains because that is what it first held, but the
-- `channel` column is what makes it useful: impersonation shows up on social
-- platforms, marketplaces, and app stores as often as it does on a
-- registered lookalike domain, and a brand team needs all of it in one list.
--
-- `takedown_at` being nullable is the point of the table — the gap between
-- `discovered_at` and it is the number the team is measured on.
CREATE TABLE IF NOT EXISTS drp_phishing (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    domain        TEXT UNIQUE NOT NULL,
    status        TEXT NOT NULL,
    channel       TEXT,
    risk          TEXT,
    takedown_at   TIMESTAMPTZ,
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drp_phishing_discovered ON drp_phishing(discovered_at);
CREATE INDEX IF NOT EXISTS idx_drp_phishing_status     ON drp_phishing(status);

-- Fraud Protection: scored sessions and transactions.
--
-- `signal` records which detector fired (device spoofing, bot automation,
-- credential stuffing …). Storing it per case rather than recomputing means
-- the dashboard's breakdown is a GROUP BY over what actually happened, not a
-- second guess at the scoring engine's reasoning.
--
-- `channel` and `country` exist for the same reason: fraud patterns differ
-- sharply between web and mobile and between regions, and an analyst's first
-- question about a spike is always where it came from.
CREATE TABLE IF NOT EXISTS fraud_cases (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id     TEXT NOT NULL,
    risk_score     INTEGER NOT NULL,
    status         TEXT NOT NULL,
    signal         TEXT,
    channel        TEXT,
    country        TEXT,
    detected_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fraud_cases_detected ON fraud_cases(detected_at);
CREATE INDEX IF NOT EXISTS idx_fraud_cases_status   ON fraud_cases(status);

-- Attack Surface Management: externally reachable assets.
--
-- `is_shadow_it` marks an asset discovery found that nobody had declared —
-- the single most useful column on the table, because a forgotten host is
-- what an attacker reaches first. It is stored rather than inferred, since
-- only the discovery run knows whether the asset was in the declared
-- inventory at the time it was found.
--
-- `exposure_score` is per-asset and set by the scanner; the dashboard
-- aggregates it rather than recomputing what the scanner already decided.
CREATE TABLE IF NOT EXISTS asm_assets (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    host           TEXT    NOT NULL,
    asset_type     TEXT    NOT NULL,
    service        TEXT,
    port           INTEGER,
    issue          TEXT,
    exposure_score INTEGER NOT NULL DEFAULT 0,
    is_shadow_it   BOOLEAN NOT NULL DEFAULT FALSE,
    status         TEXT    NOT NULL DEFAULT 'active',
    discovered_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asm_assets_discovered ON asm_assets(discovered_at);
CREATE INDEX IF NOT EXISTS idx_asm_assets_status     ON asm_assets(status);

-- Business Email Protection: messages the gateway acted on.
--
-- `has_payload` separates the two halves of the problem. Attachment and link
-- attacks are caught by detonation; business email compromise carries nothing
-- to detonate and is caught on language and context instead. A dashboard that
-- did not distinguish them would hide which half is actually working.
CREATE TABLE IF NOT EXISTS bep_messages (
    id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject           TEXT    NOT NULL,
    sender            TEXT    NOT NULL,
    recipient         TEXT    NOT NULL,
    threat_type       TEXT    NOT NULL,
    verdict           TEXT    NOT NULL,
    has_payload       BOOLEAN NOT NULL DEFAULT TRUE,
    confidence        INTEGER NOT NULL DEFAULT 0,
    detected_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bep_messages_detected ON bep_messages(detected_at);
CREATE INDEX IF NOT EXISTS idx_bep_messages_verdict  ON bep_messages(verdict);

-- Managed XDR: detections across the monitored layers.
--
-- Separate from `incidents`: a detection is what a rule fired on, an incident
-- is what an analyst opened after confirming one or correlating several. The
-- ratio between the two tables is the number the SOC is actually judged on.
CREATE TABLE IF NOT EXISTS xdr_detections (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rule         TEXT    NOT NULL,
    layer        TEXT    NOT NULL,
    severity     TEXT    NOT NULL,
    status       TEXT    NOT NULL DEFAULT 'open',
    host         TEXT,
    technique    TEXT,
    detected_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xdr_detections_detected ON xdr_detections(detected_at);
CREATE INDEX IF NOT EXISTS idx_xdr_detections_status   ON xdr_detections(status);
CREATE INDEX IF NOT EXISTS idx_xdr_detections_severity ON xdr_detections(severity);

-- Incident Response: Cases
CREATE TABLE IF NOT EXISTS incidents (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       TEXT NOT NULL,
    severity    TEXT NOT NULL,
    status      TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Authentication
-- ==========================================

-- Refresh tokens.
--
-- Only a SHA-256 hash of each token is stored. A stolen database therefore
-- yields no usable credentials, exactly as with password hashes.
--
-- `family_id` groups a token with every token it was rotated into. If a token
-- that has already been rotated is presented again, the original was captured
-- by someone, so the whole family is revoked rather than just that token.
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT    NOT NULL UNIQUE,
    family_id   TEXT    NOT NULL,
    issued_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ    NOT NULL,
    revoked_at  TIMESTAMPTZ,
    used_at     TIMESTAMPTZ,
    ip_address  TEXT,
    user_agent  TEXT
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_user       ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_family     ON refresh_tokens(family_id);

-- Password reset tokens.
--
-- Same shape as refresh_tokens (opaque token, stored only as a hash) but a
-- separate table rather than a shared one: a reset token authorises exactly
-- one action (set a new password) and expires in minutes, not days, so
-- mixing the two would mean every query needs to filter by purpose.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT    NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ    NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
    ip_address  TEXT
);

CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_reset_user       ON password_reset_tokens(user_id);

-- Authentication audit trail.
--
-- Email is recorded as text rather than a foreign key so that failed attempts
-- against addresses which do not exist are still captured — those are usually
-- the most interesting entries.
CREATE TABLE IF NOT EXISTS auth_events (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    email       TEXT,
    event       TEXT NOT NULL,
    detail      TEXT,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_events_email   ON auth_events(email);
CREATE INDEX IF NOT EXISTS idx_auth_events_created ON auth_events(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Demo requests submitted from the product pages.
--
-- Written by an unauthenticated visitor and read only by a signed-in
-- analyst, so every column here is untrusted input. Lengths are bounded by
-- the Pydantic model rather than by the schema, because SQLite does not
-- enforce VARCHAR limits — the bound has to live where it is actually
-- checked.
--
-- `status` lets the team work the queue without a second table; it moves
-- new -> contacted -> closed and is the only column the platform itself
-- writes after insert.
CREATE TABLE IF NOT EXISTS demo_requests (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_slug  TEXT    NOT NULL,
    name          TEXT    NOT NULL,
    company       TEXT    NOT NULL,
    email         TEXT    NOT NULL,
    role          TEXT    NOT NULL,
    context       TEXT,
    status        TEXT    NOT NULL DEFAULT 'new',
    ip_address    TEXT,
    created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_created ON demo_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status  ON demo_requests(status);
"""
