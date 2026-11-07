import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PUBLIC_ROUTES } from "@/lib/site";

const LABEL: Record<string, string> = {
  "/": "Home", "/product": "How it connects", "/product/presence": "Presence", "/product/scout": "Scout", "/product/desk": "Desk",
  "/solutions/commercial-cleaning": "For commercial cleaning", "/how-it-works": "Setup and support", "/demo": "Interactive demo",
  "/pricing": "Pricing", "/resources": "Guides", "/resources/ai-search-for-service-businesses": "AI search, plainly", "/contact": "Get a free check", "/security": "Security and data", "/solutions/b2b-services": "For other B2B services", "/integrations": "Integrations", "/about": "About", "/privacy": "Privacy (draft)",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="wrap pb-24 pt-32 md:pt-40">
        <p className="text-[0.875rem] text-muted">404</p>
        <h1 className="t-display mt-3 max-w-[16ch]">This suite isn’t in the directory.</h1>
        <p className="t-lede mt-5">The page may have moved. Here’s everything that’s here:</p>
        <ul className="mt-10 max-w-[44rem] border-t border-rule-strong">
          {PUBLIC_ROUTES.map((r) => (
            <li key={r} className="border-b border-rule">
              <Link href={r} className="flex min-h-12 items-center text-[1.0625rem] hover:text-ink">
                <span className="font-[560]">{LABEL[r] ?? r}</span>
                <span className="leader" aria-hidden="true" />
                <span className="text-[0.875rem] text-muted">{r}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
