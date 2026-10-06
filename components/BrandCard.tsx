import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Brand } from "@/types";

const brandDetails: Record<string, { role: string; desc: string }> = {
  "Super Deal": {
    role: "Official National Distributor (Saudi Arabia)",
    desc: "Commercial desktop accessories, magnetic whiteboards with rolling stands, sharpeners, dispensers, and cash & key security boxes.",
  },
  Delux: {
    role: "Official National Distributor (Saudi Arabia)",
    desc: "Heavy-duty lever arch marble box files, expanding files, cardboard & PVC numerical/alphabetical dividers, and sheet protectors.",
  },
  Azmak: {
    role: "In-House Manufacturing & Brand",
    desc: "Everyday office stationery, school paper registers, exercise books, computer rolls, and document binding materials.",
  },
};

export default function BrandCard({ brand }: { brand: Brand }) {
  const details = brandDetails[brand.name] ?? {
    role: "Authorized Brand Partner",
    desc: "Stationery and commercial office supplies distributed across Saudi Arabia.",
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {details.role}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          {brand.name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {details.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Link
          href={`/products?brand=${encodeURIComponent(brand.name)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
        >
          <span>View {brand.name} Catalogue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
