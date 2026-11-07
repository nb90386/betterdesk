import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, loadGuide } from "@/lib/marketing/guides";

export const metadata: Metadata = {
  title: "Guides for commercial cleaning companies",
  description: "Plain, sourced guides on how customers find cleaning companies in Google and AI search, and what you can actually control.",
  alternates: { canonical: "/resources" },
};

const PLANNED = [
  "Turning a website inquiry into a booked walkthrough",
  "What to put on a commercial cleaning service-area page",
  "Following up on a cleaning proposal without nagging",
];

export default function Resources() {
  const guides = GUIDES.map((g) => loadGuide(g.slug)!).filter(Boolean);
  return (
    <section className="wrap pb-24 pt-32 md:pt-40">
      <h1 className="t-display max-w-[16ch]">Guides, written to be useful.</h1>
      <p className="t-lede mt-6 max-w-[56ch]">Each one sticks to what the search companies have actually published, names its sources, and says where nobody knows the answer.</p>
      <ul className="mt-14 border-t border-rule-strong">
        {guides.map((g) => (
          <li key={g.slug} className="border-b border-rule">
            <Link href={`/resources/${g.slug}`} className="group grid gap-2 py-7 md:grid-cols-12 md:gap-8">
              <span className="text-[0.875rem] text-muted md:col-span-2">Updated {g.meta.updated}</span>
              <span className="md:col-span-7">
                <span className="block text-[1.5rem] font-[600] leading-tight tracking-[-0.02em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{g.meta.title}</span>
                <span className="mt-2 block text-ink-2">{g.meta.description}</span>
              </span>
              <span className="text-[0.875rem] text-muted md:col-span-3 md:text-right">About {g.minutes} minutes</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-16 grid gap-6 md:grid-cols-12">
        <h2 className="t-label md:col-span-2">Being written</h2>
        <ul className="md:col-span-7">
          {PLANNED.map((t) => (
            <li key={t} className="border-b border-rule py-3 text-ink-2">{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
