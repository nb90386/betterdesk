import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice (draft)",
  description: "What this site collects, why, and what it doesn't do. A draft pending legal review, written to match how the site actually works.",
  alternates: { canonical: "/privacy" },
};

const ITEMS = [
  ["Free check requests", "Your name, email, business, website, service area, optional phone and note. Used only to reply to your request. Sent to our request inbox; this website does not keep a copy."],
  ["Website checks", "The website address and details you enter, used once to run the check. The pages we read are analyzed in memory and not stored."],
  ["The demo and sample workspace", "Fictional data that lives only in your browser’s local storage. Clear it any time with “Reset the sample”."],
  ["Analytics, advertising and cookies", "None. This site sets no cookies of its own and runs no tracking scripts."],
  ["Hosting", "The site runs on Vercel, which processes standard request data (such as IP address) to serve pages and protect against abuse."],
  ["Your choices", `Ask us to delete anything you sent by writing to ${CONTACT_EMAIL}.`],
] as const;

export default function Privacy() {
  return (
    <section className="wrap pb-24 pt-32 md:pt-40">
      <p className="text-[0.875rem] font-[560] text-lamp-ink">Draft, not yet reviewed by a lawyer. It describes how this site works today; a reviewed policy will replace it before BetterDesk handles customer data.</p>
      <h1 className="t-display mt-4 max-w-[16ch]">How this site handles your information.</h1>
      <dl className="mt-12 max-w-[72ch] border-t border-rule-strong">
        {ITEMS.map(([k, v]) => (
          <div key={k} className="border-b border-rule py-5">
            <dt className="text-[1.0625rem] font-[600]">{k}</dt>
            <dd className="mt-1.5 text-ink-2">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
