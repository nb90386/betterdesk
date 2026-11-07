import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/CloseCta";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security and data",
  description: "What is true about BetterDesk data today in the browser-only sample workspace, and how the production service is designed. Nothing here is a certification.",
  alternates: { canonical: "/security" },
};

const TODAY = [
  "The sample workspace runs entirely in your browser.",
  "There is no account and no sign-in.",
  "No data leaves your device. The sample data is stored in your browser's local storage, and Reset sample clears it.",
  "Nothing is sent: no email, no text, no call. Delivery, replies and the calendar are simulated and labeled.",
  "The site is served with standard security headers.",
];

type Row = [string, "DEMO" | "PLANNED" | "BLOCKED", string];

const TABLE: Row[] = [
  ["Browser-only sample data", "DEMO", "Stored in local storage on your device. Nothing is uploaded."],
  ["Approval before any draft counts", "DEMO", "A person approves, and a check blocks misleading subject lines."],
  ["Suppression list checked at draft time", "DEMO", "A suppressed address is not drafted to."],
  ["Imported text treated as data", "DEMO", "Instruction-like text in an imported list is withheld, not followed."],
  ["CSV formula neutralization", "DEMO", "Cells that start like spreadsheet formulas are defused on import."],
  ["Suppression checked again at approval and send", "PLANNED", "Three checks in total. A match blocks the action and records why."],
  ["Postgres with row-level security per organization", "PLANNED", "Each company's rows are visible only to that company."],
  ["Tenant taken from the session, not the request", "PLANNED", "A request cannot name another company's ID and get its data."],
  ["Roles: owner, sales, viewer", "PLANNED", "Each role sees and changes only what it needs to."],
  ["Append-only audit events", "PLANNED", "Approvals and settings changes are recorded and not editable."],
  ["Scout per-tool permissions, no send tool", "PLANNED", "Scout can read and draft. It has no way to send."],
  ["Opt-outs honored across campaigns", "PLANNED", "One unsubscribe applies everywhere in that workspace."],
  ["CAN-SPAM elements required before sending can be enabled", "PLANNED", "Postal address, opt-out link and sender checks must pass first."],
  ["Sending from your own mailbox", "BLOCKED", "Needs Google or Microsoft connection. Not built."],
  ["Texts and calls disabled", "BLOCKED", "Stay off without documented written consent for each number."],
  ["Data-provider storage limits", "BLOCKED", "No provider is connected. When one is, we store only what its license allows."],
  ["Database and sign-in", "BLOCKED", "A schema is drafted. Nothing is deployed."],
];

const NOT_CLAIMED = [
  ["No SOC 2 report", "We have not been audited."],
  ["No penetration test", "No outside party has tested the service."],
  ["No legal review yet", "Our email, privacy and consent approach has not been reviewed by a lawyer."],
];

const STATE_STYLE: Record<Row[1], string> = {
  DEMO: "text-signal-ink",
  PLANNED: "text-ink-2",
  BLOCKED: "text-attention",
};

export default function SecurityPage() {
  return (
    <>
      <PageIntro title="Security and data, stated plainly.">
        <p>Today, BetterDesk is a sample workspace in your browser. The production service is a design, not a running system. This page keeps those two things apart.</p>
      </PageIntro>

      <section aria-labelledby="today-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="today-title" className="t-title max-w-[12ch] lg:col-span-4">What is true today.</h2>
          <ul className="divide-y divide-rule border-y border-rule lg:col-span-8">
            {TODAY.map((t) => (
              <li key={t} className="flex gap-4 py-4 text-[1.0625rem] leading-relaxed text-ink">
                <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-signal" />
                <span className="max-w-[60ch]">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="design-title" className="bg-mineral-2 py-24 md:py-32">
        <div className="wrap">
          <div className="max-w-[60ch]">
            <h2 id="design-title" className="t-title max-w-[18ch]">How the production service is designed.</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2">
              DEMO means it works in the sample workspace. PLANNED means it is part of the design and not built. BLOCKED means it waits on something we have not connected.
            </p>
          </div>
          <div className="mt-10 overflow-x-auto" role="region" aria-label="Security controls and their status, scrolls sideways on small screens" tabIndex={0}>
            <table className="w-full min-w-[40rem] border-y border-rule-strong text-left">
              <caption className="sr-only">Security and data controls, implemented or planned</caption>
              <thead>
                <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                  <th scope="col" className="py-3 pr-6 font-medium">Control</th>
                  <th scope="col" className="py-3 pr-6 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium">What it means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {TABLE.map(([k, s, d]) => (
                  <tr key={k}>
                    <th scope="row" className="max-w-[26rem] py-4 pr-6 align-top text-[1rem] font-semibold">{k}</th>
                    <td className={`t-mono py-4 pr-6 align-top font-semibold ${STATE_STYLE[s]}`}>{s}</td>
                    <td className="py-4 align-top text-[1rem] text-ink-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="claim-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="claim-title" className="t-title max-w-[12ch]">What we don&rsquo;t claim.</h2>
          </div>
          <div className="lg:col-span-8">
            <dl className="grid gap-x-10 sm:grid-cols-3">
              {NOT_CLAIMED.map(([k, v]) => (
                <div key={k} className="border-t-2 border-ink pt-4">
                  <dt className="text-[1.0625rem] font-semibold">{k}</dt>
                  <dd className="mt-1 text-[1rem] text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2">
              Questions about data, or a concern to report? Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-signal">{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>

      <CloseCta />
    </>
  );
}
