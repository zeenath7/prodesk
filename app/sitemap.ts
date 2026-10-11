import type { MetadataRoute } from "next";
import { categories, products } from "@/data/catalog";

const siteUrl = "https://prodeskonline.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/enquiry`, changeFrequency: "yearly", priority: 0.6 },
    ...categories.map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
