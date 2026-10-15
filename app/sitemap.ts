import type { MetadataRoute } from "next";
import { categories } from "@/data/catalog";
import { getSharedProducts } from "@/lib/catalog-storage";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // Resolve shared catalogue so admin-added products in Neon are included.
  // Falls back to static data when the database is not configured.
  let productSlugs: string[] = [];
  try {
    const shared = await getSharedProducts();
    productSlugs = shared.map((p) => p.slug);
  } catch {
    productSlugs = [];
  }

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categories.map((c) => ({
      url: `${SITE_URL}/categories/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/enquiry`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
