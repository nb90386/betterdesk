import type { Metadata } from "next";
import { PresenceExplorer } from "@/components/site/PresenceExplorer";
import { PresenceAudit } from "@/components/site/PresenceAudit";
import { BotAccessTable, CoverageList, Limitations, SchemaDraft } from "@/components/site/PresenceDetails";
import { ButtonLink, SampleNote, StatusMark, TextLink } from "@/components/site/primitives";
import { runSampleAudit } from "@/lib/presence/sample";

export const metadata: Metadata = {
  title: "Presence: how customers find your cleaning company",
  description: "See whether Google, maps and AI search can read your website, what information is missing, and a practical fix list with owners. No ranking promises.",
  alternates: { canonical: "/product/presence" },
};

const WAYS = [
  {
    name: "Search results",
    reads: "Your pages: titles, headings, the words on each service page.",
    you: "Make each service and area its own clear page that search engines are allowed to list.",
  },
  {
    name: "Maps and local results",
    reads: "Your Google Business Profile, plus your name, phone and area matching your site.",
    you: "Keep one name and one phone number everywhere, and a realistic service area.",
  },
  {
    name: "AI answers",
    reads: "Pages its crawler is allowed to fetch, often the same pages search already uses.",
    you: "Don’t block the search crawlers by accident, and say plainly what you do and where.",
  },
] as const;

const SOURCES = [
  ["Google: AI features and your website", "https://developers.google.com/search/docs/appearance/ai-features"],
  ["Google: Optimizing for generative AI features", "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide"],
  ["Google: structured data guidelines", "https://developers.google.com/search/docs/appearance/structured-data/sd-policies"],
  ["OpenAI: overview of OpenAI crawlers", "https://developers.openai.com/api/docs/bots"],
  ["Anthropic: Claude crawlers", "https://support.claude.com/en/articles/8896518"],
  ["Bing: AI Performance in Webmaster Tools", "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview"],
] as const;

