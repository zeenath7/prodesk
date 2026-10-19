import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact & Showroom Locations | ProDesk Office Stationery Riyadh",
  description:
    "Visit our two Al-Malaz showroom and warehouse hubs in Riyadh or get in touch for corporate accounts, wholesale pricing, and tender inquiries in Saudi Arabia.",
  alternates: { canonical: "/contact" },
  robots: {
    index: false,
    follow: true,
  },
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
          <span className="font-semibold text-ink">Contact Us</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Contact Our Team
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about our products or wholesale services? Our team is here to help businesses, schools, and retailers find the right stationery solutions.
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
