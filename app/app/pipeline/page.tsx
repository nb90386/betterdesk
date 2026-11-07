"use client";

import Link from "next/link";
import { motion, LayoutGroup } from "motion/react";
import { useWorkspace } from "@/lib/demo/store";
import { STAGES, STAGE_LABEL, type Stage } from "@/lib/domain/types";
import * as A from "@/lib/workspace/actions";
import { account, qualOf } from "@/lib/workspace/selectors";
import { PageHeader, TierMark, ago } from "@/components/app/ui";

export default function PipelinePage() {
  const { ws, act } = useWorkspace();
  return (
    <div className="space-y-6">
      <PageHeader title="Pipeline" lede="Stages describe the deal, not message delivery. Move a card with its stage menu; every change is recorded with who made it." />
      <LayoutGroup>
        <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8" role="region" aria-label="Pipeline board, scrolls sideways" tabIndex={0}>
          <ol className="grid min-w-[92rem] grid-cols-9 gap-3">
            {STAGES.map((s) => {
              const opps = ws.opportunities.filter((o) => o.stage === s);
              return (
                <li key={s} className="min-w-0">
                  <h2 className="flex items-baseline justify-between px-1 text-[0.8125rem] font-medium"><span>{STAGE_LABEL[s]}</span><span className="font-mono text-muted">{opps.length}</span></h2>
                  <ul className="mt-2 min-h-24 space-y-2 rounded-[var(--radius-md)] bg-mineral-2/70 p-1.5">
                    {opps.map((o) => {
                      const a = account(ws, o.accountId)!;
                      return (
                        <motion.li layout layoutId={o.id} key={o.id} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="rounded-[var(--radius-sm)] border border-rule bg-surface p-2.5 shadow-[var(--shadow-rest)]">
                          <Link href={`/app/customers/${a.id}`} className="block text-[0.8125rem] font-medium leading-snug hover:underline">{a.name}</Link>
                          <div className="mt-1"><TierMark q={qualOf(ws, a.id)} /></div>
                          <p className="mt-1 line-clamp-2 text-[0.75rem] text-muted">{o.nextAction}</p>
                          <p className="mt-1 text-[0.6875rem] text-muted">{ago(o.updatedAt)}</p>
                          <label className="mt-2 block">
                            <span className="sr-only">Move {a.name} to stage</span>
                            <select value={o.stage} onChange={(e) => act((w, at, me) => A.moveStage(w, o.id, e.target.value as Stage, at, me), `${a.name} moved to ${STAGE_LABEL[e.target.value as Stage]}.`)} className="block w-full rounded-[var(--radius-xs)] border border-rule bg-mineral px-1.5 py-1 text-[0.75rem]">
                              {STAGES.map((x) => <option key={x} value={x}>{STAGE_LABEL[x]}</option>)}
                            </select>
                          </label>
                        </motion.li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </LayoutGroup>
    </div>
  );
}
