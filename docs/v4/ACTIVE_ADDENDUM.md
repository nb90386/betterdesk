# BETTERDESK — LIVE CLAUDE CODE ADDENDUM
## Navigation correction, human-authored sitemap, anti-slop design, and conversion QA

**IMPORTANT: This is an additive instruction to the CURRENT BetterDesk Claude Code session.** Do not discard the existing master plan, reset branches, spawn a competing agent, create an overnight runner, or start a new unrelated website. Incorporate these requirements into the current implementation and report what is finished. The founder's live feedback takes priority over cosmetic polishing. Preserve committed work and keep preview-only deployment limits.

## Priority 0 — FIX PAGE NAVIGATION AND SCROLL RESTORATION

The current site sometimes opens a newly clicked page scrolled to the bottom and then visibly jumps or animates toward the top. This feels broken and cheap. **Stop the behavior; don't hide it with a fade or loading state.**

1. Inspect actual runtime, package versions, `next/link`, `next/navigation` router calls, navigation wrappers, shared layouts, Framer/Motion/GSAP/Lenis/Scrollcraft code, pinned sections, body scroll-lock, CSS `scroll-behavior`, custom route transitions, sticky headers, history restoration, and hash links. Find the root cause and document it.
2. For ordinary forward navigation to a DIFFERENT page, the new page must **render at its top immediately without an observable bottom-to-top animation**. Make the first heading visible below any sticky header; no flash of the previous page's scroll position.
3. Preserve expected anchor behavior (`/page#section` goes to section with `scroll-margin-top`), in-page navigation, modal/focus behavior, and sensible browser back/forward restoration. Query-string-only filtering should not yank the user to top. Respect user intent with Back/Forward where applicable.
4. Use documented Next.js App Router behavior: `Link`/router navigation usually handles scrolling; investigate stray `scroll={false}` / `{scroll:false}`, incorrect scroll containers, browser CSS smooth scroll, and shared layout transitions FIRST. If necessary, create a small route navigation adapter or pathname-aware component with careful mount and history semantics; avoid setting global `history.scrollRestoration='manual'` unless it has a tested reason. Do not merely slap an unconditional `window.scrollTo` on every render.
5. Verify desktop/mobile and Chromium/WebKit; test starting at the BOTTOM of `/` and clicking header nav, footer nav, sidebar nav, mobile menu, product links, pricing links, and CTA buttons. Assert the new URL, correct H1, `scrollY` near zero after page is ready, and no visible scroll-to-top tween or hydration jump. Test hash targets, browser back/forward, keyboard focus, reduced-motion, and sticky header offsets. Build a regression test such as `tests/navigation-scroll.spec.ts`. **P0 blocks deployment if unresolved.**

References: https://nextjs.org/docs/app/api-reference/components/link and https://nextjs.org/docs/app/getting-started/linking-and-navigating

## Priority 1 — REAL INFORMATION ARCHITECTURE AND A HUMAN-WRITTEN SITEMAP

Create `docs/v4/HUMAN_SITEMAP_AND_COPY.md`, with a two-level navigational sitemap, page-purpose matrix, target user and search intent, one-sentence takeaway, original H1, supporting copy, exact hero demonstration, major sections, actual proof sources, internal links, primary and secondary CTA, footer links, and SEO title/description. WRITE THE COPY YOURSELF as a skilled human marketer. Don't leave "TODO copy", Lorem Ipsum, stock AI language, or generate 25 thin SEO pages.

Keep the WHOLE BUSINESS coherent. Initial audience: owner-led commercial cleaning and other B2B service contractors; they want predictable commercial jobs, qualified walkthroughs, faster replies, and less manual administration. The marketing story is **Find customers → Get found → Turn inquiries into booked opportunities**. Product surfaces are **Scout** (research and draft for approval), **Presence** (truthful website/search/AI-discovery diagnostics), and **Desk** (inquiries, pipeline, booking, customer history). Explain their connected value rather than advertising three unrelated apps. Label actual features by LIVE / SANDBOX / DEMO / PLANNED. Do not pretend that any business is guaranteed discovery in AI answers.

