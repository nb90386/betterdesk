"use client";

import { useState } from "react";
import { BIZ } from "@/lib/story";

type State = "Booked" | "Waiting for your OK" | "Handed to you" | "Answered" | "Following up";
type Thread = {
  who: string;
  channel: string;
  plan?: "Growth";
  state: State;
  when: string;
  preview: string;
  lines: { from: "customer" | "desk" | "note"; text: string }[];
};

/** Sample inbox. Every row illustrates one documented behaviour; channel plan-gating matches /pricing. */
const THREADS: Thread[] = [
  {
    who: "Jess R.",
    channel: "Missed call → text",
    state: "Booked",
    when: "3:33 PM",
    preview: "8–10 please",
    lines: [
      { from: "desk", text: "Hi, this is Alder Plumbing. Sorry we missed your call, we're out on a job. What's going on?" },
      { from: "customer", text: "Water heater is leaking in the garage. Slow drip. 78704" },
      { from: "desk", text: "We can be there Thursday 8–10 AM or 1–3 PM. Which works?" },
      { from: "customer", text: "8–10 please" },
      { from: "note", text: "Booked Thu 8:00–10:00 AM on the connected calendar." },
    ],
  },
  {
    who: "Dan K.",
    channel: "SMS",
    state: "Handed to you",
    when: "3:02 PM",
    preview: "I think I smell gas near the furnace",
    lines: [
      { from: "customer", text: "I think I smell gas near the furnace" },
      { from: "desk", text: "Please leave the house now and call your gas company's emergency line from outside. I'm getting Marco for you right away." },
      { from: "note", text: "Your rule: gas smell → safety message, then alert Marco. Marco was alerted at 3:02 PM." },
    ],
  },
  {
    who: "Priya S.",
    channel: "Web form",
    state: "Waiting for your OK",
    when: "1:47 PM",
    preview: "Quote for replacing a tankless unit?",
    lines: [
      { from: "customer", text: "How much to replace a tankless water heater? Ours is about 12 years old." },
      { from: "note", text: "Draft reply, waiting for you: “Replacements depend on the unit and the venting, so we quote after a free estimate visit. Would Friday morning work for one?”" },
    ],
  },
  {
    who: "Tom B.",
    channel: "Google Business",
    plan: "Growth",
    state: "Answered",
    when: "11:20 AM",
    preview: "Do you work in Round Rock?",
    lines: [
      { from: "customer", text: "Do you work in Round Rock?" },
      { from: "desk", text: "We don't cover Round Rock yet, sorry. Our service area is central Austin, zip codes 78701 to 78759." },
      { from: "note", text: "Answered from your service-area rule." },
    ],
  },
  {
    who: "Ana L.",
    channel: "Instagram",
    plan: "Growth",
    state: "Following up",
    when: "Yesterday",
    preview: "Following up on the estimate",
    lines: [
      { from: "customer", text: "Can someone look at a slow drain next week?" },
      { from: "desk", text: "Yes. We have Tuesday 1–3 PM or Wednesday 8–10 AM. Which works?" },
      { from: "note", text: "No reply yet. One follow-up is scheduled for tomorrow at 10 AM." },
    ],
  },
];

const dot: Record<State, string> = {
  Booked: "bg-ink",
  "Waiting for your OK": "bg-signal",
  "Handed to you": "bg-signal",
  Answered: "bg-rule-strong",
  "Following up": "bg-rule-strong",
};

export function InboxCanvas() {
  const [sel, setSel] = useState(0);
  const t = THREADS[sel];
  return (
    <div className="panel overflow-hidden shadow-[var(--shadow-lift)]">
      <div className="flex items-center justify-between border-b border-rule px-4 py-3 sm:px-5">
        <p className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{BIZ} · Inbox</p>
        <p className="text-[0.8125rem] text-muted">Today, 5 conversations</p>
      </div>
      <div className="grid md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <ul className="divide-y divide-rule border-b border-rule md:border-b-0 md:border-r" aria-label="Conversations">
          {THREADS.map((th, i) => (
            <li key={th.who}>
              <button
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={i === sel}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors sm:px-5 ${i === sel ? "bg-mineral-2" : "hover:bg-mineral"}`}
              >
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dot[th.state]}`} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.9375rem] font-[550]">{th.who}</span>
                    <span className="t-mono shrink-0 text-[0.75rem] text-muted">{th.when}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[0.875rem] text-ink-2">{th.preview}</span>
                  <span className="mt-1 block text-[0.75rem] text-muted">
                    {th.state} · {th.channel}
                    {th.plan ? ` · ${th.plan} plan` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex min-h-[22rem] flex-col p-4 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3">
            <p className="text-[1.0625rem] font-semibold">{t.who}</p>
            <p className="text-[0.8125rem] text-muted">{t.state} · via {t.channel}</p>
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-2.5">
            {t.lines.map((l, i) =>
              l.from === "note" ? (
                <p key={i} className="mt-1 border-t border-dashed border-rule-strong pt-3 text-[0.875rem] text-ink-2">
                  <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-signal" aria-hidden="true" />
                  {l.text}
                </p>
              ) : (
                <p
                  key={i}
                  className={`max-w-[85%] rounded-[var(--radius-md)] px-3.5 py-2.5 text-[0.9375rem] leading-snug ${
                    l.from === "desk" ? "self-start bg-mineral-2" : "self-end bg-ink text-mineral"
                  }`}
                >
                  {l.text}
                </p>
              ),
            )}
          </div>
          {t.state === "Waiting for your OK" ? (
            <p className="mt-5 text-[0.875rem] text-muted">In assisted mode nothing is sent until you approve or edit it.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
