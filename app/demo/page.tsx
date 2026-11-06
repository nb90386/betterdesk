import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LeadJourney } from "@/components/LeadJourney";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Sample walkthrough",
  description: "Step through three sample conversations: a missed call, an after-hours text and a late-night quote request, with and without BetterDesk.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <PageHero eyebrow="Sample walkthrough" title={<>Watch one inquiry, <em>start to finish.</em></>}>
        <p>
          Three common moments, played step by step. Switch between &ldquo;Without&rdquo; and &ldquo;With BetterDesk&rdquo; to compare the same evening.
          The businesses and conversations are fictional examples, not customer data.
        </p>
      </PageHero>
      <section className="container-bd py-12 md:py-16" aria-labelledby="walk-h">
        <h2 id="walk-h" className="sr-only">Interactive walkthrough</h2>
        <LeadJourney />
        <div className="mt-10 grid gap-6 border-t border-rule pt-8 text-[0.92rem] leading-relaxed text-ink-2 md:grid-cols-3">
          <p><strong className="font-medium text-ink">What&rsquo;s real here:</strong> the flow. Text-back, intake questions, rules for urgent work, offered times, handoff to staff and the inbox record are how BetterDesk is designed to work.</p>
          <p><strong className="font-medium text-ink">What&rsquo;s sample:</strong> every name, number, price and time. Nothing on this page is connected to a live phone line or calendar.</p>
          <p><strong className="font-medium text-ink">What depends on you:</strong> the questions it asks, what counts as urgent, and which calendar it books into. You set those during setup.</p>
        </div>
      </section>
      <CtaBand title={<>See it with <em>your</em> business in it.</>} body="On a demo we'll build the walkthrough around your services, hours and the questions your customers actually ask." secondary={{ href: "/pricing", label: "Or compare plans first" }} />
    </>
  );
}
