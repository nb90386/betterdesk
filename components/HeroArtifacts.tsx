import { Check } from "./NightDesk";
import { PLANS } from "@/lib/site";
import { CHANNELS } from "@/lib/sample";
import { computeRoi, usd, WEEKS_PER_MONTH, ROI_DEFAULTS } from "@/lib/roi";
import { LogoMark } from "./Logo";

/** Pricing hero object: a printed monthly receipt for the featured plan. Every line restates published plan copy. */
export function PlanReceipt() {
  const plan = PLANS.find((p) => p.featured) ?? PLANS[1];
  const lines = ["Setup and onboarding", "Calibration to your business", "Live human support", "No per-seat fees", "No annual contract"];
  return (
    <div className="relative mx-auto w-full max-w-[380px] lg:mr-0" aria-hidden="true">
      <div className="pearl-card relative overflow-hidden p-6">
        <div className="flex items-baseline justify-between border-b border-dashed border-[#b7b4ad] pb-3">
          <p className="font-display text-[1.2rem] font-[600] tracking-[-0.02em]">BetterDesk</p>
          <p className="text-[0.74rem] text-[#55585e]">Monthly · {plan.name}</p>
        </div>
        <ul className="mt-4 space-y-2.5 text-[0.88rem] text-[#2a2c30]">
          {lines.map((l) => (
            <li key={l} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span className="grid size-[18px] place-items-center rounded-full bg-[#111214] text-lamp">
                  <Check className="size-2.5" />
                </span>
                {l}
              </span>
              <span className="text-[0.78rem] text-[#55585e]">included</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline justify-between border-t border-[#111214] pt-3">
          <span className="text-[0.86rem] font-medium">Total</span>
          <span className="font-display text-[2rem] leading-none tracking-[-0.03em] tabular">
            ${plan.price}
            <span className="ml-1 font-sans text-[0.8rem] tracking-normal text-[#55585e]">/ month</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** How-it-works hero object: the setup call agenda. Restates CLAIMS_AUDIT-approved setup statements only. */
export function SetupAgenda() {
  const items = [
    ["Services, prices and policies", "What it's allowed to say"],
    ["Hours and service area", "When and where you work"],
    ["What counts as urgent", "Who gets the call, right away"],
    ["Your calendar", "Connect it where we can; otherwise hand off"],
    ["Reply mode", "We suggest starting in assisted"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:mr-0" aria-hidden="true">
      <div className="stage-pane p-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-[0.8rem]">
          <span className="font-medium text-[#f7f6f3]">Setup call · agenda</span>
          <span className="text-night-muted">With a person</span>
        </div>
        <ol className="mt-3 space-y-1.5">
          {items.map(([k, v], i) => (
            <li key={k} className="flex items-start gap-3 rounded-[10px] px-2 py-2 text-[0.86rem]">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] font-medium tabular ${i < 2 ? "bg-[#f3f1ec] text-[#111214]" : "border border-white/20 text-night-muted"}`}>
                {i < 2 ? <Check className="size-3" /> : i + 1}
              </span>
              <span>
                <span className="block text-[#f7f6f3]">{k}</span>
                <span className="block text-[0.78rem] text-night-muted">{v}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Platform hero object: every channel the plans list, converging on one inbox. Plan gating restates published pricing. */
export function ChannelBoard() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:mr-0" aria-hidden="true">
      <div className="nd-focal stage-pane grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
        <ul className="space-y-1.5">
          {CHANNELS.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-[10px] bg-white/[0.04] px-3 py-2 text-[0.84rem]">
              <span className="text-[#f7f6f3]">{c.label}</span>
              <span className={`text-[0.72rem] ${c.plan ? "text-lamp" : "text-night-muted"}`}>{c.plan ? "Growth and Scale" : "Every plan"}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-2 text-center">
          <svg viewBox="0 0 24 120" className="h-28 w-6" aria-hidden="true">
            {[8, 26, 44, 62, 80, 98].map((y) => (
              <path key={y} d={`M0 ${y + 6} C 14 ${y + 6}, 10 60, 24 60`} fill="none" stroke="rgb(244 169 71 / 0.45)" strokeWidth="1" />
            ))}
          </svg>
          <span className="grid size-12 place-items-center rounded-[14px] bg-[#f3f1ec]">
            <LogoMark className="size-7 text-[#111214]" />
          </span>
          <span className="text-[0.74rem] font-medium text-[#f7f6f3]">One inbox</span>
        </div>
      </div>
    </div>
  );
}

/** ROI hero object: the calculator's default assumptions, worked through on paper. */
export function FormulaCard() {
  const d = ROI_DEFAULTS;
  const r = computeRoi({ missedPerWeek: d.missedPerWeek, engageRate: d.engagePct / 100, bookRate: d.bookPct / 100, jobValue: d.jobValue, planPrice: 0 });
  const rows = [
    [`${d.missedPerWeek} a week`, "unanswered calls, texts and forms"],
    [`× ${WEEKS_PER_MONTH.toFixed(2)}`, "weeks in a month"],
    [`× ${d.engagePct}%`, "would reply to a fast text"],
    [`× ${d.bookPct}%`, "of those would book"],
    [`× ${usd(d.jobValue)}`, "for a typical job"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-[380px] lg:mr-0" aria-hidden="true">
      <div className="pearl-card p-6">
        <p className="text-[0.78rem] font-medium text-[#55585e]">The starting numbers, worked through</p>
        <ul className="mt-4 space-y-2">
          {rows.map(([k, v]) => (
            <li key={k} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 text-[0.86rem]">
              <span className="font-mono text-[#111214] tabular">{k}</span>
              <span className="text-[#55585e]">{v}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-[#111214] pt-3">
          <span className="text-[0.86rem] font-medium text-[#111214]">Projection</span>
          <span className="font-display text-[2rem] leading-none tracking-[-0.03em] text-[#111214] tabular">
            {usd(r.revenuePerMonth)}
            <span className="ml-1 font-sans text-[0.8rem] tracking-normal text-[#55585e]">/ month</span>
          </span>
        </div>
        <p className="mt-2 text-[0.76rem] text-[#55585e]">Change any of these below. It is a projection, not a promise.</p>
      </div>
    </div>
  );
}
