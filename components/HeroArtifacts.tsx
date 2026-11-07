import { Check } from "./NightDesk";
import { PLANS } from "@/lib/site";

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
