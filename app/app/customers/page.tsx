"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorkspace } from "@/lib/demo/store";
import { oppOf, timeline } from "@/lib/workspace/selectors";
import { Empty, PageHeader, Panel, StageMark, ago } from "@/components/app/ui";

export default function CustomersPage() {
  const { ws } = useWorkspace();
  const [q, setQ] = useState("");
  const list = ws.accounts.filter((a) => a.status !== "excluded" && (!q || a.name.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" lede="One record per business. Prospects, conversations, walkthroughs and outcomes all hang off it, so nothing is entered twice." />
      <label className="block max-w-md">
        <span className="text-[0.8125rem] text-muted">Search</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 block w-full rounded-[var(--radius-sm)] border border-rule-strong bg-surface px-3 py-2 text-[0.9375rem] focus:border-ink" />
      </label>
      <Panel>
        {list.length === 0 ? <Empty title="No records" body="Try another search." /> : (
          <ul className="divide-y divide-rule">
            {list.map((a) => {
              const o = oppOf(ws, a.id);
              const last = timeline(ws, a.id).at(-1);
              return (
                <li key={a.id}>
                  <Link href={`/app/customers/${a.id}`} className="grid gap-1 px-4 py-3 hover:bg-stone md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-4">
                    <span><span className="text-[0.9375rem] font-medium">{a.name}</span><span className="block text-[0.8125rem] text-muted">{a.status === "customer" ? "Customer" : "Prospect"} · {a.category || "No category"}</span></span>
                    <span>{o ? <StageMark stage={o.stage} /> : <span className="text-[0.8125rem] text-muted">Not in pipeline</span>}</span>
                    <span className="truncate text-[0.8125rem] text-muted">{last ? `${last.summary} · ${ago(last.at)}` : "No activity"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
