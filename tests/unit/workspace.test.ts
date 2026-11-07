import { test } from "node:test";
import assert from "node:assert/strict";
import { createSampleWorkspace, SAMPLE_PROSPECTS_CSV } from "../../lib/demo/seed.ts";
import { parseProspectCsv, neutralizeFormula } from "../../lib/scout/csv.ts";
import { classifyReply } from "../../lib/scout/reply.ts";
import { validateDraft } from "../../lib/scout/draft.ts";
import { transition, InvalidTransition } from "../../lib/domain/run.ts";
import * as A from "../../lib/workspace/actions.ts";
import { attention } from "../../lib/workspace/selectors.ts";
import type { Workspace } from "../../lib/domain/types.ts";

const dana = { kind: "user" as const, id: "usr_dana", name: "Dana Ortiz" };
const scout = { kind: "scout" as const, id: "scout", name: "Scout" };
const at = "2026-11-07T16:00:00.000Z";
const NOW = Date.parse(at);

function imported() {
  const ws = createSampleWorkspace(NOW);
  const parsed = parseProspectCsv(SAMPLE_PROSPECTS_CSV);
  return { parsed, ...A.importProspects(ws, parsed.rows, "sample-prospects.csv", at, dana) };
}
function runAll(ws: Workspace, runId: string) {
  for (let i = 0; i < 8; i++) ws = A.stepRun(ws, runId, at);
  return ws;
}
const byName = (ws: Workspace, n: string) => ws.accounts.find((a) => a.name === n)!;

test("CSV: parses quotes, skips rows without ZIP, neutralises formulas", () => {
  const { parsed } = imported();
  assert.equal(parsed.rows.length, 10);
  assert.ok(parsed.issues.some((i) => /Lantern Studio Architects/.test(i.message)));
  assert.equal(parsed.rows.find((r) => r.name === "Cobalt Coworking, LLC")?.zip, "80205");
  assert.match(parsed.rows.find((r) => r.name === "Tallgrass Pediatrics")!.notes!, /^'=HYPERLINK/);
  assert.equal(neutralizeFormula("+1 555"), "'+1 555");
  assert.equal(parseProspectCsv("foo,bar\n1,2").issues[0].message, 'Missing a "name" column.');
});

test("import: creates accounts with sourced evidence and skips the duplicate", () => {
  const { ws, summary } = imported();
  assert.equal(summary.imported.length, 9);
  assert.deepEqual(summary.duplicates.map((d) => d.matched), ["Cobalt Coworking"]);
  const jl = byName(ws, "Juniper Lane Law");
  const ev = ws.evidence.filter((e) => e.accountId === jl.id);
  assert.ok(ev.every((e) => e.source.label === "sample-prospects.csv" && e.source.retrievedAt === at));
  assert.equal(ws.accounts.filter((a) => /cobalt/i.test(a.name)).length, 1);
});

test("untrusted note with instructions is withheld and never reaches a draft", () => {
  const { ws, summary } = imported();
  assert.equal(summary.withheld, 1);
  const bb = byName(ws, "Bluebird Realty Partners");
  const { ws: w2, runId } = A.createRun(ws, "Find good fits", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  const done = runAll(w2, runId);
  const run = done.runs.find((r) => r.id === runId)!;
  assert.deepEqual(run.scope.allowedTools.includes("draft-outreach"), true);
  assert.ok(!run.scope.allowedTools.some((t) => /send/.test(t)), "Scout has no send tool");
  const opp = done.opportunities.find((o) => o.accountId === bb.id)!;
  const draft = done.drafts.find((d) => d.opportunityId === opp.id)!;
  assert.doesNotMatch(draft.body, /ignore previous/i);
  assert.equal(done.qualifications.find((q) => q.accountId === bb.id)!.needsHumanReview, true);
});

test("Scout run: qualifies with explainable criteria, drafts only for business contacts, blocks suppressed", () => {
  const { ws } = imported();
  const ids = ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id);
  const { ws: w2, runId } = A.createRun(ws, "Find suitable businesses and prepare introductions", ids, at, dana);
  const done = runAll(w2, runId);
  const run = done.runs.find((r) => r.id === runId)!;
  assert.equal(run.state, "waiting-approval");
  const q = (n: string) => done.qualifications.find((x) => x.accountId === byName(done, n).id)!;
  assert.equal(q("Juniper Lane Law").tier, "strong");
  assert.equal(q("Westwind Logistics").tier, "excluded");
  assert.equal(q("Copperline Fitness").criteria.find((c) => c.id === "size")!.result, "unknown");
  assert.ok(q("Juniper Lane Law").criteria.every((c) => c.detail.length > 0));
  const draftedFor = done.drafts.map((d) => done.accounts.find((a) => a.id === done.opportunities.find((o) => o.id === d.opportunityId)!.accountId)!.name);
  assert.ok(draftedFor.includes("Juniper Lane Law"));
  assert.ok(!draftedFor.includes("Copperline Fitness"), "no draft to a personal email");
  assert.ok(!draftedFor.includes("Maple & Main Pediatric Dental"), "no draft to a suppressed contact");
  assert.ok(done.events.some((e) => e.type === "draft.blocked-suppressed"));
  assert.ok(done.drafts.every((d) => d.approval === "pending" && d.delivery === "not-sent"));
  for (const d of done.drafts) assert.deepEqual(validateDraft(d, done.org), []);
});

test("approval: only a person can approve; approval does not send; run completes when all reviewed", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare introductions", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let done = runAll(w2, runId);
  const [first, ...rest] = done.drafts;
  assert.throws(() => A.approveDraft(done, first.id, at, scout), /Only a person/);
  done = A.approveDraft(done, first.id, at, dana);
  const d = done.drafts.find((x) => x.id === first.id)!;
  assert.equal(d.approval, "approved");
  assert.equal(d.delivery, "not-sent");
  assert.equal(d.approvedBy, "Dana Ortiz");
  assert.throws(() => A.approveDraft(done, first.id, at, dana), /already been reviewed/);
  for (const r of rest) done = A.rejectDraft(done, r.id, at, dana);
  assert.equal(done.runs.find((r) => r.id === runId)!.state, "completed");
});

