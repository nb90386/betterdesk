import type { Metadata } from "next";
import { ButtonLink, TextLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "For commercial cleaning companies",
  description: "BetterDesk is built for owner-led commercial cleaning contractors winning recurring office, medical, property-management and coworking accounts.",
  alternates: { canonical: "/solutions/commercial-cleaning" },
};

const BUYERS = [
  ["Property managers", "Several buildings, one decision-maker, tenant complaints they want to stop hearing.", "Scout keeps buildings and managers together, so one relationship can become several contracts."],
  ["Offices", "An office manager juggling a cleaner who keeps missing things, often with a lease renewal coming up.", "A walkthrough-first reply that answers price questions honestly instead of guessing."],
  ["Medical and dental practices", "Exam rooms, sharps, schedules around patient hours. Trust matters more than price.", "Fit criteria for medical work, and a Presence check that your medical-cleaning page actually says what you do."],
  ["Coworking and flexible space", "Long hours, shared kitchens, members who notice everything.", "Desk keeps day-porter and nightly requests on one account so nothing is promised twice."],
  ["Light industrial and warehouses", "Large floors, different rules, sometimes outside your area.", "Scout marks size and area honestly, so you skip the ones that don’t fit instead of chasing them."],
] as const;

const FIRST_MONTH = [
  ["Week 1", "We review your website and inquiry path, set your service area, the buildings you want and who approves introductions."],
  ["Week 2", "Your first list goes through Scout. You see who fits, who needs research and who to leave alone, with reasons."],
  ["Week 3", "Website fixes are tasks with owners. Inquiries and replies start landing in one inbox."],
  ["Week 4", "A working pipeline: who you’re talking to, which walkthroughs are booked, which proposals need a follow-up."],
] as const;

export default function CommercialCleaning() {
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[19ch]">Built for cleaning companies that win in the walkthrough.</h1>
        <p className="t-lede mt-6 max-w-[60ch]">
          You probably don’t need more software. You need fewer good opportunities to slip: the building you meant to call, the form nobody answered, the proposal nobody followed up. BetterDesk is built for owner-led commercial cleaning contractors chasing recurring accounts.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ButtonLink href="/demo">Explore the product</ButtonLink>
          <TextLink href="/contact">Request a review</TextLink>
        </div>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="wrap py-20 md:py-24">
          <h2 className="t-title max-w-[20ch]">Who you sell to, and what helps.</h2>
          <p className="mt-4 max-w-[62ch] text-ink-2">Not every business in these categories wants a new cleaner. The point is to find the ones that might, and be easy to reach when they’re looking.</p>
          <div className="mt-10 overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
            <table className="w-full min-w-[48rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                  <th scope="col" className="w-[20%] py-3 pr-6 font-[560]">Buyer</th>
                  <th scope="col" className="py-3 pr-6 font-[560]">What they’re dealing with</th>
                  <th scope="col" className="py-3 font-[560]">Where BetterDesk helps</th>
                </tr>
              </thead>
              <tbody>
                {BUYERS.map(([b, pain, help]) => (
                  <tr key={b} className="border-b border-rule align-top">
                    <th scope="row" className="py-5 pr-6 text-[1.0625rem] font-[600]">{b}</th>
                    <td className="py-5 pr-6 text-ink-2">{pain}</td>
                    <td className="py-5 text-ink-2">{help}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="t-title max-w-[12ch]">Your first month.</h2>
          <p className="mt-5 text-ink-2">What changes, in the order it changes. No promise of a number of new contracts; we don’t know your market better than you do.</p>
        </div>
        <ol className="lg:col-span-8">
          {FIRST_MONTH.map(([w, d]) => (
            <li key={w} className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <span className="font-[600]">{w}</span>
              <span className="text-ink-2">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="on-graphite bg-graphite-2">
        <div className="wrap grid gap-8 py-20 md:py-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="t-title max-w-[22ch]">Other B2B service companies?</h2>
            <p className="mt-4 max-w-[60ch] text-ink-2">Facility services, pest control and other contractors with recurring business customers can use the same workflow. We built and tested the examples for cleaning first, so that’s what this site shows.</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <TextLink href="/contact" className="text-ink">Tell us what you do</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
