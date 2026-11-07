# BetterDesk V4 feature matrix

There are five status labels:
- **LIVE:** a verified backend or provider, tested.
- **SANDBOX:** real persistence in a safe dev environment.
- **DEMO:** interactive, with fictional data, in the browser.
- **BLOCKED:** needs credentials, infrastructure or review.
- **PLANNED:** not implemented.

**Nothing in V4 is LIVE or SANDBOX.** This repo has no database, no credentials and no provider accounts, and the Vercel project has no environment variables.

| Capability | Status | Evidence / where |
|---|---|---|
| Prospect CSV import with column aliases, ZIP validation, 500-row and 2 MB limits | DEMO | `lib/scout/csv.ts`; unit + e2e "malformed CSV" |
| Spreadsheet formula-injection neutralisation | DEMO | `neutralizeFormula`; unit test |
| De-duplication by domain, then normalised name + ZIP | DEMO | `lib/scout/dedupe.ts`; unit + e2e (Cobalt Coworking once) |
| Explainable qualification (5 weighted criteria, unknowns never guessed, coverage %, rule version) | DEMO | `lib/scout/qualify.ts`; inspector at `/app/opportunities` |
| Evidence with source label and retrieval time | DEMO | every evidence row; inspector |
| Untrusted text guard (instruction-like notes withheld and flagged) | DEMO | `lib/scout/untrusted.ts`; unit test (Bluebird note) |
| Scout runs: state machine, tasks, history, budget (max prospects), cancel, retry, blocked-provider path | DEMO | `lib/domain/run.ts`, `stepRun`; unit + e2e |
| Scout has no send / approve / settings tool | DEMO | `ScoutRun.scope.allowedTools`; unit test |
| Template introduction drafting from record facts only | DEMO | `lib/scout/draft.ts` (`template-v1`) |
| Draft compliance checks (sender, postal address, opt-out, no fake Re:, no pressure, no invented relationship) | DEMO | `validateDraft`; e2e blocks "Re: our call" |
| Human-only approval with name and time; approval never sends | DEMO | `approveDraft`; unit + e2e |
| Suppression list: checked at draft and approval, withdraws pending drafts, opt-out replies auto-suppress | DEMO | `suppress`, `isSuppressed`; unit + e2e |
| Simulated delivery and replies (labelled), conservative reply classification | DEMO | `simulateDelivery`, `simulateReply`, `classifyReply` |
| Website inquiry creates or joins an account, conversation and opportunity | DEMO (simulated form) | `receiveInquiry`; e2e |
| Inbox with suggested replies (no invented prices), simulated reply recording | DEMO | `/app/inbox` |
| Unified customer record and timeline (append-only events) | DEMO | `/app/customers/[id]` |
| Pipeline with 9 stages; accessible stage menu; Scout can't move stages | DEMO | `/app/pipeline`; unit test |
| Walkthrough booking on a sample calendar (marked "sample-booked") | DEMO | `bookSampleSlot` |
| Analytics: defensible counts only; revenue shown as Unknown | DEMO | `/app/analytics` |
| Persistence: browser localStorage, survives reload; Reset sample | DEMO | `lib/demo/store.tsx`; e2e reload |
| Database, auth, team roles, tenant isolation (RLS) | BLOCKED | `docs/v4/schema.sql` written, not applied; no Supabase project |
| Durable background jobs for Scout | BLOCKED | runs step in the browser in DEMO; needs Trigger.dev or equivalent |
| Sending from the customer's Google/Microsoft mailbox | BLOCKED | needs OAuth app and compliance review; Resend/Postmark forbid cold outreach |
| Calendar availability and confirmed bookings | BLOCKED | needs OAuth; schema requires `provider_event_id` for "confirmed" |
| Licensed business-data provider | BLOCKED | not chosen; Google Places terms forbid storing results |
| AI-model research and drafting | BLOCKED | no API key; adapter interface exists (`DraftGenerator`) |
| Real website inquiry form endpoint | BLOCKED | needs the SANDBOX backend |
| Demo request ("Request a demo") | DEMO (honest fallback) | composes a mailto to hello@betterdesk.ai; the user sends it |
| Onboarding wizard (business, area, services, criteria, list, policy, integrations) | PLANNED | described on `/how-it-works`; Settings shows the profile read-only |
| SMS and calls | PLANNED (off by design) | hard-disabled in `Organization.outbound` |
| Billing / checkout | PLANNED | prices are labelled proposals; no Stripe |
