# BetterDesk V4 — Product Strategy

Status: research draft, 2026-11-07. **No customer interviews have occurred.** Every claim about customer behaviour below is an assumption until the interview guide (end of doc) has been run. Competitor and pricing evidence lives in `COMPETITIVE-RESEARCH.md` and `PRICING-AND-UNIT-ECONOMICS.md`.

## 1. Selected customer

**Commercial cleaning contractors with 5–50 employees** that sell recurring janitorial contracts (offices, medical suites, schools, light industrial, multi-tenant buildings) to businesses, typically within a 30–60 minute service radius.

- **Buyer:** the owner/operator (often also the primary salesperson). Signs the subscription, owns revenue targets.
- **Daily user:** the owner in companies under ~15 staff; an office manager, sales coordinator or first sales hire in larger ones. Field supervisors are *not* users of BetterDesk; they live in ops tools (Swept, Janitorial Manager, CleanGuru, OrangeQC).
- **Why this segment (evidence):** janitorial is a large, fragmented employer base — third-party summaries of the 2023 Census County Business Patterns cite ~67.8k establishments with paid employees in NAICS 5617x (not verified against Census directly: the Census API now requires a key). Sources disagree on whether that figure is 561720 or the 56172 parent.
- **Why this segment (assumption):** contracts are recurring monthly, one win is worth many months of subscription, and the sales motion (find buildings → get a walkthrough → bid → win) is repeatable and under-tooled compared with operations.

## 2. Main problem

Owners of small commercial cleaning companies grow by winning new recurring contracts, but the sales work is ad hoc: lead lists live in spreadsheets, research on each prospect happens by hand (if at all), follow-up depends on memory, inbound website/phone inquiries get mixed with residential and job-seeker noise, and walkthroughs are booked by phone tag. Ops software for the industry is mature (scheduling, inspections, time clocks, bidding). Evidence on pricing pages and in feature lists shows **little purpose-built tooling for the pre-bid pipeline** (see competitive doc: Swept, OrangeQC and Janitorial Manager list no CRM or sales features on pricing pages; CleanGuru and Aspire list CRM and bidding). "Not observed" ≠ "does not exist."

## 3. Candidate first markets (scored)

Scores are 1–5, **higher = better for BetterDesk** (so "Alternatives" 5 = weak alternatives; "Integration" 5 = simple; "Legal" 5 = low exposure). Scores are the researcher's judgement (assumption) using the evidence noted. Weighted total uses weights in the header row.

| Market | Urgency (2) | Frequency (1) | Contract value (2) | Acquisition ease (2) | Alternatives (2) | Integration (1) | Legal (2) | Prospect data (2) | Recurring rev (2) | MVP feasibility (2) | **Weighted /90** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Commercial cleaning (5–50 emp)** | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 4 | **72** |
| Commercial landscaping | 4 | 2 | 5 | 3 | 2 | 3 | 4 | 4 | 4 | 3 | **63** |
| Facility maintenance (commercial pest, HVAC PM contracts) | 3 | 3 | 4 | 3 | 2 | 2 | 4 | 4 | 4 | 3 | **59** |
| Other local B2B services (IT MSPs, security guards, uniform/linen) | 3 | 3 | 4 | 2 | 3 | 3 | 4 | 3 | 4 | 3 | **58** |
| Marketing agencies (as resellers) | 3 | 4 | 3 | 4 | 1 | 3 | 2 | 3 | 3 | 3 | **51** |
| Appointment-heavy local services (salons, clinics, home services) | 4 | 5 | 1 | 4 | 1 | 2 | 3 | 2 | 2 | 4 | **49** |

Notes behind the scores:
- **Commercial cleaning** — contracts recur monthly; small-office benchmarks of roughly $300–$900/month appear in 2026 vendor pricing guides (unverified blog sources). Target buyers are businesses with public locations, so prospect lists can come from the customer, permissively licensed place data or Google Places with place-ID-only storage (see pricing doc). Ops tools are plentiful; sales tooling for this vertical is thin (evidence above).
- **Landscaping** — high contract value but seasonal selling; Aspire markets CRM, estimating and pipeline to landscapers (verified on youraspire.com), so the space is better served.
- **Agencies** — GoHighLevel ($97–$497/mo, unlimited sub-accounts on upper tiers, verified) dominates this channel; agencies would also raise cold-outreach legal exposure.
- **Appointment-heavy local services** — BetterDesk's prior positioning (`PRODUCT.md`). Low ticket, many entrenched tools (Podium, Jobber AI Receptionist $29/mo add-on, Housecall Pro "AI team members", GHL Conversation AI). Not differentiated.

