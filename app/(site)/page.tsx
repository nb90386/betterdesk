import type { Metadata } from "next";
import { DirectoryBoard } from "@/components/site/DirectoryBoard";
import { PresenceExplorer } from "@/components/site/PresenceExplorer";
import { DeskMoment } from "@/components/site/DeskMoment";
import { ButtonLink, SampleNote, StateGlyph, StatusMark, TextLink, type Status } from "@/components/site/primitives";
import { scoutExample } from "@/lib/marketing/samples";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const SCATTERED = [
  ["7:40", "A property manager emails asking for a quote.", "The office inbox"],
  ["8:15", "A clinic owner fills in your website form after searching Google.", "A form email nobody owns"],
  ["9:30", "You find three dental practices worth calling.", "A spreadsheet on your laptop"],
  ["11:00", "The architects want a walkthrough on Tuesday.", "Your phone calendar"],
  ["4:45", "Someone has to follow up on last week's proposal.", "Your memory"],
] as const;

const STATUS: [string, string, Status][] = [
  ["Website visibility audit", "Checks a site you own: crawler access, indexing, service and area pages, phone and name consistency, structured data", "BETA"],
  ["Sample website audit", "The same checks on a bundled fictional site, run in your browser", "LIVE"],
  ["Scout research and qualification", "Imports your list, removes duplicates, scores fit with evidence, drafts introductions you approve", "DEMO"],
  ["Inbox, booking and pipeline", "One record per account, suggested replies, walkthrough booking, stages and timeline", "DEMO"],
  ["Review request form", "Saves your request for a person to follow up; delivery needs a configured inbox", "BLOCKED"],
  ["Sending email, real calendars, Search Console", "Need connected accounts and approvals before they exist", "PLANNED"],
];

