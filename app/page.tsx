import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Store,
  Boxes,
  Building2,
  Truck,
  Check,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
} from "lucide-react";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import BrandCard from "@/components/BrandCard";
import ProductCard from "@/components/ProductCard";
import { categories, brands, products } from "@/data/catalog";
import { company } from "@/data/company";
import { waLink } from "@/lib/utils";

// Select 8 high-demand bestselling products
const popularSlugs = [
  "double-sided-board-stand",
  "a4-box-file",
  "lamination-pouch",
  "binder-clips",
  "double-sided-board-marker",
  "a4-binding-sheet",
  "expanding-file",
  "paper-clips",
];

const popularProducts = popularSlugs
  .map((slug) => products.find((p) => p.slug === slug))
  .filter(Boolean) as typeof products;

const supplyServices = [
  {
    icon: Boxes,
    title: "Master Carton Wholesale",
    text: "Factory-direct carton rates and volume price breaks for resellers, retail stores, and commercial contractors.",
  },
  {
    icon: Building2,
    title: "Institutional Accounts",
    text: "Direct procurement support for schools, universities, ministries, and corporate headquarters with ZATCA tax invoicing.",
  },
  {
    icon: Store,
    title: "Two Riyadh Showrooms",
    text: "Inspect catalogue samples, test whiteboards, and collect urgent bulk carton orders in Al Malaz, Riyadh.",
  },
  {
    icon: Truck,
    title: "Kingdom-Wide Freight",
    text: "Fast, reliable dispatch across Riyadh, Eastern Province, Western Province, and all regions of Saudi Arabia.",
  },
];

const bulkPacks = [
  {
    title: "Boardroom & Training Whiteboard Suite",
    desc: "90x120cm Magnetic Double-Sided Whiteboard with rolling metal stand, 12 whiteboard markers, and magnetic eraser.",
    image: "/products/double-sided-board-stand.jpg",
    slug: "double-sided-board-stand",
    badge: "Meeting Rooms & Schools",
  },
  {
    title: "Corporate Archiving Carton Pack",
    desc: "Master carton of 50 heavy-duty A4 Marble Lever Arch Box Files with Delux 10-tab dividers and sheet protectors.",
    image: "/products/a4-box-file.jpg",
    slug: "a4-box-file",
    badge: "Finance & Legal Departments",
  },
  {
    title: "Document Binding & Finishing Kit",
    desc: "A4 230 GSM Embossed Leather Binding Boards + Plastic Binding Combs and 100-Pack 125 Micron Lamination Pouches.",
    image: "/products/a4-binding-sheet.jpg",
    slug: "a4-binding-sheet",
    badge: "Reports & Print Shops",
  },
];

