import type { Metadata } from "next";
import { DeskMoment } from "@/components/site/DeskMoment";
import { ButtonLink, SampleNote, StatusMark, TextLink, type Status } from "@/components/site/primitives";
import { STAGES, STAGE_LABEL } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Desk: from inquiry to booked walkthrough",
  description: "Inquiries, replies, walkthrough booking and the pipeline in one record per account, with how each customer says they found you.",
  alternates: { canonical: "/desk" },
};

const PARTS: [string, string, Status][] = [
  ["Unified inbox", "Website inquiries and replies to your introductions, each next to its account’s history.", "DEMO"],
  ["Suggested replies", "Built only from your sender details and open times. It never quotes a price you haven’t approved.", "DEMO"],
  ["Walkthrough booking", "Pick a time, the stage moves, the record updates. Real invites need a connected Google or Microsoft calendar.", "DEMO"],
  ["Pipeline and follow-ups", "Stages from new to won, an owner and a next step on every account, and a nudge when a proposal goes quiet.", "DEMO"],
  ["Website form intake", "Your own site’s form posting into Desk with the visitor’s answer to “how did you find us?”", "PLANNED"],
  ["Email and calendar connection", "Reading a shared inbox and calendar availability needs your authorization and is not built yet.", "BLOCKED"],
];

export default function Desk() {
  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <h1 className="t-display max-w-[17ch]">Every inquiry answered, every walkthrough on the calendar.</h1>
        <div className="mt-7 grid gap-8">
          <p className="t-lede max-w-[56ch]">
            When a property manager asks for a quote, the worst outcome is a slow reply. Desk keeps the inquiry, the account’s history and your open times together, so the answer is quick and the next step is never lost.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <ButtonLink href="/demo">Try the demo</ButtonLink>
            <TextLink href="/app/inbox">Open the sample inbox</TextLink>
          </div>
        </div>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <div className="border-t border-rule-strong pt-10">
          <DeskMoment />
          <SampleNote className="mt-6">Fictional inquiry. Replies and bookings are simulated in your browser; nothing is sent.</SampleNote>
        </div>
      </section>

      <section className="on-graphite bg-graphite-2">
        <div className="wrap py-20 md:py-28">
          <h2 className="t-title max-w-[22ch]">Stages built around the walkthrough.</h2>
          <p className="mt-5 max-w-[60ch] text-ink-2">Commercial cleaning contracts are usually won in the building, not on the phone. The pipeline says so.</p>
          <ol className="mt-10 grid border-t border-rule sm:grid-cols-3 lg:grid-cols-9">
            {STAGES.map((s, i) => (
              <li key={s} className="border-b border-rule py-4 pr-4 lg:border-b-0 lg:border-r lg:px-3 lg:py-5 lg:first:pl-0 lg:last:border-r-0">
                <span className="block text-[0.75rem] tabular-nums text-muted">{i + 1}</span>
                <span className={`mt-1 block leading-snug ${s === "walkthrough-scheduled" ? "font-[600] text-ink" : "text-ink-2"}`}>{STAGE_LABEL[s]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="t-title max-w-[12ch]">What’s working, what isn’t yet.</h2>
          <div className="mt-6"><TextLink href="/app/inbox">Open the sample inbox</TextLink></div>
        </div>
        <ul className="lg:col-span-8">
          {PARTS.map(([t, d, st]) => (
            <li key={t} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[1fr_10rem] sm:gap-6">
              <div>
                <p className="font-[600]">{t}</p>
                <p className="mt-0.5 text-[0.9375rem] text-muted">{d}</p>
              </div>
              <StatusMark status={st} className="sm:justify-end" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
