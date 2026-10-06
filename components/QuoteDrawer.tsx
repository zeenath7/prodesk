"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, Send, FileText, ShoppingBag, ArrowRight } from "lucide-react";
import { useQuoteCart } from "./QuoteCartContext";
import { company } from "@/data/company";

export default function QuoteDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isDrawerOpen, closeDrawer, totalCount } =
    useQuoteCart();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Format WhatsApp message with all items
  const formatWhatsAppMessage = () => {
    let msg = `Hello ProDesk Office Stationery,\n\nI would like to request an official wholesale/business quote for the following items:\n\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.productName}${item.itemCode ? ` (Code: ${item.itemCode})` : ""}\n`;
      if (item.description) msg += `   Detail: ${item.description}\n`;
      msg += `   Quantity: ${item.quantity} ${item.unit || "Units"}\n`;
    });
    msg += `\nPlease provide availability, lead times, and B2B pricing for delivery in Saudi Arabia.\nThank you!`;
    return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" aria-labelledby="quote-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 id="quote-drawer-title" className="text-lg font-bold text-ink">
                Quote Request List
              </h2>
              <p className="text-xs text-slate-500">
                {totalCount} {totalCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-ink">Your quote list is empty</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-xs">
                Explore our catalog of 180+ stationery products and click &ldquo;Add to Quote&rdquo; to build your procurement list.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="btn-primary mt-6 inline-flex items-center gap-2 text-sm"
              >
                Browse Catalogue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                <span>Selected Products</span>
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                    type="button"
                  >
                  Clear all
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {item.image ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-50 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/products/${item.image}`}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productSlug}`}
                          onClick={closeDrawer}
                          className="font-semibold text-sm text-ink hover:text-brand transition-colors line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                          type="button"
                          aria-label={`Remove ${item.productName} from quote list`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.itemCode && (
                        <p className="text-xs font-mono text-brand font-medium mt-0.5">
                          Code: {item.itemCode}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-slate-200 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-l-md transition-colors"
                          aria-label={`Decrease quantity for ${item.productName}`}
                          type="button"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-semibold text-ink min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-r-md transition-colors"
                          aria-label={`Increase quantity for ${item.productName}`}
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.unit ? `Unit: ${item.unit}` : "Pcs / Pack"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-3">
            <a
              href={formatWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send RFQ via WhatsApp</span>
            </a>

            <Link
              href="/enquiry"
              onClick={closeDrawer}
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
            >
              <FileText className="h-4 w-4" />
              <span>Submit Formal RFQ Form</span>
            </Link>

            <p className="text-center text-xs text-slate-500">
              Direct factory &amp; wholesale quotes dispatched within hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
