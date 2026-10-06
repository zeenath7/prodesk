import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, Layers, Tag } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, getProductsByCategory } from "@/data/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const items = getProductsByCategory(cat.slug);
  const otherCategories = categories.filter((c) => c.slug !== cat.slug);

  return (
    <main className="min-h-screen bg-slate-50/40">
      {/* Category Header */}
      <section data-scroll-reveal className="border-b border-slate-200 bg-gradient-to-b from-brand-soft/70 to-slate-50 py-10 sm:py-14">
        <div className="container-x">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
          >
            <Link href="/" className="transition-colors hover:text-brand">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <Link href="/products" className="transition-colors hover:text-brand">
              Catalogue
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <Link href="/#categories" className="transition-colors hover:text-brand">
              Categories
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="font-semibold text-ink">{cat.name}</span>
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-bold text-brand mb-2">
                <Layers className="h-3.5 w-3.5" />
                <span>{items.length} Products in this Category</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
                {cat.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <Link
              href="/products"
              className="btn-outline !min-h-10 text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Products */}
      <section data-scroll-reveal className="container-x py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-slate-500">
              Loading category products...
            </div>
          }
        >
          <ProductGrid products={items} showFilters={true} initialCategory={cat.slug} />
        </Suspense>

        {/* Other Categories Selector */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-ink mb-4">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-soft/30 transition-all shadow-2xs"
              >
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
