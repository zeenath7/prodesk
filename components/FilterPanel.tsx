"use client";
import { Search } from "lucide-react";
import { categories } from "@/data/catalog";

export interface FilterState { q: string; category: string; brand: string; sort: string }
interface Props { state: FilterState; brands: string[]; onChange: (patch: Partial<FilterState>) => void }

// Search box + filters + sorting. Price/type/availability filters can be added once real data exists.
export default function FilterPanel({ state, brands, onChange }: Props) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="relative sm:col-span-2 lg:col-span-4">
        <span className="sr-only">Search products</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input className="input !pl-9" placeholder="Search products..." value={state.q} onChange={(e) => onChange({ q: e.target.value })} />
      </label>
      <label><span className="sr-only">Category</span>
        <select className="input" value={state.category} onChange={(e) => onChange({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select></label>
      <label><span className="sr-only">Brand</span>
        <select className="input" value={state.brand} onChange={(e) => onChange({ brand: e.target.value })}>
          <option value="">All brands</option>
          {brands.map((b) => <option key={b}>{b}</option>)}
        </select></label>
      <label className="lg:col-span-2"><span className="sr-only">Sort by</span>
        <select className="input" value={state.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          <option value="popular">Sort: Popular</option><option value="newest">Sort: Newest</option><option value="az">Sort: A to Z</option>
        </select></label>
    </div>
  );
}
