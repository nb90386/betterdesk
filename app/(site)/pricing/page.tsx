import type { Metadata } from "next";
import { ButtonLink, TextLink } from "@/components/site/primitives";
import { OFFER, PRICING_STATUS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing (proposed)",
  description: "One early-access offer for commercial cleaning companies: a guided setup and visibility review, then one monthly workspace with hard usage limits. Proposed, not yet for sale.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  ["Why one plan instead of three?", "Most owner-led cleaning companies need the same things: be findable, have a steady list of good prospects, and answer inquiries fast. One plan is easier to judge and easier to cancel."],
  ["Is the website check free?", "Yes, during early access. Run it on a site you own from the Presence page. The paid review adds a person, your Business Profile and your inquiry path."],
  ["Will it get me into ChatGPT or Google’s AI answers?", "Nobody can promise that. Presence makes sure those services can read your site and understand what you do. Whether they show you depends on them."],
  ["Do you send outreach for me?", "Not today. Scout drafts introductions you approve. Sending will need your own mailbox connected, and the rules for business email outreach still apply."],
  ["What if I go over a limit?", "That kind of work pauses. Nothing is billed automatically. You can wait for the next month or choose a top-up."],
] as const;

export default function Pricing() {
  const { setup, workspace, limits } = OFFER;
  return (
    <>
      <section className="wrap pb-12 pt-32 md:pt-40">
        <p className="text-[0.875rem] font-[560] text-lamp-ink">{PRICING_STATUS}</p>
        <h1 className="t-display mt-4 max-w-[18ch]">One way to start. One plan after that.</h1>
        <p className="t-lede mt-6 max-w-[58ch]">A person sets BetterDesk up around your service area and the buildings you want, then you run it month to month. These prices are proposals we’re testing with early customers.</p>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <div className="grid border-y border-rule-strong lg:grid-cols-2">
          {[setup, workspace].map((p, i) => (
            <div key={p.name} className={`py-10 ${i === 0 ? "lg:pr-12" : "border-t border-rule lg:border-l lg:border-t-0 lg:pl-12"}`}>
              <p className="text-[0.875rem] text-muted">{i === 0 ? "First" : "Then"}</p>
              <h2 className="mt-1 text-[1.625rem] font-[600] tracking-[-0.022em]">{p.name}</h2>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="text-[3.25rem] font-[600] leading-none tracking-[-0.04em] tabular-nums">${p.price}</span>
                <span className="text-muted">{p.unit}, proposed</span>
              </p>
              <ul className="mt-7 grid gap-2.5 text-ink-2">
                {p.includes.map((x) => (
                  <li key={x} className="border-t border-rule pt-2.5">{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <ButtonLink href="/contact">Get a free check</ButtonLink>
            <TextLink href="/presence#check">Run the free website check</TextLink>
          </div>
          <p className="max-w-[44ch] text-[0.875rem] text-muted">Larger team or several locations? Tell us in the review request and we’ll quote it plainly.</p>
        </div>
      </section>

      <section className="border-t border-rule bg-surface">
        <div className="wrap grid gap-12 py-20 md:py-24 lg:grid-cols-12">
          <h2 className="t-title max-w-[12ch] lg:col-span-4">Limits, in plain words.</h2>
          <ul className="lg:col-span-8">
            {limits.map((l) => (
              <li key={l} className="border-b border-rule py-4 text-ink-2">{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <h2 className="t-title max-w-[12ch] lg:col-span-4">Questions owners ask.</h2>
        <dl className="lg:col-span-8">
          {FAQ.map(([q, a]) => (
            <div key={q} className="border-b border-rule py-5">
              <dt className="text-[1.125rem] font-[600] tracking-[-0.01em]">{q}</dt>
              <dd className="mt-2 max-w-[64ch] text-ink-2">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
