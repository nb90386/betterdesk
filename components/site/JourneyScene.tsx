"use client";

import { LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { JOURNEY } from "@/lib/marketing/journey";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const LAST = JOURNEY.length - 1;
/** Panel positions along the route (percent of the canvas). Alternating, descending: the opportunity travels down. */
const POS = JOURNEY.slice(0, LAST).map((_, i) => ({ x: i % 2 ? 42 : 0, y: i * 15.5 }));
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The signature scene: one opportunity becomes a customer. Each stage appears as an edge-lit
 * record on the route; at the end the records travel (shared layout) into one customer timeline.
 * Scroll scrubs it on large screens; the stage buttons jump straight to any stage.
 */
export function JourneyScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(LAST, Math.max(0, Math.floor(p * (LAST + 1.4))))));
  const draw = useTransform(scrollYProgress, [0, 0.82], [0.04, 1]);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.35) / (LAST + 1.4)) * span, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      {/* Large screens with motion: pinned, scrubbed scene */}
      <section ref={ref} data-tone="dark" data-pinned aria-labelledby="journey-title" className={`tone-dark relative hidden bg-petrol ${reduce ? "" : "lg:block"} lg:h-[300vh]`}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_70%_50%,rgb(127_216_194/0.08)_0%,transparent_70%)]" />
          <div className="wrap relative grid h-full grid-cols-12 items-center gap-x-10 pt-12">
            <div className="col-span-5">
              <h2 id="journey-title" className="t-display max-w-[14ch] text-petrol-ink">One opportunity, start to finish.</h2>
              <ol className="mt-10 space-y-1" aria-label="Stages">
                {JOURNEY.map((s, i) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => jump(i)} aria-current={i === step ? "step" : undefined} className="group flex w-full items-center gap-3 rounded-[var(--radius-sm)] py-1.5 text-left">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300 ${i < step ? "border-signal bg-signal" : i === step ? "border-signal-bright bg-signal-bright shadow-[0_0_0_4px_rgb(127_216_194/0.18)]" : "border-petrol-rule"}`} />
                      <span className={`text-[1rem] transition-colors duration-300 ${i === step ? "font-medium text-petrol-ink" : "text-petrol-muted group-hover:text-petrol-ink"}`}>{s.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="mt-8 min-h-[4.5rem] max-w-[38ch] text-[1.125rem] leading-relaxed text-petrol-ink" aria-live="polite">{JOURNEY[step].caption}</p>
              <p className="mt-4 text-[0.8125rem] text-petrol-muted">Sample records from the demo workspace. Choose a stage or keep scrolling.</p>
            </div>
            <div className="relative col-span-7 h-[min(74svh,40rem)]" aria-hidden="true">
              <LayoutGroup>
                {step < LAST ? (
                  <>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                      <motion.path d={route()} fill="none" stroke="var(--color-signal)" strokeWidth="0.35" strokeLinecap="round" style={{ pathLength: draw }} />
                    </svg>
                    {POS.map((p, i) => (
                      <div key={`ghost-${i}`} className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-petrol-rule" style={{ left: `${p.x + 28}%`, top: `${p.y + 7}%` }} />
                    ))}
                    {JOURNEY.slice(0, LAST).map((s, i) =>
                      i <= step ? (
                        <motion.div key={s.id} layoutId={`j-${s.id}`} initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.55, ease }} className="absolute w-[56%]" style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}>
                          <Card step={s} active={i === step} />
                        </motion.div>
                      ) : null,
                    )}
                  </>
                ) : (
                  <motion.div layout className="tone-light absolute inset-x-0 top-0 rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,#f8faf8,#eef2ef)] p-5 text-ink shadow-[0_1px_0_#fff_inset,22px_50px_90px_-40px_rgb(0_0_0/0.9)]" transition={{ duration: 0.6, ease }}>
                    <div className="flex items-baseline justify-between border-b border-rule pb-3">
                      <p className="font-display text-[1.35rem] font-semibold tracking-[-0.02em]">Juniper Lane Law</p>
                      <p className="text-[0.8125rem] font-medium text-signal-ink">Customer</p>
                    </div>
                    <ol className="relative mt-3 space-y-1.5">
                      <span className="absolute bottom-3 left-[5px] top-3 w-px bg-rule-strong" />
                      {JOURNEY.map((s, i) => (
                        <motion.li key={s.id} layoutId={i < LAST ? `j-${s.id}` : undefined} transition={{ duration: 0.6, ease }} className="relative grid grid-cols-[11px_1fr_auto] gap-3 rounded-[var(--radius-sm)] py-1.5">
                          <span className={`relative z-10 mt-1.5 h-[11px] w-[11px] rounded-full border-2 ${i === LAST ? "border-signal bg-signal" : "border-ink bg-surface"}`} />
                          <span><span className="block text-[0.9375rem] font-medium">{s.title}</span><span className="block text-[0.8125rem] text-muted">{s.detail}</span></span>
                          <span className="pt-0.5 text-[0.75rem] text-muted">{s.actor}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </LayoutGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Small screens and reduced motion: the same story, static */}
      <section data-tone="dark" aria-labelledby="journey-title-s" className={`tone-dark bg-petrol py-20 ${reduce ? "" : "lg:hidden"}`}>
        <div className="wrap">
          <h2 id="journey-title-s" className="t-display max-w-[14ch] text-petrol-ink">One opportunity, start to finish.</h2>
          <ol className="relative mt-10 space-y-5">
            <span aria-hidden="true" className="absolute bottom-4 left-[5px] top-2 w-px bg-signal" />
            {JOURNEY.map((s, i) => (
              <li key={s.id} className="relative pl-8">
                <span aria-hidden="true" className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-signal ${i === LAST ? "bg-signal" : "bg-petrol"}`} />
                <p className="text-[0.8125rem] text-petrol-muted">{s.label} · {s.actor}</p>
                <p className="mt-0.5 text-[1.0625rem] font-medium text-petrol-ink">{s.title}</p>
                <p className="mt-0.5 text-[0.9375rem] text-petrol-muted">{s.caption}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[0.8125rem] text-petrol-muted">Sample records from the demo workspace.</p>
        </div>
      </section>
    </>
  );
}

function route() {
  return POS.map((p, i) => `${i ? "L" : "M"}${p.x + 28} ${p.y + 7}`).join(" ");
}

function Card({ step, active }: { step: (typeof JOURNEY)[number]; active: boolean }) {
  return (
    <div className={`relative z-10 rounded-[var(--radius-md)] border p-3.5 transition-[border-color,box-shadow,background-color] duration-500 ${active ? "border-signal-bright/40 bg-[#14303a] shadow-[0_1px_0_rgb(255_255_255/0.1)_inset,0_0_0_1px_rgb(127_216_194/0.15),18px_36px_60px_-28px_rgb(0_0_0/0.9)]" : "border-petrol-rule bg-[#0f2226] text-petrol-muted shadow-[0_1px_0_rgb(255_255_255/0.05)_inset]"}`}>
      <p className="flex items-center justify-between gap-2 text-[0.75rem]">
        <span className="font-medium text-signal-bright">{step.label}</span>
        <span className="text-petrol-muted">{step.actor}</span>
      </p>
      <p className="mt-1 text-[0.9375rem] font-medium text-petrol-ink">{step.title}</p>
      <p className="mt-0.5 line-clamp-2 text-[0.8125rem] text-petrol-muted">{step.detail}</p>
    </div>
  );
}
