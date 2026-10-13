import { products } from "@/data/catalog";
import type { Product } from "@/types";
import { getSql } from "@/lib/admin-auth";

export async function getSharedProducts(): Promise<Product[]> {
  const sql = getSql();
  if (!sql) return products;
  try {
    await sql`CREATE TABLE IF NOT EXISTS site_content (content_key TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`INSERT INTO site_content (content_key, content) VALUES ('products', ${JSON.stringify(products)}::jsonb) ON CONFLICT (content_key) DO NOTHING`;
    const rows = await sql`SELECT content FROM site_content WHERE content_key = 'products' LIMIT 1`;
    const value = rows[0]?.content as Product[] | undefined;
    return Array.isArray(value) ? value : products;
  } catch {
    return products;
  }
}

export async function saveSharedProducts(value: Product[]): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("Neon database is not configured.");
  await sql`CREATE TABLE IF NOT EXISTS site_content (content_key TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`INSERT INTO site_content (content_key, content) VALUES ('products', ${JSON.stringify(value)}::jsonb) ON CONFLICT (content_key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`;
}
