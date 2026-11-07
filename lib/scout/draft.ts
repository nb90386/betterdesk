import type { Account, Contact, Evidence, Organization } from "../domain/types.ts";

/**
 * Outreach drafting behind an adapter. The shipped generator is deterministic: it only uses
 * the sender's identity, the account's own fields and non-flagged evidence, so nothing in a draft
 * can be invented. A model-backed generator can implement the same interface later (BLOCKED: no
 * provider key is configured), and its output must still pass `validateDraft`.
 */
export type DraftInput = { org: Organization; account: Account; contact: Contact; evidence: Evidence[] };
export type DraftOutput = { subject: string; body: string; basedOnEvidenceIds: string[]; generator: string };
export interface DraftGenerator { id: string; generate(input: DraftInput): DraftOutput }

const firstName = (n: string) => n.trim().split(/\s+/)[0] ?? "";

export const templateGenerator: DraftGenerator = {
  id: "template-v1",
  generate({ org, account, contact, evidence }) {
    const usable = evidence.filter((e) => e.accountId === account.id && !e.flagged);
    const size = account.sqft ? `your ${account.sqft.value.toLocaleString()} sq ft ${account.category.toLowerCase() || "facility"}` : `your ${account.category.toLowerCase() || "facility"}`;
    const where = account.address.street ? ` on ${account.address.street.replace(/^'/, "")}` : ` in ${account.address.city}`;
    const services = org.services.slice(0, 3).join(", ").toLowerCase();
    const subject = `Cleaning for ${account.name}`;
    const body = [
      `Hi ${firstName(contact.name)},`,
      ``,
      `I'm ${org.sender.name}, ${org.sender.title.toLowerCase()} at ${org.sender.company}. We handle ${services} for businesses in ${org.serviceArea.label}.`,
      ``,
      `I'm reaching out about ${size}${where}. If you're reviewing your cleaning contract or schedule this year, I'd be glad to do a short walkthrough and send a written quote. No obligation.`,
      ``,
      `Would a 20-minute walkthrough one morning next week be useful?`,
      ``,
      `${org.sender.name}`,
      `${org.sender.title}, ${org.sender.company}`,
      `${org.sender.email}`,
      ``,
      `${org.sender.postalAddress}`,
      `If you'd rather not hear from us, reply "unsubscribe" and we won't contact you again.`,
    ].join("\n");
    return { subject, body, basedOnEvidenceIds: usable.map((e) => e.id), generator: this.id };
  },
};

/** Checks every draft (template or model) must pass before it can be approved. */
export function validateDraft(d: { subject: string; body: string }, org: Organization) {
  const problems: string[] = [];
  if (!d.body.includes(org.sender.name) || !d.body.includes(org.sender.company)) problems.push("Sender name and company must appear in the message.");
  if (!d.body.includes(org.sender.postalAddress)) problems.push("Include your postal address.");
  if (!/unsubscribe|opt out|not hear from us/i.test(d.body)) problems.push("Include a way to opt out.");
  if (/^(re|fw|fwd):/i.test(d.subject.trim())) problems.push("Subject can't pretend to be a reply or forward.");
  if (/\b(urgent|final notice|act now|last chance)\b/i.test(d.subject + " " + d.body)) problems.push("Remove pressure language.");
  if (/\b(as (we|you) discussed|following up on our (call|conversation)|referred by|met you)\b/i.test(d.body)) problems.push("Don't imply a relationship or referral that doesn't exist.");
  if (d.subject.trim().length < 3) problems.push("Add a subject.");
  return problems;
}
