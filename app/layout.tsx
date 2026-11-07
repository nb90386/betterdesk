import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";
import { SITE_URL } from "@/lib/site";

// Self-hosted OFL fonts. Instrument Sans variable (wght 400–700, wdth 75–100) is the only voice;
// display sizes tighten width and tracking, text sizes stay at full width. Geist Mono only for clock times.
const instrument = localFont({
  src: "./fonts/InstrumentSans.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  fallback: ["Helvetica Neue", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
const geistMono = localFont({ src: "./fonts/GeistMono.woff2", weight: "100 900", variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BetterDesk · Every inquiry deserves an answer",
    template: "%s · BetterDesk",
  },
  description:
    "BetterDesk texts back the calls you miss, answers from what you've approved and offers your real open times, so a missed call can still become a booked appointment.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BetterDesk",
    url: SITE_URL,
    title: "BetterDesk · Every inquiry deserves an answer",
    description: "From the first ring to the booked appointment. A front desk for service businesses.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f2f2ef",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BetterDesk",
  url: SITE_URL,
  email: "hello@betterdesk.ai",
  description: "A front desk service for service businesses: missed-call text-back, replies, booking and follow-up.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-[8px] focus:bg-ink focus:px-4 focus:py-2 focus:text-porcelain"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="relative">{children}</main>
        <SiteFooter />
        <StickyCta />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
