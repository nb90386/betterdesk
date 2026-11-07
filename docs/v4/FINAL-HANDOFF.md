# BetterDesk V4: final handoff

## A. Deployment
- **Protected preview:** https://betterdesk-redesign-lp0ui63p8-neel-s-projects9.vercel.app
- **Inspector:** https://vercel.com/neel-s-projects9/betterdesk-redesign/9kYh4mAuWMG5RJBcK78qv5VLo1G6
- **State:** READY, target preview (null).
- **To view it:** sign in to Vercel as a member of `neel-s-projects9`. Unauthenticated requests get 302 to login. Protection was left on.
- **Route checks:** all 9 marketing routes and all 9 `/app` routes, plus assets, OG image and sitemap, returned 200 through `vercel curl`. `/nope` returned 404, and `/platform` returned 307 to `/product`.
- **Verified only locally:** in-browser demo behaviour was checked on the identical local production build, not on the protected preview.
- **Production untouched:** no `--prod`, no alias, domain, DNS or environment changes, and no outbound messages (none are possible).

## B. Version control
- **Branch:** `feat/betterdesk-v4-growth-os`, at `ea2d874` plus this handoff commit.
- **V2:** `feat/betterdesk-sayable-quality-v2` at `a0eab3a`.
- **V3:** `feat/betterdesk-v3-apple-editorial` at `edf4590`.
- **No remote:** the repo has no remote configured, so nothing was pushed.

## C. Product
- **Customer:** owner-led commercial cleaning contractors with 5–50 staff, selling recurring office, medical, property-management and retail contracts.
- **Positioning:** find the right buildings, introduce yourself well, and keep every lead and inquiry in one record until the walkthrough is booked and the contract is won.
- **Differentiation to prove** (`COMPETITIVE-RESEARCH.md`):
  - walkthrough-centred stages;
  - explainable qualification;
  - approval-first outreach.

  Generic AI, CRM, inbox and calendar features are not defensible on their own.

## D. What genuinely works
Everything below is DEMO: real logic, fictional data, in the browser (`FEATURE-MATRIX.md`).
- **Scout:**
  - imports a CSV;
  - neutralises formulas;
  - de-duplicates;
  - qualifies with five explainable, weighted criteria, with evidence, source and date, coverage, and unknowns that are never guessed;
  - withholds instruction-like text;
  - skips personal and suppressed contacts;
  - drafts fact-only introductions;
  - runs as an inspectable state machine with cancel and retry, and a provider-unavailable path.
- **Dashboard:**
  - Today shows attention items;
  - opportunities with search, filter, sort and an inspector;
  - customer record and timeline;
  - inbox with suggested replies;
  - pipeline with an accessible stage menu;
  - sample calendar;
  - honest analytics;
  - settings with the suppression list and integration status.
- **End-to-end in the demo:** import → qualify → draft → human approval → simulated delivery → simulated reply → sample booking → pipeline and timeline update. Website inquiries join the same records.
- **Demonstration only:** delivery, replies, inquiries and calendar. All are labelled.
- **Not real yet:** sending, calendar, database, auth, AI model, data provider. All BLOCKED.

## E. Product tour
1. Open `/app` (the "Explore the sample workspace" button).
2. On **Scout**, click *Use the sample list*, then *Import and start Scout*. Watch the steps and open *Details*.
3. In *Introductions waiting for you*, try changing the subject to "Re: …" to see the honesty check block it. Then approve the Juniper Lane Law draft and click *Simulate delivery (demo)*.
4. On **Opportunities**, select Juniper Lane Law to see the inspector, then *Open record and timeline*. Click *Asks for a walkthrough*, then pick a time.
5. On **Pipeline** and **Today**, see the result.
6. In **Settings**, try the suppression list. In **Inbox**, try *Simulate a website inquiry*.
7. To reset, use *Reset sample* in the top bar.

State persists in this browser only.

