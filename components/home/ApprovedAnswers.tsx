"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ANSWERS = [
  { q: "Hours", a: "Mon–Fri 7 AM–6 PM, Sat 8 AM–noon. Emergencies after hours go to the on-call phone." },
  { q: "Service area", a: "Zip codes 78701 to 78759. Outside that, decline politely." },
  { q: "Service call", a: "$89 diagnostic visit, credited to the job if we do the work." },
  { q: "Gas smell", a: "Safety message first, then alert Marco straight away. Never book it." },
  { q: "Replacement quotes", a: "Offer a free estimate visit. Never quote a price by text." },
];

/**
 * Act IV macro. The mask opens from a narrow slit to the full close-up as the section arrives:
 * one capability, seen up close. Static and fully open with reduced motion.
 */
export function ApprovedAnswers() {
  const ref = useRef<HTMLDivElement>(null);
  const reducePref = useReducedMotionSafe();
  // The mask only plays where the close-up fits on screen; tall phone layouts get the open panel.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const reduce = reducePref || !wide;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(38% 30% 38% 30% round 16px)", "inset(0% 0% 0% 0% round 16px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={reduce ? undefined : { clipPath: clip }} className="tone-dark overflow-hidden rounded-[var(--radius-lg)] bg-graphite-2 shadow-[var(--shadow-object)]">
        <motion.div style={reduce ? undefined : { scale }} className="origin-center p-5 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-graphite-rule pb-4">
            <p className="text-[1.125rem] font-semibold tracking-[-0.015em] text-graphite-ink">Alder Plumbing · What BetterDesk is allowed to say</p>
            <p className="text-[0.8125rem] text-graphite-muted">Last edited by Marco, Tuesday</p>
          </div>
          <dl className="divide-y divide-graphite-rule">
            {ANSWERS.map((x) => (
              <div key={x.q} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-[0.9375rem] font-[550] text-graphite-ink">{x.q}</dt>
                <dd className="text-[0.9375rem] leading-snug text-graphite-muted">{x.a}</dd>
              </div>
            ))}
          </dl>
          <motion.div style={reduce ? undefined : { opacity: labelOpacity }} className="mt-2 flex flex-col gap-1 rounded-[var(--radius-md)] border border-graphite-rule p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-graphite-ink">Anything not on this list</p>
            <p className="text-[0.9375rem] text-graphite-muted">&ldquo;Let me check with the team and get back to you.&rdquo; Then it comes to you.</p>
          </motion.div>
        </motion.div>
      </motion.div>
      <p className="illustrative mt-3">Sample answers. Yours are written with you during setup.</p>
    </div>
  );
}
