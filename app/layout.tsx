import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QuoteCartProvider } from "@/components/QuoteCartContext";
import QuoteDrawer from "@/components/QuoteDrawer";
import type { CompanyInfo } from "@/data/company";
import { getSharedCompany } from "@/lib/catalog-storage";
import { CompanyProvider } from "@/lib/company-context";
import {
  MARKETING_PRODUCT_COUNT,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

const defaultDescription =
  "ProDesk is a stationery supplier in Riyadh, Saudi Arabia, offering office supplies, school stationery, and wholesale solutions for businesses, schools, and retailers.";

const defaultTitle =
  "ProDesk Office Stationery | Wholesale & Retail Supplier in Riyadh";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: defaultDescription,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: true, address: true, telephone: true },
  icons: {
    icon: [{ url: `${SITE_URL}/icon.png`, sizes: "64x64", type: "image/png" }],
    shortcut: [{ url: `${SITE_URL}/favicon.ico`, type: "image/x-icon" }],
    apple: [{ url: `${SITE_URL}/apple-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: SITE_URL,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${SITE_URL}/hero-stationery-home-v2.png`,
        width: 1200,
        height: 800,
        alt: "ProDesk office stationery catalogue and Riyadh warehouse supply",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${SITE_URL}/hero-stationery-home-v2.png`],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: "googlefdeb95cd92b8d37e" },
  other: {
    "geo.region": "SA-RI",
    "geo.placename": "Riyadh, Saudi Arabia",
    "geo.position": "24.675694;46.728556",
    ICBM: "24.675694, 46.728556",
  },
};

function buildStructuredData(info: CompanyInfo) {
  return [
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}#store`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/hero-stationery-home-v2.png`,
    logo: `${SITE_URL}/logo.png`,
    email: info.email,
    telephone: info.phoneHref.replace(/^tel:/, ""),
    priceRange: "SAR",
    currenciesAccepted: "SAR",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Talha Bin Malik Street, Al-Malaz Dist",
      postOfficeBoxNumber: "12831",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Province",
      postalCode: "12831",
      addressCountry: "SA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 24.675694, longitude: 46.728556 },
    hasMap: "https://www.google.com/maps/search/?api=1&query=24.675694,46.728556",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      opens: "08:00",
      closes: "21:30",
    },
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "City", name: "Riyadh" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-SA",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sharedCompany = await getSharedCompany();
  return (
    <html lang="en" className={`${sans.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <CompanyProvider value={sharedCompany}>
        <QuoteCartProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildStructuredData(sharedCompany)).replace(/</g, "\\u003c"),
            }}
          />
          <Header productCountLabel={MARKETING_PRODUCT_COUNT} />
          <div id="main-content">{children}</div>
          <Footer />
          <QuoteDrawer productCount={MARKETING_PRODUCT_COUNT} />
        </QuoteCartProvider>
        </CompanyProvider>
      </body>
    </html>
  );
}
