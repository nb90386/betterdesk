"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/demo/store";
import * as A from "@/lib/workspace/actions";
import { Btn, Notice, PageHeader, Panel, fmtTime } from "@/components/app/ui";

const INTEGRATIONS: { name: string; status: "DEMO" | "BLOCKED" | "PLANNED"; note: string }[] = [
  { name: "Prospect lists (CSV)", status: "DEMO", note: "Works in this sample workspace. Parsed and checked in your browser." },
  { name: "Website inquiry form", status: "DEMO", note: "Simulated from the Inbox. A real form needs the SANDBOX backend." },
  { name: "Google Workspace or Microsoft 365 mailbox", status: "BLOCKED", note: "Approved introductions would send from your own mailbox. Needs OAuth credentials and a compliance review." },
  { name: "Google or Microsoft calendar", status: "BLOCKED", note: "Needs OAuth credentials. Until then, walkthroughs book onto a sample calendar." },
  { name: "Licensed business-data provider", status: "BLOCKED", note: "Not chosen. Must allow storing results; Google Places terms don't." },
  { name: "AI drafting model", status: "BLOCKED", note: "No API key configured. Drafts use a deterministic template that can only state facts from your records." },
  { name: "Database, sign-in and team access", status: "BLOCKED", note: "Schema with row-level security is written (docs/v4/schema.sql) but no Supabase project is connected." },
  { name: "SMS and phone calls", status: "PLANNED", note: "Off. Will stay off unless written consent and a legal review exist." },
];

export default function SettingsPage() {
  const { ws, act } = useWorkspace();
  const [value, setValue] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const o = ws.org;
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" lede="What this workspace can and can't do, who it is, and who must never be contacted." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Mode and outreach policy">
          <dl className="divide-y divide-rule text-[0.875rem]">
            {[
              ["Workspace mode", `${o.mode}: fictional data, local to this browser`],
              ["Outbound email", "Draft only. Approval never sends."],
              ["Text messages", "Off"],
              ["Automated calls", "Off"],
              ["Who can approve", "People only. Scout has no send or approve permission."],
            ].map(([k, v]) => <div key={k} className="grid grid-cols-[10rem_1fr] gap-3 px-4 py-2.5"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Panel>
        <Panel title="Business profile">
          <dl className="divide-y divide-rule text-[0.875rem]">
            {[
              ["Company", o.name],
              ["Sender", `${o.sender.name}, ${o.sender.title} · ${o.sender.email}`],
              ["Postal address", o.sender.postalAddress],
              ["Service area", `${o.serviceArea.label} · ${o.serviceArea.zips.length} ZIP codes`],
              ["Services", o.services.join(", ")],
              ["Targets", `${o.idealCustomer.categories.join(", ")} · ${o.idealCustomer.minSqft.toLocaleString()}+ sq ft`],
            ].map(([k, v]) => <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-2.5"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Panel>
      </div>

      <Panel title="Integrations">
        <ul className="divide-y divide-rule">
          {INTEGRATIONS.map((i) => (
            <li key={i.name} className="grid gap-1 px-4 py-3 text-[0.875rem] md:grid-cols-[18rem_6rem_1fr] md:items-baseline md:gap-4">
              <span className="font-medium">{i.name}</span>
              <span className={`tabular-nums text-[0.75rem] ${i.status === "DEMO" ? "text-ink" : i.status === "BLOCKED" ? "text-lamp-ink" : "text-muted"}`}>{i.status}</span>
              <span className="text-muted">{i.note}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={`Suppression list (${ws.suppressions.length})`}>
        <div className="p-4">
          <p className="text-[0.8125rem] text-muted">Addresses and domains here are never drafted to, approved or delivered to, across every run. Opt-out replies are added automatically.</p>
          <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); setErr(null); const r = act((w, at, me) => A.suppress(w, value, "do-not-contact", at, me), `${value} added to suppression list.`); if (r.ok) setValue(""); else setErr(r.error); }}>
            <label className="min-w-[16rem] flex-1"><span className="sr-only">Email or domain</span><input value={value} onChange={(e) => setValue(e.target.value)} placeholder="name@business.com or business.com" className="block w-full rounded-[var(--radius-sm)] border border-rule-strong px-3 py-2 text-[0.875rem]" /></label>
            <Btn type="submit" disabled={!value.trim()}>Add</Btn>
          </form>
          {err ? <div className="mt-2"><Notice tone="danger">{err}</Notice></div> : null}
          <ul className="mt-3 divide-y divide-rule border-t border-rule text-[0.875rem]">
            {ws.suppressions.map((s) => <li key={s.value} className="flex justify-between gap-3 py-2"><span className="tabular-nums text-[0.8125rem]">{s.value}</span><span className="text-muted">{s.reason} · {fmtTime(s.at)}</span></li>)}
          </ul>
          <p className="mt-3 text-[0.75rem] text-muted">Entries can&rsquo;t be removed here on purpose. Removing an opt-out should be a deliberate, recorded decision.</p>
        </div>
      </Panel>
    </div>
  );
}
