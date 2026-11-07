import Link from "next/link";
import { ButtonLink, Arrow } from "@/components/Button";
import { NightDesk } from "@/components/NightDesk";
import { SignalStory } from "@/components/SignalStory";
import { TwoEndings, TrustStrip } from "@/components/TwoEndings";
import { DayRibbon } from "@/components/DayRibbon";
import { LeadJourney } from "@/components/LeadJourney";
import { SectionHeading } from "@/components/Section";
import { PricingPlans } from "@/components/PricingPlans";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";

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
      {/* ---------------- Hero: 6:42 PM, after hours ---------------- */}
      <section className="on-night lamp-ground relative -mt-16 overflow-hidden pt-16" aria-labelledby="hero-title">
        <div className="container-bd relative pb-14 pt-10 sm:pt-14 lg:pb-20 lg:pt-16">
          <h1 id="hero-title" className="display max-w-[15ch] text-[clamp(2.3rem,0.9rem+5.3vw,5.6rem)] text-[#f7f6f3] lg:max-w-none">
            Every missed call, answered <span className="text-night-muted">before they call someone else.</span>
          </h1>
          <div className="mt-6 grid gap-9 md:mt-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)] lg:gap-12">
            <div className="lg:pt-6">
              <p className="max-w-[40ch] text-[1rem] leading-relaxed text-[#d4d6da] sm:text-[1.06rem]">
                BetterDesk texts back the calls your team can&rsquo;t take, answers from what you&rsquo;ve taught it and offers your real open times. Anything tricky goes to a person.
              </p>
              <div className="mt-7 grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
                <ButtonLink href="/contact" variant="light" arrow className="group w-full sm:w-auto">
                  Book a demo
                </ButtonLink>
                <ButtonLink href="/demo" variant="ghost" className="justify-self-center sm:justify-self-auto">
                  Watch a sample call
                </ButtonLink>
              </div>
              <p className="mt-8 hidden text-[0.85rem] leading-relaxed text-[#c9ccd1] lg:block">
                For plumbers, salons, clinics and shops that run on appointments. Plans from $149 a month, setup with a real person.
              </p>
            </div>
            <NightDesk />
            <p className="text-[0.85rem] leading-relaxed text-[#c9ccd1] lg:hidden">
              For plumbers, salons, clinics and shops that run on appointments. Plans from $149 a month, setup with a real person.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Dusk: three moments in one day ---------------- */}
      <section className="on-night relative border-t border-white/[0.06] bg-night-2" aria-labelledby="moments-title">
        <div className="container-bd py-20 md:py-28">
          <h2 id="moments-title" className="display reveal max-w-[18ch] text-[clamp(2rem,1.3rem+2.4vw,3.4rem)] text-[#f7f6f3]">
            The phone rings when your hands are full.
          </h2>
          <DayRibbon moments={MOMENTS} />
        </div>
      </section>

      {/* ---------------- Scroll story: one conversation, five states ---------------- */}
      <section className="on-night relative bg-[linear-gradient(180deg,#0d0e10_0%,#111214_45%,#1a1815_80%,#221d17_100%)]" aria-labelledby="story-title">
        <div className="container-bd pt-20 md:pt-28">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <h2 id="story-title" className="display reveal text-[clamp(2rem,1.3rem+2.4vw,3.4rem)] text-[#f7f6f3]">
              Follow one call from ring to calendar.
            </h2>
            <p className="reveal self-end text-[1.02rem] leading-relaxed text-night-muted lg:max-w-[48ch]">
              Same evening, same caller. This is what happens between the missed call and the booked visit, and where your team stays in charge.
            </p>
          </div>
          <div className="mt-6 lg:mt-16">
            <SignalStory />
          </div>
        </div>
        <div className="h-16 md:h-24" aria-hidden="true" />
      </section>

      {/* ---------------- Peak: same call, two endings ---------------- */}
      <TwoEndings />

      {/* ---------------- Interactive walkthrough (pearl, morning) ---------------- */}
      <section className="on-night lamp-ground relative pb-16 pt-14 md:pb-24 md:pt-20" aria-labelledby="walk-title">
        <div className="container-bd">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading id="walk-title" title="Now step through it yourself.">
              <p>Here is the finished thread. Replay it step by step, or flip to &ldquo;Without&rdquo; and watch the same evening go differently.</p>
            </SectionHeading>
            <Link href="/demo" className="reveal text-[0.95rem] font-medium text-ink underline decoration-rule-strong underline-offset-[6px] hover:decoration-ink">
              More scenarios: salon, cleaning
            </Link>
          </div>
          <div className="on-pearl reveal mt-12 rounded-[var(--radius-xl)] bg-card shadow-[var(--shadow-pearl-on-night)]">
            <LeadJourney scenarioIds={["missed-call"]} startAtEnd />
          </div>
        </div>
      </section>

      {/* ---------------- Where it fits ---------------- */}
      <section className="py-20 md:py-28" aria-labelledby="who-title">
        <div className="container-bd">
          <SectionHeading id="who-title" title="Built for businesses where a missed call is a missed job." />
          <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <Link href="/solutions/home-services" className="on-night reveal group relative overflow-hidden rounded-[var(--radius-xl)] bg-night p-7 sm:p-9">
              <h3 className="max-w-[18ch] font-display text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-[#f7f6f3]">
                Home services: plumbing, HVAC, electrical.
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.95rem] text-night-muted">
                Your team is on jobs all day. BetterDesk sorts emergencies from routine work, routes the urgent ones and books the rest.
              </p>
              <WorkOrder />
              <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#f7f6f3]">
                See home services <Arrow />
              </span>
            </Link>
            <Link href="/solutions/beauty-wellness" className="reveal group relative overflow-hidden rounded-[var(--radius-xl)] bg-card p-7 shadow-[var(--shadow-card)] sm:p-9">
              <h3 className="max-w-[16ch] font-display text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-ink">Beauty and wellness: salons, spas, studios.</h3>
              <p className="mt-3 max-w-[40ch] text-[0.95rem] text-ink-2">
                Texts and DMs pile up between clients. BetterDesk replies with availability, services and prices, and books into your system.
              </p>
              <AppointmentStrip />
              <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                See beauty &amp; wellness <Arrow />
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
      <section className="border-t border-rule bg-paper-2/60 py-20 md:py-28" aria-labelledby="price-title">
        <div className="container-bd">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="price-title" title="Priced per business, not per seat.">
              <p>Setup, calibration and human support are included on every plan. No annual contract.</p>
            </SectionHeading>
            <div className="reveal flex shrink-0 flex-col items-start gap-2 md:items-end">
              <ButtonLink href="/pricing" variant="ghost">Compare every feature</ButtonLink>
              <ButtonLink href="/roi" variant="ghost">Run your own numbers</ButtonLink>
            </div>
          </div>
          <div className="reveal mt-12">
            <PricingPlans compact />
          </div>
          <TrustStrip className="reveal mt-4" />
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="container-bd grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="faq-title">
        <SectionHeading id="faq-title" title="Straight answers." />
        <Faq items={HOME_FAQ} className="reveal" />
      </section>

      <CtaBand />
    </>
  );
}

function WorkOrder() {
  return (
    <div className="mt-7 max-w-[420px] rotate-[-1.2deg] rounded-[12px] bg-[#f3f1ec] p-4 text-[#111214] shadow-[var(--shadow-pearl-on-night)] transition-transform duration-300 group-hover:rotate-0" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-dashed border-[#b7b4ad] pb-2 text-[0.72rem] font-medium text-[#55585e]">
        <span>Work order · sample</span>
        <span>Thu 8–10 AM</span>
      </div>
      <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.8rem]">
        <span className="text-[#6b6e74]">Issue</span>
        <span>Water heater, slow leak</span>
        <span className="text-[#6b6e74]">Urgency</span>
        <span>Routine · not pooling</span>
        <span className="text-[#6b6e74]">Booked by</span>
        <span className="text-[#2c5c4c]">BetterDesk, 6:47 PM</span>
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
          <p className="text-[0.72rem] font-medium text-muted">{c.who} · Sat</p>
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
