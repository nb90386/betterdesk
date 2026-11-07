/**
 * Pure workspace operations. Each takes a Workspace and returns a new one plus the events it
 * appended. The DEMO store runs these in the browser; a SANDBOX/LIVE backend would run the same
 * functions server-side inside a transaction, with the tenant taken from the session, never from
 * the request body.
 */
import type { Account, Actor, Appointment, Contact, Draft, Event, EventType, Evidence, Opportunity, ScoutRun, Stage, Workspace } from "./model.ts";
import { STAGE_LABEL } from "../domain/types.ts";
import { newId } from "../domain/ids.ts";
import { isActive, transition } from "../domain/run.ts";
import type { ProspectRow } from "../scout/csv.ts";
import { dedupeKey, matchKeys, normalizeDomain } from "../scout/dedupe.ts";
import { emailKind, isSuppressed, qualify } from "../scout/qualify.ts";
import { cleanText, looksLikeInstructions } from "../scout/untrusted.ts";
import { templateGenerator, validateDraft, type DraftGenerator } from "../scout/draft.ts";
import { classifyReply } from "../scout/reply.ts";

export class ActionError extends Error {}

function log(ws: Workspace, at: string, actor: Actor, type: EventType, summary: string, accountId: string | null, subjectId: string | null, data?: Event["data"]): Workspace {
  const e: Event = { id: newId("evt"), orgId: ws.org.id, at, actor, type, accountId, subjectId, summary, data };
  return { ...ws, events: [...ws.events, e] };
}

const accountName = (ws: Workspace, id: string) => ws.accounts.find((a) => a.id === id)?.name ?? "Unknown business";
const oppFor = (ws: Workspace, accountId: string) => ws.opportunities.find((o) => o.accountId === accountId) ?? null;

function setStage(ws: Workspace, oppId: string, stage: Stage, at: string, actor: Actor, why: string): Workspace {
  const opp = ws.opportunities.find((o) => o.id === oppId);
  if (!opp) throw new ActionError("Opportunity not found.");
  if (opp.stage === stage) return ws;
  const next = { ...ws, opportunities: ws.opportunities.map((o) => (o.id === oppId ? { ...o, stage, updatedAt: at } : o)) };
  return log(next, at, actor, "opportunity.stage-changed", `${accountName(ws, opp.accountId)} moved from ${STAGE_LABEL[opp.stage]} to ${STAGE_LABEL[stage]}. ${why}`.trim(), opp.accountId, oppId, { from: opp.stage, to: stage });
}

/* ---------------- Import ---------------- */

export type ImportSummary = { imported: string[]; duplicates: { name: string; matched: string }[]; withheld: number };

