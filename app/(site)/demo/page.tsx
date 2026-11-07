import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SignalToBooking } from "@/components/home/SignalToBooking";
import { InboxCanvas } from "@/components/home/InboxCanvas";
import { CloseCta } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "See a conversation",
  description: "Watch one illustrative missed call become a booked appointment, then click through a sample BetterDesk inbox.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <PageIntro title="See one missed call become a booking.">
        <p>An illustrative afternoon at a small plumbing company. Press play, or scroll through it at your own pace. Then click through the inbox it lands in.</p>
      </PageIntro>
      <SignalToBooking id="walkthrough" />
      <section aria-labelledby="inbox-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap">
          <h2 id="inbox-title" className="t-title max-w-[20ch]">Where it lands: the owner&rsquo;s inbox.</h2>
          <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2">Tap each conversation. One was booked, one was urgent and went straight to the owner, one is waiting for approval.</p>
        </div>
        <div className="mx-auto mt-12 max-w-[92rem] px-2 sm:px-6">
          <InboxCanvas />
          <p className="illustrative wrap mt-3">Sample inbox. Names, messages and rules are illustrative, not customer data.</p>
        </div>
      </section>
      <CloseCta compact title="Want to see it with your business in it?" lede="We rebuild this conversation with your services, hours and service area." />
    </>
  );
}