### Marketing sitemap — proposed canonical URLs, refine against real implementation

**Top navigation (simple, no giant pill cluster):** Product [Overview | Scout | Presence | Desk]; Solutions [Commercial cleaning | B2B services]; How it works; Pricing; Resources [Guides | Methodology]; prominent **See the product** and **Book a demo** actions. Show fewer options directly on narrow screens; accessible mobile drawer. Keep home logo clickable.

1. **`/` — Home.** Audience: small commercial service-business owner. H1 candidate: **"Find better customers. Stay on top of every opportunity."** Subtitle: **"BetterDesk brings prospect research, search visibility, inquiries, and follow-ups into one place, so a small team can spend less time chasing details and more time winning work."** The hero must show a believable *product* scene. Story: why good opportunities disappear across disconnected tools; Scout discovers and qualifies; Presence identifies discoverability gaps; Desk handles the conversation and books; concrete connected example; clear price direction; evidence/limitations; final demo CTA. Avoid a vague headline or a carousel of buzzwords.
2. **`/product` — Product overview.** H1: **"One place to move work from first interest to next appointment."** Explain the shared record and why unified data matters with a real click-through journey; compare before/after workflows without fake ROI.
3. **`/product/scout` — Scout.** H1: **"Spend less time hunting for the right businesses."** Explain which sources are allowed, how fit is evaluated, what evidence Scout stores, what it drafts, which actions require approval, and what it cannot do. Realistic prospect review demo, not fake sent messages.
4. **`/product/presence` — Presence / SEO + AI-search visibility.** H1: **"Make it easier for customers to find and trust your business."** Explain conventional search, site structure, local business information, public crawlability, and AI-assisted answer discoverability. Show a real site-audit example with evidence and timestamp, confidence and limitations, prioritized fixes, and before/after changes only when measurable. No "rank #1 in ChatGPT" or unsupported scores.
5. **`/product/desk` — Desk.** H1: **"Every inquiry deserves a clear next step."** Show inbox context, qualification, calendar handoff, follow-up tasks, customer timeline, and human control. Distinguish real phone answering from missed-call messaging.
6. **`/how-it-works` — Lifecycle.** H1: **"From first lead to booked walkthrough, without losing the thread."** One concrete commercial cleaning journey, step-by-step with realistic artifacts and clear demo versus live boundaries; explain setup effort and where the owner approves actions.
7. **`/solutions/commercial-cleaning` — Primary landing page.** H1: **"Win more commercial cleaning walkthroughs. Keep the details together."** Address owner concerns: building a list of relevant facilities, tailoring introductions, qualifying inbound requests, tracking site visits, proposals and renewals. No unverified customer claims.
8. **`/solutions/b2b-services` — Secondary audience.** H1: **"A simpler way to grow a service business."** Only build if content is substantially different and supported. Explain suitability and limits without pretending the product supports every industry.
9. **`/pricing` — Plans and real cost drivers.** H1: **"Clear pricing. No guessing about usage."** State approved tiers only; otherwise clearly mark preliminary offers, with estimated usage boundaries, integrations, messaging/data charges, and meaningful comparisons. Include FAQs and a real consultation CTA. Don't change payments or published billing behind the scenes.
10. **`/demo` — Interactive product tour.** H1: **"See an opportunity move through BetterDesk."** Interactive sandbox with consistently labeled fictional businesses, Scout, Presence audit, Inbox and booking transitions. Reset control; no simulated results represented as production activity.
11. **`/integrations` — Connections.** H1: **"Use the tools your team already works in."** Precise verified connectors, setup status, limitations, and planned connections separated. No unauthorized company logos.
12. **`/security` — Trust and data.** H1: **"Your customer information deserves careful handling."** Explain evidenced safeguards, approvals, visibility, deletion/retention when implemented, limits and incident/support path. No unsupported certifications.
13. **`/about` — Company.** H1: **"Built for businesses that don't have time to chase every detail."** Real company identity and motivation only, no invented story, founders or office address. Human, humble, specific.
14. **`/contact` or `/book-demo` — Sales.** H1: **"Tell us how your business wins work today."** Short relevant form (name, business, email, main challenge), privacy/expectations, explicit confirmation, and tested destination. No success toast unless actually delivered.
15. **`/resources` — Helpful knowledge hub.** H1: **"Practical ways to find, win, and keep commercial customers."** Organize by prospecting, AI-search visibility, follow-up, and pipeline. Start with 3–5 substantial, genuinely useful, well-sourced evergreen articles, not 30 mass-produced pages.
16. **`/resources/guides/...` — Selected long-form articles.** Suggested content only if independently researched and useful: "How to prepare for a commercial cleaning walkthrough"; "Why your service company doesn't appear for relevant local searches"; "What AI search visibility actually means for a local contractor"; "A simple follow-up process after a cleaning estimate". Include examples, assumptions, sources, clear dates and next steps.
17. **`/privacy`, `/terms`** and any other required legal surfaces. Real company facts and review status; no invented legal guarantees.
18. **`/sitemap` optional human-readable sitemap**, plus **`/sitemap.xml`** generated from all actual indexable public routes. Do not expose app/private/demo user data in public sitemap.

