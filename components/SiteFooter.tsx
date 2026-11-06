import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT_EMAIL, FOOTER } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper-2/60">
      <div className="container-bd grid gap-12 py-16 md:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-ink">
            The front desk that follows through.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            For service businesses that lose work when nobody can get to the phone.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-block text-sm text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.95rem] text-ink-2 hover:text-ink hover:underline hover:underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-bd flex flex-col gap-2 border-t border-rule py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} BetterDesk</p>
        <p>Conversations shown on this site are illustrations with sample data.</p>
      </div>
    </footer>
  );
}
