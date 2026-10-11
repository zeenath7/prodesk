import * as jose from "jose";

export const ADMIN_SESSION_COOKIE = "prodesk_admin_session";
/** 12 hours — long enough for a working day, short enough to limit stolen-cookie risk. */
export const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

export function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export async function signAdminSession(username: string): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return new jose.SignJWT({ sub: username, typ: "prodesk-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("prodesk")
    .setAudience("prodesk-admin")
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyAdminSession(token: string): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret || !token) return null;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { issuer: "prodesk", audience: "prodesk-admin" },
    );
    if (payload.typ !== "prodesk-admin" || typeof payload.sub !== "string") return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export function adminSessionCookieHeader(token: string, secure: boolean): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export const ADMIN_SESSION_CLEARED_COOKIE =
  `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
