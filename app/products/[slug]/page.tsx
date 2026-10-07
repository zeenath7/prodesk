import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Check,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductItemsTable from "@/components/ProductItemsTable";
import ProductPhoto from "@/components/ProductPhoto";
import { products, getCategory } from "@/data/catalog";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const category = getCategory(p.category);
  const related = products
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .slice(0, 4);
  const items = p.items ?? [];

  return (
    <main className="min-h-screen bg-white py-8 sm:py-10">
      <div className="container-x">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link href="/products" className="hover:text-brand transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href={`/categories/${category?.slug ?? p.category}`}
            className="hover:text-brand transition-colors"
          >
            {category?.name || p.category}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="font-semibold text-slate-800 truncate max-w-[240px] sm:max-w-none">
            {p.name}
          </span>
        </nav>

        {/* Product Overview Section */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Product Photo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
              <ProductPhoto slug={p.slug} name={p.name} className="absolute inset-0" />

              {p.brand && (
                <span className="absolute top-3 left-3 rounded bg-white px-2 py-0.5 text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs">
                  {p.brand}
                </span>
              )}

              <span className="absolute top-3 right-3 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                {p.availability || "In Stock"}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Representative product image. Packaging, color and finish may vary by size or model.
            </p>

          </div>

          {/* Right Column: Product Details & Quote Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {category?.name || p.category} {p.brand ? `· ${p.brand}` : ""}
              </p>

              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {p.name}
              </h1>

              {items.length > 0 && (
                <p className="mt-2 text-xs sm:text-sm text-slate-600">
                  Available in <strong>{items.length}</strong> sizes and item specifications below.
                </p>
              )}
            </div>

            {/* Wholesale Pricing Indicator */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Pricing Status</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {formatPrice(p.price)}
                </p>
              </div>
              <span className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                Master Carton &amp; Bulk Rates
              </span>
            </div>

            {/* Quantity and Quote Basket Actions */}
            <ProductDetailActions product={p} />

            {/* Supply Assurances */}
            <div className="pt-5 border-t border-slate-200 grid grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand shrink-0" />
                <span>Original Brand Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand shrink-0" />
                <span>Al Malaz Showrooms in Riyadh</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand shrink-0" />
                <span>Official ZATCA VAT Invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand shrink-0" />
                <span>Bulk Carton &amp; Pallet Logistics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item Specification Table */}
        {items.length > 0 && (
          <section className="mt-12 pt-10 border-t border-slate-200">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Available Sizes &amp; Packaging Specifications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your required item codes to add them to your wholesale quote request.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {items.length} Specifications
              </span>
            </div>

            <ProductItemsTable product={p} items={items} />
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Related in {category?.name || "Category"}
              </h2>
              <Link
                href={`/categories/${p.category}`}
                className="text-xs font-bold text-brand hover:underline"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
