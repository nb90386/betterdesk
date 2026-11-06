import { ButtonLink } from "./Button";

export function CtaBand({
  title = (
    <>
      Talk through <em>your</em> front desk.
    </>
  ),
  secondary = { href: "/demo", label: "Or try the sample walkthrough" },
  body = "A short call with a person, not a pitch deck. Bring how calls and messages reach you today; we'll show you what BetterDesk would do with them and what it costs.",
}: {
  title?: React.ReactNode;
  body?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden bg-night text-card" aria-labelledby="cta-title">
      <ThreadArt />
      <div className="container-bd relative grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:items-end md:py-28">
        <div>
          <p className="eyebrow !text-night-muted">Next step</p>
          <h2 id="cta-title" className="display mt-4 text-[clamp(2.4rem,1.6rem+3vw,4.4rem)]">
            {title}
          </h2>
          <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-card/80">{body}</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ButtonLink href="/contact" variant="light" arrow className="group">
            Book a demo
          </ButtonLink>
          <ButtonLink href={secondary.href} variant="ghost" className="!text-card decoration-night-muted hover:decoration-card">
            {secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ThreadArt() {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full opacity-50" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cta-g" x1="0" x2="1">
          <stop offset="0" stopColor="#ff7a52" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#f3eee4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#6fcf9f" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M-20 380 C 120 340, 160 400, 260 370 S 380 330, 470 350 C 600 375, 700 300, 1220 120" fill="none" stroke="url(#cta-g)" strokeWidth="1.4" />
      <path d="M-20 395 C 140 360, 200 410, 300 385 S 420 350, 520 365 C 650 385, 760 320, 1220 140" fill="none" stroke="url(#cta-g)" strokeWidth="0.8" strokeOpacity="0.5" className="thread-flow" />
      
    </svg>
  );
}
