"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGroup, motion, AnimatePresence } from "motion/react";
import { useWorkspace } from "@/lib/demo/store";
import { STAGES, STAGE_LABEL, type Account, type Stage } from "@/lib/domain/types";
import { contactOf, oppOf, qualOf } from "@/lib/workspace/selectors";
import { Empty, PageHeader, Panel, StageMark, TierMark, ago, fmtTime } from "@/components/app/ui";
import { Icon } from "@/components/app/icons";

type Sort = "fit" | "recent" | "name";

export default function OpportunitiesPage() {
  return (
    <Suspense>
      <Opportunities />
    </Suspense>
  );
}

function Opportunities() {
  const { ws } = useWorkspace();
  const params = useSearchParams();
  const router = useRouter();
  const selected = params.get("id");
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<Stage | "all" | "unqualified">("all");
  const [sort, setSort] = useState<Sort>("fit");

  const rows = useMemo(() => {
    const list = ws.accounts.filter((a) => a.status !== "customer").map((a) => ({ a, o: oppOf(ws, a.id), ql: qualOf(ws, a.id), c: contactOf(ws, a.id) }));
    const term = q.trim().toLowerCase();
    return list
      .filter((r) => (!term || [r.a.name, r.a.category, r.c?.name ?? "", r.a.address.zip].some((x) => x.toLowerCase().includes(term))))
      .filter((r) => (stage === "all" ? true : stage === "unqualified" ? !r.o : r.o?.stage === stage))
      .sort((x, y) => (sort === "name" ? x.a.name.localeCompare(y.a.name) : sort === "recent" ? (y.o?.updatedAt ?? y.a.createdAt).localeCompare(x.o?.updatedAt ?? x.a.createdAt) : (y.ql?.score ?? -1) - (x.ql?.score ?? -1)));
  }, [ws, q, stage, sort]);

  const open = (id: string | null) => router.replace(id ? `/app/opportunities?id=${id}` : "/app/opportunities", { scroll: false });
  const sel = rows.find((r) => r.a.id === selected) ?? (selected ? { a: ws.accounts.find((a) => a.id === selected)!, o: oppOf(ws, selected), ql: qualOf(ws, selected), c: contactOf(ws, selected) } : null);

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunities" lede="Every business you're working, wherever it came from: your lists, Scout, or your website. Select one to see why it qualified." />
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[14rem] flex-1">
          <span className="text-[0.8125rem] text-muted">Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Business, contact, category or ZIP" className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong bg-surface px-3 py-2 text-[0.9375rem] focus:border-ink" />
        </label>
        <label>
          <span className="text-[0.8125rem] text-muted">Stage</span>
          <select value={stage} onChange={(e) => setStage(e.target.value as typeof stage)} className="mt-1 block rounded-[var(--radius-sm)] border border-rule-strong bg-surface px-3 py-2 text-[0.9375rem]">
            <option value="all">All stages</option>
            <option value="unqualified">Not yet qualified</option>
            {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
          </select>
        </label>
        <label>
          <span className="text-[0.8125rem] text-muted">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-1 block rounded-[var(--radius-sm)] border border-rule-strong bg-surface px-3 py-2 text-[0.9375rem]">
            <option value="fit">Best fit first</option>
            <option value="recent">Recently active</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <LayoutGroup>
        <div className={`grid gap-6 ${sel ? "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" : ""}`}>
          <Panel>
            {rows.length === 0 ? (
              <Empty title="No matches" body={ws.accounts.length <= 4 ? "Import a prospect list on the Scout page to fill this in." : "Try a different search or stage."} action={<Link href="/app/scout" className="text-[0.875rem] font-medium text-signal-ink underline underline-offset-4">Go to Scout</Link>} />
            ) : (
              <table className="w-full text-left text-[0.875rem]">
                <caption className="sr-only">Opportunities, {rows.length} shown</caption>
                <thead className="border-b border-rule text-[0.75rem] text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Business</th>
                    <th scope="col" className="hidden px-2 py-2.5 font-medium md:table-cell">Fit</th>
                    <th scope="col" className="hidden px-2 py-2.5 font-medium lg:table-cell">Stage</th>
                    {sel ? null : <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Next action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {rows.map(({ a, o, ql }) => (
                    <tr key={a.id} className={`cursor-pointer hover:bg-mineral ${selected === a.id ? "bg-mineral" : ""}`} onClick={() => open(a.id)}>
                      <td className="px-4 py-3">
                        <button type="button" className="text-left font-medium hover:underline" aria-pressed={selected === a.id} onClick={(e) => { e.stopPropagation(); open(a.id); }}>{a.name}</button>
                        <span className="block text-[0.8125rem] text-muted">{a.category || "No category"} · {a.address.zip} · {a.source.label}</span>
                      </td>
                      <td className="hidden px-2 py-3 md:table-cell">{a.status === "excluded" ? <span className="text-[0.8125rem] text-muted">Excluded</span> : <TierMark q={ql} />}</td>
                      <td className="hidden px-2 py-3 lg:table-cell">{o ? <StageMark stage={o.stage} /> : <span className="text-[0.8125rem] text-muted">Not in pipeline</span>}</td>
                      {sel ? null : <td className="hidden max-w-[18rem] truncate px-4 py-3 text-muted sm:table-cell">{o?.nextAction ?? ql?.recommendation ?? "Run Scout to qualify."}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
          <AnimatePresence mode="popLayout">{sel?.a ? <Inspector key={sel.a.id} account={sel.a} onClose={() => open(null)} /> : null}</AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}

/** The qualification inspector: every criterion, its result, and the evidence and source behind it. */
function Inspector({ account, onClose }: { account: Account; onClose: () => void }) {
  const { ws } = useWorkspace();
  const ql = qualOf(ws, account.id);
  const o = oppOf(ws, account.id);
  const c = contactOf(ws, account.id);
  const evidence = ws.evidence.filter((e) => e.accountId === account.id);
  return (
    <motion.aside layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="self-start rounded-[var(--radius-lg)] border border-rule bg-surface xl:sticky xl:top-6" aria-label={`Qualification for ${account.name}`}>
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-3.5">
        <div>
          <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em]">{account.name}</h2>
          <p className="text-[0.8125rem] text-muted">{[account.address.street, account.address.zip].filter(Boolean).join(", ")} · {account.domain ?? "no website"}</p>
        </div>
        <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] hover:bg-mineral-2" aria-label="Close inspector"><Icon name="x" className="h-4 w-4" /></button>
      </div>
      {ql ? (
        <div className="p-4">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <div><p className="text-[0.75rem] text-muted">Fit</p><TierMark q={ql} /></div>
            <div><p className="text-[0.75rem] text-muted">Criteria known</p><p className="text-[0.875rem] font-medium">{ql.coverage}%</p></div>
            <div><p className="text-[0.75rem] text-muted">Rules</p><p className="font-mono text-[0.8125rem]">{ql.ruleVersion}</p></div>
            {ql.needsHumanReview ? <p className="text-[0.8125rem] font-medium text-attention">Needs a person to check</p> : null}
          </div>
          <p className="mt-3 text-[0.9375rem]">{ql.recommendation}</p>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {ql.criteria.map((cr) => (
              <motion.li layout key={cr.id} className="grid grid-cols-[1.25rem_1fr_auto] gap-x-2.5 py-2.5 text-[0.875rem]">
                <span aria-hidden="true" className={`mt-0.5 grid h-4 w-4 place-items-center rounded-full ${cr.result === "met" ? "bg-signal text-petrol" : cr.result === "not-met" ? "bg-rule-strong text-surface" : "border border-dashed border-rule-strong"}`}>
                  {cr.result === "met" ? <Icon name="check" className="h-3 w-3" /> : cr.result === "not-met" ? <Icon name="x" className="h-2.5 w-2.5" /> : null}
                </span>
                <span>
                  <span className="font-medium">{cr.label}</span>
                  <span className="block text-[0.8125rem] text-muted">{cr.detail}</span>
                </span>
                <span className="text-[0.75rem] text-muted">{cr.result === "met" ? "Met" : cr.result === "not-met" ? "Not met" : "Unknown"} · {cr.weight}</span>
              </motion.li>
            ))}
          </ul>
          {ql.missing.length ? <p className="mt-3 text-[0.8125rem] text-muted">Missing: {ql.missing.join("; ")}. Scout does not guess these.</p> : null}
        </div>
      ) : (
        <div className="p-4 text-[0.875rem] text-muted">Not evaluated yet. Start a Scout run that includes this business.</div>
      )}
      <div className="border-t border-rule p-4">
        <h3 className="text-[0.8125rem] font-medium text-muted">Evidence</h3>
        <ul className="mt-2 space-y-2 text-[0.875rem]">
          {evidence.map((e) => (
            <li key={e.id} className={e.flagged ? "text-attention" : ""}>
              {e.claim}
              <span className="block text-[0.75rem] text-muted">Source: {e.source.label} · retrieved {fmtTime(e.source.retrievedAt)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-3 text-[0.875rem]">
        <span className="text-muted">{c ? `${c.name}${c.role ? `, ${c.role}` : ""}` : "No contact"}{o ? ` · updated ${ago(o.updatedAt)}` : ""}</span>
        <Link href={`/app/customers/${account.id}`} className="font-medium text-signal-ink underline underline-offset-2">Open record and timeline</Link>
      </div>
    </motion.aside>
  );
}
