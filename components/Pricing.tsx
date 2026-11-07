import Link from "next/link";
import { OVERAGE_PROPOSAL, PLANS } from "@/lib/site";

/**
 * Three plans as one ruled table-like row, not three floating cards. The featured plan is marked
 * by a solid top rule and its button, not a glow or badge.
 */
export function Pricing() {
  return (
    <div>
      <div className="grid border-t border-rule md:grid-cols-3">
        {PLANS.map((p, i) => (
          <div
            key={p.id}
            className={`relative flex flex-col py-8 md:px-7 md:py-10 ${i > 0 ? "border-t border-rule md:border-l md:border-t-0" : ""} ${i === 0 ? "md:pl-0" : ""} ${i === 2 ? "md:pr-0" : ""}`}
          >
            {p.featured ? <span aria-hidden="true" className="absolute inset-x-0 -top-px h-[2px] bg-ink md:inset-x-7" /> : null}
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[1.375rem] font-semibold tracking-[-0.02em]">{p.name}</h3>
              {p.featured ? <span className="text-[0.8125rem] text-muted">Where most shops start</span> : null}
            </div>
            <p className="mt-2 min-h-[3em] text-[0.9375rem] leading-snug text-ink-2">{p.blurb}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[3rem] font-semibold leading-none tracking-[-0.04em] tabular [font-stretch:92%]">${p.price}</span>
              <span className="text-[0.9375rem] text-muted">a month</span>
            </p>
            <p className="mt-2 text-[0.8125rem] text-muted">
              Proposed price. Today&rsquo;s published price is ${p.currentPrice}.
            </p>
            <dl className="mt-6 space-y-1.5 border-y border-rule py-4 text-[0.9375rem]">
              <div className="flex justify-between gap-4"><dt className="text-ink-2">Conversations included</dt><dd className="tabular font-[550]">{p.includedConversations.toLocaleString()} / mo</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-2">Locations</dt><dd className="font-[550]">{p.locations}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-2">Good for</dt><dd className="text-right">{p.bestFor.split(", ")[1] ?? p.bestFor}</dd></div>
            </dl>
            <ul className="mt-5 flex-1 space-y-2 text-[0.9375rem]">
              {p.includes.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <svg viewBox="0 0 16 16" className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-ink" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <Link
              href={`/contact?plan=${p.id}`}
              className={`press mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-sm)] text-[1rem] font-[550] ${p.featured ? "bg-ink text-porcelain hover:bg-ink-2" : "border border-rule-strong hover:border-ink"}`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 border-t border-rule pt-5 text-[0.875rem] text-muted md:grid-cols-3 md:gap-7">
        <p>Every plan: setup with a person, calibration to your business, live human support. Monthly, no annual contract, cancel any time.</p>
        <p>A conversation is one customer thread in a 24-hour window, on any channel. Over the included amount: {OVERAGE_PROPOSAL} (proposed). Nothing is &ldquo;unlimited&rdquo;.</p>
        <p>These prices are a proposal for review and are not wired to any checkout. Choosing a plan opens the demo request form; nothing is charged here.</p>
      </div>
    </div>
  );
}
