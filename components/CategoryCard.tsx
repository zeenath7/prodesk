
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Placeholder from "./Placeholder";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link data-scroll-reveal href={`/categories/${category.slug}`} className="group block overflow-hidden rounded-md border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <div className="overflow-hidden"><Placeholder icon={category.icon} className="aspect-[16/10] transition-transform duration-300 group-hover:scale-105" /></div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="mt-1.5 text-sm text-slate-600">{category.description}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-brand" />
      </div>
    </Link>
  );
}
