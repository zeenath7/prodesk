"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Building2, Check, CirclePlus, FileText, Package, Pencil, Save, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { brands, categories, products } from "@/data/catalog";
import { company } from "@/data/company";
import type { Product } from "@/types";

const PRODUCTS_KEY = "prodesk-admin-products";
const COMPANY_KEY = "prodesk-admin-company";

type CompanyDraft = Pick<typeof company, "name" | "associate" | "positioning" | "phone" | "email" | "website" | "address" | "branch2" | "branch2Phone" | "hours">;

const emptyProduct: Product = {
  slug: "",
  name: "",
  brand: "",
  category: categories[0]?.slug ?? "",
  sku: "",
  price: null,
  availability: "In Stock",
  description: "",
  specs: {},
  image: null,
  tableImage: null,
  items: [],
};

function makeSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readDraft<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminPanel() {
  const [active, setActive] = useState<"products" | "company">("products");
  const [items, setItems] = useState<Product[]>(products);
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [companyDraft, setCompanyDraft] = useState<CompanyDraft>(company);

  useEffect(() => {
    setItems(readDraft(PRODUCTS_KEY, products));
    setCompanyDraft(readDraft(COMPANY_KEY, company));
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((product) => `${product.name} ${product.sku} ${product.brand} ${product.category}`.toLowerCase().includes(value));
  }, [items, query]);

  function saveProducts(next: Product[]) {
    setItems(next);
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
    flashSaved();
  }

  function saveCompany() {
    window.localStorage.setItem(COMPANY_KEY, JSON.stringify(companyDraft));
    flashSaved();
  }

  function flashSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function saveProduct(product: Product) {
    const normalized = { ...product, slug: product.slug || makeSlug(product.name) };
    const exists = items.some((item) => item.slug === normalized.slug);
    saveProducts(exists ? items.map((item) => item.slug === normalized.slug ? normalized : item) : [normalized, ...items]);
    setEditing(null);
  }

  function removeProduct(slug: string) {
    if (!window.confirm("Remove this product from your local admin draft?")) return;
    saveProducts(items.filter((item) => item.slug !== slug));
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-x flex min-h-20 items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">ProDesk</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Admin workspace</h1>
          </div>
          <Link href="/" className="btn-outline !min-h-10 !px-3 sm:!px-4"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to website</span></Link>
        </div>
      </header>

      <div className="container-x py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <p><strong>Local draft mode:</strong> changes are saved in this browser only. Connect a database and authentication before using this as a public production admin system.</p>
          {saved && <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-emerald-700"><Check className="h-4 w-4" /> Saved</span>}
        </div>

        <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <button onClick={() => setActive("products")} className={`admin-nav ${active === "products" ? "admin-nav-active" : ""}`}><Package className="h-4 w-4" /> Products</button>
            <button onClick={() => setActive("company")} className={`admin-nav ${active === "company" ? "admin-nav-active" : ""}`}><Building2 className="h-4 w-4" /> Company details</button>
            <div className="mt-4 border-t border-slate-100 px-3 py-3 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Catalogue snapshot</p>
              <p className="mt-1">{items.length} products</p>
              <p>{categories.length} categories</p>
              <p>{brands.length} brands</p>
            </div>
          </aside>

          <section className="min-w-0">
            {active === "products" ? (
              <ProductsManager products={filtered} total={items.length} query={query} onQueryChange={setQuery} onEdit={setEditing} onAdd={() => setEditing({ ...emptyProduct, items: [] })} onRemove={removeProduct} />
            ) : (
              <CompanyManager value={companyDraft} onChange={setCompanyDraft} onSave={saveCompany} />
            )}
          </section>
        </div>
      </div>

      {editing && <ProductEditor value={editing} onChange={setEditing} onSave={saveProduct} onClose={() => setEditing(null)} />}
    </main>
  );
}

function ProductsManager({ products: visibleProducts, total, query, onQueryChange, onEdit, onAdd, onRemove }: { products: Product[]; total: number; query: string; onQueryChange: (value: string) => void; onEdit: (product: Product) => void; onAdd: () => void; onRemove: (slug: string) => void }) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-medium text-brand">Catalogue maintenance</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Products</h2><p className="mt-1 text-sm text-slate-600">Edit descriptions, packaging, availability, pricing, images, and brand details.</p></div>
        <button onClick={onAdd} className="btn-primary shrink-0"><CirclePlus className="h-4 w-4" /> Add product</button>
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-5 w-5 shrink-0 text-slate-400" /><input aria-label="Search admin products" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search products, SKU, brand..." className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400" /><span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{visibleProducts.length} / {total}</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid"><span>Product</span><span>Category</span><span>Brand</span><span>Actions</span></div>
        {visibleProducts.map((product) => <div key={product.slug} className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto] md:items-center md:gap-4"><div className="min-w-0"><p className="truncate font-semibold text-ink">{product.name || "Untitled product"}</p><p className="mt-1 text-xs text-slate-500">{product.sku || "No SKU"} · {product.availability || "No availability"}</p></div><p className="text-sm text-slate-600">{(categories.find((category) => category.slug === product.category)?.name ?? product.category) || "—"}</p><p className="text-sm text-slate-600">{product.brand || "Unassigned"}</p><div className="flex gap-2"><button onClick={() => onEdit({ ...product, items: product.items ? [...product.items] : [] })} className="admin-action"><Pencil className="h-4 w-4" /> <span>Edit</span></button><button onClick={() => onRemove(product.slug)} className="admin-action admin-action-danger" aria-label={`Delete ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}
        {visibleProducts.length === 0 && <div className="px-4 py-12 text-center text-sm text-slate-500">No products match your search.</div>}
      </div>
    </div>
  );
}

