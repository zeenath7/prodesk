// Prints a scrypt password hash (and ready-to-run Neon SQL) for seeding admin_users.
// Usage: node scripts/hash-password.mjs <username> <password>
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: node scripts/hash-password.mjs <username> <password>");
  process.exit(1);
}
const salt = randomBytes(16);
const derived = await scryptAsync(password, salt, 64);
const hash = `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
console.log(`-- Run in Neon SQL Editor to create/reset admin "${username}":`);
console.log(`INSERT INTO admin_users (username, password_hash)`);
console.log(`VALUES ('${username.replace(/'/g, "''")}', '${hash}')`);
console.log(`ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;`);
