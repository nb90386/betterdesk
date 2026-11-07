"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { FADE, SPRING } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { runSampleAudit } from "@/lib/presence/sample";
import type { Finding, PresenceReport } from "@/lib/presence/types";
import { createSampleWorkspace } from "@/lib/demo/seed";
import { createTaskFromFinding, recordPresenceAudit } from "@/lib/workspace/actions";
import type { Workspace } from "@/lib/domain/types";

/**
 * Signature scene B: inspect a real finding from the real analyzer (run here, in your browser, on the bundled
 * fictional site), see the evidence and the fix, and turn it into an owned task. Task creation runs the same
 * workspace action the app uses, on a throwaway sample workspace held in this component.
 */

const SEVERITY: Record<Finding["severity"], { label: string; mark: string }> = {
  high: { label: "Fix first", mark: "h-2 w-2 rounded-full bg-ink" },
  medium: { label: "Fix soon", mark: "h-2 w-2 rounded-full bg-ink" },
  low: { label: "Worth fixing", mark: "mark-ring" },
  info: { label: "Note", mark: "h-px w-2 bg-current opacity-60" },
};
const CATEGORY: Record<Finding["category"], string> = {
  access: "Crawler access",
  indexing: "Indexing",
  content: "Page content",
  local: "Local relevance",
  "structured-data": "Structured data",
  identity: "Business identity",
  contact: "Contact path",
};
const ENTER = SPRING.ui;

export function auditRecord(r: PresenceReport, id = "aud_sample") {
  return {
    id,
    domain: r.domain,
    method: r.method,
    fetchedAt: r.fetchedAt,
    pagesChecked: r.pagesChecked.length,
    findings: r.findings.map((f) => ({ id: f.id, title: f.title, severity: f.severity, category: f.category, evidenceUrl: f.evidence.url })),
  };
}

const path = (u: string) => {
  try {
    const p = new URL(u);
    return p.pathname === "/" ? p.host : p.pathname;
  } catch {
    return u;
  }
};