export function importProspects(ws: Workspace, rows: ProspectRow[], sourceLabel: string, at: string, actor: Actor): { ws: Workspace; summary: ImportSummary } {
  const source = { kind: "csv-import" as const, label: sourceLabel, retrievedAt: at };
  const index = new Map<string, string>();
  for (const a of ws.accounts) for (const k of matchKeys(a.name, a.address.zip, a.domain)) index.set(k, a.id);
  const summary: ImportSummary = { imported: [], duplicates: [], withheld: 0 };
  let next = ws;
  for (const r of rows) {
    const keys = matchKeys(r.name, r.zip, r.website);
    const dup = keys.map((k) => index.get(k)).find(Boolean);
    const name = cleanText(r.name, 120);
    if (dup) {
      summary.duplicates.push({ name, matched: accountName(next, dup) });
      next = log(next, at, actor, "account.duplicate-skipped", `${name} matched existing ${accountName(next, dup)}; not imported twice.`, dup, null);
      continue;
    }
    const sqftNum = r.sqft ? Number(r.sqft.replace(/[^0-9.]/g, "")) : NaN;
    const account: Account = {
      id: newId("acc"),
      orgId: ws.org.id,
      name,
      domain: normalizeDomain(r.website),
      address: { street: cleanText(r.street ?? "", 120), city: cleanText(r.city ?? "", 60), state: cleanText(r.state ?? "", 20), zip: r.zip },
      category: cleanText(r.category ?? "", 60),
      sqft: Number.isFinite(sqftNum) && sqftNum > 0 ? { value: Math.round(sqftNum), source } : null,
      status: "prospect",
      source,
      dedupeKey: dedupeKey(r.name, r.zip, r.website),
      createdAt: at,
    };
    for (const k of keys) index.set(k, account.id);
    const evidence: Evidence[] = [{ id: newId("ev"), accountId: account.id, claim: `Address: ${[account.address.street, account.address.city, account.address.state, account.address.zip].filter(Boolean).join(", ")}`, source }];
    if (account.category) evidence.push({ id: newId("ev"), accountId: account.id, claim: `Category: ${account.category}`, source });
    if (account.sqft) evidence.push({ id: newId("ev"), accountId: account.id, claim: `Facility size: ${account.sqft.value.toLocaleString()} sq ft`, source });
    const contacts: Contact[] = [];
    if (r.contact_name || r.contact_email) {
      const email = r.contact_email ? cleanText(r.contact_email, 120).toLowerCase() : null;
      contacts.push({ id: newId("con"), accountId: account.id, name: cleanText(r.contact_name ?? "", 80) || "Unknown contact", role: cleanText(r.contact_role ?? "", 80), email, emailKind: emailKind(email) });
      evidence.push({ id: newId("ev"), accountId: account.id, claim: `Contact: ${contacts[0].name}${contacts[0].role ? `, ${contacts[0].role}` : ""}`, source });
    }
    if (r.notes) {
      const text = cleanText(r.notes);
      const flagged = looksLikeInstructions(text);
      evidence.push({ id: newId("ev"), accountId: account.id, claim: flagged ? "Note withheld: it contained instructions rather than business information." : `Note: ${text}`, source, flagged: flagged ? "withheld-instructions" : undefined });
      if (flagged) summary.withheld++;
    }
    next = { ...next, accounts: [...next.accounts, account], contacts: [...next.contacts, ...contacts], evidence: [...next.evidence, ...evidence] };
    next = log(next, at, actor, "account.imported", `${account.name} imported from ${sourceLabel}.`, account.id, account.id, { line: r.__line });
    if (evidence.some((e) => e.flagged)) next = log(next, at, { kind: "system", id: "guard", name: "Content guard" }, "evidence.withheld", `A note on ${account.name} looked like instructions and was withheld from Scout.`, account.id, null);
    summary.imported.push(account.id);
  }
  return { ws: next, summary };
}

/* ---------------- Scout runs ---------------- */

export const RUN_TASKS = [
  { id: "scope", label: "Read your service area and target facility types" },
  { id: "qualify", label: "Qualify imported prospects against your criteria" },
  { id: "draft", label: "Draft introductions for good fits with a business contact" },
  { id: "handoff", label: "Hand drafts to you for approval" },
] as const;

export function createRun(ws: Workspace, goal: string, accountIds: string[], at: string, actor: Actor, maxProspects = 50): { ws: Workspace; runId: string } {
  if (!goal.trim()) throw new ActionError("Give Scout a goal.");
  if (accountIds.length === 0) throw new ActionError("Import or select prospects first.");
  const run: ScoutRun = {
    id: newId("run"),
    orgId: ws.org.id,
    actorId: actor.id,
    goal: goal.trim().slice(0, 300),
    scope: { sources: ["csv-import", "manual", "sample-seed"], serviceAreaOnly: true, maxProspects, allowedTools: ["read-records", "dedupe", "qualify", "draft-outreach"] },
    state: "created",
    history: [{ state: "created", at }],
    tasks: RUN_TASKS.map((t) => ({ id: t.id, label: t.label, status: "pending" })),
    accountIds: accountIds.slice(0, maxProspects),
    draftIds: [],
    errors: [],
    retries: 0,
    createdAt: at,
    completedAt: null,
    summary: null,
  };
  let next: Workspace = { ...ws, runs: [run, ...ws.runs] };
  next = runTo(next, run.id, "queued", at, actor, accountIds.length > maxProspects ? `Budget: first ${maxProspects} of ${accountIds.length} prospects.` : undefined);
  return { ws: next, runId: run.id };
}

