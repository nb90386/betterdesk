import type { Metadata } from "next";
import { ButtonLink, StatusMark, TextLink, type Status } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Setup, support and limits",
  description: "What you provide, what BetterDesk does, what you receive, and which parts are live, demo or not built yet.",
  alternates: { canonical: "/how-it-works" },
};

const FLOW = [
  {
    who: "You provide",
    items: [
      ["Your website address", "So Presence can check what search engines and AI crawlers can read."],
      ["Where you clean and what you sell", "Service area, services, the kinds of buildings you want and roughly how big."],
      ["A list, if you have one", "A spreadsheet or export you’re allowed to use. Scout doesn’t scrape sites behind your back."],
      ["Who approves", "The person who signs off introductions and owns website fixes."],
    ],
  },
  {
    who: "BetterDesk does",
    items: [
      ["Checks your site", "Crawler access, indexing, service and area pages, name and phone consistency, structured data that matches the page."],
      ["Checks your list", "Removes duplicates, scores fit with evidence and dates, withholds anything suspicious."],
      ["Drafts, never sends", "Introductions built from facts, waiting for your approval."],
      ["Keeps one record", "Every account’s source, conversation, booking and stage on one timeline."],
    ],
  },
  {
    who: "You receive",
    items: [
      ["A fix list with owners", "Each website issue explained for a non-technical owner, with evidence and how to confirm the fix."],
      ["A shortlist with reasons", "Which businesses fit, which need research, which to leave alone."],
      ["Faster replies", "Inquiries next to their history, suggested replies that never invent a price."],
      ["A pipeline you trust", "Who’s next, what’s booked, which proposals need a follow-up."],
    ],
  },
] as const;

const INTEGRATIONS: [string, string, Status][] = [
  ["Public website audit", "Reads robots.txt, sitemap and up to 6 pages of a site you own", "BETA"],
  ["Sample workspace", "Every screen, on a fictional company, in your browser", "DEMO"],
  ["Review request form", "Delivered to the BetterDesk inbox when it’s connected on the deployment", "BLOCKED"],
  ["Google Search Console, Bing Webmaster Tools", "First-party search and AI-citation data, with your authorization", "PLANNED"],
  ["Google Business Profile", "Checking your profile matches your site", "PLANNED"],
  ["Gmail or Microsoft 365, calendars", "Reading replies, sending approved email from your mailbox, real availability", "PLANNED"],
  ["Accounts, sign-in, saved data", "A real multi-company backend with separated data", "PLANNED"],
];

export default function HowItWorks() {
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[18ch]">What you give, what we do, what you get.</h1>
        <p className="t-lede mt-6 max-w-[58ch]">No black box. Here’s the work on each side, how we support you, and the state of every connection, including the ones that don’t exist yet.</p>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <div className="grid border-t border-rule-strong lg:grid-cols-3">
          {FLOW.map((col, i) => (
            <div key={col.who} className={`py-8 lg:px-8 ${i === 0 ? "lg:pl-0" : "border-t border-rule lg:border-l lg:border-t-0"}`}>
              <h2 className="text-[1.375rem] font-[600] tracking-[-0.02em]">{col.who}</h2>
              <dl className="mt-5">
                {col.items.map(([k, v]) => (
                  <div key={k} className="border-t border-rule py-3.5">
                    <dt className="font-[600]">{k}</dt>
                    <dd className="mt-0.5 text-[0.9375rem] text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="wrap grid gap-12 py-20 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[12ch]">Support from a person.</h2>
          </div>
          <div className="grid gap-6 text-ink-2 lg:col-span-8">
            <p>Setup is done with you, not handed to you: one working session, and we do the import. After that, email support from the people building BetterDesk.</p>
            <p>During early access we don’t publish response-time guarantees. If something breaks, we’ll tell you plainly what happened and what we changed.</p>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="t-title max-w-[12ch]">Connections, honestly.</h2>
          <p className="mt-5 text-ink-2">Live means it works now. Demo means it works on sample data. Planned means it isn’t built.</p>
        </div>
        <ul className="lg:col-span-8">
          {INTEGRATIONS.map(([t, d, s]) => (
            <li key={t} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[1fr_9rem] sm:gap-6">
              <div>
                <p className="font-[600]">{t}</p>
                <p className="mt-0.5 text-[0.9375rem] text-muted">{d}</p>
              </div>
              <StatusMark status={s} className="sm:justify-end" />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule">
        <div className="wrap flex flex-col gap-6 py-20 md:flex-row md:items-end md:justify-between md:py-24">
          <h2 className="t-title max-w-[18ch]">Try it on a sample company first.</h2>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <ButtonLink href="/demo">Try the demo</ButtonLink>
            <TextLink href="/pricing">Proposed pricing</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
