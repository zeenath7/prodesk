import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { company } from "@/data/company";
import { waLink } from "@/lib/utils";

const categoryLinks = [
  { label: "Files & Folders", href: "/categories/files-and-folders" },
  { label: "Presentation Whiteboards", href: "/categories/boards" },
  { label: "Desktop Accessories", href: "/categories/desktop-accessories" },
  { label: "Lamination Pouches", href: "/categories/lamination-pouch" },
  { label: "Binding Sheets & Combs", href: "/categories/binding-sheets" },
  { label: "Paper Products & Registers", href: "/categories/paper-products" },
  { label: "Writing & Markers", href: "/categories/writing-instruments" },
  { label: "Cash & Key Boxes", href: "/categories/cash-box-and-key-box" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner: National Agency & Fast Quote */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-6 sm:py-8">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Authorized National Distributor for Super Deal &amp; Delux
              </p>
              <p className="text-xs text-slate-400">
                Supplying 180+ commercial stationery lines across Saudi Arabia.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/enquiry"
              className="btn-primary !min-h-9 text-xs font-semibold"
            >
              <span>Request Wholesale Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Sales</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-x py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Company Bio */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                PRODESK
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Stationery
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Formerly Blue Crystal Stationery. Reliable commercial and institutional stationery supplier with 15+ years of trust, powering corporate offices, educational campuses, and retail stores Kingdom-wide.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>ZATCA &amp; VAT Compliant Invoicing</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-deal shrink-0" />
                <span>Hours: {company.hours}</span>
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Key Categories
            </h3>
            <ul className="space-y-1.5 text-xs">
              {categoryLinks.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Procurement Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Procurement
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition-colors">
                  All 180+ Products
                </Link>
              </li>
              <li>
                <Link href="/#deals" className="text-slate-400 hover:text-white transition-colors">
                  Bulk Packs
                </Link>
              </li>
              <li>
                <Link href="/#brands" className="text-slate-400 hover:text-white transition-colors">
                  Brand Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#wholesale" className="text-slate-400 hover:text-white transition-colors">
                  Wholesale Supply
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="text-slate-400 hover:text-white transition-colors">
                  Submit RFQ
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Riyadh Showrooms & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Riyadh Showrooms
            </h3>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-1 text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-brand" />
                <span>Showroom 1 (Main Hub):</span>
              </p>
              <p className="text-slate-400 pl-4">{company.address}</p>
              <p className="text-slate-300 pl-4">
                Phone: <a href={company.phoneHref} className="text-brand hover:underline font-semibold">{company.phone}</a>
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-1 text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-deal" />
                <span>Branch 2 (Logistics Hub):</span>
              </p>
              <p className="text-slate-400 pl-4">{company.branch2}</p>
              <p className="text-slate-300 pl-4">
                Phone: <a href={`tel:${company.branch2Phone.replace(/[^0-9+]/g, "")}`} className="text-deal hover:underline font-semibold">{company.branch2Phone}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; 2026 ProDesk Office Stationery. Associated with {company.associate}.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Showrooms
            </Link>
            <span>·</span>
            <Link href="/enquiry" className="hover:text-slate-300 transition-colors">
              Wholesale RFQ
            </Link>
            <span>·</span>
            <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
