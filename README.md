# ProDesk website
`npm install && npm run dev`, then open http://localhost:3005.
Data source: `docs/BLUE CRYSTAL CATALOGUE NEW.pdf` (85 pages, kept out of git).
Edit company details in `data/company.ts` and products in `data/catalog.ts`.

## Admin access

The `/admin` route is protected by server-side HTTP Basic Authentication. Copy `.env.example` to `.env.local` and set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before starting the app. Set the same variables in the production deployment environment; never use `NEXT_PUBLIC_` for these values.
