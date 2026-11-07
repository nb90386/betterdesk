"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "./NightDesk";
import { LogoMark } from "./Logo";

type StepId = "signal" | "reply" | "ask" | "route" | "owner";
const STEPS: { id: StepId; time: string; title: string; body: ReactNode }[] = [
  {
    id: "signal",
    time: "6:42 PM",
    title: "It starts as a signal.",
    body: "A missed call, a text, a form sent at 11 at night. Every plan covers calls, texts and web forms. Growth adds Instagram DMs, Google Business messages and email.",
  },
  {
    id: "reply",
    time: "6:42 PM",
    title: "A reply goes out in your name.",
    body: "The caller hears back while they're still holding the phone. It answers from the services, hours, prices and policies you gave it. Start in assisted mode and every reply waits for your OK.",
  },
  {
    id: "ask",
    time: "6:45 PM",
    title: "It asks what you would ask.",
    body: "Your intake questions come from your setup: what's wrong, how urgent, and where. Then your rules decide the route.",
  },
  {
    id: "route",
    time: "6:47 PM",
    title: "Booked, or handed to a person.",
    body: "Where your calendar is connected, it offers real open times and books them. Emergencies, complaints and anything it hasn't been taught go to the person you choose, with the whole thread attached.",
  },
  {
    id: "owner",
    time: "Next morning",
    title: "You see what happened.",
    body: "Every conversation lands in one inbox, with a short list of what still needs you. Growth and Scale add owner alerts and a plain-English weekly summary.",
  },
];

export function SignalStory() {
  const [active, setActive] = useState<StepId>("signal");
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Active step = the last step whose top has passed the viewport centre. Derived from scroll position
  // (rAF-throttled), so jumps, reloads mid-page and deep links land on the right state.
  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let id: StepId = STEPS[0].id;
      for (const el of refs.current) if (el && el.getBoundingClientRect().top < mid) id = el.dataset.step as StepId;
      setActive(id);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const index = STEPS.findIndex((s) => s.id === active);

  return (
    <div className="relative grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <ol className="relative min-w-0">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            data-step={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="relative py-8 lg:flex lg:min-h-[40svh] lg:flex-col lg:justify-center lg:py-0"
          >
            <div className={`transition-opacity duration-300 lg:pl-8 ${active === s.id ? "is-active" : "is-idle"}`}>
              <span className="absolute left-0 top-[2.6rem] hidden h-[calc(100%-2.6rem)] w-px bg-white/[0.08] lg:top-1/2 lg:block lg:h-full lg:-translate-y-1/2" aria-hidden="true" />
              {active === s.id ? (
                <motion.span layoutId="story-tick" className="absolute left-[-3px] hidden h-10 w-[7px] rounded-full bg-lamp lg:top-[calc(50%-1.25rem)] lg:block" aria-hidden="true" />
              ) : null}
              <h3 className={`display text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] transition-colors duration-300 ${active === s.id ? "text-[#f7f6f3]" : "text-[#f7f6f3] lg:text-silver-2"}`}>{s.title}</h3>
              <p className="mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-night-muted"><time className={`mr-2 text-lamp tabular ${/\d/.test(s.time) ? "font-mono text-[0.86rem]" : "font-medium"}`}>{s.time}</time>{s.body}</p>
            </div>
            <div className="mt-7 lg:hidden">
              <Stage step={s.id} index={i} still />
            </div>
          </li>
        ))}
      </ol>
      <div className="relative hidden lg:block" aria-hidden="true">
        <div className="sticky top-[max(6rem,calc(50svh-16.5rem))]">
          <div className="mb-4 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span key={s.id} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= index ? "bg-lamp" : "bg-white/10"}`} />
            ))}
          </div>
          <Stage step={active} index={index} />
        </div>
      </div>
    </div>
  );
}

