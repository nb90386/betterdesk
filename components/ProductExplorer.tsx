"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CHANNELS, DAYS, EXPLORER_BUSINESS, STATE_LABEL, THREADS, type Channel, type Thread } from "@/lib/sample";
import { Bubble, toneClass } from "./LeadJourney";

const VIEWS = [
  { id: "inbox", label: "Inbox" },
  { id: "calendar", label: "Calendar" },
  { id: "handoff", label: "Needs a person" },
  { id: "recap", label: "Weekly summary" },
] as const;
type View = (typeof VIEWS)[number]["id"];

const CH_LABEL = Object.fromEntries(CHANNELS.map((c) => [c.id, c.label])) as Record<Channel, string>;

export function ProductExplorer() {
  const [view, setView] = useState<View>("inbox");
  const [filter, setFilter] = useState<Channel | "all">("all");
  const [selected, setSelected] = useState<string>("dana");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();
  const uid = useId();

  const list = THREADS.filter((t) => filter === "all" || t.channel === filter);
  const thread = THREADS.find((t) => t.id === selected) ?? THREADS[0];
  const stateOf = (t: Thread) => (t.state === "awaiting-approval" && approved[t.id] ? "answered" : t.state);

  const applyFilter = (f: Channel | "all") => {
    setFilter(f);
    const visible = THREADS.filter((t) => f === "all" || t.channel === f);
    if (visible.length && !visible.some((t) => t.id === selected)) setSelected(visible[0].id);
  };

  const counts = {
    total: THREADS.length,
    booked: THREADS.filter((t) => t.booking).length,
    handed: THREADS.filter((t) => t.state === "handed-off").length,
    waiting: THREADS.filter((t) => stateOf(t) === "awaiting-approval").length,
  };

  const onTabKey = (e: React.KeyboardEvent, at: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (at + (e.key === "ArrowRight" ? 1 : VIEWS.length - 1)) % VIEWS.length;
    setView(VIEWS[next].id);
    document.getElementById(`${uid}-tab-${VIEWS[next].id}`)?.focus();
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-rule bg-card shadow-[var(--shadow-lift)]">
      {/* App chrome */}
      <div className="flex flex-col gap-3 border-b border-rule bg-paper/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rule-strong" />
            <span className="size-2.5 rounded-full bg-rule-strong" />
            <span className="size-2.5 rounded-full bg-rule-strong" />
          </span>
          <p className="text-[0.85rem] font-medium text-ink">{EXPLORER_BUSINESS}</p>
          <span className="sample-tag">Sample<span className="hidden md:inline">&nbsp;workspace</span></span>
        </div>
        <div role="tablist" aria-label="Views" className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {VIEWS.map((v, at) => (
            <button
              key={v.id}
              id={`${uid}-tab-${v.id}`}
              role="tab"
              type="button"
              aria-selected={view === v.id}
              aria-controls={`${uid}-view`}
              tabIndex={view === v.id ? 0 : -1}
              onClick={() => setView(v.id)}
              onKeyDown={(e) => onTabKey(e, at)}
              className="press relative shrink-0 rounded-md px-3 py-1.5 text-[0.82rem] text-muted hover:text-ink aria-selected:text-ink"
            >
              {view === v.id ? (
                <motion.span layoutId={`${uid}-view-pill`} className="absolute inset-0 rounded-md border border-rule bg-card shadow-[var(--shadow-card)]" transition={{ type: "spring", stiffness: 520, damping: 42 }} />
              ) : null}
              <span className="relative">
                {v.label}
                {v.id === "handoff" && counts.handed + counts.waiting > 0 ? (
                  <span className="ml-1.5 rounded-full bg-signal px-1.5 font-mono text-[0.62rem] text-card">{counts.handed + counts.waiting}</span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-view`} role="tabpanel" aria-labelledby={`${uid}-tab-${view}`} className="min-h-[520px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "inbox" ? (
              <div className="grid md:grid-cols-[minmax(0,300px)_1fr]">
                <div className="border-b border-rule md:border-b-0 md:border-r">
                  <div className="flex gap-1.5 overflow-x-auto border-b border-rule px-3 py-3" role="group" aria-label="Filter by channel">
                    <Chip active={filter === "all"} onClick={() => applyFilter("all")}>
                      All
                    </Chip>
                    {CHANNELS.map((c) => (
                      <Chip key={c.id} active={filter === c.id} onClick={() => applyFilter(c.id)}>
                        {c.label}
                        {c.plan ? <span className="ml-1 font-mono text-[0.58rem] uppercase">{c.plan}+</span> : null}
                      </Chip>
                    ))}
                  </div>
                  <ul className="max-h-[440px] overflow-y-auto" aria-label="Conversations">
                    {list.length === 0 ? (
                      <li className="px-4 py-10 text-center text-[0.85rem] text-muted">No conversations on this channel in the sample.</li>
                    ) : (
                      list.map((t) => {
                        const st = STATE_LABEL[stateOf(t)];
                        return (
                          <li key={t.id}>
                            <button
                              type="button"
                              onClick={() => setSelected(t.id)}
                              aria-current={selected === t.id ? "true" : undefined}
                              className={`flex w-full flex-col gap-1 border-b border-rule/70 px-4 py-3 text-left transition-colors ${selected === t.id ? "bg-paper-2" : "hover:bg-paper/70"}`}
                            >
                              <span className="flex items-center justify-between gap-2">
                                <span className="text-[0.88rem] font-medium text-ink">{t.customer}</span>
                                <span className="font-mono text-[0.64rem] text-faint">{t.received}</span>
                              </span>
                              <span className="truncate text-[0.8rem] text-muted">{t.preview}</span>
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-[0.62rem] uppercase tracking-[0.05em] text-faint">{CH_LABEL[t.channel]}</span>
                                <span className={`rounded-full border px-1.5 font-mono text-[0.6rem] uppercase ${toneClass[st.tone]}`}>{st.text}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
                <ThreadView thread={thread} state={stateOf(thread)} onApprove={() => setApproved((a) => ({ ...a, [thread.id]: true }))} approved={!!approved[thread.id]} />
              </div>
            ) : null}

            {view === "calendar" ? <CalendarView onOpen={(id) => { setSelected(id); setView("inbox"); setFilter("all"); }} /> : null}

            {view === "handoff" ? (
              <div className="p-5 sm:p-7">
                <h3 className="font-display text-[1.5rem] tracking-[-0.02em] text-ink">What needs a person</h3>
                <p className="mt-1 max-w-[60ch] text-[0.92rem] text-muted">
                  Anything urgent, unusual, or outside what you&rsquo;ve approved lands here with the whole conversation attached.
                </p>
                <ul className="mt-5 grid gap-3 lg:grid-cols-2">
                  {THREADS.filter((t) => t.state === "handed-off" || stateOf(t) === "awaiting-approval").map((t) => (
                    <li key={t.id} className="card-stock p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[0.92rem] font-medium text-ink">{t.customer}</p>
                        <span className={`rounded-full border px-2 font-mono text-[0.62rem] uppercase ${toneClass[STATE_LABEL[stateOf(t)].tone]}`}>
                          {STATE_LABEL[stateOf(t)].text}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.85rem] text-ink-2">{t.preview}</p>
                      <p className="mt-2 font-mono text-[0.68rem] text-muted">
                        {t.handoff ? `Routed to ${t.handoff.to} · ${t.handoff.reason}` : "Assisted mode: quotes wait for your OK"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(t.id);
                          setView("inbox");
                          setFilter("all");
                        }}
                        className="press mt-3 rounded-full border border-rule-strong px-3 py-1.5 text-[0.8rem] text-ink hover:border-ink/40"
                      >
                        Open conversation
                      </button>
                    </li>
                  ))}
                  {counts.handed + counts.waiting === 0 ? <li className="text-[0.9rem] text-muted">Nothing waiting on you.</li> : null}
                </ul>
              </div>
            ) : null}

            {view === "recap" ? (
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr]">
                <div className="rounded-[var(--radius-lg)] bg-night p-6 text-card">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-night-muted">Weekly summary · sample week · Growth and Scale</p>
                  <p className="mt-3 font-display text-[1.6rem] leading-snug tracking-[-0.015em]">
                    {counts.total} conversations this week. {counts.booked} on the calendar, {counts.handed} sent to your team
                    {counts.waiting ? `, ${counts.waiting} draft waiting for your OK.` : ", nothing waiting on you."}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-night-rule pt-4 text-[0.88rem] text-card/90">
                    <li>Busiest stretch: Thursday afternoon, while both techs were on jobs.</li>
                    <li>One customer outside your service area was told so politely.</li>
                    <li>Suggested FAQ: &ldquo;Do you service Round Rock?&rdquo; Approve to reuse the answer.</li>
                  </ul>
                </div>
                <dl className="grid grid-cols-2 gap-3 self-start">
                  {[
                    ["Conversations", counts.total],
                    ["Booked", counts.booked],
                    ["Sent to a person", counts.handed],
                    ["Drafts waiting", counts.waiting],
                  ].map(([k, v]) => (
                    <div key={k} className="card-stock p-4">
                      <dt className="text-[0.78rem] text-muted">{k}</dt>
                      <dd className="mt-1 font-display text-[2.2rem] leading-none text-ink">{v}</dd>
                    </div>
                  ))}
                  <p className="col-span-2 text-[0.75rem] text-faint">Counts are computed from the six sample conversations in this workspace. The weekly summary and analytics are part of the Growth and Scale plans.</p>
                </dl>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`press shrink-0 rounded-full border px-2.5 py-1 text-[0.76rem] ${active ? "border-ink bg-ink text-card" : "border-rule-strong text-ink-2 hover:border-ink/40"}`}
    >
      {children}
    </button>
  );
}

function ThreadView({ thread, state, onApprove, approved }: { thread: Thread; state: Thread["state"]; onApprove: () => void; approved: boolean }) {
  const st = STATE_LABEL[state];
  return (
    <div className="grid lg:grid-cols-[1fr_220px]">
      <div className="flex flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-rule pb-3">
          <div>
            <p className="text-[0.95rem] font-medium text-ink">{thread.customer}</p>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.05em] text-muted">
              {CH_LABEL[thread.channel]} · {thread.received}
            </p>
          </div>
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.62rem] uppercase ${toneClass[st.tone]}`}>{st.text}</span>
        </div>
        <div className="space-y-2 py-4" role="log" aria-label={`Conversation with ${thread.customer}`}>
          {thread.messages.map((m, k) => (
            <Bubble key={k} m={m} />
          ))}
          {thread.draft ? (
            approved ? (
              <Bubble m={{ from: "desk", text: thread.draft, meta: "sent after your approval" }} />
            ) : (
              <div className="rounded-[var(--radius-md)] border border-dashed border-amber/50 bg-amber-soft/40 p-3">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.08em] text-amber">Draft · waiting for your OK</p>
                <p className="mt-1 text-[0.86rem] leading-snug text-ink">{thread.draft}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={onApprove} className="press rounded-full bg-ink px-3.5 py-1.5 text-[0.8rem] font-medium text-card hover:bg-ink-2">
                    Approve and send
                  </button>
                  <span className="self-center text-[0.75rem] text-muted">(sample: nothing is actually sent)</span>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
      <aside className="border-t border-rule bg-paper/60 p-4 lg:border-l lg:border-t-0" aria-label="What BetterDesk used">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.08em] text-muted">What it went on</p>
        <ul className="mt-2 space-y-2">
          {thread.knew.map((k) => (
            <li key={k} className="border-l-2 border-rule-strong pl-2.5 text-[0.8rem] leading-snug text-ink-2">
              {k}
            </li>
          ))}
        </ul>
        {thread.booking ? (
          <p className="mt-4 rounded-md bg-handled-soft px-2.5 py-2 text-[0.78rem] text-handled">
            {DAYS[thread.booking.day]} {fmt(thread.booking.start)}–{fmt(thread.booking.end)} on the calendar
          </p>
        ) : null}
      </aside>
    </div>
  );
}

const fmt = (h: number) => `${((h + 11) % 12) + 1}${h < 12 ? " AM" : " PM"}`;
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

function CalendarView({ onOpen }: { onOpen: (id: string) => void }) {
  const booked = THREADS.filter((t) => t.booking);
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-[1.5rem] tracking-[-0.02em] text-ink">This week</h3>
        <p className="font-mono text-[0.68rem] text-muted">Bookings from the sample inbox</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-[48px_repeat(5,1fr)] text-[0.75rem]">
          <div />
          {DAYS.map((d) => (
            <div key={d} className="border-b border-rule pb-2 text-center font-mono text-[0.68rem] uppercase text-muted">
              {d}
            </div>
          ))}
          <div className="relative col-span-6 grid grid-cols-[48px_repeat(5,1fr)]" style={{ height: HOURS.length * 44 }}>
            {HOURS.map((h, r) => (
              <div key={h} className="absolute inset-x-0 border-t border-rule/70" style={{ top: r * 44 }}>
                <span className="absolute -top-2 left-0 bg-card pr-1 font-mono text-[0.62rem] text-faint">{fmt(h)}</span>
              </div>
            ))}
            {booked.map((t) => {
              const b = t.booking!;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onOpen(t.id)}
                  className="press absolute overflow-hidden rounded-md border border-handled/30 bg-handled-soft px-2 py-1 text-left hover:border-handled"
                  style={{
                    left: `calc(48px + (100% - 48px) / 5 * ${b.day} + 3px)`,
                    width: `calc((100% - 48px) / 5 - 6px)`,
                    top: (b.start - 8) * 44 + 2,
                    height: (b.end - b.start) * 44 - 4,
                  }}
                >
                  <span className="block font-mono text-[0.6rem] text-handled">
                    {fmt(b.start)}–{fmt(b.end)}
                  </span>
                  <span className="block text-[0.74rem] leading-tight text-ink">{b.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
