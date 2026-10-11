import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProDesk Office Stationery — Wholesale Supplies, Riyadh",
    short_name: "ProDesk",
    description:
      "Wholesale office and school stationery in Riyadh, Saudi Arabia. Browse the catalogue and request a quote.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