export default function PresencePage() {
  const sample = runSampleAudit();
  const lead = sample.findings[0];
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="t-display max-w-[18ch]">Customers are starting their search in new places. Know where your business stands.</h1>
            <p className="t-lede mt-7 max-w-[50ch]">
              Presence checks whether your website can be found and read, finds what’s missing, and turns it into a fix list with owners, whether customers search Google, look at a map or ask an AI assistant.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ButtonLink href="#check">Check your website</ButtonLink>
              <TextLink href="#sample">See a sample report</TextLink>
              <StatusMark status="BETA" />
            </div>
          </div>
          {lead ? (
            <figure className="paper p-5 lg:col-span-5" aria-label="One finding from the sample report">
              <figcaption className="flex items-baseline justify-between gap-3 text-[0.8125rem] text-muted">
                <span>From the sample report</span>
                <span>clearline.example</span>
              </figcaption>
              <p className="mt-3 text-[1.1875rem] font-[600] leading-snug tracking-[-0.015em]">{lead.title}</p>
              <div className="mt-3 overflow-hidden rounded-[8px] bg-graphite-2 text-graphite-ink">
                <p className="border-b border-graphite-rule px-3 py-2 text-[0.75rem] text-graphite-muted [overflow-wrap:anywhere]">{lead.evidence.url}</p>
                {lead.evidence.excerpt ? <pre className="t-code whitespace-pre-wrap px-3 py-2.5">{lead.evidence.excerpt}</pre> : null}
              </div>
              <p className="mt-3 text-[0.9375rem] text-ink-2">{lead.fix}</p>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="wrap py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 className="t-title max-w-[16ch] lg:col-span-5">Three ways people find a cleaning company.</h2>
            <p className="max-w-[58ch] text-ink-2 lg:col-span-7">
              You may hear this called SEO, local SEO and GEO (generative engine optimization). They share the same foundation. Google says it plainly: optimizing for its AI search features “is optimizing for the search experience, and thus still SEO,” and there is “no special schema.org structured data that you need to add.”
            </p>
          </div>
          <div className="mt-12 relative overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-rule-strong text-[0.8125rem] text-muted">
                  <th scope="col" className="w-[22%] py-3 pr-6 font-[560]">Where they look</th>
                  <th scope="col" className="py-3 pr-6 font-[560]">What it reads</th>
                  <th scope="col" className="py-3 font-[560]">What you control</th>
                </tr>
              </thead>
              <tbody>
                {WAYS.map((w) => (
                  <tr key={w.name} className="border-b border-rule align-top">
                    <th scope="row" className="py-5 pr-6 text-[1.125rem] font-[600] tracking-[-0.01em]">{w.name}</th>
                    <td className="py-5 pr-6 text-ink-2">{w.reads}</td>
                    <td className="py-5 text-ink-2">{w.you}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[72ch] text-[0.9375rem] text-muted">
            AI answers change with the question, the day, the place and the person asking. Nobody outside those companies can see exactly how sources are chosen, so Presence never reports a “ranking” in ChatGPT or anywhere else. It checks the things you can actually change.
          </p>
        </div>
      </section>

      <section id="sample" className="wrap py-20 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="t-title">A sample report.</h2>
            <p className="t-lede mt-4 max-w-[60ch]">The real checks, run on a fictional company’s website that ships with this page. Pick a finding to see the evidence and the fix, then turn it into a task.</p>
          </div>
          <SampleNote className="max-w-[34ch]">Clearline Commercial Cleaning and clearline.example are fictional. The site has realistic mistakes on purpose.</SampleNote>
        </div>
        <PresenceExplorer report={sample} />
        <div className="mt-16">
          <CoverageList report={sample} />
        </div>
        <details className="group mt-12 border-t border-rule-strong">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.125rem] font-[600] tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
            For your web person: crawler access and a structured-data draft
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
          </summary>
          <div className="grid gap-16 pb-6 pt-4">
            <BotAccessTable report={sample} />
            <SchemaDraft report={sample} />
          </div>
        </details>
      </section>

      <section id="check" className="on-graphite bg-graphite-2">
        <div className="wrap py-20 md:py-28">
          <div className="mb-10 grid gap-6 lg:grid-cols-12">
            <h2 className="t-title max-w-[14ch] lg:col-span-5">Check your own website.</h2>
            <p className="max-w-[56ch] text-ink-2 lg:col-span-7">
              Free while BetterDesk is in early access. Results are a snapshot of your public site at this moment, not a measurement of how often anyone recommends you. Only audit a site you own or are allowed to check.
            </p>
          </div>
          <div className="on-stone">
            <PresenceAudit />
          </div>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-title max-w-[14ch]">What Presence can’t do.</h2>
            <p className="mt-5 text-ink-2">Stated so you can judge the results properly.</p>
          </div>
          <div className="lg:col-span-8">
            <Limitations report={sample} />
            <h3 className="t-label mt-10">Official sources we follow</h3>
            <ul className="mt-2 grid gap-x-10 md:grid-cols-2">
              {SOURCES.map(([t, href]) => (
                <li key={href} className="border-b border-rule">
                  <a href={href} className="link flex min-h-11 items-center text-[0.9375rem]" rel="noopener">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-surface">
        <div className="wrap grid gap-8 py-20 md:py-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="t-title max-w-[22ch]">A fix is a task. An inquiry keeps its source.</h2>
            <p className="t-lede mt-5 max-w-[56ch]">
              In BetterDesk, each finding becomes a task with an owner. When someone later fills in your form, they can tell you how they found you, and that answer stays on their record. We never claim a fix caused a lead.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 lg:col-span-5 lg:justify-end">
            <ButtonLink href="/demo">Try the demo</ButtonLink>
            <TextLink href="/resources/guides/ai-search-for-service-businesses">Read the plain guide</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}
