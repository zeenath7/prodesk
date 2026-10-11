-- ProDesk admin users (Neon Postgres).
-- Applied automatically at login via ensureAdminUsersTable(); this file is the
-- source of truth for manual inspection / psql use.
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
