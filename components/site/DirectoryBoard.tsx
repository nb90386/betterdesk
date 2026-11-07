"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";

/**
 * Signature scene A: the building directory. One business climbs the floors from Found to Won while
 * keeping its source. Every name is fictional sample data (lib/demo/seed.ts). The scene explains itself
 * in text below the board, so nothing depends on watching the motion.
 */

type Line = { name: string; detail: string; right: string };
const FLOORS = [
  { id: "found", label: "Found", lens: "Scout", lines: [{ name: "Harborline Dental", detail: "Dental practice · 6,200 sq ft", right: "Researching" }] },
  { id: "talking", label: "In conversation", lens: "Desk", lines: [{ name: "Alder & Finch Architects", detail: "Website inquiry · said they found you on Google", right: "Replied" }] },
  { id: "walkthrough", label: "Walkthrough", lens: "Desk", lines: [{ name: "Cobalt Coworking", detail: "Added after a networking event", right: "Thu 10:30" }] },
  { id: "won", label: "Customer", lens: "Desk", lines: [{ name: "Ridgeview Property Group", detail: "Referral · 22,000 sq ft", right: "Since spring" }] },
] as const satisfies readonly { id: string; label: string; lens: string; lines: Line[] }[];

const STEPS = [
  { floor: 0, detail: "Found by Scout in your list · office, 12,000 sq ft · meets all 5 of your fit criteria", right: "Approve intro", needsYou: true, caption: "Scout found Juniper Lane Law in a list you imported, checked it against your criteria and wrote an introduction. Nothing is sent until you approve it." },
  { floor: 1, detail: "Elena Brooks replied: “Tuesday morning could work.”", right: "Offer times", needsYou: true, caption: "Elena replied. The reply lands in the same record as Scout's research, so you answer with the context in front of you." },
  { floor: 2, detail: "Walkthrough Tue 8:00 · source kept: your prospect list", right: "Tue 8:00", needsYou: false, caption: "The walkthrough is booked from your open times. The record still shows where the account came from." },
  { floor: 3, detail: "Nightly cleaning, five nights a week", right: "Won", needsYou: false, caption: "Juniper Lane Law becomes a customer, with every step from first research to signed contract on one timeline." },
] as const;

const MOVE = { layout: { duration: 0.75, ease: [0.65, 0, 0.35, 1] as const } };
const SWAP_IN = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

export function DirectoryBoard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const s = STEPS[step];

  // Autoplay advances once per 2.6s while the board is on screen; it stops at the last floor.
  useEffect(() => {
    if (reduce || !playing || !inView) return;
    if (step >= STEPS.length - 1) {
      const t = window.setTimeout(() => setPlaying(false), 400);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((x) => Math.min(x + 1, STEPS.length - 1)), step === 0 ? 1600 : 2600);
    return () => window.clearTimeout(t);
  }, [step, playing, inView, reduce]);

  const go = (i: number) => {
    setPlaying(false);
    setStep(i);
  };

  return (
    <div ref={ref} className="on-graphite board overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule px-5 py-3.5 text-[0.8125rem] text-muted sm:px-7">
        <span>
          <span className="font-[600] text-ink">Clearline Commercial Cleaning</span> · Denver
        </span>
        <span>Sample workspace · fictional company</span>
      </div>

      {/* The building itself: how findable the company's own website is. */}
      <div className="flex flex-col gap-1 border-b border-rule px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-7">
        <span className="w-[7.5rem] shrink-0 t-label">Your website</span>
        <span className="flex min-w-0 flex-1 items-center text-[0.9375rem] text-ink-2">
          <span className="truncate">clearline.example · 3 fixes would help customers find you</span>
          <span className="leader hidden sm:block" />
        </span>
        <span className="text-[0.8125rem] text-muted">Presence</span>
      </div>

      <LayoutGroup id="directory">
        <ol className="grid lg:grid-cols-4" aria-label="Floors, from first found to customer">
          {FLOORS.map((f, fi) => (
            <li key={f.id} className={`flex flex-col border-rule px-5 pb-5 pt-4 sm:px-7 ${fi > 0 ? "border-t lg:border-l lg:border-t-0" : ""}`}>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-[0.8125rem] font-[600] tracking-[0.01em] text-ink">
                  <span className="mr-2 tabular-nums text-muted">{fi + 1}</span>
                  {f.label}
                </h3>
                <span className="text-[0.75rem] text-muted">{f.lens}</span>
              </div>
              <ul className="flex flex-col">
                {s.floor === fi ? (
                  <motion.li key="journey" layoutId="journey-line" transition={reduce ? { duration: 0 } : MOVE} className="relative z-10 -mx-2 rounded-[8px] bg-graphite-3 px-2 py-2.5 shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_10px_24px_-14px_rgb(0_0_0/0.8)]">
                    <div className="flex items-center gap-2.5">
                      <motion.span layout="position" className={s.needsYou ? "mark-lamp is-live" : "mark-off"} aria-hidden="true" />
                      <motion.span layout="position" className="font-[600] text-ink">Juniper Lane Law</motion.span>
                    </div>
                    <div className="relative mt-1 min-h-[2.6em] pl-[1.2rem] text-[0.8438rem] leading-snug text-ink-2">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.p
                          key={step}
                          initial={reduce ? false : { opacity: 0, filter: "blur(3px)", y: 4 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0, transition: { ...SWAP_IN, delay: reduce ? 0 : 0.5 } }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        >
                          {s.detail}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className={`mt-1.5 pl-[1.2rem] text-[0.8125rem] font-[600] ${s.needsYou ? "text-lamp-ink" : "text-ink"}`}>{s.right}</div>
                  </motion.li>
                ) : null}
                {f.lines.map((l) => (
                  <li key={l.name} className="py-2.5 [&+&]:border-t [&+&]:border-rule">
                    <div className="flex items-center gap-2.5">
                      <span className="mark-off" aria-hidden="true" />
                      <span className="font-[560] text-ink-2">{l.name}</span>
                    </div>
                    <p className="mt-1 pl-[1.2rem] text-[0.8125rem] leading-snug text-muted">{l.detail}</p>
                    <p className="mt-1 pl-[1.2rem] text-[0.8125rem] text-muted">{l.right}</p>
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
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-pressed={step === i}
              aria-label={`Step ${i + 1}: ${FLOORS[STEPS[i].floor].label}`}
              className="press grid h-9 w-9 place-items-center rounded-[6px] text-[0.8125rem] font-[600] tabular-nums text-muted hover:text-ink aria-pressed:bg-graphite-3 aria-pressed:text-ink"
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (step >= STEPS.length - 1) setStep(0);
              setPlaying((p) => !(p && step < STEPS.length - 1));
            }}
            className="press ml-2 inline-flex h-9 items-center rounded-[6px] px-3 text-[0.8125rem] font-[600] text-ink hover:bg-graphite-3"
          >
            {playing && step < STEPS.length - 1 && !reduce ? "Pause" : step >= STEPS.length - 1 ? "Replay" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
