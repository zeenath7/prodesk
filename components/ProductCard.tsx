"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCategory } from "@/data/catalog";
import type { Product } from "@/types";
import { useQuoteCart } from "./QuoteCartContext";

export default function ProductCard({ product: p }: { product: Product }) {
  const { addItem } = useQuoteCart();
  const [justAdded, setJustAdded] = useState(false);
  const n = p.items?.length ?? 0;
  const category = getCategory(p.category);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstItem = p.items?.[0];
    addItem({
      productSlug: p.slug,
      productName: p.name,
      itemCode: firstItem?.code || p.sku || undefined,
      description: firstItem?.description || undefined,
      unit: firstItem?.unit || undefined,
      quantity: 1,
      image: p.image || null,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="group flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div>
        {/* Product Image */}
        <Link
          href={`/products/${p.slug}`}
          className="relative block aspect-square w-full overflow-hidden rounded-lg bg-slate-50 p-4 border border-slate-100 flex items-center justify-center"
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/products/${p.image}`}
              alt={p.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-xs text-slate-400">No Image</div>
          )}

          {/* Top Brand Pill if available */}
          {p.brand && (
            <span className="absolute top-2 left-2 rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs border border-slate-200">
              {p.brand}
            </span>
          )}

          <span className="absolute top-2 right-2 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
            {p.availability || "In Stock"}
          </span>
        </Link>

        {/* Product Text */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {category?.name || p.category}
          </p>

          <h3 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-2 leading-snug">
            <Link href={`/products/${p.slug}`}>{p.name}</Link>
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {n > 0 ? `${n} sizes / item codes` : "Wholesale carton packaging"}
          </p>

          <div className="mt-2 text-xs font-semibold text-slate-800">
            {formatPrice(p.price)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <Link
          href={`/products/${p.slug}`}
          className="btn-outline !min-h-8 !px-2.5 !py-1 text-xs font-semibold text-center flex items-center justify-center"
        >
          View Specs
        </Link>

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            justAdded
              ? "bg-emerald-600 text-white"
              : "bg-brand text-white hover:bg-brand-dark"
          }`}
          aria-label={`Add ${p.name} to quote basket`}
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add Quote</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
