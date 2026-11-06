import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RoiCalculator } from "@/components/RoiCalculator";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "ROI calculator",
  description: "Estimate what faster replies to missed calls and messages could be worth, using your own numbers and a visible formula.",
  alternates: { canonical: "/roi" },
};

export default function RoiPage() {
  return (
    <>
      <PageHero eyebrow="ROI calculator" title={<>Do the math with your numbers.</>}>
        <p>Four inputs, one formula you can see. The defaults are deliberately modest; change them to match your call log and your typical job.</p>
      </PageHero>
      <section className="container-bd py-12 md:py-16">
        <RoiCalculator />
        <div className="mt-10 grid gap-6 text-[0.92rem] leading-relaxed text-ink-2 md:grid-cols-3">
          <p><strong className="font-medium text-ink">Where to find &ldquo;unanswered&rdquo;:</strong> your phone&rsquo;s missed-call log for a normal week, plus texts and forms that waited more than an hour.</p>
          <p><strong className="font-medium text-ink">Why two percentages:</strong> not every missed caller will text back, and not every conversation becomes a job. Keeping them separate stops the estimate from quietly assuming the best case.</p>
          <p><strong className="font-medium text-ink">What it leaves out:</strong> repeat customers, referrals and reviews, which can matter more than the first job, and the time your team saves. We kept those out so the number isn&rsquo;t inflated.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
