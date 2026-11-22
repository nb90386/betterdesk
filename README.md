# BetterDesk

BetterDesk is a Next.js marketing site and an in-browser sample workspace for owner-led commercial cleaning and facilities-service contractors who want recurring B2B accounts. The product has three parts that share one account record. Presence audits how findable a company's own website is. Scout qualifies prospects from a list the owner supplies and drafts introductions that a person must approve. Desk covers inquiries, replies, walkthrough booking, the pipeline and customers. Two parts make real network requests: the Presence live audit, which fetches a public website server-side, and the review-request form, which posts to a webhook but only when one is configured. Everything else runs in the visitor's browser on fictional sample data. No database, no sign-in and no billing exist, and the code sends no email, SMS or calls.

## What's in the repo

### Marketing routes (`app/(site)/`)

| Route | Content |
|---|---|
| `/` | Homepage: the three products, a sample Presence explorer, a Scout example and a sample Desk exchange |
| `/product` | How Presence, Scout and Desk connect |
| `/product/presence` | Presence explainer, sample explorer and the live audit form |
| `/product/scout` | Scout explainer with an interactive review of sample results |
| `/product/desk` | Desk explainer |
| `/solutions/commercial-cleaning`, `/solutions/b2b-services` | Audience pages |
| `/how-it-works` | Setup, support and limits |
| `/integrations` | Connections, each labelled with a status (BETA, DEMO, BLOCKED or PLANNED) |
| `/demo` | Guided six-step demo on the shared sample workspace |
| `/pricing` | Proposed pricing and a usage estimator |
| `/resources`, `/resources/guides/[slug]` | Four guides rendered from `content/guides/*.md` (statically generated) |
| `/contact` | Two-step "free check" review-request form |
| `/security`, `/about`, `/privacy` | Security and data notes, About, and a draft privacy notice |

The canonical list of public routes is `PUBLIC_ROUTES` in `lib/site.ts`. The sitemap and the e2e suites read from it.

### Sample workspace (`app/app/`, not indexed)

`/app` (Today), `/app/presence`, `/app/scout`, `/app/opportunities`, `/app/inbox`, `/app/pipeline`, `/app/calendar`, `/app/customers`, `/app/customers/[id]`, `/app/analytics`, `/app/settings`.

### API routes (`app/api/`)

- `POST /api/presence/audit`: the live Presence audit.
- `POST /api/review-request`: intake for the contact form.

### Other

- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `apple-icon.tsx`, `icon.svg` and `not-found.tsx`.
- `next.config.ts` adds security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`) and turns off `X-Powered-By`. It also redirects retired routes such as `/scout`, `/platform`, `/roi` and `/solutions/home-services` to their current equivalents.

## Key features (verified in code)

### Presence live audit (`lib/presence/`, `app/api/presence/audit/route.ts`)

- **Authorization check.** The caller must confirm they own the site or may audit it (`authorized: true`), or the request is refused with a 403.
- **Fetching.** A server-side crawler reads `robots.txt`, the sitemap and up to 6 pages of the site. Limits: 8 s per request, a 20 s total budget, 1.5 MB per body, at most 3 redirect hops and a 250 ms delay between requests. It uses its own user agent (`BetterDeskPresenceAudit`) and obeys `robots.txt` for that agent.
- **SSRF protection.** Private, reserved and internal hosts are rejected. DNS results are checked again inside the socket `lookup`, so the request can only connect to an address that passed the check. Every redirect hop is re-validated.
- **Rate limits.** 5 audits per 10 minutes per client IP and 4 concurrent audits per instance. The limiter is in memory and per instance, and the code comments describe it as best-effort.
- **Checks.**
  - HTTPS and reachability.
  - `noindex`, the sitemap and canonical tags.
  - Titles, meta descriptions and H1s.
  - Whether the service category and service area appear on the site, and whether services and service-area pages exist.
  - Phone consistency and contact paths.
  - Business-name consistency across page text, JSON-LD and Open Graph.
  - LocalBusiness/Organization structured data and `sameAs`.
  - A per-bot `robots.txt` report for Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot and others.
- **Report.** Each finding has a severity, a confidence level, evidence, a fix and an owner. Up to 5 optional questions get a keyword-coverage heuristic against the crawled pages.
- **What it does not do.** It never queries Google, Bing or any AI assistant. Profile links are accepted as input but never fetched, and the Google Business Profile check is reported as "Not verified".

### Presence sample audit (`lib/presence/sample.ts`)

The same analyzer runs in the browser on a bundled, fictional site (`clearline.example`) with deliberately planted flaws. In the workspace, a finding can become an owned task that appears on Today. Completing a task never claims an outcome.

### Scout (`lib/scout/`, `lib/workspace/actions.ts`)

- **CSV import.** RFC 4180-style parsing with column aliases and a 500-row limit. Rows without a ZIP are skipped. Spreadsheet formula injection is neutralised by prefixing an apostrophe to cells that start with `=`, `+`, `-` or `@`.
- **De-duplication.** By website domain, then by normalised name plus ZIP.
- **Instruction withholding.** Imported text that reads like instructions (for example "ignore previous instructions") is withheld from evidence and drafts.
- **Qualification.** Rule-based (`cleaning-v1`), with five weighted criteria: service area, facility type, size, business contact and not already a customer. Missing data counts as "unknown" and is never assumed. Results include a score, coverage, a tier and a recommendation.
- **Drafting.** Drafts come from a deterministic template (`template-v1`) behind a `DraftGenerator` interface. No AI model is wired in. Before approval, `validateDraft` requires the sender's identity, a postal address and an opt-out. It rejects fake `Re:`/`Fwd:` subjects, pressure language and invented relationships.
- **Approval and suppression.** Only a person can approve a draft, and approval does not send it. Delivery can only be simulated. The suppression list blocks drafts and withdraws pending ones. Scout cannot move pipeline stages directly.

### Desk and the workspace

- **Inbox.** Simulated website inquiries join an existing account instead of creating a duplicate. The "how did you find us" channel records only what the person reported.
- **Replies.** Classification is conservative and keyword-based: opt-outs take priority, and unclear replies go to a person. Suggested replies are built from the sender's details and the sample calendar's open times, and never quote a price.
- **Other screens.** A sample calendar for booking walkthroughs, a pipeline with nine stages, customer records with an event timeline, an analytics table, and a settings page listing each integration's status.
- **Analytics.** "Emails actually sent" is always 0. Attributed revenue is shown as unknown.
- **Storage.** State is kept in `localStorage` (`lib/demo/store.tsx`), and "Reset sample" restores the baseline.

### Review request (`app/api/review-request/route.ts`, `components/site/ReviewForm.tsx`)

- The two-step form is validated on both client and server, and the server also checks the content type and size.
- Anti-bot measures: a honeypot field and a minimum fill time of 2.5 seconds. The rate limit is 4 requests per 10 minutes per IP.
- When `LEAD_WEBHOOK_URL` (https) is set, the request is posted to it as JSON. Without it, the route returns a 503 with `delivery_not_configured`, and the form offers a pre-filled `mailto:` fallback instead.

### Pricing

`/pricing` shows a single proposed offer (`OFFER` in `lib/site.ts`) and a usage estimator whose numbers come from that proposal. The page labels the pricing "Proposed" and says it cannot be bought. No billing code exists.

## Architecture

### Stack

Versions are the ones resolved in `package-lock.json`.

- Next.js 16.4.5 (App Router) and React 19.3.1
- TypeScript 5.9.3
- Tailwind CSS 4.3.4 (via `@tailwindcss/postcss`)
- Motion 14.10.0 for animation
- ESLint 9.39.5 with `eslint-config-next` 16.4.5
- Playwright 1.65.0 with `@axe-core/playwright` 4.14.0 for e2e and accessibility tests
- Unit tests use Node's built-in test runner (`node --test`) against `.ts` files directly
- Fonts are self-hosted in `app/fonts/` with their license files: General Sans, Sentient and Martian Mono

### Layout

```
app/(site)/        marketing routes
app/app/           sample workspace routes (client components on a shared store)
app/api/           presence/audit and review-request route handlers
components/site/   marketing components (PresenceAudit, PresenceExplorer, GuidedDemo, ReviewForm, PricingEstimator, ...)
components/app/    workspace shell, UI primitives and icons
lib/domain/        workspace types (accounts, evidence, drafts, runs, stages) and run state machine
lib/workspace/     pure workspace actions and selectors
lib/scout/         CSV import, dedupe, qualification, drafting, reply classification, untrusted-text handling
lib/presence/      URL guard, safe fetcher, robots parser, HTML extraction, analyzer, rate limiter, sample site
lib/lead/          review-request validation and formatting
lib/demo/          sample seed data and the localStorage-backed store
lib/marketing/     guide loading, markdown rendering, homepage samples
content/guides/    guide markdown
public/            brand marks, product images, sample prospect CSV
tests/unit/        node:test suites (lead, presence, workspace)
tests/e2e/         Playwright suites (site, app, a11y, navigation-scroll, break-ui)
scripts/           local screenshot and overflow-capture helpers used during design review
docs/              design, product and QA records from successive rebuild rounds
```

### Data flow

- **Workspace and `/demo`.** `DemoWorkspaceProvider` seeds a fictional workspace (Clearline Commercial Cleaning, Denver) from `lib/demo/seed.ts`. Each UI action calls a pure function in `lib/workspace/actions.ts` that takes the workspace and returns the next one. The result is saved to `localStorage`, and active Scout runs advance one task every 700 ms. Nothing leaves the browser.
- **Live audit.** `components/site/PresenceAudit.tsx` posts to `/api/presence/audit`. The server validates the input, applies the rate limit, collects a page snapshot through the guarded fetcher and returns `analyzeSnapshot(snapshot)` as JSON. Raw HTML is never echoed back.
- **Review request.** `components/site/ReviewForm.tsx` posts to `/api/review-request`, which forwards to `LEAD_WEBHOOK_URL` if one is configured. Nothing is stored server-side, apart from an in-memory record of recent request IDs used to de-duplicate.

## Setup

`package.json` has no `engines` field and the repo has no `.nvmrc`. The constraints that apply:

- The unit tests import `.ts` files directly, so you need a Node release with built-in TypeScript type stripping (22.18+ or 23.6+).
- `@axe-core/playwright` declares Node >= 22.12.
- The 2026-11-22 checks ran on a machine with Node 26.12.0.

```bash
npm ci
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, then `npm start` to serve the production build.

