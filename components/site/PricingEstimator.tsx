"use client";

import { useId, useState } from "react";

/**
 * Usage estimator for the PROPOSED plan. Responds on every input event (no debounce, no animation on
 * the numbers: they change many times a second while dragging and must stay readable). The math is the
 * published proposal: 500 businesses and 300 conversations included, top-ups in blocks of 250.
 */
const BASE = 249;
const INCLUDED = { research: 500, conversations: 300 };
const TOPUP = { research: 39, conversations: 35 };

export function PricingEstimator() {
  const uid = useId();
  const [research, setResearch] = useState(400);
  const [conversations, setConversations] = useState(120);
  const extraR = Math.max(0, Math.ceil((research - INCLUDED.research) / 250));
  const extraC = Math.max(0, Math.ceil((conversations - INCLUDED.conversations) / 250));
  const total = BASE + extraR * TOPUP.research + extraC * TOPUP.conversations;

  const slider = (id: string, label: string, value: number, set: (n: number) => void, max: number, step: number, included: number) => (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`${uid}-${id}`} className="font-[560]">{label}</label>
        <output htmlFor={`${uid}-${id}`} className="text-[1.0625rem] font-[600] tabular-nums">{value.toLocaleString()}</output>
      </div>
      <input
        id={`${uid}-${id}`}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="bd-range mt-2"
        style={{ "--fill": `${(value / max) * 100}%`, "--mark": `${(included / max) * 100}%` } as React.CSSProperties}
      />
      <p className="mt-1 text-[0.8125rem] text-muted">{included.toLocaleString()} included each month</p>
    </div>
  );

  return (
    <div className="paper grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_16rem] lg:gap-12">
      <div className="grid gap-7">
        {slider("r", "Businesses you’d have Scout check each month", research, setResearch, 2000, 25, INCLUDED.research)}
        {slider("c", "Inquiries and replies each month", conversations, setConversations, 1000, 10, INCLUDED.conversations)}
      </div>
      <div className="border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-live="polite">
        <p className="t-label">Estimated monthly cost (proposed)</p>
        <p className="mt-2 text-[2.75rem] font-[600] leading-none tracking-[-0.03em] tabular-nums">${total.toLocaleString()}</p>
        <ul className="mt-4 grid gap-1.5 text-[0.9063rem] tabular-nums text-ink-2">
          <li className="flex justify-between"><span>Workspace</span><span>${BASE}</span></li>
          <li className="flex justify-between"><span>{extraR} research top-up{extraR === 1 ? "" : "s"}</span><span>${extraR * TOPUP.research}</span></li>
          <li className="flex justify-between"><span>{extraC} conversation top-up{extraC === 1 ? "" : "s"}</span><span>${extraC * TOPUP.conversations}</span></li>
        </ul>
        <p className="mt-4 text-[0.8125rem] text-muted">Top-ups are optional. Without one, that work pauses at the limit; nothing is billed automatically.</p>
      </div>
    </div>
  );
}
