import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/CloseCta";
import { ScoutInspector } from "@/components/site/ScoutInspector";

export const metadata: Metadata = {
  title: "Scout",
  description: "Scout is BetterDesk's business-development assistant. It qualifies prospects against your rules with visible evidence and drafts introductions for your approval. It cannot send anything.",
  alternates: { canonical: "/scout" },
};

const LEVELS = [
  ["0 · Observe", "Reads the records you've given it and summarises what's known.", "On"],
  ["1 · Prepare", "De-duplicates lists, checks each business against your rules, drafts introductions.", "On, within the run's limits"],
  ["2 · Recommend", "Suggests next steps and walkthrough times. A person decides.", "On"],
  ["3 · Act", "Would send approved messages through your own mailbox.", "Off. Not built; needs your mailbox, sender details and a review"],
];

const STATES = ["Created", "Queued", "Running", "Waiting for approval", "Paused", "Blocked", "Failed", "Completed", "Canceled"];

const GUARDS = [
  ["Your rules, not its guesses", "Facility size, business type and contact come from a source you can see. If it isn't there, it's marked unknown."],
  ["Imported text is data", "A note in a list can't give Scout instructions. Text that reads like instructions is withheld and flagged for you."],
  ["No send tool", "Scout's permitted tools are read, de-duplicate, qualify and draft. Sending, calling and texting aren't among them."],
  ["Opt-outs win", "Suppressed addresses are skipped when drafting and blocked at approval, across every run."],
  ["Every step recorded", "Each run has an ID, a goal, a scope, a budget, its state history and the records it touched. Cancel stops it before the next step."],
];

export default function ScoutPage() {
  return (
    <>
      <PageIntro title="Scout does the research. You make the call.">
        <p>Scout is the assistant inside BetterDesk. Give it a list and a goal; it qualifies each business against your rules, shows the evidence, and drafts introductions that wait for your approval.</p>
      </PageIntro>

      <section aria-labelledby="try-h" className="bg-mineral py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="try-h" className="t-title max-w-[14ch]">Open any business and see why.</h2>
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-2">Five businesses from the fictional sample list, qualified for a Denver cleaning company that targets offices and medical buildings over 5,000 sq ft.</p>
          </div>
          <div className="lg:col-span-8"><ScoutInspector /></div>
        </div>
      </section>

      <section aria-labelledby="levels-h" className="border-t border-rule bg-mineral py-20 md:py-28">
        <div className="wrap">
          <h2 id="levels-h" className="t-title max-w-[22ch]">How much Scout is allowed to do.</h2>
          <table className="mt-8 w-full border-collapse text-left text-[0.9375rem]">
            <thead><tr className="border-b border-ink"><th scope="col" className="w-[18%] py-3 pr-4 font-medium">Level</th><th scope="col" className="py-3 pr-4 font-medium">What it means</th><th scope="col" className="w-[30%] py-3 font-medium">In BetterDesk today</th></tr></thead>
            <tbody>{LEVELS.map(([l, w, s]) => <tr key={l} className="border-b border-rule align-top"><th scope="row" className="py-4 pr-4 font-semibold">{l}</th><td className="py-4 pr-4 text-ink-2">{w}</td><td className={`py-4 ${s.startsWith("Off") ? "text-attention" : "text-signal-ink"}`}>{s}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="guards-h" data-tone="dark" className="tone-dark bg-petrol py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="guards-h" className="t-title max-w-[14ch] text-petrol-ink">Built to be checked.</h2>
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-petrol-muted">Every run moves through explicit states, so you always know where it is and nothing can skip ahead.</p>
            <ol className="mt-6 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[0.8125rem] text-petrol-muted" aria-label="Run states">
              {STATES.map((s, i) => <li key={s} className="flex items-center gap-3">{s}{i < STATES.length - 1 ? <span aria-hidden="true" className="h-px w-3 bg-petrol-rule" /> : null}</li>)}
            </ol>
          </div>
          <dl className="divide-y divide-petrol-rule rounded-[var(--radius-lg)] border border-petrol-rule bg-petrol-2 px-5 lg:col-span-7">
            {GUARDS.map(([k, v]) => <div key={k} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-5"><dt className="font-medium text-petrol-ink">{k}</dt><dd className="text-[0.9375rem] text-petrol-muted">{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section aria-labelledby="not-h" className="bg-mineral py-20 md:py-24">
        <div className="wrap max-w-4xl">
          <h2 id="not-h" className="t-title">What Scout doesn&rsquo;t do yet.</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">In early access Scout uses rules, not an AI model, and it doesn&rsquo;t browse the web. It works on lists you import. Model-written research and drafts, and a licensed business-data source, are next; when they arrive, every claim will still carry its source, and drafts will still need your approval.</p>
        </div>
      </section>
      <CloseCta title="Run Scout on the sample list." lede="Eleven fictional Denver businesses, including a duplicate, an opted-out contact, a personal email and a note that tries to give instructions. See how Scout handles each one." />
    </>
  );
}