function runTo(ws: Workspace, runId: string, to: ScoutRun["state"], at: string, actor: Actor, note?: string): Workspace {
  const run = ws.runs.find((r) => r.id === runId)!;
  const moved = transition(run, to, at, note);
  const next = { ...ws, runs: ws.runs.map((r) => (r.id === runId ? moved : r)) };
  return log(next, at, actor, "run.state-changed", `Scout run ${to.replace("-", " ")}${note ? `: ${note}` : "."}`, null, runId, { from: run.state, to });
}

const scoutActor: Actor = { kind: "scout", id: "scout", name: "Scout" };
const patchRun = (ws: Workspace, id: string, f: (r: ScoutRun) => ScoutRun): Workspace => ({ ...ws, runs: ws.runs.map((r) => (r.id === id ? f(r) : r)) });
const doneTask = (r: ScoutRun, id: string, detail: string, status: "done" | "skipped" = "done"): ScoutRun => ({ ...r, tasks: r.tasks.map((t) => (t.id === id ? { ...t, status, detail } : t)) });

/**
 * Advances a run by exactly one task. Every task checks the run is still active first, so a
 * canceled run can never create drafts or touch records afterwards.
 */
export function stepRun(ws: Workspace, runId: string, at: string, generator: DraftGenerator = templateGenerator): Workspace {
  const run = ws.runs.find((r) => r.id === runId);
  if (!run) throw new ActionError("Run not found.");
  if (!isActive(run.state)) return ws;
  let next = run.state === "queued" ? runTo(ws, runId, "running", at, scoutActor) : ws;
  const task = run.tasks.find((t) => t.status === "pending");
  if (!task) return next;

  if (task.id === "scope") {
    const a = ws.org.serviceArea;
    return patchRun(next, runId, (r) => doneTask(r, "scope", `${a.label} (${a.zips.length} ZIP codes). Targets: ${ws.org.idealCustomer.categories.join(", ")}.`));
  }

  if (task.id === "qualify") {
    const customerKeys = ws.accounts.filter((a) => a.status === "customer").map((a) => a.dedupeKey);
    let strong = 0, possible = 0, excluded = 0;
    for (const id of run.accountIds) {
      const acc = next.accounts.find((a) => a.id === id);
      if (!acc) continue;
      const q = qualify(next.org, acc, next.contacts, next.evidence, next.suppressions, at, customerKeys);
      if (q.tier === "strong") strong++; else if (q.tier === "excluded") excluded++; else possible++;
      next = { ...next, qualifications: [...next.qualifications.filter((x) => x.accountId !== id), q] };
      next = log(next, at, scoutActor, "qualification.evaluated", `${acc.name}: ${q.tier} fit (${q.score}/100, ${q.coverage}% of criteria known).`, id, null, { score: q.score, tier: q.tier });
      if (q.tier !== "excluded" && !oppFor(next, id)) {
        const opp: Opportunity = { id: newId("opp"), accountId: id, stage: "qualified", ownerId: ws.org.members[0].id, estimatedMonthly: null, nextAction: q.recommendation, origin: "scout", createdAt: at, updatedAt: at };
        next = log({ ...next, opportunities: [...next.opportunities, opp] }, at, scoutActor, "opportunity.created", `Opportunity opened for ${acc.name}.`, id, opp.id);
      }
      if (q.tier === "excluded") {
        next = { ...next, accounts: next.accounts.map((a) => (a.id === id && a.status === "prospect" ? { ...a, status: "excluded" } : a)) };
        next = log(next, at, scoutActor, "account.excluded", `${acc.name} excluded: ${q.recommendation}`, id, null);
      }
    }
    return patchRun(next, runId, (r) => doneTask(r, "qualify", `${strong} strong, ${possible} worth checking, ${excluded} excluded.`));
  }

  if (task.id === "draft") {
    const made: string[] = [];
    let blocked = 0, noContact = 0;
    for (const id of run.accountIds) {
      const q = next.qualifications.find((x) => x.accountId === id);
      const opp = oppFor(next, id);
      if (!q || !opp || q.tier === "excluded" || q.tier === "weak") continue;
      const contact = next.contacts.find((c) => c.accountId === id && c.emailKind === "business");
      if (!contact) { noContact++; continue; }
      if (isSuppressed(contact.email, next.suppressions)) {
        blocked++;
        next = log(next, at, { kind: "system", id: "guard", name: "Suppression check" }, "draft.blocked-suppressed", `No draft for ${accountName(next, id)}: ${contact.email} is on your suppression list.`, id, null);
        continue;
      }
      if (next.drafts.some((d) => d.opportunityId === opp.id && d.approval !== "rejected")) continue;
      const acc = next.accounts.find((a) => a.id === id)!;
      const out = generator.generate({ org: next.org, account: acc, contact, evidence: next.evidence });
      const draft: Draft = { id: newId("drf"), opportunityId: opp.id, contactId: contact.id, subject: out.subject, body: out.body, approval: "pending", delivery: "not-sent", approvedBy: null, approvedAt: null, edited: false, generator: out.generator, basedOnEvidenceIds: out.basedOnEvidenceIds, createdAt: at };
      next = log({ ...next, drafts: [...next.drafts, draft] }, at, scoutActor, "draft.created", `Introduction drafted for ${contact.name} at ${acc.name}. Waiting for your approval.`, id, draft.id);
      next = setStage(next, opp.id, "outreach-prepared", at, scoutActor, "");
      next = { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction: "Review and approve the introduction." } : o)) };
      made.push(draft.id);
    }
    const parts = [`${made.length} drafted`];
    if (noContact) parts.push(`${noContact} need a business contact first`);
    if (blocked) parts.push(`${blocked} blocked by suppression`);
    return patchRun(next, runId, (r) => ({ ...doneTask(r, "draft", parts.join(", ") + "."), draftIds: made }));
  }

  // handoff
  const pending = (next.runs.find((r) => r.id === runId)?.draftIds ?? []).length;
  next = patchRun(next, runId, (r) => ({ ...doneTask(r, "handoff", pending ? `${pending} drafts are waiting for you.` : "Nothing to approve."), summary: r.tasks.map((t) => t.detail).filter(Boolean).slice(1).join(" ") }));
  return pending ? runTo(next, runId, "waiting-approval", at, scoutActor, `${pending} drafts need your review`) : runTo(next, runId, "completed", at, scoutActor);
}