## F. Architecture
See `SCOUT-ARCHITECTURE.md` and `schema.sql`.
- **Code layout:** pure domain logic in `lib/` (unit-tested), a DEMO store in `lib/demo/store.tsx`, and the UI in `app/app/**`.
- **Production design (BLOCKED):**
  - Postgres with RLS per organization, using `auth.uid()`;
  - append-only events;
  - a database-level suppression trigger;
  - `body_hash`-bound approval, with idempotency keys so each approved draft is sent at most once;
  - Scout as durable background jobs.
- **Integration interfaces:** `DraftGenerator` for drafting models, a provider/mailbox/calendar status model, and modes DEMO, SANDBOX and LIVE.

## G. Design
See `DESIGN-SYSTEM.md`.
- **Direction:** Signal Architecture, chosen over two rendered alternatives (`screenshots/art-direction-board.png`).
- **Mark:** the junction (`public/brand/v4/`), chosen from three concepts (`screenshots/logo-concepts.png`).
- **Type:** Funnel Display and Geist.
- **Signature animation:** `components/site/JourneyScene.tsx`.
- **Screenshots:** `screenshots/final/`.
- **Comparison:** `CONTACT_SHEET.html`, V3 next to V4.

## H. Tools
See `SKILLS-AUDIT.md`. Short version:
- The Impeccable hook ran on every edit.
- Hallmark, Taste Skill and a formal Impeccable critique were **not** run.
- Scroll Craft, Stop Design Slop and UI/UX Pro Max aren't installed.
- Playwright, axe, Lighthouse and five bounded subagents were used.

## I. Quality
See `QA-RESULTS.md`.
- Types and lint are clean.
- Unit tests 16/16; e2e 130/130 across Chromium and WebKit; axe clean on 16 routes.
- Lighthouse home: mobile 94/100/100/100 with LCP 3.0 s, which misses the 2.5 s target; desktop 100 across the board.
- The independent review scored V4 between 4 and 7 on every dimension (`INDEPENDENT-REVIEW.md`). The top fixes are applied. Brand ownership (the mark and the dark-teal palette) is still open.

## J. Business
See `PRICING-AND-UNIT-ECONOMICS.md`.
- **Proposed prices:** Essential $99, Growth $249, Team $499 a month.
- **Hard usage caps, no overage:** 150 / 500 / 1,000 prospects researched, 100 / 300 / 600 inquiries, and 1 / 3 / 10 seats.
- **Top-ups:** $39 and $35; extra seats $29.
- **Modelled contribution margin:** about 54–63% at medium usage, 14–21% heavy. Support time is the main risk.
- **Status:** all prices are labelled proposals, and there is no billing.
- **Research still needed:** the 10 interviews in `PRODUCT-STRATEGY.md`; none have occurred.

## K. Launch blockers
1. No Supabase project, auth or credentials. The Vercel project has no environment variables.
2. A Google/Microsoft OAuth app is needed for mailbox sending and calendar. Resend and Postmark don't allow cold outreach.
3. No licensed data provider has been chosen.
4. No AI API key or budget approval.
5. A legal review is needed for outreach rules (CAN-SPAM, state laws), a privacy policy and terms.
6. Founder approval is needed for the brand, pricing and positioning.

## L. Next five engineering steps
1. Connect a Supabase dev project, apply `schema.sql`, and move workspace actions to server actions using the session tenant. Add the cross-tenant and expired-session tests.
2. Run Scout as a durable job (Trigger.dev) with idempotent steps, budgets and cancellation.
3. Build a real website inquiry endpoint plus Google/Microsoft OAuth for read-only inbox and calendar availability, with sending still off.
4. Build the onboarding wizard (business, service area, criteria, list import, policy) writing to the org profile.
5. Run a design pass on brand ownership (mark and palette) and homepage mobile LCP, then Hallmark/Impeccable critique and real-device testing.
