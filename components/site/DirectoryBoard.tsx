"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { runSampleAudit } from "@/lib/presence/sample";

/**
 * Signature scene A: a lobby directory. Floors are stages, listed top-down like a building directory
 * (4 Customer at the top, 1 Found at the bottom). One business climbs the floors while keeping its
 * source. Every name is fictional sample data (lib/demo/seed.ts); the Presence line is computed by the
 * real analyzer on the bundled sample site. The caption below says everything the motion shows.
 */

type Line = { name: string; detail: string; right: string };
const FLOORS: { n: number; label: string; lens: string; lines: Line[] }[] = [
  { n: 4, label: "Customer", lens: "Desk", lines: [{ name: "Ridgeview Property Group", detail: "Referral · 22,000 sq ft", right: "Since spring" }] },
  { n: 3, label: "Walkthrough", lens: "Desk", lines: [{ name: "Cobalt Coworking", detail: "Met at a networking event", right: "Thu 10:30" }] },
  { n: 2, label: "In conversation", lens: "Desk", lines: [{ name: "Alder & Finch Architects", detail: "Website inquiry · they said: Google search", right: "Replied" }] },
  { n: 1, label: "Found", lens: "Scout", lines: [{ name: "Harborline Dental", detail: "Dental practice · 6,200 sq ft", right: "Good fit" }] },
];

const STEPS = [
  { floor: 1, detail: "Found by Scout in your list · office, 12,000 sq ft · meets all 5 fit criteria", right: "Approve intro", needsYou: true, caption: "Scout found Juniper Lane Law in a list you imported, checked it against your criteria and wrote an introduction. Nothing is sent until you approve it." },
  { floor: 2, detail: "Elena Brooks replied: “Tuesday morning could work.”", right: "Offer times", needsYou: true, caption: "Elena replied. Her reply lands in the same record as Scout’s research, so you answer with the context in front of you." },
  { floor: 3, detail: "Walkthrough booked · source kept: your prospect list", right: "Tue 8:00", needsYou: false, caption: "The walkthrough is booked from your open times. The record still shows where the account came from." },
  { floor: 4, detail: "Nightly cleaning, five nights a week", right: "Won", needsYou: false, caption: "Juniper Lane Law becomes a customer, with every step from first research to signed contract on one timeline." },
] as const;

const MOVE = { layout: SPRING.move };
const SWAP_IN = SPRING.ui;
const LINE_GRID = "grid grid-cols-[0.75rem_1fr_auto] items-baseline gap-x-3 md:grid-cols-[0.75rem_minmax(11rem,15rem)_1fr_auto]";