test("invalid draft edits cannot be approved", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let done = runAll(w2, runId);
  const d = done.drafts[0];
  done = A.editDraft(done, d.id, { subject: "Re: our call", body: "As we discussed, act now." }, at, dana);
  assert.throws(() => A.approveDraft(done, d.id, at, dana), /postal address|opt out|reply or forward/);
});

test("canceled run produces no further effects", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let w = A.stepRun(w2, runId, at); // scope
  w = A.cancelRun(w, runId, at, dana);
  const before = { q: w.qualifications.length, d: w.drafts.length, e: w.events.length };
  w = runAll(w, runId);
  assert.deepEqual({ q: w.qualifications.length, d: w.drafts.length, e: w.events.length }, before);
  assert.throws(() => A.retryRun(w, runId, at, dana), InvalidTransition);
});

test("provider failure blocks the run with a useful, retryable error", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", [ws.accounts[4].id], at, dana);
  let w = A.failRun(w2, runId, at, "Business-data provider not connected. Import a CSV instead.");
  const run = w.runs.find((r) => r.id === runId)!;
  assert.equal(run.state, "blocked");
  assert.equal(run.errors[0].retryable, true);
  w = A.retryRun(w, runId, at, dana);
  assert.equal(w.runs.find((r) => r.id === runId)!.retries, 1);
});

test("run state machine rejects impossible transitions", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "x", [ws.accounts[4].id], at, dana);
  const run = w2.runs.find((r) => r.id === runId)!;
  assert.throws(() => transition(run, "completed", at), InvalidTransition);
  assert.throws(() => transition({ ...run, state: "canceled" }, "running", at), InvalidTransition);
});

