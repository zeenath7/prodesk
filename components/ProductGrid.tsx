"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, LayoutGrid, Package, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { categories, getCategory, getProductCategorySlug } from "@/data/catalog";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  initialCategory?: string;
  initialBrand?: string;
  initialQuery?: string;
  showFilters?: boolean;
  cataloguePage?: boolean;
}

const PAGE_SIZE = 24;

export default function ProductGrid({
  products,
  initialCategory = "",
  initialBrand = "",
  initialQuery = "",
  showFilters = true,
  cataloguePage = false,
}: Props) {
  const params = useSearchParams();
  const urlQ = params?.get("q") ?? initialQuery;
  const urlBrand = params?.get("brand") ?? initialBrand;
  const categoryParam = params?.get("category");
  const urlCategory = categoryParam
    ? getCategory(categoryParam)?.slug ?? categoryParam
    : initialCategory;

  const [q, setQ] = useState(urlQ);
  const [category, setCategory] = useState(urlCategory);
  const [brand, setBrand] = useState(urlBrand);
  const [sort, setSort] = useState("popular");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);

  // Follow the URL when it changes (header search, links from the home page)
  useEffect(() => setQ(urlQ), [urlQ]);
  useEffect(() => setCategory(urlCategory), [urlCategory]);
  useEffect(() => setBrand(urlBrand), [urlBrand]);
  useEffect(() => setVisible(PAGE_SIZE), [q, category, brand, sort]);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))), [products]);

  // Search + brand applied first, so category counts always match what you will see
  const matched = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (!term) return true;
      const text = `${p.name} ${p.brand} ${p.category} ${p.sku} ${(p.items ?? []).map((i) => `${i.code} ${i.description}`).join(" ")}`;
      return text.toLowerCase().includes(term);
    });
  }, [products, q, brand]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    matched.forEach((p) => {
      const categorySlug = getProductCategorySlug(p);
      map[categorySlug] = (map[categorySlug] ?? 0) + 1;
    });
    return map;
  }, [matched]);

  const list = useMemo(() => {
    const out = category
      ? matched.filter((p) => getProductCategorySlug(p) === category)
      : [...matched];
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") out.sort((a, b) => b.name.localeCompare(a.name));
    return out;
  }, [matched, category, sort]);

  const displayCategoryName = (name: string) =>
    cataloguePage && name === "Lamination Pouch" ? "Lamination Pouches" : name;
  const activeName = categories.find((c) => c.slug === category)?.name;
  const activeDisplayName = activeName ? displayCategoryName(activeName) : undefined;
  const reset = () => { setQ(""); setCategory(""); setBrand(""); setSort("popular"); };

  const grid = list.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
      <Package className="mx-auto mb-3 h-12 w-12 text-slate-300" />
      <h3 className="text-lg font-bold text-ink">No matching products</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Try another word or item code, or clear the filters.</p>
      <button type="button" onClick={reset} className="btn-primary mt-5 text-xs">Clear filters</button>
    </div>
  ) : (
    <>
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${showFilters ? "2xl:grid-cols-4" : "lg:grid-cols-4"}`}>
        {list.slice(0, visible).map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
      {visible < list.length && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500">Showing {Math.min(visible, list.length)} of {list.length} products</p>
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-outline inline-flex items-center gap-2 text-sm hover:border-brand hover:text-brand">
            Load more <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );

  if (!showFilters) return grid;

  const categoryList = (
    <nav aria-label="Product categories" className="space-y-0.5">
      <CatButton active={!category} onClick={() => { setCategory(""); setDrawer(false); }} label="All products" count={matched.length} />
      {categories.map((c) => (
        <CatButton key={c.slug} active={category === c.slug} onClick={() => { setCategory(c.slug); setDrawer(false); }} label={displayCategoryName(c.name)} count={counts[c.slug] ?? 0} />
      ))}
    </nav>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <p className="px-3 pb-2 pt-1 text-sm font-bold text-slate-900">Categories</p>
          {categoryList}
          {brands.length > 0 && (
            <div className="mt-4 border-t border-slate-100 px-3 pt-3">
              <p className="pb-2 text-sm font-bold text-slate-900">Brand</p>
              <div className="flex flex-wrap gap-1.5">
                {["", ...brands].map((b) => (
                  <button key={b || "all"} type="button" onClick={() => setBrand(b)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${brand === b ? "border-brand bg-brand text-white" : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"}`}>
                    {b || "All"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="min-w-0 space-y-4">
        {/* Search + sort */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or item code (e.g. DE-108)"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15" />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDrawer(true)} className="btn-outline !min-h-10 flex-1 gap-2 text-sm lg:hidden">
              <LayoutGrid className="h-4 w-4" /> Categories
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={cataloguePage ? "Sort by" : "Sort products"}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-brand focus:outline-none sm:flex-none">
              <option value="popular">{cataloguePage ? "Featured" : "Catalogue order"}</option>
              <option value="az">{cataloguePage ? "Name: A–Z" : "Name A–Z"}</option>
              <option value="za">{cataloguePage ? "Name: Z–A" : "Name Z–A"}</option>
            </select>
          </div>
        </div>

        {/* Result summary */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span><strong className="text-ink">{list.length}</strong> products{activeDisplayName ? <> in <strong className="text-ink">{activeDisplayName}</strong></> : null}</span>
          {brand && <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">{brand}</span>}
          {(q || category || brand) && <button type="button" onClick={reset} className="text-xs font-semibold text-rose-600 hover:underline">Clear all</button>}
        </div>

        {grid}
      </div>

      {/* Mobile category drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Categories">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="font-bold text-slate-900">Categories</p>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {categoryList}
              {brands.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 px-1 pt-3">
                  {["", ...brands].map((b) => (
                    <button key={b || "all"} type="button" onClick={() => { setBrand(b); setDrawer(false); }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${brand === b ? "border-brand bg-brand text-white" : "border-slate-200 text-slate-600"}`}>
                      {b || "All brands"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CatButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? "true" : undefined}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${active ? "bg-brand-soft font-semibold text-brand" : count === 0 ? "text-slate-400 hover:bg-slate-50" : "text-slate-700 hover:bg-slate-50 hover:text-brand"}`}>
      <span className="truncate">{label}</span>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${active ? "bg-white text-brand" : "bg-slate-100 text-slate-500"}`}>{count}</span>
    </button>
  );
}
