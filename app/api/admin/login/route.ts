import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieHeader,
  getAuthSecret,
  signAdminSession,
} from "@/lib/admin-session";
import {
  countAdminUsers,
  createAdminUser,
  ensureAdminUsersTable,
  findAdminUser,
  getBootstrapCredentials,
  getSql,
  hashPassword,
  markAdminLogin,
  verifyPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

// Best-effort per-instance login throttling. For multi-instance production,
// move this to a shared store (Neon table / Redis).
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  if (!getAuthSecret()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured (AUTH_SECRET missing)." },
      { status: 503 },
    );
  }

  let username = "";
  let password = "";
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    username = typeof body.username === "string" ? body.username.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!username || !password || username.length > 128 || password.length > 256) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const sql = getSql();

  // Neon-backed verification when DATABASE_URL is set.
  if (sql) {
    try {
      await ensureAdminUsersTable(sql);
    } catch {
      return NextResponse.json(
        { error: "Admin database is unavailable. Try again later." },
        { status: 503 },
      );
    }

    const user = await findAdminUser(sql, username);
    if (user && (await verifyPassword(password, user.password_hash))) {
      await markAdminLogin(sql, user.id).catch(() => undefined);
      return authenticatedResponse(request, user.username);
    }

    // First-run bootstrap: seed the Neon admin from env credentials.
    const total = await countAdminUsers(sql).catch(() => -1);
    const bootstrap = getBootstrapCredentials();
    if (
      total === 0 &&
      bootstrap &&
      username.toLowerCase() === bootstrap.username.toLowerCase() &&
      password === bootstrap.password
    ) {
      await createAdminUser(sql, bootstrap.username, await hashPassword(bootstrap.password));
      const seeded = await findAdminUser(sql, bootstrap.username);
      if (seeded) await markAdminLogin(sql, seeded.id).catch(() => undefined);
      return authenticatedResponse(request, bootstrap.username);
    }

    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  // No Neon configured — fall back to env bootstrap credentials.
  const bootstrap = getBootstrapCredentials();
  if (
    bootstrap &&
    username.toLowerCase() === bootstrap.username.toLowerCase() &&
    password === bootstrap.password
  ) {
    return authenticatedResponse(request, bootstrap.username);
  }

  return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
}

async function authenticatedResponse(request: NextRequest, username: string) {
  const token = await signAdminSession(username);
  const secure =
    process.env.NODE_ENV === "production" ||
    request.headers.get("x-forwarded-proto") === "https";
  const response = NextResponse.json({ ok: true, username });
  response.headers.set("Set-Cookie", adminSessionCookieHeader(token, secure));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
