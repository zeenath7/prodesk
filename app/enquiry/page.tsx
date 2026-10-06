import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, FileSpreadsheet, ShieldCheck, Clock, MapPin } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { company } from "@/data/company";

export const metadata = {
  title: "Request a Wholesale Quote (RFQ) | ProDesk Office Stationery Riyadh",
  description:
    "Request custom wholesale and bulk pricing for corporate offices, schools, and retailers. Same-day quotation turnaround with official VAT invoicing across Saudi Arabia.",
};

export default function EnquiryPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-10 sm:py-14">
      <div className="container-x max-w-4xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="font-semibold text-ink">Request a Wholesale Quote (RFQ)</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-bold text-brand mb-2">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Official B2B Procurement Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Request an Institutional &amp; Wholesale Quotation
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Whether ordering master cartons of lever arch files, classroom whiteboards, or recurring monthly office consumables, our Riyadh commercial desk provides transparent volume pricing, official ZATCA tax invoicing, and flexible delivery schedules.
          </p>
        </div>

        {/* Form wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-slate-500">
              Loading quotation workspace...
            </div>
          }
        >
          <EnquiryForm />
        </Suspense>
      </div>
    </main>
  );
}
