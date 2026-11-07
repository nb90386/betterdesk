import type { Metadata } from "next";
import { ButtonLink, SampleNote, StateGlyph, StatusMark, TextLink } from "@/components/site/primitives";
import { scoutExample } from "@/lib/marketing/samples";
import { RUN_TASKS } from "@/lib/workspace/actions";
import { RULE_VERSION } from "@/lib/scout/qualify";

export const metadata: Metadata = {
  title: "Scout: businesses worth contacting, with the evidence",
  description: "Scout checks the businesses on your list against your service area and the buildings you want, shows why, and drafts introductions you approve. It never sends.",
  alternates: { canonical: "/scout" },
};

const NEVER = [
  ["Send anything", "Sending isn’t one of Scout’s tools. Approval is a person’s job, and delivery needs a connected mailbox that doesn’t exist yet."],
  ["Guess a building’s size", "If no source states the square footage, the criterion says “unknown”, and the account is marked for research."],
  ["Write to personal addresses", "A gmail or similar address fails the contact check. No draft is written."],
  ["Contact someone who opted out", "Suppressed addresses and domains are blocked before a draft exists, and again at approval."],
  ["Follow instructions hidden in data", "Text in a list that reads like commands is withheld from drafting and flagged for a person."],
  ["Move a deal backwards", "Scout only drafts for new or qualified accounts. Anything further along is left alone."],
] as const;

export default function Scout() {
  const s = scoutExample();
  const tierLabel = { strong: "Good fit", possible: "Worth checking", weak: "Weak fit", excluded: "Not a fit" } as const;
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <StatusMark status="DEMO" />
        <h1 className="t-display mt-5 max-w-[18ch]">Know which businesses are worth a walkthrough, and why.</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <p className="t-lede max-w-[58ch] lg:col-span-8">
            Give Scout a list you already have: a spreadsheet, an export, a building directory you’re allowed to use. It removes duplicates, checks each business against your service area and the buildings you want, and drafts a short introduction for the good fits. You approve every one.
          </p>
          <div className="flex flex-wrap gap-x-7 gap-y-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href="/demo">Run Scout on a sample list</ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="wrap py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 className="t-title max-w-[14ch] lg:col-span-4">Five checks, each with a reason.</h2>
            <p className="text-ink-2 lg:col-span-8">
              Rules version <code className="t-code">{RULE_VERSION}</code>. A score is the share of the checks that could be evaluated and passed; coverage says how much was known. Low coverage means “research this”, not “bad fit”.
            </p>
          </div>
          <ul className="mt-10 border-t border-rule-strong">
            {s.q.criteria.map((c) => (
              <li key={c.id} className="grid gap-1 border-b border-rule py-4 md:grid-cols-12 md:gap-6">
                <span className="font-[600] md:col-span-4">{c.label}</span>
                <span className="text-[0.875rem] tabular-nums text-muted md:col-span-1">{c.weight}%</span>
                <span className="text-ink-2 md:col-span-7">Example, {s.account.name}: {c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="t-title max-w-[16ch] lg:col-span-5">The sample list, checked.</h2>
          <p className="text-ink-2 lg:col-span-7">
            {s.rows} rows in. {s.summary.imported.length} imported, {s.summary.duplicates.map((d) => `${d.name} matched ${d.matched}`).join("; ")}, and {s.summary.withheld} note withheld. Every result below comes from the same code the workspace runs.
          </p>
        </div>
        <div className="mt-10 overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                <th scope="col" className="py-3 pr-6 font-[560]">Business</th>
                <th scope="col" className="py-3 pr-6 font-[560]">Result</th>
                <th scope="col" className="py-3 pr-6 text-right font-[560]">Score</th>
                <th scope="col" className="py-3 pr-6 text-right font-[560]">Known</th>
                <th scope="col" className="py-3 font-[560]">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {s.all.map((a) => (
                <tr key={a.name} className="border-b border-rule align-top">
                  <th scope="row" className="py-3.5 pr-6 font-[600]">{a.name}</th>
                  <td className="whitespace-nowrap py-3.5 pr-6">{tierLabel[a.q.tier]}</td>
                  <td className="py-3.5 pr-6 text-right tabular-nums">{a.q.score}</td>
                  <td className="py-3.5 pr-6 text-right tabular-nums">{a.q.coverage}%</td>
                  <td className="py-3.5 text-[0.9375rem] text-ink-2">{a.withheld ? "A note read like instructions; withheld and flagged for a person. " : ""}{a.q.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SampleNote className="mt-4">Fictional businesses on reserved .example domains.</SampleNote>
      </section>

      <section className="on-graphite bg-graphite-2">
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[12ch]">What Scout never does.</h2>
            <p className="mt-5 text-ink-2">These are rules in the code, covered by tests, not promises in a brochure.</p>
          </div>
          <ul className="lg:col-span-8">
            {NEVER.map(([t, d]) => (
              <li key={t} className="grid grid-cols-[1.25rem_1fr] gap-x-3 border-t border-rule py-4">
                <StateGlyph kind="mark-x" className="mt-1.5" />
                <div>
                  <p className="font-[600]">{t}</p>
                  <p className="mt-0.5 text-ink-2">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="t-title max-w-[14ch]">Every run, visible.</h2>
          <p className="mt-5 max-w-[40ch] text-ink-2">A run moves through four tasks you can watch, cancel or retry. If a data source fails, the run says so and stops instead of making things up.</p>
          <div className="mt-6"><TextLink href="/app/scout">Open Scout in the sample workspace</TextLink></div>
        </div>
        <ol className="lg:col-span-7">
          {RUN_TASKS.map((t, i) => (
            <li key={t.id} className="grid grid-cols-[2rem_1fr] border-b border-rule py-4">
              <span className="tabular-nums text-muted">{i + 1}</span>
              <span>{t.label}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
