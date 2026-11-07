import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";

// General Sans (Indian Type Foundry, ITF Free Font License 2.0: self-hosting permitted, no subsetting or modification),
// one variable file carries display, UI and text. Martian Mono (OFL) is only for code-like evidence: robots.txt lines,
// JSON-LD and event IDs.
const general = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  weight: "200 700",
  variable: "--font-general",
  display: "swap",
  fallback: ["Helvetica Neue", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});
const martian = localFont({ src: "./fonts/MartianMono-Variable.woff2", weight: "100 800", variable: "--font-martian", display: "swap", preload: false });

const TITLE = "BetterDesk · Find better accounts. Be easier to find. Book more walkthroughs.";
const DESCRIPTION =
  "One workspace for commercial cleaning companies: research businesses worth contacting, see how your company appears in Google and AI search, and keep every inquiry moving to a booked walkthrough.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · BetterDesk" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "BetterDesk", url: SITE_URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  // The preview is not the public site. Production indexing is a founder decision (docs/reinvention/FINAL_REPORT.md).
  robots: process.env.VERCEL_ENV === "production" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ecebe6",
  width: "device-width",
  initialScale: 1,
};

// Only facts visible on the site itself.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BetterDesk",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/betterdesk-mark.svg`,
  email: CONTACT_EMAIL,
  description: DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${general.variable} ${martian.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        {/* Marks the page as scripted before paint, so scroll-revealed content is only hidden when JS can reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-[8px] focus:bg-ink focus:px-4 focus:py-2 focus:text-stone"
        >
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