export function cancelRun(ws: Workspace, runId: string, at: string, actor: Actor) {
  return runTo(ws, runId, "canceled", at, actor, "Canceled by you. Nothing further will run.");
}

/** Simulates an unavailable data provider so the failure path is visible and testable. */
export function failRun(ws: Workspace, runId: string, at: string, message: string) {
  const next = patchRun(ws, runId, (r) => ({ ...r, errors: [...r.errors, { at, message, retryable: true }] }));
  return runTo(next, runId, "blocked", at, { kind: "system", id: "provider", name: "Data provider" }, message);
}

export function retryRun(ws: Workspace, runId: string, at: string, actor: Actor) {
  return runTo(ws, runId, "queued", at, actor, "Retrying.");
}

function settleRun(ws: Workspace, draftId: string, at: string): Workspace {
  const run = ws.runs.find((r) => r.draftIds.includes(draftId) && r.state === "waiting-approval");
  if (!run) return ws;
  const open = run.draftIds.some((id) => ws.drafts.find((d) => d.id === id)?.approval === "pending");
  return open ? ws : runTo(ws, run.id, "completed", at, scoutActor, "All drafts reviewed");
}

/* ---------------- Drafts and approvals ---------------- */

export function editDraft(ws: Workspace, draftId: string, patch: { subject: string; body: string }, at: string, actor: Actor) {
  const d = ws.drafts.find((x) => x.id === draftId);
  if (!d) throw new ActionError("Draft not found.");
  if (d.approval !== "pending") throw new ActionError("Only drafts waiting for approval can be edited.");
  const next = { ...ws, drafts: ws.drafts.map((x) => (x.id === draftId ? { ...x, subject: patch.subject.slice(0, 160), body: patch.body.slice(0, 5000), edited: true } : x)) };
  const opp = ws.opportunities.find((o) => o.id === d.opportunityId)!;
  return log(next, at, actor, "draft.edited", `${actor.name} edited the introduction to ${accountName(ws, opp.accountId)}.`, opp.accountId, draftId);
}

