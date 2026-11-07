import { ButtonLink } from "./Button";

/** The close: first light. The night's conversations, sorted, waiting in the owner's inbox. */
export function CtaBand({
  title = <>Wake up to bookings, <span className="text-night-muted">not voicemails.</span></>,
  secondary = { href: "/demo", label: "Or watch a sample call" },
  body = "A short call with a person, not a pitch deck. Bring how calls and messages reach you today; we'll show you what BetterDesk would do with them and what it costs.",
}: {
  title?: React.ReactNode;
  body?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section
      className="on-night relative overflow-hidden bg-[linear-gradient(180deg,#0d0e10_0%,#121315_52%,#1d1915_80%,#2b2117_100%)]"
      aria-labelledby="cta-title"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lamp/60 to-transparent" aria-hidden="true" />
      <div className="container-bd relative grid grid-cols-[minmax(0,1fr)] gap-12 py-20 md:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
        <div>
          <h2 id="cta-title" className="display max-w-[15ch] text-[clamp(2.4rem,1.4rem+3.2vw,4.3rem)] text-[#f7f6f3]">
            {title}
          </h2>
          <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed text-[#d4d6da]">{body}</p>
          <div className="mt-8 grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            <ButtonLink href="/contact" variant="light" arrow className="group w-full sm:w-auto">
              Book a demo
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="ghost" className="justify-self-center sm:justify-self-auto">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
        <MorningInbox />
      </div>
    </section>
  );
}

const ROWS = [
  { who: "Dana M.", what: "Booked Thu 8–10 AM", tone: "done" },
  { who: "J. Alvarez", what: "Quote request · needs your price", tone: "you" },
  { who: "(512) 555-0193", what: "Answered: yes, tankless units", tone: "done" },
  { who: "K. Whitfield", what: "Handed to you · billing question", tone: "you" },
] as const;

function MorningInbox() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:mr-0" aria-hidden="true">
      <div className="pearl-card relative p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-display text-[1.35rem] font-[600] leading-none tracking-[-0.03em] text-[#111214]">This morning</p>
          <p className="text-[0.74rem] text-[#55585e]">7:52 AM · sample</p>
        </div>
        <p className="mt-2 text-[0.86rem] text-[#2a2c30]">4 conversations came in after you closed. 2 are waiting on you.</p>
        <ul className="mt-4 divide-y divide-[#dedcd6] border-y border-[#dedcd6]">
          {ROWS.map((r) => (
            <li key={r.who} className="grid grid-cols-[0.5rem_minmax(0,1fr)] items-baseline gap-x-3 py-2.5 text-[0.86rem] sm:grid-cols-[0.5rem_7.5rem_minmax(0,1fr)]">
              <span className={`size-2 shrink-0 rounded-full ${r.tone === "you" ? "bg-[#c47a12]" : "bg-[#111214]"}`} />
              <span className="truncate font-medium text-[#111214]">{r.who}</span>
              <span className="col-start-2 text-[#55585e] sm:col-start-3">{r.what}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.76rem] text-[#55585e]">Every thread is in your inbox with the whole conversation attached.</p>
      </div>
    </div>
  );
}
