/**
 * The homepage story, using the same fictional records as the sample workspace
 * (lib/demo/seed.ts): Juniper Lane Law, Elena Brooks, Clearline Commercial Cleaning.
 */
export type JourneyStep = { id: string; label: string; actor: "Scout" | "You" | "Juniper Lane Law" | "BetterDesk"; title: string; detail: string; caption: string };

export const JOURNEY: JourneyStep[] = [
  { id: "found", label: "Found", actor: "BetterDesk", title: "Juniper Lane Law", detail: "Office · 12,000 sq ft · 1550 Wynkoop St, 80202", caption: "It starts as one row in a list you already have: a law office in your service area." },
  { id: "qualified", label: "Qualified", actor: "Scout", title: "Strong fit · 5 of 5 criteria", detail: "In your area · offices are a target · above 5,000 sq ft · business contact · not a customer", caption: "Scout checks it against your rules and shows the evidence for every answer." },
  { id: "introduced", label: "Introduced", actor: "You", title: "Introduction approved by Dana", detail: "“Cleaning for Juniper Lane Law” · to Elena Brooks, office administrator", caption: "Scout drafts the introduction. Nothing goes anywhere until you approve it." },
  { id: "replied", label: "Replied", actor: "Juniper Lane Law", title: "Elena replied", detail: "“Could someone come by for a walkthrough next week?” · read as: wants a walkthrough", caption: "The reply lands on the same record, already sorted: she wants a walkthrough." },
  { id: "walkthrough", label: "Walkthrough", actor: "You", title: "Walkthrough booked", detail: "Tuesday, 8:00 AM · 45 minutes · on your calendar", caption: "You pick a time from your real availability. The pipeline moves on its own." },
  { id: "proposal", label: "Proposal", actor: "You", title: "Proposal sent", detail: "Nightly cleaning, two floors · follow-up reminder in 4 days", caption: "After the walkthrough, the proposal and its follow-up stay with the record." },
  { id: "won", label: "Customer", actor: "You", title: "Won · recurring contract", detail: "Every step above, in one timeline, from the first row to the signed contract", caption: "And when it's won, you can see exactly how it got there." },
];
