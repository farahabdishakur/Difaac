"""SQLite schema definitions for the Difaac platform.

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
    is_new     INTEGER NOT NULL,
    sort_order INTEGER NOT NULL
);

-- Blog articles
CREATE TABLE IF NOT EXISTS blog_posts (
    slug       TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    excerpt    TEXT NOT NULL,
    date       TEXT NOT NULL,
    category   TEXT NOT NULL,
    sort_order INTEGER NOT NULL
);

-- Customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    quote      TEXT NOT NULL,
    name       TEXT NOT NULL,
    title      TEXT NOT NULL,
    company    TEXT NOT NULL,
    sort_order INTEGER NOT NULL
);

-- Miscellaneous site-wide content stored as JSON blobs
CREATE TABLE IF NOT EXISTS site_content (
    key        TEXT PRIMARY KEY,
    value_json TEXT NOT NULL
);

-- Users table for platform authentication
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name       TEXT,
    role            TEXT NOT NULL DEFAULT 'analyst',
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Group-IB Style Cybersecurity Platform Tables
-- ==========================================

-- Threat Intelligence: Indicators of Compromise (IOCs)
CREATE TABLE IF NOT EXISTS ti_iocs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    value       TEXT UNIQUE NOT NULL,
    type        TEXT NOT NULL,
    severity    TEXT NOT NULL,
    source      TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Threat Intelligence: Threat Actors
CREATE TABLE IF NOT EXISTS ti_actors (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT UNIQUE NOT NULL,
    aliases     TEXT,
    origin      TEXT,
    description TEXT NOT NULL
);

-- Digital Risk Protection (DRP): Phishing Domains
CREATE TABLE IF NOT EXISTS drp_phishing (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    domain        TEXT UNIQUE NOT NULL,
    status        TEXT NOT NULL,
    discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Intelligence: Fraud Cases/Transactions
CREATE TABLE IF NOT EXISTS fraud_cases (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id     TEXT NOT NULL,
    risk_score     INTEGER NOT NULL,
    status         TEXT NOT NULL,
    detected_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Incident Response: Cases
CREATE TABLE IF NOT EXISTS incidents (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    severity    TEXT NOT NULL,
    status      TEXT NOT NULL,
    reported_by TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT    NOT NULL UNIQUE,
    family_id   TEXT    NOT NULL,
    issued_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at  TEXT    NOT NULL,
    revoked_at  TEXT,
    used_at     TEXT,
    ip_address  TEXT,
    user_agent  TEXT
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_user       ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_family     ON refresh_tokens(family_id);

-- Authentication audit trail.
--
-- Email is recorded as text rather than a foreign key so that failed attempts
-- against addresses which do not exist are still captured — those are usually
-- the most interesting entries.
CREATE TABLE IF NOT EXISTS auth_events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    email       TEXT,
    event       TEXT NOT NULL,
    detail      TEXT,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_events_email   ON auth_events(email);
CREATE INDEX IF NOT EXISTS idx_auth_events_created ON auth_events(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
"""
