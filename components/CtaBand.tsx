import { ButtonLink } from "./Button";
import { LogoMark } from "./Logo";

/** The close: first light. Last night's missed call is on this morning's route. */
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

const ROUTE = [
  { t: "7:00", who: "Okafor", what: "Furnace tune-up" },
  { t: "8:00", who: "Dana M.", what: "Water heater, slow leak · 78704", booked: true },
  { t: "10:30", who: "Ruiz", what: "Drain clear" },
  { t: "1:00", who: "Open", what: "", open: true },
] as const;

/** The payoff of the hero: the slot that was empty at closing is on this morning's route. */
function MorningInbox() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:mr-0" aria-hidden="true">
      <div className="pearl-card relative p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-display text-[1.35rem] font-[600] leading-none tracking-[-0.03em] text-[#111214]">Thursday · Marco&rsquo;s route</p>
          <p className="text-[0.74rem] text-[#55585e] tabular">7:12 AM · sample</p>
        </div>
        <ol className="mt-4 space-y-1.5">
          {ROUTE.map((r) => (
            <li
              key={r.t}
              className={`grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-3 rounded-[10px] px-3 py-2.5 text-[0.86rem] ${
                "booked" in r ? "bg-[#111214] text-[#f7f6f3]" : "open" in r ? "border border-dashed border-[#c9c6bf] text-[#6b6e74]" : "bg-[#e9e7e2] text-[#2a2c30]"
              }`}
            >
              <span className={`font-mono tabular ${"booked" in r ? "text-lamp" : "text-[#55585e]"}`}>{r.t}</span>
              <span className="min-w-0">
                <span className="font-medium">{r.who}</span>
                {r.what ? <span className={"booked" in r ? " text-[#c9ccd1]" : " text-[#55585e]"}> · {r.what}</span> : null}
                {"booked" in r ? (
                  <span className="mt-1.5 flex items-center gap-1.5 text-[0.74rem] text-lamp">
                    <LogoMark className="size-3.5 text-[#f7f6f3]" rings={1} />
                    Booked by text last night at 6:47 PM
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[0.76rem] text-[#55585e]">That 8:00 slot was empty when the office closed.</p>
      </div>
    </div>
  );
}
