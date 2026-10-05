import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, products } from "@/data/catalog";

export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const items = products.filter((p) => p.category === cat.slug);

  return (
    <main>
      <section data-scroll-reveal className="border-b border-slate-200 bg-brand-soft">
        <div className="container-x py-12">
          <nav className="text-sm text-slate-500"><Link href="/" className="hover:text-brand">Home</Link> / <Link href="/#categories" className="hover:text-brand">Categories</Link> / <span className="text-ink">{cat.name}</span></nav>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{cat.description}</p>
        </div>
      </section>
      <section data-scroll-reveal className="container-x py-12">
        <ProductGrid products={items} showFilters={false} />
        <h2 className="mt-16 text-2xl font-semibold">Other categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`} className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand">{c.name}</Link>
          ))}
        </div>
      </section>
    </main>
  );
}
