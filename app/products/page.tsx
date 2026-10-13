import { Suspense } from "react";
import Link from "next/link";
import { Package, Sparkles, ChevronRight, Layers } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { getCategory } from "@/data/catalog";
import { getSharedProducts } from "@/lib/catalog-storage";
import { MARKETING_PRODUCT_COUNT } from "@/lib/seo";
import { getProductImageMap } from "@/lib/product-images";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const products = await getSharedProducts();
  const categorySlug = Array.isArray(category) ? category[0] : category;
  const selectedCategory = categorySlug ? getCategory(categorySlug) : undefined;

  return {
    title: selectedCategory
      ? `${selectedCategory.name} Products | ProDesk Riyadh`
      : "Office & School Supplies Catalogue | ProDesk Saudi Arabia",
    description: selectedCategory
      ? `${selectedCategory.description} Browse ${products.filter((product) => product.category === selectedCategory.slug).length} products and request wholesale pricing from ProDesk in Riyadh.`
      : `Browse ${MARKETING_PRODUCT_COUNT} office and school stationery products, check item codes and sizes, and request wholesale pricing from ProDesk in Riyadh, Saudi Arabia.`,
    alternates: { canonical: "/products" },
    ...(categorySlug ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category: categoryParam } = await searchParams;
  const products = await getSharedProducts();
  const categorySlug = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const selectedCategory = categorySlug ? getCategory(categorySlug) : undefined;
  const selectedProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory.slug)
    : products;
  const selectedCategoryName =
    selectedCategory?.name === "Lamination Pouch"
      ? "Lamination Pouches"
      : selectedCategory?.name;
  const imageOverrides = await getProductImageMap();

  return (
    <main className="min-h-screen bg-slate-50/40">
      {/* Page Header */}
      <section data-scroll-reveal className="border-b border-slate-200 bg-gradient-to-b from-brand-soft/70 to-slate-50 py-10 sm:py-14">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="font-semibold text-ink">Full Product Catalogue</span>
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-bold text-brand mb-2">
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {selectedCategory
                    ? `${selectedProducts.length} Products in ${selectedCategoryName}`
                    : `${products.length} products`}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
                {selectedCategoryName ?? "Office & Institutional Supplies Catalogue"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
                Browse by category, search by item code, or filter by brand. Add products to your Quote Basket to request wholesale pricing.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs text-xs text-slate-600 hidden lg:block shrink-0">
              <p className="font-bold text-ink">Need a custom tender or bulk RFQ?</p>
              <p className="text-slate-500 mt-0.5">Upload your bill of quantities via our quote desk.</p>
              <Link href="/enquiry" className="mt-2 inline-block font-bold text-brand hover:underline">
                Request Formal Quote →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Products Grid & Interactive Filters */}
      <section data-scroll-reveal className="container-x py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-slate-500">
              Loading catalogue products...
            </div>
          }
        >
          <ProductGrid products={selectedProducts} initialCategory={selectedCategory?.slug ?? ""} cataloguePage imageOverrides={imageOverrides} />
        </Suspense>
      </section>
    </main>
  );
}
