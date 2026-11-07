import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { CloseCta } from "@/components/home/Sections";
import { PLANS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Proposed BetterDesk plans: Starter $129/mo, Growth $249/mo, Scale $499/mo, with included conversations and setup with a person. Monthly, no annual contract.",
  alternates: { canonical: "/pricing" },
};

type Cell = boolean | string;
const ROWS: { group: string; items: [string, Cell, Cell, Cell][] }[] = [
  {
    group: "Channels",
    items: [
      ["Missed-call text-back", true, true, true],
      ["Replies on calls, SMS and web forms", true, true, true],
      ["Instagram DMs, Google Business, email", false, true, true],
      ["Unified inbox", true, true, true],
    ],
  },
  {
    group: "Booking and follow-up",
    items: [
      ["Appointment booking", true, true, true],
      ["Follow-up sequences", "Basic", "Advanced, multi-step", "Advanced, multi-step"],
      ["Review generation", false, true, true],
      ["Multi-location routing", false, false, true],
      ["Custom CRM + booking integrations", false, false, true],
    ],
  },
  {
    group: "Insight and control",
    items: [
      ["Smart lead scoring + owner alerts", false, true, true],
      ["English-language analytics", false, true, true],
      ["Custom voice + brand training", false, false, true],
    ],
  },
  {
    group: "Support",
    items: [
      ["Setup and onboarding with a person", true, true, true],
      ["Support", "Live human support", "Priority", "Dedicated success manager"],
      ["SLA + premium support", false, false, true],
      ["Quarterly business reviews", false, false, true],
    ],
  },
];

const PRICING_FAQ = [
  { q: "Is setup extra?", a: "No. Every plan includes setup, calibration to your business and live human support." },
  { q: "Is there a contract?", a: "No annual lock-in. Plans are monthly and you can cancel any time." },
  {
    q: "Which plan should I pick?",
    a: "Starter suits one location with a modest number of inquiries handled mostly by phone, text and web forms. Growth adds social and email channels, review requests, alerts and analytics. Scale is for multiple locations or custom integrations. The 'best for' lines are a guide; we'll recommend one on the call.",
  },
  {
    q: "What counts as a conversation?",
    a: "One customer thread in a 24-hour window, on any channel: a missed call that gets a text back, a text, a form, a message. If the same customer writes again the next day, that's a second conversation. Spam that BetterDesk ignores doesn't count.",
  },
  {
    q: "What happens if I go over?",
    a: "In this proposal, extra conversations cost $0.40 each and we tell you before it happens, so you can move up a plan if that's cheaper. Nothing stops replying when you reach the included amount.",
  },
  {
    q: "Why are these prices marked proposed?",
    a: "They are a lower price proposal for review, about 13 to 17 percent below the currently published $149, $299 and $599. Nothing on this page charges a card. Your quote is confirmed in writing on the demo call.",
  },
  {
    q: "Will it pay for itself?",
    a: (
      <>
        That depends on how many inquiries you miss today and what a job is worth to you. The{" "}
        <Link href="/roi" className="underline underline-offset-4">
          value calculator
        </Link>{" "}
        shows the math with your numbers. We don&rsquo;t publish average results because we don&rsquo;t want to promise yours.
      </>
    ),
  },
];

const Tick = ({ v }: { v: Cell }) =>
  v === true ? (
    <svg viewBox="0 0 16 16" className="mx-auto h-4 w-4" role="img" aria-label="Included"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : v === false ? (
    <span className="text-muted" aria-label="Not included">&ndash;</span>
  ) : (
    <span>{v}</span>
  );

export default function PricingPage() {
  return (
    <>
      <PageIntro title="Priced per business. Setup included.">
        <p>Three monthly plans with a set number of conversations, no seat math and no annual contract. A person sets it up with you on every plan.</p>
      </PageIntro>
      <section aria-labelledby="plans-h" className="bg-porcelain pb-24">
        <div className="wrap">
          <h2 id="plans-h" className="sr-only">Plans</h2>
          <Pricing />
        </div>
      </section>

      <section aria-labelledby="compare-title" className="border-t border-rule bg-porcelain py-24 md:py-32">
        <div className="wrap">
          <h2 id="compare-title" className="t-title">Every plan, side by side.</h2>
          <div className="mt-10 overflow-x-auto" role="region" aria-label="Plan comparison table, scrolls sideways on small screens" tabIndex={0}>
            <table className="w-full min-w-[640px] border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="w-[40%] py-3 pr-4 font-normal text-muted"><span className="sr-only">Feature</span></th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className="py-3 text-center font-semibold">{p.name} · ${p.price}</th>
                  ))}
                </tr>
              </thead>
              {ROWS.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="pb-2 pt-8 text-[0.8125rem] font-[550] text-muted">{g.group}</th>
                  </tr>
                  {g.items.map(([label, a, b, c]) => (
                    <tr key={label} className="border-b border-rule">
                      <th scope="row" className="py-3 pr-4 font-normal">{label}</th>
                      {[a, b, c].map((v, i) => (
                        <td key={i} className="py-3 text-center"><Tick v={v} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
              <tbody>
                <tr><th colSpan={4} scope="colgroup" className="pb-2 pt-8 text-[0.8125rem] font-[550] text-muted">Usage (proposed)</th></tr>
                <tr className="border-b border-rule">
                  <th scope="row" className="py-3 pr-4 font-normal">Conversations included each month</th>
                  {PLANS.map((p) => <td key={p.id} className="py-3 text-center tabular">{p.includedConversations.toLocaleString()}</td>)}
                </tr>
                <tr className="border-b border-rule">
                  <th scope="row" className="py-3 pr-4 font-normal">Each extra conversation</th>
                  {PLANS.map((p) => <td key={p.id} className="py-3 text-center tabular">$0.40</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-porcelain-2 py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="t-title">Pricing questions.</h2>
            <p className="mt-4 text-[1rem] text-ink-2">Or try the <Link href="/roi" className="underline underline-offset-4">value calculator</Link> with your own numbers.</p>
          </div>
          <Faq items={PRICING_FAQ} className="lg:col-span-8" />
        </div>
      </section>
      <CloseCta />
    </>
  );
}