export function approveDraft(ws: Workspace, draftId: string, at: string, actor: Actor) {
  if (actor.kind !== "user") throw new ActionError("Only a person can approve outreach.");
  const d = ws.drafts.find((x) => x.id === draftId);
  if (!d) throw new ActionError("Draft not found.");
  if (d.approval !== "pending") throw new ActionError("This draft has already been reviewed.");
  const contact = ws.contacts.find((c) => c.id === d.contactId);
  if (isSuppressed(contact?.email ?? null, ws.suppressions)) throw new ActionError("This contact is on your suppression list and can't be approved.");
  const problems = validateDraft(d, ws.org);
  if (problems.length) throw new ActionError(problems.join(" "));
  const opp = ws.opportunities.find((o) => o.id === d.opportunityId)!;
  let next: Workspace = { ...ws, drafts: ws.drafts.map((x) => (x.id === draftId ? { ...x, approval: "approved", approvedBy: actor.name, approvedAt: at } : x)) };
  next = { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction: ws.org.outbound.email === "draft-only" ? "Approved. Sending is off in this workspace; copy it into your email or simulate delivery." : "Ready to send." } : o)) };
  next = log(next, at, actor, "draft.approved", `${actor.name} approved the introduction to ${contact?.name} at ${accountName(ws, opp.accountId)}. Not sent: outbound email is draft-only.`, opp.accountId, draftId);
  return settleRun(next, draftId, at);
}

export function rejectDraft(ws: Workspace, draftId: string, at: string, actor: Actor) {
  const d = ws.drafts.find((x) => x.id === draftId);
  if (!d || d.approval !== "pending") throw new ActionError("Only drafts waiting for approval can be rejected.");
  const opp = ws.opportunities.find((o) => o.id === d.opportunityId)!;
  let next: Workspace = { ...ws, drafts: ws.drafts.map((x) => (x.id === draftId ? { ...x, approval: "rejected" } : x)) };
  next = log(next, at, actor, "draft.rejected", `${actor.name} rejected the introduction to ${accountName(ws, opp.accountId)}.`, opp.accountId, draftId);
  next = setStage(next, opp.id, "qualified", at, actor, "Draft rejected.");
  return settleRun(next, draftId, at);
}

/** DEMO only: marks an approved draft as delivered in the simulation. Real sending does not exist in this build. */
export function simulateDelivery(ws: Workspace, draftId: string, at: string) {
  if (ws.org.mode !== "DEMO") throw new ActionError("Simulation is only available in the demo workspace.");
  const d = ws.drafts.find((x) => x.id === draftId);
  if (!d || d.approval !== "approved") throw new ActionError("Only approved drafts can be delivered.");
  if (d.delivery !== "not-sent") throw new ActionError("Already delivered in the simulation.");
  const contact = ws.contacts.find((c) => c.id === d.contactId)!;
  if (isSuppressed(contact.email, ws.suppressions)) throw new ActionError("This contact is suppressed.");
  const opp = ws.opportunities.find((o) => o.id === d.opportunityId)!;
  const sim: Actor = { kind: "simulation", id: "sim", name: "Demo simulation" };
  let next: Workspace = { ...ws, drafts: ws.drafts.map((x) => (x.id === draftId ? { ...x, delivery: "simulated" } : x)) };
  const conv = next.conversations.find((c) => c.accountId === opp.accountId && c.channel === "email");
  const msg = { id: newId("msg"), direction: "outbound" as const, from: ws.org.sender.name, body: d.body, at, simulated: true };
  next = conv
    ? { ...next, conversations: next.conversations.map((c) => (c.id === conv.id ? { ...c, messages: [...c.messages, msg] } : c)) }
    : { ...next, conversations: [...next.conversations, { id: newId("cnv"), accountId: opp.accountId, channel: "email", subject: d.subject, messages: [msg], handledBy: "human" }] };
  next = log(next, at, sim, "delivery.simulated", `Simulated delivery to ${contact.name}. No email left BetterDesk.`, opp.accountId, draftId);
  next = setStage(next, opp.id, "contacted", at, sim, "");
  return { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction: "Wait for a reply." } : o)) };
}

