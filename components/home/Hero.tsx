"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ButtonLink, Arrow } from "@/components/Button";
import { BIZ, BOOKING, CALLER, STATIONS } from "@/lib/story";

/**
 * Act I. One lit object on a mineral table: the incoming call (petrol), the reply that
 * went out (mineral, in focus) and Thursday's schedule (behind, out of focus).
 * Depth of field is the camera: the farther the layer, the softer and slower it moves.
 */
// Leaves the call (under the slab), runs beneath the reply, then rises in the gap to Thursday 8:00.
const ROUTE = "M16 50 C16 68 26 74 40 74 L60 74 C66.5 74 67.6 62 67.6 19.8";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const backY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const slabY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const backBlur = useTransform(scrollYProgress, [0, 0.5], ["blur(1.2px)", "blur(0px)"]);

  const backX = useTransform(sx, (v) => v * -6);
  const backYp = useTransform(sy, (v) => v * -4);
  const slabX = useTransform(sx, (v) => v * 10);
  const slabYp = useTransform(sy, (v) => v * 7);
  const cardX = useTransform(sx, (v) => v * 20);
  const cardYp = useTransform(sy, (v) => v * 14);
  const light = useTransform(sx, (v) => `radial-gradient(120% 90% at ${18 + v * 4}% -10%, #ffffff 0%, rgb(255 255 255 / 0.55) 30%, transparent 62%)`);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reply = STATIONS[1].lines[0];

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden bg-mineral" onPointerMove={onMove} onPointerLeave={() => { px.set(0); py.set(0); }}>
      {/* Window light from the upper left, falling off across the table. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: light }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-mineral-2/70" />

      <div className="wrap relative grid min-h-[100svh] grid-cols-1 content-center gap-y-8 pb-14 pt-24 md:pt-32 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:pb-20">
        <div className="lg:col-span-5">
          <h1 id="hero-title" className="t-hero max-w-[11ch] text-ink">
            Every inquiry deserves an answer.
          </h1>
          <p className="t-lede mt-6 md:mt-7">
            When you can&rsquo;t pick up, BetterDesk texts the caller back, follows up, and offers your real open times, so a missed call can still end in a booked appointment.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-9">
            <ButtonLink href="/contact">Request a demo</ButtonLink>
            <ButtonLink href="#conversation" variant="quiet" className="gap-1.5">
              See a conversation <Arrow down className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
          <p className="t-small mt-6 max-w-[46ch] text-muted md:mt-8">
            For plumbers, salons, cleaners and other appointment businesses. Set up with you by a person; it only says what you approve. Plans from $129 a month (proposed).
          </p>
        </div>

        {/* The object: depth of field is the camera. Far = softer and slower. */}
        <div
          role="img"
          aria-label="Illustration: a missed call from Jess becomes a text reply and a Thursday 8 to 10 AM booking"
          className="relative mx-auto w-full max-w-[36rem] sm:h-[31rem] lg:col-span-7 lg:h-[37rem] lg:max-w-none"
        >
          {/* Back: Thursday's schedule, out of focus, cropped by the frame */}
          <motion.div style={reduce ? undefined : { x: backX, y: backY, translateY: backYp, filter: backBlur }} className="absolute right-0 top-0 hidden w-[48%] sm:block">
            <div className="panel p-4 opacity-95" style={reduce ? { filter: "blur(1.5px)" } : undefined}>
              <div className="flex items-baseline justify-between border-b border-rule pb-2.5">
                <span className="text-[0.9375rem] font-semibold">{BOOKING.day}</span>
                <span className="text-[0.75rem] text-muted">{BIZ} schedule</span>
              </div>
              {[
                ["7:00", "Tune-up · Okafor", false],
                ["8:00", `${CALLER.name} · water heater`, true],
                ["10:30", "Drain clear · Ruiz", false],
                ["1:00", "Open", false],
                ["3:00", "Estimate · Patel", false],
                ["4:30", "Open", false],
              ].map(([t, what, hit]) => (
                <div key={t as string} className={`relative flex items-center gap-3 border-b border-rule/70 py-2.5 text-[0.8125rem] last:border-0 ${hit ? "text-ink" : "text-muted"}`}>
                  {hit ? <span className="absolute -left-4 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" aria-hidden="true" /> : null}
                  <span className="t-mono w-10 text-[0.75rem]">{t}</span>
                  <span className={hit ? "font-[550]" : ""}>{what}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* The route: leaves the call, runs under the reply, lands on Thursday 8:00. */}
          <svg aria-hidden="true" viewBox="0 0 130 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full overflow-visible sm:block">
            <motion.path
              d={ROUTE}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="0.26"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
            />
            {/* The signal itself: a short lit pulse that keeps travelling the route toward the booking. */}
            {!reduce ? <path d={ROUTE} pathLength={100} fill="none" stroke="var(--color-signal-bright)" strokeWidth="0.7" strokeLinecap="round" className="route-pulse" /> : null}
          </svg>

          {/* Mid: the incoming call, a petrol slab lit from the upper left */}
          <motion.div style={reduce ? undefined : { x: slabX, y: slabY, translateY: slabYp }} className="relative w-full sm:absolute sm:left-0 sm:top-[11%] sm:w-[45%]">
            <div className="tone-dark relative overflow-hidden rounded-[var(--radius-lg)] bg-petrol-2 p-4 pb-9 shadow-[var(--shadow-object)] sm:p-6">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255/0.10)_0%,transparent_38%)]" />
              <div className="relative flex items-center justify-between gap-3 text-[0.75rem] text-petrol-muted">
                <span className="truncate">Example · {BIZ} main line</span>
                <span className="t-mono shrink-0 text-[0.75rem]">2:14 PM</span>
              </div>
              <div className="relative mt-5 flex items-center gap-4 sm:mt-10">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center sm:h-14 sm:w-14">
                  <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                    <circle className="ring-arc" cx="24" cy="24" r="22" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
                    <circle className="ring-arc delay" cx="24" cy="24" r="22" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
                  </svg>
                  <span className="grid h-full w-full place-items-center rounded-full bg-petrol-3 text-[1rem] font-semibold text-petrol-ink">JR</span>
                </span>
                <div className="min-w-0">
                  <p className="text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-petrol-ink sm:text-[1.5rem]">{CALLER.name}</p>
                  <p className="t-mono mt-1 text-petrol-muted">{CALLER.phone}</p>
                </div>
              </div>
              <p className="relative mt-5 hidden text-[0.875rem] text-petrol-muted sm:mt-12 sm:block">Incoming call. Marco is under a sink.</p>
            </div>
          </motion.div>

          {/* Front: the reply that went out, in sharp focus */}
          <motion.div style={reduce ? undefined : { x: cardX, y: cardY, translateY: cardYp }} className="relative -mt-5 ml-auto w-[90%] sm:absolute sm:left-[34%] sm:top-[50%] sm:mt-0 sm:w-[52%]">
            <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-object)] sm:p-5">
              <div className="flex items-center justify-between gap-3 text-[0.75rem] text-muted">
                <span>Text to {CALLER.first} · sent by BetterDesk</span>
                <span className="t-mono shrink-0 text-[0.75rem]">{reply.time}</span>
              </div>
              <p className="mt-3 rounded-[var(--radius-md)] bg-mineral-2 px-3.5 py-3 text-[0.9375rem] leading-snug text-ink">{reply.text}</p>
              <div className="mt-3 flex items-center gap-2.5 border-t border-rule pt-3 text-[0.875rem]">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-ink" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-[550]">Booked</span>
                <span className="text-muted">Thursday, {BOOKING.window}</span>
              </div>
            </div>
          </motion.div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] -bottom-4 h-12 rounded-[50%] bg-ink/10 blur-2xl" />
          <p className="illustrative relative mt-4 sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:max-w-[30%]">Illustrative example. The business, caller and times are samples.</p>
        </div>

      </div>
    </section>
  );
}
