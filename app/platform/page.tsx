import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { InboxCanvas } from "@/components/home/InboxCanvas";
import { ApprovedAnswers } from "@/components/home/ApprovedAnswers";
import { YouStayInCharge, CloseCta } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "Product",
  description: "What BetterDesk does: missed-call text-back, replies from your approved answers, follow-up, booking or handoff, and one inbox for every conversation.",
  alternates: { canonical: "/platform" },
};

const CHANNELS = [
  { ch: "Phone calls", how: "When a call goes unanswered, the caller gets a text back in your business's name.", plan: "Every plan" },
  { ch: "Text messages", how: "Replies to customers who text your business number.", plan: "Every plan" },
  { ch: "Website forms", how: "Replies to form submissions, day or night.", plan: "Every plan" },
  { ch: "Instagram DMs", how: "Answers direct messages from your business account.", plan: "Growth and Scale" },
  { ch: "Google Business messages", how: "Answers people who message you from your Google listing.", plan: "Growth and Scale" },
  { ch: "Email", how: "Replies to inquiries sent to your business inbox.", plan: "Growth and Scale" },
];

const JOBS = [
  { k: "Reply", v: "A text back within moments of a missed call, or a reply to a message, in your business's name." },
  { k: "Ask", v: "The intake questions you'd ask: what's going on, where, how urgent. You write them." },
  { k: "Follow up", v: "If the customer goes quiet, a follow-up at a sensible time. Basic on Starter, multi-step on Growth and up." },
  { k: "Book or hand off", v: "Your real open times where your calendar is connected. Otherwise the request goes to your team to confirm." },
  { k: "Keep you in the loop", v: "Every conversation in one inbox. Owner alerts and a plain-English weekly summary on Growth and up." },
];

export default function PlatformPage() {
  return (
    <>
      <PageIntro title="One front desk for every way customers reach you.">
        <p>BetterDesk replies when you can&rsquo;t, asks your questions, follows up, and turns the conversation into a booking or a clean handoff to your team.</p>
      </PageIntro>

      <section aria-labelledby="jobs-title" className="bg-porcelain pb-24">
        <div className="wrap">
          <h2 id="jobs-title" className="sr-only">What BetterDesk does</h2>
          <ol className="grid border-t border-ink md:grid-cols-5">
            {JOBS.map((j, i) => (
              <li key={j.k} className={`border-b border-rule py-6 md:border-b-0 md:py-8 md:pr-6 ${i > 0 ? "md:border-l md:pl-6" : ""}`}>
                <p className="text-[1.25rem] font-semibold tracking-[-0.02em]">{j.k}</p>
                <p className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{j.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="inbox-title" className="bg-porcelain-2 py-24 md:py-32">
        <div className="wrap">
          <h2 id="inbox-title" className="t-title max-w-[20ch]">The inbox: what happened, and what needs you.</h2>
        </div>
        <div className="mx-auto mt-12 max-w-[92rem] px-2 sm:px-6">
          <InboxCanvas />
          <p className="illustrative wrap mt-3">Sample inbox. Names, messages and rules are illustrative.</p>
        </div>
      </section>

      <section aria-labelledby="channels-title" className="bg-porcelain py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="channels-title" className="t-title max-w-[14ch]">Where it answers.</h2>
            <p className="mt-5 max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-2">Which of these connect for your business is confirmed on the demo call, before you sign up.</p>
          </div>
          <table className="w-full border-collapse text-left text-[0.9375rem] lg:col-span-8">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="py-3 pr-4 font-[550]">Channel</th>
                <th scope="col" className="hidden py-3 pr-4 font-[550] sm:table-cell">What BetterDesk does</th>
                <th scope="col" className="py-3 text-right font-[550]">Plans</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.ch} className="border-b border-rule align-top">
                  <th scope="row" className="py-4 pr-4 font-[550]">
                    {c.ch}
                    <span className="mt-1 block font-normal text-ink-2 sm:hidden">{c.how}</span>
                  </th>
                  <td className="hidden py-4 pr-4 text-ink-2 sm:table-cell">{c.how}</td>
                  <td className="whitespace-nowrap py-4 text-right text-muted">{c.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="answers-title" className="border-t border-rule bg-porcelain py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <h2 id="answers-title" className="t-title max-w-[14ch]">Your answers, your rules.</h2>
            <p className="mt-5 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-2">Hours, service area, what a visit costs, what counts as urgent and who gets alerted. Written with you during setup, changed whenever you like.</p>
          </div>
          <div className="lg:col-span-8"><ApprovedAnswers /></div>
        </div>
      </section>

      <section aria-label="Control and limits" className="border-t border-rule bg-porcelain py-24 md:py-32">
        <div className="wrap"><YouStayInCharge /></div>
      </section>
      <CloseCta />
    </>
  );
}
