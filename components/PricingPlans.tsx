import Link from "next/link";
import { PLANS } from "@/lib/site";

export function PricingPlans({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PLANS.map((p) => (
        <article
          key={p.id}
          className={`relative flex flex-col rounded-[var(--radius-lg)] border p-6 sm:p-7 ${
            p.featured ? "border-ink bg-ink text-card shadow-[var(--shadow-lift)]" : "border-rule bg-card shadow-[var(--shadow-card)]"
          }`}
          aria-labelledby={`plan-${p.id}`}
        >
          <div className="flex items-center justify-between">
            <h3 id={`plan-${p.id}`} className="text-[1.05rem] font-semibold tracking-[-0.01em]">
              {p.name}
            </h3>
            {p.featured ? <span className="rounded-full bg-card/10 px-2.5 py-0.5 font-mono text-[0.64rem] uppercase tracking-[0.08em] text-card/80">Most chosen</span> : null}
          </div>
          <p className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-[3.4rem] leading-none tracking-[-0.03em]">${p.price}</span>
            <span className={p.featured ? "text-card/70" : "text-muted"}>/ month</span>
          </p>
          <p className={`mt-3 text-[0.92rem] leading-relaxed ${p.featured ? "text-card/80" : "text-ink-2"}`}>{p.blurb}</p>
          <p className={`mt-3 font-mono text-[0.72rem] ${p.featured ? "text-card/60" : "text-muted"}`}>Best for: {p.bestFor}</p>
          {!compact ? (
            <ul className={`mt-6 space-y-2.5 border-t pt-6 text-[0.9rem] ${p.featured ? "border-card/15" : "border-rule"}`}>
              {p.includes.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <svg viewBox="0 0 16 16" className={`mt-1 size-3.5 shrink-0 ${p.featured ? "text-handled-bright" : "text-handled"}`} aria-hidden="true">
                    <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href={`/contact?plan=${p.id}`}
            className={`press mt-auto inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[0.92rem] font-medium ${
              compact ? "mt-6" : "mt-8"
            } ${p.featured ? "bg-card text-ink hover:bg-white" : "border border-rule-strong text-ink hover:border-ink/50"}`}
          >
            {p.cta}
            <span className="sr-only"> with the {p.name} plan</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
