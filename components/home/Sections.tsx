import { ButtonLink, Arrow } from "@/components/Button";
import { Mark } from "@/components/Logo";
import { CONTACT_EMAIL } from "@/lib/site";

const MODES = [
  { name: "Assisted", what: "BetterDesk drafts every reply. Nothing goes out until you approve or edit it. Most businesses start here." },
  { name: "Escalation", what: "Routine questions are answered from your list. Anything sensitive, new or unusual comes to you." },
  { name: "Autonomous", what: "BetterDesk handles the conversation end to end within your rules, and you read the inbox when you have a minute." },
];

const LIMITS = [
  "It won't invent prices, policies or promises. If the answer isn't on your list, it says it will check and passes the question to you.",
  "If your calendar or booking tool can't be connected, it collects the request and hands the booking to your team.",
  "It doesn't replace your dispatch or field-service software. Custom integrations are part of Scale, and we tell you what connects before you sign up.",
  "Clinics and practices: talk to us about your requirements before any patient information is connected.",
];

/** Act IV, part three: who stays in charge, and honest limits. A ruled two-column spread, no cards. */
export function YouStayInCharge() {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10">
      <div className="lg:col-span-6">
        <h3 className="t-title max-w-[16ch]">You choose how much it does on its own.</h3>
        <dl className="mt-8 border-t border-ink">
          {MODES.map((m) => (
            <div key={m.name} className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-[1.0625rem] font-semibold">{m.name}</dt>
              <dd className="text-[1rem] leading-snug text-ink-2">{m.what}</dd>
            </div>
          ))}
        </dl>
        <p className="t-small mt-4 text-muted">You can switch modes at any time. We recommend starting in assisted mode.</p>
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        <h3 className="t-title max-w-[16ch]">What it won&rsquo;t do.</h3>
        <ul className="mt-8 border-t border-ink">
          {LIMITS.map((l) => (
            <li key={l} className="border-b border-rule py-5 text-[1rem] leading-snug text-ink-2">{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ROWS: { label: string; diy: string; service: string; bd: string }[] = [
  { label: "Who sets it up", diy: "You: prompts, phone number, texting rules, calendar link", service: "A sign-up form and a script", bd: "A person, in a guided setup with you" },
  { label: "Missed call at 2 PM", diy: "Only if you've wired calls to it", service: "A person takes a message", bd: "A text back in your name, in moments" },
  { label: "What it says", diy: "Whatever the model decides, unless you test it", service: "What the script says", bd: "Only what you've approved" },
  { label: "Getting to a booking", diy: "Possible, if you build the calendar connection", service: "Usually a message for you to call back", bd: "Your real open times, or a handoff to your team" },
  { label: "When it's urgent", diy: "Up to you to design", service: "Depends on the service", bd: "Your rules decide who gets alerted" },
];

/** Why not ChatGPT or an answering service? A plain comparison table; claims about others stay general. */
export function Alternatives() {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Comparison with a do-it-yourself chatbot and an answering service" tabIndex={0}>
      <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="w-[22%] py-3 pr-4 font-normal text-muted"><span className="sr-only">Question</span></th>
            <th scope="col" className="w-[26%] py-3 pr-4 font-[550]">DIY chatbot</th>
            <th scope="col" className="w-[26%] py-3 pr-4 font-[550]">Answering service</th>
            <th scope="col" className="w-[26%] py-3 font-semibold">
              <span className="inline-flex items-center gap-1.5"><Mark className="h-4 w-4" /> BetterDesk</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label} className="border-b border-rule align-top">
              <th scope="row" className="py-4 pr-4 font-[550]">{r.label}</th>
              <td className="py-4 pr-4 text-ink-2">{r.diy}</td>
              <td className="py-4 pr-4 text-ink-2">{r.service}</td>
              <td className="py-4 text-ink">{r.bd}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="t-small mt-3 text-muted">General comparison. Answering services and chatbot tools vary; check what yours includes.</p>
    </div>
  );
}

const NEXT = [
  { k: "You send the form", v: "Two minutes: your name, the business, and how calls reach you today. It opens your email app with the details filled in." },
  { k: "We reply to find a time", v: `From ${CONTACT_EMAIL}. On the call we look at how calls, texts and forms reach you now.` },
  { k: "We tell you what fits", v: "Which channels, whether your calendar connects, which plan. If BetterDesk isn't a fit, we'll say so." },
  { k: "Setup with a person", v: "If you go ahead, we set up your answers, rules and handoffs together during onboarding. Setup is included in every plan." },
];

/** Act V close: staged on the mineral table with the route landing on the CTA. Compact = one petrol line for subpages. */
export function CloseCta({ title, lede, compact = false }: { title?: string; lede?: string; compact?: boolean } = {}) {
  if (compact) {
    return (
      <section data-close-cta data-tone="dark" aria-labelledby="close-title" className="tone-dark bg-petrol">
        <div className="wrap flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-24">
          <div>
            <h2 id="close-title" className="t-title max-w-[20ch] text-petrol-ink">{title}</h2>
            {lede ? <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-petrol-muted">{lede}</p> : null}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
            <ButtonLink href="/contact">Request a demo</ButtonLink>
            <p className="text-[0.8125rem] text-petrol-muted">A short form; we reply by email to find a time.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section data-close-cta aria-labelledby="close-title" className="relative overflow-hidden border-t border-rule bg-mineral">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_15%_0%,#ffffff_0%,transparent_60%)]" />
      <div className="wrap relative grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-6">
          <h2 id="close-title" className="t-display max-w-[13ch]">{title ?? "Bring last week\u2019s missed calls."}</h2>
          <p className="t-lede mt-6">{lede ?? "We\u2019ll walk through what BetterDesk would have sent each of them, using your hours and your prices."}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/contact">Request a demo</ButtonLink>
            <ButtonLink href="/pricing" variant="quiet" className="gap-1.5">Compare plans <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h3 className="t-label">What happens after you click</h3>
          <ol className="relative mt-5">
            <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-signal" />
            {NEXT.map((n, i) => (
              <li key={n.k} className="relative pb-6 pl-8 last:pb-0">
                <span aria-hidden="true" className={`absolute left-0 top-[0.45em] h-[11px] w-[11px] rounded-full border-2 border-signal ${i === NEXT.length - 1 ? "bg-signal" : "bg-mineral"}`} />
                <p className="text-[1.0625rem] font-semibold">{n.k}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-ink-2">{n.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
