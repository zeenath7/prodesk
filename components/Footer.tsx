import Link from "next/link";
import { company } from "@/data/company";

const cols = [
  { title: "Company", items: [["About", "/#about"], ["Products", "/products"], ["Brands", "/#brands"], ["Distribution", "/#distribution"]] },
  { title: "Solutions", items: [["Wholesale", "/#distribution"], ["Business Supply", "/#distribution"], ["Institutional Supply", "/#distribution"], ["Bulk Orders", "/enquiry"]] },
  { title: "Support", items: [["Contact", "/contact"], ["Request a Quote", "/enquiry"], ["FAQs", "/contact"], ["Shipping", "/contact"], ["Returns", "/contact"]] },
];

export default function Footer() {
  return (
    <footer data-scroll-reveal className="bg-ink text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-white">PRODESK</p>
          <p className="mt-3 max-w-xs text-sm">Office stationery, supplies and distribution solutions.</p>
          <p className="mt-3 text-sm text-slate-400">Associated with {company.associate}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-display text-base font-semibold text-white">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.items.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 py-6 text-center text-sm text-slate-400">
        © 2026 ProDesk Office Stationery. All rights reserved.
      </div>
    </footer>
  );
}
