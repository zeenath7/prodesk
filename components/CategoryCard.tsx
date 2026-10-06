import Link from "next/link";
import type { Category } from "@/types";
import { getProductsByCategory, products as allProducts } from "@/data/catalog";

const representativeProductSlugs: Record<string, string> = {
  "lamination-pouch": "cd-pouch",
  boards: "glass-board",
  rolls: "embossed-rolls",
};

export default function CategoryCard({ category }: { category: Category }) {
  const products = getProductsByCategory(category.slug);
  const representativeProduct = allProducts.find(
    (product) => product.slug === representativeProductSlugs[category.slug],
  );
  const imageProduct = representativeProduct ?? products.find((product) => product.image);
  const count = products.length;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-brand hover:shadow-xs"
    >
      {/* Category Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-50 p-3 flex items-center justify-center border border-slate-100">
        {imageProduct ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/products/${imageProduct.image}`}
            alt={imageProduct.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-xs text-slate-400">Category</div>
        )}
      </div>

      {/* Category Details */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">
            {category.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {category.description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{count} {count === 1 ? "Product" : "Products"}</span>
          <span className="font-semibold text-brand group-hover:underline">Browse →</span>
        </div>
      </div>
    </Link>
  );
}
