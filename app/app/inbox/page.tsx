"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkspace } from "@/lib/demo/store";
import * as A from "@/lib/workspace/actions";
import { account, contactOf, oppOf } from "@/lib/workspace/selectors";
import { Btn, Empty, Notice, PageHeader, Panel, StageMark, fmtTime } from "@/components/app/ui";

const INTENT: Record<string, string> = { interested: "Interested", question: "Question", pricing: "Asked about price", walkthrough: "Wants a walkthrough", "not-interested": "Not interested", unsubscribe: "Opted out", "needs-review": "Needs a person" };

export default function InboxPage() {
  return <Suspense><Inbox /></Suspense>;
}

function Inbox() {
  const { ws, act } = useWorkspace();
  const params = useSearchParams();
  const router = useRouter();
  const sorted = [...ws.conversations].sort((a, b) => (b.messages.at(-1)?.at ?? "").localeCompare(a.messages.at(-1)?.at ?? ""));
  const selId = params.get("c") ?? sorted[0]?.id;
  const conv = ws.conversations.find((c) => c.id === selId);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const acc = conv ? account(ws, conv.accountId) : undefined;
  const opp = conv ? oppOf(ws, conv.accountId) : undefined;
  const contact = conv ? contactOf(ws, conv.accountId) : undefined;
  const text = conv ? draft[conv.id] ?? "" : "";

  return (
    <div className="space-y-6">
      <PageHeader title="Inbox" lede="Website inquiries and replies in one place, linked to the customer record. No mailbox is connected in the demo, so sending is simulated." actions={<Btn onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "Simulate a website inquiry"}</Btn>} />
      {showForm ? <InquiryForm onDone={() => setShowForm(false)} /> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,16rem)]">
        <Panel>
          {sorted.length === 0 ? <Empty title="No conversations" body="Inquiries and replies appear here." /> : (
            <ul className="divide-y divide-rule" aria-label="Conversations">
              {sorted.map((c) => {
                const last = c.messages.at(-1)!;
                const waiting = last.direction === "inbound";
                return (
                  <li key={c.id}>
                    <button type="button" onClick={() => { router.replace(`/app/inbox?c=${c.id}`, { scroll: false }); setNote(null); setErr(null); }} aria-current={c.id === selId ? "true" : undefined} className="block w-full px-4 py-3 text-left hover:bg-stone aria-[current=true]:bg-stone">
                      <span className="flex items-baseline justify-between gap-2"><span className="truncate text-[0.875rem] font-medium">{account(ws, c.accountId)?.name}</span><span className="shrink-0 text-[0.75rem] text-muted">{fmtTime(last.at)}</span></span>
                      <span className="mt-0.5 block truncate text-[0.8125rem] text-muted">{last.body}</span>
                      <span className={`mt-1 block text-[0.75rem] ${waiting ? "font-medium text-ink" : "text-muted"}`}>{waiting ? `Waiting for you · ${INTENT[last.intent ?? "needs-review"]}` : "You replied"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel>
          {!conv ? <Empty title="Select a conversation" body="" /> : (
            <div className="flex h-full flex-col">
              <div className="border-b border-rule px-4 py-3"><p className="text-[0.9375rem] font-semibold">{conv.subject}</p><p className="text-[0.8125rem] text-muted">{conv.channel === "web-form" ? "Website form" : "Email"} · {contact?.email}</p></div>
              <ol className="flex-1 space-y-3 px-4 py-4">
                {conv.messages.map((m) => (
                  <li key={m.id} className={`max-w-[88%] rounded-[var(--radius-md)] px-3.5 py-2.5 text-[0.875rem] leading-relaxed ${m.direction === "inbound" ? "bg-stone-2" : "ml-auto bg-ink text-stone"}`}>
                    <p className="whitespace-pre-line">{m.body}</p>
                    <p className={`mt-1 text-[0.6875rem] ${m.direction === "inbound" ? "text-muted" : "text-stone/70"}`}>{m.from} · {fmtTime(m.at)}{m.simulated ? " · sample" : ""}{m.intent ? ` · read as: ${INTENT[m.intent]}` : ""}</p>
                  </li>
                ))}
              </ol>
              <div className="border-t border-rule p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="reply" className="text-[0.8125rem] font-medium">Your reply</label>
                  <Btn size="sm" tone="quiet" onClick={() => { const s = A.suggestReply(ws, conv.id); if (s) { setDraft((d) => ({ ...d, [conv.id]: s.text })); setNote(s.note); } }}>Suggest a reply</Btn>
                </div>
                <textarea id="reply" rows={6} value={text} onChange={(e) => setDraft((d) => ({ ...d, [conv.id]: e.target.value }))} className="mt-1.5 block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 text-[0.875rem] focus:border-ink" />
                {note ? <p className="mt-1.5 text-[0.8125rem] text-muted">{note}</p> : null}
                {err ? <div className="mt-2"><Notice tone="danger">{err}</Notice></div> : null}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Btn tone="primary" disabled={text.trim().length < 2} onClick={() => { const r = act((w, at, me) => A.replyInConversation(w, conv.id, text, at, me), "Reply recorded (simulated)."); if (r.ok) { setDraft((d) => ({ ...d, [conv.id]: "" })); setNote(null); setErr(null); } else setErr(r.error); }}>Record reply (simulated)</Btn>
                  <span className="text-[0.75rem] text-muted">Nothing is emailed: no mailbox is connected.</span>
                </div>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Context">
          {acc ? (
            <div className="space-y-3 p-4 text-[0.875rem]">
              <p><Link href={`/app/customers/${acc.id}`} className="font-medium hover:underline">{acc.name}</Link><span className="block text-[0.8125rem] text-muted">{acc.category || "Category unknown"} · {acc.address.zip}</span></p>
              {opp ? <><StageMark stage={opp.stage} /><p className="text-[0.8125rem]"><span className="text-muted">Next: </span>{opp.nextAction}</p></> : null}
              <p className="border-t border-rule pt-3 text-[0.8125rem] text-muted">Handled by: a person. Scout can suggest replies from your settings; it doesn&rsquo;t answer on its own.</p>
            </div>
          ) : <Empty title="No context" body="" />}
        </Panel>
      </div>
    </div>
  );
}

function InquiryForm({ onDone }: { onDone: () => void }) {
  const { act } = useWorkspace();
  const [f, setF] = useState({ business: "Granite Peak Orthodontics", name: "Jo Alvarez", email: "jo@granitepeakortho.example", zip: "80218", message: "We're opening a second office in January, about 5,500 sq ft. Could you come do a walkthrough and quote?" });
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  return (
    <Panel title="Simulate a website inquiry (demo)">
      <form className="grid gap-3 p-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); const r = act((w, at) => A.receiveInquiry(w, f, at), "Sample inquiry added to the inbox (simulated; no real message was received)."); if (r.ok) onDone(); else setErr(r.error); }}>
        {(["business", "name", "email", "zip"] as const).map((k) => (
          <label key={k} className="text-[0.8125rem]"><span className="capitalize text-muted">{k === "zip" ? "ZIP" : k}</span><input value={f[k]} onChange={set(k)} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 text-[0.875rem]" /></label>
        ))}
        <label className="text-[0.8125rem] sm:col-span-2"><span className="text-muted">Message</span><textarea rows={3} value={f.message} onChange={set("message")} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 text-[0.875rem]" /></label>
        {err ? <div className="sm:col-span-2"><Notice tone="danger">{err}</Notice></div> : null}
        <div className="sm:col-span-2"><Btn tone="primary" type="submit">Submit sample inquiry</Btn></div>
      </form>
    </Panel>
  );
}
