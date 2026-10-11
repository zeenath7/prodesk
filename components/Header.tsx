"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Phone,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Clock,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { company } from "@/data/company";
import { waLink } from "@/lib/utils";
import { useQuoteCart } from "./QuoteCartContext";

const mainNav = [
  { label: "Catalogue", href: "/products", badge: "180+" },
  { label: "Brands", href: "/#brands" },
  { label: "Wholesale Supply", href: "/#wholesale" },
  { label: "About ProDesk", href: "/#about" },
  { label: "Showrooms & Contact", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openDrawer } = useQuoteCart();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/products") return pathname === "/products" || pathname.startsWith("/categories/") || pathname.startsWith("/products/");
    if (href === "/contact") return pathname === "/contact";
    // Hash links point to sections on the homepage; the browser does not expose
    // the hash through pathname, so they should not all appear active together.
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. Top Utility Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800 hidden sm:block">
        <div className="container-x flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="h-3.5 w-3.5 text-deal" />
              <span>Riyadh, KSA </span>
            </span>
            <span className="hidden lg:flex items-center gap-1 text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{company.hours}</span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a
              href={company.phoneHref}
              className="flex items-center gap-1.5 font-medium text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              <span>{company.phone}</span>
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Header */}
      <div className="container-x py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="ProDesk Home">
            <Image
              src="/logo.png"
              alt="ProDesk Office Stationery"
              width={160}
              height={42}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
            <div className="hidden md:flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                ProDesk
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Office &amp; School Stationery
              </span>
            </div>
          </Link>

          {/* Embedded Real Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden w-[min(600px,40vw)] min-w-0 flex-none items-center rounded-lg border border-slate-300 bg-slate-50 px-1 py-1 transition-all focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15 md:flex"
          >
            <Search className="ml-2.5 h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 180+ products, item codes (e.g. DE-108, 96621)..."
              className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary !min-h-8 !px-3.5 !py-1 text-xs font-semibold shrink-0"
            >
              Search
            </button>
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quote Basket Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:border-brand hover:text-brand transition-all"
              aria-label={`Open quote basket with ${totalCount} items`}
            >
              <ShoppingBag className="h-4 w-4 text-brand" />
              <span className="hidden sm:inline">Quote Basket</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                totalCount > 0 ? "bg-brand text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Request a Quote CTA */}
            <Link
              href="/enquiry"
              className="btn-primary hidden sm:inline-flex !min-h-9 !px-3.5 !py-1.5 text-xs font-semibold"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Request Quote</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-3 flex items-center rounded-lg border border-slate-300 bg-slate-50 px-1 py-1 md:hidden"
        >
          <Search className="ml-2.5 h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or item codes..."
            className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="btn-primary !min-h-8 !px-3 !py-1 text-xs font-semibold shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* 3. Category & Navigation Sub-Bar (Desktop) */}
      <div className="hidden border-t border-slate-200 bg-slate-50 lg:block">
        <div className="container-x flex min-h-12 items-center justify-between gap-8">
          <nav className="flex items-center gap-1.5 text-sm font-semibold text-slate-700" aria-label="Primary navigation">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-3.5 py-2.5 transition-colors hover:bg-white hover:text-brand ${
                  isActive(item.href) ? "bg-white text-brand shadow-sm" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="shrink-0 border-l border-slate-200 pl-6 text-xs font-medium text-slate-500">
            <span>Wholesale &amp; retail supply · Riyadh</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100svh-8rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <div className="container-x space-y-3 py-4">
            <nav className="flex flex-col space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand ${
                    isActive(item.href) ? "bg-brand-soft text-brand" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center"
              >
                Request a Wholesale Quote
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors w-full"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> Showrooms: Talha Bin Malik St &amp; Al Hawari, Al Malaz</p>
              <p className="mt-1 flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> {company.phone}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
