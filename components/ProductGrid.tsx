"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterPanel, { FilterState } from "./FilterPanel";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { Package, ChevronDown } from "lucide-react";

interface Props {
  products: Product[];
  initialCategory?: string;
  initialBrand?: string;
  initialQuery?: string;
  showFilters?: boolean;
}

const ITEMS_PER_PAGE = 24;

export default function ProductGrid({
  products,
  initialCategory = "",
  initialBrand = "",
  initialQuery = "",
  showFilters = true,
}: Props) {
  const searchParams = useSearchParams();
  const urlQ = searchParams?.get("q") ?? initialQuery;
  const urlBrand = searchParams?.get("brand") ?? initialBrand;
  const urlCategory = searchParams?.get("category") ?? initialCategory;

  const [f, setF] = useState<FilterState>({
    q: urlQ,
    category: urlCategory,
    brand: urlBrand,
    sort: "popular",
  });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Sync state if URL query params change
  useEffect(() => {
    if (urlQ !== undefined) setF((prev) => ({ ...prev, q: urlQ || prev.q }));
    if (urlBrand) setF((prev) => ({ ...prev, brand: urlBrand }));
    if (urlCategory) setF((prev) => ({ ...prev, category: urlCategory }));
  }, [urlQ, urlBrand, urlCategory]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
    [products]
  );

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const hay = (p: Product) =>
      `${p.name} ${p.brand} ${p.category} ${p.sku} ${(p.items ?? [])
        .map((i) => `${i.code} ${i.description}`)
        .join(" ")}`.toLowerCase();

    let out = products.filter(
      (p) =>
        (!q || hay(p).includes(q)) &&
        (!f.category || p.category === f.category) &&
        (!f.brand || p.brand === f.brand)
    );

    if (f.sort === "az") {
      out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    } else if (f.sort === "za") {
      out = [...out].sort((a, b) => b.name.localeCompare(a.name));
    } else if (f.sort === "newest") {
      out = [...out].reverse();
    }

    return out;
  }, [products, f]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [f]);

  const visibleList = useMemo(() => {
    return list.slice(0, visibleCount);
  }, [list, visibleCount]);

  const hasMore = visibleCount < list.length;

  return (
    <div className="space-y-6">
      {showFilters && (
        <FilterPanel
          state={f}
          brands={brands}
          totalResults={list.length}
          onChange={(patch) => setF((prev) => ({ ...prev, ...patch }))}
        />
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-ink">No matching products found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any products matching your search criteria. Try clearing some filters or searching for another term.
          </p>
          <button
            type="button"
            onClick={() => setF({ q: "", category: "", brand: "", sort: "popular" })}
            className="btn-primary mt-5 text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {visibleList.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center justify-center pt-4">
              <p className="text-xs text-slate-500 mb-3">
                Showing {visibleList.length} of {list.length} products
              </p>
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="btn-outline inline-flex items-center gap-2 text-sm shadow-xs hover:border-brand hover:text-brand"
              >
                <span>Load More Products</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
