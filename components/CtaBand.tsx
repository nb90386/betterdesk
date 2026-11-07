import { ButtonLink } from "./Button";
import { Check } from "./NightDesk";

/** The close: morning. The call from last night is on today's schedule. */
export function CtaBand({
  title = <>Wake up to bookings, <span className="text-muted">not voicemails.</span></>,
  secondary = { href: "/demo", label: "Or watch a sample call" },
  body = "A short call with a person, not a pitch deck. Bring how calls and messages reach you today; we'll show you what BetterDesk would do with them and what it costs.",
}: {
  title?: React.ReactNode;
  body?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section
      className="relative overflow-hidden border-t border-rule bg-[radial-gradient(90%_120%_at_100%_100%,rgb(244_169_71/0.22)_0%,rgb(244_169_71/0.06)_38%,transparent_70%)] bg-paper"
      aria-labelledby="cta-title"
    >
      <div className="container-bd relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
        <div>
          <h2 id="cta-title" className="display max-w-[15ch] text-[clamp(2.4rem,1.4rem+3.2vw,4.3rem)] text-ink">
            {title}
          </h2>
          <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed text-ink-2">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/contact" variant="resolve" arrow className="group">
              Book a demo
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="ghost">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
        <MorningCard />
      </div>
    </section>
  );
}

function MorningCard() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:mr-0" aria-hidden="true">
      <div className="absolute inset-x-6 -bottom-3 top-6 rotate-[3deg] rounded-[18px] bg-[#e4e3de] shadow-[var(--shadow-card)]" />
      <div className="relative rounded-[18px] bg-[linear-gradient(180deg,#fdfcfa_0%,#f2f1ec_100%)] p-6 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <p className="text-[0.78rem] font-medium text-muted">Thursday · 7:52 AM</p>
          <p className="text-[0.72rem] text-muted">Sample</p>
        </div>
        <p className="mt-3 font-display text-[1.7rem] leading-[1.05] tracking-[-0.03em] text-ink">Dana M. at 8:00</p>
        <p className="mt-1 text-[0.9rem] text-ink-2">Water heater, slow leak · garage · 78704</p>
        <ul className="mt-5 space-y-2 border-t border-rule pt-4 text-[0.86rem] text-ink-2">
          <li className="flex items-center gap-2.5">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-lamp"><Check className="size-3" /></span>
            Booked by text at 6:47 PM
          </li>
          <li className="flex items-center gap-2.5">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-lamp"><Check className="size-3" /></span>
            Reminder sent
          </li>
          <li className="flex items-center gap-2.5">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-lamp"><Check className="size-3" /></span>
            Whole thread in your inbox
          </li>
        </ul>
      </div>
    </div>
  );
}
