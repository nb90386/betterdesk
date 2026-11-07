/**
 * Marketing examples computed by the product's own pure functions on the fictional sample company,
 * so every number on the site is something the code actually produced (no hand-typed claims).
 */
import { createSampleWorkspace, SAMPLE_PROSPECTS_CSV } from "../demo/seed.ts";
import { parseProspectCsv } from "../scout/csv.ts";
import { importProspects } from "../workspace/actions.ts";
import { qualify } from "../scout/qualify.ts";
import { templateGenerator } from "../scout/draft.ts";

export const SAMPLE_AT = "2026-11-03T15:00:00.000Z";

export function scoutExample(name = "Juniper Lane Law") {
  const ws0 = createSampleWorkspace(Date.parse(SAMPLE_AT));
  const parsed = parseProspectCsv(SAMPLE_PROSPECTS_CSV);
  const { ws, summary } = importProspects(ws0, parsed.rows, "sample-prospects.csv", SAMPLE_AT, { kind: "user", id: "usr_dana", name: "Dana Ortiz" });
  const account = ws.accounts.find((a) => a.name === name)!;
  const contacts = ws.contacts.filter((c) => c.accountId === account.id);
  const evidence = ws.evidence.filter((e) => e.accountId === account.id);
  const q = qualify(ws.org, account, contacts, evidence, ws.suppressions, SAMPLE_AT);
  const draft = templateGenerator.generate({ org: ws.org, account, contact: contacts[0], evidence });
  const all = ws.accounts
    .filter((a) => a.source.kind === "csv-import")
    .map((a) => ({ name: a.name, withheld: ws.evidence.some((e) => e.accountId === a.id && e.flagged), q: qualify(ws.org, a, ws.contacts.filter((c) => c.accountId === a.id), ws.evidence.filter((e) => e.accountId === a.id), ws.suppressions, SAMPLE_AT) }));
  return { org: ws.org, account, contact: contacts[0], evidence, q, draft, summary, rows: parsed.rows.length, all };
}
