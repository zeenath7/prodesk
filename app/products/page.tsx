import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/catalog";

export const metadata = { title: "All Products | ProDesk" };

export default function ProductsPage() {
  return (
    <main>
      <section data-scroll-reveal className="border-b border-slate-200 bg-brand-soft">
        <div className="container-x py-12">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">All Products</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Browse our stationery and office products. Search by name, item code, or description.
          </p>
        </div>
      </section>
      <section data-scroll-reveal className="container-x py-12">
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
