import Link from "next/link";
import Placeholder from "./Placeholder";
import { formatPrice } from "@/lib/utils";
import { getCategory } from "@/data/catalog";
import type { Product } from "@/types";

export default function ProductCard({ product: p }: { product: Product }) {
  const n = p.items?.length ?? 0;
  return (
    <article data-scroll-reveal className="product-card flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${p.slug}`} className="block overflow-hidden">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/products/${p.image}`} alt={p.name} loading="lazy" className="aspect-square w-full bg-white object-contain p-3" />
        ) : (
          <Placeholder icon="Package" className="aspect-square" />
        )}
      </Link>
      <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
        <p className="text-xs text-slate-500">{[p.brand, getCategory(p.category)?.name].filter(Boolean).join(" · ")}</p>
        <h3 className="mt-1 text-base font-semibold"><Link href={`/products/${p.slug}`} className="hover:text-brand">{p.name}</Link></h3>
        {n > 0 && <p className="mt-0.5 text-xs text-slate-500">{n} {n === 1 ? "item" : "items"} · sizes &amp; codes inside</p>}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">{formatPrice(p.price)}</span>
          <span className="text-emerald-700">{p.availability}</span>
        </div>
        <div className="mt-4 grid gap-2">
          <Link href={`/products/${p.slug}`} className="btn-outline !py-2.5">View items</Link>
          <Link href={`/enquiry?product=${encodeURIComponent(p.name)}`} className="btn-primary !py-2.5">Request a Quote</Link>
        </div>
      </div>
    </article>
  );
}
