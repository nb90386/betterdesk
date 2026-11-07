"use client";

import { useId, useState } from "react";
import { BUSINESS_TYPES, CONTACT_EMAIL, PLANS } from "@/lib/site";

type Values = { name: string; email: string; business: string; phone: string; type: string; plan: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.email.trim()) e.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look complete.";
  if (!v.business.trim()) e.business = "What's the business called?";
  if (v.phone && !/^[\d\s()+.-]{7,20}$/.test(v.phone)) e.phone = "Use digits, spaces, or ( ) + - only.";
  if (v.message.length > 2000) e.message = "Please keep it under 2,000 characters.";
  return e;
}

export function buildMailto(v: Values) {
  const plan = PLANS.find((p) => p.id === v.plan);
  const subject = `Demo request: ${v.business.trim()}`;
  const body = [
    `Name: ${v.name.trim()}`,
    `Business: ${v.business.trim()}`,
    `Email: ${v.email.trim()}`,
    v.phone ? `Phone: ${v.phone.trim()}` : null,
    v.type ? `Type of business: ${v.type}` : null,
    plan ? `Interested in: ${plan.name} ($${plan.price}/mo)` : null,
    "",
    v.message.trim() ? `How calls and messages reach us today:\n${v.message.trim()}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ initialPlan = "" }: { initialPlan?: string }) {
  const uid = useId();
  const [v, setV] = useState<Values>({ name: "", email: "", business: "", phone: "", type: "", plan: PLANS.some((p) => p.id === initialPlan) ? initialPlan : "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const href = buildMailto(v);
    setSent(href);
    window.location.href = href;
  };

  const field = (k: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div>
      <label htmlFor={`${uid}-${k}`} className="flex justify-between text-[0.9rem] font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-muted">Optional</span> : null}
      </label>
      <input
        id={`${uid}-${k}`}
        name={k}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k] || undefined}
        aria-describedby={errors[k] ? `${uid}-${k}-err` : undefined}
        className={`mt-1.5 block min-h-12 w-full rounded-[var(--radius-md)] border bg-card px-3.5 text-[1rem] text-ink outline-none transition-colors focus:border-ink ${errors[k] ? "border-signal" : "border-rule-strong"}`}
        {...props}
      />
      {errors[k] ? (
        <p id={`${uid}-${k}-err`} className="mt-1.5 text-[0.82rem] text-signal">
          {errors[k]}
        </p>
      ) : null}
    </div>
  );

  if (sent) {
    const body = decodeURIComponent(sent.split("&body=")[1] ?? "");
    return (
      <div className="rounded-[var(--radius-lg)] border border-handled/30 bg-card p-6 sm:p-8" role="status">
        <p className="text-[0.74rem] font-medium text-handled">Almost done</p>
        <h2 className="mt-2 font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-ink">Your email app should now be open.</h2>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">
          We&rsquo;ve filled in a message to <strong>{CONTACT_EMAIL}</strong>. Nothing is sent until you press send there. If no window opened,
          copy the message below and email it to us.
        </p>
        <pre className="mt-5 max-h-60 overflow-auto whitespace-pre-wrap rounded-[var(--radius-md)] bg-paper-2 p-4 font-mono text-[0.8rem] text-ink">{body}</pre>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="press min-h-11 rounded-full bg-ink px-5 text-[0.92rem] font-medium text-card"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\n\n${body}`);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Copied" : "Copy message"}
          </button>
          <a href={sent} className="press inline-flex min-h-11 items-center rounded-full border border-rule-strong px-5 text-[0.92rem] text-ink">
            Open email again
          </a>
          <button type="button" className="min-h-11 px-2 text-[0.92rem] text-muted underline underline-offset-4" onClick={() => setSent(null)}>
            Edit details
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-label="Book a demo">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Your name", { autoComplete: "name", required: true })}
        {field("business", "Business name", { autoComplete: "organization", required: true })}
        {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", required: true })}
        {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel" }, true)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-type`} className="flex justify-between text-[0.9rem] font-medium text-ink">
            Type of business <span className="font-normal text-muted">Optional</span>
          </label>
          <select id={`${uid}-type`} value={v.type} onChange={set("type")} className="mt-1.5 block min-h-12 w-full appearance-none rounded-[var(--radius-md)] border border-rule-strong bg-card bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22m4 6 4 4 4-4%22 fill=%22none%22 stroke=%22%2355585e%22 stroke-width=%221.6%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pl-3 pr-10 text-[1rem] text-ink focus:border-ink">
            <option value="">Choose one</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-plan`} className="flex justify-between text-[0.9rem] font-medium text-ink">
            Plan you&rsquo;re considering <span className="font-normal text-muted">Optional</span>
          </label>
          <select id={`${uid}-plan`} value={v.plan} onChange={set("plan")} className="mt-1.5 block min-h-12 w-full appearance-none rounded-[var(--radius-md)] border border-rule-strong bg-card bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22m4 6 4 4 4-4%22 fill=%22none%22 stroke=%22%2355585e%22 stroke-width=%221.6%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pl-3 pr-10 text-[1rem] text-ink focus:border-ink">
            <option value="">Not sure yet</option>
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · ${p.price}/mo
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="flex justify-between text-[0.9rem] font-medium text-ink">
          How do calls and messages reach you today? <span className="font-normal text-muted">Optional</span>
        </label>
        <textarea
          id={`${uid}-message`}
          value={v.message}
          onChange={set("message")}
          rows={4}
          maxLength={2200}
          aria-invalid={!!errors.message || undefined}
          placeholder="e.g. One office line, a cell for after hours, a form on our website. Google Calendar for bookings."
          className={`mt-1.5 block w-full rounded-[var(--radius-md)] border bg-card px-3.5 py-3 text-[1rem] text-ink outline-none placeholder:text-faint focus:border-ink ${errors.message ? "border-signal" : "border-rule-strong"}`}
        />
        {errors.message ? <p className="mt-1.5 text-[0.82rem] text-signal">{errors.message}</p> : null}
      </div>
      <div className="flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[44ch] text-[0.82rem] leading-relaxed text-muted">
          Pressing the button opens your email app with this message addressed to {CONTACT_EMAIL}. Nothing is sent until you press send there.
        </p>
        <button type="submit" className="press min-h-12 shrink-0 rounded-full bg-ink px-6 text-[0.95rem] font-medium text-card hover:bg-ink-2">
          Write the email
        </button>
      </div>
    </form>
  );
}
