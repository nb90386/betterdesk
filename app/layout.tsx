import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

// Self-hosted OFL fonts (Newsreader, Geist, Geist Mono), latin subset, variable axes.
const newsreader = localFont({
  src: [
    { path: "./fonts/Newsreader.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/Newsreader-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});
const geist = localFont({ src: "./fonts/Geist.woff2", weight: "100 900", variable: "--font-geist", display: "swap" });
const geistMono = localFont({ src: "./fonts/GeistMono.woff2", weight: "100 900", variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BetterDesk · The front desk that follows through",
    template: "%s · BetterDesk",
  },
  description:
    "BetterDesk texts back missed callers, answers from what you've taught it, offers open times and keeps you in the loop. Built for busy service businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BetterDesk",
    url: SITE_URL,
    title: "BetterDesk · The front desk that follows through",
    description: "Missed calls become booked appointments, without hiring another receptionist.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3eee4",
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
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="grain min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
