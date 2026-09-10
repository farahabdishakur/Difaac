-- The role the application connects as.
--
-- Run once by the postgres image on first start (mounted into
-- /docker-entrypoint-initdb.d), as the bootstrap superuser.
--
-- Why this file exists at all: the image creates POSTGRES_USER as a
-- **superuser**, and a superuser is exempt from row-level security. The
-- deployment pointed DATABASE_URL at that user, so every tenant isolation
-- policy the application installs was inert on the live server — the policies
-- existed, the catalogue reported the tables as protected, and every query
-- still returned every tenant's rows. FORCE ROW LEVEL SECURITY does not help;
-- it makes policies apply to the table *owner*, and says nothing about a
-- superuser.
--
-- So the application gets its own ordinary role. It owns the database and the
-- schema, which is what lets it run its own migrations, and it holds neither
-- SUPERUSER nor BYPASSRLS, which is what makes the policies bite.
--
-- The bootstrap superuser stays, and is what an operator uses for backups,
-- restores and anything that has to cross tenants deliberately.

\set app_password `echo "$DIFAAC_APP_DB_PASSWORD"`

CREATE ROLE difaac_app
    LOGIN
    PASSWORD :'app_password'
    NOSUPERUSER
    NOBYPASSRLS
    NOCREATEDB
    NOCREATEROLE;

-- Ownership, not just privileges. The application creates its own tables on
-- first start, and a role that cannot own them cannot create them.
ALTER DATABASE difaac OWNER TO difaac_app;
ALTER SCHEMA public OWNER TO difaac_app;
GRANT ALL ON SCHEMA public TO difaac_app;
