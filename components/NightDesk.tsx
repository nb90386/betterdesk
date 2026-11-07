import type { CSSProperties, ReactNode } from "react";
import { LogoMark } from "./Logo";

/**
 * Hero scene: one evening at Ridgeline Plumbing & Heating (sample business).
 * A missed call (amber signal) → a text thread → a held slot on Thursday's schedule (pearl, settled).
 * Server-rendered; the resolved scene is the default frame. CSS sequences it once when motion is allowed.
 */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function NightDesk() {
  return (
    <figure className="relative m-0" aria-labelledby="nd-caption">
      <div className="relative grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1.3fr)_minmax(0,0.98fr)] md:items-start md:gap-6 lg:gap-8">
        <Thread />
        <CallNode />
        <Conversation />
        <Schedule />
      </div>
      <figcaption id="nd-caption" className="mt-6 flex items-center gap-2 text-[0.78rem] text-night-muted md:mt-5 md:justify-end">
        <span className="size-1.5 rounded-full border border-current" aria-hidden="true" />
        Sample conversation. The business, caller and times are illustrative.
      </figcaption>
    </figure>
  );
}

function CallNode() {
  return (
    <div className="relative md:pt-6">
      <div className="relative flex items-center gap-4 md:flex-col md:items-start md:gap-5">
        <div className="relative grid size-[60px] shrink-0 place-items-center md:size-[120px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            <circle className="nd-ring" cx="50" cy="50" r="49" fill="none" stroke="var(--color-lamp)" strokeWidth="0.8" />
            <circle className="nd-ring" cx="50" cy="50" r="49" fill="none" stroke="var(--color-lamp)" strokeWidth="0.8" />
            <circle className="nd-ring" cx="50" cy="50" r="49" fill="none" stroke="var(--color-lamp)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="31" fill="none" stroke="rgb(244 169 71 / 0.28)" strokeWidth="0.8" strokeDasharray="1.5 3" />
            <circle cx="50" cy="50" r="20" fill="#1f1a12" stroke="rgb(244 169 71 / 0.55)" strokeWidth="0.9" />
          </svg>
          <PhoneMissed className="relative size-6 text-lamp md:size-7" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.95rem] font-medium text-[#f7f6f3]">Missed call</p>
          <p className="font-mono text-[0.86rem] tabular text-night-muted">(512) 555-0148</p>
          <p className="font-mono text-[0.86rem] tabular text-lamp">6:42 PM</p>
          <p className="mt-2 max-w-[24ch] text-[0.82rem] leading-snug text-night-muted">
            Office closed at 5. Both techs are still on jobs.
          </p>
        </div>
      </div>
    </div>
  );
}

