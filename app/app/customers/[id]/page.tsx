"use client";

import Link from "next/link";
import { use, useState } from "react";
import { motion } from "motion/react";
import { useWorkspace } from "@/lib/demo/store";
import { STAGES, STAGE_LABEL, type Stage } from "@/lib/domain/types";
import * as A from "@/lib/workspace/actions";
import { contactOf, oppOf, qualOf, timeline } from "@/lib/workspace/selectors";
import { isSuppressed } from "@/lib/scout/qualify";
import { Btn, Empty, Notice, Panel, StageMark, TierMark, fmtSlot, fmtTime } from "@/components/app/ui";

const REPLIES = [
  { label: "Asks for a walkthrough", text: "Thanks Dana. We are reviewing our cleaning contract. Could someone come by for a walkthrough next week?" },
  { label: "Asks about price", text: "What would nightly cleaning cost for our space?" },
  { label: "Not interested", text: "Not interested, we're happy with our current company." },
  { label: "Unsubscribe", text: "Please remove me from your list." },
];

const ACTOR_LABEL = { user: "", scout: "Scout", system: "System", simulation: "Simulated" } as const;

export default function CustomerRecord({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ws, act } = useWorkspace();
  const [msg, setMsg] = useState<{ tone: "info" | "danger"; text: string } | null>(null);
  const account = ws.accounts.find((a) => a.id === id);
  if (!account) return <Panel><Empty title="Not found" body="This record doesn't exist in the sample workspace. It may have been reset." action={<Link href="/app/customers" className="underline">All customers</Link>} /></Panel>;
  const opp = oppOf(ws, id);
  const contact = contactOf(ws, id);
  const ql = qualOf(ws, id);
  const events = timeline(ws, id);
  const conv = ws.conversations.filter((c) => c.accountId === id);
  const appts = opp ? ws.appointments.filter((a) => a.opportunityId === opp.id) : [];
  const booked = appts.find((a) => a.status === "sample-booked" || a.status === "confirmed");
  const suppressed = isSuppressed(contact?.email ?? null, ws.suppressions);
  const canReply = opp && ["contacted", "in-conversation", "outreach-prepared"].includes(opp.stage) && ws.drafts.some((d) => d.opportunityId === opp.id && d.delivery !== "not-sent");

  const run = (fn: Parameters<typeof act>[0], ok: string) => {
    const r = act(fn, ok);
    setMsg(r.ok ? { tone: "info", text: ok } : { tone: "danger", text: r.error });
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-muted"><Link href="/app/customers" className="hover:text-ink">Customers</Link> / {account.name}</nav>
      <header className="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.03em]">{account.name}</h1>
          <p className="mt-1 text-[0.9375rem] text-muted">{account.category || "Category unknown"} · {[account.address.street, account.address.city, account.address.zip].filter(Boolean).join(", ")}{account.sqft ? ` · ${account.sqft.value.toLocaleString()} sq ft` : ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {opp ? <StageMark stage={opp.stage} /> : null}
          <TierMark q={ql} />
        </div>
      </header>
      {msg ? <Notice tone={msg.tone}>{msg.text}</Notice> : null}
      {suppressed ? <Notice tone="attention">{contact?.email} is on the suppression list. BetterDesk will not draft or deliver anything to this address.</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Panel title="Timeline">
          {events.length === 0 ? <Empty title="No history yet" body="Every import, evaluation, draft, approval, reply and booking will be recorded here." /> : (
            <ol className="relative px-4 py-4">
              <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-rule" />
              {events.map((e, i) => (
                <motion.li key={e.id} initial={false} animate={{ opacity: 1 }} className="relative grid grid-cols-[1.25rem_1fr] gap-3 pb-4 last:pb-0">
                  <span aria-hidden="true" className={`relative z-10 mt-1 h-2.5 w-2.5 justify-self-center rounded-full ring-4 ring-surface ${i === events.length - 1 ? "bg-signal" : e.actor.kind === "scout" ? "bg-signal/60" : e.actor.kind === "simulation" ? "bg-rule-strong" : "bg-ink"}`} />
                  <div>
                    <p className="text-[0.875rem]">{e.summary}</p>
                    <p className="text-[0.75rem] text-muted">{fmtTime(e.at)} · {e.actor.kind === "user" ? e.actor.name : ACTOR_LABEL[e.actor.kind]}{e.actor.kind === "simulation" ? " (demo)" : ""}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Opportunity">
            {opp ? (
              <div className="space-y-4 p-4 text-[0.875rem]">
                <p><span className="text-muted">Next action: </span>{opp.nextAction}</p>
                <label className="block">
                  <span className="text-[0.8125rem] text-muted">Stage (changed by a person, recorded in the timeline)</span>
                  <select value={opp.stage} onChange={(e) => run((w, at, me) => A.moveStage(w, opp.id, e.target.value as Stage, at, me), `Stage changed to ${STAGE_LABEL[e.target.value as Stage]}.`)} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong bg-surface px-3 py-2">
                    {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                  </select>
                </label>
                <p className="text-[0.8125rem] text-muted">Estimated monthly value: {opp.estimatedMonthly ? `$${opp.estimatedMonthly.toLocaleString()} (your estimate, not revenue)` : "not set"} · Source: {account.source.label}</p>
              </div>
            ) : <Empty title="Not in the pipeline" body="Scout opens an opportunity when a business qualifies." />}
          </Panel>

          {opp && opp.stage !== "won" && opp.stage !== "lost" ? (
            <Panel title="Walkthrough">
              {booked ? (
                <div className="p-4 text-[0.875rem]">
                  <p className="font-medium">{fmtSlot(booked.start)}</p>
                  <p className="mt-1 text-muted">{booked.status === "sample-booked" ? "Booked on the sample calendar. No invite was sent; no real calendar is connected." : "Confirmed by the calendar provider."}</p>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-[0.8125rem] text-muted">Open times from the sample calendar (Denver time). Connect a real calendar in Settings: not available yet.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ws.sampleSlots.slice(0, 6).map((s) => (
                      <Btn key={s.start} size="sm" onClick={() => run((w, at, me) => A.bookSampleSlot(w, opp.id, s.start, at, me), "Walkthrough booked on the sample calendar.")}>{fmtSlot(s.start)}</Btn>
                    ))}
                  </div>
                </div>
              )}
            </Panel>
          ) : null}

          {canReply && !suppressed ? (
            <Panel title="Simulate their reply (demo)">
              <div className="p-4">
                <p className="text-[0.8125rem] text-muted">No real inbox is connected. Pick a sample reply to see how Scout reads it and what changes.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {REPLIES.map((r) => <Btn key={r.label} size="sm" onClick={() => run((w, at) => A.simulateReply(w, opp!.id, r.text, at), `Simulated reply added: ${r.label.toLowerCase()}.`)}>{r.label}</Btn>)}
                </div>
              </div>
            </Panel>
          ) : null}

          <Panel title="People and conversations">
            <div className="space-y-3 p-4 text-[0.875rem]">
              {contact ? <p><span className="font-medium">{contact.name}</span>{contact.role ? `, ${contact.role}` : ""}<span className="block text-muted">{contact.email ?? "No email"}{contact.emailKind === "personal" ? " (personal address: no outreach)" : ""}</span></p> : <p className="text-muted">No contact on file.</p>}
              {conv.length ? (
                <ul className="divide-y divide-rule border-t border-rule">
                  {conv.map((c) => <li key={c.id} className="py-2"><Link href={`/app/inbox?c=${c.id}`} className="hover:underline">{c.subject}</Link><span className="block text-[0.8125rem] text-muted">{c.messages.length} message{c.messages.length > 1 ? "s" : ""} · {c.channel === "web-form" ? "Website form" : "Email"}</span></li>)}
                </ul>
              ) : <p className="text-muted">No conversations yet.</p>}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
