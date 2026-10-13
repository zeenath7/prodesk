import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
import { getSql } from "@/lib/admin-auth";
import { products } from "@/data/catalog";
import {
  deleteProductImage,
  ensureProductImagesTable,
  getBlobToken,
  getProductImage,
  setProductImage,
} from "@/lib/product-images";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function requireAdmin(request: NextRequest): Promise<string | NextResponse> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const username = await verifyAdminSession(token);
  if (!username) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  return username;
}

function storageUnavailable(): NextResponse {
  return NextResponse.json(
    {
      error:
        "Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob store) and DATABASE_URL (Neon) in the deployment environment.",
    },
    { status: 503 },
  );
}

/**
 * Product/listing pages are statically prerendered, so purge them after an
 * image change — otherwise the new photo only appears after the next deploy.
 */
function revalidateProductPages(slug: string): void {
  try {
    revalidatePath(`/products/${slug}`);
    revalidatePath("/products");
    revalidatePath("/");
    const category = products.find((product) => product.slug === slug)?.category;
    if (category) revalidatePath(`/categories/${category}`);
  } catch {
    // Revalidation is best-effort; the upload itself already succeeded.
  }
}

/** GET ?slug=… → { url } — lets the editor prefill the persisted image. */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const slug = request.nextUrl.searchParams.get("slug")?.trim() ?? "";
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  if (!getSql()) return storageUnavailable();

  const url = await getProductImage(slug);
  const response = NextResponse.json({ url });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/** POST multipart { slug, file } → { url }. Uploads to Vercel Blob, saves ref in Neon. */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const token = getBlobToken();
  const sql = getSql();
  if (!token || !sql) return storageUnavailable();

  let slug = "";
  let file: File | null = null;
  try {
    const form = await request.formData();
    slug = String(form.get("slug") ?? "").trim().toLowerCase();
    const entry = form.get("file");
    file = entry instanceof File ? entry : null;
  } catch {
    return NextResponse.json({ error: "Invalid upload body." }, { status: 400 });
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid product slug." }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file selected." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, or WebP images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 4 MB or smaller." }, { status: 400 });
  }

  try {
    await ensureProductImagesTable(sql);
  } catch {
    return NextResponse.json(
      { error: "Admin database is unavailable. Try again later." },
      { status: 503 },
    );
  }

  let url: string;
  try {
    const blob = await put(`products/${slug}-${Date.now()}.${ext}`, file, {
      access: "public",
      token,
      contentType: file.type,
    });
    url = blob.url;
  } catch {
    return NextResponse.json(
      { error: "Image store upload failed. Check BLOB_READ_WRITE_TOKEN." },
      { status: 502 },
    );
  }

  const previous = await getProductImage(slug);
  await setProductImage(slug, url);
  if (previous && previous !== url) {
    await del(previous, { token }).catch(() => undefined);
  }
  revalidateProductPages(slug);

  const response = NextResponse.json({ url });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/** DELETE ?slug=… → removes the Neon reference (and the blob, best-effort). */
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const token = getBlobToken();
  const sql = getSql();
  if (!token || !sql) return storageUnavailable();

  const slug = request.nextUrl.searchParams.get("slug")?.trim().toLowerCase() ?? "";
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });

  try {
    const previous = await deleteProductImage(slug);
    if (previous) await del(previous, { token }).catch(() => undefined);
    revalidateProductPages(slug);
  } catch {
    return NextResponse.json(
      { error: "Admin database is unavailable. Try again later." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
