"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { AnimatePresence, animate, motion, type MotionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BIZ, BOOKING, CALLER, STATIONS, type Line } from "@/lib/story";

const THRESHOLDS = [0, 0.16, 0.36, 0.58, 0.8];
const stationAt = (p: number) => THRESHOLDS.reduce((acc, t, i) => (p >= t ? i : acc), 0);

/**
 * Act III, the signature. One vermilion route runs through five stations: the call, the reply,
 * the follow-up, open times, booked. Scroll scrubs it; Play runs it without scrolling.
 * The visual is aria-hidden; the transcript below it is the text equivalent.
 */
export function SignalToBooking({ id = "conversation", headingLevel = 2 }: { id?: string; headingLevel?: 2 | 1 }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const progress = useMotionValue(0);
  const [station, setStation] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!playingRef.current) progress.set(p);
  });
  useMotionValueEvent(progress, "change", (p) => setStation(stationAt(p)));

  const stopRef = useRef<() => void>(() => {});
  const play = () => {
    stopRef.current();
    playingRef.current = true;
    setPlaying(true);
    progress.set(0);
    const ctl = animate(progress, 1, { duration: 11, ease: "linear" });
    stopRef.current = () => ctl.stop();
    ctl.then(() => {
      playingRef.current = false;
      setPlaying(false);
    });
  };
  const stop = () => {
    stopRef.current();
    playingRef.current = false;
    setPlaying(false);
    progress.set(scrollYProgress.get());
  };
  useEffect(() => () => stopRef.current(), []);

  const H = headingLevel === 1 ? "h1" : "h2";
  const title = "From the first ring to the booked appointment.";

  if (reduce) {
    return (
      <section id={id} data-tone="dark" aria-labelledby={`${id}-title`} className="tone-dark bg-petrol py-24">
        <div className="wrap">
          <H id={`${id}-title`} className="t-display max-w-[16ch]">{title}</H>
          <ol className="mt-14 grid gap-10 md:grid-cols-2">
            {STATIONS.map((s) => (
              <li key={s.id}>
                <p className="t-label">{s.time} · {s.label}</p>
                <p className="mt-2 text-[1.25rem] leading-snug">{s.caption}</p>
                {s.lines.map((l, i) => <Bubble key={i} line={l} className="mt-3" />)}
              </li>
            ))}
          </ol>
          <BookedCard className="mt-12 max-w-sm" />
        </div>
      </section>
    );
  }

  return (
    <>
    <section id={id} ref={ref} data-tone="dark" data-pinned aria-labelledby={`${id}-title`} className="tone-dark relative h-[520vh] bg-petrol">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Stage light: a single soft pool behind the thread, the only light in the room */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_68%_45%,rgb(255_255_255/0.07)_0%,transparent_70%)]" />
        <div className="wrap relative grid h-full grid-cols-1 content-center gap-6 pt-16 lg:grid-cols-12 lg:gap-x-10 lg:pt-12">
          {/* Left: title, route rail, caption, control */}
          <div className="lg:col-span-5">
            <H id={`${id}-title`} className="t-title max-w-[18ch] text-petrol-ink lg:text-[clamp(2rem,1.2rem+1.9vw,3.1rem)]">{title}</H>
            <Rail progress={progress} station={station} />
            <div className="mt-5 min-h-[4.5rem] max-w-[34ch] lg:mt-8" aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={station}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.35 }}
                  className="text-[1.0625rem] leading-snug text-petrol-ink sm:text-[1.2rem]"
                >
                  {STATIONS[station].caption}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-center gap-4 lg:mt-6">
              <button
                type="button"
                onClick={playing ? stop : play}
                className="press inline-flex min-h-11 items-center gap-2.5 rounded-[var(--radius-sm)] border border-petrol-rule bg-petrol-2 px-4 text-[0.9375rem] font-[550] text-petrol-ink hover:border-petrol-muted"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /> : <path d="M4 2.5v11l9-5.5z" fill="currentColor" />}
                </svg>
                {playing ? "Pause" : station === 4 ? "Replay the conversation" : "Play the conversation"}
              </button>
              <span className="hidden text-[0.8125rem] text-petrol-muted sm:inline">or keep scrolling</span>
            </div>
            <p className="mt-5 hidden max-w-[40ch] text-[0.8125rem] leading-snug text-petrol-muted sm:block">
              Illustrative conversation. Bookings go straight onto your calendar where it&rsquo;s connected; otherwise BetterDesk hands the request to your team to confirm.
            </p>
          </div>

          {/* Right: the thread, built in place */}
          <div className="relative lg:col-span-6 lg:col-start-7" aria-hidden="true">
            <Thread station={station} />
          </div>
        </div>
      </div>
      {/* Text equivalent of the whole sequence */}
      <ol className="sr-only">
        {STATIONS.map((s) => (
          <li key={s.id}>
            {s.time}, {s.label}: {s.caption} {s.lines.map((l) => `${l.from === "desk" ? `${BIZ} (BetterDesk)` : CALLER.first}: ${l.text}`).join(" ")}
          </li>
        ))}
      </ol>
    </section>
      {/* Without JavaScript the stage can't advance: show the whole conversation as text instead. */}
      <noscript>
        <div className="tone-dark bg-petrol"><div className="wrap pb-24">
          <ol className="max-w-2xl space-y-6 rounded-[var(--radius-lg)] bg-petrol-2 p-6">
            {STATIONS.map((s) => (
              <li key={s.id}>
                <p className="t-label">{s.time} · {s.label}</p>
                <p className="mt-1 text-petrol-ink">{s.caption}</p>
              </li>
            ))}
          </ol>
        </div></div>
      </noscript>
    </>
  );
}

