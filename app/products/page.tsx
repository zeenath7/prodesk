import { Suspense } from "react";
import Link from "next/link";
import { Package, Sparkles, ChevronRight, Layers } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { products, categories, getCategory, getProductsByCategory } from "@/data/catalog";

export const metadata = {
  title: "All Products & Wholesale Catalogue (180+ Lines) | ProDesk Riyadh",
  description:
    "Browse ProDesk's complete commercial catalog of 180+ office stationery lines, filing systems, whiteboards, paper rolls, and desk organizers with bulk carton pricing in Saudi Arabia.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category: categoryParam } = await searchParams;
  const categorySlug = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const selectedCategory = categorySlug ? getCategory(categorySlug) : undefined;
  const selectedProducts = selectedCategory
    ? getProductsByCategory(selectedCategory.slug)
    : products;

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
                    ? `${selectedProducts.length} Products in ${selectedCategory.name}`
                    : `${products.length} Commercial Product Lines`}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
                {selectedCategory?.name ?? "Office & Institutional Supplies Catalogue"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
                Filter by category, search by specific item code (e.g. DE-108, 96621), or narrow down by brand. Add items directly to your Quote Basket for instant wholesale pricing.
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

          {/* Quick Category Jump Bar */}
          <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 mr-1 self-center">
              Quick jump:
            </span>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-soft/40 transition-colors shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
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
          <ProductGrid products={products} initialCategory={selectedCategory?.slug ?? ""} />
        </Suspense>
      </section>
    </main>
  );
}
