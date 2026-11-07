import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Arrow } from "@/components/Button";
import { SOLUTIONS } from "@/lib/solutions";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Who BetterDesk is built for: home services, beauty and wellness, and other appointment-based service businesses.",
  alternates: { canonical: "/solutions" },
};

const OTHERS = [
  ["Cleaning companies", "Quote requests that need square footage, dates and add-ons before anyone can price them."],
  ["Auto shops", "Common questions and drop-off bookings, so the service writer can stay at the counter."],
  ["Contractors and remodelers", "Estimate requests answered and scheduled while you're on site."],
  ["Clinics and practices", "Possible, but talk to us first about your privacy and compliance requirements before connecting patient data."],
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero eyebrow="Solutions" title={<>If customers call you to book work, it fits.</>}>
        <p>BetterDesk is built for local service businesses where an unanswered call is usually a lost job. Two industries have their own pages; the rest follow the same pattern.</p>
      </PageHero>
      <section className="container-bd grid gap-4 py-14 md:grid-cols-2 md:py-20">
        {SOLUTIONS.map((s, i) => (
          <Link key={s.slug} href={`/solutions/${s.slug}`} className={`group rounded-[var(--radius-xl)] p-7 sm:p-9 ${i === 0 ? "bg-ink text-card" : "border border-rule bg-card text-ink"}`}>
            <p className={`text-[0.74rem] font-medium ${i === 0 ? "text-night-muted" : "text-muted"}`}>{s.name}</p>
            <h2 className="mt-3 font-display text-[2rem] leading-[1.08] tracking-[-0.02em]">{s.title} {s.titleEm}</h2>
            <p className={`mt-3 text-[0.95rem] leading-relaxed ${i === 0 ? "text-card/75" : "text-ink-2"}`}>{s.who.slice(0, 5).join(" · ")}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-[0.92rem] font-medium">Read more <Arrow /></span>
          </Link>
        ))}
      </section>
      <section className="container-bd pb-24" aria-labelledby="others">
        <h2 id="others" className="eyebrow">Also a fit</h2>
        <dl className="mt-5 divide-y divide-rule border-y border-rule">
          {OTHERS.map(([k, v]) => (
            <div key={k} className="grid gap-2 py-5 md:grid-cols-[280px_1fr]">
              <dt className="text-[1.02rem] font-semibold text-ink">{k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <CtaBand />
    </>
  );
}
