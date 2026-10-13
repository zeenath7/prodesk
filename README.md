# ProDesk website
`npm install && npm run dev`, then open http://localhost:3005.
Data source: `docs/BLUE CRYSTAL CATALOGUE NEW.pdf` (85 pages, kept out of git).
Edit company details in `data/company.ts` and products in `data/catalog.ts`.

## Admin access
`/admin` uses a branded sign-in page at `/admin/login` with cookie sessions
(12-hour expiry, `HttpOnly` + `SameSite=Lax`, `Secure` in production).

1. Copy `.env.example` to `.env.local` and set `ADMIN_USERNAME`,
   `ADMIN_PASSWORD`, and a 32+ character `AUTH_SECRET`.
2. Without `DATABASE_URL`, login compares against the env credentials.
3. With Neon `DATABASE_URL` set, credentials live in the `admin_users` table
   (scrypt hashes, see `lib/admin-schema.sql`):
   - First login with the env credentials auto-seeds the Neon user, or
   - Pre-seed / reset any time: `npm run admin:create -- <username> <password>`
4. Set the same variables in the production deployment environment; never use
   `NEXT_PUBLIC_` for these values.

## Admin catalogue and company

- Products are grouped by category in `/admin`; each group has its own
  "Add to …" button that opens the editor with that category preselected.
- Product edits PUT to `/api/admin/products` → Neon `site_content` row
  `products`; company edits PUT to `/api/admin/company` → row `company`
  (see `lib/catalog-storage.ts`). Both require a signed-in admin (401
  otherwise) and return 503 without `DATABASE_URL`.
- Public pages (header, footer, contact, homepage, JSON-LD) read the shared
  company profile via `getSharedCompany()` with static fallback, so admin
  edits go live without a redeploy.

## Admin product images

In the Product Editor, the upload box next to "Product image filename" picks a
JPEG/PNG/WebP file (max 4 MB) from your computer, shows a preview, and on
Upload stores the bytes in **Vercel Blob** and the `slug → image_url` reference
in the Neon **`product_images`** table (`lib/product-images-schema.sql`).
Replace uploads a new file (old blob deleted); Remove deletes the reference
(public pages fall back to the default static photo). Only signed-in admins can
upload — the API checks the admin session cookie and returns 401 otherwise.
Without `BLOB_READ_WRITE_TOKEN` + `DATABASE_URL` the API returns 503 with the
setup hint instead of silently storing locally.

## Saudi SEO

- Canonical domain `https://prodeskonline.com`, `en-SA` language targeting,
  Riyadh geo tags, and `Store` + `WebSite` JSON-LD (see `app/layout.tsx`).
- Catalogue counts come from `lib/seo.ts` (`PRODUCT_COUNT` for functional
  surfaces, `MARKETING_PRODUCT_COUNT` for customer-facing marketing copy) so UI
  copy, metadata, and `sitemap.xml` stay consistent.
- `/sitemap.xml` lists all static, category, and product URLs (with product
  images); `/admin` and `/api/admin` are disallowed in `/robots.txt`.
