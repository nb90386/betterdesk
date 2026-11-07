# BetterDesk signature rebuild: final report

Date 2026-11-07. The founder judges the design; nothing here claims it is finished or "perfect".

## 1. Preview
- **URL:** https://betterdesk-redesign-2u72uohq5-neel-s-projects9.vercel.app (team `neel-s-projects9`, project `betterdesk-redesign`, `prj_huXJszKZP8QZbkl9ncUSshS8B9DN`)
- **Deployment:** `dpl_8iU9YfkkLVcw9BRa9cbh9TwBybqC`. State Ready, target preview. Inspector: https://vercel.com/neel-s-projects9/betterdesk-redesign
- **Protection:** on. Unauthenticated requests get 302 to Vercel SSO. Sign in as a member of `neel-s-projects9`.
- **Verification:** `vercel curl` returned 200 for all 13 public routes, `/app`, `/app/presence`, the OG image, sitemap and robots; `/nope` returned 404. Evidence: `preview-route-check.txt`, `preview-api-check.txt`.
- **Production:** untouched. No `--prod`, alias, domain, DNS or env change, and no outbound messages.

## 2. Version control
- **Branch:** `feat/betterdesk-signature-presence-rebuild`
- **Code deployed:** commit `839ceb8`. Later commits are docs only.
- **Rollback:** `cb79932` on `feat/betterdesk-v4-growth-os` (BASELINE.md).
- **Other versions:** V2, V3 and V4 branches are untouched. No remote exists, so nothing was pushed.
- **Commit note:** the first commit (`00d3c03`) accidentally included in-progress engine and research files. Later commits supersede them, and nothing was lost.

## 3. What changed visibly
- **Logo:** new door-swing mark, read as a lowercase b. It replaced the mark in the header, footer, app, favicon, Apple icon and OG image (LOGO-DECISION.md). Trademark clearance has not been done.
- **Font:** General Sans throughout, with Martian Mono only for code-like evidence. Funnel Display and Geist were removed. An e2e test checks the font on every route (TYPOGRAPHY-DECISION.md).
- **World, "The Directory":**
  - stone ground with satin-graphite directory boards;
  - one call-button lamp that only means "needs you";
  - states shown as marks, not coloured pills.
- **Pills:** none. A DOM measurement of every route finds 0 text pills; V4 used `rounded-full` 19 times.
- **Hero:** the three promises sit on three lines above a lobby-directory board. Juniper Lane Law climbs from floor 1 (Found) to floor 4 (Customer), keeping its source the whole way.
- **Motion:**
  - one shared-layout climb;
  - a Product popover that opens from 0.95 at its trigger (180ms in, 140ms out);
  - the draft turns into the sent message in the demo;
  - 0.97 press feedback.
  - All of it respects reduced motion. Recordings are in `recordings/`.
- **Before/after:** `CONTACT_SHEET.html` holds 49 rows of V4 next to the new build.

## 4. Hero copy
> **Find better accounts. Be easier to find. Book more walkthroughs.**
> BetterDesk is one workspace for commercial cleaning companies. It researches businesses worth contacting, shows how your company appears in Google and AI search, and keeps every inquiry moving until the walkthrough is on the calendar.

Each sentence maps to one lens: Scout, Presence and Desk. The subhead names the buyer in its first clause and ends on the outcome cleaning owners measure, a booked walkthrough. The primary button is **Try the demo**, with the line "Two minutes on a sample company. No sign-up, nothing is sent."

## 5. Product truth
See FEATURE-MATRIX.md.
- **Presence**
  - Live audit of a site you own: BETA, verified on Vercel against example.com.
  - Sample audit: LIVE.
  - Finding → task → Today: DEMO.
  - Search Console, Bing and Business Profile connections: PLANNED.
- **Scout**
  - Import, de-duplication, qualification, drafting and approval: DEMO.
  - Sending: BLOCKED by design.
- **Desk**
  - Inbox, booking, pipeline, timeline and self-reported "how did you find us": DEMO.
  - Real mailbox and calendar: PLANNED.
- **One model:** one account record and event timeline across all three lenses. `/app` and `/demo` share a prepared sample built by running the real actions.
- **Demo steps:**
  1. Make a website fix a task.
  2. Read yesterday's Scout run.
  3. Approve the draft and simulate delivery.
  4. Play the sample reply.
  5. Book the walkthrough.
  6. Open the record in `/app`.

  Reset is available on `/demo` and in `/app`.

## 6. GEO reality
Sources are in GEO-RESEARCH.md: official Google, OpenAI, Anthropic, Bing, Apple and Perplexity docs, accessed 2026-11-07.

**What Presence measures, from real fetches:**
- robots.txt access per crawler: OAI-SearchBot, Claude-SearchBot and PerplexityBot are scored; GPTBot, ClaudeBot, Google-Extended and Applebot-Extended are reported as training choices;
- noindex and canonical;
- the sitemap;
- titles, headings and descriptions;
- whether the service and service area appear on the page;
- whether the phone number and business name are consistent;
- contact paths;
- structured data that matches the visible page;
- a coverage heuristic for searches the owner cares about.

