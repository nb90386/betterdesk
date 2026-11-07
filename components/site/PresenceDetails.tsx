import type { PresenceReport } from "@/lib/presence/types";
import { StateGlyph } from "./primitives";

const STATUS = { allowed: ["mark-tick", "Allowed"], blocked: ["mark-x", "Blocked"], partly: ["mark-ring", "Partly blocked"], unknown: ["mark-ring", "Unknown"] } as const;

export function BotAccessTable({ report }: { report: PresenceReport }) {
  return (
    <div>
      <h3 className="t-head">Who your robots.txt lets in</h3>
      <p className="mt-1 max-w-[64ch] text-[0.9375rem] text-muted">Read from {report.domain}/robots.txt. Blocking a crawler is a choice, not a mistake, as long as it’s the one you meant.</p>
      <div className="mt-4 relative overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
              <th scope="col" className="py-2.5 pr-4 font-[560]">Crawler</th>
              <th scope="col" className="py-2.5 pr-4 font-[560]">Used for</th>
              <th scope="col" className="py-2.5 pr-4 font-[560]">Status</th>
              <th scope="col" className="py-2.5 font-[560]">What it means</th>
            </tr>
          </thead>
          <tbody>
            {report.botAccess.map((b) => (
              <tr key={b.bot} className="border-b border-rule align-top">
                <th scope="row" className="py-3 pr-4 font-[600]">{b.bot}</th>
                <td className="py-3 pr-4 text-ink-2">{b.purpose}</td>
                <td className="whitespace-nowrap py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 font-[560]">
                    <StateGlyph kind={STATUS[b.status][0]} />
                    {STATUS[b.status][1]}
                  </span>
                  {b.matchedRule ? <code className="t-code mt-1 block text-muted">{b.matchedRule}</code> : null}
                </td>
                <td className="py-3 text-[0.875rem] text-muted">{b.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CoverageList({ report }: { report: PresenceReport }) {
  if (!report.coverage.questions.length) return null;
  return (
    <div>
      <h3 className="t-head">Do your pages answer the searches you care about?</h3>
      <p className="mt-1 max-w-[70ch] text-[0.9375rem] text-muted">{report.coverage.label}</p>
      <ul className="mt-4">
        {report.coverage.questions.map((q) => (
          <li key={q.question} className="grid gap-1 border-b border-rule py-3.5 md:grid-cols-[1fr_1.2fr] md:gap-8">
            <p className="font-[560]">“{q.question}”</p>
            <p className="text-[0.9375rem] text-ink-2">
              {q.note}
              {q.missingTerms.length ? <span className="text-muted"> Missing words: {q.missingTerms.join(", ")}.</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SchemaDraft({ report }: { report: PresenceReport }) {
  return (
    <div>
      <h3 className="t-head">A structured-data draft, built only from what we saw</h3>
      <p className="mt-1 max-w-[70ch] text-[0.9375rem] text-muted">{report.suggestedSchema.note}</p>
      <pre tabIndex={0} aria-label="Structured data draft" className="t-code mt-4 max-h-[26rem] overflow-auto rounded-[var(--radius-md)] bg-graphite-2 p-4 text-graphite-ink">{JSON.stringify(report.suggestedSchema.jsonLd, null, 2)}</pre>
      {report.suggestedSchema.omitted.length ? <p className="mt-2 text-[0.8125rem] text-muted">Left out because we couldn’t confirm them: {report.suggestedSchema.omitted.join(", ")}.</p> : null}
    </div>
  );
}

export function Limitations({ report }: { report: PresenceReport }) {
  return (
    <ul className="grid gap-x-10 md:grid-cols-2">
      {report.limitations.map((l) => (
        <li key={l} className="border-b border-rule py-3 text-[0.9375rem] text-ink-2">{l}</li>
      ))}
    </ul>
  );
}