### Environment variables

None are required for local development. The code reads these:

| Variable | Effect |
|---|---|
| `LEAD_WEBHOOK_URL` | HTTPS endpoint that receives review requests. Without it, the form reports that delivery isn't connected. |
| `LEAD_WEBHOOK_ALLOW_LOCAL` | `1` allows a plain-http `127.0.0.1` webhook, for local testing only. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for the sitemap and robots (defaults to `https://betterdesk.ai`). |
| `VERCEL_ENV` | Pages are marked `noindex` unless this is `production`. Any other value that is set makes `robots.txt` disallow everything. |

## Checks

| Command | What it runs | Result on 2026-11-22 |
|---|---|---|
| `npm test` | `node --test tests/unit/*.test.ts` | 46/46 passed |
| `npm run typecheck` | `tsc --noEmit` | Clean |
| `npm run lint` | `eslint .` | Clean |
| `npm run test:e2e` | `playwright test` (Chromium and WebKit) | Not run |
| `npm run build` | `next build` | Not run |

Notes for e2e:

- `playwright.config.ts` has no `webServer` entry, so start the app yourself first. It expects `http://localhost:3917` unless `BASE_URL` is set, for example `npx next dev -p 3917`.
- The Chromium project defaults to a hard-coded macOS headless-shell path under `~/Library/Caches/ms-playwright`. Set `CHROMIUM_PATH` on other machines.
- `PLAYWRIGHT_BROWSERS_PATH` defaults to a project-local `.pw-browsers/` folder.
- The suites cover:
  - Every public route: status, a single H1, metadata and overflow.
  - Internal links, the sitemap and robots.
  - Axe WCAG 2.x A/AA scans of the public and workspace routes.
  - The workspace workflow, the guided demo and the review form.
  - Live-audit refusals (private addresses, missing authorization).
  - Navigation and scroll restoration.

## Current limitations

- **The sample workspace and `/demo` run entirely in the browser on fictional data.** Most sample domains use the reserved `.example` TLD. State is per browser, in `localStorage`.
- **No database, accounts, sign-in or multi-tenant storage.** `docs/v4/schema.sql` is a schema design that the code does not use. The workspace settings page lists it as BLOCKED.
- **No outbound messaging.** The sample organisation is configured `draft-only` for email, with SMS and calls disabled. Deliveries, replies and bookings in the workspace are simulations, and the UI says so.
- **No AI model.** Drafts come from a deterministic template, and reply handling uses keyword rules.
- **No mailbox, calendar, Search Console, Bing Webmaster Tools, Google Business Profile or business-data provider connections.** Each one is labelled BLOCKED or PLANNED in the UI.
- **Review requests are delivered only if `LEAD_WEBHOOK_URL` is configured.** Otherwise the form says it can't deliver and offers email.
- **The live audit's rate limiting is per instance and in memory.** It is not a hard limit on serverless platforms.
- **The live audit only inspects the target site's own pages.** It does not measure actual rankings or AI-assistant answers.
- **Pricing is a proposal.** No billing exists.
- **The privacy notice is marked as a draft.**
- **`next build` and the Playwright suites were not run for this README.**

## Project docs

- `PRODUCT.md`: users, product purpose, brand and honesty commitments.
- `DESIGN.md`: design system (colour, type, layout, components, motion, do's and don'ts).
- `docs/reinvention/FEATURE-MATRIX.md`: feature-by-feature status (LIVE, BETA, DEMO, BLOCKED, PLANNED).
- `docs/reinvention/PRICING.md`: rationale for the proposed pricing.
- `docs/reinvention/GEO-RESEARCH.md`: research notes on AI search and discoverability.
- `docs/reinvention/QA_MATRIX.md` and `docs/reinvention/FINAL_REPORT.md`: QA and rebuild records for the current round.
- `docs/v4/SCOUT-ARCHITECTURE.md`, `docs/v4/SECURITY-AND-COMPLIANCE.md`, `docs/v4/schema.sql`: earlier-round architecture, security notes and the unconnected database schema.
- `docs/v3/`, `docs/redesign/`, `docs/quality-v2/`: records from earlier rounds. Parts of them describe an earlier version of the product and are superseded by `PRODUCT.md`.
