"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { BUSINESS_KINDS, PAINS, STEP_FIELDS, formatReview, validateReview, type ReviewErrors, type ReviewInput } from "@/lib/lead/review";
import { CONTACT_EMAIL } from "@/lib/site";

type Phase = { kind: "editing" } | { kind: "sending" } | { kind: "sent"; id: string } | { kind: "blocked"; message: string } | { kind: "failed"; message: string };
const EMPTY: ReviewInput = { business: "", website: "", serviceArea: "", kind: "Commercial cleaning", name: "", email: "", phone: "", pain: "", note: "", heardFrom: "", consent: false };
const ENTER = { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const };

export function ReviewForm() {
  const uid = useId();
  const reduce = useReducedMotionSafe();
  const [v, setV] = useState<ReviewInput>(EMPTY);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [step, setStep] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<Phase>({ kind: "editing" });
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const requestId = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    requestId.current = crypto.randomUUID();
    const q = new URLSearchParams(window.location.search);
    const a: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) {
      const x = q.get(k);
      if (x) a[k] = x.slice(0, 80);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the landing URL after mount
    setAttribution(a);
  }, []);

  const id = (k: keyof ReviewInput) => `${uid}-${k}`;
  const set = (k: keyof ReviewInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((x) => ({ ...x, [k]: val }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const focusFirst = (errs: ReviewErrors) => {
    const first = (STEP_FIELDS.flat() as (keyof ReviewInput)[]).find((k) => errs[k]);
    if (first) document.getElementById(id(first))?.focus();
  };

  const next = () => {
    const errs = validateReview(v, 0);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs);
    setStep(1);
    requestAnimationFrame(() => document.getElementById(id("name"))?.focus());
  };

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 0) return next();
    const errs = validateReview(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      if (STEP_FIELDS[0].some((k) => errs[k])) setStep(0);
      return requestAnimationFrame(() => focusFirst(errs));
    }
    setPhase({ kind: "sending" });
    try {
      const res = await fetch("/api/review-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v, attribution, startedAt: startedAt.current, requestId: requestId.current, company_url: (document.getElementById(id("business") + "-hp") as HTMLInputElement | null)?.value ?? "" }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok) setPhase({ kind: "sent", id: data.id });
      else if (data?.code === "delivery_not_configured") setPhase({ kind: "blocked", message: data.message });
      else if (data?.code === "invalid_input" && data.errors) {
        setErrors(data.errors);
        setPhase({ kind: "editing" });
        requestAnimationFrame(() => focusFirst(data.errors));
        return;
      } else setPhase({ kind: "failed", message: data?.message ?? "We couldn't send that. Please try again or email us." });
    } catch {
      setPhase({ kind: "failed", message: "You seem to be offline. Your answers are still here; try again when you're connected." });
    }
    requestAnimationFrame(() => heading.current?.focus());
  };

  const mail = (() => {
    const m = formatReview(v, attribution, new Date().toISOString(), "by-email");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.text)}`;
  })();

  if (phase.kind === "sent" || phase.kind === "blocked") {
    return (
      <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: ENTER }} className="paper p-6 sm:p-8" role="status">
        <h2 ref={heading} tabIndex={-1} className="t-title outline-none">
          {phase.kind === "sent" ? "Your request is in." : "This preview can’t deliver requests yet."}
        </h2>
        {phase.kind === "sent" ? (
          <>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              It went to the BetterDesk request inbox as <span className="font-[600]">{phase.id.slice(0, 8)}</span>. A person reads every one. We reply to {v.email} after looking at {v.website ? "your site" : "your answers"}; we don’t promise a time on this early-access preview.
            </p>
            <p className="mt-3 text-[0.9375rem] text-muted">Nothing was added to any mailing list.</p>
          </>
        ) : (
          <>
            <p className="mt-4 max-w-[54ch] text-ink-2">{phase.message} Your answers are still in this page. You can send the same request by email instead:</p>
            <a href={mail} className="press mt-5 inline-flex min-h-12 items-center rounded-[var(--radius-sm)] bg-ink px-5 font-[560] text-stone hover:bg-ink-2">
              Email this request
            </a>
            <p className="mt-3 text-[0.875rem] text-muted">Opens your email app with everything filled in, addressed to {CONTACT_EMAIL}.</p>
            <button type="button" onClick={() => setPhase({ kind: "editing" })} className="link mt-4 min-h-11 text-[0.9375rem] font-[560]">
              Back to the form
            </button>
          </>
        )}
      </motion.div>
    );
  }

  const field = (k: keyof ReviewInput, label: string, opts: { type?: string; hint?: string; auto?: string; optional?: boolean; placeholder?: string } = {}) => (
    <div>
      <label htmlFor={id(k)} className="flex items-baseline justify-between text-[0.9375rem] font-[560]">
        {label}
        {opts.optional ? <span className="text-[0.8125rem] font-[450] text-muted">Optional</span> : null}
      </label>
      {opts.hint ? <p id={`${id(k)}-hint`} className="mt-0.5 text-[0.8125rem] text-muted">{opts.hint}</p> : null}
      <input
        id={id(k)}
        name={k}
        type={opts.type ?? "text"}
        autoComplete={opts.auto}
        placeholder={opts.placeholder}
        value={v[k] as string}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={[opts.hint ? `${id(k)}-hint` : "", errors[k] ? `${id(k)}-err` : ""].filter(Boolean).join(" ") || undefined}
        className="field mt-1.5"
      />
      {errors[k] ? <p id={`${id(k)}-err`} className="mt-1.5 text-[0.875rem] text-danger">{errors[k]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="paper p-6 sm:p-8" aria-labelledby={`${uid}-title`}>
      <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-4">
        <h2 id={`${uid}-title`} ref={heading} tabIndex={-1} className="text-[1.25rem] font-[600] tracking-[-0.015em] outline-none">
          {step === 0 ? "About your business" : "How to reach you"}
        </h2>
        <p className="text-[0.8125rem] tabular-nums text-muted">Step {step + 1} of 2</p>
      </div>

      {/* Hidden from people; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("business") + "-hp"}>Company URL</label>
        <input id={id("business") + "-hp"} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: step === 1 ? 16 : -16 }}
          animate={{ opacity: 1, x: 0, transition: ENTER }}
          exit={{ opacity: 0, x: step === 1 ? -12 : 12, transition: { duration: 0.16 } }}
          className="mt-6 grid gap-5"
        >
          {step === 0 ? (
            <>
              {field("business", "Business name", { auto: "organization" })}
              {field("website", "Website", { type: "url", auto: "url", optional: true, placeholder: "clearlinecleaning.com", hint: "We’ll read your public pages for the visibility part of the review." })}
              {field("serviceArea", "Where you clean", { placeholder: "Central and east Denver" })}
              <div>
                <label htmlFor={id("kind")} className="text-[0.9375rem] font-[560]">Type of business</label>
                <select id={id("kind")} value={v.kind} onChange={set("kind")} className="field mt-1.5">
                  {BUSINESS_KINDS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {field("name", "Your name", { auto: "name" })}
                {field("email", "Work email", { type: "email", auto: "email" })}
              </div>
              {field("phone", "Phone", { type: "tel", auto: "tel", optional: true })}
              <fieldset aria-describedby={errors.pain ? `${id("pain")}-err` : undefined}>
                <legend className="text-[0.9375rem] font-[560]">What gets in the way most?</legend>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2" id={id("pain")} tabIndex={-1}>
                  {PAINS.map((p) => (
                    <label key={p.id} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] border px-3 text-[0.9375rem] transition-colors ${v.pain === p.id ? "border-ink bg-surface" : "border-rule-strong hover:border-ink-2"}`}>
                      <input type="radio" name="pain" value={p.id} checked={v.pain === p.id} onChange={set("pain")} className="h-4 w-4 accent-ink" />
                      {p.label}
                    </label>
                  ))}
                </div>
                {errors.pain ? <p id={`${id("pain")}-err`} className="mt-1.5 text-[0.875rem] text-danger">{errors.pain}</p> : null}
              </fieldset>
              <div>
                <label htmlFor={id("note")} className="flex items-baseline justify-between text-[0.9375rem] font-[560]">
                  Anything we should know
                  <span className="text-[0.8125rem] font-[450] text-muted">Optional</span>
                </label>
                <textarea id={id("note")} rows={3} value={v.note} onChange={set("note")} aria-invalid={errors.note ? true : undefined} className="field mt-1.5 min-h-24 resize-y" />
                {errors.note ? <p className="mt-1.5 text-[0.875rem] text-danger">{errors.note}</p> : null}
              </div>
              {field("heardFrom", "How did you hear about us?", { optional: true })}
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
                  <input id={id("consent")} type="checkbox" checked={v.consent} onChange={set("consent")} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${id("consent")}-err` : undefined} className="mt-1 h-4 w-4 accent-ink" />
                  <span>BetterDesk may contact me about this request. Nothing else, and no mailing list.</span>
                </label>
                {errors.consent ? <p id={`${id("consent")}-err`} className="mt-1.5 text-[0.875rem] text-danger">{errors.consent}</p> : null}
              </div>
              {Object.keys(attribution).length ? (
                <p className="text-[0.8125rem] text-muted">Sent with your request: {Object.entries(attribution).map(([k, x]) => `${k}=${x}`).join(", ")} (from the link you arrived on).</p>
              ) : null}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {phase.kind === "failed" ? (
        <p role="alert" className="mt-5 rounded-[8px] bg-danger-wash px-3.5 py-3 text-[0.9375rem] text-danger">
          {phase.message} <a href={mail} className="link font-[560]">Email it instead</a>.
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
        {step === 1 ? (
          <button type="button" onClick={() => setStep(0)} className="link min-h-11 font-[560]">
            Back
          </button>
        ) : null}
        <button type="submit" disabled={phase.kind === "sending"} className="press ml-auto inline-flex min-h-12 items-center rounded-[var(--radius-sm)] bg-ink px-5 font-[560] text-stone hover:bg-ink-2 disabled:opacity-60">
          {step === 0 ? "Continue" : phase.kind === "sending" ? "Sending…" : "Send request"}
        </button>
      </div>
      <p className="mt-4 text-[0.8125rem] text-muted">
        We use your answers only to reply to this request. See <a href="/security#data" className="link">how this site handles data</a>.
      </p>
    </form>
  );
}