function Rail({ progress, station }: { progress: MotionValue<number>; station: number }) {
  const scaleX = useTransform(progress, [0, THRESHOLDS[4]], [0, 1], { clamp: true });
  const head = useTransform(scaleX, (v) => `calc(6px + ${v} * (100% - 12px))`);
  return (
    <div className="mt-6 lg:mt-10" aria-hidden="true">
      <div className="relative h-3">
        <span className="absolute inset-x-1.5 top-1/2 h-0.5 -translate-y-1/2 bg-petrol-rule" />
        <motion.span style={{ scaleX }} className="absolute inset-x-1.5 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-signal-bright" />
        <motion.span style={{ left: head }} className="absolute top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgb(255_106_79/0.45),0_0_14px_2px_rgb(255_106_79/0.55)]" />
        <ol className="relative flex h-full justify-between">
          {STATIONS.map((s, i) => (
            <li key={s.id} className={`block h-3 w-3 rounded-full border-2 transition-colors duration-300 ${i <= station ? "border-signal-bright bg-signal-bright" : "border-petrol-rule bg-petrol"}`} />
          ))}
        </ol>
      </div>
      <ol className="mt-3 grid grid-cols-5 text-[0.6875rem] sm:text-[0.75rem]">
        {STATIONS.map((s, i) => (
          <li key={s.id} className={`transition-colors duration-300 ${i === 0 ? "text-left" : i === 4 ? "text-right" : "text-center"} ${i === station ? "text-petrol-ink" : "text-petrol-muted/70"}`}>
            {s.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Thread({ station }: { station: number }) {
  const lines = STATIONS.slice(1, station + 1).flatMap((s) => s.lines);
  const showTimes = station === 3;
  const booked = station === 4;
  return (
    <div className="relative mx-auto w-full max-w-[30rem]">
      <motion.div layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="panel-petrol relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-petrol-rule px-5 py-3.5">
          <div>
            <p className="text-[0.9375rem] font-[550] text-petrol-ink">{CALLER.name}</p>
            <p className="t-mono text-[0.75rem] text-petrol-muted">{CALLER.phone}</p>
          </div>
          <p className="text-[0.75rem] text-petrol-muted">Texting as {BIZ}</p>
        </div>
        <motion.div layout className={`flex ${booked ? "max-h-[min(24svh,15rem)] sm:max-h-[min(30svh,17rem)]" : "max-h-[min(34svh,24rem)] sm:max-h-[min(46svh,26rem)]"} flex-col justify-end gap-2.5 overflow-hidden px-4 py-4 ${station >= 3 ? "[mask-image:linear-gradient(to_bottom,transparent_0,black_2.5rem)]" : ""} sm:px-5`}>
          <AnimatePresence initial={false}>
            {station === 0 ? (
              <motion.div key="missed" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 py-6 sm:py-10">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center">
                  <svg viewBox="0 0 56 56" className="absolute inset-0 overflow-visible" aria-hidden="true">
                    <circle className="ring-arc" cx="28" cy="28" r="26" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
                    <circle className="ring-arc delay" cx="28" cy="28" r="26" fill="none" stroke="var(--color-signal-bright)" strokeWidth="1" />
                  </svg>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-petrol-3 font-semibold text-petrol-ink">JR</span>
                </span>
                <span>
                  <span className="block text-[1.25rem] font-semibold tracking-[-0.02em] text-petrol-ink">Missed call</span>
                  <span className="block text-[0.9375rem] text-petrol-muted">2:14 PM · no voicemail</span>
                </span>
              </motion.div>
            ) : null}
            {lines.map((l) => (
              <motion.div
                key={l.time + l.text.slice(0, 12)}
                layout
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Bubble line={l} />
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {showTimes ? (
              <motion.div key="times" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 pl-1">
                {["Thu 8–10 AM", "Thu 1–3 PM"].map((t, i) => (
                  <span key={t} className={`rounded-[var(--radius-sm)] border px-3 py-1.5 text-[0.8125rem] ${i === 0 ? "border-signal-bright text-petrol-ink" : "border-petrol-rule text-petrol-muted"}`}>{t}</span>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {booked ? (
          <motion.div
            key="booked"
            layout
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 -mt-3 ml-3 w-[84%] sm:-ml-8 sm:w-[62%]"
          >
            <BookedCard />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ line, className = "" }: { line: Line; className?: string }) {
  const desk = line.from === "desk";
  return (
    <div className={`flex ${desk ? "justify-start" : "justify-end"} ${className}`}>
      <p className={`max-w-[85%] rounded-[var(--radius-md)] px-3.5 py-2.5 text-[0.9375rem] leading-snug ${desk ? "bg-petrol-3 text-petrol-ink" : "bg-[#f4f4f1] text-[#101214]"}`}>
        {line.text}
        <span className={`t-mono ml-2 text-[0.6875rem] ${desk ? "text-petrol-muted" : "text-[#595d65]"}`}>{line.time.replace(" PM", "")}</span>
      </p>
    </div>
  );
}

function BookedCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] bg-[#fbfbf9] p-4 text-[#101214] shadow-[0_1px_0_#fff_inset,18px_40px_70px_-28px_rgb(0_0_0/0.9),0_2px_6px_rgb(0_0_0/0.4)] ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[0.75rem] text-[#595d65]">Added to {BIZ}&rsquo;s calendar</p>
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#101214" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-2 text-[1.25rem] font-semibold leading-tight tracking-[-0.02em]">{BOOKING.day}, {BOOKING.window}</p>
      <p className="mt-1 text-[0.875rem] text-[#2b2e33]">{CALLER.name} · {BOOKING.job} · {BOOKING.zip}</p>
      <div className="mt-3 flex items-center gap-2 border-t border-[#d5d5d0] pt-3 text-[0.8125rem] text-[#595d65]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e2462c]" aria-hidden="true" />
        Whole conversation saved in the inbox
      </div>
    </div>
  );
}
