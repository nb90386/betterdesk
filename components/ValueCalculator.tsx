"use client";

import { useId, useState } from "react";
import { ROI_DEFAULTS, computeRoi, usd } from "@/lib/roi";
import { PLANS, type PlanId } from "@/lib/site";

type Field = { key: "missed" | "engage" | "book" | "value"; label: string; help: string; min: number; max: number; step: number; fmt: (n: number) => string };

const FIELDS: Field[] = [
  { key: "missed", label: "Calls, texts and forms you miss or answer late, per week", help: "Check your phone's missed-call list for a normal week.", min: 0, max: 60, step: 1, fmt: (n) => `${n}` },
  { key: "engage", label: "Of those, how many would answer a quick text back", help: "Some were spam or already sorted. Be conservative.", min: 0, max: 100, step: 5, fmt: (n) => `${n}%` },
  { key: "book", label: "Of the people who answer, how many book", help: "Your usual rate when you do get them on the phone.", min: 0, max: 100, step: 5, fmt: (n) => `${n}%` },
  { key: "value", label: "Average value of one job or appointment", help: "Revenue, not profit.", min: 0, max: 2000, step: 10, fmt: (n) => usd(n) },
];

export function ValueCalculator({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  const [v, setV] = useState({ missed: ROI_DEFAULTS.missedPerWeek, engage: ROI_DEFAULTS.engagePct, book: ROI_DEFAULTS.bookPct, value: ROI_DEFAULTS.jobValue });
  const [plan, setPlan] = useState<PlanId>("starter");
  const price = PLANS.find((p) => p.id === plan)!.price;
  const r = computeRoi({ missedPerWeek: v.missed, engageRate: v.engage / 100, bookRate: v.book / 100, jobValue: v.value, planPrice: price });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
      <div className="space-y-7 lg:col-span-7">
        {FIELDS.map((f) => {
          const val = v[f.key];
          const fill = `${((val - f.min) / (f.max - f.min)) * 100}%`;
          return (
            <div key={f.key}>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${uid}-${f.key}`} className="text-[0.9375rem] font-[550] leading-snug">{f.label}</label>
                <output htmlFor={`${uid}-${f.key}`} className="tabular shrink-0 text-[1.125rem] font-semibold">{f.fmt(val)}</output>
              </div>
              <input
                id={`${uid}-${f.key}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={val}
                onChange={(e) => setV((x) => ({ ...x, [f.key]: Number(e.target.value) }))}
                className="bd-range mt-2"
                style={{ ["--fill" as string]: fill }}
                aria-describedby={`${uid}-${f.key}-help`}
              />
              {!compact ? <p id={`${uid}-${f.key}-help`} className="t-small text-muted">{f.help}</p> : <span id={`${uid}-${f.key}-help`} className="sr-only">{f.help}</span>}
            </div>
          );
        })}
        <fieldset>
          <legend className="text-[0.9375rem] font-[550]">Compare against</legend>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {PLANS.map((p) => (
              <label key={p.id} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
                <input type="radio" name={`${uid}-plan`} value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} className="h-4 w-4 accent-[var(--color-ink)]" />
                {p.name} <span className="text-muted">${p.price}/mo</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-5" aria-live="polite">
        <div className="border-t-2 border-ink pt-5">
          <p className="t-label">A rough monthly picture</p>
          <p className="mt-3 text-[clamp(2.6rem,1.8rem+2.4vw,3.75rem)] font-semibold leading-none tracking-[-0.035em] tabular [font-stretch:92%]">{usd(r.revenuePerMonth)}</p>
          <p className="mt-2 text-[1rem] text-ink-2">
            in bookings from about <strong className="font-semibold">{r.bookingsPerMonth.toFixed(1)}</strong> more appointments a month
          </p>
          <dl className="mt-6 divide-y divide-rule border-y border-rule text-[0.9375rem]">
            <div className="flex justify-between py-3"><dt className="text-ink-2">People who answer the text</dt><dd className="tabular">{r.engagedPerMonth.toFixed(1)} / mo</dd></div>
            <div className="flex justify-between py-3"><dt className="text-ink-2">Plan cost</dt><dd className="tabular">{usd(price)} / mo</dd></div>
            <div className="flex justify-between py-3"><dt className="text-ink-2">Bookings to cover the plan</dt><dd className="tabular">{Number.isFinite(r.breakEvenBookings) ? r.breakEvenBookings : "n/a"}</dd></div>
          </dl>
          <p className="t-small mt-4 text-muted">
            Math: {v.missed} a week × 4.33 weeks × {v.engage}% answer × {v.book}% book × {usd(v.value)}. This is an illustration from your own numbers, not a promise of results. Plan prices shown are the proposed prices.
          </p>
        </div>
      </div>
    </div>
  );
}
