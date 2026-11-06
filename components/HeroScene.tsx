"use client";

import { useState } from "react";

/**
 * The through-line hero composition. CSS keyframes drive the sequence so the
 * finished scene renders without JavaScript; JS only adds pause and replay.
 * All content is a labeled sample.
 */
const D = [0.2, 1.3, 2.6, 3.9, 5.1, 6.3]; // seconds

export function HeroScene() {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <figure
      className="relative mx-auto w-full max-w-[600px]"
      aria-label="Illustration: a missed call becomes a booked appointment"
      data-paused={paused || undefined}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="sample-tag">
          <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
          Sample conversation
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="press inline-flex min-h-11 items-center rounded-full px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted hover:bg-paper-2 hover:text-ink"
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused(false);
              setRun((r) => r + 1);
            }}
            className="press inline-flex min-h-11 items-center rounded-full px-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted hover:bg-paper-2 hover:text-ink"
          >
            Replay
          </button>
        </div>
      </div>

      <div key={run} className="hero-scene relative sm:aspect-[100/104]">
        {/* Thread: frayed on arrival, calm once BetterDesk has it */}
        <svg viewBox="0 0 100 104" className="pointer-events-none absolute inset-0 hidden size-full sm:block" aria-hidden="true">
          <defs>
            <linearGradient id="thread-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-signal)" />
              <stop offset="0.28" stopColor="var(--color-ink)" />
              <stop offset="1" stopColor="var(--color-handled)" />
            </linearGradient>
          </defs>
          <path
            d="M4 6 C 2 14, 9 13, 7 19 S 3 24, 10 27"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="0.32"
            strokeDasharray="0.8 1.2"
            className="hs-fray"
            style={{ animationDelay: `${D[0] + 0.3}s` }}
            pathLength={100}
          />
          <path
            d="M10 27 C 22 31, 30 30, 38 31"
            fill="none"
            stroke="url(#thread-grad)"
            strokeWidth="0.42"
            strokeLinecap="round"
            className="hs-seg"
            style={{ animationDelay: `${D[1] - 0.2}s` }}
            pathLength={100}
          />
          <path
            d="M62 47 C 62 55, 40 54, 30 60"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.42"
            strokeLinecap="round"
            className="hs-seg"
            style={{ animationDelay: `${D[2] + 0.5}s` }}
            pathLength={100}
          />
          <path
            d="M44 70 C 52 72, 55 72, 58 72"
            fill="none"
            stroke="var(--color-handled)"
            strokeWidth="0.42"
            strokeLinecap="round"
            className="hs-seg"
            style={{ animationDelay: `${D[3] + 0.6}s` }}
            pathLength={100}
          />
          <path
            d="M74 82 C 74 88, 60 88, 50 91"
            fill="none"
            stroke="var(--color-handled)"
            strokeWidth="0.42"
            strokeLinecap="round"
            className="hs-seg"
            style={{ animationDelay: `${D[4] + 0.5}s` }}
            pathLength={100}
          />
        </svg>

        {/* Mobile rail */}
        <span className="absolute bottom-6 left-[11px] top-6 w-px bg-gradient-to-b from-signal via-ink to-handled sm:hidden" aria-hidden="true" />

        <ol className="relative flex flex-col gap-3 pl-8 sm:absolute sm:inset-0 sm:block sm:pl-0">
          {/* 1. Missed call */}
          <li className="hs-card sm:absolute sm:left-[0%] sm:top-[0%] sm:w-[52%]" style={{ animationDelay: `${D[0]}s` }}>
            <Dot tone="signal" />
            <div className="card-stock p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[0.8rem] font-medium text-signal">
                  <PhoneIcon /> Missed call
                </span>
                <time className="font-mono text-[0.7rem] text-muted">6:42 PM</time>
              </div>
              <p className="mt-1.5 font-mono text-[0.82rem] text-ink">(512) 555-0148</p>
              <p className="mt-1 text-[0.78rem] leading-snug text-muted">Rang out while both techs were on jobs</p>
            </div>
          </li>

          {/* 2. Text-back thread */}
          <li className="hs-card sm:absolute sm:left-[38%] sm:top-[17%] sm:w-[62%]" style={{ animationDelay: `${D[1]}s` }}>
            <Dot tone="ink" />
            <div className="rounded-[18px] border border-ink/10 bg-ink p-1.5 shadow-[var(--shadow-device)]">
              <div className="rounded-[13px] bg-card p-3">
                <p className="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
                  <span>Text · Ridgeline Plumbing</span>
                  <span>6:42</span>
                </p>
                <p className="mt-2.5 max-w-[92%] rounded-2xl rounded-bl-md bg-paper-2 px-3 py-2 text-[0.8rem] leading-snug text-ink">
                  Sorry we missed your call. What&rsquo;s going on? I can get you on the schedule.
                </p>
                <p
                  className="hs-card ml-auto mt-2 max-w-[86%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[0.8rem] leading-snug text-card"
                  style={{ animationDelay: `${D[1] + 0.9}s` }}
                >
                  Water heater&rsquo;s leaking. Can someone come tomorrow?
                </p>
              </div>
            </div>
          </li>

          {/* 3. Offer times */}
          <li className="hs-card sm:absolute sm:left-[4%] sm:top-[55%] sm:w-[44%]" style={{ animationDelay: `${D[2] + 0.9}s` }}>
            <Dot tone="ink" />
            <div className="card-stock p-3.5">
              <p className="text-[0.78rem] text-muted">Offered from your calendar</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-handled/40 bg-handled-soft px-2 py-1 font-mono text-[0.74rem] text-handled">
                  Thu 8–10 AM ✓
                </span>
                <span className="rounded-md border border-rule px-2 py-1 font-mono text-[0.74rem] text-muted">Thu 1–3 PM</span>
              </div>
            </div>
          </li>

          {/* 4. Booked */}
          <li className="hs-card sm:absolute sm:left-[56%] sm:top-[60%] sm:w-[44%]" style={{ animationDelay: `${D[3] + 0.9}s` }}>
            <Dot tone="handled" />
            <div className="relative overflow-hidden rounded-[10px] border border-handled/25 bg-card p-3.5 shadow-[var(--shadow-lift)]">
              <span className="absolute inset-y-0 left-0 w-1 bg-handled" aria-hidden="true" />
              <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-handled">
                <CheckIcon /> Booked
              </p>
              <p className="mt-1 text-[0.92rem] font-medium text-ink">Thu · 8:00–10:00 AM</p>
              <p className="text-[0.76rem] text-muted">Water heater · Dana M. · 78704</p>
            </div>
          </li>

          {/* 5. Inbox record */}
          <li className="hs-card sm:absolute sm:left-[8%] sm:top-[85%] sm:w-[60%]" style={{ animationDelay: `${D[4] + 1}s` }}>
            <Dot tone="handled" />
            <div className="card-stock flex items-start gap-3 p-3.5">
              <span className="mt-0.5 whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">6:47 PM</span>
              <p className="text-[0.82rem] leading-snug text-ink">
                <span className="font-medium">In your inbox:</span> missed call answered, job booked, nothing waiting on you.
              </p>
            </div>
          </li>
        </ol>
      </div>
      <figcaption className="sr-only">
        Sample sequence: a call to a plumbing company is missed at 6:42 PM. BetterDesk texts the caller back, learns the water heater has a
        slow leak, offers two open times, books Thursday 8 to 10 AM, and logs the whole conversation in the business&rsquo;s inbox.
      </figcaption>
    </figure>
  );
}

function Dot({ tone }: { tone: "signal" | "ink" | "handled" }) {
  const c = tone === "signal" ? "bg-signal" : tone === "handled" ? "bg-handled" : "bg-ink";
  return (
    <span
      className={`absolute -left-[25px] top-4 size-[9px] rounded-full ring-4 ring-paper sm:hidden ${c}`}
      aria-hidden="true"
    />
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path
        d="M4.2 2.5h1.6l1 2.6-1.2.9a7 7 0 0 0 3.4 3.4l.9-1.2 2.6 1v1.6a1.2 1.2 0 0 1-1.3 1.2A9.7 9.7 0 0 1 3 3.8a1.2 1.2 0 0 1 1.2-1.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="m11 2 3 3m0-3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="m5.3 8.2 1.8 1.8 3.6-3.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
