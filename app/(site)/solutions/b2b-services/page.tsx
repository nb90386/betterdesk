import type { Metadata } from "next";
import { ButtonLink, TextLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "For B2B service companies",
  description: "BetterDesk fits service companies that win recurring business accounts after a site visit. Here is who it suits, who it doesn't, and what you'd set up differently.",
  alternates: { canonical: "/solutions/b2b-services" },
};

const FITS = [
  ["Facility and janitorial services", "Same pattern as cleaning: a walkthrough, a scope, a recurring contract."],
  ["Commercial window and pressure washing", "Recurring building accounts, quotes after a site look."],
  ["Commercial pest control", "Monthly service agreements with offices, clinics and property managers."],
  ["Commercial landscaping and snow removal", "Seasonal contracts with property managers, priced after a site visit."],
] as const;

const NOT_YET = [
  ["Mostly one-off consumer jobs", "Scout is built around business accounts with a decision-maker and a facility."],
  ["Emergency dispatch", "Desk doesn’t answer phones or route urgent calls. It organizes inquiries and follow-ups."],
  ["Phone answering or a receptionist service", "BetterDesk is not an answering service and doesn’t claim to be."],
] as const;

export default function B2BServices() {
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[17ch]">A simpler way to grow a service business.</h1>
        <p className="t-lede mt-7 max-w-[58ch]">If you win recurring work from businesses after a site visit, the same workflow applies: find the right accounts, be easy to find, and don’t let an inquiry go quiet. We built and tested it for commercial cleaning first, and we say so.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ButtonLink href="/contact">Tell us what you do</ButtonLink>
          <TextLink href="/solutions/commercial-cleaning">See the cleaning version</TextLink>
        </div>
      </section>
      <section className="border-y border-rule bg-surface">
        <div className="wrap grid gap-12 py-20 md:py-24 lg:grid-cols-2">
          <div>
            <h2 className="t-title">Usually a good fit</h2>
            <dl className="mt-6 border-t border-rule-strong">
              {FITS.map(([k, v]) => (
                <div key={k} className="border-b border-rule py-4">
                  <dt className="font-[600]">{k}</dt>
                  <dd className="mt-0.5 text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="t-title">Not a good fit yet</h2>
            <dl className="mt-6 border-t border-rule-strong">
              {NOT_YET.map(([k, v]) => (
                <div key={k} className="border-b border-rule py-4">
                  <dt className="font-[600]">{k}</dt>
                  <dd className="mt-0.5 text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12">
        <h2 className="t-title max-w-[14ch] lg:col-span-5">What you’d set up differently</h2>
        <ul className="lg:col-span-7">
          {[
            "Your fit criteria: the building types, sizes and areas that are worth your visit. Scout’s rules are yours, not ours.",
            "Your service and area pages, so Presence can check that your site describes what you actually sell.",
            "Your walkthrough or site-visit times, and who approves introductions.",
          ].map((t) => (
            <li key={t} className="border-b border-rule py-4 text-ink-2">{t}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
