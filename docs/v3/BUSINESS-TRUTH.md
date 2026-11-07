# BetterDesk business truth (V3)

## Sources and their limits
This repository is the marketing site only. It contains no product code, telephony, booking integration, billing or customer data. The only evidence for what BetterDesk does is the previously published betterdesk.ai copy, recorded in `docs/redesign/baseline-live-homepage-text.txt` and audited in `docs/redesign/CLAIMS_AUDIT.md`. Every capability below is therefore **"described on the live site"**. None of it has been verified against a running product in this session. The founder should confirm each line.

## What BetterDesk does (as described)

| Capability | Status in V3 copy |
|---|---|
| Missed-call text-back (the caller gets a text in the business's name) | Described; core of the story |
| Replies on SMS and web forms | Described; every plan |
| Instagram DMs, Google Business messages, email | Described; Growth and Scale only |
| Replies only from owner-approved business info; unknown questions go to a person | Described (live FAQ) |
| Intake questions written by the owner | Described |
| Follow-up sequences (basic on Starter, multi-step on Growth+) | Described |
| Booking into a connected calendar, otherwise handoff to staff | Described; integration list **unknown**, so no vendor names are shown |
| Assisted, escalation and autonomous modes | Described (live FAQ) |
| Unified inbox; owner alerts and weekly summary (Growth+) | Described |
| Review requests, lead scoring (Growth+); multi-location, custom CRM, SLA (Scale) | Described plan line items |
| Live voice answering by AI | **Not claimed.** On calls, V3 says the caller gets a text back. |
| "Text when the tech is on the way", reminders, rescheduling | Not claimed on the homepage. The solution pages keep V2's reminder lines, which the founder should confirm. |

**Requires human setup:** connecting the phone line, calendar and channels; writing answers and rules; choosing a mode. **Shown as illustrative:** every conversation, name, number, price and rule (all labeled). **Planned/unknown:** legal pages (privacy, terms, SMS consent), integration list, security posture.

## First customer
| Segment | Pain | Fit | Setup | Restrictions | Verdict |
|---|---|---|---|---|---|
| **Home services (plumbing, HVAC, electrical)** | Owner and techs on jobs, hands full; urgent and routine calls mixed | Text-back, triage rules, arrival windows | Phone and calendar | Emergencies need safety rules (supported as handoff rules) | **Primary persona** |
| Salons, barbers, spas | Messages mid-service, evening booking | Strong on DMs, but those are Growth+ | Booking-tool integration uncertain | Deposits/policies vary | Support example 1 |
| Cleaning companies | Quote requests during jobs | Good | Simple | None notable | Support example 2 |
| Auto shops | Calls from the bay | Good | Shop software integrations unknown | None notable | Mentioned |
| Clinics/practices | Front-desk overflow | Partial | Heavy | Health-data compliance unverified | Mentioned with caution only |

The persona is Marco, owner of a small plumbing company, who is under a sink when the phone rings. Every homepage act follows one illustrative afternoon (`lib/story.ts`).

## Plain answers
- **What happens when I miss a lead?** The caller gets a text back in your business's name, within moments.
- **What does BetterDesk do?** It asks your questions, follows up if they go quiet, offers your open times (or hands off), and logs everything in one inbox.
- **What do I still do?** You approve replies at first, handle anything sensitive, and do the work.
- **How soon can I start?** After a guided setup session. The timeline is agreed on the demo call; V3 promises no number of hours.
- **What software does it use?** Your existing phone line and, where an integration exists, your calendar. This is confirmed per customer.
- **Can I try it?** Through a demo call. The site has no self-serve trial, and none is claimed.
- **What does it cost?** See the pricing proposal below.
- **Why not ChatGPT, an answering service or a CRM?** With a DIY bot, you build the phone, texting and calendar wiring and control what it says. An answering service usually takes a message. A CRM stores leads but doesn't answer them. BetterDesk is set up by a person and answers only from what you've approved. V3 keeps the comparison general.

**Before / BetterDesk / result.** *Before:* the call rings out, and the caller may try the next number. *BetterDesk:* a text in moments, intake questions, one follow-up, two real open times. *Result:* a booked visit, or a clean handoff to your team, with the conversation in your inbox. *Limit:* no booking without a connected calendar, and no answers beyond your list.

## Pricing proposal (not live)
The current published prices are $149 / $299 / $599. **There is no checkout or Stripe in this repo, so nothing was changed in billing.** Every plan CTA goes to `/contact?plan=…`.

| Plan | Proposed | Change | Included conversations | Overage |
|---|---|---|---|---|
| Starter | $129 | −13% | 150 / mo | $0.40 each |
| Growth | $249 | −17% | 500 / mo | $0.40 each |
| Scale | $499 | −17% | 1,500 / mo | $0.40 each |

A conversation is one customer thread in a 24-hour window, on any channel. Nothing is sold as "unlimited". The UI labels every price "Proposed. Currently published at $X."

**Unit economics.** These are **assumptions, not verified costs.** They are public list-price ballparks, and the founder's actual invoices must replace them.
- SMS: about $0.008 per segment plus about $0.003–0.005 carrier fees. A typical conversation of about 6 segments costs about $0.07.
- Model inference: about $0.01–0.04 per conversation, depending on model and length.
- Phone number about $1–2 / mo, plus one-time 10DLC registration fees.
- **Estimated variable cost: about $0.10–0.15 per conversation.** At full use that is about $15–23 for Starter (about 82–88% gross margin before people costs), about $50–75 for Growth, and about $150–225 for Scale. The $0.40 overage keeps about 60–75% margin on marginal use.
- The real cost driver is **human setup and support**, which is included on every plan. If onboarding takes more than about 3 hours per customer, Starter at $129 needs a setup fee or a 2–3 month minimum. That is a founder decision.

**Approval needed before going live:** the prices, the conversation allowances, the overage rate and the definition of a conversation, plus billing configuration and grandfathering terms for existing subscribers.