function Stage({ step, index, still = false }: { step: StepId; index: number; still?: boolean }) {
  const reduce = useReducedMotion();
  const calm = reduce || still;
  return (
    <div className="stage-pane relative flex flex-col overflow-hidden p-5 sm:p-6 lg:min-h-[27rem]">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5 text-[0.8rem]">
        <span className="font-medium text-[#f7f6f3]">Ridgeline Plumbing &amp; Heating</span>
        <span className="text-night-muted">Sample data</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={calm ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={calm ? undefined : { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.18 } }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 pt-5"
        >
          {step === "signal" && <SignalState />}
          {step === "reply" && <ReplyState />}
          {step === "ask" && <AskState />}
          {step === "route" && <RouteState />}
          {step === "owner" && <OwnerState />}
        </motion.div>
      </AnimatePresence>
      <Rail index={index} calm={calm} />
    </div>
  );
}

const RAIL = ["Call", "Reply", "Asked", "Booked", "Inbox"];
/** The persistent thread: one conversation, filling in as it resolves. */
function Rail({ index, calm }: { index: number; calm: boolean }) {
  return (
    <div className="mt-6 border-t border-white/[0.06] pt-4">
      <ol className="relative grid grid-cols-5">
        <span className="absolute left-[10%] right-[10%] top-[5px] h-px bg-white/10" aria-hidden="true" />
        <span
          className="absolute left-[10%] top-[5px] h-px bg-lamp transition-[width] duration-500 ease-out"
          style={{ width: `${index * 20}%` }}
          aria-hidden="true"
        />
        {RAIL.map((r, i) => (
          <li key={r} className="relative flex flex-col items-center gap-2 text-[0.72rem]">
            <span className={`relative z-10 size-[11px] rounded-full ${i === RAIL.length - 1 && i <= index ? "!bg-night-2" : i < index ? "bg-lamp" : i === index ? "bg-[#f7f6f3]" : "border border-white/20 bg-night-2"}`}>
              {i === RAIL.length - 1 && i <= index ? <LogoMark className="absolute left-1/2 top-1/2 size-[22px] -translate-x-[40%] -translate-y-1/2 text-[#f7f6f3]" /> : null}
              {i === index && !calm ? <motion.span layoutId="rail-halo" className="absolute -inset-[5px] rounded-full border border-lamp/60" /> : null}
            </span>
            <span className={i <= index ? "text-[#f7f6f3]" : "text-night-muted"}>{r}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const row = "flex items-center gap-3 rounded-[12px] bg-white/[0.035] px-4 py-3.5 text-[0.92rem]";

function SignalState() {
  const items = [
    { ch: "Call", who: "(512) 555-0148", what: "Missed, no voicemail", t: "6:42 PM", hot: true },
    { ch: "Web form", who: "J. Alvarez", what: "Quote: bathroom fan install", t: "6:31 PM" },
    { ch: "Text", who: "(512) 555-0193", what: "Do you service tankless units?", t: "6:18 PM" },
  ];
  return (
    <div>
      <p className="text-[0.8rem] text-night-muted">Waiting for a reply</p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.who} className={`${row} ${it.hot ? "ring-1 ring-lamp/40" : ""}`}>
            <span className={`w-[4.6rem] shrink-0 text-[0.74rem] font-medium ${it.hot ? "text-lamp" : "text-night-muted"}`}>{it.ch}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[#f7f6f3]">{it.who}</span>
              <span className="block truncate text-[0.8rem] text-night-muted">{it.what}</span>
            </span>
            <span className="font-mono text-[0.74rem] tabular text-night-muted">{it.t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[0.82rem] leading-relaxed text-night-muted">After hours, these usually wait until morning. By then, some have booked with someone else.</p>
    </div>
  );
}

function ReplyState() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[0.8rem]">
        <span className="text-night-muted">To (512) 555-0148</span>
        <span className="rounded-[6px] bg-white/[0.06] px-2 py-1 text-[#d4d6da]">Mode: autonomous</span>
      </div>
      <p className="max-w-[90%] rounded-[14px] rounded-bl-[5px] bg-[#25282d] px-4 py-3 text-[0.95rem] leading-snug text-[#eceae6]">
        Hi, this is Ridgeline Plumbing. Sorry we missed your call. What&rsquo;s going on? I can help get you on the schedule.
      </p>
      <div className="grid gap-2 pt-2 text-[0.8rem] sm:grid-cols-3">
        {[
          ["Assisted", "Drafts; you approve"],
          ["Escalation", "Routine only; you take the rest"],
          ["Autonomous", "Replies on its own"],
        ].map(([k, v]) => (
          <div key={k} className={`rounded-[10px] px-3 py-2.5 ${k === "Autonomous" ? "bg-[#f3f1ec] text-[#16171a]" : "bg-white/[0.035] text-night-muted"}`}>
            <span className="block font-medium">{k}</span>
            <span className="block text-[0.74rem] opacity-80">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskState() {
  const checks = [
    ["What's wrong", "Water heater leaking, garage"],
    ["How urgent", "Slow drip, not pooling"],
    ["Where", "78704 · in service area"],
  ];
  return (
    <div>
      <ul className="space-y-2">
        {checks.map(([k, v]) => (
          <li key={k} className={row}>
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#f3f1ec] text-[#111214]">
              <Check className="size-3" />
            </span>
            <span className="w-28 shrink-0 text-night-muted">{k}</span>
            <span className="text-[#f7f6f3]">{v}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-[12px] border border-dashed border-white/15 p-3.5 text-[0.82rem] leading-relaxed">
        <p className="font-medium text-[#f7f6f3]">Your rule</p>
        <p className="mt-1 text-night-muted">
          Pooling water or a gas smell → call the on-call tech now. Otherwise → offer the next open times.
        </p>
      </div>
      <p className="mt-4 text-[0.82rem] text-lamp">Routine, in area → offer times</p>
    </div>
  );
}

function RouteState() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.15fr_1fr]">
      <div className="pearl-card p-4">
        <p className="text-[0.74rem] font-medium text-[#55585e]">Booked · this conversation</p>
        <p className="mt-1 font-display text-[1.35rem] leading-tight tracking-[-0.02em]">Thu · 8:00&ndash;10:00 AM</p>
        <p className="mt-2 text-[0.8rem] text-[#2a2c30]">Dana M. · water heater, slow leak · 78704</p>
        <p className="mt-3 border-t border-[#d8d6d0] pt-2 text-[0.74rem] text-[#55585e]">On the calendar you connected. Reminder before the visit.</p>
      </div>
      <div className="rounded-[14px] bg-white/[0.035] p-4">
        <p className="text-[0.74rem] font-medium text-night-muted">If it had been an emergency</p>
        <p className="mt-1 text-[1rem] leading-snug text-[#f7f6f3]">Handed to Marco, on call</p>
        <p className="mt-2 text-[0.8rem] text-night-muted">Whole thread attached. BetterDesk tells the caller a person is calling them back.</p>
      </div>
      <p className="text-[0.78rem] text-night-muted sm:col-span-2">No calendar connection? It collects the request and hands the booking to your team. We confirm which applies on your demo call.</p>
    </div>
  );
}

function OwnerState() {
  const threads = [
    ["Dana M.", "Booked Thu 8–10 AM", "handled"],
    ["J. Alvarez", "Quote request · needs your price", "lamp"],
    ["(512) 555-0193", "Answered: yes, tankless units", "muted"],
    ["K. Whitfield", "Handed to you · billing question", "lamp"],
  ] as const;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[0.95rem] font-medium text-[#f7f6f3]">Inbox · last night</p>
        <p className="text-[0.8rem] text-lamp">2 need you</p>
      </div>
      <ul className="mt-3 divide-y divide-white/[0.06] rounded-[12px] bg-white/[0.03]">
        {threads.map(([who, what, tone]) => (
          <li key={who} className="grid grid-cols-[0.5rem_minmax(0,1fr)] items-baseline gap-x-3 px-3.5 py-3 text-[0.86rem] sm:grid-cols-[0.5rem_8rem_minmax(0,1fr)]">
            <span className={`size-2 shrink-0 rounded-full ${tone === "handled" ? "bg-handled-bright" : tone === "lamp" ? "bg-lamp" : "bg-white/25"}`} />
            <span className="truncate text-[#f7f6f3]">{who}</span>
            <span className="col-start-2 text-night-muted sm:col-start-3">{what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
