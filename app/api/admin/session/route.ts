import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const username = await verifyAdminSession(token);
  const response = NextResponse.json(
    username ? { authenticated: true, username } : { authenticated: false },
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
