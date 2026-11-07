import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";
import { SITE_URL } from "@/lib/site";

// Self-hosted OFL fonts, latin subset. Bricolage Grotesque variable (opsz 12–96, wght 200–800) is the display voice.
const bricolage = localFont({
  src: "./fonts/Bricolage.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["Avenir Next", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
const geist = localFont({ src: "./fonts/Geist.woff2", weight: "100 900", variable: "--font-geist", display: "swap" });
const geistMono = localFont({ src: "./fonts/GeistMono.woff2", weight: "100 900", variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BetterDesk · Every missed call, answered",
    template: "%s · BetterDesk",
  },
  description:
    "BetterDesk texts back missed callers, answers from what you've taught it, offers open times and keeps you in the loop. Built for busy service businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BetterDesk",
    url: SITE_URL,
    title: "BetterDesk · Every missed call, answered",
    description: "Missed calls become booked appointments, without hiring another receptionist.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0d0e10",
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
    <html lang="en" className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-lamp focus:px-4 focus:py-2 focus:text-night"
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
