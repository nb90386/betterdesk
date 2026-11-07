import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PlanReceipt } from "@/components/HeroArtifacts";
import { PricingPlans } from "@/components/PricingPlans";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { SectionHeading } from "@/components/Section";

export const metadata: Metadata = {
  title: "Pricing",
  description: "BetterDesk plans: Starter $149/mo, Growth $299/mo, Scale $599/mo. Setup and human support included. No annual contract.",
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
    q: "What counts as a lead?",
    a: "A new inquiry from a person: a missed call, a text, a form, a message. The weekly ranges show which plan usually fits. Tell us your volume and we'll recommend one.",
  },
  {
    q: "Will it pay for itself?",
    a: (
      <>
        That depends on how many inquiries you miss today and what a job is worth to you. The{" "}
        <Link href="/roi" className="underline underline-offset-4">
          ROI calculator
        </Link>{" "}
        shows the math with your numbers. We don&rsquo;t publish average results because we don&rsquo;t want to promise yours.
      </>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Simple plans. No seat math.</>} aside={<PlanReceipt />}>
        <p>Every plan includes setup, calibration and live human support. Monthly, with no annual contract.</p>
      </PageHero>
      <section className="container-bd py-14 md:py-20" aria-labelledby="plans-h">
        <h2 id="plans-h" className="sr-only">Plans</h2>
        <PricingPlans />
      </section>

      <section className="container-bd pb-20 md:pb-28" aria-labelledby="compare-title">
        <SectionHeading mark="ink" id="compare-title" title="Every plan, side by side." />
        <div className="reveal relative mt-10 overflow-x-auto rounded-[var(--radius-lg)] border border-rule bg-card" role="region" aria-label="Plan comparison table, scrolls sideways on small screens" tabIndex={0}>
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.9rem]">
            <caption className="sr-only">Feature comparison of Starter, Growth and Scale plans</caption>
            <thead>
              <tr className="border-b border-rule-strong">
                <th scope="col" className="w-[40%] px-5 py-4 font-medium text-muted">Feature</th>
                {["Starter · $149", "Growth · $299", "Scale · $599"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-4 font-semibold text-ink">{h}</th>
                ))}
              </tr>
            </thead>
            {ROWS.map((g) => (
              <tbody key={g.group}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-paper-2/60 px-5 py-2.5 font-mono text-[0.7rem] font-normal uppercase tracking-[0.08em] text-muted">
                    {g.group}
                  </th>
                </tr>
                {g.items.map(([label, ...cells]) => (
                  <tr key={label} className="border-t border-rule/70">
                    <th scope="row" className="px-5 py-3 font-normal text-ink">{label}</th>
                    {cells.map((c, i) => (
                      <td key={i} className="px-4 py-3 text-ink-2">
                        {c === true ? (<><span className="text-handled" aria-hidden="true">✓</span><span className="sr-only">Included</span></>) : c === false ? (<><span className="text-faint" aria-hidden="true">—</span><span className="sr-only">Not included</span></>) : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="container-bd grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="pfaq">
        <SectionHeading mark="handled" id="pfaq" title="Before you ask." />
        <Faq items={PRICING_FAQ} />
      </section>
      <CtaBand title={<>Not sure which plan? Ask us.</>} body="We'll look at how many inquiries you get and how they reach you, and recommend a plan, or tell you BetterDesk isn't the right fit yet." />
    </>
  );
}
