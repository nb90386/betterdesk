import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CONTACT_EMAIL, FOOTER } from "@/lib/site";

/** The footer is the site's own lobby directory: every route is a line on a graphite board. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="on-graphite bg-graphite">
      <div className="wrap grid gap-14 pb-10 pt-16 lg:grid-cols-12 md:pt-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="BetterDesk home" className="inline-block rounded-[var(--radius-sm)] text-[1.15rem] text-ink">
            <Logo />
          </Link>
          <p className="mt-5 max-w-[30ch] text-[1.0625rem] leading-snug text-ink-2">
            Find better accounts, be easier to find and book more walkthroughs. Built for commercial cleaning companies.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="link mt-6 inline-block text-[0.9375rem] text-ink">
            {CONTACT_EMAIL}
          </a>
        </div>
        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h2 className="t-label border-b border-rule pb-3">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href} className="border-b border-rule">
                    <Link href={l.href} className="flex min-h-11 items-center text-[0.9375rem] text-ink-2 transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap flex flex-col gap-2 py-7 text-[0.8125rem] text-muted sm:flex-row sm:justify-between">
        <p>© {year} BetterDesk. Early access.</p>
        <p>Companies, people and conversations shown on this site are fictional samples.</p>
      </div>
    </footer>
  );
}
