"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { createSampleWorkspace, SAMPLE_PROSPECTS_CSV } from "@/lib/demo/seed";
import { parseProspectCsv } from "@/lib/scout/csv";
import { importProspects, createRun, stepRun } from "@/lib/workspace/actions";

const FIXED = Date.parse("2026-11-02T15:00:00.000Z");
const ease = [0.16, 1, 0.3, 1] as const;

/** Runs the real import + qualification rules on the sample list, in the visitor's browser. */
function useSampleQualifications() {
  return useMemo(() => {
    const at = new Date(FIXED).toISOString();
    const me = { kind: "user" as const, id: "usr_dana", name: "Dana Ortiz" };
    let ws = createSampleWorkspace(FIXED);
    const { ws: imported, summary } = importProspects(ws, parseProspectCsv(SAMPLE_PROSPECTS_CSV).rows, "sample-prospects.csv", at, me);
    const { ws: run, runId } = createRun(imported, "Qualify", summary.imported, at, me);
    ws = run;
    for (let i = 0; i < 4; i++) ws = stepRun(ws, runId, at);
    const pick = ["Juniper Lane Law", "Summit Ridge Physical Therapy", "Copperline Fitness", "Bluebird Realty Partners", "Westwind Logistics"];
    return pick.map((name) => {
      const a = ws.accounts.find((x) => x.name === name)!;
      return { a, q: ws.qualifications.find((x) => x.accountId === a.id)!, ev: ws.evidence.filter((e) => e.accountId === a.id) };
    });
  }, []);
}

const TIER = { strong: "Strong fit", possible: "Worth checking", weak: "Weak fit", excluded: "Excluded" } as const;

export function ScoutInspector() {
  const rows = useSampleQualifications();
  const [open, setOpen] = useState(rows[0].a.id);
  return (
    <LayoutGroup>
      <ul className="divide-y divide-rule overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-surface shadow-[var(--shadow-lift)]">
        {rows.map(({ a, q, ev }) => {
          const isOpen = open === a.id;
          return (
            <motion.li layout key={a.id} transition={{ duration: 0.4, ease }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? "" : a.id)} className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-mineral sm:px-5">
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-medium">{a.name}</span>
                  <span className="block text-[0.8125rem] text-muted">{a.category} · {a.address.zip}{a.sqft ? ` · ${a.sqft.value.toLocaleString()} sq ft` : " · size unknown"}</span>
                </span>
                <span className={`shrink-0 text-[0.8125rem] font-medium ${q.tier === "strong" ? "text-signal-ink" : q.tier === "possible" ? "text-attention" : "text-muted"}`}>
                  {TIER[q.tier]}{q.tier !== "excluded" ? <span className="ml-1.5 font-mono font-normal text-muted">{q.score}</span> : null}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                    <div className="grid gap-5 border-t border-rule bg-mineral px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                      <ul className="space-y-2">
                        {q.criteria.map((c) => (
                          <li key={c.id} className="grid grid-cols-[1rem_1fr] gap-2.5 text-[0.875rem]">
                            <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 rounded-full ${c.result === "met" ? "bg-signal" : c.result === "not-met" ? "bg-rule-strong" : "border border-dashed border-muted"}`} />
                            <span><span className="font-medium">{c.label}</span> <span className="text-muted">· {c.result === "met" ? "met" : c.result === "not-met" ? "not met" : "unknown"}</span><span className="block text-[0.8125rem] text-muted">{c.detail}</span></span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-[0.875rem]">
                        <p className="font-medium">{q.recommendation}</p>
                        <p className="mt-2 text-[0.8125rem] text-muted">{q.coverage}% of criteria known · rules {q.ruleVersion}</p>
                        <p className="mt-3 text-[0.8125rem] text-muted">Evidence</p>
                        <ul className="mt-1 space-y-1 text-[0.8125rem]">
                          {ev.slice(0, 4).map((e) => <li key={e.id} className={e.flagged ? "text-attention" : ""}>{e.claim}<span className="text-muted"> · {e.source.label}</span></li>)}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
      <p className="mt-3 text-[0.8125rem] text-muted">This is the real qualification engine, running in your browser on the fictional sample list. No AI model or web search is involved.</p>
    </LayoutGroup>
  );
}
