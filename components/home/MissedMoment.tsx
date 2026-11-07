"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { BIZ, CALLER, OWNER, STATIONS } from "@/lib/story";

const BEATS = [
  { time: "2:14 PM", text: `${OWNER} is under a sink across town. His phone rings in his back pocket.` },
  { time: "2:14 PM", text: "It rings out. He'll see the missed call in about forty minutes." },
  { time: "2:16 PM", text: `Without a reply, ${CALLER.first} may simply try the next plumber on the list.` },
  { time: "2:14 PM", text: `With BetterDesk, she has a text in ${BIZ}'s name before she puts the phone down.` },
];

/** Act II. A pinned, quiet stage. Type on the left takes focus line by line; the call on the right changes state in place. */
export function MissedMoment() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setBeat(Math.min(3, Math.max(0, Math.floor(p * 4.15)))));

  if (reduce) {
    return (
      <section aria-labelledby="missed-title" className="bg-porcelain-2 py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="missed-title" className="t-display">The call you couldn&rsquo;t take.</h2>
            <ol className="mt-10 space-y-6">
              {BEATS.map((b, i) => (
                <li key={i} className="text-[1.375rem] leading-snug tracking-[-0.015em]">{b.text}</li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 lg:col-start-8"><CallSurface beat={3} /></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} data-pinned aria-labelledby="missed-title" className="relative h-[360vh] bg-porcelain-2">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid w-full grid-cols-1 gap-5 pt-14 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:pt-0">
          <div className="lg:col-span-6">
            <h2 id="missed-title" className="t-title text-[1.25rem] text-muted sm:text-[clamp(1.6rem,1.1rem+1.6vw,2.4rem)]">The call you couldn&rsquo;t take.</h2>
            <ol className="mt-4 space-y-2 sm:mt-6 sm:space-y-3 md:mt-10 md:space-y-5" aria-label="What happens to a missed call">
              {BEATS.map((b, i) => (
                <li
                  key={i}
                  aria-current={i === beat ? "step" : undefined}
                  className={`max-w-[26ch] text-[1.0625rem] font-[550] leading-[1.18] tracking-[-0.022em] transition-[color,opacity] duration-500 sm:text-[1.6rem] md:text-[2rem] [font-stretch:96%] ${
                    i === beat ? "text-ink" : i < beat ? "text-ink/30" : "text-ink/[0.14]"
                  } ${i === 3 && beat === 3 ? "!text-ink" : ""}`}
                >
                  {i === 3 ? <span className={`mr-2 inline-block h-2.5 w-2.5 -translate-y-1 rounded-full align-middle transition-colors ${beat === 3 ? "bg-signal" : "bg-transparent"}`} aria-hidden="true" /> : null}
                  {b.text}
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <CallSurface beat={beat} />
            <p className="illustrative mt-4">Illustrative scenario.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallSurface({ beat }: { beat: number }) {
  const ringing = beat === 0;
  const missed = beat === 1 || beat === 2;
  const replied = beat === 3;
  return (
    <div className="relative mx-auto w-full max-w-[30rem]">
      <div className="tone-dark relative overflow-hidden rounded-[var(--radius-lg)] bg-graphite-2 p-5 shadow-[var(--shadow-object)] sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255/0.09)_0%,transparent_40%)]" />
        <div className="relative flex items-center justify-between text-[0.8125rem] text-graphite-muted">
          <span>{BIZ} · main line</span>
          <span className="t-mono">{BEATS[beat].time}</span>
        </div>

        <p className="tabular relative mt-4 text-[2.25rem] font-[500] leading-none tracking-[-0.035em] text-graphite-ink sm:mt-8 sm:text-[4.25rem] [font-stretch:90%]" aria-hidden="true">{BEATS[beat].time.replace(" PM", "")}<span className="ml-1.5 text-[0.36em] font-[550] tracking-normal text-graphite-muted">PM</span></p>
        <div className="relative mt-4 flex items-center gap-4 sm:mt-8">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center">
            {ringing ? (
              <svg viewBox="0 0 56 56" className="absolute inset-0 overflow-visible" aria-hidden="true">
                <circle className="ring-arc" cx="28" cy="28" r="26" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
                <circle className="ring-arc delay" cx="28" cy="28" r="26" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
              </svg>
            ) : null}
            <span className={`grid h-14 w-14 place-items-center rounded-full text-[1.05rem] font-semibold transition-colors duration-500 ${missed ? "bg-graphite-3 text-graphite-muted" : "bg-graphite-3 text-graphite-ink"}`}>JR</span>
          </span>
          <div className="min-w-0">
            <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-graphite-ink">{CALLER.name}</p>
            <p className="mt-1 text-[0.9375rem] text-graphite-muted">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={ringing ? "r" : missed ? "m" : "t"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="inline-block">
                  {ringing ? "Incoming call" : missed ? "Missed call" : "Missed call · texted back"}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
        </div>

        {/* The route: whole while ringing, broken when missed, frayed off-frame without a reply, reconnected with BetterDesk */}
        <svg viewBox="0 0 320 60" className="relative mt-3 h-10 w-full sm:mt-6 sm:h-14" aria-hidden="true" preserveAspectRatio="none">
          <motion.path
            d={beat === 2 ? "M0 30 C 80 30, 150 34, 210 46 S 300 70, 340 76" : "M0 30 C 80 30, 240 30, 320 30"}
            fill="none"
            stroke="var(--color-signal-bright)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ strokeDasharray: missed ? "3 9" : "1 0", opacity: beat === 2 ? 0.35 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <circle cx="0" cy="30" r="3" fill="var(--color-signal-bright)" />
          <motion.circle cx="320" cy="30" r="3.5" fill="var(--color-signal-bright)" initial={false} animate={{ opacity: replied || ringing ? 1 : 0 }} />
        </svg>

        <div className="relative min-h-[7.5rem] sm:min-h-[8.5rem]">
          <AnimatePresence initial={false}>
            {replied ? (
              <motion.div
                key="reply"
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="on-surface rounded-[var(--radius-md)] bg-[#f4f4f1] p-4 text-[#101214]"
              >
                <p className="text-[0.75rem] text-[#595d65]">Text sent in your name · 2:14 PM</p>
                <p className="mt-2 text-[0.9375rem] leading-snug">{STATIONS[1].lines[0].text}</p>
              </motion.div>
            ) : beat === 2 ? (
              <motion.p key="gone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4 text-[0.9375rem] text-graphite-muted">
                No reply yet. {CALLER.first} is looking at other numbers.
              </motion.p>
            ) : missed ? (
              <motion.p key="vm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4 text-[0.9375rem] text-graphite-muted">
                No voicemail left.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
