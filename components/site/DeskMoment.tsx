"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { createSampleWorkspace } from "@/lib/demo/seed";
import { bookSampleSlot, replyInConversation, simulateReply, suggestReply } from "@/lib/workspace/actions";
import { timeline } from "@/lib/workspace/selectors";
import { REPORTED_CHANNEL_LABEL, type Workspace } from "@/lib/domain/types";

/**
 * Desk moment: a real sample inquiry, a suggested reply built only from the company's own settings,
 * and a walkthrough booked from sample open times. Runs the workspace actions on a local copy.
 * A fixed clock keeps server and browser renders identical.
 */
const CLOCK = Date.parse("2026-11-03T15:00:00.000Z");
const ME = { kind: "user" as const, id: "usr_dana", name: "Dana Ortiz" };
const ENTER = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });

export function DeskMoment() {
  const reduce = useReducedMotion();
  const [ws, setWs] = useState<Workspace>(() => createSampleWorkspace(CLOCK));
  const [error, setError] = useState("");
  const messages = ws.conversations.filter((c) => c.accountId === "acc_alder").flatMap((c) => c.messages).sort((a, b) => a.at.localeCompare(b.at));
  const acc = ws.accounts.find((a) => a.id === "acc_alder")!;
  const suggestion = suggestReply(createSampleWorkspace(CLOCK), "cnv_alder");
  const replied = messages.some((m) => m.direction === "outbound");
  const answered = replied && messages.at(-1)?.direction === "inbound";
  const firstSlot = ws.sampleSlots[0];
  const booked = ws.appointments.find((a) => a.opportunityId === "opp_alder");
  const events = timeline(ws, "acc_alder");
  const at = () => new Date(CLOCK + 60_000 * (ws.events.length + 1)).toISOString();

  // After your simulated reply, the sample plays Maya's answer so the booking step has something real to follow.
  useEffect(() => {
    if (!replied || answered) return;
    const t = window.setTimeout(() => setWs((w) => simulateReply(w, "opp_alder", "The first time works for us. See you then.", new Date(CLOCK + 3_600_000).toISOString())), reduce ? 0 : 1100);
    return () => window.clearTimeout(t);
  }, [replied, answered, reduce]);

  const run = (fn: () => Workspace) => {
    try {
      setWs(fn());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't work.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div className="paper overflow-hidden">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3.5">
            <p className="font-[600]">{acc.name}</p>
            <p className="text-[0.8125rem] text-muted">
              Website inquiry · they said: {REPORTED_CHANNEL_LABEL[acc.source.reportedChannel ?? "not-asked"]}
            </p>
          </div>
          <LayoutGroup id="desk-thread">
            <ol className="flex flex-col gap-3 p-5">
              {messages.map((m) => (
                <motion.li
                  key={m.id}
                  layout={reduce ? false : "position"}
                  initial={m.id !== "msg_alder1" && !reduce ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0, transition: ENTER }}
                  className={`max-w-[46ch] rounded-[10px] px-4 py-3 text-[0.9375rem] leading-relaxed ${m.direction === "inbound" ? "bg-stone-2" : "ml-auto bg-graphite-2 text-graphite-ink"}`}
                >
                  <p className={`mb-1 text-[0.75rem] ${m.direction === "inbound" ? "text-muted" : "text-graphite-muted"}`}>
                    {m.from} · {fmt(m.at)}
                    {m.direction === "outbound" ? " · simulated, not sent" : m.id !== "msg_alder1" ? " · simulated reply" : ""}
                  </p>
                  <p className="whitespace-pre-line">{m.body}</p>
                </motion.li>
              ))}
            </ol>
          </LayoutGroup>
          <div className="border-t border-rule px-5 py-4">
            {!replied && suggestion?.text ? (
              <>
                <p className="t-label">Suggested reply</p>
                <p className="mt-1.5 whitespace-pre-line rounded-[8px] border border-rule bg-surface px-3.5 py-3 text-[0.9063rem] leading-relaxed text-ink-2">{suggestion.text}</p>
                <p className="mt-2 text-[0.8125rem] text-muted">{suggestion.note}</p>
                <button
                  type="button"
                  onClick={() => run(() => replyInConversation(ws, "cnv_alder", suggestion.text, at(), ME))}
                  className="press mt-3 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[560] text-stone hover:bg-ink-2"
                >
                  Send this reply <span className="ml-1.5 font-[450] opacity-70">(simulated)</span>
                </button>
              </>
            ) : !answered ? (
              <p className="flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted" role="status">
                <span className="mark-ring" aria-hidden="true" /> Waiting for Maya’s answer (the sample simulates one)…
              </p>
            ) : !booked && firstSlot ? (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => run(() => bookSampleSlot(ws, "opp_alder", firstSlot.start, at(), ME))}
                  className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[560] text-stone hover:bg-ink-2"
                >
                  Book {fmt(firstSlot.start)}
                </button>
                <span className="text-[0.8125rem] text-muted">Sample calendar. A real one needs a connected calendar.</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.9375rem] font-[560]">{booked ? `Walkthrough booked for ${fmt(booked.start)}` : "No open times left in the sample."} <span className="font-[450] text-muted">(sample calendar, no invite sent)</span></p>
                <button type="button" onClick={() => setWs(createSampleWorkspace(CLOCK))} className="link min-h-11 text-[0.9375rem] font-[560]">
                  Start over
                </button>
              </div>
            )}
            {error ? <p role="alert" className="mt-2 text-[0.875rem] text-danger">{error}</p> : null}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <p className="t-label">The account record</p>
        <p className="mt-1 text-[1.0625rem] font-[600]">{acc.name}</p>
        <p className="text-[0.875rem] text-muted">Stage: {ws.opportunities.find((o) => o.id === "opp_alder")!.stage.replace(/-/g, " ")}</p>
        <ol className="mt-4 border-l border-rule-strong" aria-live="polite">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li key={e.id} initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: ENTER }} className="relative pb-4 pl-5 last:pb-0">
                <span className="absolute -left-[4.5px] top-[0.45rem] h-2 w-2 rounded-full border border-rule-strong bg-stone" aria-hidden="true" />
                <p className="text-[0.75rem] text-muted">{fmt(e.at)} · {e.actor.name}</p>
                <p className="text-[0.9063rem] leading-snug">{e.summary}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </div>
  );
}
