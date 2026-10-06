import Link from "next/link";
import { ChevronRight, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { company } from "@/data/company";

export const metadata = {
  title: "Contact & Showroom Locations | ProDesk Office Stationery Riyadh",
  description:
    "Visit our two Al Malaz showroom and warehouse hubs in Riyadh or get in touch for corporate accounts, wholesale pricing, and tender inquiries in Saudi Arabia.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50/40 py-10 sm:py-14">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="font-semibold text-ink">Contact &amp; Showrooms</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft border border-brand/20 px-3 py-1 text-xs font-bold text-brand mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>Riyadh Commercial Hubs · Al Malaz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Visit Our Showrooms or Contact Our Wholesale Desk
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Conveniently located in the Al Malaz district of Riyadh with two dedicated distribution locations. Visit our sample showrooms, collect bulk carton orders, or speak directly with our account specialists.
          </p>
        </div>

        {/* Contact & Showroom Section */}
        <div data-scroll-reveal>
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
