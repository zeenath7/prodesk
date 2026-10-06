"use client";

import React from "react";
import { Search, X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/catalog";

export interface FilterState {
  q: string;
  category: string;
  brand: string;
  sort: string;
}

interface Props {
  state: FilterState;
  brands: string[];
  totalResults: number;
  onChange: (patch: Partial<FilterState>) => void;
}

export default function FilterPanel({ state, brands, totalResults, onChange }: Props) {
  const hasActiveFilters = Boolean(state.q || state.category || state.brand || state.sort !== "popular");

  const resetFilters = () => {
    onChange({ q: "", category: "", brand: "", sort: "popular" });
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-5">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search products, item code (e.g. DE-108)..."
              value={state.q}
              onChange={(e) => onChange({ q: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all"
            />
            {state.q && (
              <button
                type="button"
                onClick={() => onChange({ q: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <label className="sr-only">Category</label>
            <select
              value={state.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-ink focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div className="lg:col-span-2">
            <label className="sr-only">Brand</label>
            <select
              value={state.brand}
              onChange={(e) => onChange({ brand: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-ink focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-2">
            <label className="sr-only">Sort by</label>
            <select
              value={state.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-ink focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15 transition-all"
            >
              <option value="popular">Sort: Featured</option>
              <option value="az">Name: A to Z</option>
              <option value="za">Name: Z to A</option>
              <option value="newest">Sort: Catalog Order</option>
            </select>
          </div>
        </div>

        {/* Results summary & Clear active filters */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing <strong className="font-semibold text-ink">{totalResults}</strong> matching products
            </span>
            {state.category && (
              <span className="rounded-md bg-brand-soft px-2 py-0.5 text-brand font-medium">
                Category: {categories.find((c) => c.slug === state.category)?.name}
              </span>
            )}
            {state.brand && (
              <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 font-medium">
                Brand: {state.brand}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
