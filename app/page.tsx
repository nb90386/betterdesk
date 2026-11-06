import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { HeroScene } from "@/components/HeroScene";
import { LeadJourney } from "@/components/LeadJourney";
import { ThroughLine } from "@/components/ThroughLine";
import { SectionHeading, Eyebrow } from "@/components/Section";
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
    today: "A customer ready to book tonight finds a business that answers tonight.",
    after: "They get real openings and a confirmation. You see it in the morning recap.",
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
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="container-bd grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-20">
          <div className="max-w-[640px]">
            <Eyebrow>The front desk for service businesses</Eyebrow>
            <h1 id="hero-title" className="display mt-5 text-[clamp(2.7rem,1.5rem+4.6vw,5.1rem)] text-ink">
              Missed calls become <em className="text-handled">booked</em> appointments.
            </h1>
            <p className="lede mt-6">
              When your team can&rsquo;t get to the phone, BetterDesk texts the caller back, answers from what you&rsquo;ve taught it,
              offers your open times, and tells you what happened. No extra receptionist.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink href="/contact" arrow className="group">
                Book a demo
              </ButtonLink>
              <ButtonLink href="/demo" variant="ghost">
                Try the sample walkthrough
              </ButtonLink>
            </div>
            <ul className="mt-10 grid max-w-[560px] grid-cols-1 gap-x-6 gap-y-2 border-t border-rule pt-5 text-[0.88rem] text-ink-2 xs:grid-cols-3">
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted">From</span>$149 / month
              </li>
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted">Setup</span>With a real person
              </li>
              <li>
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted">Control</span>You approve replies
              </li>
            </ul>
          </div>
          <HeroScene />
        </div>
      </section>

      {/* ---------------- Three moments (problem) ---------------- */}
      <section className="border-y border-rule bg-paper-2/50" aria-labelledby="moments-title">
        <div className="container-bd py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHeading
              n="01"
              eyebrow="The problem"
              id="moments-title"
              title={
                <>
                  The phone rings when your hands are <em>full.</em>
                </>
              }
            >
              <p>
                Most missed work isn&rsquo;t lost to a competitor&rsquo;s price. It&rsquo;s lost to a slow reply. The customer needed someone now, and
                someone else picked up.
              </p>
            </SectionHeading>
            <div className="reveal">
              <div className="hidden grid-cols-[110px_1fr_1fr] gap-6 border-b border-rule-strong pb-3 md:grid">
                <span className="eyebrow">When</span>
                <span className="eyebrow">Today</span>
                <span className="eyebrow !text-handled">With BetterDesk</span>
              </div>
              <ul className="divide-y divide-rule">
                {MOMENTS.map((m) => (
                  <li key={m.time} className="grid gap-3 py-6 md:grid-cols-[110px_1fr_1fr] md:gap-6">
                    <div>
                      <p className="font-mono text-[0.9rem] text-ink">{m.time}</p>
                      <p className="text-[0.82rem] text-muted">{m.where}</p>
                    </div>
                    <p className="text-[0.98rem] leading-relaxed text-ink-2">
                      <span className="mr-2 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-signal md:hidden">Today</span>
                      {m.today}
                    </p>
                    <p className="text-[0.98rem] leading-relaxed text-ink">
                      <span className="mr-2 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-handled md:hidden">With BetterDesk</span>
                      {m.after}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Through-line ---------------- */}
      <section className="container-bd py-20 md:py-28" aria-labelledby="flow-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            n="02"
            eyebrow="How it works"
            id="flow-title"
            title={
              <>
                One thread, from first ring to <em>on the calendar.</em>
              </>
            }
          />
          <ButtonLink href="/how-it-works" variant="ghost" className="reveal shrink-0">
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
            <SectionHeading
              n="03"
              eyebrow="See it happen"
              id="walk-title"
              title={
                <>
                  Same call. <em>Two endings.</em>
                </>
              }
            >
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
      <section className="bg-night text-card" aria-labelledby="control-title">
        <div className="container-bd grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div className="reveal">
            <p className="eyebrow flex items-center gap-3 !text-night-muted">
              <span className="text-signal-glow">04</span> You stay in charge
            </p>
            <h2 id="control-title" className="display mt-4 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)]">
              It works <em>your</em> way, and only says what you&rsquo;ve approved.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-card/80">
              Start with every reply waiting for your OK. Loosen the reins when you trust it. Urgent, unusual or sensitive conversations always go to a
              person, with the whole thread attached.
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

      {/* ---------------- Platform teaser ---------------- */}
      <section className="container-bd py-20 md:py-28" aria-labelledby="inside-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading
              n="05"
              eyebrow="What's inside"
              id="inside-title"
              title={
                <>
                  Everything a good front desk does, <em>written down.</em>
                </>
              }
            >
              <p>One inbox for every channel, a calendar that fills itself, and a short list of the conversations that need you.</p>
            </SectionHeading>
            <ButtonLink href="/platform" variant="secondary" arrow className="group reveal mt-8">
              Explore the platform
            </ButtonLink>
          </div>
          <dl className="reveal grid gap-x-10 sm:grid-cols-2">
            {[
              ["Missed-call text-back", "Every unanswered call gets a text in your business's name."],
              ["Replies on every channel", "Calls, texts and web forms on every plan. Instagram, Google Business and email on Growth."],
              ["Booking", "Offers open times and books them, or hands the request to your team."],
              ["Follow-up", "Reminders before appointments and a nudge when a quote goes quiet."],
              ["Handoff to a person", "Emergencies and anything it isn't sure about go to the right person."],
              ["Owner recap", "A plain-English summary of what came in and what happened."],
              ["Review requests", "A timely ask after the job, on Growth and Scale."],
              ["Unified inbox", "One thread per customer, whichever way they reached you."],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-rule py-5">
                <dt className="text-[1rem] font-semibold tracking-[-0.01em] text-ink">{k}</dt>
                <dd className="mt-1 text-[0.92rem] leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Solutions ---------------- */}
      <section className="border-y border-rule bg-paper-2/50 py-20 md:py-28" aria-labelledby="who-title">
        <div className="container-bd">
          <SectionHeading
            n="06"
            eyebrow="Who it's for"
            id="who-title"
            title={
              <>
                Built for businesses where a missed call is a <em>missed job.</em>
              </>
            }
          />
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
                Texts and DMs pile up between clients. BetterDesk answers with your menu and books the right person for the right length of time.
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
          <SectionHeading
            n="07"
            eyebrow="Pricing"
            id="price-title"
            title={
              <>
                Priced per business, <em>not per seat.</em>
              </>
            }
          >
            <p>Setup, calibration and human support are included on every plan. No annual contract.</p>
          </SectionHeading>
          <div className="reveal flex shrink-0 flex-col gap-2 md:items-end">
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
        <SectionHeading n="08" eyebrow="Questions" id="faq-title" title="Straight answers." />
        <Faq items={HOME_FAQ} className="reveal" />
      </section>

      <CtaBand />
    </>
  );
}

function WorkOrder() {
  return (
    <div className="mt-7 max-w-[420px] rotate-[-1.2deg] rounded-md bg-card p-4 text-ink shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:rotate-0" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-dashed border-rule-strong pb-2 font-mono text-[0.64rem] uppercase tracking-[0.08em] text-muted">
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
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">{c.who} · Sat</p>
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
