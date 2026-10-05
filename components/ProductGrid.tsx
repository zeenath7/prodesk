"use client";
import { useMemo, useState } from "react";
import FilterPanel, { FilterState } from "./FilterPanel";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface Props { products: Product[]; initialCategory?: string; showFilters?: boolean }

export default function ProductGrid({ products, initialCategory = "", showFilters = true }: Props) {
  const [f, setF] = useState<FilterState>({ q: "", category: initialCategory, brand: "", sort: "popular" });
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))), [products]);

  const list = useMemo(() => {
    const q = f.q.toLowerCase();
    // Search matches the product name and every item code and description
    const hay = (p: Product) => `${p.name} ${p.sku} ${(p.items ?? []).map((i) => `${i.code} ${i.description}`).join(" ")}`.toLowerCase();
    let out = products.filter((p) => (!q || hay(p).includes(q)) && (!f.category || p.category === f.category) && (!f.brand || p.brand === f.brand));
    if (f.sort === "az") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (f.sort === "newest") out = [...out].reverse();
    return out;
  }, [products, f]);

  return (
    <div>
      {showFilters && <FilterPanel state={f} brands={brands} onChange={(patch) => setF({ ...f, ...patch })} />}
      {list.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">No products match. Clear a filter or search a different term.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
