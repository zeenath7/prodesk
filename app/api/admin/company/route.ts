import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
import { getSharedCompany, saveSharedCompany } from "@/lib/catalog-storage";
import { company, type CompanyInfo } from "@/data/company";

export const runtime = "nodejs";

async function authenticated(request: NextRequest) {
  return !!(await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? ""));
}

function pickStrings(input: unknown): Partial<CompanyInfo> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out: Partial<CompanyInfo> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (typeof value === "string" && key in company) {
      (out as Record<string, string>)[key] = value;
    }
  }
  return out;
}

export async function GET(request: NextRequest) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const response = NextResponse.json({ company: await getSharedCompany() });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function PUT(request: NextRequest) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  let body: { company?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const overlay = pickStrings(body.company);
  if (!overlay.name?.trim() || !overlay.email?.includes("@") || !overlay.phone?.trim()) {
    return NextResponse.json({ error: "Company name, phone, and a valid email are required." }, { status: 400 });
  }
  try {
    const current = await getSharedCompany();
    await saveSharedCompany({ ...current, ...overlay });
    const response = NextResponse.json({ ok: true });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ error: "Could not save company details. Check the Neon database configuration." }, { status: 503 });
  }
}
