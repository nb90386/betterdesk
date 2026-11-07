import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ValueCalculator } from "@/components/ValueCalculator";
import { CloseCta } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "Value calculator",
  description: "Estimate what faster replies to missed calls could be worth to your business, using your own numbers. An illustration, not a guarantee.",
  alternates: { canonical: "/roi" },
};

export default function RoiPage() {
  return (
    <>
      <PageIntro title="What is a missed call worth to you?">
        <p>Four numbers you already know roughly. We don&rsquo;t publish average results, because we don&rsquo;t want to promise yours.</p>
      </PageIntro>
      <section aria-label="Calculator" className="bg-mineral pb-24 md:pb-32">
        <div className="wrap"><ValueCalculator /></div>
      </section>
      <CloseCta compact title="Check the math with us." lede="Bring your numbers. If BetterDesk wouldn’t pay for itself, we’ll say so." />
    </>
  );
}
