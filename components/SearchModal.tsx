"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, CornerDownLeft, Package } from "lucide-react";
import { products, getCategory } from "@/data/catalog";
import ProductPhoto from "@/components/ProductPhoto";
import type { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      // Ctrl+K or Cmd+K or "/" to open
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // handled by parent or trigger
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p: Product) => {
        const itemMatches = (p.items || []).some(
          (i) => i.code.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
        );
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          itemMatches
        );
      })
      .slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 sm:p-6 md:p-20" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Search input header */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or item codes (e.g. DE-108, Whiteboard)..."
            className="w-full bg-transparent px-3 py-2 text-base text-ink placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-500">
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === "" ? (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-500">Quick searches:</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {["Binder Clips", "Magnetic Board", "Box File", "Lamination Pouch", "Marker", "Super Deal"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand hover:text-brand transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <p className="text-base font-semibold text-ink">No matching products found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try searching for another keyword, brand, or item code.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Browse all products <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                Products ({results.length})
              </p>
              {results.map((product) => {
                const cat = getCategory(product.category);
                return (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-2.5 hover:border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white p-1">
                        {product.image ? (
                          <ProductPhoto slug={product.slug} name={product.name} className="h-full w-full" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            P
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink group-hover:text-brand truncate transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {product.brand ? `${product.brand} · ` : ""}
                          {cat?.name || product.category}
                          {product.items && product.items.length > 0
                            ? ` · ${product.items.length} sizes/codes`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <CornerDownLeft className="h-4 w-4 text-slate-300 group-hover:text-brand shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <span>Search 180+ verified products in Riyadh catalogue</span>
          <Link
            href="/products"
            onClick={onClose}
            className="font-medium text-brand hover:underline"
          >
            Open Full Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}
