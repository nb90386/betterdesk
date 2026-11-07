"use client";
import { Check } from "./NightDesk";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const MODES = [
  {
    id: "assisted",
    label: "Assisted",
    sub: "Recommended to start",
    outcome: "Draft waits for your OK",
    detail: "BetterDesk writes the reply. You get a notification, tap approve or edit, and it sends.",
    tone: "amber",
  },
  {
    id: "escalation",
    label: "Escalation",
    sub: "Routine on its own",
    outcome: "Sent · routine question",
    detail: "Hours, service area and booking go out on their own. Pricing exceptions, complaints and emergencies come to you.",
    tone: "handled",
  },
  {
    id: "autonomous",
    label: "Autonomous",
    sub: "When you trust it",
    outcome: "Sent and booked",
    detail: "It replies and books within your rules, and anything outside them still goes to a person.",
    tone: "handled",
  },
] as const;

export function ModeSwitcher() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("assisted");
  const m = MODES.find((x) => x.id === mode)!;
  const uid = useId();
  const reduce = useReducedMotion();
  return (
    <div className="rounded-[var(--radius-xl)] border border-night-rule bg-night-2 p-4 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-[0.74rem] font-medium text-night-muted">Reply mode</span>
        <span className="rounded-full border border-dashed border-night-rule px-2.5 py-0.5 text-[0.74rem] font-medium text-night-muted">Sample</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-night p-1" role="group" aria-label="Reply mode">
        {MODES.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={mode === x.id}
            onClick={() => setMode(x.id)}
            className="press relative rounded-[8px] px-2 py-2.5 text-left"
          >
            {mode === x.id ? (
              <motion.span layoutId={`${uid}-m`} className="absolute inset-0 rounded-[8px] bg-night-3" transition={{ type: "spring", stiffness: 520, damping: 42 }} />
            ) : null}
            <span className="relative block text-[0.85rem] font-medium text-card">{x.label}</span>
            <span className="relative hidden text-[0.7rem] text-night-muted sm:block">{x.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-card px-3.5 py-2 text-[0.86rem] text-ink">Are you open Saturday? Need a drain looked at.</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2 }}
          >
            <div className={`max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[0.86rem] ${mode === "assisted" ? "border border-dashed border-amber/60 bg-night-3 text-card/90" : "bg-night-3 text-card"}`}>
              Yes, Saturdays 8 AM–2 PM. I can book you 10 AM–12 PM this Saturday. Want it?
              {mode === "autonomous" ? <span className="mt-2 block font-mono text-[0.6875rem] text-handled-bright"><Check className="mr-1 inline size-3.5 align-[-2px]" />Customer said yes · Sat 10 AM booked</span> : null}
            </div>
            <p className={`mt-3 text-[0.74rem] font-medium ${m.tone === "amber" ? "text-[#e9c77b]" : "text-handled-bright"}`}>{m.outcome}</p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-card/80">{m.detail}</p>
            {mode === "assisted" ? (
              <div className="mt-3 flex gap-2" aria-hidden="true">
                <span className="rounded-full bg-card px-3 py-1 text-[0.78rem] font-medium text-ink">Approve</span>
                <span className="rounded-full border border-night-rule px-3 py-1 text-[0.78rem] text-card/80">Edit</span>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
