"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check, ShoppingBag, MessageCircle } from "lucide-react";
import { useQuoteCart } from "./QuoteCartContext";
import { waLink } from "@/lib/utils";
import type { Product, ProductItem } from "@/types";

interface Props {
  product: Product;
  items: ProductItem[];
}

const dash = (v: string) => (v && v.replace(/\*/g, "").trim() ? v : "—");

export default function ProductItemsTable({ product, items }: Props) {
  const { addItem } = useQuoteCart();
  const [addedCodes, setAddedCodes] = useState<Record<string, boolean>>({});

  const handleAddItem = (item: ProductItem) => {
    addItem({
      productSlug: product.slug,
      productName: product.name,
      itemCode: item.code,
      description: item.description,
      unit: item.unit,
      box: item.box,
      ctn: item.ctn,
      quantity: 1,
      image: product.image || null,
    });

    setAddedCodes((prev) => ({ ...prev, [item.code]: true }));
    setTimeout(() => {
      setAddedCodes((prev) => ({ ...prev, [item.code]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[650px] text-left text-sm">
          <caption className="sr-only">
            {product.name} item codes and packaging specifications
          </caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3.5">Item Code</th>
              <th className="px-4 py-3.5">Description / Specifications</th>
              <th className="px-4 py-3.5">Unit</th>
              <th className="px-4 py-3.5">Box Qty</th>
              <th className="px-4 py-3.5">Carton Qty</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it, i) => {
              const isAdded = Boolean(addedCodes[it.code]);
              return (
                <tr key={`${it.code}-${i}`} className="hover:bg-slate-50/70 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-bold text-ink">
                    <span className="rounded-md bg-slate-100 px-2 py-1 border border-slate-200">
                      {it.code}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    {it.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 font-medium">
                    {dash(it.unit)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                    {dash(it.box)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                    {dash(it.ctn)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddItem(it)}
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-brand text-white hover:bg-brand-dark"
                        }`}
                        aria-label={`Add item ${it.code} to quote`}
                      >
                        {isAdded ? (
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

                      <a
                        href={waLink(
                          `Hello ProDesk, please give me a quote for ${product.name} (Code: ${it.code}, Desc: ${it.description}).`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        title="Inquire on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 italic">
        * Unit indicates retail packing. Box &amp; Ctn represent master wholesale quantities for bulk ordering.
      </p>
    </div>
  );
}
