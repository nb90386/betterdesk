"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { validateDraft } from "@/lib/scout/draft";
import type { Organization, Qualification } from "@/lib/domain/types";
import { StateGlyph } from "./primitives";

/**
 * Scout review: a qualified list on the left, the selected prospect's evidence and editable
 * introduction on the right. One selection plate travels between rows (a single object, one
 * layoutId); the inspector keeps the prospect's name and fit in place and cross-fades its content.
 * The honesty check is the product's own validateDraft. Approving here records nothing and sends nothing.
 */
export type Prospect = {
  id: string;
  name: string;
  category: string;
  sqft: number | null;
  street: string;
  contact: string | null;
  withheld: boolean;
  evidence: { claim: string; source: string }[];
  q: Qualification;
  draft: { subject: string; body: string } | null;
};

const TIER = { strong: "Good fit", possible: "Worth checking", weak: "Weak fit", excluded: "Not a fit" } as const;
const label = (p: Prospect) => (p.q.recommendation.startsWith("Do not contact") ? "Do not contact" : TIER[p.q.tier]);

export function ScoutReview({ prospects, org }: { prospects: Prospect[]; org: Organization }) {
  const reduce = useReducedMotionSafe();
  const [sel, setSel] = useState(prospects[0]?.id ?? "");
  const [edits, setEdits] = useState<Record<string, { subject: string; body: string }>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const p = prospects.find((x) => x.id === sel) ?? prospects[0];
  if (!p) return null;
  const draft = p.draft ? edits[p.id] ?? p.draft : null;
  const problems = draft ? validateDraft(draft, org) : [];

  const inspector = (where: "inline" | "side") => (
    <div className="paper overflow-hidden">
      <div className="border-b border-rule px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-[1.25rem] font-[600] tracking-[-0.015em]">{p.name}</h3>
          <span className="text-[0.875rem] font-[600] tabular-nums">
            {label(p)} · {p.q.score}/100 · {p.q.coverage}% known
          </span>
        </div>
        <p className="mt-0.5 text-[0.875rem] text-muted">
          {[p.category, p.sqft ? `${p.sqft.toLocaleString()} sq ft` : "size not in any source", p.street].filter(Boolean).join(" · ")}
        </p>
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={p.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, transition: SPRING.ui }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="grid gap-5 p-5"
        >
          <ul>
            {p.q.criteria.map((c) => (
              <li key={c.id} className="grid grid-cols-[1rem_1fr] gap-x-3 border-t border-rule py-2.5 first:border-t-0 first:pt-0">
                <StateGlyph kind={c.result === "met" ? "mark-tick" : c.result === "unknown" ? "mark-ring" : "mark-x"} className="mt-1" />
                <div>
                  <p className="font-[560]">{c.label} <span className="font-[450] tabular-nums text-muted">· {c.weight}%</span></p>
                  <p className="text-[0.875rem] text-muted">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          {p.withheld ? <p className="rounded-[var(--radius-sm)] bg-lamp-wash px-3.5 py-2.5 text-[0.9063rem] text-ink">A note in the list read like instructions. Scout withheld it from drafting and flagged this account for a person.</p> : null}
          <div>
            <p className="t-label">Introduction</p>
            {draft ? (
              <div className="mt-2 grid gap-2">
                <label className="sr-only" htmlFor={`subj-${where}-${p.id}`}>Subject</label>
                <input
                  id={`subj-${where}-${p.id}`}
                  className="field min-h-11 py-2 text-[0.9375rem]"
                  value={draft.subject}
                  disabled={approved[p.id]}
                  onChange={(e) => setEdits((x) => ({ ...x, [p.id]: { ...draft, subject: e.target.value } }))}
                />
                <label className="sr-only" htmlFor={`body-${where}-${p.id}`}>Message</label>
                <textarea
                  id={`body-${where}-${p.id}`}
                  rows={8}
                  className="field resize-y text-[0.9063rem] leading-relaxed"
                  value={draft.body}
                  disabled={approved[p.id]}
                  onChange={(e) => setEdits((x) => ({ ...x, [p.id]: { ...draft, body: e.target.value } }))}
                />
                <div className="flex flex-wrap items-center gap-3" aria-live="polite">
                  {approved[p.id] ? (
                    <p className="inline-flex min-h-11 items-center gap-2 font-[560]"><StateGlyph kind="mark-tick" /> Approved in this preview. Nothing was sent.</p>
                  ) : (
                    <button
                      type="button"
                      disabled={problems.length > 0}
                      onClick={() => setApproved((x) => ({ ...x, [p.id]: true }))}
                      className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 font-[560] text-stone hover:bg-ink-2 disabled:opacity-45"
                    >
                      Approve
                    </button>
                  )}
                  {problems.length ? <p className="text-[0.875rem] text-danger">{problems.join(" ")}</p> : <p className="text-[0.875rem] text-muted">To {p.contact}. Try changing the subject to “Re: our call”.</p>}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[0.9375rem] text-ink-2">No draft. {p.contact ? p.q.recommendation : "There’s no business contact to address, and Scout won’t write to personal addresses."}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <LayoutGroup id="scout-review">
        <ul className="lg:col-span-5" aria-label="Sample list, checked by Scout">
          {prospects.map((x) => {
            const on = x.id === p.id;
            return (
              <li key={x.id} className="border-b border-rule">
                <button type="button" aria-pressed={on} onClick={() => setSel(x.id)} className="group relative isolate flex w-full items-center gap-3 py-3 text-left">
                  {on ? <motion.span layoutId="scout-plate" transition={reduce ? { duration: 0 } : SPRING.snap} className="absolute inset-y-0.5 -inset-x-3 -z-10 rounded-[var(--radius-sm)] bg-paper shadow-[var(--shadow-paper)]" aria-hidden="true" /> : null}
                  <span className={`min-w-0 flex-1 truncate ${on ? "font-[600]" : "text-ink-2"}`}>{x.name}</span>
                  <span className="shrink-0 text-[0.8125rem] tabular-nums text-muted">{label(x)}</span>
                  <span className="w-8 shrink-0 text-right text-[0.8125rem] font-[600] tabular-nums">{label(x) === "Do not contact" ? "—" : x.q.score}</span>
                </button>
                {on ? <div className="pb-4 lg:hidden">{inspector("inline")}</div> : null}
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-24">{inspector("side")}</div>
      </div>
    </div>
  );
}
