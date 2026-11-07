"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWorkspace } from "@/lib/demo/store";
import { parseProspectCsv, type ParseResult } from "@/lib/scout/csv";
import { SAMPLE_PROSPECTS_CSV } from "@/lib/demo/seed";
import * as A from "@/lib/workspace/actions";
import { validateDraft } from "@/lib/scout/draft";
import { isActive } from "@/lib/domain/run";
import type { Draft, ScoutRun } from "@/lib/domain/types";
import { accountOfOpp, qualOf } from "@/lib/workspace/selectors";
import { Btn, Empty, Notice, PageHeader, Panel, TierMark, fmtTime } from "@/components/app/ui";
import { Icon } from "@/components/app/icons";

const DEFAULT_GOAL = "Find suitable businesses in our service area and prepare introductions for review.";

export default function ScoutPage() {
  const { ws, act } = useWorkspace();
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [list, setList] = useState<{ name: string; parsed: ParseResult } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const activeRun = ws.runs.find((r) => isActive(r.state) || r.state === "waiting-approval" || r.state === "blocked");
  const pending = ws.drafts.filter((d) => d.approval === "pending");
  const reviewed = ws.drafts.filter((d) => d.approval !== "pending").slice(-6).reverse();

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 2_000_000) return setError("That file is larger than 2 MB.");
    setError(null);
    setList({ name: f.name, parsed: parseProspectCsv(await f.text()) });
  };

  const start = () => {
    if (!list) return;
    let runId = "";
    const r = act((w, at, me) => {
      const { ws: imported, summary } = A.importProspects(w, list.parsed.rows, list.name, at, me);
      // The new list, plus earlier prospects Scout hasn't evaluated and that aren't already in a deal.
      const ids = [...summary.imported, ...w.accounts.filter((a) => a.status === "prospect" && !w.qualifications.some((q) => q.accountId === a.id) && !w.opportunities.some((o) => o.accountId === a.id)).map((a) => a.id)];
      const created = A.createRun(imported, goal, ids, at, me);
      runId = created.runId;
      return created.ws;
    }, "Scout run started.");
    if (!r.ok) setError(r.error);
    else setList(null);
    return runId;
  };

  const tryProvider = () => {
    act((w, at, me) => {
      const ids = w.accounts.filter((a) => a.status === "prospect").map((a) => a.id).slice(0, 1);
      const { ws: c, runId } = A.createRun(w, "Find new businesses from a data provider", ids.length ? ids : [w.accounts[0].id], at, me);
      return A.failRun(c, runId, at, "No business-data provider is connected in this workspace. Import a CSV instead, or connect a licensed provider in Settings (not available yet).");
    }, "Provider unavailable. Run blocked.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Scout"
        lede="Scout qualifies businesses against your criteria, shows its evidence, and drafts introductions. It cannot send anything: every draft waits for a person, and sending is off in this workspace."
      />

      {/* New run */}
      <Panel title="Give Scout a goal">
        <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <label htmlFor="goal" className="text-[0.875rem] font-medium">Goal</label>
            <textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} maxLength={300} className="mt-1.5 block w-full rounded-[var(--radius-md)] border border-rule-strong bg-surface px-3 py-2.5 text-[0.9375rem] focus:border-ink" />
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.8125rem]">
              <dt className="text-muted">Service area</dt><dd>{ws.org.serviceArea.label}</dd>
              <dt className="text-muted">Targets</dt><dd>{ws.org.idealCustomer.categories.join(", ")}</dd>
              <dt className="text-muted">Minimum size</dt><dd>{ws.org.idealCustomer.minSqft.toLocaleString()} sq ft</dd>
              <dt className="text-muted">Scout may</dt><dd>Read records, de-duplicate, qualify, draft</dd>
              <dt className="text-muted">Scout may not</dt><dd>Send, call, text, or change your settings</dd>
            </dl>
          </div>
          <div>
            <p className="text-[0.875rem] font-medium">Where the businesses come from</p>
            <div className="mt-1.5 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Btn onClick={() => setList({ name: "sample-prospects.csv", parsed: parseProspectCsv(SAMPLE_PROSPECTS_CSV) })}>Use the sample list (11 rows)</Btn>
                <Btn onClick={() => file.current?.click()}><Icon name="upload" className="h-4 w-4" /> Upload a CSV</Btn>
                <input ref={file} type="file" accept=".csv,text/csv" className="sr-only" aria-label="Upload a prospect CSV" onChange={(e) => onFile(e.target.files?.[0])} />
              </div>
              <p className="text-[0.8125rem] text-muted">Columns: company, zip (required), website, street, city, category, sqft, contact name, role, email, notes. <a href="/demo/sample-prospects.csv" className="underline underline-offset-2">Download the sample</a>.</p>
              <div className="flex items-center gap-2 border-t border-rule pt-2 text-[0.8125rem]">
                <span className="text-muted">Licensed business-data provider:</span>
                <span className="font-medium text-attention">Not connected</span>
                <button onClick={tryProvider} className="ml-auto text-ink-2 underline underline-offset-2 hover:text-ink">Try it anyway</button>
              </div>
            </div>
            {error ? <div className="mt-3"><Notice tone="danger">{error}</Notice></div> : null}
            {list ? <ListPreview list={list} onStart={start} onClear={() => setList(null)} disabled={!!activeRun && isActive(activeRun.state)} /> : null}
          </div>
        </div>
      </Panel>

      {/* Runs */}
      <section aria-labelledby="runs-h" className="space-y-3">
        <h2 id="runs-h" className="text-[1rem] font-semibold">Runs</h2>
        {ws.runs.length === 0 ? (
          <Panel><Empty title="No runs yet" body="Choose a list above and start a run. You'll see each step, what Scout found and why." /></Panel>
        ) : (
          <div className="space-y-3">{ws.runs.slice(0, 4).map((r) => <RunCard key={r.id} run={r} />)}</div>
        )}
      </section>

      {/* Drafts */}
      <section id="drafts" aria-labelledby="drafts-h" className="scroll-mt-24 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 id="drafts-h" className="text-[1rem] font-semibold">Introductions waiting for you <span className="font-mono text-[0.875rem] text-muted">{pending.length}</span></h2>
        </div>
        {pending.length === 0 ? (
          <Panel><Empty title="Nothing to approve" body="When Scout drafts an introduction, it waits here until you approve, edit or reject it." /></Panel>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>{pending.map((d) => <DraftCard key={d.id} draft={d} />)}</AnimatePresence>
          </div>
        )}
        {reviewed.length ? (
          <Panel title="Recently reviewed">
            <ul className="divide-y divide-rule text-[0.875rem]">
              {reviewed.map((d) => {
                const acc = accountOfOpp(ws, d.opportunityId);
                return (
                  <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                    <Link href={`/app/customers/${acc?.id}`} className="font-medium hover:underline">{acc?.name}</Link>
                    <span className="text-muted">{d.approval === "approved" ? `Approved by ${d.approvedBy}` : "Rejected or withdrawn"}</span>
                    <span className="text-muted">{d.delivery === "simulated" ? "Delivered in simulation" : d.approval === "approved" ? "Not sent" : ""}</span>
                    {d.approval === "approved" && d.delivery === "not-sent" ? (
                      <Btn size="sm" className="ml-auto" onClick={() => act((w, at) => A.simulateDelivery(w, d.id, at), "Delivery simulated.")}>Simulate delivery (demo)</Btn>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Panel>
        ) : null}
      </section>
    </div>
  );
}

function ListPreview({ list, onStart, onClear, disabled }: { list: { name: string; parsed: ParseResult }; onStart: () => void; onClear: () => void; disabled: boolean }) {
  const { rows, issues } = list.parsed;
  return (
    <div className="mt-4 rounded-[var(--radius-md)] border border-rule bg-mineral p-3.5">
      <p className="text-[0.875rem]"><span className="font-medium">{list.name}</span>: {rows.length} rows ready{issues.length ? `, ${issues.length} skipped` : ""}.</p>
      {issues.length ? (
        <ul className="mt-2 space-y-0.5 text-[0.8125rem] text-attention">
          {issues.slice(0, 4).map((i, n) => <li key={n}>Line {i.line}: {i.message}</li>)}
        </ul>
      ) : null}
      <p className="mt-2 text-[0.8125rem] text-muted">Duplicates of businesses you already have are matched and skipped during import.</p>
      <div className="mt-3 flex gap-2">
        <Btn tone="primary" onClick={onStart} disabled={rows.length === 0 || disabled}>Import and start Scout</Btn>
        <Btn tone="quiet" onClick={onClear}>Cancel</Btn>
      </div>
    </div>
  );
}

function RunCard({ run }: { run: ScoutRun }) {
  const { ws, act } = useWorkspace();
  const [open, setOpen] = useState(run === ws.runs[0]);
  const live = isActive(run.state);
  const label: Record<ScoutRun["state"], string> = { created: "Created", queued: "Queued", running: "Running", "waiting-approval": "Waiting for your approval", paused: "Paused", blocked: "Blocked", failed: "Failed", completed: "Completed", canceled: "Canceled" };
  const found = run.accountIds.map((id) => ws.accounts.find((a) => a.id === id)).filter(Boolean);
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <span className={`inline-flex items-center gap-2 text-[0.8125rem] font-medium ${run.state === "blocked" || run.state === "failed" ? "text-danger" : run.state === "waiting-approval" ? "text-attention" : "text-ink"}`}>
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-signal" : run.state === "completed" ? "bg-ink" : run.state === "blocked" || run.state === "failed" ? "bg-danger" : run.state === "waiting-approval" ? "bg-attention" : "bg-rule-strong"}`} />
          {label[run.state]}
        </span>
        <span className="min-w-0 flex-1 truncate text-[0.9375rem]">{run.goal}</span>
        <span className="font-mono text-[0.75rem] text-muted">{run.id.slice(-8)}</span>
        {live ? <Btn size="sm" tone="danger" onClick={() => act((w, at, me) => A.cancelRun(w, run.id, at, me), "Run canceled.")}>Cancel run</Btn> : null}
        {run.state === "blocked" ? <Btn size="sm" onClick={() => act((w, at, me) => A.cancelRun(w, run.id, at, me), "Run canceled.")}>Dismiss</Btn> : null}
        <Btn size="sm" tone="quiet" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? "Hide details" : "Details"}</Btn>
      </div>
      {run.errors.length ? <div className="px-4 pb-3"><Notice tone="danger">{run.errors.at(-1)!.message}</Notice></div> : null}
      {open ? (
        <div className="grid gap-6 border-t border-rule p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <h3 className="text-[0.8125rem] font-medium text-muted">Steps</h3>
            <ol className="mt-2 space-y-2.5">
              {run.tasks.map((t) => (
                <li key={t.id} className="flex gap-2.5 text-[0.875rem]">
                  <span aria-hidden="true" className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${t.status === "done" ? "border-signal bg-signal text-petrol" : "border-rule-strong"}`}>
                    {t.status === "done" ? <Icon name="check" className="h-3 w-3" /> : null}
                  </span>
                  <span>
                    <span className={t.status === "pending" ? "text-muted" : ""}>{t.label}</span>
                    {t.detail ? <span className="block text-[0.8125rem] text-muted">{t.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
            <h3 className="mt-5 text-[0.8125rem] font-medium text-muted">State history</h3>
            <ol className="mt-1.5 space-y-0.5 font-mono text-[0.75rem] text-muted">
              {run.history.map((h, i) => <li key={i}>{fmtTime(h.at)} · {h.state}{h.note ? ` · ${h.note}` : ""}</li>)}
            </ol>
          </div>
          <div>
            <h3 className="text-[0.8125rem] font-medium text-muted">Businesses in this run ({found.length})</h3>
            <ul className="mt-2 divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
              {found.map((a) => (
                <li key={a!.id}>
                  <Link href={`/app/opportunities?id=${a!.id}`} className="flex items-center justify-between gap-3 px-3 py-2 text-[0.875rem] hover:bg-mineral">
                    <span className="truncate">{a!.name}</span>
                    <TierMark q={qualOf(ws, a!.id)} />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.75rem] text-muted">Steps are paced so you can watch and cancel them. Qualification is rule-based and versioned; no web research or AI model runs in this demo.</p>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function DraftCard({ draft }: { draft: Draft }) {
  const { ws, act } = useWorkspace();
  const acc = accountOfOpp(ws, draft.opportunityId)!;
  const contact = ws.contacts.find((c) => c.id === draft.contactId)!;
  const q = qualOf(ws, acc.id);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [err, setErr] = useState<string | null>(null);
  const dirty = subject !== draft.subject || body !== draft.body;
  const problems = useMemo(() => validateDraft({ subject, body }, ws.org), [subject, body, ws.org]);
  const evidence = ws.evidence.filter((e) => draft.basedOnEvidenceIds.includes(e.id));
  const withheld = ws.evidence.some((e) => e.accountId === acc.id && e.flagged);

  const approve = () => {
    setErr(null);
    const r = act((w, at, me) => (dirty ? A.approveDraft(A.editDraft(w, draft.id, { subject, body }, at, me), draft.id, at, me) : A.approveDraft(w, draft.id, at, me)), `Introduction to ${acc.name} approved. Not sent.`);
    if (!r.ok) setErr(r.error);
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }} className="rounded-[var(--radius-lg)] border border-rule bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3">
        <p className="text-[0.9375rem]"><span className="font-medium">{contact.name}</span> <span className="text-muted">· {contact.role} · {acc.name}</span></p>
        <TierMark q={q} />
      </div>
      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <label className="text-[0.8125rem] text-muted" htmlFor={`s-${draft.id}`}>Subject</label>
          <input id={`s-${draft.id}`} value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 text-[0.9375rem] focus:border-ink" />
          <label className="mt-3 block text-[0.8125rem] text-muted" htmlFor={`b-${draft.id}`}>Message to {contact.email}</label>
          <textarea id={`b-${draft.id}`} value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 font-sans text-[0.875rem] leading-relaxed focus:border-ink" />
          {problems.length ? (
            <ul className="mt-2 space-y-0.5 text-[0.8125rem] text-danger" aria-live="polite">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-signal-ink">Passes sender, address, opt-out and honesty checks.</p>
          )}
          {err ? <div className="mt-2"><Notice tone="danger">{err}</Notice></div> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn tone="primary" onClick={approve} disabled={problems.length > 0}>{dirty ? "Save and approve" : "Approve"}</Btn>
            <Btn onClick={() => act((w, at, me) => A.rejectDraft(w, draft.id, at, me), `Introduction to ${acc.name} rejected.`)}>Reject</Btn>
            <Btn tone="quiet" onClick={() => act((w, at, me) => A.suppress(w, contact.email!, "do-not-contact", at, me), `${contact.email} added to do-not-contact.`)}>Do not contact</Btn>
          </div>
          <p className="mt-2 text-[0.75rem] text-muted">Approving records who approved what and when. It does not send: outbound email is draft-only here.</p>
        </div>
        <aside className="text-[0.8125rem]">
          <h3 className="font-medium text-muted">Why Scout drafted this</h3>
          <p className="mt-1">{q?.recommendation}</p>
          <h3 className="mt-3 font-medium text-muted">Facts used</h3>
          <ul className="mt-1 space-y-1">
            {evidence.map((e) => <li key={e.id}>{e.claim}<span className="block text-[0.75rem] text-muted">{e.source.label} · {fmtTime(e.source.retrievedAt)}</span></li>)}
          </ul>
          {withheld ? <div className="mt-3"><Notice tone="attention">A note in the import looked like instructions, so it was withheld and not used. Check the source.</Notice></div> : null}
          <Link href={`/app/opportunities?id=${acc.id}`} className="mt-3 inline-block text-signal-ink underline underline-offset-2">Full qualification</Link>
        </aside>
      </div>
    </motion.article>
  );
}
