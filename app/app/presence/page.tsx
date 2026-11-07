"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/lib/demo/store";
import { runSampleAudit } from "@/lib/presence/sample";
import { PREPARED_AUDIT_ID } from "@/lib/demo/seed";
import { completeTask, createTaskFromFinding, recordPresenceAudit } from "@/lib/workspace/actions";
import { auditRecord } from "@/components/site/PresenceExplorer";
import { Btn, Empty, PageHeader, Panel, fmtTime } from "@/components/app/ui";

const AUDIT_ID = PREPARED_AUDIT_ID;
const SEV = { high: "Fix first", medium: "Fix soon", low: "Worth fixing", info: "Note" } as const;

export default function PresenceScreen() {
  const { ws, act } = useWorkspace();
  const report = useMemo(() => runSampleAudit(), []);
  const audit = ws.presenceAudits.at(-1) ?? null;
  const [owner, setOwner] = useState("usr_luis");
  const member = (id: string) => ws.org.members.find((m) => m.id === id)?.name ?? "Unassigned";
  const taskFor = (fid: string) => ws.tasks.find((t) => t.origin.kind === "presence-finding" && t.origin.auditId === audit?.id && t.origin.findingId === fid);
  const open = ws.tasks.filter((t) => t.status === "open");
  const done = ws.tasks.filter((t) => t.status === "done");

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Presence"
        lede="How findable clearline.example is, and who owns each fix. Sample site and data; check a real site from the public Presence page."
        actions={
          <>
            <Btn tone="primary" onClick={() => act((w, at, me) => recordPresenceAudit(w, { ...auditRecord(report, AUDIT_ID), fetchedAt: at }, at, me), "Sample audit recorded.")} disabled={ws.presenceAudits.some((a) => a.id === AUDIT_ID)}>
              {ws.presenceAudits.some((a) => a.id === AUDIT_ID) ? "Sample audit recorded" : "Run the sample audit"}
            </Btn>
            <Link href="/presence#check" className="inline-flex min-h-10 items-center px-2 text-[0.875rem] font-[560] underline underline-offset-4">Check a real site</Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Panel pad title={audit ? `Findings for ${audit.domain}` : "Findings"} className="xl:col-span-7">
          {!audit ? (
            <Empty title="No audit yet" body="Run the sample audit to see how a Presence check turns into owned website tasks." />
          ) : (
            <>
              <p className="mb-3 text-[0.8125rem] text-muted">
                {audit.method === "sample" ? "Sample audit" : "Live audit"} · {audit.pagesChecked} pages · recorded {fmtTime(audit.fetchedAt)}
              </p>
              <div className="mb-3 flex items-center gap-2 text-[0.875rem]">
                <label htmlFor="pres-owner" className="text-muted">New tasks go to</label>
                <select id="pres-owner" value={owner} onChange={(e) => setOwner(e.target.value)} className="field min-h-9 w-auto py-0 text-[0.875rem]">
                  {ws.org.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <ul>
                {audit.findings.map((f) => {
                  const t = taskFor(f.id);
                  return (
                    <li key={f.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-[560] leading-snug">{f.title}</p>
                        <p className="text-[0.8125rem] text-muted">{SEV[f.severity]} · {f.evidenceUrl.replace(/^https?:\/\//, "")}</p>
                      </div>
                      {t ? (
                        <span className="text-[0.8125rem] text-muted">{t.status === "done" ? "Done" : `Task · ${member(t.ownerId)}`}</span>
                      ) : (
                        <Btn size="sm" onClick={() => act((w, at, me) => createTaskFromFinding(w, audit.id, f.id, owner, at, me).ws, "Task created.")}>Make a task</Btn>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Panel>

        <div className="grid content-start gap-6 xl:col-span-5">
          <Panel pad title={`Open tasks (${open.length})`}>
            {open.length === 0 ? (
              <p className="text-[0.875rem] text-muted">No open website tasks.</p>
            ) : (
              <ul>
                {open.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 border-t border-rule py-3 first:border-t-0 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-[560] leading-snug">{t.title}</p>
                      <p className="text-[0.8125rem] text-muted">{member(t.ownerId)} · since {fmtTime(t.createdAt)}</p>
                    </div>
                    <Btn size="sm" onClick={() => act((w, at, me) => completeTask(w, t.id, at, me), "Marked done. Re-run the audit to confirm.")}>Mark done</Btn>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel pad title="How we measure">
            <p className="text-[0.875rem] leading-relaxed text-ink-2">
              Marking a task done doesn’t claim anything changed. The next audit checks it. BetterDesk never links a website fix to a lead unless the customer tells you how they found you, and then it shows their words.
            </p>
            {done.length ? <p className="mt-3 text-[0.8125rem] text-muted">{done.length} task{done.length > 1 ? "s" : ""} marked done.</p> : null}
          </Panel>
        </div>
      </div>
    </div>
  );
}
