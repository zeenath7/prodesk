import { Phone, Mail, MapPin, Clock, MessageCircle, Globe, Building2, Navigation, CheckCircle2 } from "lucide-react";
import { company } from "@/data/company";
import { waLink } from "@/lib/utils";

export default function ContactSection() {
  return (
    <div className="space-y-10">
      {/* Showroom & Warehouse Hub Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hub 1: Main Showroom */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
              <Building2 className="h-3.5 w-3.5" />
              <span>Main Showroom &amp; Distribution Hub</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Open Daily
            </span>
          </div>

          <div className="mt-5 space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-ink">Talha Bin Malik Street</p>
                <p className="text-slate-500 mt-0.5">{company.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand shrink-0" />
              <div>
                <a
                  href={company.phoneHref}
                  className="font-bold text-ink hover:text-brand transition-colors"
                >
                  {company.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-brand shrink-0" />
              <p className="text-slate-600">
                Operating Hours: <strong className="text-ink">{company.hours}</strong>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
            <a
              href="https://www.google.com/maps?q=Talha+Bin+Malik+Street,+Al+Malaz+Dist,+Riyadh,+Saudi+Arabia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline !min-h-10 text-xs font-semibold flex items-center gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </a>
            <a
              href={waLink("Hello ProDesk, I would like to visit the Talha Bin Malik showroom.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Showroom</span>
            </a>
          </div>
        </div>

        {/* Hub 2: Logistics & Wholesale Hub */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-brand/40 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold">
              <Building2 className="h-3.5 w-3.5" />
              <span>Logistics &amp; Wholesale Hub</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">Bulk Cartons</span>
          </div>

          <div className="mt-5 space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-deal shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-ink">Al Hawari Commercial Hub</p>
                <p className="text-slate-500 mt-0.5">{company.branch2}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-deal shrink-0" />
              <div>
                <a
                  href={`tel:${company.branch2Phone.replace(/[^0-9+]/g, "")}`}
                  className="font-bold text-ink hover:text-brand transition-colors"
                >
                  {company.branch2Phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-deal shrink-0" />
              <div>
                <a
                  href={`mailto:${company.email}`}
                  className="text-slate-600 hover:text-brand transition-colors"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
            <a
              href={`tel:${company.branch2Phone.replace(/[^0-9+]/g, "")}`}
              className="btn-outline !min-h-10 text-xs font-semibold flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Branch 2</span>
            </a>
            <a
              href={waLink("Hello ProDesk, I would like to inquire about bulk carton pickup at the Al Hawari branch.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Branch 2</span>
            </a>
          </div>
        </div>
      </div>

      {/* Map & Additional Information */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-stretch">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs overflow-hidden">
          <iframe
            title="ProDesk Office Stationery location map in Al Malaz, Riyadh"
            src="https://www.google.com/maps?q=Talha+Bin+Malik+Street,+Al+Malaz+Dist,+Riyadh,+Saudi+Arabia&output=embed"
            className="h-80 w-full rounded-xl border border-slate-100 lg:h-full lg:min-h-[26rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink pb-3 border-b border-slate-100">
              Corporate &amp; Agency Inquiries
            </h3>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              For tender submissions, official price agreements, distributor appointments, or recurring monthly replenishment contracts, our corporate sales directors are available Sunday through Thursday.
            </p>

            <ul className="mt-5 space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Single-point of contact for institutional accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Consolidated monthly invoicing &amp; credit terms</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Direct showroom sample inspection available</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Fast freight across Eastern, Western &amp; Southern provinces</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500">Official Distributor Portal:</p>
            <p className="font-semibold text-sm text-ink mt-0.5">
              Super Deal Distribution &amp; Brand Partner
            </p>
            <p className="text-xs text-brand font-medium mt-1">
              Website: <a href="https://www.prodeskonline.com" target="_blank" rel="noreferrer" className="underline">www.prodeskonline.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
