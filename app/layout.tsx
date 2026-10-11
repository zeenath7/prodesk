import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QuoteCartProvider } from "@/components/QuoteCartContext";
import QuoteDrawer from "@/components/QuoteDrawer";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://prodeskonline.com"),
  title: "ProDesk Office Stationery | Wholesale Stationery & Office Supplies, Riyadh",
  description:
    "ProDesk Office Stationery in Riyadh supplies office and school products, filing systems, boards, and wholesale stationery across Saudi Arabia. Explore 177 catalogue products and request a quote.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ProDesk Office Stationery",
    title: "ProDesk Office Stationery | Wholesale Supplies in Riyadh",
    description:
      "Browse 177 office and school stationery products from ProDesk in Riyadh and request a wholesale quote.",
    url: "https://prodeskonline.com",
    locale: "en_SA",
  },
  twitter: {
    card: "summary",
    title: "ProDesk Office Stationery | Wholesale Supplies in Riyadh",
    description:
      "Browse office and school stationery from ProDesk in Riyadh and request a wholesale quote.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <QuoteCartProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "ProDesk Office Stationery",
                  url: "https://prodeskonline.com",
                  email: "sales@azmakonline.com",
                  telephone: "+966540339239",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Talha Bin Malik Street, Al Malaz Dist",
                    postOfficeBoxNumber: "12831",
                    addressLocality: "Riyadh",
                    addressCountry: "SA",
                  },
                },
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "ProDesk Office Stationery",
                  url: "https://prodeskonline.com",
                  inLanguage: "en",
                },
              ]).replace(/</g, "\\u003c"),
            }}
          />
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <QuoteDrawer />
        </QuoteCartProvider>
      </body>
    </html>
  );
}
