import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/CloseCta";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Product",
  description: "Inside BetterDesk: Today, Scout, opportunities with evidence, one customer record and timeline, an inbox for inquiries, a pipeline built around walkthroughs and proposals.",
  alternates: { canonical: "/product" },
};

const VIEWS = [
  { id: "today", title: "Today", body: "Opens on what needs you, in order: drafts to approve, people waiting for a reply, proposals gone quiet, anything blocked. Then upcoming walkthroughs and the pipeline. No wall of charts.", img: "/product/today.webp", w: 960, h: 600, alt: "BetterDesk Today screen listing items that need attention, upcoming walkthroughs and pipeline counts" },
  { id: "opportunities", title: "Opportunities, with the reasons", body: "Every business you're working, wherever it came from. Select one and the inspector shows each qualification rule, the evidence behind it, its source and date, and what's still unknown.", img: "/product/opportunities.webp", w: 700, h: 860, alt: "Opportunities list with the qualification inspector open for Juniper Lane Law" },
  { id: "record", title: "One record per building", body: "Contacts, conversations, the walkthrough, the proposal and the outcome all live on the same record, with a timeline of every step and who took it.", img: "/product/record.webp", w: 1000, h: 760, alt: "Customer record for Juniper Lane Law with a timeline of import, qualification, approval, reply and booking" },
  { id: "pipeline", title: "A pipeline built around walkthroughs", body: "Stages that match how commercial cleaning is sold: qualified, outreach prepared, contacted, in conversation, walkthrough scheduled, proposal, won or lost. Move a card from its stage menu; every change is recorded.", img: "/product/pipeline.webp", w: 1180, h: 620, alt: "Pipeline board with opportunities in each stage" },
];

export default function ProductPage() {
  return (
    <>
      <PageIntro title="Everything about a contract, in one place." aside={<ButtonLink href="/app" variant="signal">Open the sample workspace</ButtonLink>}>
        <p>Find businesses, qualify them with evidence, introduce yourself, answer inquiries, book the walkthrough and track the proposal, without copying anything between tools.</p>
      </PageIntro>
      {VIEWS.map((v, i) => (
        <section key={v.id} aria-labelledby={`${v.id}-h`} className={`${i % 2 ? "bg-mineral-2" : "bg-mineral"} py-20 md:py-28`}>
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className={`lg:col-span-4 ${i % 2 ? "lg:order-2 lg:col-start-9" : ""}`}>
              <h2 id={`${v.id}-h`} className="t-title max-w-[16ch]">{v.title}</h2>
              <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2">{v.body}</p>
            </div>
            <figure className={`lg:col-span-8 ${i % 2 ? "lg:order-1" : ""}`}>
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-mineral shadow-[var(--shadow-object)]">
                <Image src={v.img} alt={v.alt} width={v.w} height={v.h} sizes="(min-width: 1024px) 60vw, 100vw" className={`h-auto w-full ${v.w < 800 ? "mx-auto max-w-[44rem]" : ""}`} />
              </div>
              <figcaption className="mt-3 text-[0.8125rem] text-muted">Detail from the sample workspace, captured from the running app. Fictional company and contacts. <a href="/app" className="underline underline-offset-2">Open it yourself</a>.</figcaption>
            </figure>
          </div>
        </section>
      ))}
      <section aria-labelledby="status-h" className="border-t border-rule bg-mineral py-20 md:py-24">
        <div className="wrap">
          <h2 id="status-h" className="t-title">What works today, and what doesn&rsquo;t yet.</h2>
          <table className="mt-8 w-full border-collapse text-left text-[0.9375rem]">
            <thead><tr className="border-b border-ink"><th scope="col" className="py-3 pr-4 font-medium">Capability</th><th scope="col" className="py-3 pr-4 font-medium">Status</th><th scope="col" className="hidden py-3 font-medium md:table-cell">Notes</th></tr></thead>
            <tbody>
              {[
                ["Prospect list import, de-duplication, qualification with evidence", "Works in the sample workspace", "Runs in your browser on fictional data."],
                ["Introduction drafting and approval", "Works in the sample workspace", "Template-based; only states facts from your records."],
                ["Inbox, customer records, timeline, pipeline", "Works in the sample workspace", "Replies and delivery are simulated and labelled."],
                ["Sending from your own mailbox", "Not available yet", "Needs Google or Microsoft connection and sender details."],
                ["Calendar connection", "Not available yet", "Walkthroughs book onto a sample calendar for now."],
                ["Team accounts and saved data", "Not available yet", "Database with per-company isolation is designed, not connected."],
                ["Text messages and calls", "Off by design", "Only with documented written consent and a legal review."],
              ].map(([a, b, c]) => <tr key={a} className="border-b border-rule align-top"><th scope="row" className="py-3.5 pr-4 font-normal">{a}</th><td className={`py-3.5 pr-4 font-medium ${b.startsWith("Works") ? "text-signal-ink" : "text-attention"}`}>{b}</td><td className="hidden py-3.5 text-muted md:table-cell">{c}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <CloseCta />
    </>
  );
}
