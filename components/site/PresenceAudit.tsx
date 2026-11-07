"use client";

import { useId, useRef, useState } from "react";
import type { AuditResponse, PresenceReport } from "@/lib/presence/types";
import { PresenceExplorer } from "./PresenceExplorer";
import { BotAccessTable } from "./PresenceDetails";

type State = { kind: "idle" } | { kind: "running" } | { kind: "done"; report: PresenceReport } | { kind: "error"; message: string };

export function PresenceAudit() {
  const uid = useId();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("Commercial cleaning");
  const [questions, setQuestions] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [problem, setProblem] = useState<string | null>(null);
  const result = useRef<HTMLDivElement>(null);

  const run = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const missing = !url.trim() ? "url" : !name.trim() ? "name" : !area.trim() ? "area" : !authorized ? "auth" : null;
    setProblem(missing);
    if (missing) {
      document.getElementById(`${uid}-${missing}`)?.focus();
      return;
    }
    setState({ kind: "running" });
    try {
      const res = await fetch("/api/presence/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          businessName: name.trim(),
          serviceArea: area.trim(),
          serviceCategory: category.trim() || "Commercial cleaning",
          questions: questions.split("\n").map((q) => q.trim()).filter(Boolean).slice(0, 5),
          authorized,
        }),
      });
      const data = (await res.json().catch(() => null)) as AuditResponse | null;
      if (data?.ok) setState({ kind: "done", report: data.report });
      else setState({ kind: "error", message: data?.message ?? "The audit didn’t finish. Please try again." });
    } catch {
      setState({ kind: "error", message: "You seem to be offline, or the audit service didn’t answer." });
    }
    requestAnimationFrame(() => result.current?.focus());
  };

  const msg: Record<string, string> = { url: "Enter your website address.", name: "Enter the business name as customers see it.", area: "Enter where you clean.", auth: "Please confirm you own this site or are allowed to audit it." };
  const input = (key: string, label: string, value: string, onChange: (v: string) => void, opts: { placeholder?: string; type?: string; hint?: string } = {}) => (
    <div>
      <label htmlFor={`${uid}-${key}`} className="text-[0.9375rem] font-[560]">{label}</label>
      {opts.hint ? <p className="mt-0.5 text-[0.8125rem] text-muted">{opts.hint}</p> : null}
      <input id={`${uid}-${key}`} type={opts.type ?? "text"} value={value} placeholder={opts.placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={problem === key ? true : undefined} aria-describedby={problem === key ? `${uid}-${key}-err` : undefined} className="field mt-1.5" />
      {problem === key ? <p id={`${uid}-${key}-err`} className="mt-1.5 text-[0.875rem] text-danger">{msg[key]}</p> : null}
    </div>
  );

  return (
    <div className="grid gap-10">
      <form onSubmit={run} noValidate className="paper grid gap-5 p-6 sm:p-8 lg:grid-cols-2 lg:gap-x-8">
        {input("url", "Your website", url, setUrl, { placeholder: "yourcleaningcompany.com", type: "url" })}
        {input("name", "Business name", name, setName, { placeholder: "As it appears to customers" })}
        {input("area", "Where you clean", area, setArea, { placeholder: "Central and east Denver" })}
        {input("cat", "What you sell", category, setCategory)}
        <div className="lg:col-span-2">
          <label htmlFor={`${uid}-q`} className="flex items-baseline justify-between text-[0.9375rem] font-[560]">
            Searches you care about
            <span className="text-[0.8125rem] font-[450] text-muted">Optional, one per line, up to 5</span>
          </label>
          <textarea id={`${uid}-q`} rows={3} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder={"commercial cleaning company serving central Denver\nmedical office cleaning near Cherry Creek"} className="field mt-1.5 resize-y" />
          <p className="mt-1.5 text-[0.8125rem] text-muted">We check whether your own pages use these words. We don’t send them to Google or any AI.</p>
        </div>
        <div className="lg:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
            <input id={`${uid}-auth`} type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} aria-invalid={problem === "auth" ? true : undefined} className="mt-1 h-4 w-4 accent-[#151719]" />
            <span>I own this website or I’m allowed to audit it.</span>
          </label>
          {problem === "auth" ? <p className="mt-1.5 text-[0.875rem] text-danger">{msg.auth}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-5 lg:col-span-2">
          <button type="submit" disabled={state.kind === "running"} className="press inline-flex min-h-12 items-center rounded-[var(--radius-sm)] bg-ink px-5 font-[560] text-stone hover:bg-ink-2 disabled:opacity-60">
            {state.kind === "running" ? "Checking your site…" : "Check my website"}
          </button>
          <p className="max-w-[60ch] text-[0.8125rem] text-muted">
            Reads robots.txt, your sitemap and up to 6 public pages, politely and once. Takes 10 to 20 seconds. Private addresses and other people’s sites are refused. Nothing is stored.
          </p>
        </div>
      </form>

      <div ref={result} tabIndex={-1} aria-live="polite" className="outline-none">
        {state.kind === "error" ? (
          <p role="alert" className="rounded-[8px] bg-danger-wash px-4 py-3 text-danger">{state.message}</p>
        ) : null}
        {state.kind === "done" ? (
          <div className="grid gap-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
              <h3 className="t-head">Live audit of {state.report.domain}</h3>
              <p className="text-[0.8125rem] text-muted">Checked {new Date(state.report.fetchedAt).toLocaleString()} · results reflect this moment only</p>
            </div>
            <PresenceExplorer report={state.report} />
            <BotAccessTable report={state.report} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
