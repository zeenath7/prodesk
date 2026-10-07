import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store, Boxes, Building2, Truck, MessageCircle } from "lucide-react";
import Hero from "@/components/Hero";
import BrandCard from "@/components/BrandCard";
import CategoryCard from "@/components/CategoryCard";
import { categories, brands, products } from "@/data/catalog";
import { waLink } from "@/lib/utils";

const supplyServices = [
  { icon: Boxes, title: "Master carton wholesale", text: "Carton rates and volume price breaks for resellers, retail stores and contractors." },
  { icon: Building2, title: "Institutional accounts", text: "Procurement support for schools, universities, ministries and offices, with ZATCA invoicing." },
  { icon: Store, title: "Two Riyadh showrooms", text: "Inspect samples and collect urgent bulk orders in Al Malaz, Riyadh." },
  { icon: Truck, title: "Nationwide delivery", text: "Dispatch across Riyadh, Eastern, Western and all other regions of Saudi Arabia." },
];

function Heading({ title, sub, href, link }: { title: string; sub?: string; href?: string; link?: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-bold text-brand hover:underline">
          <span>{link}</span><ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="space-y-14 pb-16 sm:space-y-16">
      <Hero />

      {/* Shop: categories on the left, popular products on the right */}
      <section id="categories" className="container-x scroll-mt-24">
        <Heading title="Shop the catalogue" sub={`${products.length} products in ${categories.length} categories. Pick a category to see everything in it.`} href="/products" link={`View all ${products.length} products`} />
        <nav aria-label="Product categories" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </nav>

      </section>

      {/* Brands */}
      <section id="brands" className="container-x scroll-mt-24">
        <Heading title="Our brands" sub="Official national distributor for Super Deal and Delux, plus our in-house brand Azmak." />
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {brands.map((b) => <BrandCard key={b.name} brand={b} />)}
        </div>
      </section>

      {/* Wholesale */}
      <section id="wholesale" className="container-x scroll-mt-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Wholesale &amp; institutional supply</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supplyServices.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><Icon className="h-5 w-5" /></div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-600"><span className="font-bold text-slate-900">Have a tender or bill of quantities?</span> Send your list for bulk pricing.</p>
            <div className="flex items-center gap-3">
              <Link href="/enquiry" className="btn-primary !min-h-9 text-xs">Submit RFQ list</Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-9 text-xs">WhatsApp Wholesale Team</a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-x scroll-mt-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
              <Image src="/aboutus.png" alt="ProDesk team and showroom" width={1200} height={800} sizes="(max-width: 1024px) 100vw, 40vw" className="h-full w-full rounded-lg object-cover" />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">About ProDesk Office Stationery</h2>
            <p className="text-sm leading-relaxed text-slate-600">Formerly Blue Crystal Stationery, ProDesk has grown over 15 years into a trusted commercial stationery supplier in Saudi Arabia. We are national distributors for <strong>Super Deal</strong> and <strong>Delux</strong> and make our own brand <strong>Azmak</strong>.</p>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-center sm:text-left">
              <div><p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">15+</p><p className="mt-0.5 text-xs text-slate-500">Years in Saudi market</p></div>
              <div><p className="text-2xl font-extrabold text-brand sm:text-3xl">{products.length}</p><p className="mt-0.5 text-xs text-slate-500">Products</p></div>
              <div><p className="text-2xl font-extrabold text-emerald-700 sm:text-3xl">50K+</p><p className="mt-0.5 text-xs text-slate-500">Clients served</p></div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">Visit our two Riyadh showrooms <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-white sm:p-10 md:flex-row">
          <div className="max-w-xl space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Need a wholesale quote?</h2>
            <p className="text-sm text-slate-300">Talk to our Riyadh team for volume pricing, tender quotations and delivery.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link href="/enquiry" className="btn bg-white font-bold text-slate-900 hover:bg-slate-100">Request a quote</Link>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn flex items-center gap-2 border border-slate-700 bg-slate-800 font-bold text-white hover:bg-slate-700">
              <MessageCircle className="h-4 w-4 text-emerald-400" /><span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
