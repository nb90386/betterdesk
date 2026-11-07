import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { JourneyScene } from "@/components/site/JourneyScene";
import { ScoutInspector } from "@/components/site/ScoutInspector";
import { CloseCta } from "@/components/CloseCta";
import { ButtonLink, Arrow } from "@/components/Button";
import { Faq } from "@/components/Faq";
import { PLANS, PRICING_STATUS } from "@/lib/site";
import { createSampleWorkspace } from "@/lib/demo/seed";
import { templateGenerator, validateDraft } from "@/lib/scout/draft";

/** The sample introduction, produced by the same generator the workspace uses. */
function sampleDraft() {
  const ws = createSampleWorkspace(Date.parse("2026-11-02T15:00:00Z"));
  const account = { ...ws.accounts[0], id: "acc_jl", name: "Juniper Lane Law", category: "Office", address: { street: "1550 Wynkoop St", city: "Denver", state: "CO", zip: "80202" }, sqft: { value: 12000, source: ws.accounts[0].source } };
  const contact = { id: "c", accountId: "acc_jl", name: "Elena Brooks", role: "Office administrator", email: "elena@juniperlanelaw.example", emailKind: "business" as const };
  const out = templateGenerator.generate({ org: ws.org, account, contact, evidence: [] });
  return { ...out, checks: validateDraft(out, ws.org) };
}

const SCATTER = [
  { where: "Spreadsheet", what: "Row 214 · Juniper Lane Law · 80202 · “maybe?”", r: "-1.5deg" },
  { where: "Notes app", what: "two floors, ask for Elena, call back after the 15th", r: "1deg" },
  { where: "Gmail", what: "Draft: “Hi Elena, I wanted to reach out…” (never sent)", r: "-0.5deg" },
  { where: "Calendar", what: "“Juniper walkthrough??” · no time set", r: "1.5deg" },
  { where: "Google Drive", what: "proposal_juniper_v3_FINAL(2).docx", r: "-1deg" },
  { where: "Your head", what: "Follow up on the proposal… sometime next week", r: "0.5deg" },
];

const CONTROL = [
  ["Scout can", "Read your records, de-duplicate lists, check businesses against your rules, and draft introductions."],
  ["Scout can't", "Send, call, text, approve its own drafts, or change your settings. It has no tool for any of that."],
  ["You approve", "Every introduction, with the facts it used next to it. Approval is recorded with your name and time."],
  ["Always blocked", "Anyone on your do-not-contact list, personal email addresses, and replies that ask to unsubscribe."],
];

const VALUE = [
  ["Deciding who to contact", "Scrolling a spreadsheet and guessing", "A ranked list with the reason for every fit, and what's still unknown"],
  ["Writing the first email", "Starting from a blank page each time", "A short, factual draft that names you, your address and how to opt out"],
  ["Answering an inquiry", "Finding it in an inbox two days later", "It opens a record, notes what they asked for, and suggests times"],
  ["Booking the walkthrough", "Back-and-forth over email", "Pick from your open times; the pipeline updates itself"],
  ["Following up a proposal", "Remembering, or not", "It shows up under Needs you when a proposal goes quiet"],
  ["Knowing what worked", "A feeling", "The full history of every won contract, from first row to signature"],
];

const FAQ = [
  { q: "Is BetterDesk available today?", a: "BetterDesk is in early access. The sample workspace works today in your browser. Connecting your own mailbox, calendar and team accounts is the next step; we'll tell you plainly on the demo call what's ready for you." },
  { q: "Where do the businesses come from?", a: "From lists you already have or buy from a licensed provider, imported as a CSV. BetterDesk doesn't scrape websites or collect personal email addresses." },
  { q: "Will it send emails on its own?", a: "No. Scout drafts; a person approves. In early access, sending stays off until your own mailbox is connected and the required sender details and opt-out are in place." },
  { q: "Does it replace my operations software?", a: "No. Keep the software you use for crews, inspections and invoicing. BetterDesk covers the part before that: finding, winning and keeping the contract." },
];

