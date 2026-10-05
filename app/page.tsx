import Link from "next/link";
import Image from "next/image";
import { Check, Store, Boxes, Building2, ClipboardList, ShieldCheck, BadgeCheck, Tag, LayoutGrid, Truck, Headset } from "lucide-react";
import Hero from "@/components/Hero";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import BrandCard from "@/components/BrandCard";
import CTASection from "@/components/CTASection";
import { categories, brands } from "@/data/catalog";

const segments = ["Offices", "Businesses", "Schools", "Colleges", "Institutions", "Retailers", "Professionals", "Individual customers"];
const distribution = [
  { icon: Store, title: "Retail Supply", text: "Reliable supply for stationery retailers and stores." },
  { icon: Boxes, title: "Wholesale", text: "Bulk product supply for business customers and resellers." },
  { icon: Building2, title: "Institutional Supply", text: "Stationery solutions for schools, colleges, offices and institutions." },
  { icon: ClipboardList, title: "Business Orders", text: "Customized support for recurring and bulk requirements." },
];
const why = [
  { icon: BadgeCheck, title: "Quality Products", text: "Carefully selected stationery and office essentials." },
  { icon: ShieldCheck, title: "Trusted Brands", text: "Products from reliable and established brands." },
  { icon: Tag, title: "Competitive Pricing", text: "Value-focused solutions for retail and business customers." },
  { icon: LayoutGrid, title: "Wide Product Range", text: "Everything from everyday stationery to office essentials." },
  { icon: Truck, title: "Reliable Distribution", text: "Efficient supply for retailers, institutions and businesses." },
  { icon: Headset, title: "Customer Support", text: "Responsive assistance for product and business enquiries." },
];

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Business introduction */}
      <section data-scroll-reveal className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Image
          src="/office.png"
          alt="Office stationery and workspace"
          width={1200}
          height={900}
          className="h-auto w-full rounded-md object-cover"
        />
        <div>
          <SectionHeading title="Stationery Solutions Built for Every Need" subtitle="ProDesk supplies a broad range of stationery and office products to many kinds of customers." />
          <ul className="mt-8 grid grid-cols-2 gap-3 text-ink">
            {segments.map((s) => <li key={s} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand" />{s}</li>)}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section data-scroll-reveal id="categories" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="container-x">
          <SectionHeading title="Explore Our Product Categories" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{categories.map((c) => <CategoryCard key={c.slug} category={c} />)}</div>
        </div>
      </section>

      {/* Brands */}
      <section data-scroll-reveal id="brands" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-20">
        <div className="container-x">
          <SectionHeading title="Brands You Can Trust" subtitle="We work with trusted brands to provide quality stationery and office solutions." />
          {/* Placeholder logos: edit data/catalog.ts to add real brands. */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{brands.map((b) => <BrandCard key={b.name} brand={b} />)}</div>
          <Link href="/products" className="mt-8 inline-block font-semibold text-brand hover:underline">View All Brands →</Link>
        </div>
      </section>

      {/* Distribution */}
      <section data-scroll-reveal id="distribution" className="container-x scroll-mt-24 py-20">
        <SectionHeading title="Distribution That Keeps Business Moving" subtitle="ProDesk, associated with Super Deal Distribution & Brand, provides reliable distribution and supply solutions for stationery and office products." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {distribution.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-md border border-slate-200 p-6">
              <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/enquiry" className="btn-primary mt-10">Become a Business Partner</Link>
      </section>

      {/* Super Deals: offer values are placeholders until real offers are provided */}
      <section data-scroll-reveal id="deals" className="scroll-mt-24 bg-ink py-20">
        <div className="container-x">
          <h2 className="text-3xl font-semibold !text-white sm:text-4xl">Super Deals. Better Value.</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-300">Discover selected offers and value-driven deals across stationery and office essentials.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="overflow-hidden rounded-md bg-white">
                <Placeholder icon="Tag" className="aspect-[16/9]" />
                <div className="p-5">
                  <p className="inline-block rounded bg-deal px-2 py-0.5 text-xs font-semibold text-ink">[Offer value]</p>
                  <h3 className="mt-3 text-lg font-semibold">[Offer title {n}]</h3>
                  <p className="mt-1 text-sm text-slate-600">[Short offer description.]</p>
                  <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">View offer</Link>
                </div>
              </div>
            ))}
          </div>
          <Link href="/products" className="btn mt-10 bg-white text-ink hover:bg-slate-100">Explore Deals</Link>
        </div>
      </section>

      {/* Why ProDesk */}
      <section data-scroll-reveal className="container-x py-20">
        <SectionHeading title="Why Choose ProDesk?" />
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {why.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <Icon className="h-6 w-6 shrink-0 text-brand" strokeWidth={1.5} />
              <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-600">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <CTASection title="Looking for Bulk Stationery Supply?" text="Whether you're a retailer, office, school or institution, talk to ProDesk about your stationery requirements." primary={{ label: "Request a Quote", href: "/enquiry" }} secondary={{ label: "Contact Us", href: "/contact" }} />

      {/* About: no invented facts. Replace bracketed text with real company details. */}
      <section data-scroll-reveal id="about" className="container-x grid scroll-mt-24 items-start gap-12 py-20 lg:grid-cols-2">
        <Image
          src="/aboutus.png"
          alt="About ProDesk Office Stationery"
          width={1200}
          height={900}
          className="h-auto w-full rounded-md object-cover"
        />
        <div>
          <SectionHeading title="About ProDesk" />
          <p className="mt-5 text-slate-600">ProDesk Office Stationery is a leading distributor of office supplies and stationery solutions in Saudi Arabia.  We proudly serve government offices, corporates, schools, and retailers with quality products, reliable service, and trusted brands.
</p>
          <dl className="mt-8 grid gap-5 sm:grid-cols-3">
  {[["5+", "Years in Business"], ["500+", "Products"], ["50+", "Customers"]].map(([t, d]) => (
    <div key={t}>
      <dt className="text-3xl font-bold text-ink">{t}</dt>
      <dd className="mt-3 border-t-2 border-brand pt-3 text-sm text-slate-600">{d}</dd>
    </div>
  ))}
</dl>
        </div>
      </section>
    </main>
  );
}
