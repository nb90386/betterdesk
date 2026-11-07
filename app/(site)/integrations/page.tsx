import type { Metadata } from "next";
import { ButtonLink, StatusMark, TextLink, type Status } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Integrations",
  description: "What BetterDesk connects to today, what works without connecting anything, and which connections are planned. No logos we haven't earned.",
  alternates: { canonical: "/integrations" },
};

const ROWS: [string, string, string, Status][] = [
  ["Your public website", "Presence", "Reads robots.txt, the sitemap and up to 6 public pages of a site you own. Nothing to install.", "BETA"],
  ["Spreadsheets and CSV exports", "Scout", "Upload a list you're allowed to use. Columns for company, ZIP, website, category, size and contact. Works in the sample workspace today.", "DEMO"],
  ["A webhook (Slack, Zapier, Make or your CRM)", "Requests", "Free check requests are posted as plain text to one HTTPS address you choose. Built and tested; needs your address set on the deployment.", "BLOCKED"],
  ["Gmail or Microsoft 365", "Desk", "Read replies next to the account, send approved introductions from your own mailbox. Needs your authorization; not built yet.", "PLANNED"],
  ["Google Calendar or Outlook", "Desk", "Offer real walkthrough times and send real invites. Not built yet; the sample uses a sample calendar.", "PLANNED"],
  ["Google Search Console", "Presence", "First-party data on how often your pages appear in Google, including AI features. Read-only, with your permission.", "PLANNED"],
  ["Bing Webmaster Tools", "Presence", "Citations of your pages in Copilot and Bing's AI summaries, as Microsoft reports them.", "PLANNED"],
  ["Google Business Profile", "Presence", "Check that your profile, site and phone number say the same thing.", "PLANNED"],
];

export default function Integrations() {
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[18ch]">Use the tools your team already works in.</h1>
        <p className="t-lede mt-7 max-w-[56ch]">BetterDesk sits next to your inbox, calendar and spreadsheets rather than replacing them. Here is exactly what connects today and what doesn’t yet.</p>
      </section>
      <section className="wrap pb-20 md:pb-28">
        <ul className="border-t border-rule-strong">
          {ROWS.map(([name, lens, what, st]) => (
            <li key={name} className="grid gap-1 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-4">
                <p className="text-[1.0625rem] font-[600]">{name}</p>
                <p className="text-[0.875rem] text-muted">{lens}</p>
              </div>
              <p className="text-ink-2 md:col-span-6">{what}</p>
              <StatusMark status={st} className="md:col-span-2 md:justify-end" />
            </li>
          ))}
        </ul>
      </section>
      <section className="border-t border-rule bg-surface">
        <div className="wrap grid gap-10 py-20 md:py-24 lg:grid-cols-12">
          <h2 className="t-title max-w-[14ch] lg:col-span-5">What if you don’t connect anything?</h2>
          <div className="grid gap-5 text-ink-2 lg:col-span-7">
            <p>The website check still works, because it only reads your public pages. Scout still works on any list you upload. Desk becomes a place to log inquiries and walkthroughs by hand.</p>
            <p>Connections make it faster, not possible. Nothing is ever sent from your mailbox without a person approving it, and we never ask for more access than a feature needs.</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-2">
              <ButtonLink href="/contact">Ask about your setup</ButtonLink>
              <TextLink href="/security">How we handle data</TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
