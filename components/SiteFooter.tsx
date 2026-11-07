import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT_EMAIL, FOOTER } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-mineral-2">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo className="text-[1.15rem]" />
          <p className="mt-5 max-w-[30ch] text-[1.0625rem] leading-snug text-ink-2">
            Find the right buildings, introduce yourself well, and keep every opportunity moving to a signed contract. Built for commercial cleaning companies.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-block text-[0.9375rem] text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-signal">
            {CONTACT_EMAIL}
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h2 className="t-label">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.9375rem] text-ink-2 hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-rule py-6 text-[0.8125rem] text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} BetterDesk</p>
        <p>Early access. Companies, people and conversations shown on this site are fictional samples.</p>
      </div>
    </footer>
  );
}
