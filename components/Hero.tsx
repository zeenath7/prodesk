import Link from "next/link";
import { Check } from "lucide-react";
import Image from "next/image";

const trust = ["Wide Product Range", "Trusted Brands", "Bulk & Business Supply"];

export default function Hero() {
  return (
    <section data-scroll-reveal className="border-b border-slate-200 bg-brand-soft">
      <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">Your Trusted Partner for Office &amp; Stationery Supplies</h1>
          <p className="mt-3 text-xl font-medium text-brand">Quality Stationery. Trusted Brands. Reliable Distribution.</p>
          <p className="mt-5 max-w-xl text-lg text-slate-600">ProDesk Office Stationery provides a wide range of stationery and office essentials for businesses, institutions, schools, professionals and everyday users.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn-primary">Explore Products</Link>
            <Link href="/enquiry" className="btn-outline">Get a Business Enquiry</Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
            {trust.map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand" />{t}</li>)}
          </ul>
        </div>

        <div className="overflow-hidden rounded-md">
          <Image
            src="/hero-stationery-home.png"
            alt="A selection of stationery and office supplies"
            width={1536}
            height={1024}
            className="h-auto w-full object-cover"
            unoptimized
            priority
          />
        </div>
      </div>
    </section>
  );
}