**Authenticated product map, separate from public XML sitemap:** `/app`, `/app/opportunities`, `/app/scout`, `/app/presence`, `/app/inbox`, `/app/pipeline`, `/app/calendar`, `/app/customers`, `/app/integrations`, `/app/settings`, and onboarding as supported. Focus on functional workflows and purposeful navigation, not generating empty routes.

### Site copy acceptance

On every page, within the first screen, answer: Who is this for? What does it help them do? Why is it worth paying for? What should they do now? Use concrete nouns and verbs, industry-specific examples, and short natural sentences. Remove generic fluff like "unlock", "revolutionize", "supercharge", "seamless", "cutting-edge", and "AI-powered platform" where it adds no information. Avoid excessive em dashes, rhetorical questions, italicized adjectives, and redundant cards. Use realistic, factually honest examples. AI-era framing: consumer discovery is shifting, so businesses should maintain trustworthy, useful, findable information; do not claim everyone needs GEO or that optimization guarantees AI citations. Make an evidence-based differentiation section: why the owner cannot simply paste the entire workflow into ChatGPT, a spreadsheet, and Calendar; acknowledge what each can do and show the specific value of persistent connected records and approved operations.

Every major section needs a job: identify buyer problem, demonstrate product, establish evidence, handle objection, clarify price, or convert. Delete or combine sections without one. Make the most important interactive element big enough to inspect. No manufactured social proof. Marketing CTA must work end-to-end.

### GEO/SEO requirements

Create content for humans and accessible crawlers: semantic headings, indexable text, clear internal links, breadcrumbs where useful, canonical URLs, appropriate robots and sitemap, strong page titles/descriptions, valid structured data that matches visible content, and distinct search intent per page. Use current Google Search Central guidance. Don't assume special schema or llms.txt will guarantee inclusion in AI features; separate measured data, sampled observations, inference and recommendations. Give users an explainable, prioritized Presence report rather than an ungrounded "AI visibility score".

## Priority 2 — APPLY THE EXACT 20-POINT ANTI-SLOP AUDIT FROM THE ATTACHED VIDEO

Do a sitewide pass, especially home, product, pricing, and every mobile view. Audit actual screenshots and rewrite affected UI, not merely add these to a checklist:

1. Delete filler badges.
2. Drop redundant labels.
3. Unitalicize random words.
4. Use monospaced type only for code, technical IDs, and tabular data where genuinely useful.
5. Use one cohesive design system.
6. Show the ACTUAL product or labeled working sandbox.
7. Enlarge the most important interactive feature.
8. Group related content through intentional spacing.
9. Make headlines specific and meaningful out of context.
10. Emphasize one clear primary CTA.
11. Use a restrained, coherent accent color.
12. Keep icons consistent in stroke, size, alignment and intent.
13. Remove pointless embellishments, excessive pills, glows, blur and filler cards.
14. Apply coherent corner-radius nesting; a useful starting geometry is inner radius ≈ outer radius − padding, adjusted optically.
15. Improve text contrast and reading comfort.
16. Correct headline wraps, widows, and responsive line breaks.
17. Align by eye when optical correction improves perception; keep the layout grid coherent.
18. Use tabular figures for dynamic numbers, prices and counters where appropriate.
19. Add meaningful loading, empty, error, success and disabled states.
20. Animate only useful feedback and transitions; avoid a page-wide reveal gimmick.