function Conversation() {
  return (
    <div className="nd-in stage-pane nd-focal relative z-10 p-4 sm:p-5 md:-mt-4 md:p-6" style={d(300)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2a2d32] text-[0.68rem] font-semibold text-[#f7f6f3]">RP</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate whitespace-nowrap text-[0.82rem] font-medium text-[#f7f6f3]">Ridgeline Plumbing</p>
            <p className="text-[0.72rem] text-night-muted">Text with Dana M.</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[6px] bg-lamp/12 px-1.5 py-1 text-[0.7rem] font-medium text-lamp"><LogoMark className="size-3.5 text-[#f7f6f3]" rings={1} />Replying</span>
      </div>
      <ol className="mt-4 space-y-2.5 text-[0.88rem] leading-snug md:text-[0.92rem]">
        <Bubble from="desk" delay={600} time="6:42">
          Hi, this is Ridgeline Plumbing. Sorry we missed your call. What&rsquo;s going on? I can get you on the schedule.
        </Bubble>
        <Bubble from="customer" delay={1250} time="6:45">
          Water heater is leaking in the garage. Slow drip. 78704.
        </Bubble>
        <Bubble from="desk" delay={1950} time="6:46" className="hidden sm:flex">
          We can be there Thursday 8&ndash;10 AM or 1&ndash;3 PM. Which works?
        </Bubble>
        <Bubble from="customer" delay={2600} time="6:47">
          8&ndash;10 please
        </Bubble>
      </ol>
    </div>
  );
}

function Bubble({ from, children, delay, time, className = "" }: { from: "desk" | "customer"; children: ReactNode; delay: number; time: string; className?: string }) {
  const desk = from === "desk";
  return (
    <li className={`nd-pop flex ${desk ? "justify-start" : "justify-end"} ${className}`} style={d(delay)}>
      <p
        className={`max-w-[88%] rounded-[14px] px-3.5 py-2.5 ${
          desk ? "rounded-bl-[5px] bg-[#25282d] text-[#eceae6]" : "rounded-br-[5px] bg-[#f3f1ec] text-[#16171a]"
        }`}
      >
        {children}
        <span className={`ml-2 align-baseline font-mono text-[0.66rem] tabular ${desk ? "text-[#8e939a]" : "text-[#55585e]"}`}>{time}</span>
      </p>
    </li>
  );
}

const SLOTS = [
  { t: "7:00", label: "Tune-up · Okafor", kind: "busy" },
  { t: "8:00", label: "", kind: "booked" },
  { t: "10:30", label: "Drain clear · Ruiz", kind: "busy" },
  { t: "1:00", label: "Open", kind: "open" },
] as const;

function Schedule() {
  return (
    <div className="relative md:pt-2">
      <div className="hidden items-baseline justify-between md:flex">
        <p className="text-[0.82rem] font-medium text-[#f7f6f3]">Thursday</p>
        <p className="text-[0.74rem] text-night-muted">Tech: Marco</p>
      </div>
      <ol className="relative mt-3 space-y-2 md:border-l md:border-white/[0.08] md:pl-4">
        {SLOTS.map((s) =>
          s.kind === "booked" ? (
            <li key={s.t} className="relative">
              <div className="absolute inset-0 hidden items-start gap-3 nd-out rounded-[14px] border border-dashed border-lamp/40 px-3 py-2.5 text-[0.78rem] text-lamp md:flex" style={d(3100)} aria-hidden="true">
                <span className="w-10 font-mono tabular">8:00</span>
                <span className="flex items-center gap-2"><span className="pulse-dot size-1.5 rounded-full bg-lamp" />Holding for Dana M.</span>
              </div>
              <div className="nd-settle pearl-card relative p-3.5" style={d(3100)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-medium text-[#55585e]">Booked · 6:47 PM</p>
                    <p className="mt-1 whitespace-nowrap font-display text-[1.02rem] leading-tight tracking-[-0.02em] text-[#111214] lg:text-[1.1rem]">Thu · 8:00&ndash;10:00 AM</p>
                  </div>
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#111214] text-lamp">
                    <Check className="size-3.5" />
                  </span>
                </div>
                <p className="mt-2 truncate border-t border-[#d8d6d0] pt-2 text-[0.76rem] text-[#2a2c30]">Dana M. · water heater · 78704</p>
              </div>
            </li>
          ) : (
            <li
              key={s.t}
              className={`hidden items-center gap-3 rounded-[10px] px-3 py-2.5 text-[0.78rem] md:flex ${
                s.kind === "open" ? "border border-dashed border-white/15 text-night-muted" : "bg-white/[0.04] text-[#c9ccd1]"
              }`}
            >
              <span className="w-10 font-mono tabular text-night-muted">{s.t}</span>
              <span>{s.label}</span>
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

/** One continuous thread through the scene: dashed (unresolved) from the call, solid once it reaches the schedule. */
function Thread() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden size-full overflow-visible md:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M17.5 21 C 22 19, 25 21, 30 24" fill="none" stroke="rgb(244 169 71 / 0.65)" strokeWidth="1.3" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function PhoneMissed({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5.2 3.8h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3c0 .9-.8 1.7-1.7 1.6A15.5 15.5 0 0 1 3.6 5.5c-.1-.9.7-1.7 1.6-1.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m15 3.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="m3.5 8.4 2.9 2.9 6.1-6.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
