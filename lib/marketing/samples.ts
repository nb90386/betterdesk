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
    .map((a) => {
      const cs = ws.contacts.filter((c) => c.accountId === a.id);
      const ev = ws.evidence.filter((e) => e.accountId === a.id);
      const q = qualify(ws.org, a, cs, ev, ws.suppressions, SAMPLE_AT);
      const business = cs.find((c) => c.emailKind === "business") ?? null;
      const suppressed = q.recommendation.startsWith("Do not contact");
      // Same rule as the run: drafts only for good or possible fits with a business contact, never suppressed.
      const draft = business && !suppressed && (q.tier === "strong" || q.tier === "possible") ? templateGenerator.generate({ org: ws.org, account: a, contact: business, evidence: ev }) : null;
      return {
        id: a.id,
        name: a.name,
        category: a.category,
        sqft: a.sqft?.value ?? null,
        street: a.address.street,
        contact: business ? `${business.name}${business.role ? `, ${business.role}` : ""}` : null,
        withheld: ev.some((e) => e.flagged),
        evidence: ev.filter((e) => !e.flagged).map((e) => ({ claim: e.claim, source: e.source.label })),
        q,
        draft,
      };
    });
  return { org: ws.org, account, contact: contacts[0], evidence, q, draft, summary, rows: parsed.rows.length, all };
}
