import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const scrypt = promisify(scryptCallback);

const SCRYPT_KEYLEN = 64;

export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL ?? null;
}

export function isNeonConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) return null;
  if (!cachedSql) cachedSql = neon(url);
  return cachedSql;
}

export async function ensureAdminUsersTable(
  sql: NeonQueryFunction<false, false>,
): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    )
  `;
}

export interface AdminUserRow {
  id: number;
  username: string;
  password_hash: string;
}

export async function countAdminUsers(
  sql: NeonQueryFunction<false, false>,
): Promise<number> {
  const rows = await sql`SELECT COUNT(*)::int AS count FROM admin_users`;
  return (rows[0] as { count: number }).count;
}

export async function findAdminUser(
  sql: NeonQueryFunction<false, false>,
  username: string,
): Promise<AdminUserRow | null> {
  const rows = await sql`
    SELECT id, username, password_hash FROM admin_users
    WHERE LOWER(username) = LOWER(${username}) LIMIT 1
  `;
  return (rows[0] as AdminUserRow | undefined) ?? null;
}

export async function createAdminUser(
  sql: NeonQueryFunction<false, false>,
  username: string,
  passwordHash: string,
): Promise<void> {
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;
}

export async function markAdminLogin(
  sql: NeonQueryFunction<false, false>,
  id: number,
): Promise<void> {
  await sql`UPDATE admin_users SET last_login_at = NOW() WHERE id = ${id}`;
}

/** scrypt hash in `scrypt$<salt-hex>$<hash-hex>` format (N=16384, r=8, p=1). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, SCRYPT_KEYLEN)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  try {
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = (await scrypt(password, salt, expected.length)) as Buffer;
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Bootstrap credentials from env — used when Neon has no users yet, or when Neon is not configured. */
export function getBootstrapCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}
