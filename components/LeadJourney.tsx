"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SCENARIOS, type JourneyCard, type Message, type Tone } from "@/lib/sample";
import { CheckIcon } from "./HeroScene";

const STEP_MS = 3400;

export const toneClass: Record<Tone, string> = {
  signal: "bg-signal-soft text-signal border-signal/25",
  amber: "bg-amber-soft text-amber border-amber/25",
  handled: "bg-handled-soft text-handled border-handled/25",
  muted: "bg-paper-2 text-muted border-rule",
  ink: "bg-ink text-card border-ink",
};

export function LeadJourney({ scenarioIds, compact = false }: { scenarioIds?: string[]; compact?: boolean }) {
  const scenarios = scenarioIds ? SCENARIOS.filter((s) => scenarioIds.includes(s.id)) : SCENARIOS;
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [mode, setMode] = useState<"with" | "without">("with");
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const threadRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const steps = scenario[mode];
  const i = Math.min(idx, steps.length - 1);
  const step = steps[i];
  const atEnd = i === steps.length - 1;

  const messages: (Message & { key: string })[] = steps
    .slice(0, i + 1)
    .flatMap((s, si) => (s.messages ?? []).map((m, mi) => ({ ...m, key: `${mode}-${si}-${mi}` })));
  const card = [...steps.slice(0, i + 1)].reverse().find((s) => s.card)?.card;

  // Autoplay: advance on an interval, stop at the last step.
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setIdx((v) => {
        if (v >= steps.length - 1) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(t);
  }, [playing, steps.length]);

  // Keep the newest message in view inside the phone only (never scroll the page).
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [i, mode, scenarioId, reduce]);

  const go = (n: number) => {
    setPlaying(false);
    setIdx(Math.max(0, Math.min(steps.length - 1, n)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("[role=tablist]")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    }
  };

  return (
    <section
      aria-label="Interactive walkthrough: how an inquiry becomes a booking"
      className="overflow-hidden rounded-[var(--radius-xl)] border border-rule bg-card/70 shadow-[var(--shadow-card)]"
      onKeyDown={onKeyDown}
    >
      {/* Top bar: scenario + with/without */}
      <div className="flex flex-col gap-4 border-b border-rule px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        {scenarios.length > 1 ? (
          <div role="tablist" aria-label="Scenario" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0">
            {scenarios.map((s) => {
              const active = s.id === scenario.id;
              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`${uid}-tab-${s.id}`}
                  type="button"
                  aria-selected={active}
                  aria-controls={`${uid}-panel`}
                  onClick={() => {
                    setScenarioId(s.id);
                    setIdx(0);
                    setPlaying(false);
                  }}
                  onKeyDown={(e) => {
                    const at = scenarios.findIndex((x) => x.id === s.id);
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const next = scenarios[(at + (e.key === "ArrowRight" ? 1 : scenarios.length - 1)) % scenarios.length];
                      setScenarioId(next.id);
                      setIdx(0);
                      setPlaying(false);
                      (e.currentTarget.parentElement?.querySelectorAll("button")[scenarios.indexOf(next)] as HTMLButtonElement | undefined)?.focus();
                    }
                  }}
                  tabIndex={active ? 0 : -1}
                  className="press relative shrink-0 rounded-full px-3.5 py-2 text-left text-[0.85rem] text-ink-2 hover:text-ink aria-selected:text-card"
                >
                  {active ? (
                    <motion.span layoutId={`${uid}-scn`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 520, damping: 42 }} />
                  ) : null}
                  <span className="relative">
                    {s.name}
                    <span className={`ml-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] ${active ? "text-card/70" : "text-faint"}`}>{s.industry}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[0.95rem] font-medium text-ink">
            {scenario.name} <span className="ml-2 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-muted">{scenario.industry}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="sample-tag">Illustration<span className="hidden sm:inline"> · sample data</span></span>
          <div className="inline-flex rounded-full border border-rule-strong bg-paper p-1" role="group" aria-label="Compare outcomes">
            {(["without", "with"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setIdx(0);
                  setPlaying(false);
                }}
                className={`press relative whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8rem] font-medium ${mode === m ? "text-card" : "text-muted hover:text-ink"}`}
              >
                {mode === m ? (
                  <motion.span
                    layoutId={`${uid}-mode`}
                    className={`absolute inset-0 rounded-full ${m === "with" ? "bg-handled" : "bg-signal"}`}
                    transition={{ type: "spring", stiffness: 520, damping: 42 }}
                  />
                ) : null}
                <span className="relative">{m === "with" ? "With BetterDesk" : "Without"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id={`${uid}-panel`} {...(scenarios.length > 1 ? { role: "tabpanel", "aria-labelledby": `${uid}-tab-${scenario.id}` } : {})} className={`grid gap-0 ${compact ? "lg:grid-cols-[1fr_1.05fr]" : "lg:grid-cols-[280px_1fr_1fr]"}`}>
        {/* Step list */}
        <ol className={`border-rule ${compact ? "hidden" : "hidden border-r lg:block"} max-h-[560px] overflow-y-auto p-3`} aria-label="Steps">
          {steps.map((s, si) => (
            <li key={`${mode}-${si}`}>
              <button
                type="button"
                onClick={() => go(si)}
                aria-current={si === i ? "step" : undefined}
                className={`press group flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left ${si === i ? "bg-paper-2" : "hover:bg-paper-2/60"}`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem] ${
                    si < i ? "border-ink bg-ink text-card" : si === i ? (mode === "with" ? "border-handled text-handled" : "border-signal text-signal") : "border-rule-strong text-faint"
                  }`}
                >
                  {si + 1}
                </span>
                <span>
                  <span className={`block text-[0.88rem] leading-snug ${si === i ? "font-medium text-ink" : "text-ink-2"}`}>{s.label}</span>
                  <span className="font-mono text-[0.6875rem] text-faint">{s.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* Phone */}
        <div className="relative flex items-center justify-center bg-paper-2/50 px-4 py-6 sm:px-8 sm:py-8">
          <div className="w-full max-w-[340px] rounded-[34px] bg-ink p-2 shadow-[var(--shadow-device)]">
            <div className="overflow-hidden rounded-[27px] bg-card">
              <div className="flex items-center justify-between border-b border-rule px-5 pb-3 pt-4">
                <div>
                  <p className="text-[0.82rem] font-medium text-ink">{mode === "with" ? scenario.business : scenario.customer}</p>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">{scenario.channel}</p>
                </div>
                <span className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] ${toneClass[step.status.tone]}`}>
                  {step.status.text}
                </span>
              </div>
              <div ref={threadRef} className="h-[270px] space-y-2 overflow-y-auto px-4 py-4 sm:h-[340px]" aria-label="Conversation" role="log">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.key}
                      initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Bubble m={m} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {messages.length === 0 ? <p className="pt-24 text-center text-[0.8rem] text-faint">No messages. Nobody replied.</p> : null}
              </div>
            </div>
          </div>
        </div>

        {/* Context panel */}
        <div className="flex flex-col border-t border-rule p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div aria-live="polite" className="min-h-[160px] sm:min-h-[200px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${scenario.id}-${mode}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">
                  Step {i + 1} of {steps.length} · {step.time}
                </p>
                <h3 className="mt-2 font-display text-[1.7rem] leading-tight tracking-[-0.02em] text-ink">{step.label}</h3>
                <p className="mt-2 max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-2">{step.note}</p>
                {step.rule ? (
                  <div className="mt-4 rounded-[var(--radius-md)] border border-dashed border-rule-strong bg-paper px-4 py-3">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">Your rule</p>
                    <p className="mt-1 text-[0.88rem] leading-snug text-ink">{step.rule}</p>
                  </div>
                ) : null}
                {card ? <JourneyCardView card={card} /> : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-auto pt-6">
            <div className="mb-4 flex gap-1" aria-hidden="true">
              {steps.map((_, si) => (
                <span
                  key={si}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${si <= i ? (mode === "with" ? "bg-handled" : "bg-signal") : "bg-rule"}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CtlButton onClick={() => go(i - 1)} disabled={i === 0} label="Previous step">
                <path d="M10 3.5 5.5 8l4.5 4.5" />
              </CtlButton>
              <button
                type="button"
                onClick={() => {
                  if (atEnd) {
                    setIdx(0);
                    setPlaying(true);
                  } else setPlaying((p) => !p);
                }}
                className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.9rem] font-medium text-card hover:bg-ink-2"
              >
                {playing ? "Pause" : atEnd ? "Replay" : i === 0 ? "Play walkthrough" : "Resume"}
              </button>
              <CtlButton onClick={() => go(i + 1)} disabled={atEnd} label="Next step">
                <path d="M6 3.5 10.5 8 6 12.5" />
              </CtlButton>
              <span className="ml-auto font-mono text-[0.72rem] text-muted">
                {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 hidden text-[0.75rem] text-faint sm:block">Tip: use the ← → keys to step through.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtlButton({ onClick, disabled, label, children }: { onClick: () => void; disabled?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="press grid size-11 place-items-center rounded-full border border-rule-strong bg-card text-ink hover:border-ink/40 disabled:opacity-40"
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

export function Bubble({ m }: { m: Message }) {
  if (m.from === "system") {
    return (
      <p className="mx-auto w-fit rounded-full bg-paper-2 px-3 py-1 text-center font-mono text-[0.6875rem] text-muted">
        {m.text}
        {m.meta ? ` · ${m.meta}` : ""}
      </p>
    );
  }
  const mine = m.from === "desk" || m.from === "staff";
  return (
    <div className={`flex flex-col ${mine ? "items-start" : "items-end"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[0.84rem] leading-snug ${
          mine ? (m.from === "staff" ? "rounded-bl-md border border-amber/30 bg-amber-soft text-ink" : "rounded-bl-md bg-paper-2 text-ink") : "rounded-br-md bg-ink text-card"
        }`}
      >
        {m.text}
      </p>
      <span className="mt-0.5 px-1 font-mono text-[0.6rem] text-faint">
        {m.from === "desk" ? "BetterDesk" : m.from === "staff" ? "Your team" : "Customer"}
        {m.meta ? ` · ${m.meta}` : ""}
      </span>
    </div>
  );
}

function JourneyCardView({ card }: { card: JourneyCard }) {
  if (card.kind === "booking")
    return (
      <div className="relative mt-5 overflow-hidden rounded-[var(--radius-md)] border border-handled/25 bg-card p-4 shadow-[var(--shadow-lift)]">
        <span className="absolute inset-y-0 left-0 w-1 bg-handled" aria-hidden="true" />
        <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-handled">
          <CheckIcon /> On your calendar
        </p>
        <p className="mt-1 text-[1rem] font-medium text-ink">{card.when}</p>
        <p className="text-[0.85rem] text-ink-2">{card.title}</p>
        <p className="font-mono text-[0.7rem] text-muted">{card.detail}</p>
      </div>
    );
  if (card.kind === "handoff")
    return (
      <div className="mt-5 rounded-[var(--radius-md)] border border-amber/30 bg-amber-soft/60 p-4">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-amber">Handed to {card.to}</p>
        <p className="mt-1 text-[0.95rem] font-medium text-ink">{card.title}</p>
        <p className="text-[0.85rem] text-ink-2">{card.detail}</p>
      </div>
    );
  if (card.kind === "recap")
    return (
      <div className="mt-5 rounded-[var(--radius-md)] bg-ink p-4 text-card">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-muted">What you see</p>
        <ul className="mt-2 space-y-1.5">
          {card.lines.map((l) => (
            <li key={l} className="flex items-start gap-2 text-[0.88rem]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-handled-bright" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-rule bg-paper-2 p-4">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-signal">Outcome</p>
      <p className="mt-1 text-[0.95rem] font-medium text-ink">{card.title}</p>
      <p className="text-[0.85rem] text-muted">{card.detail}</p>
    </div>
  );
}
