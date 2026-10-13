import { cache } from "react";
import { products } from "@/data/catalog";
import { company, type CompanyInfo } from "@/data/company";
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
    if (!Array.isArray(value)) return products;
    // Repair products saved before the category slug was corrected in the source catalogue.
    const normalized = value.map((product) =>
      product.category === "binding-comb-and-spine-bar"
        ? { ...product, category: "spine-bar" }
        : product,
    );
    if (normalized.some((product, index) => product !== value[index])) {
      await saveSharedProducts(normalized);
    }
    return normalized;
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

async function readContent(key: string): Promise<unknown> {
  const sql = getSql();
  if (!sql) throw new Error("Neon database is not configured.");
  await sql`CREATE TABLE IF NOT EXISTS site_content (content_key TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  const rows = await sql`SELECT content FROM site_content WHERE content_key = ${key} LIMIT 1`;
  return (rows[0] as { content: unknown } | undefined)?.content ?? null;
}

async function writeContent(key: string, value: unknown): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("Neon database is not configured.");
  await sql`CREATE TABLE IF NOT EXISTS site_content (content_key TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`INSERT INTO site_content (content_key, content) VALUES (${key}, ${JSON.stringify(value)}::jsonb) ON CONFLICT (content_key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`;
}

/** Shared company profile. Request-memoized; falls back to static data without Neon. */
export const getSharedCompany = cache(async (): Promise<CompanyInfo> => {
  try {
    const stored = await readContent("company");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return company;
    const overlay: Partial<CompanyInfo> = {};
    for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
      if (typeof value === "string" && key in company && value.trim()) {
        (overlay as Record<string, string>)[key] = value;
      }
    }
    return { ...company, ...overlay };
  } catch {
    return company;
  }
});

export async function saveSharedCompany(value: CompanyInfo): Promise<void> {
  await writeContent("company", value);
}
