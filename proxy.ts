import { NextRequest, NextResponse } from "next/server";

function unauthorized(message: string, status = 401) {
  return new NextResponse(message, {
    status,
    headers: {
      "WWW-Authenticate": 'Basic realm="ProDesk Admin", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return unauthorized("Admin authentication is not configured.", 503);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    return unauthorized("Authentication required.");
  }

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    const suppliedUsername = separator >= 0 ? decoded.slice(0, separator) : "";
    const suppliedPassword = separator >= 0 ? decoded.slice(separator + 1) : "";

    if (suppliedUsername !== username || suppliedPassword !== password) {
      return unauthorized("Invalid admin credentials.");
    }
  } catch {
    return unauthorized("Invalid authentication header.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
