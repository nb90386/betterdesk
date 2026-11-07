"use client";

import Link from "next/link";
import { useWorkspace } from "@/lib/demo/store";
import { attention, stageCounts, accountOfOpp } from "@/lib/workspace/selectors";
import { STAGE_LABEL, type Stage } from "@/lib/domain/types";
import { Panel, Empty, fmtSlot, ago } from "@/components/app/ui";
import { Icon } from "@/components/app/icons";
import { useNow } from "@/lib/useNow";

const FLOW: Stage[] = ["qualified", "outreach-prepared", "contacted", "in-conversation", "walkthrough-scheduled", "proposal", "won"];

export default function Today() {
  const { ws } = useWorkspace();
  const now = useNow();
  const items = attention(ws, now);
  const counts = stageCounts(ws);
  const max = Math.max(1, ...FLOW.map((s) => counts[s]));
  const upcoming = ws.appointments.filter((a) => a.status !== "canceled" && Date.parse(a.end) > now).sort((a, b) => a.start.localeCompare(b.start));
  const lastRun = ws.runs[0];
  const hour = new Date(now).getHours();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[0.875rem] text-muted">{new Date(now).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 className="mt-1 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em]">
          {hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}, Dana.{" "}
          <span className="text-muted">{items.length ? `${items.length} thing${items.length > 1 ? "s" : ""} need${items.length > 1 ? "" : "s"} you.` : "Nothing needs you right now."}</span>
        </h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Primary: what needs attention */}
        <Panel title="Needs you">
          {items.length === 0 ? (
            <Empty title="You're caught up" body="New replies, drafts to approve and stalled proposals will show up here." action={<Link href="/app/scout" className="text-[0.875rem] font-medium text-ink underline underline-offset-4">Give Scout a goal</Link>} />
          ) : (
            <ul className="divide-y divide-rule">
              {items.map((it) => (
                <li key={it.id}>
                  <Link href={it.href} className="group flex items-start gap-3 px-4 py-3.5 hover:bg-stone">
                    <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${it.tone === "danger" ? "bg-danger" : it.tone === "attention" ? "bg-lamp" : "bg-ink"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-medium">{it.title}</span>
                      <span className="mt-0.5 block truncate text-[0.875rem] text-muted">{it.detail}</span>
                    </span>
                    <Icon name="arrow" className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          {/* Secondary: upcoming */}
          <Panel title="Your website" action={<Link href="/app/presence" className="text-[0.8125rem] text-muted hover:text-ink">Presence</Link>}>
            {ws.presenceAudits.length === 0 ? (
              <p className="text-[0.875rem] leading-relaxed text-ink-2">No audit yet. Run the sample audit to see which fixes would help customers find you.</p>
            ) : (
              <>
                <p className="text-[0.9375rem] font-[560]">{ws.presenceAudits.at(-1)!.domain}</p>
                <p className="mt-0.5 text-[0.8125rem] text-muted">
                  {ws.presenceAudits.at(-1)!.findings.length} findings · {ws.tasks.filter((t) => t.status === "open").length} open tasks · {ws.tasks.filter((t) => t.status === "done").length} done
                </p>
              </>
            )}
          </Panel>
          <Panel title="Upcoming walkthroughs" action={<Link href="/app/calendar" className="text-[0.8125rem] text-muted hover:text-ink">Calendar</Link>}>
            {upcoming.length === 0 ? (
              <Empty title="None booked" body="Walkthroughs you book from a conversation appear here." />
            ) : (
              <ul className="divide-y divide-rule">
                {upcoming.slice(0, 4).map((a) => {
                  const acc = accountOfOpp(ws, a.opportunityId);
                  return (
                    <li key={a.id} className="flex items-baseline justify-between gap-3 px-4 py-3 text-[0.875rem]">
                      <Link href={`/app/customers/${acc?.id}`} className="font-medium hover:underline">{acc?.name}</Link>
                      <span className="shrink-0 text-right text-muted">
                        {fmtSlot(a.start)}
                        <span className="block text-[0.75rem]">{a.status === "sample-booked" ? "Sample calendar" : a.status}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* Tertiary: Scout status */}
          <Panel title="Scout" action={<Link href="/app/scout" className="text-[0.8125rem] text-muted hover:text-ink">Open</Link>}>
            <div className="px-4 py-3.5 text-[0.875rem]">
              {lastRun ? (
                <>
                  <p className="font-medium">{lastRun.goal}</p>
                  <p className="mt-1 text-muted">
                    {lastRun.state.replace("-", " ")} · started {ago(lastRun.createdAt)}
                    {lastRun.summary ? ` · ${lastRun.summary}` : ""}
                  </p>
                </>
              ) : (
                <p className="text-muted">No runs yet. Import a prospect list and Scout will qualify it and draft introductions for your review.</p>
              )}
              <p className="mt-3 border-t border-rule pt-3 text-[0.8125rem] text-muted">Outbound email: draft only. Texts and calls: off.</p>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Pipeline" action={<Link href="/app/pipeline" className="text-[0.8125rem] text-muted hover:text-ink">Open pipeline</Link>}>
        <ol className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4 lg:grid-cols-7" aria-label="Opportunities by stage">
          {FLOW.map((s) => (
            <li key={s} className="bg-surface px-4 py-3.5">
              <p className="text-[0.75rem] text-muted">{STAGE_LABEL[s]}</p>
              <p className="mt-1 font-display text-[1.6rem] font-semibold leading-none tabular-nums">{counts[s]}</p>
              <span aria-hidden="true" className="mt-2.5 block h-1 rounded-full bg-stone-2">
                <span className="block h-1 rounded-full bg-ink" style={{ width: `${(counts[s] / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
        <p className="border-t border-rule px-4 py-2.5 text-[0.8125rem] text-muted">
          {counts.lost} lost. Estimated values are never counted as revenue.
        </p>
      </Panel>
    </div>
  );
}
