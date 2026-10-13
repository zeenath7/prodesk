"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Check, CirclePlus, ImagePlus, Loader2, LogOut, Package, Pencil, Save, Search, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { brands, categories, products } from "@/data/catalog";
import { company } from "@/data/company";
import type { Product } from "@/types";
import { getProductPhotoAsset } from "@/components/ProductPhoto";

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
  const router = useRouter();
  const [active, setActive] = useState<"products" | "company">("products");
  const [items, setItems] = useState<Product[]>(products);
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [companyDraft, setCompanyDraft] = useState<CompanyDraft>(company);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Could not load shared products.");
        if (Array.isArray(data.products)) setItems(data.products as Product[]);
      })
      .catch((error: unknown) => setStorageError(error instanceof Error ? error.message : "Could not load shared products."));
    fetch("/api/admin/company", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Could not load shared company details.");
        if (data.company && typeof data.company === "object") {
          setCompanyDraft((previous) => {
            const next = { ...previous };
            for (const key of Object.keys(next) as (keyof CompanyDraft)[]) {
              const value = (data.company as Record<string, unknown>)[key];
              if (typeof value === "string") next[key] = value;
            }
            return next;
          });
        }
      })
      .catch((error: unknown) => {
        setCompanyDraft(readDraft(COMPANY_KEY, company));
        setStorageError((previous) => previous || (error instanceof Error ? error.message : "Could not load shared company details."));
      });
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((product) => `${product.name} ${product.sku} ${product.brand} ${product.category}`.toLowerCase().includes(value));
  }, [items, query]);

  async function saveProducts(next: Product[]): Promise<boolean> {
    setStorageError("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not save products.");
      setItems(next);
      flashSaved();
      return true;
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not save products.");
      return false;
    }
  }

  async function saveCompany() {
    setStorageError("");
    try {
      const response = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: companyDraft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not save company details.");
      window.localStorage.setItem(COMPANY_KEY, JSON.stringify(companyDraft));
      flashSaved();
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not save company details.");
    }
  }

  function flashSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  async function saveProduct(product: Product) {
    const normalized = { ...product, slug: product.slug || makeSlug(product.name) };
    const exists = items.some((item) => item.slug === normalized.slug);
    if (await saveProducts(exists ? items.map((item) => item.slug === normalized.slug ? normalized : item) : [normalized, ...items])) setEditing(null);
  }

  function removeProduct(slug: string) {
    if (!window.confirm("Remove this product from the shared catalogue?")) return;
    void saveProducts(items.filter((item) => item.slug !== slug));
  }

  async function signOut() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Cookie may already be expired; still leave the workspace.
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-x flex min-h-20 items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">ProDesk</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Admin workspace</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-outline !min-h-10 !px-3 sm:!px-4"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to website</span></Link>
            <button onClick={signOut} className="btn-outline !min-h-10 !px-3 sm:!px-4"><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="container-x py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <p><strong>Secured workspace:</strong> signed in with a Neon-backed admin session (12-hour expiry). Product, image, and company changes are saved to the shared Neon catalogue.</p>
          {saved && <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-emerald-700"><Check className="h-4 w-4" /> Saved</span>}
        </div>
        {storageError && <p role="alert" className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{storageError}</p>}

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
              <ProductsManager products={filtered} all={items} total={items.length} query={query} onQueryChange={setQuery} onEdit={setEditing} onAdd={(categorySlug) => setEditing({ ...emptyProduct, items: [], category: categorySlug || categories[0]?.slug || "" })} onRemove={removeProduct} />
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

function ProductsManager({ products: visibleProducts, all, total, query, onQueryChange, onEdit, onAdd, onRemove }: { products: Product[]; all: Product[]; total: number; query: string; onQueryChange: (value: string) => void; onEdit: (product: Product) => void; onAdd: (categorySlug: string) => void; onRemove: (slug: string) => void }) {
  const searching = query.trim().length > 0;
  const groups = categories
    .map((category) => ({ category, items: all.filter((product) => product.category === category.slug) }))
    .filter((group) => group.items.length > 0);
  const ungrouped = all.filter((product) => !categories.some((category) => category.slug === product.category));
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-medium text-brand">Catalogue maintenance</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Products</h2><p className="mt-1 text-sm text-slate-600">Browse by category and add products where they belong, or search across everything.</p></div>
        <button onClick={() => onAdd("")} className="btn-primary shrink-0"><CirclePlus className="h-4 w-4" /> Add product</button>
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-5 w-5 shrink-0 text-slate-400" /><input aria-label="Search admin products" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search products, SKU, brand..." className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400" /><span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{searching ? `${visibleProducts.length} / ${total}` : `${total} products`}</span>
      </div>
      {searching ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid"><span>Product</span><span>Category</span><span>Brand</span><span>Actions</span></div>
          {visibleProducts.map((product) => <ProductRow key={product.slug} product={product} showCategory onEdit={onEdit} onRemove={onRemove} />)}
          {visibleProducts.length === 0 && <div className="px-4 py-12 text-center text-sm text-slate-500">No products match your search.</div>}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map(({ category, items }) => (
            <section key={category.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div><p className="font-semibold text-ink">{category.name}</p><p className="text-xs text-slate-500">{items.length} {items.length === 1 ? "product" : "products"}</p></div>
                <button onClick={() => onAdd(category.slug)} className="btn-outline !min-h-9 text-xs"><CirclePlus className="h-3.5 w-3.5" /> <span>Add to {category.name}</span></button>
              </div>
              {items.map((product) => <ProductRow key={product.slug} product={product} showCategory={false} onEdit={onEdit} onRemove={onRemove} />)}
            </section>
          ))}
          {ungrouped.length > 0 && (
            <section className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3">
                <div><p className="font-semibold text-ink">Unassigned category</p><p className="text-xs text-slate-500">{ungrouped.length} {ungrouped.length === 1 ? "product" : "products"}</p></div>
                <button onClick={() => onAdd("")} className="btn-outline !min-h-9 text-xs"><CirclePlus className="h-3.5 w-3.5" /> <span>Add product</span></button>
              </div>
              {ungrouped.map((product) => <ProductRow key={product.slug} product={product} showCategory onEdit={onEdit} onRemove={onRemove} />)}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, showCategory, onEdit, onRemove }: { product: Product; showCategory: boolean; onEdit: (product: Product) => void; onRemove: (slug: string) => void }) {
  return <div className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto] md:items-center md:gap-4"><div className="min-w-0"><p className="truncate font-semibold text-ink">{product.name || "Untitled product"}</p><p className="mt-1 text-xs text-slate-500">{product.sku || "No SKU"} · {product.availability || "No availability"}</p></div>{showCategory ? <p className="text-sm text-slate-600">{(categories.find((category) => category.slug === product.category)?.name ?? product.category) || "—"}</p> : <span className="hidden md:block" /> }<p className="text-sm text-slate-600">{product.brand || "Unassigned"}</p><div className="flex gap-2"><button onClick={() => onEdit({ ...product, items: product.items ? [...product.items] : [] })} className="admin-action"><Pencil className="h-4 w-4" /> <span>Edit</span></button><button onClick={() => onRemove(product.slug)} className="admin-action admin-action-danger" aria-label={`Delete ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></div>;
}

function CompanyManager({ value, onChange, onSave }: { value: CompanyDraft; onChange: (value: CompanyDraft) => void; onSave: () => void }) {
  const update = (field: keyof CompanyDraft, next: string) => onChange({ ...value, [field]: next });
  return <div><p className="text-sm font-medium text-brand">Business information</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Company details</h2><p className="mt-1 text-sm text-slate-600">Maintain the public company profile, contact information, and operating details.</p><div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><AdminField label="Company name" value={value.name} onChange={(next) => update("name", next)} /><AdminField label="Associated brand" value={value.associate} onChange={(next) => update("associate", next)} /><AdminField label="Positioning" value={value.positioning} onChange={(next) => update("positioning", next)} className="sm:col-span-2" /><AdminField label="Phone" value={value.phone} onChange={(next) => update("phone", next)} /><AdminField label="Email" value={value.email} onChange={(next) => update("email", next)} /><AdminField label="Website" value={value.website} onChange={(next) => update("website", next)} /><AdminField label="Business hours" value={value.hours} onChange={(next) => update("hours", next)} /><AdminField label="Main address" value={value.address} onChange={(next) => update("address", next)} className="sm:col-span-2" /><AdminField label="Branch 2 address" value={value.branch2} onChange={(next) => update("branch2", next)} /><AdminField label="Branch 2 phone" value={value.branch2Phone} onChange={(next) => update("branch2Phone", next)} /></div><button onClick={onSave} className="btn-primary mt-6"><Save className="h-4 w-4" /> Save company details</button></div></div>;
}

function ProductEditor({ value, onChange, onSave, onClose }: { value: Product; onChange: (value: Product) => void; onSave: (value: Product) => void; onClose: () => void }) {
  const update = <K extends keyof Product>(field: K, next: Product[K]) => onChange({ ...value, [field]: next });
  const item = value.items?.[0] ?? { code: "", description: "", unit: "", box: "", ctn: "" };
  const updateItem = (field: keyof typeof item, next: string) => update("items", [{ ...item, [field]: next }]);
  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/50 p-4 sm:p-8"><div className="mx-auto max-w-3xl rounded-xl bg-white shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6"><div><p className="text-sm font-medium text-brand">Product editor</p><h2 className="mt-1 text-xl font-semibold text-ink">{value.name || "Add product"}</h2></div><button onClick={onClose} className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink" aria-label="Close product editor"><X className="h-5 w-5" /></button></div><div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6"><AdminField label="Product name" value={value.name} onChange={(next) => update("name", next)} /><AdminField label="Slug" value={value.slug} onChange={(next) => update("slug", next)} placeholder="Generated from product name if empty" /><AdminSelect label="Category" value={value.category} options={categories.map((category) => [category.slug, category.name])} onChange={(next) => update("category", next)} /><AdminField label="SKU" value={value.sku} onChange={(next) => update("sku", next)} /><AdminSelect label="Availability" value={["In Stock", "Out of Stock"].includes(value.availability) ? value.availability : "In Stock"} options={[["In Stock", "In Stock"], ["Out of Stock", "Out of Stock"]]} onChange={(next) => update("availability", next)} /><AdminSelect label="Brand" value={value.brand} options={[["", "Unassigned"], ...brands.map((brand) => [brand.name, brand.name])]} onChange={(next) => update("brand", next)} /><AdminField label="Price" type="number" value={value.price === null ? "" : String(value.price)} onChange={(next) => update("price", next ? Number(next) : null)} placeholder="Leave blank for Request Quote" /><AdminField label="Product image filename" value={value.image ?? ""} onChange={(next) => update("image", next || null)} placeholder="e.g. hb-pencil.jpg" /><ProductImageUploader value={value} onChange={onChange} /><label className="sm:col-span-2"><span className="admin-label">Description</span><textarea value={value.description} onChange={(event) => update("description", event.target.value)} rows={4} className="input mt-2 resize-y" /></label><div className="sm:col-span-2"><p className="admin-label">Primary item specification</p><div className="mt-2 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"><AdminField label="Item code" value={item.code} onChange={(next) => updateItem("code", next)} /><AdminField label="Description" value={item.description} onChange={(next) => updateItem("description", next)} /><AdminField label="Unit" value={item.unit} onChange={(next) => updateItem("unit", next)} /><AdminField label="Box" value={item.box} onChange={(next) => updateItem("box", next)} /><AdminField label="Carton" value={item.ctn} onChange={(next) => updateItem("ctn", next)} /></div></div></div><div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:p-6"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={() => onSave(value)} className="btn-primary"><Save className="h-4 w-4" /> Save product</button></div></div></div>;
}

function AdminField({ label, value, onChange, className = "", type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; className?: string; type?: string; placeholder?: string }) {
  return <label className={`block ${className}`}><span className="admin-label">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input mt-2" /></label>;
}

type UploadStatus = { kind: "idle" } | { kind: "loading" } | { kind: "uploading" } | { kind: "saved" } | { kind: "removed" } | { kind: "error"; message: string };

function isAbsoluteUrl(value: string | null | undefined): value is string {
  return !!value && /^https?:\/\//i.test(value);
}

/** Upload/replace/remove the product photo. Bytes go to Vercel Blob, the reference to Neon. */
function ProductImageUploader({ value, onChange }: { value: Product; onChange: (value: Product) => void }) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const slug = value.slug || makeSlug(value.name);

  // Prefill the persisted (Neon) image whenever a different product is opened.
  useEffect(() => {
    setPendingFile(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setSavedUrl(null);
    if (!slug) {
      setStatus({ kind: "idle" });
      return;
    }
    if (isAbsoluteUrl(value.image)) {
      setSavedUrl(value.image);
      setStatus({ kind: "idle" });
      return;
    }
    let cancelled = false;
    setStatus({ kind: "loading" });
    fetch(`/api/admin/products/image?slug=${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { url?: string | null } | null;
        if (cancelled) return;
        if (response.ok && data?.url) {
          setSavedUrl(data.url);
          onChange({ ...value, image: data.url });
        }
        setStatus({ kind: "idle" });
      })
      .catch(() => {
        if (!cancelled) setStatus({ kind: "idle" });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function chooseFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return file ? URL.createObjectURL(file) : null;
    });
    setStatus({ kind: "idle" });
  }

  async function upload() {
    if (!pendingFile || !slug) return;
    setStatus({ kind: "uploading" });
    try {
      const form = new FormData();
      form.set("slug", slug);
      form.set("file", pendingFile);
      const response = await fetch("/api/admin/products/image", { method: "POST", body: form });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!response.ok || !data?.url) {
        setStatus({ kind: "error", message: data?.error ?? "Upload failed. Try again." });
        return;
      }
      onChange({ ...value, image: data.url });
      setSavedUrl(data.url);
      setPendingFile(null);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      if (inputRef.current) inputRef.current.value = "";
      setStatus({ kind: "saved" });
    } catch {
      setStatus({ kind: "error", message: "Could not reach the server. Try again." });
    }
  }

  async function remove() {
    if (!slug) return;
    if (!window.confirm("Remove the uploaded product image? The public page falls back to the default photo.")) return;
    setStatus({ kind: "uploading" });
    try {
      const response = await fetch(`/api/admin/products/image?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setStatus({ kind: "error", message: data?.error ?? "Remove failed. Try again." });
        return;
      }
      onChange({ ...value, image: null });
      setSavedUrl(null);
      setStatus({ kind: "removed" });
    } catch {
      setStatus({ kind: "error", message: "Could not reach the server. Try again." });
    }
  }

  const currentUrl = previewUrl ?? (isAbsoluteUrl(value.image) ? value.image : savedUrl);
  const fallbackUrl = slug ? getProductPhotoAsset(slug) : null;

  return (
    <div className="block sm:col-span-2">
      <span className="admin-label">Product image upload</span>
      <div className="mt-2 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:flex-row">
        <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white sm:w-48">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt={value.name ? `Preview of ${value.name}` : "Selected product image preview"} className="h-full w-full object-contain" />
          ) : fallbackUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fallbackUrl} alt="Current default product photo" className="h-full w-full object-contain opacity-70" />
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><ImagePlus className="h-4 w-4" /> No image yet</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          <p className="text-xs text-slate-600">
            {savedUrl && !previewUrl ? "Uploaded image saved — shown on the public product page." : previewUrl ? "Preview of the selected file — press Upload to save it." : "No uploaded image — the public page shows the default photo."}
          </p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:border-brand hover:file:text-brand" aria-label="Choose product image" />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={upload} disabled={!pendingFile || !slug || status.kind === "uploading"} className="btn-primary !min-h-9 text-xs disabled:opacity-50">
              {status.kind === "uploading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <span>{savedUrl || isAbsoluteUrl(value.image) ? "Replace image" : "Upload image"}</span>
            </button>
            {(savedUrl || isAbsoluteUrl(value.image)) && (
              <button type="button" onClick={remove} disabled={status.kind === "uploading"} className="admin-action admin-action-danger !py-2 text-xs"><Trash2 className="h-3.5 w-3.5" /> <span>Remove</span></button>
            )}
          </div>
          {!slug && <p className="text-xs text-amber-700">Enter a product name first so the image has a slug to attach to.</p>}
          {status.kind === "loading" && <p className="text-xs text-slate-500">Checking saved image…</p>}
          {status.kind === "saved" && <p className="text-xs font-semibold text-emerald-700">Saved — persists across devices and redeploys.</p>}
          {status.kind === "removed" && <p className="text-xs font-semibold text-slate-600">Removed — public page uses the default photo again.</p>}
          {status.kind === "error" && <p role="alert" className="text-xs font-semibold text-rose-600">{status.message}</p>}
          <p className="text-[11px] text-slate-400">JPEG, PNG, or WebP · max 4 MB · stored in Vercel Blob, linked from Neon.</p>
        </div>
      </div>
    </div>
  );
}

function AdminSelect({ label, value, options, onChange }: { label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return <label className="block"><span className="admin-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="input mt-2">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}
