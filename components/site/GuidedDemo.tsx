"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useWorkspace } from "@/lib/demo/store";
import { runSampleAudit } from "@/lib/presence/sample";
import { SAMPLE_PROSPECTS_CSV } from "@/lib/demo/seed";
import { parseProspectCsv } from "@/lib/scout/csv";
import { approveDraft, bookSampleSlot, createRun, createTaskFromFinding, importProspects, recordPresenceAudit, simulateDelivery, simulateReply } from "@/lib/workspace/actions";
import { attention, timeline } from "@/lib/workspace/selectors";
import { STAGE_LABEL, type Workspace } from "@/lib/domain/types";
import { isActive } from "@/lib/domain/run";
import { auditRecord } from "./PresenceExplorer";
import { StateGlyph } from "./primitives";

/**
 * Signature scene C: the whole journey on one fictional company, using the same workspace store
 * as /app (browser-only, resettable). Every step is a real workspace action; the steps that would
 * involve another person (delivery, their reply) are simulations and say so.
 */

const TARGET = "Juniper Lane Law";
const AUDIT_ID = "aud_demo";
const ENTER = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
const MOVE = { duration: 0.55, ease: [0.65, 0, 0.35, 1] as const };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });

const STEPS = [
  { title: "Check the website", lens: "Presence" },
  { title: "Let Scout check your list", lens: "Scout" },
  { title: "Approve the introduction", lens: "Scout" },
  { title: "A reply comes back", lens: "Desk" },
  { title: "Book the walkthrough", lens: "Desk" },
  { title: "See one record", lens: "Desk" },
] as const;

function derive(ws: Workspace) {
  const acc = ws.accounts.find((a) => a.name === TARGET) ?? null;
  const opp = acc ? ws.opportunities.find((o) => o.accountId === acc.id) ?? null : null;
  const draft = opp ? ws.drafts.find((d) => d.opportunityId === opp.id) ?? null : null;
  const run = ws.runs[0] ?? null;
  const messages = acc ? ws.conversations.filter((c) => c.accountId === acc.id).flatMap((c) => c.messages).sort((a, b) => a.at.localeCompare(b.at)) : [];
  const replied = messages.some((m) => m.direction === "inbound");
  const appt = opp ? ws.appointments.find((a) => a.opportunityId === opp.id) ?? null : null;
  const audited = ws.presenceAudits.some((a) => a.id === AUDIT_ID);
  const tasked = ws.tasks.some((t) => t.origin.kind === "presence-finding" && t.origin.auditId === AUDIT_ID);
  const done = [audited && tasked, !!draft, !!draft && draft.delivery === "simulated", replied, !!appt, false];
  return { acc, opp, draft, run, messages, replied, appt, done };
}