/** DEMO only: a sample reply arrives. Classification is real; the reply is simulated. */
export function simulateReply(ws: Workspace, opportunityId: string, text: string, at: string) {
  if (ws.org.mode !== "DEMO") throw new ActionError("Simulation is only available in the demo workspace.");
  const opp = ws.opportunities.find((o) => o.id === opportunityId);
  if (!opp) throw new ActionError("Opportunity not found.");
  const contact = ws.contacts.find((c) => c.accountId === opp.accountId);
  const { intent, reason } = classifyReply(text);
  const sim: Actor = { kind: "simulation", id: "sim", name: "Demo simulation" };
  const msg = { id: newId("msg"), direction: "inbound" as const, from: contact?.name ?? "Prospect", body: cleanText(text, 2000), at, simulated: true, intent };
  const conv = ws.conversations.find((c) => c.accountId === opp.accountId && c.channel === "email");
  let next: Workspace = conv
    ? { ...ws, conversations: ws.conversations.map((c) => (c.id === conv.id ? { ...c, messages: [...c.messages, msg] } : c)) }
    : { ...ws, conversations: [...ws.conversations, { id: newId("cnv"), accountId: opp.accountId, channel: "email", subject: "Reply", messages: [msg], handledBy: "human" }] };
  next = log(next, at, sim, "message.received", `Reply from ${msg.from} (simulated). Scout read it as: ${reason}`, opp.accountId, msg.id, { intent });
  if (intent === "unsubscribe" && contact?.email) {
    next = suppress(next, contact.email, "unsubscribed", at, { kind: "system", id: "guard", name: "Opt-out handler" });
    next = setStage(next, opp.id, "lost", at, sim, "They opted out.");
    return { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction: "Opted out. Do not contact." } : o)) };
  }
  if (intent === "not-interested") {
    next = setStage(next, opp.id, "lost", at, sim, "They declined.");
    return next;
  }
  next = setStage(next, opp.id, "in-conversation", at, sim, "");
  const nextAction = intent === "walkthrough" ? "Offer walkthrough times." : intent === "pricing" ? "Explain pricing needs a walkthrough; offer times." : intent === "needs-review" ? "Read and reply yourself." : "Reply to their question.";
  return { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction } : o)) };
}

/* ---------------- Scheduling ---------------- */

export function bookSampleSlot(ws: Workspace, opportunityId: string, slotStart: string, at: string, actor: Actor) {
  const slot = ws.sampleSlots.find((s) => s.start === slotStart);
  if (!slot) throw new ActionError("That time is no longer open.");
  const opp = ws.opportunities.find((o) => o.id === opportunityId);
  if (!opp) throw new ActionError("Opportunity not found.");
  if (ws.appointments.some((a) => a.opportunityId === opportunityId && (a.status === "sample-booked" || a.status === "confirmed"))) throw new ActionError("A walkthrough is already booked.");
  const appt: Appointment = { id: newId("apt"), opportunityId, kind: "walkthrough", start: slot.start, end: slot.end, status: ws.org.mode === "DEMO" ? "sample-booked" : "proposed" };
  let next: Workspace = { ...ws, appointments: [...ws.appointments, appt], sampleSlots: ws.sampleSlots.filter((s) => s.start !== slotStart) };
  const when = new Date(slot.start).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });
  next = log(next, at, actor, "appointment.booked", `Walkthrough at ${accountName(ws, opp.accountId)} booked for ${when} (sample calendar; no real invite sent).`, opp.accountId, appt.id);
  next = setStage(next, opp.id, "walkthrough-scheduled", at, actor, "");
  return { ...next, opportunities: next.opportunities.map((o) => (o.id === opp.id ? { ...o, nextAction: "Do the walkthrough, then send a proposal." } : o)) };
}

/* ---------------- Pipeline, suppression, inbound ---------------- */

