import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
import { getSharedProducts, saveSharedProducts } from "@/lib/catalog-storage";
import type { Product } from "@/types";

async function authenticated(request: NextRequest) {
  return !!(await verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? ""));
}

export async function GET(request: NextRequest) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const response = NextResponse.json({ products: await getSharedProducts() });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function PUT(request: NextRequest) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  let body: { products?: Product[] };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!Array.isArray(body.products) || body.products.length > 5000) return NextResponse.json({ error: "Invalid product list." }, { status: 400 });
  const slugs = new Set<string>();
  for (const product of body.products) {
    if (!product || typeof product.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug) || typeof product.name !== "string" || !product.name.trim() || slugs.has(product.slug)) {
      return NextResponse.json({ error: "Every product needs a unique valid slug and name." }, { status: 400 });
    }
    slugs.add(product.slug);
  }
  try {
    await saveSharedProducts(body.products);
    const response = NextResponse.json({ ok: true });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ error: "Could not save products. Check the Neon database configuration." }, { status: 503 });
  }
}
