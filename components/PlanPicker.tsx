"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PLANS, type PlanId } from "@/lib/site";
import { Check } from "./NightDesk";

const EXAMPLE_JOB = 250; // matches the ROI calculator's default job value

/** Pricing hero object: a monthly receipt you can switch between plans. Lines restate published plan copy only. */
export function PlanPicker() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [id, setId] = useState<PlanId>("growth");
  const plan = PLANS.find((p) => p.id === id)!;
  const covers = Math.ceil(plan.price / EXAMPLE_JOB);
  const lines = ["Setup and onboarding", "Calibration to your business", "Live human support", "No annual contract"];

  return (
    <div className="on-pearl pearl-card relative mx-auto w-full max-w-[400px] p-5 sm:p-6 lg:mr-0">
      <div className="flex items-baseline justify-between border-b border-dashed border-rule-strong pb-3">
        <p className="font-display text-[1.2rem] font-[600] tracking-[-0.02em] text-ink">Your month</p>
        <p className="text-[0.74rem] text-muted">Published pricing</p>
      </div>
      <div role="radiogroup" aria-label="Plan" className="mt-4 grid grid-cols-3 rounded-[10px] bg-paper-2 p-1">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={id === p.id}
            onClick={() => setId(p.id)}
            className="press relative rounded-[8px] px-2 py-2 text-[0.84rem] font-medium text-ink-2 aria-checked:text-ink"
          >
            {id === p.id ? (
              <motion.span
                layoutId={`${uid}-knob`}
                className="absolute inset-0 rounded-[8px] bg-card shadow-[var(--shadow-card)]"
                transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
              />
            ) : null}
            <span className="relative">{p.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[0.8rem] text-muted">Best for {plan.bestFor}</p>
      <ul className="mt-4 space-y-2 text-[0.88rem] text-ink-2">
        {lines.map((l) => (
          <li key={l} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <span className="grid size-[18px] place-items-center rounded-full bg-ink text-lamp">
                <Check className="size-2.5" />
              </span>
              {l}
            </span>
            <span className="text-[0.78rem] text-muted">included</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-baseline justify-between border-t border-ink pt-3">
        <span className="text-[0.86rem] font-medium text-ink">Total</span>
        <span className="font-display text-[2.1rem] leading-none tracking-[-0.03em] text-ink tabular" aria-live="polite">
          ${plan.price}
          <span className="ml-1 font-sans text-[0.8rem] tracking-normal text-muted">/ month</span>
        </span>
      </div>
      <p className="mt-3 rounded-[8px] bg-signal-soft/70 px-3 py-2 text-[0.8rem] leading-snug text-ink-2">
        Covered by {covers} booking{covers === 1 ? "" : "s"} a month at a ${EXAMPLE_JOB} example job.{" "}
        <Link href="/roi" className="font-medium text-ink underline decoration-rule-strong underline-offset-2 hover:decoration-ink">
          Use your numbers
        </Link>
      </p>
    </div>
  );
}