export function GuidedDemo() {
  const { ws, ready, act, reset } = useWorkspace();
  const reduce = useReducedMotion();
  const report = useMemo(() => runSampleAudit(), []);
  const d = derive(ws);
  const firstOpen = d.done.findIndex((x) => !x);
  const [picked, setPicked] = useState<number | null>(null);
  const step = picked ?? (firstOpen === -1 ? 5 : firstOpen);
  const [finding, setFinding] = useState(report.findings[0]?.id ?? "");
  const [owner, setOwner] = useState("usr_luis");
  const [error, setError] = useState("");
  const go = (i: number | null) => {
    setPicked(i);
    setError("");
  };
  const doit = (fn: Parameters<typeof act>[0], announce: string, then?: number) => {
    const r = act(fn, announce);
    if (!r.ok) setError(r.error);
    else {
      setError("");
      if (then !== undefined) setPicked(then);
      else setPicked(null);
    }
  };

  if (!ready) return <div className="paper min-h-[32rem] animate-pulse" aria-busy="true" aria-label="Loading the sample workspace" />;

  const runActive = d.run ? isActive(d.run.state) : false;
  const items = attention(ws).slice(0, 6);

  const panel = (() => {
    switch (step) {
      case 0:
        return (
          <>
            <p className="text-ink-2">Presence checked clearline.example (fictional, bundled with this page): {report.pagesChecked.length} pages, {report.findings.length} findings. Pick one and give it to someone.</p>
            <ul className="mt-5">
              {report.findings.filter((f) => f.severity === "medium" || f.severity === "high").slice(0, 4).map((f) => (
                <li key={f.id} className="border-t border-rule">
                  <label className="flex min-h-12 cursor-pointer items-start gap-3 py-3">
                    <input type="radio" name="finding" className="mt-1 h-4 w-4 accent-[#151719]" checked={finding === f.id} onChange={() => setFinding(f.id)} />
                    <span>
                      <span className="block font-[560]">{f.title}</span>
                      <span className="block text-[0.875rem] text-muted">{f.fix}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
              <label htmlFor="demo-owner" className="text-[0.9375rem]">Owner</label>
              <select id="demo-owner" value={owner} onChange={(e) => setOwner(e.target.value)} className="field min-h-11 w-auto py-0">
                {ws.org.members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <button
                type="button"
                className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2"
                onClick={() =>
                  doit((w, at, me) => {
                    const withAudit = recordPresenceAudit(w, auditRecord(report, AUDIT_ID), at, me);
                    return createTaskFromFinding(withAudit, AUDIT_ID, finding, owner, at, me).ws;
                  }, "Website task created.")
                }
              >
                Make it a task
              </button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <p className="text-ink-2">Scout imports the sample list of {parseProspectCsv(SAMPLE_PROSPECTS_CSV).rows.length} businesses, removes duplicates, checks each against Clearline’s criteria and drafts introductions for good fits. You can watch every task.</p>
            {d.run ? (
              <ol className="mt-5">
                {d.run.tasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 border-t border-rule py-3">
                    <span className="mt-1.5" aria-hidden="true">{t.status === "done" ? <span className="block h-2 w-2 rounded-full bg-ink" /> : runActive && d.run!.tasks.find((x) => x.status === "pending")?.id === t.id ? <span className="mark-lamp is-live block" /> : <span className="mark-ring block" />}</span>
                    <span>
                      <span className="block font-[560]">{t.label}</span>
                      {t.detail ? <span className="block text-[0.875rem] text-muted">{t.detail}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
            {!d.run ? (
              <button
                type="button"
                className="press mt-5 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2"
                onClick={() =>
                  doit((w, at, me) => {
                    const parsed = parseProspectCsv(SAMPLE_PROSPECTS_CSV);
                    const imp = importProspects(w, parsed.rows, "sample-prospects.csv", at, me);
                    const ids = imp.ws.accounts.filter((a) => a.status === "prospect" && a.source.kind === "csv-import").map((a) => a.id);
                    return createRun(imp.ws, "Find offices and medical practices in our area worth a walkthrough.", ids, at, me).ws;
                  }, "Scout run started.", 1)
                }
              >
                Import the list and run Scout
              </button>
            ) : runActive ? (
              <p className="mt-4 text-[0.875rem] text-muted" role="status">Scout is working through the list. Each step pauses briefly so you can follow it.</p>
            ) : (
              <button type="button" onClick={() => go(null)} className="press mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2">
                Next: review the introduction
              </button>
            )}
          </>
        );
      case 2:
        return d.draft ? (
          <>
            <p className="text-ink-2">Scout wrote this from Clearline’s details and the list’s facts only. Approve it, then simulate delivery. In this demo nothing leaves your browser.</p>
            <motion.figure layoutId={reduce ? undefined : `intro-${d.draft.id}`} transition={MOVE} className="on-stone paper mt-5 p-5">
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 text-[0.8125rem] text-muted">
                <span>To {ws.contacts.find((c) => c.id === d.draft!.contactId)?.name} · {d.draft.subject}</span>
                <span className="font-[600] text-ink">{d.draft.approval === "approved" ? "Approved by you" : "Waiting for you"}</span>
              </figcaption>
              <p className="mt-3 max-h-56 overflow-auto whitespace-pre-line text-[0.875rem] leading-relaxed">{d.draft.body}</p>
            </motion.figure>
            <div className="mt-4 flex flex-wrap gap-3">
              {d.draft.approval === "pending" ? (
                <button type="button" className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2" onClick={() => doit((w, at, me) => approveDraft(w, d.draft!.id, at, me), "Introduction approved.", 2)}>
                  Approve
                </button>
              ) : (
                <button type="button" className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2" onClick={() => doit((w, at) => simulateDelivery(w, d.draft!.id, at), "Delivery simulated. Nothing was sent.")}>
                  Simulate delivery
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-ink-2">Run Scout first; it drafts the introduction.</p>
        );
      case 3:
      case 4:
        return d.opp ? (
          <>
            <p className="text-ink-2">{step === 3 ? "The introduction is in the conversation. Play the sample reply; BetterDesk reads its intent, and you decide what happens next." : "Elena asked for times. Book one from Clearline’s open walkthrough slots (a sample calendar)."}</p>
            <ol className="mt-5 grid gap-3">
              {d.messages.map((m) => (
                <motion.li
                  key={m.id}
                  layoutId={m.direction === "outbound" && d.draft && !reduce ? `intro-${d.draft.id}` : undefined}
                  transition={MOVE}
                  initial={m.direction === "inbound" && !reduce ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0, transition: ENTER }}
                  className={`rounded-[10px] px-4 py-3 text-[0.875rem] leading-relaxed ${m.direction === "inbound" ? "mr-8 bg-stone-2" : "ml-8 max-h-32 overflow-hidden bg-graphite-2 text-graphite-ink"}`}
                >
                  <p className={`mb-1 text-[0.75rem] ${m.direction === "inbound" ? "text-muted" : "text-graphite-muted"}`}>{m.from} · {fmt(m.at)} · simulated</p>
                  <p className="whitespace-pre-line">{m.body}</p>
                </motion.li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-2">
              {!d.replied ? (
                <button type="button" className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2" onClick={() => doit((w, at) => simulateReply(w, d.opp!.id, "Thanks Dana. Tuesday morning could work for a walkthrough. What times do you have?", at), "Sample reply received.")}>
                  Play the sample reply
                </button>
              ) : !d.appt ? (
                ws.sampleSlots.slice(0, 3).map((s) => (
                  <button key={s.start} type="button" className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] border border-field px-4 font-[560] hover:border-ink" onClick={() => doit((w, at, me) => bookSampleSlot(w, d.opp!.id, s.start, at, me), "Walkthrough booked on the sample calendar.")}>
                    {fmt(s.start)}
                  </button>
                ))
              ) : (
                <button type="button" onClick={() => go(null)} className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2">
                  See the record
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-ink-2">Approve and deliver the introduction first.</p>
        );
      default:
        return d.acc ? (
          <>
            <p className="text-ink-2">Everything above is one account, one timeline. The website task from step one sits on Today next to it. Open the full workspace to keep going; it remembers what you did here.</p>
            <ol className="mt-5 border-l border-rule-strong">
              {timeline(ws, d.acc.id).map((e) => (
                <li key={e.id} className="relative pb-3.5 pl-5 last:pb-0">
                  <span className="absolute -left-[4.5px] top-[0.45rem] h-2 w-2 rounded-full border border-rule-strong bg-paper" aria-hidden="true" />
                  <p className="text-[0.75rem] text-muted">{fmt(e.at)} · {e.actor.name}</p>
                  <p className="text-[0.9063rem] leading-snug">{e.summary}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4">
              <Link href={`/app/customers/${d.acc.id}`} className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2">Open the record in the workspace</Link>
              <Link href="/app" className="link inline-flex min-h-11 items-center font-[560]">Go to Today</Link>
            </div>
          </>
        ) : (
          <p className="text-ink-2">Run the earlier steps to build the record.</p>
        );
    }
  })();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <nav aria-label="Demo steps" className="lg:col-span-3">
        <ol className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
          {STEPS.map((s, i) => {
            const isOn = i === step;
            const reachable = i === 0 || d.done[i - 1] || d.done[i];
            return (
              <li key={s.title} className="border-t border-rule">
                <button type="button" disabled={!reachable} aria-current={isOn ? "step" : undefined} onClick={() => go(i)} className="flex min-h-14 w-full items-start gap-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-45">
                  <span className="mt-0.5 w-5 text-[0.8125rem] tabular-nums text-muted">{d.done[i] ? <StateGlyph kind="mark-tick" className="mt-0.5" /> : i + 1}</span>
                  <span>
                    <span className={`block leading-snug ${isOn ? "font-[600] text-ink" : "text-ink-2"}`}>{s.title}</span>
                    <span className="block text-[0.75rem] text-muted">{s.lens}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => { reset(); go(0); }} className="link mt-4 min-h-11 text-[0.875rem] font-[560] text-muted">
          Reset the sample
        </button>
      </nav>

      <section aria-labelledby="demo-step-title" className="lg:col-span-5">
        <LayoutGroup id="demo">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: ENTER }} exit={{ opacity: 0, transition: { duration: 0.18 } }}>
              <p className="text-[0.8125rem] text-muted">Step {step + 1} of {STEPS.length} · {STEPS[step].lens}</p>
              <h2 id="demo-step-title" className="mt-1 text-[1.625rem] font-[600] leading-tight tracking-[-0.022em]">{STEPS[step].title}</h2>
              <div className="mt-4">{panel}</div>
              {error ? <p role="alert" className="mt-4 rounded-[8px] bg-danger-wash px-3.5 py-2.5 text-[0.9375rem] text-danger">{error}</p> : null}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </section>

      <aside aria-label="What the workspace shows now" className="on-graphite board self-start p-5 lg:col-span-4">
        <p className="t-label">The record</p>
        {d.acc ? (
          <div className="mt-2 border-b border-rule pb-4">
            <p className="text-[1.125rem] font-[600]">{d.acc.name}</p>
            <p className="text-[0.875rem] text-muted">Source: {d.acc.source.label}</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={d.opp?.stage ?? "none"} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: ENTER }} exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }} className="mt-2 flex items-center gap-2 text-[0.9375rem] font-[560]">
                <span className={d.opp && ["outreach-prepared", "in-conversation"].includes(d.opp.stage) ? "mark-lamp" : "mark-off"} aria-hidden="true" />
                {d.opp ? STAGE_LABEL[d.opp.stage] : "Not in the pipeline yet"}
              </motion.p>
            </AnimatePresence>
          </div>
        ) : (
          <p className="mt-2 border-b border-rule pb-4 text-[0.9375rem] text-muted">Appears when Scout imports the list.</p>
        )}
        <p className="t-label mt-4">Today</p>
        <ul className="mt-1">
          <AnimatePresence initial={false}>
            {items.map((a) => (
              <motion.li key={a.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0, transition: ENTER }} exit={{ opacity: 0, transition: { duration: 0.14 } }} className="border-b border-rule py-2.5 text-[0.875rem] leading-snug">
                <span className="text-ink">{a.title}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p className="mt-4 text-[0.75rem] text-muted">Fictional company. Runs in your browser; nothing is sent. The same data opens in the sample workspace.</p>
      </aside>
    </div>
  );
}