export default function Home() {
  const scout = scoutExample();
  const others = scout.all
    .filter((a) => ["Bluebird Realty Partners", "Copperline Fitness", "Westwind Logistics"].includes(a.name))
    .map((a) => ({ name: a.name, note: a.withheld ? "Fits, but a note in the list read like instructions. Scout withheld it and flagged the account for a person." : a.q.recommendation }));
  const evById = new Map(scout.evidence.map((e) => [e.id, e]));
  const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Denver" });

  return (
    <>
      {/* 1 · Promise, action, and the product at work */}
      <section className="wrap pb-20 pt-28 md:pb-28 md:pt-32">
        <h1 className="t-hero">
          <span className="block">Find better accounts.</span>
          <span className="block">Be easier to find.</span>
          <span className="block">Book more walkthroughs.</span>
        </h1>
        <p className="t-lede mt-7 max-w-[46ch] lg:mt-8">
          One workspace for commercial cleaning companies: research businesses worth contacting, see how you appear in Google and AI search, and keep every inquiry moving to a booked walkthrough.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ButtonLink href="/demo">Try the demo</ButtonLink>
          <TextLink href="/how-it-works">See how it works</TextLink>
        </div>
        <p className="mt-3 text-[0.875rem] text-muted">Two minutes on a sample company. No sign-up, nothing is sent.</p>
        <div className="mt-12 md:mt-14">
          <DirectoryBoard />
        </div>
      </section>

      {/* 2 · The problem, told as one ordinary Tuesday */}
      <section className="border-t border-rule bg-surface">
        <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[14ch]">One Tuesday, five places to look.</h2>
            <p className="mt-5 max-w-[34ch] text-ink-2">
              Most cleaning companies don’t lose contracts on price. They lose them in the gaps between the inbox, the spreadsheet and the calendar.
            </p>
          </div>
          <div className="lg:col-span-8">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Where a typical day’s opportunities end up today</caption>
              <thead>
                <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                  <th scope="col" className="w-16 pb-3 font-[560]">Time</th>
                  <th scope="col" className="pb-3 font-[560]">What happened</th>
                  <th scope="col" className="hidden pb-3 text-right font-[560] sm:table-cell">Where it lives now</th>
                </tr>
              </thead>
              <tbody>
                {SCATTERED.map(([t, what, where]) => (
                  <tr key={t} className="border-b border-rule align-baseline">
                    <td className="py-4 text-[0.875rem] tabular-nums text-muted">{t}</td>
                    <td className="py-4 pr-4 text-[1.0313rem]">
                      {what}
                      <span className="mt-1 block text-[0.875rem] text-muted sm:hidden">{where}</span>
                    </td>
                    <td className="hidden py-4 text-right text-[0.9375rem] text-muted sm:table-cell">{where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] font-[560]">
              In BetterDesk each of those is a line in one directory, and each account keeps one record from the first contact to the signed contract.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · Presence */}
      <section id="presence" className="wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="t-title max-w-[16ch]">Can customers find you?</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="t-lede max-w-[54ch]">
              More buyers now start with a search, a map or an AI assistant. None of them can recommend a company whose website they can’t read. Presence checks yours and turns each problem into a task with an owner.
            </p>
            <p className="mt-4 max-w-[60ch] text-[0.9375rem] text-muted">
              It checks what can be checked: whether search and AI crawlers are allowed in, whether your pages can be listed, and whether they say clearly what you do and where. It cannot see inside any AI answer and never promises a ranking.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <PresenceExplorer compact />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
          <SampleNote>Real audit logic, run in your browser on the fictional Clearline site.</SampleNote>
          <div className="flex flex-wrap gap-x-7">
            <TextLink href="/product/presence#check">Check your own website</TextLink>
            <TextLink href="/resources/ai-search-for-service-businesses">What AI search changes, plainly</TextLink>
          </div>
        </div>
      </section>

      {/* 4 · Scout */}
      <section className="on-graphite bg-graphite-2">
        <div className="wrap py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="t-title max-w-[18ch]">Find businesses worth a walkthrough.</h2>
              <p className="mt-5 max-w-[40ch] text-ink-2">
                Give Scout the list you already have. It removes duplicates, checks each business against what you actually want, and shows why. You approve every introduction before anything could go out.
              </p>
              <p className="mt-6 text-[0.9375rem] text-muted">
                From the sample list of {scout.rows} businesses: {scout.summary.imported.length} imported, {scout.summary.duplicates.length} duplicate skipped, {scout.summary.withheld} note withheld because it read like instructions.
              </p>
              <ul className="mt-8 border-b border-rule text-[0.9063rem]">
                {others.map((o) => (
                  <li key={o.name} className="border-t border-rule py-3.5">
                    <p className="font-[600]">{o.name}</p>
                    <p className="mt-0.5 text-muted">{o.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6 lg:col-span-7">
              <div className="rounded-[var(--radius-md)] bg-graphite-3 p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[1.125rem] font-[600]">{scout.account.name}</p>
                  <p className="text-[0.8125rem] text-muted">
                    {scout.account.category} · {scout.account.address.street} · {scout.q.criteria.filter((c) => c.result === "met").length} of {scout.q.criteria.length} criteria met
                  </p>
                </div>
                <ul className="mt-4">
                  {scout.q.criteria.map((c) => (
                    <li key={c.id} className="grid grid-cols-[1rem_1fr] gap-x-3 border-t border-rule py-2.5 sm:grid-cols-[1rem_15rem_1fr]">
                      <StateGlyph kind={c.result === "met" ? "mark-tick" : c.result === "unknown" ? "mark-ring" : "mark-x"} className="mt-1" />
                      <span className="font-[560]">{c.label}</span>
                      <span className="col-start-2 text-[0.875rem] text-muted sm:col-start-3">
                        {c.detail}
                        {(() => {
                          const ev = c.evidenceIds[0] ? evById.get(c.evidenceIds[0]) : undefined;
                          if (!ev) return "";
                          return c.detail.includes(ev.source.label) ? ` Retrieved ${date(ev.source.retrievedAt)}.` : ` Source: ${ev.source.label}, ${date(ev.source.retrievedAt)}.`;
                        })()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <figure className="on-stone paper p-5">
                  <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-rule pb-3 text-[0.8125rem] text-muted">
                    <span>Draft introduction · {scout.draft.subject}</span>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap font-[600] text-lamp-ink">
                      <span className="mark-lamp" aria-hidden="true" /> Waiting for you
                    </span>
                  </figcaption>
                  <p className="mt-3 max-w-[66ch] whitespace-pre-line text-[0.875rem] leading-relaxed">{scout.draft.body}</p>
                </figure>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-rule pt-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[70ch] text-[0.9375rem] text-ink-2">
              Scout never sends, never estimates a building’s size, never writes to personal addresses and skips anyone who asked not to be contacted.
            </p>
            <TextLink href="/product/scout" className="text-ink">How Scout decides</TextLink>
          </div>
        </div>
      </section>

      {/* 5 · Desk */}
      <section className="wrap py-20 md:py-28">
        <div className="mb-12 grid gap-6 lg:grid-cols-12">
          <h2 className="t-title max-w-[16ch] lg:col-span-5">An inquiry becomes a walkthrough.</h2>
          <p className="t-lede lg:col-span-7">
            When someone asks for a quote, the reply, the booking and the next step happen in the same record, along with how they say they found you. Try it.
          </p>
        </div>
        <DeskMoment />
        <SampleNote className="mt-6">Fictional inquiry. Replies and bookings here are simulated in your browser; nothing is sent.</SampleNote>
      </section>

      {/* 6 · Why not the tools you already have */}
      <section className="border-t border-rule bg-surface">
        <div className="wrap py-20 md:py-28">
          <h2 className="t-title max-w-[22ch]">Why not ChatGPT, a spreadsheet and a calendar?</h2>
          <p className="t-lede mt-5 max-w-[60ch]">You can get a long way with them, and many owners do. The trouble starts when the same customer lives in all three.</p>
          <div className="mt-12 overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison (scrolls sideways on small screens)">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                  <th scope="col" className="w-[22%] py-3 pr-6 font-[560]">Tool</th>
                  <th scope="col" className="py-3 pr-6 font-[560]">What it does well</th>
                  <th scope="col" className="py-3 font-[560]">What it can’t do on its own</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ChatGPT", "Writes a decent introduction or reply when you paste in the details.", "Remember who you already contacted, who opted out, or which facts came from where. Every chat starts from zero."],
                  ["A spreadsheet", "Holds a list. Sorts and filters it.", "Check each business against your criteria with sources, stop duplicates, or connect a reply to the row it came from."],
                  ["Your calendar", "Shows when you’re free.", "Know which inquiry a walkthrough came from, or what happens after it."],
                  ["BetterDesk", "Keeps one record per account: where it came from, why it fits, what was said, what’s booked, what’s next.", "Send anything without your approval, or promise results it can’t see."],
                ].map(([t, good, missing]) => (
                  <tr key={t} className="border-b border-rule align-top">
                    <th scope="row" className={`py-5 pr-6 text-[1.0625rem] font-[600] ${t === "BetterDesk" ? "text-ink" : ""}`}>{t}</th>
                    <td className="py-5 pr-6 text-ink-2">{good}</td>
                    <td className="py-5 text-ink-2">{missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="mt-16 grid gap-x-12 md:grid-cols-2">
            {[
              ["Can I import my own list?", "Yes. A spreadsheet or CSV with company, ZIP, and whatever else you have. Duplicates are caught, and anything that looks like instructions hidden in the data is withheld."],
              ["Does Scout send messages without asking?", "No. Scout can’t send at all. It drafts; a person approves; sending needs your own mailbox connected, which isn’t built yet."],
              ["Can you guarantee ChatGPT mentions my business?", "No one honestly can. Presence checks what you control: whether AI and search crawlers can read your site and whether it says clearly what you do and where."],
              ["Does it work with my inbox and calendar?", "Not yet. Gmail, Microsoft 365 and calendar connections are planned. Today the sample shows how it will work."],
              ["What if I don’t connect anything?", "The website check and list checking still work. Connections make things faster; they’re not required to start."],
              ["Can I manage approvals myself?", "Yes. You choose who approves introductions, and nothing goes out without that person."],
            ].map(([q, a]) => (
              <div key={q} className="border-t border-rule py-5">
                <dt className="text-[1.0625rem] font-[600]">{q}</dt>
                <dd className="mt-1.5 text-ink-2">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 7 · Honest status */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[13ch]">What works today, plainly.</h2>
            <p className="mt-5 max-w-[34ch] text-ink-2">BetterDesk is in early access. Here is the state of each part, so nobody has to guess.</p>
          </div>
          <ul className="lg:col-span-8">
            {STATUS.map(([name, what, status]) => (
              <li key={name} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[1fr_9rem] sm:gap-6">
                <div>
                  <p className="font-[600]">{name}</p>
                  <p className="mt-0.5 text-[0.9375rem] text-muted">{what}</p>
                </div>
                <StatusMark status={status} className="sm:justify-end sm:pt-0.5" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 · Offer and close */}
      <section className="border-t border-rule">
        <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-display max-w-[16ch]">Start with a look at how you’re found today.</h2>
            <p className="t-lede mt-6 max-w-[50ch]">
              Ask for a free visibility and lead-flow check. A person reads your site and your answers and replies with what we found and whether BetterDesk fits. Early-access pricing is a proposal until we confirm it with you.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-4 lg:col-span-5 lg:items-end">
            <ButtonLink href="/contact">Get a free check</ButtonLink>
            <div className="flex flex-wrap gap-x-7">
              <TextLink href="/demo">Try the demo first</TextLink>
              <TextLink href="/pricing">Proposed pricing</TextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
