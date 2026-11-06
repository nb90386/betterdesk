import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { HeroScene } from "@/components/HeroScene";
import { LeadJourney } from "@/components/LeadJourney";
import { ThroughLine } from "@/components/ThroughLine";
import { SectionHeading, ThreadMark } from "@/components/Section";
import { PricingPlans } from "@/components/PricingPlans";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { ModeSwitcher } from "@/components/ModeSwitcher";

const MOMENTS = [
  {
    time: "10:14 AM",
    where: "On a job",
    today: "The phone buzzes in your pocket. You can't answer with your hands in a crawlspace.",
    after: "The caller gets a text within moments and is booked before you're back in the truck.",
  },
  {
    time: "12:40 PM",
    where: "Front desk is slammed",
    today: "Two people at the counter, one on hold, and a text nobody sees until 4.",
    after: "Routine questions get answered from your own FAQ. Your team helps the people in front of them.",
  },
  {
    time: "9:48 PM",
    where: "After close",
    today: "A customer ready to book tonight books with whoever answers tonight.",
    after: "They get open times and a confirmation. The conversation is waiting in your inbox.",
  },
];

const HOME_FAQ = [
  {
    q: "Does BetterDesk replace my receptionist?",
    a: "No. It covers the moments nobody can get to: calls while you're busy, texts after hours, forms at 11pm. Your team keeps handling the people in front of them, and anything sensitive is handed to them.",
  },
  {
    q: "Can I approve replies before they go out?",
    a: "Yes. You choose between assisted (it drafts, you approve), escalation (it handles routine questions, you handle anything sensitive) and autonomous. We recommend starting in assisted mode.",
  },
  {
    q: "Will it make things up about my business?",
    a: "It answers from the services, hours, prices and policies you give it. When a customer asks something outside that, it says it will check and passes the question to a person instead of guessing.",
  },
  {
    q: "Does it work with my calendar?",
    a: "Where we can connect to the calendar or booking tool you already use, BetterDesk offers your real open times. If we can't, it can collect the request and hand the booking to your team. We confirm which applies to you on the demo call, before you sign up.",
  },
  {
    q: "What does it cost, and can I cancel?",
    a: (
      <>
        Plans are $149, $299 and $599 a month, with setup and onboarding included. There&rsquo;s no annual contract and you can cancel any time.{" "}
        <Link href="/pricing" className="underline underline-offset-4">
          Compare plans
        </Link>
        .
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <GutterThread />
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="container-bd grid items-center gap-12 pb-16 pt-10 sm:pt-14 xl:grid-cols-[1.05fr_1fr] xl:gap-10 xl:pb-24 xl:pt-20">
          <div className="max-w-[640px]">
            <h1 id="hero-title" className="display text-[clamp(2.7rem,1.5rem+4.6vw,5.1rem)] text-ink">
              Missed calls become{" "}
              <span className="relative inline-block text-handled">
                booked
                <BookedThread />
              </span>{" "}
              appointments.
            </h1>
            <p className="lede mt-7">
              BetterDesk is the front desk for busy service businesses. When your team can&rsquo;t get to the phone, it texts the caller back,
              answers from what you&rsquo;ve taught it, offers your open times, and tells you what happened. No extra receptionist.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink href="/contact" arrow className="group">
                Book a demo
              </ButtonLink>
              <ButtonLink href="/demo" variant="ghost">
                Try the sample walkthrough
              </ButtonLink>
            </div>
            <ul className="mt-10 grid max-w-[560px] grid-cols-3 gap-x-4 border-t border-rule pt-5 text-[0.85rem] leading-snug text-ink-2 sm:gap-x-6 sm:text-[0.88rem]">
              <li>
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">From</span>$149 / month
              </li>
              <li>
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">Setup</span>With a real person
              </li>
              <li>
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">Control</span>You approve replies
              </li>
            </ul>
          </div>
          <HeroScene />
        </div>
      </section>

      {/* ---------------- Three moments (problem): the ledger is the layout ---------------- */}
      <section className="border-y border-rule bg-paper-2/50" aria-labelledby="moments-title">
        <div className="container-bd py-20 md:py-28">
          <SectionHeading mark="signal" id="moments-title" title="The phone rings when your hands are full.">
            <p>A lot of missed work is lost to a slow reply, not a better price. The customer needed someone now, and someone else picked up.</p>
          </SectionHeading>
          <div className="reveal mt-12" role="table" aria-label="Three moments, today and with BetterDesk">
            <div role="row" className="hidden md:grid md:grid-cols-[150px_1fr_1fr]">
              <span role="columnheader" className="eyebrow border-b border-rule-strong pb-3">When</span>
              <span role="columnheader" className="eyebrow border-b border-rule-strong pb-3 pl-6 !text-signal">Today</span>
              <span role="columnheader" className="eyebrow rounded-t-[var(--radius-md)] border-b border-handled/30 bg-handled-soft/70 px-6 pb-3 pt-3 !text-handled">
                With BetterDesk
              </span>
            </div>
            {MOMENTS.map((m, i) => (
              <div
                role="row"
                key={m.time}
                className="grid gap-3 border-b border-rule py-6 md:grid-cols-[150px_1fr_1fr] md:gap-0 md:border-b-0 md:py-0"
              >
                <div role="rowheader" className="md:border-b md:border-rule md:py-7">
                  <p className="font-mono text-[0.95rem] text-ink">{m.time}</p>
                  <p className="text-[0.85rem] text-muted">{m.where}</p>
                </div>
                <p role="cell" className="text-[1rem] leading-relaxed text-ink-2 md:border-b md:border-rule md:py-7 md:pl-6 md:pr-8">
                  <span className="mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-signal md:hidden">Today</span>
                  {m.today}
                </p>
                <p
                  role="cell"
                  className={`rounded-[var(--radius-md)] bg-handled-soft/70 px-4 py-3 text-[1rem] leading-relaxed text-ink md:rounded-none md:border-b md:border-handled/20 md:px-6 md:py-7 ${
                    i === MOMENTS.length - 1 ? "md:rounded-b-[var(--radius-md)] md:border-b-0" : ""
                  }`}
                >
                  <span className="mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-handled md:hidden">With BetterDesk</span>
                  {m.after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Through-line ---------------- */}
      <section className="container-bd py-20 md:py-28" aria-labelledby="flow-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading mark="ink" id="flow-title" title="One thread, from first ring to on the calendar." />
          <ButtonLink href="/how-it-works" variant="ghost" className="reveal shrink-0 self-start md:self-auto">
            Setup, step by step
          </ButtonLink>
        </div>
        <div className="mt-14">
          <ThroughLine />
        </div>
      </section>

      {/* ---------------- Interactive walkthrough ---------------- */}
      <section className="bg-paper-2/50 py-20 md:py-28" aria-labelledby="walk-title">
        <div className="container-bd">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading mark="ink" id="walk-title" title="Same call. Two endings.">
              <p>Step through a missed call at a plumbing company, then flip to &ldquo;Without&rdquo; and watch the same evening go differently.</p>
            </SectionHeading>
            <Link href="/demo" className="reveal text-[0.95rem] text-ink underline decoration-rule-strong underline-offset-[6px] hover:decoration-ink">
              More scenarios: salon, cleaning →
            </Link>
          </div>
          <div className="reveal mt-12">
            <LeadJourney scenarioIds={["missed-call"]} />
          </div>
        </div>
      </section>

      {/* ---------------- Control (dark) ---------------- */}
      <section className="bg-night text-card [--mark-fill:var(--color-night)]" aria-labelledby="control-title">
        <div className="container-bd grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div className="reveal">
            <ThreadMark tone="light" />
            <h2 id="control-title" className="display mt-4 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)]">
              It works your way, from what you&rsquo;ve told it.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-card/80">
              Start with every reply waiting for your OK. Loosen the reins when you trust it. Your rules decide which conversations go to a person, with the whole thread attached.
            </p>
            <ul className="mt-8 space-y-3 text-[0.95rem] text-card/85">
              <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-handled-bright" aria-hidden="true" />Answers come from your services, hours, prices and policies</li>
              <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-handled-bright" aria-hidden="true" />Quiet hours and emergency routing you set</li>
              <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-handled-bright" aria-hidden="true" />Suggested FAQ updates wait for your approval</li>
            </ul>
          </div>
          <div className="reveal">
            <ModeSwitcher />
          </div>
        </div>
      </section>

      {/* ---------------- Platform teaser: four jobs, then the rest in one line ---------------- */}
      <section className="container-bd py-20 md:py-28" aria-labelledby="inside-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading mark="ink" id="inside-title" title="Four jobs a good front desk does every time.">
              <p>One inbox for your channels, bookings on your calendar, and a short list of the conversations that need you.</p>
            </SectionHeading>
            <ButtonLink href="/platform" variant="secondary" arrow className="group reveal mt-8">
              Explore the platform
            </ButtonLink>
          </div>
          <div className="reveal">
            <ol className="border-t border-rule">
              {INSIDE.map(([k, v, tag], i) => (
                <li key={k} className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-rule py-7">
                  <span className={`mt-2 size-2.5 rounded-full border-2 ${i === INSIDE.length - 1 ? "border-handled bg-handled" : i === 0 ? "border-signal" : "border-ink"}`} aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-[1.65rem] leading-tight tracking-[-0.015em] text-ink">{k}</h3>
                    <p className="mt-1.5 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-2">{v}</p>
                    <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">{tag}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-2">
              <span className="font-medium text-ink">Also included:</span> replies on texts and web forms on every plan, one unified inbox,
              and on Growth and Scale, Instagram, Google Business and email, review generation, owner alerts and a plain-English weekly summary.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Solutions ---------------- */}
      <section className="border-y border-rule bg-paper-2/50 py-20 md:py-28" aria-labelledby="who-title">
        <div className="container-bd">
          <SectionHeading mark="ink" id="who-title" title="Built for businesses where a missed call is a missed job." />
          <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <Link href="/solutions/home-services" className="reveal group relative overflow-hidden rounded-[var(--radius-xl)] bg-ink p-7 text-card sm:p-9">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-night-muted">Home services</p>
              <h3 className="mt-3 max-w-[18ch] font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em]">
                Plumbing, HVAC, electrical, contractors.
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.95rem] text-card/75">
                Your team is on jobs all day. BetterDesk sorts emergencies from routine work, routes the urgent ones and books the rest.
              </p>
              <WorkOrder />
              <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium">
                See home services <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link href="/solutions/beauty-wellness" className="reveal group relative overflow-hidden rounded-[var(--radius-xl)] border border-rule bg-card p-7 sm:p-9">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">Beauty & wellness</p>
              <h3 className="mt-3 max-w-[16ch] font-display text-[2.1rem] leading-[1.05] tracking-[-0.02em] text-ink">Salons, spas, studios.</h3>
              <p className="mt-3 max-w-[40ch] text-[0.95rem] text-ink-2">
                Texts and DMs pile up between clients. BetterDesk replies with availability, services and prices, and books into your system.
              </p>
              <AppointmentStrip />
              <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                See beauty & wellness <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
          <p className="reveal mt-6 text-[0.95rem] text-ink-2">
            Also a fit for cleaning companies, auto shops and other appointment-based businesses.{" "}
            <Link href="/solutions" className="underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
              All solutions
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------- Pricing teaser ---------------- */}
      <section className="container-bd py-20 md:py-28" aria-labelledby="price-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading mark="handled" id="price-title" title="Priced per business, not per seat.">
            <p>Setup, calibration and human support are included on every plan. No annual contract.</p>
          </SectionHeading>
          <div className="reveal flex shrink-0 flex-col items-start gap-2 md:items-end">
            <ButtonLink href="/pricing" variant="ghost">
              Compare every feature
            </ButtonLink>
            <ButtonLink href="/roi" variant="ghost">
              Run your own numbers
            </ButtonLink>
          </div>
        </div>
        <div className="reveal mt-12">
          <PricingPlans compact />
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="container-bd grid gap-10 pb-24 md:pb-32 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="faq-title">
        <SectionHeading mark="handled" id="faq-title" title="Straight answers." />
        <Faq items={HOME_FAQ} className="reveal" />
      </section>

      <CtaBand />
    </>
  );
}

const INSIDE = [
  ["Text back every missed call", "The caller hears from your business while they're still looking at their phone, not after they've called someone else.", "Every plan"],
  ["Offer real times, or hand off", "Where your calendar is connected it offers open slots and books them. Otherwise it collects the request for your team.", "Every plan"],
  ["Know when to get a person", "Emergencies, complaints and anything outside what you've taught it go to the person you choose, with the thread attached.", "Your rules"],
  ["Follow up so nothing slips", "Reminders before appointments and a nudge when a quote goes quiet. Multi-step sequences on Growth and Scale.", "Every plan · advanced on Growth"],
] as const;

/** Hand-drawn thread under "booked": frays in, then runs straight. Drawn once with a transform (compositor-only). */
function BookedThread() {
  return (
    <span className="booked-thread pointer-events-none absolute -bottom-[0.06em] left-[-0.04em] right-[-0.04em] block h-[0.2em]" aria-hidden="true">
      <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="size-full overflow-visible">
        <path d="M2 12 C 8 4, 13 18, 19 10 S 30 5, 36 11 S 46 14, 52 10" fill="none" stroke="var(--color-signal)" strokeWidth="2.2" strokeDasharray="2 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d="M52 10 C 80 8, 140 9, 194 9" fill="none" stroke="var(--color-handled)" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/** A quiet vertical thread in the wide-screen gutter, drawn as you read. CSS scroll timeline; static elsewhere. */
function GutterThread() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-[max(16px,calc((100vw-1240px)/2-40px))] z-0 hidden w-px min-[1400px]:block" aria-hidden="true">
      <div className="gutter-thread sticky top-0 h-dvh w-px bg-gradient-to-b from-signal/70 via-ink/25 to-handled/70" />
    </div>
  );
}

function WorkOrder() {
  return (
    <div className="mt-7 max-w-[420px] rotate-[-1.2deg] rounded-md bg-card p-4 text-ink shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:rotate-0" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-dashed border-rule-strong pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
        <span>Work order · sample</span>
        <span>Thu 8–10 AM</span>
      </div>
      <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.8rem]">
        <span className="text-muted">Issue</span>
        <span>Water heater, slow leak</span>
        <span className="text-muted">Urgency</span>
        <span>Routine · not pooling</span>
        <span className="text-muted">Booked by</span>
        <span className="text-handled">BetterDesk, 6:47 PM</span>
      </div>
    </div>
  );
}

function AppointmentStrip() {
  const cols = [
    { who: "Mei", slots: [{ t: "10:00", l: "Cut + gloss · Aisha", on: true, h: 2 }, { t: "1:00", l: "Blowout", h: 1 }] },
    { who: "Jordan", slots: [{ t: "10:00", l: "Color", h: 1.5 }, { t: "1:30", l: "Open", open: true, h: 1 }] },
  ];
  return (
    <div className="mt-7 grid max-w-[360px] grid-cols-2 gap-2" aria-hidden="true">
      {cols.map((c) => (
        <div key={c.who} className="rounded-md border border-rule bg-paper p-2">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">{c.who} · Sat</p>
          <div className="mt-1.5 space-y-1.5">
            {c.slots.map((s) => (
              <div
                key={s.t}
                className={`rounded px-2 py-1 text-[0.72rem] ${
                  "on" in s && s.on ? "bg-handled text-card" : "open" in s && s.open ? "border border-dashed border-rule-strong text-muted" : "bg-paper-3 text-ink-2"
                }`}
                style={{ minHeight: `${s.h * 1.6}rem` }}
              >
                <span className="font-mono">{s.t}</span> {s.l}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
