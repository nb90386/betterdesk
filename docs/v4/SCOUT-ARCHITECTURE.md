# Scout architecture

Scout is a bounded workflow, not a chatbot. All logic is pure TypeScript in `lib/`, unit-tested and shared by every surface.

## Data model (`lib/domain/types.ts`)
An **Organization** owns everything. Each **Account** (a business) holds the rest:
- Contacts and Evidence, with a source and retrieval time on each.
- A Qualification, with the criteria results, coverage and rule version.
- An Opportunity (stage, next action, origin), which in turn holds Drafts, Conversations with their Messages, and Appointments.

The org-level lists are **Suppressions**, **ScoutRuns** and an append-only **Event** log. That log is both the audit trail and the customer timeline.

Approval state (`pending | approved | rejected`) is separate from delivery state (`not-sent | simulated | sent`) and from the opportunity stage. In DEMO, delivery can never be `sent`.

## Run lifecycle (`lib/domain/run.ts`)
Each run moves through explicit states: `created → queued → running → waiting-approval → completed`, with `paused`, `blocked`, `failed` and `canceled` as side states. An impossible transition throws `InvalidTransition`. Retrying from `blocked` or `failed` increments `retries`.

Each run records:
- the goal, actor and scope (sources, service-area-only, `maxProspects` budget, `allowedTools`);
- its tasks with their details and the state history;
- the accounts it touched, the drafts it created, its errors, and a summary.

## Tasks (`stepRun` in `lib/workspace/actions.ts`)
1. **Scope:** read the service area and target facility types.
2. **Qualify:** each account gets rule `cleaning-v1` with five weighted criteria (area 30, facility type 25, size 20, business contact 15, not a customer 10).
   - Unknowns are excluded from the score and reported as coverage.
   - Hard exclusions are out-of-area, existing customer and a non-target category.
   - An opportunity opens for non-excluded accounts.
3. **Draft:** only for strong or possible fits that meet all of these:
   - the contact is a business email;
   - the contact is not suppressed;
   - the stage is still `new` or `qualified`, so Scout never re-introduces itself to a deal in progress or moves one backwards (regression-tested);
   - no draft is already open.
4. **Handoff:** the run moves to `waiting-approval` and completes once every draft has been reviewed.

Every task first checks that the run is still active, so canceling stops all further effects (unit-tested).

In DEMO the store paces steps 700 ms apart so a person can watch them and cancel. The delay produces no content.

## Permission boundaries
- `allowedTools` = `read-records`, `dedupe`, `qualify` and `draft-outreach`. There is no send tool.
- `approveDraft` and `moveStage` reject any actor that isn't a person.
- Re-validation at approval checks two things: suppression, and `validateDraft`, which requires sender identity and a postal address, an opt-out line, no fake "Re:", no pressure language and no invented relationship.
- **Untrusted content:** imported or prospect text is data. `looksLikeInstructions` withholds instruction-like notes from evidence and drafting and flags the qualification for human review. Scope and permissions never come from content.

## Model adapter
`DraftGenerator` is the interface. `templateGenerator` is the shipped generator and is deterministic and fact-only. A model-backed generator can be added later; it is BLOCKED because no key is configured. Its output must still pass `validateDraft`, and it should keep retrieved text in a separate untrusted channel, use versioned prompts, and record execution metadata.

## Production path (BLOCKED)
The planned design:
- `docs/v4/schema.sql` provides Postgres with row-level security on `is_member` / `has_role`, an append-only events trigger, and a suppression trigger on drafts.
- Approval is bound to `body_hash`, and an `idempotency_key` ensures each approved draft is sent at most once.
- Runs execute as durable background jobs (Trigger.dev or equivalent) with retries, concurrency limits and time bounds, never inside a request handler.
- The tenant always comes from the session.
