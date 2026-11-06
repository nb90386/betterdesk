"use client";

import { useId, useState } from "react";
import { computeRoi, usd, WEEKS_PER_MONTH } from "@/lib/roi";
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
  const [v, setV] = useState({ missedPerWeek: 6, engagePct: 40, bookPct: 30, jobValue: 250 });
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
    <div className="grid overflow-hidden rounded-[var(--radius-xl)] border border-rule bg-card shadow-[var(--shadow-lift)] lg:grid-cols-[1.1fr_1fr]">
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
                className={`press cursor-pointer rounded-full border px-3.5 py-2 text-[0.85rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${planId === p.id ? "border-ink bg-ink text-card" : "border-rule-strong text-ink-2 hover:border-ink/40"}`}
              >
                <input type="radio" name={`${uid}-plan`} value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} className="sr-only" />
                {p.name} · ${p.price}/mo
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="flex flex-col bg-night p-5 text-card sm:p-8" aria-live="polite">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-muted">Your projection</p>
        <p className="mt-3 font-display text-[clamp(2.6rem,2rem+2vw,3.6rem)] leading-none tracking-[-0.02em]">
          {usd(r.revenuePerMonth)}
          <span className="ml-2 font-sans text-[1rem] tracking-normal text-night-muted">/ month</span>
        </p>
        <p className="mt-2 text-[0.92rem] text-night-muted">
          from about <strong className="font-medium text-card">{r.bookingsPerMonth.toFixed(1)}</strong> extra bookings a month
        </p>

        <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] bg-night-rule">
          {[
            ["Per year", usd(r.revenuePerYear)],
            [`After ${plan.name} ($${plan.price})`, `${r.netPerMonth < 0 ? "−" : ""}${usd(Math.abs(r.netPerMonth))} / mo`],
            ["Conversations reached", `${r.engagedPerMonth.toFixed(1)} / mo`],
            ["Bookings to cover the plan", Number.isFinite(r.breakEvenBookings) ? String(r.breakEvenBookings) : "—"],
          ].map(([k, val]) => (
            <div key={k} className="bg-night-2 p-4">
              <dt className="text-[0.75rem] text-night-muted">{k}</dt>
              <dd className="mt-1 font-mono text-[1.05rem] text-card">{val}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 rounded-[var(--radius-md)] border border-night-rule p-4">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-muted">The formula</p>
          <p className="mt-2 font-mono text-[0.8rem] leading-relaxed text-card/90">
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
