import Link from "next/link";
import { PLANS } from "@/lib/site";

export function PricingPlans({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PLANS.map((p) => (
        <article
          key={p.id}
          className={`relative flex flex-col rounded-[var(--radius-lg)] border p-6 sm:p-7 ${
            p.featured ? "border-transparent bg-[linear-gradient(180deg,#1b1d21,#111214)] text-[#f7f6f3] shadow-[var(--shadow-device),inset_1px_1px_0_rgb(244_169_71/0.22)]" : "border-rule bg-card shadow-[var(--shadow-card)]"
          }`}
          aria-labelledby={`plan-${p.id}`}
        >
          <div className="flex items-center justify-between">
            <h3 id={`plan-${p.id}`} className="text-[1.05rem] font-semibold tracking-[-0.01em]">
              {p.name}
            </h3>
            {p.featured ? <span className="rounded-[6px] bg-lamp/15 px-2 py-1 text-[0.74rem] font-medium text-lamp">Most popular</span> : null}
          </div>
          <p className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-[3.4rem] leading-none tracking-[-0.03em]">${p.price}</span>
            <span className={p.featured ? "text-[#a4a8ae]" : "text-muted"}>/ month</span>
          </p>
          <p className={`mt-3 text-[0.92rem] leading-relaxed ${p.featured ? "text-[#d4d6da]" : "text-ink-2"}`}>{p.blurb}</p>
          <p className={`mt-3 text-[0.82rem] ${p.featured ? "text-[#a4a8ae]" : "text-muted"}`}>Best for {p.bestFor}</p>
          {!compact ? (
            <ul className={`mt-6 space-y-2.5 border-t pt-6 text-[0.9rem] ${p.featured ? "border-white/10" : "border-rule"}`}>
              {p.includes.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <svg viewBox="0 0 16 16" className={`mt-1 size-3.5 shrink-0 ${p.featured ? "text-lamp" : "text-ink"}`} aria-hidden="true">
                    <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          ) : null}
          <div className={`mt-auto ${compact ? "pt-6" : "pt-8"}`}>
            <Link
              href={`/contact?plan=${p.id}`}
              className={`press inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-[0.92rem] font-medium ${
                p.featured ? "bg-[#f7f6f3] text-[#111214] hover:bg-white" : "border border-rule-strong text-ink hover:border-ink/50"
              }`}
            >
              {p.cta}
              <span className="sr-only"> with the {p.name} plan</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
