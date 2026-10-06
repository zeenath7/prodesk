import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";
import { company } from "@/data/company";

const trustPoints = [
  "National agent for Super Deal & Delux",
  "Official ZATCA tax invoicing & VAT compliant",
  "Two Al Malaz distribution showrooms in Riyadh",
  "Master carton wholesale rates for bulk orders",
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="container-x py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Business Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span>Riyadh, Saudi Arabia · 180+ Products in Stock</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Wholesale Office &amp; School Stationery in Riyadh
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              ProDesk Office Stationery supplies corporate offices, schools, universities, and commercial retailers across Saudi Arabia with dependable, bulk stationery. Authorized national distributor for <strong>Super Deal</strong> and <strong>Delux</strong>, alongside our in-house brand <strong>Azmak</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/products" className="btn-primary">
                <span>Browse Full Catalogue</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/enquiry" className="btn-outline">
                Request a Wholesale Quote
              </Link>

              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Clear Business Trust Points */}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Professional Hero Image */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src="/hero-stationery-home.jpg"
                  alt="ProDesk office stationery products and warehouse inventory"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Clean caption card beneath photo */}
              <div className="p-3 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Al Malaz Distribution Showrooms</p>
                  <p className="text-slate-500">Talha Bin Malik St &amp; Al Hawari, Riyadh</p>
                </div>
                <Link href="/contact" className="font-semibold text-brand hover:underline">
                  Visit Us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
