import type { Metadata } from "next";
import { ButtonLink, SampleNote, TextLink } from "@/components/site/primitives";
import { createSampleWorkspace } from "@/lib/demo/seed";
import { REPORTED_CHANNEL_LABEL } from "@/lib/domain/types";
import { timeline } from "@/lib/workspace/selectors";
import { LENSES } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Presence, Scout and Desk connect",
  description: "One customer journey and one record: from finding a business or being found, to a booked walkthrough and a signed cleaning contract.",
  alternates: { canonical: "/product" },
};

const JOURNEY = [
  ["Discover", "Scout", "Checks the businesses on your list against what you want, with the evidence and its date."],
  ["Be discovered", "Presence", "Makes sure Google, maps and AI search can read your site and understand what you do and where."],
  ["Qualify", "Scout", "Scores fit from facts you can see. Unknowns stay unknown; nobody guesses a building’s size."],
  ["Respond", "Desk", "Inquiries and replies arrive in one inbox with the account’s history beside them."],
  ["Book", "Desk", "Walkthrough times come from your calendar; the booking lands on the record."],
  ["Win", "Desk", "Proposals and outcomes move the account through stages you can see at a glance."],
  ["Retain", "Desk", "Customers keep their record, so check-ins and renewals start with everything you know."],
] as const;

const MODEL = [
  ["Your company", "Service area, services, who you want, who approves outreach, sending rules."],
  ["Account", "One business, with where it came from: your list, your website, a referral."],
  ["Contacts and evidence", "People to talk to, and every fact Scout used, with its source and date."],
  ["Opportunity", "The stage, the owner and the next step."],
  ["Conversation and walkthrough", "Messages, intent, booked times."],
  ["Timeline", "Every change, by whom (you, Scout, a simulation), in order. Nothing is rewritten."],
  ["Tasks", "Work that came from somewhere specific, like a Presence finding, with an owner."],
] as const;

export default function Product() {
  const ws = createSampleWorkspace(Date.parse("2026-11-03T15:00:00.000Z"));
  const examples = ["acc_ridgeview", "acc_larkspur", "acc_alder"].map((id) => {
    const a = ws.accounts.find((x) => x.id === id)!;
    const o = ws.opportunities.find((x) => x.accountId === id)!;
    return { a, o, events: timeline(ws, id).length };
  });

  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[19ch]">Three ways to win work. One record for each customer.</h1>
        <p className="t-lede mt-6 max-w-[60ch]">
          Presence, Scout and Desk aren’t three subscriptions. They’re three views of the same account, so a business you found, a business that found you and a referral all end up in one place, with their source kept.
        </p>
        <ul className="mt-12 grid border-t border-rule-strong md:grid-cols-3">
          {LENSES.map((l, i) => (
            <li key={l.href} className={`py-6 md:px-6 ${i === 0 ? "md:pl-0" : "border-t border-rule md:border-l md:border-t-0"}`}>
              <a href={l.href} className="group block">
                <span className="text-[1.375rem] font-[600] tracking-[-0.02em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{l.name}</span>
                <span className="mt-1 block text-ink-2">{l.line}</span>
                <span className="mt-3 block text-[0.8125rem] text-muted">{l.status}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-graphite bg-graphite-2">
        <div className="wrap py-20 md:py-28">
          <h2 className="t-title max-w-[20ch]">The journey, floor by floor.</h2>
          <ol className="mt-12">
            {JOURNEY.map(([step, lens, what], i) => (
              <li key={step} className="grid gap-2 border-t border-rule py-5 md:grid-cols-12 md:items-baseline md:gap-6" data-reveal="stagger">
                <span className="tabular-nums text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[1.375rem] font-[600] tracking-[-0.018em] md:col-span-3">{step}</span>
                <span className="text-[0.875rem] text-muted md:col-span-2">{lens}</span>
                <span className="text-ink-2 md:col-span-6">{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="t-title max-w-[16ch] lg:col-span-5">Different doors, same record.</h2>
          <p className="text-ink-2 lg:col-span-7">
            Three accounts from the sample workspace. Each came in a different way, and each carries that source on its record. “How they found you” is only ever what the customer told you; BetterDesk doesn’t guess.
          </p>
        </div>
        <div className="mt-10 overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                <th scope="col" className="py-3 pr-6 font-[560]">Account</th>
                <th scope="col" className="py-3 pr-6 font-[560]">Came in through</th>
                <th scope="col" className="py-3 pr-6 font-[560]">They said they found you by</th>
                <th scope="col" className="py-3 pr-6 font-[560]">Stage</th>
                <th scope="col" className="py-3 text-right font-[560]">Timeline entries</th>
              </tr>
            </thead>
            <tbody>
              {examples.map(({ a, o, events }) => (
                <tr key={a.id} className="border-b border-rule">
                  <th scope="row" className="py-4 pr-6 font-[600]">{a.name}</th>
                  <td className="py-4 pr-6 text-ink-2">{a.source.label}</td>
                  <td className="py-4 pr-6 text-ink-2">{REPORTED_CHANNEL_LABEL[a.source.reportedChannel ?? "not-asked"]}</td>
                  <td className="py-4 pr-6 text-ink-2">{o.stage.replace(/-/g, " ")}</td>
                  <td className="py-4 text-right tabular-nums text-ink-2">{events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SampleNote className="mt-4" />
      </section>

      <section className="border-t border-rule bg-surface">
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[14ch]">What a record holds.</h2>
            <p className="mt-5 text-ink-2">The model behind every screen. A real backend would keep each company’s records separate and enforce it in the database.</p>
          </div>
          <dl className="lg:col-span-8">
            {MODEL.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-[600]">{k}</dt>
                <dd className="text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap flex flex-col gap-6 py-20 md:flex-row md:items-end md:justify-between md:py-24">
        <h2 className="t-title max-w-[18ch]">See it on a sample company.</h2>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <ButtonLink href="/demo">Explore the product</ButtonLink>
          <TextLink href="/how-it-works">Setup and support</TextLink>
        </div>
      </section>
    </>
  );
}