function CompanyManager({ value, onChange, onSave }: { value: CompanyDraft; onChange: (value: CompanyDraft) => void; onSave: () => void }) {
  const update = (field: keyof CompanyDraft, next: string) => onChange({ ...value, [field]: next });
  return <div><p className="text-sm font-medium text-brand">Business information</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Company details</h2><p className="mt-1 text-sm text-slate-600">Maintain the public company profile, contact information, and operating details.</p><div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><AdminField label="Company name" value={value.name} onChange={(next) => update("name", next)} /><AdminField label="Associated brand" value={value.associate} onChange={(next) => update("associate", next)} /><AdminField label="Positioning" value={value.positioning} onChange={(next) => update("positioning", next)} className="sm:col-span-2" /><AdminField label="Phone" value={value.phone} onChange={(next) => update("phone", next)} /><AdminField label="Email" value={value.email} onChange={(next) => update("email", next)} /><AdminField label="Website" value={value.website} onChange={(next) => update("website", next)} /><AdminField label="Business hours" value={value.hours} onChange={(next) => update("hours", next)} /><AdminField label="Main address" value={value.address} onChange={(next) => update("address", next)} className="sm:col-span-2" /><AdminField label="Branch 2 address" value={value.branch2} onChange={(next) => update("branch2", next)} /><AdminField label="Branch 2 phone" value={value.branch2Phone} onChange={(next) => update("branch2Phone", next)} /></div><button onClick={onSave} className="btn-primary mt-6"><Save className="h-4 w-4" /> Save company details</button></div></div>;
}

function ProductEditor({ value, onChange, onSave, onClose }: { value: Product; onChange: (value: Product) => void; onSave: (value: Product) => void; onClose: () => void }) {
  const update = <K extends keyof Product>(field: K, next: Product[K]) => onChange({ ...value, [field]: next });
  const item = value.items?.[0] ?? { code: "", description: "", unit: "", box: "", ctn: "" };
  const updateItem = (field: keyof typeof item, next: string) => update("items", [{ ...item, [field]: next }]);
  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/50 p-4 sm:p-8"><div className="mx-auto max-w-3xl rounded-xl bg-white shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6"><div><p className="text-sm font-medium text-brand">Product editor</p><h2 className="mt-1 text-xl font-semibold text-ink">{value.name || "Add product"}</h2></div><button onClick={onClose} className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink" aria-label="Close product editor"><X className="h-5 w-5" /></button></div><div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6"><AdminField label="Product name" value={value.name} onChange={(next) => update("name", next)} /><AdminField label="Slug" value={value.slug} onChange={(next) => update("slug", next)} placeholder="Generated from product name if empty" /><AdminField label="SKU" value={value.sku} onChange={(next) => update("sku", next)} /><AdminField label="Availability" value={value.availability} onChange={(next) => update("availability", next)} /><AdminSelect label="Category" value={value.category} options={categories.map((category) => [category.slug, category.name])} onChange={(next) => update("category", next)} /><AdminSelect label="Brand" value={value.brand} options={[["", "Unassigned"], ...brands.map((brand) => [brand.name, brand.name])]} onChange={(next) => update("brand", next)} /><AdminField label="Price" type="number" value={value.price === null ? "" : String(value.price)} onChange={(next) => update("price", next ? Number(next) : null)} placeholder="Leave blank for Request Quote" /><AdminField label="Product image filename" value={value.image ?? ""} onChange={(next) => update("image", next || null)} placeholder="e.g. hb-pencil.jpg" /><label className="sm:col-span-2"><span className="admin-label">Description</span><textarea value={value.description} onChange={(event) => update("description", event.target.value)} rows={4} className="input mt-2 resize-y" /></label><div className="sm:col-span-2"><p className="admin-label">Primary item specification</p><div className="mt-2 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"><AdminField label="Item code" value={item.code} onChange={(next) => updateItem("code", next)} /><AdminField label="Description" value={item.description} onChange={(next) => updateItem("description", next)} /><AdminField label="Unit" value={item.unit} onChange={(next) => updateItem("unit", next)} /><AdminField label="Box" value={item.box} onChange={(next) => updateItem("box", next)} /><AdminField label="Carton" value={item.ctn} onChange={(next) => updateItem("ctn", next)} /></div></div></div><div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:p-6"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={() => onSave(value)} className="btn-primary"><Save className="h-4 w-4" /> Save product</button></div></div></div>;
}

function AdminField({ label, value, onChange, className = "", type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; className?: string; type?: string; placeholder?: string }) {
  return <label className={`block ${className}`}><span className="admin-label">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input mt-2" /></label>;
}

function AdminSelect({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return <label className="block"><span className="admin-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="input mt-2">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}
