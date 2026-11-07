import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/CloseCta";
import { Faq } from "@/components/Faq";
import { PLANS, PRICING_STATUS, TOP_UPS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Proposed BetterDesk early-access plans for commercial cleaning companies: Essential $99, Growth $249 and Team $499 a month, with clear usage limits and no surprise overage.",
  alternates: { canonical: "/pricing" },
};

const ROWS: [string, (p: (typeof PLANS)[number]) => string][] = [
  ["People", (p) => `${p.seats}`],
  ["Businesses researched by Scout / month", (p) => p.prospects.toLocaleString()],
  ["Introductions drafted / month", (p) => p.drafts.toLocaleString()],
  ["Inbound inquiries handled / month", (p) => p.conversations.toLocaleString()],
  ["Connected mailboxes and calendars (when available)", (p) => `${p.seats}`],
  ["Onboarding", (p) => p.onboarding],
  ["Support", (p) => p.support],
];

const FAQ = [
  { q: "Can I buy this today?", a: "Not yet. These are proposed early-access prices, published so you can judge whether BetterDesk is worth a conversation. Nothing on this site charges a card. If you join early access, your price is confirmed in writing first." },
  { q: "What happens when I hit a limit?", a: "Scout pauses and tells you. Nothing is billed automatically. You can add a top-up, move up a plan, or wait for next month." },
  { q: "What counts as a business researched?", a: "One business that Scout checks against your rules in a month, whether it ends up a good fit or not. Re-checking the same business in the same month doesn't count again." },
  { q: "What counts as an inbound inquiry?", a: "One conversation that starts from your website form or a reply to you. Spam and wrong-number messages that BetterDesk sets aside don't count." },
  { q: "Why not unlimited?", a: "Research and drafting have real costs. Clear limits keep the price low for small companies and stop one heavy month from turning into a surprise bill." },
  { q: "Is there a contract?", a: "The plan is monthly. Annual billing with about two months free is proposed for later." },
];

export default function PricingPage() {
  return (
    <>
      <PageIntro
        title="Priced per company, with limits you can see."
        aside={
          <div className="rounded-[var(--radius-lg)] border border-petrol-rule bg-petrol-2 p-5 text-[0.9375rem]">
            <p className="font-medium text-petrol-ink">{PRICING_STATUS}</p>
            <p className="mt-2 text-petrol-muted">Prices are a proposal based on our cost model. They will be confirmed with early-access customers before anyone is billed.</p>
          </div>
        }
      >
        <p>Three plans, each with a set amount of research, drafting and inquiry handling. Setup help is included. Nothing runs past your limit without you.</p>
      </PageIntro>

      <section aria-labelledby="plans-h" className="bg-mineral py-20 md:py-24">
        <div className="wrap">
          <h2 id="plans-h" className="sr-only">Plans</h2>
          <ol className="grid border-t-2 border-ink md:grid-cols-3">
            {PLANS.map((p, i) => (
              <li key={p.id} className={`relative flex flex-col py-8 md:px-7 ${i ? "border-t border-rule md:border-l md:border-t-0" : "md:pl-0"} ${i === 2 ? "md:pr-0" : ""}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.025em]">{p.name}</h3>
                  {p.featured ? <span className="text-[0.8125rem] font-medium text-signal-ink">Most companies start here</span> : null}
                </div>
                <p className="mt-2 min-h-[3.2em] text-[0.9375rem] leading-snug text-ink-2">{p.blurb}</p>
                <p className="mt-6 font-display text-[3.25rem] font-semibold leading-none tracking-[-0.045em] tabular-nums">${p.price}<span className="ml-1.5 font-sans text-[1rem] font-normal tracking-normal text-muted">a month</span></p>
                <p className="mt-2 text-[0.8125rem] text-muted">Proposed</p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-rule pt-5 text-[0.9375rem]">
                  {p.includes.map((x) => (
                    <li key={x} className="flex gap-2.5"><span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />{x}</li>
                  ))}
                </ul>
                <Link href={`/contact?plan=${p.id}`} className={`press mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-sm)] text-[1rem] font-[550] ${p.featured ? "bg-ink text-mineral hover:bg-ink-2" : "border border-rule-strong hover:border-ink"}`}>
                  Ask about {p.name}
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-[0.875rem] text-muted">Plan buttons open the demo request form with the plan filled in. It writes an email to us; nothing is charged or subscribed.</p>
        </div>
      </section>

      <section aria-labelledby="limits-h" className="border-t border-rule bg-mineral py-20 md:py-24">
        <div className="wrap">
          <h2 id="limits-h" className="t-title">What each plan includes.</h2>
          <div className="mt-8 overflow-x-auto" role="region" aria-label="Plan limits, scrolls sideways on small screens" tabIndex={0}>
            <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
              <thead><tr className="border-b border-ink"><th scope="col" className="w-[40%] py-3 pr-4 font-medium text-muted"><span className="sr-only">Limit</span></th>{PLANS.map((p) => <th key={p.id} scope="col" className="py-3 pr-4 font-semibold">{p.name}</th>)}</tr></thead>
              <tbody>{ROWS.map(([k, f]) => <tr key={k} className="border-b border-rule"><th scope="row" className="py-3 pr-4 font-normal">{k}</th>{PLANS.map((p) => <td key={p.id} className="py-3 pr-4 tabular-nums">{f(p)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-[1.0625rem] font-semibold">Top-ups, if you need more</h3>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-ink-2">{TOP_UPS.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-[1.0625rem] font-semibold">Not included</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">Prospect lists from paid data providers, text messaging and calling, and your crew, inspection or invoicing software. Keep the tools you already use for operations.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-h" className="bg-mineral-2 py-20 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-h" className="t-title lg:col-span-4">Pricing questions.</h2>
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </section>
      <CloseCta title="Not sure which plan fits?" lede="Tell us how many buildings you go after in a month and how inquiries reach you. We'll recommend a plan, or tell you it isn't worth it yet." />
    </>
  );
}
