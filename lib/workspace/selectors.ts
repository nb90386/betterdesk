import type { Workspace, Stage } from "../domain/types.ts";
import { STAGES } from "../domain/types.ts";

export const account = (ws: Workspace, id: string) => ws.accounts.find((a) => a.id === id);
export const oppOf = (ws: Workspace, accountId: string) => ws.opportunities.find((o) => o.accountId === accountId);
export const qualOf = (ws: Workspace, accountId: string) => ws.qualifications.find((q) => q.accountId === accountId);
export const contactOf = (ws: Workspace, accountId: string) => ws.contacts.find((c) => c.accountId === accountId);
export const timeline = (ws: Workspace, accountId: string) => ws.events.filter((e) => e.accountId === accountId).sort((a, b) => a.at.localeCompare(b.at));
export const pendingDrafts = (ws: Workspace) => ws.drafts.filter((d) => d.approval === "pending");
export const accountOfOpp = (ws: Workspace, oppId: string) => {
  const o = ws.opportunities.find((x) => x.id === oppId);
  return o ? account(ws, o.accountId) : undefined;
};

export type Attention = { id: string; kind: "draft" | "reply" | "proposal" | "run" | "walkthrough" | "task"; title: string; detail: string; href: string; tone: "action" | "attention" | "danger" };

/** What needs the owner, in priority order. Derived only from records; no invented items. */
export function attention(ws: Workspace, now = Date.now()): Attention[] {
  const out: Attention[] = [];
  for (const r of ws.runs.filter((r) => r.state === "blocked" || r.state === "failed"))
    out.push({ id: r.id, kind: "run", title: "Scout run is blocked", detail: r.errors.at(-1)?.message ?? "A step failed.", href: "/app/scout", tone: "danger" });
  const drafts = pendingDrafts(ws);
  if (drafts.length) out.push({ id: "drafts", kind: "draft", title: `${drafts.length} introduction${drafts.length > 1 ? "s" : ""} waiting for your approval`, detail: drafts.slice(0, 3).map((d) => accountOfOpp(ws, d.opportunityId)?.name).join(", "), href: "/app/scout#drafts", tone: "action" });
  for (const c of ws.conversations.filter((c) => c.messages.at(-1)?.direction === "inbound")) {
    const m = c.messages.at(-1)!;
    out.push({ id: c.id, kind: "reply", title: `${m.from} at ${account(ws, c.accountId)?.name} is waiting for a reply`, detail: m.intent === "pricing" ? "Asked about price." : m.intent === "walkthrough" ? "Asked for a walkthrough." : m.body.slice(0, 90), href: `/app/inbox?c=${c.id}`, tone: "action" });
  }
  for (const o of ws.opportunities.filter((o) => o.stage === "proposal" && now - Date.parse(o.updatedAt) > 4 * 86_400_000))
    out.push({ id: o.id, kind: "proposal", title: `Proposal to ${account(ws, o.accountId)?.name} has had no reply for ${Math.round((now - Date.parse(o.updatedAt)) / 86_400_000)} days`, detail: o.nextAction, href: `/app/customers/${o.accountId}`, tone: "attention" });
  for (const t of ws.tasks.filter((t) => t.status === "open" && t.origin.kind === "presence-finding" && (t.origin.severity === "high" || t.origin.severity === "medium")))
    out.push({ id: t.id, kind: "task", title: `Website fix: ${t.title}`, detail: `Owner: ${ws.org.members.find((m) => m.id === t.ownerId)?.name ?? "Unassigned"}`, href: "/app/presence", tone: "attention" });
  return out;
}

export function stageCounts(ws: Workspace) {
  const m = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>;
  for (const o of ws.opportunities) m[o.stage]++;
  return m;
}

/** Defensible metrics only: counts of real records. Unknowns stay unknown. */
export function metrics(ws: Workspace) {
  const count = (t: string) => ws.events.filter((e) => e.type === t).length;
  return {
    qualified: ws.qualifications.filter((q) => q.tier === "strong" || q.tier === "possible").length,
    draftsApproved: ws.drafts.filter((d) => d.approval === "approved").length,
    sent: ws.drafts.filter((d) => d.delivery === "sent").length,
    simulatedDeliveries: ws.drafts.filter((d) => d.delivery === "simulated").length,
    replies: count("message.received"),
    walkthroughs: count("appointment.booked"),
    proposals: ws.opportunities.filter((o) => o.stage === "proposal" || o.stage === "won" || o.stage === "lost").length,
    won: ws.opportunities.filter((o) => o.stage === "won").length,
  };
}
