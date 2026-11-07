import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Self-hosted OFL fonts. Funnel Display (wght 300–800) is the display voice only; Geist (wght 100–900)
// carries UI and text; Geist Mono is for times, IDs and numbers in tables.
const funnel = localFont({ src: "./fonts/FunnelDisplay.woff2", weight: "300 800", variable: "--font-funnel", display: "swap", fallback: ["Helvetica Neue", "system-ui", "sans-serif"] });
const geist = localFont({ src: "./fonts/Geist.woff2", weight: "100 900", variable: "--font-geist", display: "swap", fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"], adjustFontFallback: "Arial" });
const geistMono = localFont({ src: "./fonts/GeistMono.woff2", weight: "100 900", variable: "--font-geist-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BetterDesk · More walkthroughs, less chasing leads",
    template: "%s · BetterDesk",
  },
  description:
    "BetterDesk helps commercial cleaning companies find businesses worth contacting, prepare introductions they approve, handle incoming inquiries and keep every opportunity moving to a booked walkthrough.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BetterDesk",
    url: SITE_URL,
    title: "BetterDesk · More walkthroughs, less chasing leads",
    description: "The growth system for commercial cleaning companies: find, qualify, introduce, book the walkthrough, win the contract.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#071315",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BetterDesk",
  url: SITE_URL,
  email: "hello@betterdesk.ai",
  description: "Sales and inquiry software for commercial cleaning companies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${funnel.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        {/* Marks the page as scripted before paint, so scroll-revealed content is only hidden when JS can reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-[8px] focus:bg-ink focus:px-4 focus:py-2 focus:text-mineral"
        >
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
