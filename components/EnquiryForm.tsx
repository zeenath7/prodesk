"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Send,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Building,
  ShieldCheck,
  FileSpreadsheet,
  Clock,
} from "lucide-react";
import { useQuoteCart } from "./QuoteCartContext";
import { company } from "@/data/company";
import ProductPhoto from "@/components/ProductPhoto";

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const urlProduct = searchParams?.get("product") ?? "";
  const { items, removeItem, updateQuantity, clearCart, totalCount } = useQuoteCart();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    vatNumber: "",
    phone: "",
    email: "",
    city: "Riyadh",
    urgency: "Standard (3-5 days)",
    manualProduct: urlProduct,
    manualQuantity: "1",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [rfqNumber, setRfqNumber] = useState("");

  useEffect(() => {
    if (urlProduct && !formData.manualProduct) {
      setFormData((prev) => ({ ...prev, manualProduct: urlProduct }));
    }
  }, [urlProduct, formData.manualProduct]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRfqCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `RFQ-${new Date().getFullYear()}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateRfqCode();
    setRfqNumber(code);

    // The browser prepares the RFQ locally; WhatsApp is the current dispatch channel.
    setSubmitted(true);
  };

  const buildWhatsAppRFQ = () => {
    let msg = `*OFFICIAL B2B QUOTE REQUEST (RFQ)*\n\n`;
    msg += `*Contact:* ${formData.name || "[Not provided]"}\n`;
    if (formData.company) msg += `*Company:* ${formData.company}\n`;
    if (formData.vatNumber) msg += `*VAT / Tax ID:* ${formData.vatNumber}\n`;
    msg += `*Phone:* ${formData.phone || "[Phone]"}\n`;
    msg += `*Email:* ${formData.email || "[Email]"}\n`;
    msg += `*Delivery City:* ${formData.city}\n`;
    msg += `*Timeline:* ${formData.urgency}\n\n`;

    msg += `*REQUESTED PRODUCTS:*\n`;
    if (items.length > 0) {
      items.forEach((item, idx) => {
        msg += `${idx + 1}. ${item.productName}${item.itemCode ? ` (Code: ${item.itemCode})` : ""}\n`;
        if (item.description) msg += `   Detail: ${item.description}\n`;
        msg += `   Qty: ${item.quantity} ${item.unit || "Units"}\n`;
      });
    } else if (formData.manualProduct) {
      msg += `1. ${formData.manualProduct} (Qty: ${formData.manualQuantity})\n`;
    } else {
      msg += `General inquiry for wholesale catalog pricing.\n`;
    }

    if (formData.message) {
      msg += `\n*Notes / Instructions:* ${formData.message}\n`;
    }

    msg += `\nPlease provide official quotation with VAT and delivery timeframe.`;
    return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-lg">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
              RFQ Prepared Successfully
            </h2>
            <p className="text-xs font-mono font-bold text-emerald-700">
              Reference: {rfqNumber}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Thank you, <strong>{formData.name}</strong>. Your RFQ is ready to send to the ProDesk B2B wholesale team in Riyadh. Use the WhatsApp button below to dispatch the complete request, including your item list and delivery requirements.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-ink">Quotation Summary:</p>
          <p>• Destination: {formData.city}, KSA</p>
          <p>• Delivery Requirement: {formData.urgency}</p>
          <p>
            • Items: {items.length > 0 ? `${items.length} line items from basket` : formData.manualProduct}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppRFQ()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Fast-Track via WhatsApp Now</span>
          </a>

          <Link
            href="/products"
            onClick={() => {
              clearCart();
            }}
            className="btn-outline text-xs sm:text-sm"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Selected Items from Quote Cart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand" />
            <h2 className="text-base sm:text-lg font-bold text-ink">
              Selected Quote Items ({items.length > 0 ? totalCount : urlProduct ? 1 : 0})
            </h2>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
            >
              Clear Basket
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="mt-4 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5">Product</th>
                    <th className="px-3 py-2.5">Item Code</th>
                    <th className="px-3 py-2.5">Quantity</th>
                    <th className="px-3 py-2.5 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <ProductPhoto
                              slug={item.productSlug}
                              name={item.productName}
                              className="h-9 w-9 shrink-0 rounded border border-slate-100"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-ink line-clamp-1">
                              {item.productName}
                            </p>
                            {item.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-brand">
                        {item.itemCode || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                              aria-label={`Decrease quantity for ${item.productName}`}
                            >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs">
                            {item.quantity}
                          </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                              aria-label={`Increase quantity for ${item.productName}`}
                            >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            aria-label={`Remove ${item.productName} from quote list`}
                          >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 pt-2 flex items-center justify-between">
              <span>Need to add more products?</span>
              <Link href="/products" className="font-semibold text-brand hover:underline">
                + Browse more items in catalogue
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product / Item Name or Code
              </label>
              <input
                type="text"
                name="manualProduct"
                value={formData.manualProduct}
                onChange={handleChange}
                placeholder="e.g. A4 Box File (96621), Magnetic Whiteboard 90x120..."
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Estimated Quantity
              </label>
              <input
                type="text"
                name="manualQuantity"
                value={formData.manualQuantity}
                onChange={handleChange}
                placeholder="e.g. 50 Cartons, 20 Pcs"
                className="input"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Business & Contact Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-ink pb-3 border-b border-slate-100 flex items-center gap-2">
          <Building className="h-5 w-5 text-brand" />
          <span>Organization &amp; Contact Details</span>
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Contact Person Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sultan Al-Mansoor"
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Company / School / Organization
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Al-Rowad Academy / Tech Horizons Co."
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number (WhatsApp Preferred) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+966 5X XXX XXXX"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Corporate Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="procurement@company.com.sa"
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              VAT / Tax Registration Number (Optional)
            </label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              placeholder="15-digit ZATCA VAT Number"
              className="input font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Delivery Destination (KSA)
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
            >
              <option value="Riyadh">Riyadh (Showroom Pickup or Direct Dispatch)</option>
              <option value="Jeddah">Jeddah / Western Province</option>
              <option value="Dammam / Al Khobar">Dammam / Al Khobar / Eastern Province</option>
              <option value="Makkah / Madinah">Makkah / Madinah</option>
              <option value="Qassim / Buraidah">Qassim / Buraidah / Hail</option>
              <option value="Abha / Khamis Mushait">Abha / Khamis Mushait / Southern</option>
              <option value="Other KSA Location">Other Province in Saudi Arabia</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Delivery Urgency / Procurement Timeline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                "Immediate Stock (1-2 Days)",
                "Standard (3-5 Days)",
                "Scheduled Tender / Monthly",
              ].map((time) => (
                <label
                  key={time}
                  className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer text-xs font-semibold transition-all ${
                    formData.urgency === time
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={time}
                    checked={formData.urgency === time}
                    onChange={handleChange}
                    className="accent-brand"
                  />
                  <span>{time}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Custom Requirements, Packing Specifications, or Bill of Quantities Notes
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Specify carton preferences, delivery dock instructions, or recurring replenishment details..."
              className="input resize-y"
            />
          </div>
        </div>
      </div>

      {/* 3. Action Buttons & B2B Trust */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="btn-primary flex-1 !min-h-12 flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Send className="h-4 w-4" />
            <span>Prepare Official RFQ</span>
          </button>

          <a
            href={buildWhatsAppRFQ()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Instant Dispatch via WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            ZATCA Compliant Invoices
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-brand" />
            Same-Day Quote Turnaround
          </span>
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5 text-brand" />
            Volume Carton Discounts
          </span>
          <span className="flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-brand" />
            Showroom Pickup in Al Malaz
          </span>
        </div>
      </div>
    </form>
  );
}
