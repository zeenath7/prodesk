-- ProDesk product image overrides (Neon Postgres).
-- Maps a catalogue product slug to its uploaded image URL (Vercel Blob).
-- Applied automatically via ensureProductImagesTable(); this file is the
-- source of truth for manual inspection / psql use.
CREATE TABLE IF NOT EXISTS product_images (
  slug TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
