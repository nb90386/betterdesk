import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { MissedMoment } from "@/components/home/MissedMoment";
import { SignalToBooking } from "@/components/home/SignalToBooking";
import { InboxCanvas } from "@/components/home/InboxCanvas";
import { ApprovedAnswers } from "@/components/home/ApprovedAnswers";
import { YouStayInCharge, Alternatives, CloseCta } from "@/components/home/Sections";
import { ValueCalculator } from "@/components/ValueCalculator";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";

const HOME_FAQ = [
  {
    q: "Does BetterDesk replace my receptionist?",
    a: "No. It covers the moments nobody can get to: calls while you're on a job, texts after hours, web forms at 11 PM. Your team keeps handling the people in front of them, and anything sensitive is handed to them.",
  },
  {
    q: "Will it make things up about my business?",
    a: "It answers from the services, hours, prices and policies you give it. When a customer asks something outside that, it says it will check and passes the question to a person instead of guessing.",
  },
  {
    q: "Does it work with my calendar?",
    a: "Where we can connect to the calendar or booking tool you already use, BetterDesk offers your real open times. If we can't, it collects the request and hands the booking to your team. We confirm which applies to you on the demo call, before you sign up.",
  },
  {
    q: "How soon can I start?",
    a: "Setup is a guided session with a person. Most of the work is telling us how your business runs: hours, prices, service area and who gets which questions. We agree the timeline with you on the demo call.",
  },
  {
    q: "What does it cost, and can I cancel?",
    a: (
      <>
        The proposed plans are $129, $249 and $499 a month with setup included, monthly, cancel any time.{" "}
        <Link href="/pricing" className="underline underline-offset-4">See what each plan includes</Link>.
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Act I: the moment a customer reaches out */}
      <Hero />

      {/* Act II: the missed moment */}
      <MissedMoment />

      {/* Act III: the reply becomes a booking */}
      <SignalToBooking />

      {/* Act IV: the work, without the noise */}
      <section aria-labelledby="inbox-title" className="bg-mineral pb-10 pt-24 md:pt-36">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="inbox-title" className="t-display max-w-[14ch] lg:col-span-7">Every conversation, in one place you can check from the truck.</h2>
            <p className="t-lede lg:col-span-4 lg:col-start-9">
              Calls, texts and web forms on every plan. Instagram, Google Business and email on Growth and up. Tap a conversation to see what happened.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-[92rem] px-2 sm:px-6 md:mt-16">
          <InboxCanvas />
          <p className="illustrative wrap mt-3">Sample inbox. Names, messages and rules are illustrative.</p>
        </div>
      </section>

      <section aria-labelledby="answers-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <h2 id="answers-title" className="t-title max-w-[14ch]">It only says what you&rsquo;ve approved.</h2>
            <p className="mt-5 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-2">
              During setup we write down how you actually run things: hours, service area, what a visit costs, what counts as an emergency. That list is all BetterDesk works from. Change a line and the next reply uses it.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ApprovedAnswers />
          </div>
        </div>
      </section>

      <section aria-label="Control and limits" className="border-t border-rule bg-mineral py-24 md:py-32">
        <div className="wrap">
          <YouStayInCharge />
        </div>
      </section>

      <section aria-labelledby="alt-title" className="bg-mineral-2 py-24 md:py-32">
        <div className="wrap">
          <h2 id="alt-title" className="t-title max-w-[22ch]">Why not just use ChatGPT, or an answering service?</h2>
          <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-2">
            You can. The difference is who does the wiring, what it&rsquo;s allowed to say, and whether the conversation ends in a booking or a message for you to return.
          </p>
          <div className="mt-12">
            <Alternatives />
          </div>
        </div>
      </section>

      {/* Act V: the economic argument and the next step */}
      <section aria-labelledby="value-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap">
          <h2 id="value-title" className="t-display max-w-[16ch]">Is one booked job a month worth it?</h2>
          <p className="t-lede mt-6 max-w-[48ch]">Use your own numbers. The defaults are deliberately modest.</p>
          <div className="mt-14">
            <ValueCalculator compact />
          </div>
        </div>
      </section>

      <section aria-labelledby="pricing-title" className="border-t border-rule bg-mineral py-24 md:py-32">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="pricing-title" className="t-display max-w-[12ch] lg:col-span-7">Priced per business, not per seat.</h2>
            <p className="t-lede lg:col-span-4 lg:col-start-9">Setup and a real person to call are included in every plan.</p>
          </div>
          <div className="mt-14">
            <Pricing />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-mineral pb-24 md:pb-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Straight answers.</h2>
          <Faq items={HOME_FAQ} className="lg:col-span-8" />
        </div>
      </section>

      <CloseCta />
    </>
  );
}
