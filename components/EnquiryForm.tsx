"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";
import type { Enquiry } from "@/types";

export default function EnquiryForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as unknown as Enquiry;
    // TODO: send `d` to your API route, CRM or email service.
    console.log("Enquiry", d);
    setSent(true);
  }

  if (sent) return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6">
      <h3 className="text-lg font-semibold">Enquiry received</h3>
      <p className="mt-1 text-sm">Thank you. The ProDesk team will reply to the email address you provided.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">Name<input name="name" required className="input mt-1" /></label>
      <label className="text-sm font-medium">Company / Organization<input name="company" className="input mt-1" /></label>
      <label className="text-sm font-medium">Phone<input name="phone" type="tel" required className="input mt-1" /></label>
      <label className="text-sm font-medium">Email<input name="email" type="email" required className="input mt-1" /></label>
      <label className="text-sm font-medium">Product<input name="product" defaultValue={defaultProduct} className="input mt-1" /></label>
      <label className="text-sm font-medium">Quantity<input name="quantity" type="number" min={1} className="input mt-1" /></label>
      <label className="text-sm font-medium sm:col-span-2">Message<textarea name="message" rows={4} className="input mt-1" /></label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" className="btn-primary">Submit Enquiry</button>
        <a href={waLink(`Hello ProDesk, I would like a quote for: ${defaultProduct || "[product]"}`)} className="btn-outline"><MessageCircle className="h-4 w-4" />WhatsApp Enquiry</a>
      </div>
    </form>
  );
}
