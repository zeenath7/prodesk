import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store, Boxes, Building2, Truck, MessageCircle, ChevronRight } from "lucide-react";
import Hero from "@/components/Hero";
import BrandCard from "@/components/BrandCard";
import ProductCard from "@/components/ProductCard";
import { categories, brands, products } from "@/data/catalog";
import { waLink } from "@/lib/utils";

const popularSlugs = [
  "double-sided-board-stand", "a4-box-file", "lamination-pouch", "binder-clips",
  "double-sided-board-marker", "a4-binding-sheet", "expanding-file", "paper-clips",
];
const popularProducts = popularSlugs
  .map((slug) => products.find((p) => p.slug === slug))
  .filter(Boolean) as typeof products;

const counts: Record<string, number> = {};
products.forEach((p) => (counts[p.category] = (counts[p.category] ?? 0) + 1));

const supplyServices = [
  { icon: Boxes, title: "Master carton wholesale", text: "Carton rates and volume price breaks for resellers, retail stores and contractors." },
  { icon: Building2, title: "Institutional accounts", text: "Procurement support for schools, universities, ministries and offices, with ZATCA invoicing." },
  { icon: Store, title: "Two Riyadh showrooms", text: "Inspect samples and collect urgent bulk orders in Al Malaz, Riyadh." },
  { icon: Truck, title: "Kingdom-wide freight", text: "Dispatch across Riyadh, Eastern, Western and all other regions of Saudi Arabia." },
];

const bulkPacks = [
  { title: "Boardroom & Training Whiteboard Suite", desc: "90x120cm magnetic double-sided whiteboard with rolling stand, 12 markers and magnetic eraser.", image: "/products/double-sided-board-stand.jpg", slug: "double-sided-board-stand", badge: "Meeting rooms & schools" },
  { title: "Corporate Archiving Carton Pack", desc: "Master carton of 50 heavy-duty A4 marble lever arch box files with dividers and sheet protectors.", image: "/products/a4-box-file.jpg", slug: "a4-box-file", badge: "Finance & legal" },
  { title: "Document Binding & Finishing Kit", desc: "A4 230 GSM embossed binding boards, plastic combs and 100-pack 125 micron lamination pouches.", image: "/products/a4-binding-sheet.jpg", slug: "a4-binding-sheet", badge: "Reports & print shops" },
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
        <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
          <nav aria-label="Product categories" className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs lg:self-start">
            <ul className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:grid-cols-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-soft hover:text-brand">
                    <span className="truncate">{c.name}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400 group-hover:text-brand">
                      {counts[c.slug] ?? 0}<ChevronRight className="hidden h-3.5 w-3.5 lg:block" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className="mb-3 text-sm font-bold text-slate-900">Popular wholesale lines</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {popularProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
            <div className="mt-6 text-center">
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                <span>Browse all {products.length} products</span><ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk packs */}
      <section id="deals" className="container-x scroll-mt-24">
        <Heading title="Bulk procurement packages" sub="Ready-made supply packs for offices, classrooms and archiving." />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {bulkPacks.map((pack) => (
            <div key={pack.title} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pack.image} alt={pack.title} loading="lazy" className="max-h-full max-w-full object-contain" />
                  <span className="absolute left-2 top-2 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">{pack.badge}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{pack.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{pack.desc}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <Link href={`/products/${pack.slug}`} className="text-xs font-semibold text-slate-600 hover:text-slate-900">View product</Link>
                <Link href={`/enquiry?product=${encodeURIComponent(pack.title)}`} className="btn-primary !min-h-8 !px-3 !py-1 text-xs font-semibold">Request quote</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section id="brands" className="container-x scroll-mt-24">
        <Heading title="Our brands" sub="National agent for Super Deal and Delux, plus our own brand Azmak." />
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
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-outline !min-h-9 text-xs">WhatsApp wholesale desk</a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-x scroll-mt-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
              <Image src="/aboutus.jpg" alt="ProDesk team and showroom" width={1200} height={800} sizes="(max-width: 1024px) 100vw, 40vw" className="h-full w-full rounded-lg object-cover" />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">About ProDesk Office Stationery</h2>
            <p className="text-sm leading-relaxed text-slate-600">Formerly Blue Crystal Stationery, ProDesk has grown over 15 years into a trusted commercial stationery supplier in Saudi Arabia. We are national distributors for <strong>Super Deal</strong> and <strong>Delux</strong> and make our own brand <strong>Azmak</strong>.</p>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-center sm:text-left">
              <div><p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">15+</p><p className="mt-0.5 text-xs text-slate-500">Years in Saudi market</p></div>
              <div><p className="text-2xl font-extrabold text-brand sm:text-3xl">{products.length}</p><p className="mt-0.5 text-xs text-slate-500">Catalogue products</p></div>
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
