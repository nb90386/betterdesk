import type { Account, Contact, Criterion, Evidence, Organization, Qualification, Suppression } from "../domain/types.ts";

export const RULE_VERSION = "cleaning-v1";
const PERSONAL = /@(gmail|yahoo|hotmail|outlook|icloud|aol|proton(mail)?|live|msn)\./i;

export function emailKind(email: string | null | undefined): Contact["emailKind"] {
  if (!email) return "none";
  return PERSONAL.test(email) ? "personal" : "business";
}

export function isSuppressed(email: string | null, suppressions: Suppression[]) {
  if (!email) return false;
  const e = email.toLowerCase();
  const domain = e.split("@")[1];
  return suppressions.some((s) => (s.kind === "email" && s.value.toLowerCase() === e) || (s.kind === "domain" && s.value.toLowerCase() === domain));
}

/**
 * Explainable, rule-based qualification for commercial cleaning. Every criterion says what was
 * checked, the result, and which evidence it relied on. Missing data is "unknown", never assumed.
 * Score = met weight ÷ evaluated weight; coverage = evaluated weight ÷ total weight.
 */
export function qualify(org: Organization, account: Account, contacts: Contact[], evidence: Evidence[], suppressions: Suppression[], at: string, existingCustomerKeys: string[] = []): Qualification {
  const ev = (pred: (e: Evidence) => boolean) => evidence.filter((e) => e.accountId === account.id && !e.flagged && pred(e)).map((e) => e.id);
  const primary = contacts.find((c) => c.accountId === account.id) ?? null;
  const c: Criterion[] = [];

  const inArea = org.serviceArea.zips.includes(account.address.zip);
  c.push({ id: "area", label: "Inside your service area", weight: 30, result: inArea ? "met" : "not-met", detail: inArea ? `ZIP ${account.address.zip} is in ${org.serviceArea.label}.` : `ZIP ${account.address.zip} is outside ${org.serviceArea.label}.`, evidenceIds: ev((e) => e.claim.startsWith("Address")) });

  const cat = account.category.trim();
  const catKnown = cat !== "";
  const catFit = org.idealCustomer.categories.some((k) => k.toLowerCase() === cat.toLowerCase());
  c.push({ id: "category", label: "A facility type you serve", weight: 25, result: !catKnown ? "unknown" : catFit ? "met" : "not-met", detail: !catKnown ? "No business category in the source." : catFit ? `${cat} is on your target list.` : `${cat} is not on your target list.`, evidenceIds: ev((e) => e.claim.startsWith("Category")) });

  const sq = account.sqft;
  c.push({ id: "size", label: `Facility around ${org.idealCustomer.minSqft.toLocaleString()} sq ft or larger`, weight: 20, result: !sq ? "unknown" : sq.value >= org.idealCustomer.minSqft ? "met" : "not-met", detail: !sq ? "No facility size in any source. Not estimated." : `${sq.value.toLocaleString()} sq ft, from ${sq.source.label}.`, evidenceIds: ev((e) => e.claim.startsWith("Facility size")) });

  const kind = primary ? primary.emailKind : "none";
  c.push({ id: "contact", label: "A business contact to address", weight: 15, result: kind === "business" ? "met" : kind === "personal" ? "not-met" : "unknown", detail: kind === "business" ? `${primary!.name}, ${primary!.role || "role not given"}.` : kind === "personal" ? "Only a personal email address. BetterDesk won't draft to personal addresses." : "No contact in the source.", evidenceIds: ev((e) => e.claim.startsWith("Contact")) });

  const existing = existingCustomerKeys.includes(account.dedupeKey) || account.status === "customer";
  c.push({ id: "existing", label: "Not already a customer", weight: 10, result: existing ? "not-met" : "met", detail: existing ? "Already a customer in BetterDesk." : "No matching customer record.", evidenceIds: [] });

  const suppressed = isSuppressed(primary?.email ?? null, suppressions);
  const total = c.reduce((s, x) => s + x.weight, 0);
  const evaluated = c.filter((x) => x.result !== "unknown").reduce((s, x) => s + x.weight, 0);
  const met = c.filter((x) => x.result === "met").reduce((s, x) => s + x.weight, 0);
  const score = evaluated ? Math.round((met / evaluated) * 100) : 0;
  const coverage = Math.round((evaluated / total) * 100);
  const missing = c.filter((x) => x.result === "unknown").map((x) => x.label);
  const hardFail = !inArea || existing || (catKnown && !catFit);
  const withheld = evidence.some((e) => e.accountId === account.id && e.flagged);

  let tier: Qualification["tier"];
  if (hardFail) tier = "excluded";
  else if (score >= 85 && coverage >= 70) tier = "strong";
  else if (score >= 60) tier = "possible";
  else tier = "weak";

  const recommendation = suppressed
    ? "Do not contact: this address is on your suppression list."
    : tier === "excluded"
      ? !inArea ? "Outside your service area. Leave it unless you expand." : existing ? "Already a customer. Handle as an existing account." : "Not a facility type you target."
      : tier === "strong"
        ? kind === "business" ? "Good fit. Review the draft introduction." : "Good fit, but find a business contact before any outreach."
        : missing.length
          ? `Possible fit. Confirm ${missing.map((m) => m.toLowerCase()).join(" and ")} before reaching out.`
          : "Weak fit on the information available.";

  return { accountId: account.id, score, coverage, tier, criteria: c, missing, recommendation, needsHumanReview: withheld || tier !== "strong" || suppressed, ruleVersion: RULE_VERSION, evaluatedAt: at };
}
