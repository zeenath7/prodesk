export interface Category { slug: string; name: string; description: string; icon: string }
export interface Brand { name: string }
export interface ProductItem { code: string; description: string; unit: string; box: string; ctn: string }
export interface Product {
  slug: string; name: string; brand: string; category: string; sku: string;
  price: number | null; // null = "Request Quote"
  availability: string; description: string; specs: Record<string, string>;
  image?: string | null;      // file name in public/products
  tableImage?: string | null; // file name in public/tables (original catalogue table)
  items?: ProductItem[];      // every code / size in this product group
}
export interface Customer { name: string; company?: string; phone: string; email: string }
export interface Enquiry extends Customer { product: string; quantity: number; message: string }
