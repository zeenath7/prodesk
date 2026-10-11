import type { NeonQueryFunction } from "@neondatabase/serverless";
import { getSql } from "@/lib/admin-auth";

type Sql = NeonQueryFunction<false, false>;

export function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN ?? null;
}

export async function ensureProductImagesTable(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS product_images (
      slug TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

/** slug -> uploaded image URL. Returns {} when Neon is not configured or unreachable. */
export async function getProductImageMap(): Promise<Record<string, string>> {
  const sql = getSql();
  if (!sql) return {};
  try {
    await ensureProductImagesTable(sql);
    const rows = await sql`SELECT slug, image_url FROM product_images`;
    const map: Record<string, string> = {};
    for (const row of rows as { slug: string; image_url: string }[]) {
      map[row.slug] = row.image_url;
    }
    return map;
  } catch {
    return {};
  }
}

export async function getProductImage(slug: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensureProductImagesTable(sql);
    const rows = await sql`SELECT image_url FROM product_images WHERE slug = ${slug} LIMIT 1`;
    return ((rows[0] as { image_url: string } | undefined)?.image_url ?? null);
  } catch {
    return null;
  }
}

export async function setProductImage(slug: string, imageUrl: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureProductImagesTable(sql);
  await sql`
    INSERT INTO product_images (slug, image_url, updated_at)
    VALUES (${slug}, ${imageUrl}, NOW())
    ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW()
  `;
}

/** Deletes the reference; returns the previous URL (for blob cleanup) or null. */
export async function deleteProductImage(slug: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureProductImagesTable(sql);
  const rows = await sql`DELETE FROM product_images WHERE slug = ${slug} RETURNING image_url`;
  return ((rows[0] as { image_url: string } | undefined)?.image_url ?? null);
}