export default function Home() {
  const draft = sampleDraft();
  return (
    <>
      <Hero />

      {/* The problem, and the one record that replaces it */}
      <section aria-labelledby="scatter-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap">
          <h2 id="scatter-title" className="t-display max-w-[18ch]">Today, one prospect lives in six places.</h2>
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-2">The research is in your notes, the email is in Gmail, the walkthrough is a calendar guess and the proposal is somewhere in Drive. Every handoff loses a little context, and some opportunities quietly go cold.</p>
          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {SCATTER.map((s) => (
                <li key={s.where} style={{ rotate: s.r }} className="rounded-[var(--radius-sm)] border border-rule bg-surface px-4 py-3 shadow-[var(--shadow-rest)]">
                  <p className="text-[0.75rem] font-medium text-muted">{s.where}</p>
                  <p className="mt-1 text-[0.9375rem] text-ink-2">{s.what}</p>
                </li>
              ))}
            </ul>
            <div className="lg:col-span-5">
              <div className="rounded-[var(--radius-lg)] border border-rule bg-surface p-5 shadow-[var(--shadow-object)]">
                <div className="flex items-baseline justify-between border-b border-rule pb-3">
                  <p className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">Juniper Lane Law</p>
                  <p className="text-[0.8125rem] text-signal-ink">One record</p>
                </div>
                <dl className="mt-3 space-y-2 text-[0.875rem]">
                  {[["Why it fits", "In your area · office · 12,000 sq ft"], ["Contact", "Elena Brooks, office administrator"], ["Introduction", "Approved by Dana · not yet sent"], ["Walkthrough", "Tuesday, 8:00 AM"], ["Proposal", "Follow up Thursday"], ["History", "9 events, every one linked"]].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
              <p className="mt-3 text-[0.8125rem] text-muted">Fictional sample. In BetterDesk every one of these is the same record, so nothing is typed twice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature: one opportunity becomes a customer */}
      <JourneyScene />

      {/* Meet Scout */}
      <section aria-labelledby="scout-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="scout-title" className="t-display max-w-[12ch]">Scout shows its work.</h2>
            <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2">Give Scout a list and a goal. It checks every business against the rules you set: your ZIP codes, the buildings you clean, the size you want, a real business contact. For each answer it shows the source, and anything it can&rsquo;t verify stays marked unknown.</p>
            <ButtonLink href="/scout" variant="quiet" className="mt-6 gap-1.5">How Scout works <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <div className="lg:col-span-7"><ScoutInspector /></div>
        </div>
      </section>

      {/* Human in control */}
      <section aria-labelledby="control-title" className="border-t border-rule bg-mineral-2 py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="control-title" className="t-display max-w-[13ch]">Nothing goes out without you.</h2>
            <dl className="mt-8 border-t border-ink">
              {CONTROL.map(([k, v]) => (
                <div key={k} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
                  <dt className="text-[1rem] font-semibold">{k}</dt>
                  <dd className="text-[0.9375rem] leading-snug text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="lg:col-span-7">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-surface shadow-[var(--shadow-lift)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3 text-[0.8125rem]">
                <span><span className="font-medium">Elena Brooks</span> <span className="text-muted">· Juniper Lane Law</span></span>
                <span className="font-medium text-attention">Waiting for your approval</span>
              </div>
              <div className="px-5 py-4">
                <p className="text-[0.8125rem] text-muted">Subject</p>
                <p className="text-[0.9375rem] font-medium">{draft.subject}</p>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-[0.875rem] leading-relaxed text-ink-2">{draft.body}</pre>
              </div>
              <div className="border-t border-rule bg-mineral px-5 py-3 text-[0.8125rem] text-signal-ink">{draft.checks.length === 0 ? "Passes the sender, postal address, opt-out and honesty checks." : draft.checks.join(" ")}</div>
            </div>
            <figcaption className="mt-3 text-[0.8125rem] text-muted">A real draft from BetterDesk&rsquo;s template, for a fictional business. <Link href="/app/scout" className="underline underline-offset-2">Approve or edit one in the sample workspace</Link>.</figcaption>
          </figure>
        </div>
      </section>

      {/* Value without invented numbers */}
      <section aria-labelledby="value-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap">
          <h2 id="value-title" className="t-display max-w-[18ch]">Less admin between you and the walkthrough.</h2>
          <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-2">We don&rsquo;t publish savings figures, because we haven&rsquo;t measured them with customers yet. Here&rsquo;s what changes in the work itself.</p>
          <div className="mt-12 overflow-x-auto" role="region" aria-label="What changes, task by task" tabIndex={0}>
            <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
              <thead><tr className="border-b border-ink"><th scope="col" className="w-[24%] py-3 pr-4 font-medium text-muted">Task</th><th scope="col" className="w-[34%] py-3 pr-4 font-medium text-muted">Today</th><th scope="col" className="py-3 font-semibold">With BetterDesk</th></tr></thead>
              <tbody>{VALUE.map(([t, a, b]) => <tr key={t} className="border-b border-rule align-top"><th scope="row" className="py-4 pr-4 font-medium">{t}</th><td className="py-4 pr-4 text-muted">{a}</td><td className="py-4">{b}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing and status */}
      <section aria-labelledby="price-title" className="border-t border-rule bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="price-title" className="t-display max-w-[10ch]">Priced per company.</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2">Clear monthly limits on research, drafts and inquiries. When you reach one, Scout pauses and tells you. No surprise bills.</p>
            <p className="mt-4 text-[0.875rem] text-muted">{PRICING_STATUS}</p>
            <ButtonLink href="/pricing" variant="quiet" className="mt-5 gap-1.5">Compare plans <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <ol className="grid border-t border-ink sm:grid-cols-3 lg:col-span-8">
            {PLANS.map((p, i) => (
              <li key={p.id} className={`py-6 sm:pr-6 ${i ? "border-t border-rule sm:border-l sm:border-t-0 sm:pl-6" : ""}`}>
                <p className="text-[1.0625rem] font-semibold">{p.name}{p.featured ? <span className="ml-2 text-[0.8125rem] font-normal text-muted">most companies</span> : null}</p>
                <p className="mt-3 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">${p.price}<span className="ml-1 font-sans text-[0.9375rem] font-normal tracking-normal text-muted">/ month</span></p>
                <p className="mt-3 text-[0.875rem] text-ink-2">{p.seats} {p.seats > 1 ? "people" : "person"} · {p.prospects.toLocaleString()} businesses researched · {p.conversations} inquiries a month</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-mineral pb-24 md:pb-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Straight answers.</h2>
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </section>

      <CloseCta />
    </>
  );
}