export function DirectoryBoard() {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const s = STEPS[step];
  const fixes = useMemo(() => {
    const r = runSampleAudit().summary;
    return r.high + r.medium;
  }, []);

  // Autoplay climbs one floor every 2.6s while the board is on screen, and stops at the top.
  useEffect(() => {
    if (reduce || !playing || !inView) return;
    if (step >= STEPS.length - 1) {
      const t = window.setTimeout(() => setPlaying(false), 400);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((x) => Math.min(x + 1, STEPS.length - 1)), step === 0 ? 1800 : 2600);
    return () => window.clearTimeout(t);
  }, [step, playing, inView, reduce]);

  const go = (i: number) => {
    setPlaying(false);
    setStep(i);
  };

  return (
    <div ref={ref} className="on-graphite board overflow-hidden">
      <h2 className="sr-only">Example: one cleaning company’s accounts, from found to customer</h2>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule px-5 py-3.5 text-[0.8125rem] text-muted sm:px-7">
        <span className="font-[600] uppercase tracking-[0.06em] text-ink">Clearline Commercial Cleaning</span>
        <span>Sample workspace, fictional company</span>
      </div>

      {/* The building itself: how findable the company's own website is. */}
      <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-rule px-5 py-3.5 sm:px-7 md:grid-cols-[2.5rem_9rem_1fr]">
        <span className="pt-0.5 text-[0.75rem] font-[600] tracking-[0.06em] text-muted">WEB</span>
        <span className="hidden pt-0.5 text-[0.8125rem] font-[600] text-ink md:block">
          Your website<span className="ml-2 font-[450] text-muted">Presence</span>
        </span>
        <span className="flex min-w-0 items-baseline text-[0.9375rem] text-ink-2">
          <span>clearline.example · {fixes} fixes worth making soon</span>
          <span className="leader hidden md:block" aria-hidden="true" />
          <span className="hidden text-[0.875rem] tabular-nums text-muted md:inline">checked yesterday</span>
        </span>
      </div>

      <LayoutGroup id="directory">
        <ol aria-label="Floors, from customer at the top to first found at the bottom">
          {FLOORS.map((f) => (
            <li key={f.n} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-rule px-5 py-3.5 last:border-b-0 sm:px-7 md:grid-cols-[2.5rem_9rem_1fr]">
              <span className="text-[1.375rem] font-[600] leading-none tabular-nums text-muted" aria-hidden="true">{f.n}</span>
              <h3 className="mb-2 text-[0.8125rem] font-[600] text-ink md:mb-0 md:pt-0.5">
                <span className="sr-only">Floor {f.n}: </span>
                {f.label}
                <span className="ml-2 font-[450] text-muted">{f.lens}</span>
              </h3>
              <ul className="col-start-2 flex flex-col gap-2.5 md:col-start-3 md:row-start-1">
                {s.floor === f.n ? (
                  <motion.li key="journey" layoutId="journey-line" transition={reduce ? { duration: 0 } : MOVE} className="relative z-10 -mx-2.5 rounded-[8px] bg-graphite-3 px-2.5 py-2 shadow-[var(--shadow-held)]">
                    <div className={LINE_GRID}>
                      <span className={`${s.needsYou ? "mark-lamp" : "mark-off"} self-center`} aria-hidden="true" />
                      <span className="font-[600] text-ink">Juniper Lane Law</span>
                      <span className="relative col-start-2 row-start-2 min-h-[1.4em] min-w-0 text-[0.875rem] text-ink-2 md:col-start-3 md:row-start-1">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={step}
                            className="block"
                            initial={reduce ? false : { opacity: 0, filter: "blur(3px)", y: 4 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0, transition: { ...SWAP_IN, delay: reduce ? 0 : 0.55 } }}
                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          >
                            {s.detail}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className={`col-start-3 row-start-1 text-right text-[0.875rem] font-[600] tabular-nums md:col-start-4 ${s.needsYou ? "text-lamp-ink" : "text-ink"}`}>{s.right}</span>
                    </div>
                  </motion.li>
                ) : null}
                {f.lines.map((l) => (
                  <li key={l.name} className={LINE_GRID}>
                    <span className="mark-off self-center" aria-hidden="true" />
                    <span className="font-[560] text-ink-2">{l.name}</span>
                    <span className="col-start-2 row-start-2 flex min-w-0 items-baseline text-[0.875rem] text-muted md:col-start-3 md:row-start-1">
                      <span className="min-w-0 md:truncate">{l.detail}</span>
                      <span className="leader hidden md:block" aria-hidden="true" />
                    </span>
                    <span className="col-start-3 row-start-1 text-right text-[0.875rem] tabular-nums text-muted md:col-start-4">{l.right}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </LayoutGroup>

      <div className="flex flex-col gap-4 border-t border-rule px-5 py-4 sm:px-7 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[62ch] text-[0.9375rem] leading-snug text-ink-2" aria-live="polite">
          {s.caption}
        </p>
        <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Step through the example">
          {STEPS.map((st, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-pressed={step === i}
              aria-label={`Step ${i + 1}: ${FLOORS.find((f) => f.n === st.floor)!.label}`}
              className="press grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[0.8125rem] font-[600] tabular-nums text-muted hover:text-ink aria-pressed:bg-graphite-3 aria-pressed:text-ink"
            >
              {i + 1}
            </button>
          ))}
          {reduce ? null : (
            <button
              type="button"
              onClick={() => {
                if (step >= STEPS.length - 1) setStep(0);
                setPlaying((p) => !(p && step < STEPS.length - 1));
              }}
              className="press ml-2 inline-flex h-10 items-center rounded-[var(--radius-sm)] px-3 text-[0.8125rem] font-[600] text-ink hover:bg-graphite-3"
            >
              {playing && step < STEPS.length - 1 ? "Pause" : step >= STEPS.length - 1 ? "Replay" : "Play"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
