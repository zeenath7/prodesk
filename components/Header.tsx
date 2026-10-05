"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/utils";
import Image from "next/image";

const links = [
  { label: "Home", href: "/" }, { label: "About", href: "/#about" }, { label: "Products", href: "/products" },
  { label: "Categories", href: "/#categories" }, { label: "Brands", href: "/#brands" },
  { label: "Distribution", href: "/#distribution" }, { label: "Super Deals", href: "/#deals" }, { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className={`container-x flex items-center justify-between transition-[height] duration-200 ${compact ? "h-14" : "h-20"}`}>
        <Link href="/" className="flex items-center gap-2.5" aria-label="ProDesk home">
          <Image src="/logo.png" alt="ProDesk" width={160} height={40} className="h-9 w-auto" priority />
          <span className="font-display text-xl font-semibold text-ink">ProDesk</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main">
          {links.map((l) => <Link key={l.label} href={l.href} className="text-slate-600 hover:text-brand">{l.label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/products" aria-label="Search products" className="rounded-md p-2.5 text-slate-600 hover:bg-slate-100"><Search className="h-5 w-5" /></Link>
          <a href={waLink()} className="btn-outline !px-3 !py-2.5" aria-label="WhatsApp"><MessageCircle className="h-5 w-5" /><span className="hidden md:inline">WhatsApp</span></a>
          <Link href="/enquiry" className="btn-primary hidden xl:inline-flex">Request a Quote</Link>
          <button className="rounded-md p-2.5 text-ink hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="border-b border-slate-100 py-3.5 text-base font-medium text-ink">{l.label}</Link>)}
            <Link href="/enquiry" onClick={() => setOpen(false)} className="btn-primary my-4">Request a Quote</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
