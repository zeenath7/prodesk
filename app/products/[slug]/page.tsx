import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import ProductCard from "@/components/ProductCard";
import { products, getCategory } from "@/data/catalog";
import { formatPrice, waLink } from "@/lib/utils";

export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }

const dash = (v: string) => (v && v.replace(/\*/g, "") ? v : "—");

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const category = getCategory(p.category);
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const items = p.items ?? [];

  return (
    <main className="container-x py-12">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href={`/categories/${p.category}`} className="hover:text-brand">{category?.name}</Link> / <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="order-2 rounded-md border border-slate-200 bg-white p-4 lg:order-1">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/products/${p.image}`} alt={p.name} className="aspect-square w-full object-contain" />
          ) : (
            <Placeholder icon="Package" className="aspect-square" />
          )}
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm text-slate-500">{[p.brand, category?.name].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{p.name}</h1>
          {items.length > 0 && <p className="mt-3 text-slate-600">{items.length} {items.length === 1 ? "item" : "items"} available in this range.</p>}
          <p className="mt-6 text-2xl font-semibold text-ink">{formatPrice(p.price)}</p>
          <p className="mt-1 text-sm text-emerald-700">{p.availability}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/enquiry?product=${encodeURIComponent(p.name)}`} className="btn-primary">Add to Enquiry</Link>
            <a href={waLink(`Hello ProDesk, I would like to enquire about ${p.name}.`)} className="btn-outline"><MessageCircle className="h-4 w-4" />WhatsApp Enquiry</a>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <section data-scroll-reveal className="mt-16">
          <h2 className="text-2xl font-semibold">Items &amp; specifications</h2>
          <div className="mt-4 overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Box</th><th className="px-4 py-3">Ctn</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{it.code}</td>
                    <td className="px-4 py-3">{it.description}</td>
                    <td className="px-4 py-3">{dash(it.unit)}</td>
                    <td className="px-4 py-3">{dash(it.box)}</td>
                    <td className="px-4 py-3">{dash(it.ctn)}</td>
                    <td className="px-4 py-3 text-right"><Link href={`/enquiry?product=${encodeURIComponent(`${p.name} ${it.code}`)}`} className="font-semibold text-brand hover:underline">Enquire</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.tableImage && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-medium text-brand">View original catalogue table</summary>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/tables/${p.tableImage}`} alt={`${p.name} catalogue table`} className="mt-3 w-full max-w-3xl rounded-md border border-slate-200" />
            </details>
          )}
        </section>
      )}

      {related.length > 0 && (
        <section data-scroll-reveal className="mt-16">
          <h2 className="text-2xl font-semibold">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} product={r} />)}</div>
        </section>
      )}
    </main>
  );
}