**Decision:** keep commercial cleaning. The evidence does not clearly favour another market. Landscaping is the closest adjacent expansion (same buyer shape, overlapping vendors such as Aspire).

## 4. Core value proposition

> "Scout turns the list of buildings you want into a short, explained list of the ones worth a walkthrough, with a first note ready for you to approve, and keeps every inquiry and follow-up in one place until the contract is signed."

Three concrete promises (each must be demonstrable in the product before it is used in marketing):
1. **Explained qualification:** each prospect gets a fit score with the evidence behind it (source URL, fetched date, rule matched), never an unexplained number.
2. **Human-approved outreach:** Scout drafts; a person approves every message; sending is off by default and, when enabled, goes from the customer's own mailbox.
3. **One pipeline from inquiry to signed contract:** Find → Qualify → Prepare → Approve → Connect → Book walkthrough → Propose → Win → Retain, with inbound inquiries in the same pipeline.

## 5. Initial offering (MVP scope)

In: CSV/CRM import of customer-supplied or authorized prospect lists; Scout research and fit scoring with evidence; draft introductions with an approval queue; pipeline board with the stages above; inbound web-form/email inquiries triage (commercial vs residential vs job seeker vs spam); walkthrough booking via connected Google/Microsoft calendar; simple proposal from a template (price entered by the user); weekly pipeline digest.

Out for MVP: autonomous sending, bulk sequences, SMS outreach, built-in data purchasing, AI pricing of bids (CleanGuru/Janitorial Manager-style production-rate bidding), ops features (scheduling, inspections, payroll).

Integrate rather than build: calendars, email mailboxes, QuickBooks (later), ops tools via export/webhook.

## 6. Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| Buyers don't trust AI on prospects | Owners sell on relationships | Evidence-first UI; approval required; show sources |
| Legal/deliverability | CAN-SPAM applies to B2B email, with penalties up to $53,088 per violating email (FTC, verified); Resend AUP forbids cold outreach outright (verified) | Outbound off by default; send from the user's own mailbox; opt-out, address and suppression built in; legal review before enabling sending |
| Data licensing | Google Places content may not be stored beyond place IDs (lat/lng ≤30 days) (verified) | Customer-supplied lists first; place-ID storage only; permissively licensed sources (Overture) for discovery |
| "Just use HubSpot/Jobber" | General CRMs and FSM suites already have pipelines and AI | Win on vertical defaults and Scout evidence, not on CRM breadth |
| Long sales cycles | Vendor blog cites 30–180 day janitorial cycles (unverified) | Value metric must show progress (walkthroughs booked), not only wins |
| Support cost | Small owners need setup help; this dominates unit cost (see pricing doc) | Templates, guided import, paid onboarding on higher tiers |
| Low willingness to pay at $99+ | Ops tools in this vertical list prices of $79–$225/mo (CleanGuru, Swept) | Validate in interviews before launch |

## 7. Strongest remaining assumptions (ranked by risk)

1. Owners will act on a researched, scored list (vs. preferring to drive and walk in, or buy leads).
2. One additional won contract per quarter is plausible with the tool, and owners can attribute it.
3. Owners have, or will build, an authorized prospect list (target buildings, past bids, referrals, chamber lists).
4. Inbound inquiry volume is high enough (and noisy enough) that triage matters for this segment.
5. Owners will connect their mailbox and calendar to a new vendor.
6. Willingness to pay $99–$249/month for sales tooling on top of an ops tool.
7. Office manager (not owner) can run the daily workflow in companies with 15+ staff.

## 8. Customer interview guide (10 questions)

No interviews have been conducted. Target 10–15 owners/office managers of 5–50 employee commercial cleaning companies; record answers verbatim; never pitch before question 8.

1. Walk me through the last commercial contract you won: how did you first hear about that account, and what happened between first contact and signature?
2. How do you decide which buildings or businesses to go after? Where does that list live today?
3. In the last 30 days, how many new commercial prospects did you contact, and how many walkthroughs did you do?
4. What do you check about a prospect before you reach out (size, current cleaner, building type, decision maker)? How long does it take?
5. How do inbound inquiries reach you (form, phone, email, referral), and roughly what share are commercial vs residential vs job seekers?
6. Tell me about a lead that went cold. What happened, and what would have saved it?
7. What tools do you pay for today for sales, bidding and operations, and what do they cost per month?
8. If a tool handed you 20 researched prospects a week with the reasons each one fits, what would you do with them? What would make you distrust it?
9. Would you let software draft an introduction for you to approve? Send from your own email? Where is the line?
10. What would a new recurring contract be worth to you per month, and what would you pay monthly for a tool that reliably produced one extra walkthrough a month?
