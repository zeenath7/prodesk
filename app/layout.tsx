import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QuoteCartProvider } from "@/components/QuoteCartContext";
import QuoteDrawer from "@/components/QuoteDrawer";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ProDesk Office Stationery | Wholesale Stationery & Office Supplies, Riyadh",
  description:
    "ProDesk Office Stationery, Riyadh. Official distributor for Super Deal, Delux, and Azmak. Supplying 180+ office stationery lines, filing systems, boards, and wholesale supplies across Saudi Arabia.",
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
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <QuoteDrawer />
        </QuoteCartProvider>
      </body>
    </html>
  );
}