Also inspect the existing logo and font. The founder wants a distinctive original logo, a professional font that does not look like a default AI design, confident but restrained buttons, and significantly fewer decorative pill shapes. Do not copy Apple's actual proprietary artwork or source code. Pull principles from public design references, then craft an original system.

## Priority 3 — ACTUAL MARKETING CONVERSION

Make the main buyer obvious: commercial cleaning/service companies with small teams. Keep offer language straightforward and tailored to lead research, inbound response, site walkthroughs and follow-up. Structure the site around one clear conversion goal: qualified demo requests or genuine product exploration. Make CTAs contextual, not repetitive. Specify what happens after a demo form submission, and test delivery in the approved configuration. Provide clear pricing status, integration needs and setup expectations. Use honest objections: "Can I import my list?", "Does Scout send messages without asking?", "Can you guarantee ChatGPT mentions my business?", "Does it work with my inbox and calendar?", "What happens if I don't connect anything?", "Can I manage approvals myself?" Answer accurately from code and provider status. Never fabricate leads, conversions, SEO rankings, savings, badges, testimonials, security attestations or customers.

Create a concise objection-to-page matrix and define one primary action per route. Perform first-screen comprehension review with a simulated nontechnical cleaning-company owner, followed by actual human review when possible. Keep simulated feedback clearly labeled. The website should be exceptional without requiring people to sit through animation.

## Priority 4 — VERIFY AND DEPLOY THE REAL WORK

1. In `docs/v4/UX-AND-CRO-AUDIT.md`, record baseline screenshots at 390px/768px/1440px, findings, concrete changes, and new screenshots, including meaningful mid-scroll sections.
2. In `docs/v4/HUMAN_SITEMAP_AND_COPY.md`, write the detailed IA, hero and section copy with content responsibilities, no filler and no unsupported claims.
3. Verify every link, main CTA, form, contact method, nav/dropdown, page title, metadata, image, favicon and footer. Verify actual 404, robots, XML sitemap, internal links and redirects.
4. Run `npm run build`, typecheck, lint, unit/integration tests, and Playwright desktop/mobile Chromium and WebKit where present. Add explicit navigation-scroll regression tests, reduced-motion and focus tests. Report unavailable tests honestly.
5. Check accessible colors, usable typography, error and loading states, page smoothness, CLS, mobile overflow, and realistic content. Prefer performance improvements over an additional expensive animation.
6. Use the installed Impeccable/Hallmark/Scroll Craft/Taste/Motion and other reviewed design skills where they materially improve implementation; record what was actually used. Do not download and execute unreviewed remote scripts.
7. Preserve all working data, V2/V3 branches and checkpoints. Do not touch `betterdesk.ai` production or live billing. Deploy only a protected Vercel preview after verifying the project/team. Open and test the resulting URL, and report exact preview, commit, functional verification, and remaining blockers.

**Do not declare aesthetics 'perfect' or the marketing site 'high-converting' solely from a checklist. Report what was measured versus expert judgment. The founder makes the final design approval.**

## Immediate order for the current running session

1. Acknowledge this addendum without abandoning work already underway.
2. Fix the page-navigation scroll bug immediately and add browser regression coverage.
3. Write the complete, human-authored sitemap and copy outline before generating any more marketing filler pages.
4. Audit the first viewport and major product components against the 20-point rubric; make concrete visual improvements.
5. Ensure all key marketing/sales routes and CTAs are truthful and functional.
6. Re-test the entire experience, then deploy preview only and verify in browser.
7. Report exactly which tasks completed, which remain, and the URL. Do not silently claim completion.