test("simulated delivery, reply, booking: pipeline and timeline stay coherent", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let w = runAll(w2, runId);
  const jl = byName(w, "Juniper Lane Law");
  const opp = w.opportunities.find((o) => o.accountId === jl.id)!;
  const draft = w.drafts.find((d) => d.opportunityId === opp.id)!;
  assert.throws(() => A.simulateDelivery(w, draft.id, at), /Only approved/);
  w = A.approveDraft(w, draft.id, at, dana);
  w = A.simulateDelivery(w, draft.id, at);
  assert.equal(w.opportunities.find((o) => o.id === opp.id)!.stage, "contacted");
  w = A.simulateReply(w, opp.id, "Thanks Dana, could someone come by for a walkthrough next week?", at);
  assert.equal(w.opportunities.find((o) => o.id === opp.id)!.stage, "in-conversation");
  const slot = w.sampleSlots[0].start;
  w = A.bookSampleSlot(w, opp.id, slot, at, dana);
  assert.equal(w.opportunities.find((o) => o.id === opp.id)!.stage, "walkthrough-scheduled");
  assert.equal(w.appointments.find((a) => a.opportunityId === opp.id)!.status, "sample-booked");
  assert.ok(!w.sampleSlots.some((s) => s.start === slot), "slot is no longer offered");
  assert.throws(() => A.bookSampleSlot(w, opp.id, w.sampleSlots[0].start, at, dana), /already booked/);
  const timeline = w.events.filter((e) => e.accountId === jl.id).map((e) => e.type);
  for (const t of ["account.imported", "qualification.evaluated", "draft.created", "draft.approved", "delivery.simulated", "message.received", "appointment.booked"]) assert.ok(timeline.includes(t as never), t);
});

test("unsubscribe reply suppresses the contact everywhere and closes the opportunity", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let w = runAll(w2, runId);
  const d = w.drafts[0];
  w = A.approveDraft(w, d.id, at, dana);
  w = A.simulateDelivery(w, d.id, at);
  w = A.simulateReply(w, d.opportunityId, "Please remove me from your list.", at);
  const email = w.contacts.find((c) => c.id === d.contactId)!.email!;
  assert.ok(w.suppressions.some((s) => s.value === email));
  assert.equal(w.opportunities.find((o) => o.id === d.opportunityId)!.stage, "lost");
  // A new run cannot draft to them again.
  const { ws: w3, runId: r2 } = A.createRun(w, "Again", [w.opportunities.find((o) => o.id === d.opportunityId)!.accountId], at, dana);
  const again = runAll(w3, r2);
  assert.equal(again.drafts.filter((x) => x.contactId === d.contactId && x.approval === "pending").length, 0);
});

test("suppressing an address withdraws pending drafts to it", () => {
  const { ws } = imported();
  const { ws: w2, runId } = A.createRun(ws, "Prepare", ws.accounts.filter((a) => a.status === "prospect").map((a) => a.id), at, dana);
  let w = runAll(w2, runId);
  const d = w.drafts[0];
  const email = w.contacts.find((c) => c.id === d.contactId)!.email!;
  w = A.suppress(w, email, "do-not-contact", at, dana);
  assert.equal(w.drafts.find((x) => x.id === d.id)!.approval, "rejected");
  assert.throws(() => A.approveDraft(w, d.id, at, dana));
});

test("inbound inquiry joins an existing account instead of duplicating it", () => {
  const ws = createSampleWorkspace(NOW);
  const w = A.receiveInquiry(ws, { business: "Cobalt Coworking LLC", name: "Nia Patel", email: "nia@cobaltcowork.example", zip: "80205", message: "What would weekend cleaning cost?" }, at);
  assert.equal(w.accounts.filter((a) => /cobalt/i.test(a.name)).length, 1);
  assert.equal(w.opportunities.filter((o) => o.accountId === "acc_cobalt").length, 1);
  assert.throws(() => A.receiveInquiry(ws, { business: "", name: "x", email: "bad", zip: "1", message: "" }, at), /required/);
});

test("reply classification is conservative", () => {
  assert.equal(classifyReply("Not interested, thanks").intent, "not-interested");
  assert.equal(classifyReply("unsubscribe").intent, "unsubscribe");
  assert.equal(classifyReply("How much for 3 nights a week?").intent, "pricing");
  assert.equal(classifyReply("Can you come by Tuesday for a walkthrough?").intent, "walkthrough");
  assert.equal(classifyReply("ok").intent, "needs-review");
});

test("Scout cannot move pipeline stages directly", () => {
  const ws = createSampleWorkspace(NOW);
  assert.throws(() => A.moveStage(ws, "opp_lark", "won", at, scout), /made by a person/);
  const w = A.moveStage(ws, "opp_lark", "won", at, dana);
  assert.equal(w.opportunities.find((o) => o.id === "opp_lark")!.stage, "won");
});

