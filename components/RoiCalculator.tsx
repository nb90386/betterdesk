"use client";

import { useEffect, useId, useState } from "react";
import { animate, useMotionValue, useReducedMotion, useTransform, motion } from "motion/react";
import { computeRoi, usd, WEEKS_PER_MONTH, ROI_DEFAULTS } from "@/lib/roi";
import { PLANS } from "@/lib/site";

type Field = {
  key: "missedPerWeek" | "engagePct" | "bookPct" | "jobValue";
  label: string;
  help: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
};

const FIELDS: Field[] = [
  { key: "missedPerWeek", label: "Unanswered inquiries per week", help: "Missed calls, late texts and forms nobody got to quickly. Check your call log.", min: 0, max: 200, step: 1 },
  { key: "engagePct", label: "Share a fast reply would reach", help: "Of those, how many would reply to a text back? Some were spam or already sorted.", min: 0, max: 100, step: 1, suffix: "%" },
  { key: "bookPct", label: "Share of those that would book", help: "Your usual rate for turning a real conversation into a job.", min: 0, max: 100, step: 1, suffix: "%" },
  { key: "jobValue", label: "Average value of one job", help: "Revenue from a typical booking, not lifetime value.", min: 0, max: 20000, step: 5, prefix: "$" },
];

export function RoiCalculator() {
  const uid = useId();
  const [v, setV] = useState<{ missedPerWeek: number; engagePct: number; bookPct: number; jobValue: number }>({ ...ROI_DEFAULTS });
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [planId, setPlanId] = useState("growth");
  const plan = PLANS.find((p) => p.id === planId)!;

  const r = computeRoi({
    missedPerWeek: v.missedPerWeek,
    engageRate: v.engagePct / 100,
    bookRate: v.bookPct / 100,
    jobValue: v.jobValue,
    planPrice: plan.price,
  });

  const update = (f: Field, text: string) => {
    setRaw((x) => ({ ...x, [f.key]: text }));
    const n = Number(text);
    if (text.trim() !== "" && Number.isFinite(n) && n >= f.min && n <= f.max) setV((x) => ({ ...x, [f.key]: n }));
  };
  const invalid = (f: Field) => {
    const t = raw[f.key];
    if (t === undefined) return false;
    const n = Number(t);
    return t.trim() === "" || !Number.isFinite(n) || n < f.min || n > f.max;
  };

  return (
    <div className="grid overflow-hidden rounded-[var(--radius-xl)] border border-rule bg-card shadow-[var(--shadow-lift)] lg:grid-cols-[1fr_1.05fr]">
      <form className="space-y-7 p-5 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Your assumptions">
        {FIELDS.map((f) => {
          const id = `${uid}-${f.key}`;
          const bad = invalid(f);
          return (
            <div key={f.key}>
              <div className="flex items-end justify-between gap-4">
                <label htmlFor={id} className="text-[0.95rem] font-medium text-ink">
                  {f.label}
                </label>
                <div className={`flex items-center rounded-md border bg-paper px-2 ${bad ? "border-signal" : "border-rule-strong"} focus-within:border-ink`}>
                  {f.prefix ? <span className="text-[0.9rem] text-muted">{f.prefix}</span> : null}
                  <input
                    id={id}
                    inputMode="numeric"
                    className="w-20 bg-transparent py-1.5 text-right font-mono text-[0.95rem] text-ink outline-none"
                    value={raw[f.key] ?? String(v[f.key])}
                    onChange={(e) => update(f, e.target.value)}
                    onBlur={() => setRaw((x) => { const n = { ...x }; delete n[f.key]; return n; })}
                    aria-invalid={bad || undefined}
                    aria-describedby={`${id}-help${bad ? ` ${id}-err` : ""}`}
                  />
                  {f.suffix ? <span className="text-[0.9rem] text-muted">{f.suffix}</span> : null}
                </div>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.key === "jobValue" ? 2000 : f.max}
                step={f.step}
                value={Math.min(v[f.key], f.key === "jobValue" ? 2000 : f.max)}
                onChange={(e) => {
                  setRaw((x) => { const n = { ...x }; delete n[f.key]; return n; });
                  setV((x) => ({ ...x, [f.key]: Number(e.target.value) }));
                }}
                aria-label={`${f.label} slider`}
                className="bd-range mt-3 w-full"
              />
              <p id={`${id}-help`} className="mt-1.5 text-[0.8rem] leading-snug text-muted">
                {f.help}
              </p>
              {bad ? (
                <p id={`${id}-err`} className="mt-1 text-[0.8rem] text-signal" role="alert">
                  Enter a number from {f.prefix ?? ""}{f.min} to {f.prefix ?? ""}{f.max.toLocaleString()}{f.suffix ?? ""}.
                </p>
              ) : null}
            </div>
          );
        })}
        <fieldset>
          <legend className="text-[0.95rem] font-medium text-ink">Compare against</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLANS.map((p) => (
              <label
                key={p.id}
                className={`press cursor-pointer rounded-full border px-3.5 py-2 text-[0.85rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${planId === p.id ? "border-ink bg-ink text-[#f7f6f3]" : "border-rule-strong text-ink-2 hover:border-ink/40"}`}
              >
                <input type="radio" name={`${uid}-plan`} value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} className="sr-only" />
                {p.name} · ${p.price}/mo
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="on-night flex flex-col bg-[linear-gradient(180deg,#16181b,#0f1012)] p-5 sm:p-8">
        <p className="sr-only" aria-live="polite">
          Projection: {usd(r.revenuePerMonth)} a month from about {r.bookingsPerMonth.toFixed(1)} extra bookings.
        </p>
        <p className="text-[0.82rem] font-medium text-night-muted">One month of unanswered inquiries, with your numbers</p>
        <MonthDots
          total={v.missedPerWeek * WEEKS_PER_MONTH}
          reached={r.engagedPerMonth}
          booked={r.bookingsPerMonth}
          breakEven={r.breakEvenBookings}
          planName={plan.name}
        />
        <div className="mt-7 border-t border-white/[0.07] pt-6" aria-hidden="true">
          <p className="font-display text-[clamp(2.6rem,2rem+2vw,3.6rem)] leading-none tracking-[-0.03em] text-[#f7f6f3] tabular">
            <AnimatedUsd value={r.revenuePerMonth} />
            <span className="ml-2 font-sans text-[1rem] tracking-normal text-night-muted">/ month</span>
          </p>
          <p className="mt-2 text-[0.92rem] text-night-muted">
            from about <strong className="font-medium text-[#f7f6f3]">{r.bookingsPerMonth.toFixed(1)}</strong> extra bookings a month
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[0.82rem]">
          {[
            ["Per year", usd(r.revenuePerYear)],
            [`After ${plan.name} ($${plan.price})`, `${r.netPerMonth < 0 ? "−" : ""}${usd(Math.abs(r.netPerMonth))} / mo`],
            ["Conversations reached", `${r.engagedPerMonth.toFixed(1)} / mo`],
            ["Bookings to cover the plan", Number.isFinite(r.breakEvenBookings) ? String(r.breakEvenBookings) : "—"],
          ].map(([k, val]) => (
            <div key={k} className="border-t border-white/[0.07] pt-3">
              <dt className="text-night-muted">{k}</dt>
              <dd className="mt-1 text-[1.05rem] font-medium text-[#f7f6f3] tabular">{val}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-[12px] bg-white/[0.035] p-4">
          <p className="text-[0.78rem] font-medium text-night-muted">The formula</p>
          <p className="mt-1.5 font-mono text-[0.8rem] leading-relaxed text-[#d4d6da] tabular">
            {v.missedPerWeek} / wk × {WEEKS_PER_MONTH.toFixed(2)} wks × {v.engagePct}% × {v.bookPct}% × {usd(v.jobValue)}
            <br />= {usd(r.revenuePerMonth)} / month
          </p>
        </div>
        <p className="mt-auto pt-6 text-[0.78rem] leading-relaxed text-night-muted">
          This is a projection from the numbers you entered, not a promise or a measured result. It ignores repeat business,
          cancellations, and the cost of your team&rsquo;s time. Bring your real numbers to a demo and we&rsquo;ll sanity-check them with you.
        </p>
      </div>
    </div>
  );
}

/** Revenue figure that eases to each new value (instant under reduced motion). */
function AnimatedUsd({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (n) => usd(n));
  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [value, reduce, mv]);
  return <motion.span>{text}</motion.span>;
}

const COLS = 20;
const CAP = 300;
const STATE = {
  booked: { label: "would book", fill: "#f4a947" },
  reached: { label: "would reply, no booking", fill: "#e3d9c8" },
  missed: { label: "no reply", fill: "#736e65" },
} as const;
type DotState = keyof typeof STATE;

/**
 * Unit chart: one mark per inquiry in a month. Encoding is nested and ordinal
 * (booked ⊂ reached ⊂ all), carried by shape as well as color: filled, ring, small dot.
 * Palette validated against #16181b with the dataviz validator (CVD ΔE 14.3, normal 15.3, contrast ≥ 3:1).
 */
function MonthDots({ total, reached, booked, breakEven, planName }: { total: number; reached: number; booked: number; breakEven: number; planName: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = Math.round(total);
  const shown = Math.min(n, CAP);
  const nb = Math.min(Math.round(booked), shown);
  const nr = Math.min(Math.round(reached), shown);
  const rows = Math.max(1, Math.ceil(shown / COLS));
  const cell = 16;
  const top = 26;
  const w = COLS * cell;
  const h = top + rows * cell;
  const be = Number.isFinite(breakEven) ? breakEven : 0;
  const stateOf = (k: number): DotState => (k < nb ? "booked" : k < nr ? "reached" : "missed");
  const bracketEnd = Math.min(be, nb, COLS);
  const counts = { booked: nb, reached: Math.max(0, nr - nb), missed: Math.max(0, shown - nr) };

  return (
    <figure className="m-0 mt-4">
      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`${n} unanswered inquiries a month: about ${nr} would reply and about ${nb} would book. ${be} bookings cover the ${planName} plan.`}
          onPointerLeave={() => setHover(null)}
        >
          {be > 0 && bracketEnd > 0 ? (
            <g aria-hidden="true">
              <path d={`M2 ${top - 8} v-5 H${bracketEnd * cell - 2} v5`} fill="none" stroke="#f4a947" strokeWidth="1" strokeOpacity="0.7" />
              <text x="2" y={top - 17} fill="#a4a8ae" fontSize="9">
                {nb >= be ? `First ${be} booking${be === 1 ? "" : "s"} cover ${planName}` : `${planName} needs ${be} bookings; this projects ${nb}`}
              </text>
            </g>
          ) : null}
          {Array.from({ length: shown }, (_, k) => {
            const st = stateOf(k);
            const cx = (k % COLS) * cell + cell / 2;
            const cy = top + Math.floor(k / COLS) * cell + cell / 2;
            return (
              <g key={k} onPointerEnter={() => setHover(k)}>
                <rect x={cx - cell / 2} y={cy - cell / 2} width={cell} height={cell} fill="transparent" />
                {st === "booked" ? <circle cx={cx} cy={cy} r={5} fill={STATE.booked.fill} /> : null}
                {st === "reached" ? <circle cx={cx} cy={cy} r={4.2} fill="none" stroke={STATE.reached.fill} strokeWidth="1.5" /> : null}
                {st === "missed" ? <circle cx={cx} cy={cy} r={2.4} fill={STATE.missed.fill} /> : null}
                {hover === k ? <circle cx={cx} cy={cy} r={7.5} fill="none" stroke="#f7f6f3" strokeWidth="1" /> : null}
              </g>
            );
          })}
        </svg>
        {hover !== null ? (
          <p className="pointer-events-none absolute right-0 top-0 rounded-[6px] bg-[#f3f1ec] px-2 py-1 text-[0.72rem] font-medium text-[#111214] tabular" aria-hidden="true">
            Inquiry {hover + 1} · {STATE[stateOf(hover)].label}
          </p>
        ) : null}
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-[#d4d6da]">
        <span className="inline-flex items-center gap-2"><svg viewBox="0 0 12 12" className="size-3" aria-hidden="true"><circle cx="6" cy="6" r="5" fill={STATE.booked.fill} /></svg>{counts.booked} would book</span>
        <span className="inline-flex items-center gap-2"><svg viewBox="0 0 12 12" className="size-3" aria-hidden="true"><circle cx="6" cy="6" r="4.2" fill="none" stroke={STATE.reached.fill} strokeWidth="1.5" /></svg>{counts.reached} would reply, no booking</span>
        <span className="inline-flex items-center gap-2"><svg viewBox="0 0 12 12" className="size-3" aria-hidden="true"><circle cx="6" cy="6" r="2.4" fill={STATE.missed.fill} /></svg>{counts.missed} no reply</span>
        {n > CAP ? <span className="text-night-muted">Showing the first {CAP} of {n}.</span> : null}
      </figcaption>
    </figure>
  );
}
