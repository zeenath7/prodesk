// Creates or resets a ProDesk admin user in Neon Postgres.
// Usage: npm run admin:create -- <username> <password>
// Env: DATABASE_URL (or NEON_DATABASE_URL)
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scryptAsync = promisify(scrypt);

const username = process.argv[2];
const password = process.argv[3];
const connectionString = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;

if (!username || !password) {
  console.error("Usage: npm run admin:create -- <username> <password>");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}
if (!connectionString) {
  console.error("DATABASE_URL (or NEON_DATABASE_URL) is not set.");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scryptAsync(password, salt, 64);
const hash = `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
  )
`;
await sql`
  INSERT INTO admin_users (username, password_hash)
  VALUES (${username}, ${hash})
  ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
`;
console.log(`Admin user "${username}" saved.`);