export function moveStage(ws: Workspace, opportunityId: string, stage: Stage, at: string, actor: Actor) {
  if (actor.kind !== "user") throw new ActionError("Stage changes here are made by a person.");
  return setStage(ws, opportunityId, stage, at, actor, `Changed by ${actor.name}.`);
}

export function suppress(ws: Workspace, value: string, reason: "unsubscribed" | "do-not-contact" | "bounced", at: string, actor: Actor): Workspace {
  const v = value.trim().toLowerCase();
  if (!v || ws.suppressions.some((s) => s.value === v)) return ws;
  const kind = v.includes("@") ? ("email" as const) : ("domain" as const);
  let next: Workspace = { ...ws, suppressions: [...ws.suppressions, { value: v, kind, reason, at }] };
  // Pending drafts to a suppressed address are withdrawn so nobody can approve them by accident.
  const affected = next.drafts.filter((d) => d.approval === "pending" && isSuppressed(next.contacts.find((c) => c.id === d.contactId)?.email ?? null, next.suppressions));
  next = { ...next, drafts: next.drafts.map((d) => (affected.some((a) => a.id === d.id) ? { ...d, approval: "rejected" } : d)) };
  const acc = next.contacts.find((c) => c.email === v)?.accountId ?? null;
  next = log(next, at, actor, "contact.suppressed", `${v} added to the suppression list (${reason}).${affected.length ? ` ${affected.length} pending draft withdrawn.` : ""}`, acc, null);
  for (const d of affected) next = settleRun(next, d.id, at);
  return next;
}

export function receiveInquiry(ws: Workspace, form: { business: string; name: string; email: string; zip: string; message: string }, at: string) {
  const name = cleanText(form.business, 120);
  if (!name || !form.email.includes("@") || !/^\d{5}$/.test(form.zip)) throw new ActionError("Business, a valid email and a 5-digit ZIP are required.");
  const src = { kind: "inbound-form" as const, label: "Website inquiry form (sample)", retrievedAt: at };
  const keys = matchKeys(name, form.zip, form.email.split("@")[1]);
  let acc = ws.accounts.find((a) => matchKeys(a.name, a.address.zip, a.domain).some((k) => keys.includes(k)));
  let next = ws;
  if (!acc) {
    acc = { id: newId("acc"), orgId: ws.org.id, name, domain: emailKind(form.email) === "business" ? normalizeDomain(form.email.split("@")[1]) : null, address: { street: "", city: "", state: "", zip: form.zip }, category: "", sqft: null, status: "prospect", source: src, dedupeKey: dedupeKey(name, form.zip, null), createdAt: at };
    next = { ...next, accounts: [...next.accounts, acc], contacts: [...next.contacts, { id: newId("con"), accountId: acc.id, name: cleanText(form.name, 80), role: "", email: form.email.toLowerCase(), emailKind: emailKind(form.email) }] };
  }
  const { intent, reason } = classifyReply(form.message);
  const msg = { id: newId("msg"), direction: "inbound" as const, from: cleanText(form.name, 80), body: cleanText(form.message, 2000), at, simulated: true, intent };
  next = { ...next, conversations: [...next.conversations, { id: newId("cnv"), accountId: acc.id, channel: "web-form", subject: `Website inquiry from ${name}`, messages: [msg], handledBy: "human" }] };
  next = log(next, at, { kind: "simulation", id: "sim", name: "Website form (sample)" }, "inquiry.received", `Inquiry from ${msg.from} at ${name}. ${reason}`, acc.id, msg.id, { intent });
  let opp = oppFor(next, acc.id);
  if (!opp) {
    opp = { id: newId("opp"), accountId: acc.id, stage: "in-conversation", ownerId: ws.org.members[0].id, estimatedMonthly: null, nextAction: intent === "walkthrough" ? "Offer walkthrough times." : "Reply to the inquiry.", origin: "inbound", createdAt: at, updatedAt: at };
    next = log({ ...next, opportunities: [...next.opportunities, opp] }, at, { kind: "system", id: "router", name: "Inbound router" }, "opportunity.created", `Opportunity opened from the website inquiry.`, acc.id, opp.id);
  }
  return next;
}