**What it does not do:**
- query any AI or report "rankings" or citations;
- fetch third-party profiles;
- score a missing llms.txt.

**Example report:** the sample audit of clearline.example found 8 issues to fix soon, 7 worth fixing, 2 notes and 7 things done well. The live example.com audit on the preview found 13 findings and 6 passes.

## 7. Sitemap and lead path
- **Routes:** `/`, `/product`, `/presence`, `/scout`, `/desk`, `/solutions/commercial-cleaning`, `/how-it-works`, `/demo`, `/pricing`, `/resources`, `/resources/ai-search-for-service-businesses`, `/contact`, `/security`, plus the 404, sitemap, robots and OG image.
- **Indexing:** `/app` and `/api` are never indexed. Previews disallow everything.
- **Lead path:** "Get a free check" (`/contact`) → `/api/review-request`, with server validation, a honeypot, a timing check and a rate limit, then delivery to a webhook.
- **Delivery evidence:** delivery was proven against a local receiver (`delivery-test-received.jsonl`: one delivery, and a duplicate submit was accepted without delivering twice).
- **On the preview:** delivery is BLOCKED. The form tells the visitor truthfully that the inbox isn't connected and offers a pre-filled email instead. It never shows a fake success.

## 8. Tools
TOOL-AUDIT.md has the details.
- **Ran:**
  - Impeccable: context, concept-seed roll `seed:33ed0b4d4265f121`, surface brief, design hook, finish reviewer (disposition "fix", all 8 fixes applied), documenter (DESIGN.md);
  - Hallmark sloplint, static and render tiers (55 → 9 FAIL, the rest explained);
  - Playwright, axe, Lighthouse;
  - an independent jury-rubric critic, from screenshots only.
- **Not run:**
  - the Awwwards jury scripts: the auto-mode classifier denied running cloned code;
  - the reference-site capture: browser launch denied for that subagent, so REFERENCE-DNA.md says NOT CAPTURED and the direction was **not** informed by measured Apple, Attio or Linear data;
  - Scroll Craft doctor;
  - UI/UX Pro Max and jakubkrehel installs: the sandbox blocks writes to `.claude/skills`;
  - the TypeUI Chrome extension;
  - Context7: network failure, so the Motion API was checked against the installed type definitions instead.

## 9. Visual evidence
- **Screenshots:** `screenshots/r1`, `r2` and `r3` (73 each: every route at 1440 and 390, first viewport and full page; home at 320, 768, 1024 and 1920; WebKit; states).
- **Explorations:** type specimen, logo board and three direction prototypes in `screenshots/`.
- **Recordings:** `recordings/*.webm` (board climb, popover, demo handoff, mobile scroll).
- **Contact sheet:** `CONTACT_SHEET.html`.

## 10. QA
QA_MATRIX.md has the full matrix.
- **Static checks:** types, lint and build are clean.
- **Tests:** unit tests 46/46; e2e and axe 168/168 across Chromium and WebKit.
- **Lighthouse mobile:** home 94 (LCP 3.0 s, CLS 0); Presence 94 (LCP 3.1 s); pricing 97 (LCP 2.5 s).
- **Lighthouse desktop:** home 100 (LCP 0.6 s).
- **Open:**
  - `/demo` CLS 0.657 (performance 73);
  - mobile LCP above 2.5 s on home and Presence (lab only);
  - SEO 66 is the deliberate noindex on previews.

## 11. Pricing
Hypothetical, see PRICING.md. One offer: $490 guided setup and visibility review, then $249/month for the workspace with hard caps and no overage. Labelled "proposed" on the site, with no billing.

## 12. Founder decisions
1. Approve or redirect the mark, font and "Directory" world. Known risks:
   - the mark can read as a bar chart at 20px;
   - the display face is a near-sibling of V4's.
2. Approve the hero copy and the "Get a free check" offer wording.
3. Approve pricing, or keep everything as "request a quote".
4. Provide `LEAD_WEBHOOK_URL` (Slack, Zapier or CRM) on the Vercel project, and confirm that hello@betterdesk.ai is a monitored inbox. Neither has been verified.
5. Decide on production indexing and publishing. Legal privacy policy and terms are needed before real customer data.

**Next five tasks:**
1. Fix `/demo` CLS (render the demo shell on the server) and bring mobile LCP under 2.5 s.
2. Run the reference-site capture unsandboxed and do a design pass informed by it.
3. Put real product screens in the empty right half of the `/product`, `/scout` and `/desk` heroes.
4. Rebuild the remaining `/app` screens on graphite directory boards.
5. Connect the lead webhook, then Search Console and Bing Webmaster (read-only) for Presence.
