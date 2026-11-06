# Claims audit

Source of truth available tonight: the live marketing site only. There is no product repository, no customer records, no case studies, no integration documentation and no legal documents in this workspace. Rule applied: **a capability described on the live site may be described as what BetterDesk is built to do; any number presented as a measured outcome is removed or relabeled as an illustration or an editable projection.**

| Live claim | Evidence found | Decision in redesign |
|---|---|---|
| "AI replied in 8 seconds", "Replies in 8s", "under 10 seconds" | None (no telemetry) | Removed as a stat. Demo timestamps are labeled "Sample conversation". Copy says "within moments" / "while the caller is still on their phone". |
| "+$485 recovered", "+$1,240 recovered", "+$420 recovered" | None | Removed from hero. Values appear only inside the labeled sample walkthrough as "example job value". |
| "$1,629 per week lost", "$986/$1,746/$2,253 per month" scenarios | Model output from assumptions, presented as typical | Removed. ROI page computes from user inputs with a visible formula and disclaimer. |
| "~8 h / week back" | None | Removed. |
| "Recovers 4–7 new patients / month" (dentists) | None | Removed. Dental is not given a dedicated page (healthcare compliance unverified). |
| "2–3× consultation booking rate" (med spas) | None | Removed. |
| "10× faster quote turnaround" (cleaning) | None | Removed. |
| "Most callers reply within 2 minutes" | None | Removed. |
| "Most accounts recover 1 appointment worth in the first week" | None | Removed. |
| "Most businesses are live in under 48 hours" / "Live in under 48 hours" | None | Reframed as the intended plan: "Setup is a guided session; most of the work is telling us how your business runs." Timeline shown as a typical plan, not a guarantee, and confirmed on the call. |
| "Integrates with Google Calendar, popular practice-management systems, and major field-service platforms" | No integration list or docs | Reframed: "We connect to the calendar you already use where an integration exists. If it doesn't, BetterDesk can offer times and hand the booking to your team. We confirm which on your setup call." No vendor names or logos. |
| "Industry studies on speed-to-lead show conversion collapsing past 5 minutes" | Uncited | Removed (uncited). |
| "Gets smarter weekly", "Next reply will be 3s faster" | None | Reframed as owner-approved improvements: suggested FAQ additions you approve. No speed claims. |
| Autonomous / assisted / escalation modes | Described in live FAQ | Kept as described product behavior. Marked "confirm on your setup call" where setup-dependent. |
| Channels: calls (missed-call text-back), SMS, web forms, Instagram DMs, Google Business, email | Described on live site, plan-gated | Kept with plan gating exactly as live pricing lists. |
| "SLA + premium support" (Scale) | No SLA document | Kept as plan line item "SLA and premium support (terms agreed in contract)" — no uptime number stated. |
| "Cancel any time. No annual lock-in." / "No credit card" | Live pricing copy (business policy statement) | Kept verbatim as current public policy. Flagged for founder confirmation in HANDOFF. |
| "Every plan includes setup, calibration, and live human support" | Live pricing copy | Kept. |
| Pricing $149 / $299 / $599 and plan contents | Live pricing | **Preserved exactly.** |
| Testimonials, logos, review counts, certifications | None on live site | None added. |
| Privacy / Terms / Security / DPA | `href="#"` placeholders on live site | Not fabricated. No legal pages shipped; footer has no dead legal links. Listed as a blocker. |
| HIPAA / medical triage | Not claimed explicitly, but dentist card says "qualifies insurance" | Removed. Healthcare is mentioned only as "clinics and practices: ask us about your requirements before connecting patient data". |

## Independent red-team pass (03:2x PST) and fixes
A separate reviewer agent checked the code against the baseline. Fixed:
- Removed invented privacy/policy statements: "conversations ... are not sold", "we only use it to reply to you", an overage policy ("not hard caps").
- Removed behaviour that appeared only in sample conversations: "we'll text when the tech is on the way", reply-keyword confirm/reschedule, rescheduling (replaced with a quote follow-up, which the baseline supports), matching staff and durations.
- Replaced the invented daily "morning recap" with what the baseline describes: the conversation in the unified inbox, owner alerts (Growth+), and a plain-English weekly summary/analytics (Growth+).
- Softened guarantees: "only says what you've approved", "always go to a person", "edit it once and that becomes the answer", "doesn't change your phone number's ringing", "a calendar that fills itself", "replies on every channel".
- Removed unsourced generalisations ("Most people don't leave one", "Most missed work isn't lost to price...").
- Restored plan copy word for word from the baseline (e.g. "Review generation", "Smart lead scoring + owner alerts", "English-language analytics", "Talk to sales", "Most popular").
