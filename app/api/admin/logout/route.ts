import { NextResponse } from "next/server";
import { ADMIN_SESSION_CLEARED_COOKIE } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", ADMIN_SESSION_CLEARED_COOKIE);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
