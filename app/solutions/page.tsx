import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/home/Sections";
import { SOLUTIONS } from "@/lib/solutions";
import { Arrow } from "@/components/Button";

export const metadata: Metadata = {
  title: "Who it's for",
  description: "BetterDesk is built for appointment-based service businesses: home services first, then salons and spas, cleaning, auto and other local services.",
  alternates: { canonical: "/solutions" },
};

const OTHERS = [
  { k: "Cleaning companies", v: "Quote requests answered while your crews are working, with your service area and minimums." },
  { k: "Auto shops", v: "Missed calls from the bay get a text back and a drop-off time where your schedule is connected." },
  { k: "Clinics and practices", v: "Front-desk overflow and after-hours questions. Talk to us about your requirements before connecting any patient information." },
];

export default function SolutionsPage() {
  return (
    <>
      <PageIntro title="Built for businesses where a missed call is a missed job.">
        <p>BetterDesk fits best where people call to book: the work happens away from the phone, and a quick answer decides who gets the job.</p>
      </PageIntro>
      <section aria-label="Industries" className="bg-porcelain pb-24 md:pb-32">
        <div className="wrap">
          <ul className="border-t border-ink">
            {SOLUTIONS.map((s, i) => (
              <li key={s.slug} className="border-b border-rule">
                <Link href={`/solutions/${s.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:items-baseline md:gap-8 md:py-14">
                  <span className="t-label md:col-span-2">{i === 0 ? "Where we started" : "Also a strong fit"}</span>
                  <span className="md:col-span-5">
                    <span className="t-title block transition-colors group-hover:text-signal-ink">{s.name}</span>
                    <span className="mt-3 block text-[0.9375rem] text-muted">{s.who.join(", ")}</span>
                  </span>
                  <span className="text-[1.0625rem] leading-relaxed text-ink-2 md:col-span-4">{s.lede}</span>
                  <span className="hidden justify-self-end md:col-span-1 md:block"><Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="t-title mt-24">Other service businesses.</h2>
          <dl className="mt-8 grid border-t border-rule md:grid-cols-3">
            {OTHERS.map((o, i) => (
              <div key={o.k} className={`border-b border-rule py-6 md:border-b-0 md:py-8 ${i > 0 ? "md:border-l md:pl-7" : ""} md:pr-7`}>
                <dt className="text-[1.125rem] font-semibold">{o.k}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{o.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <CloseCta />
    </>
  );
}