test("Scout never regresses deals that are further along", () => {
  const ws = createSampleWorkspace(NOW);
  const ids = ws.accounts.map((a) => a.id);
  const { ws: w2, runId } = A.createRun(ws, "Everything", ids, at, dana);
  const done = runAll(w2, runId);
  const stage = (id: string) => done.opportunities.find((o) => o.id === id)!.stage;
  assert.equal(stage("opp_lark"), "proposal");
  assert.equal(stage("opp_cobalt"), "walkthrough-scheduled");
  assert.equal(stage("opp_ridge"), "won");
  assert.equal(done.drafts.length, 0);
  assert.equal(done.accounts.find((a) => a.id === "acc_ridgeview")!.status, "customer");
});

/* ---------------- Presence ↔ workspace ---------------- */

const AUDIT = {
  id: "aud_test",
  domain: "clearline.example",
  method: "sample" as const,
  fetchedAt: at,
  pagesChecked: 5,
  findings: [{ id: "f_robots", title: "robots.txt blocks OAI-SearchBot", severity: "high" as const, category: "access", evidenceUrl: "https://clearline.example/robots.txt" }],
};

test("a Presence finding becomes one owned task, idempotently, and shows on Today", () => {
  const ws = createSampleWorkspace(NOW);
  const w1 = A.recordPresenceAudit(ws, AUDIT, at, dana);
  assert.equal(A.recordPresenceAudit(w1, AUDIT, at, dana), w1, "recording the same audit twice is a no-op");
  const { ws: w2, taskId } = A.createTaskFromFinding(w1, "aud_test", "f_robots", "usr_luis", at, dana);
  const again = A.createTaskFromFinding(w2, "aud_test", "f_robots", "usr_luis", at, dana);
  assert.equal(again.taskId, taskId);
  assert.equal(again.ws.tasks.length, 1);
  const task = w2.tasks[0];
  assert.equal(task.ownerId, "usr_luis");
  assert.equal(task.origin.kind, "presence-finding");
  assert.ok(w2.events.some((e) => e.type === "task.created" && e.subjectId === taskId));
  assert.ok(attention(w2).some((a) => a.kind === "task" && a.title.includes("OAI-SearchBot")));
  assert.throws(() => A.createTaskFromFinding(w1, "aud_test", "f_robots", "usr_nobody", at, dana), /Choose someone/);
  assert.throws(() => A.createTaskFromFinding(w1, "aud_test", "missing", "usr_luis", at, dana), /no longer/);
});

test("completing a website task never claims an outcome", () => {
  const ws = A.recordPresenceAudit(createSampleWorkspace(NOW), AUDIT, at, dana);
  const { ws: w, taskId } = A.createTaskFromFinding(ws, "aud_test", "f_robots", "usr_dana", at, dana);
  const done = A.completeTask(w, taskId, at, dana);
  const ev = done.events.at(-1)!;
  assert.equal(ev.type, "task.completed");
  assert.match(ev.summary, /Run the audit again/);
  assert.doesNotMatch(ev.summary, /rank|traffic|leads|more customers/i);
  assert.ok(!attention(done).some((a) => a.kind === "task"));
});

test("inquiry provenance is only what the person reported", () => {
  const ws = createSampleWorkspace(NOW);
  const asked = A.receiveInquiry(ws, { business: "Northfield Dental", name: "Ana Ruiz", email: "ana@northfield.example", zip: "80218", message: "Could someone come look at our office?", reportedChannel: "ai-assistant" }, at);
  const acc = asked.accounts.find((a) => a.name === "Northfield Dental")!;
  assert.equal(acc.source.reportedChannel, "ai-assistant");
  assert.match(asked.events.find((e) => e.type === "inquiry.received" && e.accountId === acc.id)!.summary, /their answer, not tracked/);
  const notAsked = A.receiveInquiry(ws, { business: "Southgate Clinic", name: "B", email: "b@southgate.example", zip: "80210", message: "Hello", reportedChannel: "bogus" as never }, at);
  assert.equal(notAsked.accounts.find((a) => a.name === "Southgate Clinic")!.source.reportedChannel, "not-asked");
});

test("a booked walkthrough clears the 'waiting for a reply' item for that account", () => {
  const ws = createSampleWorkspace(NOW);
  assert.ok(attention(ws).some((a) => a.kind === "reply" && a.title.includes("Alder")));
  const booked = A.bookSampleSlot(ws, "opp_alder", ws.sampleSlots[0].start, at, dana);
  assert.ok(!attention(booked).some((a) => a.kind === "reply" && a.title.includes("Alder")));
});
