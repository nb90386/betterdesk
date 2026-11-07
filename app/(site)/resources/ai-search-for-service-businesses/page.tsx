import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadGuide } from "@/lib/marketing/guides";
import { Markdown } from "@/lib/marketing/markdown";
import { ButtonLink, TextLink } from "@/components/site/primitives";
import { SITE_URL } from "@/lib/site";

const SLUG = "ai-search-for-service-businesses";

export function generateMetadata(): Metadata {
  const g = loadGuide(SLUG);
  return { title: g?.meta.title ?? "Guide", description: g?.meta.description, alternates: { canonical: `/resources/${SLUG}` }, openGraph: { type: "article" } };
}

export default function Guide() {
  const g = loadGuide(SLUG);
  if (!g) notFound();
  const toc = g.blocks.filter((b) => b.t === "h" && b.level === 2) as { text: string; id: string }[];
  const updated = new Date(`${g.meta.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: g.meta.title, description: g.meta.description, dateModified: g.meta.updated, author: { "@type": "Organization", name: "BetterDesk" }, mainEntityOfPage: `${SITE_URL}/resources/${SLUG}` };
  return (
    <article className="wrap pb-24 pt-32 md:pt-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-9">
          <p className="text-[0.875rem] text-muted">
            Updated <time dateTime={g.meta.updated}>{updated}</time>, about {g.minutes} minutes to read
          </p>
          <h1 className="t-display mt-4 max-w-[24ch]">{g.meta.title}</h1>
          <p className="t-lede mt-6 max-w-[60ch]">{g.meta.description}</p>
        </header>
        <aside className="hidden lg:col-span-3 lg:row-span-2 lg:block">
          <nav aria-label="In this guide" className="sticky top-28">
            <p className="t-label">In this guide</p>
            <ul className="mt-2">
              {toc.map((h) => (
                <li key={h.id} className="border-b border-rule">
                  <a href={`#${h.id}`} className="block py-2 text-[0.875rem] leading-snug text-ink-2 hover:text-ink">{h.text}</a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <TextLink href="/product/presence#check">Check your website</TextLink>
            </div>
          </nav>
        </aside>
        <div className="max-w-[68ch] lg:col-span-8">
          <Markdown blocks={g.blocks} />
          <div className="mt-16 border-t border-rule-strong pt-8">
            <p className="text-[1.25rem] font-[600] tracking-[-0.015em]">Want to see where your own site stands?</p>
            <p className="mt-2 text-ink-2">Presence runs the checks in this guide on a site you own, free during early access.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ButtonLink href="/product/presence#check">Check your website</ButtonLink>
              <TextLink href="/contact">Ask a person instead</TextLink>
            </div>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
