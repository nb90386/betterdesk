import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductExplorer } from "@/components/ProductExplorer";
import { SectionHeading } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Platform",
  description: "Inside BetterDesk: missed-call text-back, replies on your channels, booking, handoff to staff, follow-up and owner summaries.",
  alternates: { canonical: "/platform" },
};

const PARTS = [
  {
    n: "01",
    k: "Capture",
    h: "Every way a customer reaches you, in one place.",
    p: "Missed calls trigger a text back. Texts and website forms land in the same inbox on every plan. Instagram DMs, Google Business messages and email join on Growth and Scale.",
    limit: "Your team still answers when they can. How unanswered calls reach BetterDesk depends on your phone provider; we set it up with you.",
  },
  {
    n: "02",
    k: "Reply",
    h: "Answers from your business, not the internet.",
    p: "Replies are built from what you give it during setup: services, prices you're happy to share, hours, service area, policies and tone.",
    limit: "When a question falls outside that, it says it will check and hands it to a person.",
  },
  {
    n: "03",
    k: "Qualify",
    h: "Your intake questions, asked every time.",
    p: "What's wrong, where, how soon, what kind of appointment. The questions you'd ask on a callback, asked by text in the moment.",
    limit: "You choose the questions. Healthcare and other regulated businesses should talk to us before collecting sensitive details.",
  },
  {
    n: "04",
    k: "Book or hand off",
    h: "Routine work booked. Urgent work routed.",
    p: "Where your calendar or booking tool is connected, it offers real openings and books them. Your rules decide what goes straight to a person, like an emergency, a complaint or a big job.",
    limit: "If your booking tool can't be connected, BetterDesk collects the request and your team confirms the time.",
  },
  {
    n: "05",
    k: "Follow up",
    h: "Reminders and nudges that actually go out.",
    p: "Reminders before appointments, a check-in when a quote goes quiet, and on Growth and Scale, a review request after the job.",
    limit: "Follow-up stops when the customer books or asks you to stop.",
  },
  {
    n: "06",
    k: "Summary",
    h: "Know what happened without reading every thread.",
    p: "A plain-English weekly summary of what came in, what got booked, what went to your team, and suggested FAQ additions waiting for your approval. Owner alerts flag big or urgent leads as they happen.",
    limit: "Owner alerts and English-language analytics are on Growth and Scale.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero eyebrow="Platform" title={<>Everything between the first ring and <em>the booking.</em></>}>
        <p>Click around a sample workspace for a plumbing company: the inbox, the calendar it fills, the short list of things that need a person, and the summary the owner reads.</p>
      </PageHero>
      <section className="container-bd py-12 md:py-16" aria-label="Sample product workspace">
        <ProductExplorer />
        <p className="mt-4 text-[0.82rem] text-muted">Sample workspace with fictional customers. Buttons change the sample only; nothing is sent.</p>
      </section>

      <section className="container-bd py-16 md:py-24" aria-labelledby="parts-title">
        <SectionHeading eyebrow="How the pieces fit" id="parts-title" title={<>Six jobs a front desk does. <em>And where each one stops.</em></>}>
          <p>Each part below says what it does and what it doesn&rsquo;t. We&rsquo;d rather you know the edges before the demo.</p>
        </SectionHeading>
        <ol className="mt-14 divide-y divide-rule border-y border-rule">
          {PARTS.map((s) => (
            <li key={s.k} className="reveal grid gap-4 py-9 md:grid-cols-[80px_200px_1fr_1fr] md:gap-8">
              <span className="font-mono text-[0.85rem] text-signal">{s.n}</span>
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">{s.k}</h3>
              <div>
                <p className="font-display text-[1.45rem] leading-snug tracking-[-0.015em] text-ink">{s.h}</p>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-ink-2">{s.p}</p>
              </div>
              <p className="self-start rounded-[var(--radius-md)] border border-dashed border-rule-strong px-4 py-3 text-[0.88rem] leading-relaxed text-ink-2">
                <span className="mb-1 block font-mono text-[0.64rem] uppercase tracking-[0.08em] text-muted">Where it stops</span>
                {s.limit}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand />
    </>
  );
}
