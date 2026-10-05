import type { Brand } from "@/types";
export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div data-scroll-reveal className="flex h-24 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center text-sm font-medium text-slate-400">
      {brand.name} logo
    </div>
  );
}
