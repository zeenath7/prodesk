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

## Saudi SEO

- Canonical domain `https://prodeskonline.com`, `en-SA` language targeting,
  Riyadh geo tags, and `Store` + `WebSite` JSON-LD (see `app/layout.tsx`).
- Catalogue counts come from `lib/seo.ts` (`PRODUCT_COUNT`) so UI copy,
  metadata, and `sitemap.xml` never drift from `data/catalog.ts`.
- `/sitemap.xml` lists all static, category, and product URLs (with product
  images); `/admin` and `/api/admin` are disallowed in `/robots.txt`.
