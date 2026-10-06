"use client";

import React, { useState } from "react";
import { Plus, Minus, Check, ShoppingBag, MessageCircle, FileText } from "lucide-react";
import { useQuoteCart } from "./QuoteCartContext";
import { waLink } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addItem, openDrawer } = useQuoteCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddMain = () => {
    const firstItem = product.items?.[0];
    addItem({
      productSlug: product.slug,
      productName: product.name,
      itemCode: firstItem?.code || product.sku || undefined,
      description: firstItem?.description || undefined,
      unit: firstItem?.unit || undefined,
      quantity: quantity,
      image: product.image || null,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      {/* Quantity Selector + Add to Quote */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddMain}
          className={`flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all shadow-sm ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-brand text-white hover:bg-brand-dark"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              <span>Added to Quote List</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Quote Basket</span>
            </>
          )}
        </button>
      </div>

      {/* Secondary Buttons: WhatsApp & Direct Enquiry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={waLink(
            `Hello ProDesk, I would like to enquire about bulk/wholesale availability for: ${product.name} (Qty: ${quantity}).`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>WhatsApp Inquiry</span>
        </a>

        <button
          type="button"
          onClick={() => {
            handleAddMain();
            openDrawer();
          }}
          className="btn-outline !min-h-11 text-xs sm:text-sm"
        >
          <FileText className="h-4 w-4" />
          <span>Review Quote Basket</span>
        </button>
      </div>
    </div>
  );
}