export function PresenceExplorer({ report: given, compact = false }: { report?: PresenceReport; compact?: boolean }) {
  const reduce = useReducedMotionSafe();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const report = useMemo(() => given ?? runSampleAudit(), [given]);
  const findings = compact ? report.findings.filter((f) => f.severity !== "info").slice(0, 6) : report.findings;
  const [selected, setSelected] = useState(findings[0]?.id ?? "");
  const [owner, setOwner] = useState("usr_luis");
  const [ws, setWs] = useState<Workspace>(() => {
    const at = report.fetchedAt;
    return recordPresenceAudit(createSampleWorkspace(Date.parse(at)), auditRecord(report), at, { kind: "user", id: "usr_dana", name: "Dana Ortiz" });
  });
  const f = findings.find((x) => x.id === selected) ?? findings[0];
  const taskFor = (id: string) => ws.tasks.find((t) => t.origin.kind === "presence-finding" && t.origin.findingId === id);

  const create = () => {
    if (!f) return;
    const r = createTaskFromFinding(ws, "aud_sample", f.id, owner, new Date().toISOString(), { kind: "user", id: "usr_dana", name: "Dana Ortiz" });
    setWs(r.ws);
  };

  const inspector = f ? (
    <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: FADE }} className="paper p-5 [overflow-wrap:anywhere] sm:p-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
        <span>{CATEGORY[f.category]}</span>
        <span>{SEVERITY[f.severity].label}</span>
        <span>Confidence: {f.confidence}</span>
      </div>
      <h3 className="mt-2 text-[1.3125rem] font-[600] leading-tight tracking-[-0.018em]">{f.title}</h3>
      <p className="mt-3 text-[0.9688rem] leading-relaxed text-ink-2">{f.whyItMatters}</p>

      <div className="mt-5 grid gap-3">
        <div>
          <p className="t-label">What we found</p>
          <div className="mt-1.5 overflow-hidden rounded-[8px] bg-graphite-2 text-graphite-ink">
            <p className="border-b border-graphite-rule px-3 py-2 text-[0.75rem] text-graphite-muted [overflow-wrap:anywhere]">{f.evidence.url}</p>
            {f.evidence.excerpt ? <pre className="t-code overflow-x-auto whitespace-pre-wrap break-words px-3 py-2.5 text-graphite-ink">{f.evidence.excerpt}</pre> : null}
          </div>
        </div>
        <div>
          <p className="t-label">What to change</p>
          <p className="mt-1.5 rounded-[8px] border border-rule bg-surface px-3 py-2.5 text-[0.9375rem] leading-relaxed">{f.fix}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-4 text-[0.875rem]">
        <div>
          <dt className="t-label">Usually done by</dt>
          <dd className="mt-0.5">{f.owner}</dd>
        </div>
        <div>
          <dt className="t-label">How to confirm</dt>
          <dd className="mt-0.5 text-ink-2">{f.nextCheck}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        {report.method === "live" ? (
          <p className="text-[0.875rem] text-muted">In a BetterDesk workspace this becomes a task with an owner and the evidence link. Workspaces aren’t open yet, so copy the fix above for now.</p>
        ) : taskFor(f.id) ? (
          <p className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-[560]">
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2.2 6.4l2.4 2.3 5.2-5.4" /></svg>
            Task created for {ws.org.members.find((m) => m.id === taskFor(f.id)!.ownerId)?.name}
          </p>
        ) : (
          <>
            <label className="sr-only" htmlFor={`owner-${f.id}`}>Owner</label>
            <select id={`owner-${f.id}`} value={owner} onChange={(e) => setOwner(e.target.value)} className="field min-h-11 w-auto py-0 pr-8 text-[0.9375rem]">
              {ws.org.members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <button type="button" onClick={create} className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[560] text-stone hover:bg-ink-2">
              Make this a task
            </button>
          </>
        )}
      </div>
    </motion.div>
  ) : null;

  const tasks = ws.tasks;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
          <p className="text-[0.9375rem] font-[600]">
            {report.domain} <span className="font-[450] text-muted">· {report.pagesChecked.length} pages checked</span>
          </p>
          <p className="text-[0.8125rem] text-muted">
            {report.summary.high + report.summary.medium} to fix soon, {report.summary.low} worth fixing, {report.summary.info} notes, {report.summary.passes} done well
          </p>
        </div>
        <LayoutGroup id="findings">
          <ul aria-label="Findings">
            {findings.map((x) => {
              const on = x.id === f?.id;
              return (
                <li key={x.id} className="border-b border-rule">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={(e) => {
                      setSelected(x.id);
                      // Below lg the inspector opens inline under the row; keep the row you tapped in view.
                      if (!desktop) {
                        const row = e.currentTarget;
                        requestAnimationFrame(() => row.scrollIntoView({ block: "nearest" }));
                      }
                    }}
                    className="group relative isolate flex w-full items-start gap-3 py-3.5 text-left"
                  >
                    {on ? <motion.span layoutId={desktop ? "finding-cursor" : undefined} transition={reduce ? { duration: 0 } : SPRING.snap} style={{ borderRadius: 8 }} className="absolute inset-y-1 -inset-x-3 -z-10 bg-paper shadow-[var(--shadow-paper)]" aria-hidden="true" /> : null}
                    <span className="mt-[0.45rem] grid w-2 place-items-center" aria-hidden="true"><span className={SEVERITY[x.severity].mark} /></span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[0.9688rem] leading-snug ${on ? "font-[600] text-ink" : "text-ink-2 group-hover:text-ink"}`}>{x.title}</span>
                      <span className="mt-0.5 block text-[0.8125rem] text-muted [overflow-wrap:anywhere]">
                        {CATEGORY[x.category]} · {path(x.evidence.url)}
                        {taskFor(x.id) ? " · task created" : ""}
                      </span>
                    </span>
                  </button>
                  {on ? <div className="pb-4 lg:hidden">{inspector}</div> : null}
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
        {compact && report.findings.length > findings.length ? (
          <p className="mt-3 text-[0.875rem] text-muted">Showing {findings.length} of {report.findings.length} findings from the sample audit.</p>
        ) : null}
      </div>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-24">
          <AnimatePresence initial={false}>{inspector}</AnimatePresence>
          <div className={report.method === "live" ? "mt-5 hidden" : "mt-5"}>
            <p className="t-label">Tasks from this audit</p>
            {tasks.length === 0 ? (
              <p className="mt-2 text-[0.875rem] text-muted">None yet. A task keeps the evidence link and an owner, and shows up on Today in the workspace.</p>
            ) : (
              <ul className="mt-2">
                <AnimatePresence initial={false}>
                  {tasks.map((t) => (
                    <motion.li
                      key={t.id}
                      initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1, transition: ENTER }}
                      className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 text-[0.9063rem]"
                    >
                      <span className="min-w-0 truncate">{t.title}</span>
                      <span className="shrink-0 text-[0.8125rem] text-muted">{ws.org.members.find((m) => m.id === t.ownerId)?.name}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </div>
      {tasks.length ? (
        <p className="text-[0.875rem] text-muted lg:hidden" role="status">
          {tasks.length} task{tasks.length > 1 ? "s" : ""} created in this preview.
        </p>
      ) : null}
    </div>
  );
}