export default function Home() {
  return (
    <main className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* A compact proof strip gives procurement buyers the essentials at a glance. */}
      <section aria-label="Why businesses choose ProDesk" className="container-x -mt-8 sm:-mt-10">
        <div className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["15+", "Years serving Saudi businesses"],
            ["180+", "Commercial product lines"],
            ["2", "Riyadh showroom locations"],
            ["KSA", "Delivery and freight coverage"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`px-5 py-4 ${index > 0 ? "border-t border-slate-200 sm:border-l lg:border-t-0" : ""}`}
            >
              <p className="text-xl font-extrabold tracking-tight text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Product Categories */}
      <section id="categories" className="container-x scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Product Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse our 16 core commercial stationery and office supply categories.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-brand hover:underline shrink-0 flex items-center gap-1"
          >
            <span>View All 180+ Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* 3. Popular Commercial Products */}
      <section className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Wholesale Lines
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              High-demand products in stock in our Riyadh distribution showrooms.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-brand hover:underline shrink-0 flex items-center gap-1"
          >
            <span>Open Full Catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
          {popularProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 4. Bulk Procurement Packages */}
      <section id="deals" className="container-x scroll-mt-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bulk Procurement Packages
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pre-configured business supply packs for corporate department refits, school classrooms, and bulk archiving.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {bulkPacks.map((pack) => (
              <div
                key={pack.title}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white p-3 border border-slate-200/80 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pack.image}
                      alt={pack.title}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute top-2 left-2 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                      {pack.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {pack.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {pack.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    href={`/products/${pack.slug}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View Product →
                  </Link>
                  <Link
                    href={`/enquiry?product=${encodeURIComponent(pack.title)}`}
                    className="btn-primary !min-h-8 !px-3 !py-1 text-xs font-semibold"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Agencies */}
      <section id="brands" className="container-x scroll-mt-24">
        <div className="max-w-2xl pb-6 border-b border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Brand Agencies
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            ProDesk is the authorized Saudi Arabia national agent for established international stationery manufacturers.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {brands.map((b) => (
            <BrandCard key={b.name} brand={b} />
          ))}
        </div>
      </section>

      {/* 6. How We Supply Businesses */}
      <section id="wholesale" className="container-x scroll-mt-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Wholesale &amp; Institutional Supply
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              How ProDesk works with businesses, academic institutions, and retail partners across Saudi Arabia.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {supplyServices.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Have a tender or bill of quantities?</span> Send your list for immediate bulk pricing.
            </div>
            <div className="flex items-center gap-3">
              <Link href="/enquiry" className="btn-primary !min-h-9 text-xs">
                Submit RFQ List
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !min-h-9 text-xs"
              >
                WhatsApp Wholesale Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Riyadh Showrooms */}
      <section className="container-x">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Riyadh Showrooms &amp; Warehouse Locations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visit our two Al Malaz locations for immediate product pickup and sample inspection.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand">
                Main Showroom &amp; Distribution Center
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                Talha Bin Malik Street, Al Malaz
              </h3>
              <p className="mt-2 text-xs text-slate-600">{company.address}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> Phone: <strong>{company.phone}</strong></p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> Hours: <strong>{company.hours}</strong></p>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="https://www.google.com/maps?q=Talha+Bin+Malik+Street,+Al+Malaz+Dist,+Riyadh,+Saudi+Arabia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !min-h-8 text-xs font-semibold"
                >
                  Map &amp; Directions
                </a>
                <a
                  href={waLink("Hello ProDesk, I would like to visit the Talha Bin Malik showroom.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !min-h-8 text-xs font-semibold"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-deal">
                Branch 2 · Logistics Hub
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                Al Hawari 7953, Al Malaz
              </h3>
              <p className="mt-2 text-xs text-slate-600">{company.branch2}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> Phone: <strong>{company.branch2Phone}</strong></p>
                <p className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> Wholesale carton pickup &amp; stock dispatch</p>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${company.branch2Phone.replace(/[^0-9+]/g, "")}`}
                  className="btn-outline !min-h-8 text-xs font-semibold"
                >
                  Call Branch 2
                </a>
                <a
                  href={waLink("Hello ProDesk, I want to arrange bulk carton pickup at Al Hawari branch.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !min-h-8 text-xs font-semibold"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. About ProDesk Company Profile */}
      <section id="about" className="container-x scroll-mt-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
              <Image
                src="/aboutus.jpg"
                alt="About ProDesk Office Stationery team and showroom"
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              About ProDesk Office Stationery
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Formerly known as Blue Crystal Stationery, ProDesk has grown over 15 years to become a trusted supplier in Saudi Arabia&apos;s commercial stationery market.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We serve as national distributors for <strong>Super Deal</strong> and <strong>Delux</strong>, alongside manufacturing our in-house brand <strong>Azmak</strong>. We supply more than 50,000 satisfied corporate clients, schools, universities, and commercial retailers across the Kingdom.
            </p>

            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15+</p>
                <p className="text-xs text-slate-500 mt-0.5">Years in Saudi Market</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-brand">180+</p>
                <p className="text-xs text-slate-500 mt-0.5">Catalogue Products</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">50K+</p>
                <p className="text-xs text-slate-500 mt-0.5">Clients Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Direct CTA Banner */}
      <section className="container-x">
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ready to Order or Request a Wholesale Quote?
            </h2>
            <p className="text-sm text-slate-300">
              Speak directly with our Riyadh corporate team for volume pricing, tender quotations, and delivery arrangements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/enquiry" className="btn bg-white text-slate-900 hover:bg-slate-100 font-bold">
              Submit Quotation Request
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
