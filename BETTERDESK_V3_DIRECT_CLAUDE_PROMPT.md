# OPERATION BETTERDESK V3 — THE ANTI-TEMPLATE, APPLE-GRADE REBUILD

You are working DIRECTLY INSIDE CLAUDE CODE, interactively, in the existing BetterDesk website repository. This is not a request to make a plan, produce another runner, or polish V2. You are the senior creative director, brand designer, principal UX writer, motion systems designer, senior Next.js engineer, and independent visual QA lead responsible for executing a fundamentally better V3.

## THE NONNEGOTIABLE GOAL

Transform BetterDesk into a distinctly original, premium, Apple-caliber B2B software experience that a small-business owner understands in five seconds. Its visual craft should compete with excellent work from Apple, Attio, Linear and Awwwards, without imitating their actual brand identities or copying proprietary artwork, code, layouts, or animations.

I REJECT the familiar AI-generated SaaS look. V2 is a starting codebase, NOT an approved design. Do not preserve an underwhelming composition out of sunk-cost loyalty. Replace entire sections when needed. Do not stop after a technical test suite passes or declare yourself aesthetically approved. Implement, render, inspect, critique, fix, and provide a real Vercel preview for MY approval.

**The product story:** BetterDesk helps small service businesses respond to incoming customer inquiries, follow up, and turn conversations into next steps such as bookings, subject to the capabilities that are ACTUALLY implemented. The signature concept is **"From the first ring to the booked appointment."** The site must make clear what happens, what BetterDesk handles, why the owner cares, how it differs from a do-it-yourself AI chatbot, and exactly what happens after clicking the CTA.

## 0 — VERIFY AND PROTECT THE ACTUAL PROJECT

- Working directory should be `/Users/edge/Developer/betterdesk-redesign`. Confirm `pwd`, Git branch/status, current HEAD, `package.json`, app routes, components, existing motion dependencies, `.vercel/project.json`, current preview, and the content of `docs/redesign/` and `docs/quality-v2/`.
- The V2 design branch is expected to be `feat/betterdesk-sayable-quality-v2`. Establish the actual branch and preserve any uncommitted work. Create a V3 checkpoint branch such as `feat/betterdesk-v3-apple-editorial` from the latest verified V2 commit. Do not force-reset, delete branches, discard work, or rewrite the original app's history. Use a separate worktree only if necessary and well understood.
- The known REDESIGN Vercel project is `betterdesk-redesign` in team `neel-s-projects9`. Verify those identities before every deployment. `betterdesk.ai` is a different live domain and MUST NOT be changed. Never deploy `--prod`, alter DNS, Stripe/payment plans, or publish changes to the original BetterDesk production property without explicit subsequent approval.
- Treat `/Users/edge/Developer/projects/anything-research/sayable-site`, if present, as READ-ONLY creative reference. The latest Sayable may look better than V2, but do not touch it or transplant code/branding.
- No overnight runners, subprocess supervision frameworks, scheduled work, background daemons, or unattended loop scripts. Work directly in this Claude Code session, make actual changes, and use ordinary tools. If the session's context approaches its limit, write a concise `docs/v3/HANDOFF.md` and provide the exact human-resumable context. Do not claim to keep working after the session ends.
- Use already installed tooling and accounts; never assume that an installed skill is licensed/configured to execute, that a personal Claude subscription grants external API credits, or that external paid-generation tools are free. No purchases.

## 1 — RESEARCH AND REFERENCE DECONSTRUCTION BEFORE DESIGN

Read and visually inspect the REAL rendered websites, not just their marketing descriptions. For each, study composition, pacing, browser behavior, typography, material rendering, section transitions, type-to-visual relationship, and what *not* to borrow:

1. Apple product storytelling: https://www.apple.com/ — dramatic product-focused staging, elegant restraint, precise blur and lighting, readability, confident type. Use as a craftsmanship bar, not a template.
2. Attio: https://attio.com/ — product-first sophistication, information density with editorial rhythm, clean UI choreography.
3. Linear: https://linear.app/ — restraint, precision, sophisticated interaction timing, high-trust software presentation.
4. Awwwards Inkwell scroll narrative: https://www.awwwards.com/inkwell-a-scroll-driven-narrative-for-ais-most-stealth-player.html — long-form narrative choreography, progressive visual transformations.
5. Awwwards UAE Pavilion sand particle interaction: https://www.awwwards.com/inspiration/sand-particle-cursor-uae-pavilion-expo-2025-osaka — motion with material character; do NOT copy its cursor effect literally.
6. Awwwards 'Stories of Our World Come Alive': https://www.awwwards.com/inspiration/scroll-interactions-joy-from-africa — art-direction specificity, editorial storytelling.
7. https://www.awwwards.com/ and https://rickcreates.com/ — find at least two more verified award-level sites with relevant scroll or product storytelling. Link the original source and summarize an observable technique rather than calling something award-winning without evidence.
8. Existing BetterDesk V2 and latest working Sayable reference at **1440, 390 and 320 px**. If a preview is protected, use the local source or authenticated tooling; never pretend you saw a screenshot you could not access.

Use browser/Playwright to capture the baseline and reference observations. Create `docs/v3/RESEARCH.md` with a short, critical teardown and a single chosen creative direction. Decide why this concept is BETTER for a working business owner, not merely more flamboyant.

### Anti-AI-slop investigation: explicitly detect and remove

- Centered billboard hero + tiny pill eyebrow + gradient headline + two identical pill buttons + floating screenshot.
- Blue/purple auroras, multicolor gradient text, neon glows, random mesh backgrounds, decorative orbs.
- Repeated three-column feature cards, identical bento containers, rounded boxes within rounded boxes, all cards using the same icon/title/two-line formula.
- Excessive 9999px border radii, capsule nav links, badge proliferation, generic icon circles.
- Empty space that hides lack of story rather than concentrating attention.
- Untethered UI dashboards with invented names or numbers; fake testimonials, fake customer-logo walls, fake award badges, fake ROI promises.
- Generic SaaS copy: "unlock," "revolutionize," "supercharge," "seamlessly," "empower," "AI-powered solution," "streamline your workflow," "transform your business," and similar filler.
- Uniform opacity-up reveals on EVERY section; gratuitous ticker effects; effects that communicate nothing.
- Inter used by default with no typographic rationale; arbitrary alternating fonts; all text centered.
- Sterile gradients masquerading as physical lighting. Crops, overlaid UI, shadows, and blur must have a coherent spatial explanation.
- Incorrect or fabricated business facts, unsupported integrations or certifications, or lifeless example dialogues.

Write `docs/v3/AI-SLOP-AUDIT.md` with at least 20 specific findings backed by V2 screenshots/code, ranked by their visual and commercial damage. Remove the patterns, not merely rename their components. Count repeated card layouts, chips/pills, and decorative glows; reduce them significantly in V3 while preserving actual usable buttons.

## 2 — AUTHOR AN ORIGINAL BETTERDESK BRAND, NOT A CLONE OF APPLE

A brand system with a recognizable visual signature is essential. Define it BEFORE rewriting components:

- Brand thesis: **a business owner is busy; the opportunity should not disappear with the unanswered ring.** BetterDesk is the quiet connective tissue from incoming inquiry to clear next step.
- Visual motif: a **single routed signal / continuous line** that evolves through a phone ring, message transcript, follow-up and appointment confirmation. It should recur in the logo, chapter transitions, illustration language, and product diagrams, in ways that are subtle and different rather than one repeated gimmick.
- Create **three ORIGINAL logo concepts** as responsive SVGs: (A) signal-to-calendar negative space, (B) stylized "b" formed by a continuous route, (C) editorial wordmark with a distinctive custom terminal/connection. Test at favicon size, 24px nav, monochrome, light/dark, and mobile. Choose ONE after screenshot comparison and rationale; the current logo should be replaced if inferior. No generic AI sparkle, atom, chatbot bubble, or gradient infinity mark. Check for obvious similarity to existing brands, but do not make an unsupported trademark-clearance claim.
- Type: propose 2–3 intentional font pairings, choose one with clear hierarchy and optical tuning; licensing must permit use. Consider an excellent neo-grotesk sans with restrained editorial contrast, but do not imitate San Francisco as a proprietary brand asset or assume the fonts can be redistributed. Focus on line breaks, letter spacing, measure and x-height.
- Palette: inspired by Apple *restraint*, not Apple's exact website. Choose a distinctive, trustworthy BetterDesk neutral/material system; one quiet accent and purposeful contrast. Avoid neon, default purple, and cream/brass cliché. Document HEX tokens, material lighting, edge highlights, surface elevation, borders and shadows. Support dark and light contexts only where the story needs them.
- Less rounded: establish a radii system with e.g. 4/8/12/16px for most elements; reserve true pills for tiny functional chips or exceptional controls. Navigation should feel like crafted product UI, not a row of capsules.
- Blur: use directional depth-of-field as camera language, selective frosted navigation if it improves readability, local light diffusion behind product surfaces, carefully tuned backdrop-filter in appropriate areas, and crisp foreground UI. Blur should suggest depth, never reduce text readability.
- Texture: extremely subtle grain, physically plausible specular highlights, shadow falloff, silver/charcoal/ceramic or glass material studies if they suit the final world. No stock abstract gradient wallpaper.

Deliver `docs/v3/BRAND-SYSTEM.md`, source SVG logo and optimized assets; create an actually useful favicon and social preview. Inspect asset quality in browser, not just code.

## 3 — THE APPLE-CALIBER HOMEPAGE: AN ORIGINAL SCROLL FILM THAT SELLS

Do NOT compose a conventional hero followed by 8 identical feature sections. Choose a Scrollcraft narrative grammar and design an emotional/attention curve. Art-direct the whole page with 3–5 major visual ACTS, deliberate contrast between spectacle and stillness, and clear practical information. The visitor should understand the business in the FIRST VIEWPORT.

**Act I: The moment a customer reaches out.**
- Hero starts immediately with a specific, beautifully typeset benefit headline. Suggested starting direction: **"Every inquiry deserves an answer."** Supporting line: **"BetterDesk responds when you can't, follows up with customers, and helps turn conversations into appointments."** Use this only if the source proves those exact functions. Rewrite if evidence differs. No AI badge and no pill-eyebrow hierarchy.
- Build a bespoke centerpiece inspired by a premium product film: an incoming call or message represented by a highly art-directed phone/call surface, natural reflection, and one illuminated signal thread. Avoid a clone of an Apple iPhone; do not use Apple device trade dress. The hero is a distinctly BetterDesk object or UI composition.
- The central object responds subtly to pointer/scroll with optical depth, light and layered parallax. Real CTA labels: "See a conversation" and "Book a demo" (only if booking works). Primary action instantly understandable.

**Act II: The missed moment.**
- One sharply designed, grounded scenario: a small service-business owner is doing actual work and misses an inbound inquiry. Avoid melodrama or invented business statistics.
- As the user scrolls, a missed inquiry transitions into BetterDesk's response. Compose the transformation in-place using a pinned stage, not a repeated card grid. Use readable, believable message copy and accurate product behavior. Example content must be labeled illustrative if not real.
- Show the actual consequence in plain language: without follow-up, some prospective customers may move on; BetterDesk gives the business a timely next step. Don't promise a precise conversion uplift without evidence.

**Act III: The reply becomes a booking.**
- Site-defining signature motion sequence: a single signal line connects inquiry → response → follow-up → available time → calendar booking, morphing live as scroll progresses. The UI should demonstrate the workflow; timing, masks, composition and foreground depth should make this feel designed from scratch.
- Use authentic product surfaces drawn from actual app code or a clearly labeled representative demo. If booking automation is not fully supported, make clear what is currently supported and what is illustrative. Include a control to play the flow without scrolling, and accessible text equivalent.

**Act IV: All the important work, without the noise.**
- Product details (inbox, messaging, scheduling, missed-call recovery and any other VERIFIED features) appear through differentiated editorial layouts: one full-bleed product canvas, one intimate macro detail, one dense but readable UI sequence. No three feature cards as the primary architecture.
- Show what the human team still controls. Address privacy, integrations, setup time, handoff to staff, errors and limitations honestly.

**Act V: The economic argument and easy next step.**
- An elegant, honest, interactive value calculator (if supported) with visible assumptions: inquiries/month, approximate missed share, realistic lead value, and conservative conversion estimate. Calculate rather than invent numbers. Say explicitly that the outputs are illustrations, not guarantees.
- Present **slightly more approachable pricing**, clear inclusions and usage limitations, plus genuine comparison logic. End on a confident, beautifully staged call-to-action; no abstract fluffy "future of business" closer.

The page must feel like ONE directed product film, but remain a fast, understandable website. The signature motion should be memorable enough to describe in a sentence. Use whitespace as timing, not filler. Vary alignment, typography, surface treatment and density on purpose. NEVER make it a clone of Apple.com; take the discipline and craft, create original BetterDesk art.

## 4 — MOTION AND SCROLLCRAFT: MORE ANIMATION, BETTER MOTIVATION

Use the REAL installed skills and their current instructions if available. Verify installation before claiming skill use:

- Scrollcraft: https://github.com/nateherkai/scroll-craft and `plugins/nateherk-design/skills/scroll-craft/SKILL.md` (when locally available).
- Impeccable: https://github.com/pbakaus/impeccable — run the installed critique, audit, animate, typeset, polish or equivalent steps, with real edits from each.
- Motion: https://motion.dev/docs/react-scroll-animations and https://motion.dev/docs/react-use-scroll
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Awwwards design skill, gstack design review, REA public interface study, Canvas Design for static art direction, Hallmark design critique, and other preinstalled UI skills only if genuinely installed, documented and safe. Never fabricate tool execution, install unreviewed third-party skills, or use REA to copy proprietary source/assets.

Implement at least THREE distinct high-quality animations serving different purposes:
1. Hero signature: restrained, precise optical/parallax/material interaction.
2. The central story: **scroll-scrubbed signal-to-booking transformation**, with correctly bounded pinned stage, responsive timeline and an explicit real user-controlled play/replay option.
3. Product close-up: shared-element or masked scene transition that reveals one specific capability.
4. Optional quiet accent: small blur/typographic focus handoff or context-aware microinteraction, not another giant spectacle.

Choose ONE coherent motion orchestration system for major scroll scenes (GSAP ScrollTrigger OR Motion useScroll where appropriate), not a chaotic blend of both everywhere. Keep CSS for simple controls. Animate transforms/opacity/clip paths where practical; make filter blur localized and limited. Avoid scroll jacking, pointless smooth-scroll libraries, long animations that delay navigation, stuck pinned stages, hidden unreadable text, CPU/GPU-heavy particles on mobile, and all autoplay audio. Recompute timelines on resize. Test reverse scrolling, interrupted scrolling, touch scroll, wheel, trackpad, back/forward navigation, orientation changes, and tab switching.

If using WebGL, canvas, particle fields or shaders, write down why the effect is necessary. Restrict to one intentional high-payoff scene, lazy-load it, budget memory, avoid huge shaders on small devices, and supply a clean CSS/SVG/static fallback. Do not buy or require external animation/video generation services. Respect `prefers-reduced-motion` with full content access and equivalent information. Keyboard and screen-reader behavior must remain usable. Native scroll should remain natural.

## 5 — REBUILD THE BUSINESS STORY: CLARITY OVER CLAIMS

Learn from the user's Sayable product-strategy brief: customers need to understand the problem, consequences, timing, alternatives, financial case, exact deliverable, and next action; transfer that DISCIPLINE to BetterDesk, not Sayable's PDF/government content.

Create `docs/v3/BUSINESS-TRUTH.md` from verified code/docs and publicly accessible BetterDesk materials:
- What does BetterDesk actually do *today*? Which channels (phone, SMS, web chat, email) and integrations truly work? What requires human setup? What is prototype/mock? What is only planned?
- Exactly which small-business segment is the first credible ideal customer? Compare salons/spas, home services, independent practices, auto service and other plausible categories using buying pain, capability fit, implementation and restrictions. Pick one primary persona and at most two supporting examples, rather than vague "every business" messaging.
- In plain English, answer: What happens when I miss a lead? What will BetterDesk do? What do I still do? How soon can I start? What software does it use? Can I try it? What does it cost? Why not just use ChatGPT, an answering service, a general CRM or a DIY workflow?
- Produce a truly understandable **before / BetterDesk / result** explanation with transparent limits.
- If no reliable customer studies, real revenue lifts, outcomes or security certifications exist, do NOT fabricate them. Build trust via a verified demonstration, architecture transparency, privacy explanations, honest support/setup information and clear plan limits.
- Humanize every line. Write as an intelligent founder talking to a local business owner. Avoid marketing fluff and em dashes. Use short, concrete phrases with observable action and consequence. A person who has never heard the words "agentic AI" should still understand it.
- Conversion: every CTA leads to a functioning, testable interaction (real demo scheduling, working contact form, or explicitly disclosed email fallback). Test actual receipt/delivery if configured. Don't fabricate contacts or promise communications were sent.

### Price: make it a LITTLE cheaper without secretly making a false offer

V2 was previously reported as approximately **$149 / $299 / $599 per month**; verify current source prices and actual payment configuration. As the leading V3 pricing *proposal*, model **$129 / $249 / $499 per month** (roughly 13%, 17%, 17% lower), but do not treat those as authorized live Stripe amounts or guaranteed profitable economics. Inspect model/telephony costs, included minutes/messages, per-unit overages, onboarding, COGS, margins and competitive benchmarks first. Explicitly show practical usage/limits and tier differences; do not offer "unlimited" with hidden variable costs.

- For the V3 **preview**, show the revised prices ONLY if they are labeled accurately as proposed/preview pricing or have been matched to a correctly configured billing flow. If pricing is wired to real checkout, keep UI and backend amounts identical; do not silently modify production Stripe or existing subscribers.
- If cost data is missing, retain a clearly labeled draft pricing table in the preview, document exact approval requirements and recommended unit economics. The user asked for a cheaper price, so do not ignore it; make a reasoned proposal with plan names, inclusions, limits and rationale.
- The cheapest tier should offer a credible starting point, with an upgrade path tied to actual needs rather than fake feature gating.

## 6 — FULL MULTIPAGE EXPERIENCE, NOT ONLY A HERO

Audit every current route. Preserve relevant content and functionality but fully redesign visual systems where needed. Improve homepage, product, how-it-works, solutions/use cases, pricing, demo, contact, FAQ, security/privacy and other existing valid routes. Don't create 20 pages of filler. Every page must feel like the same brand, and no subpage should collapse into bland card-grid templates. Show realistic product UI, clear differentiation, pricing details, working contact paths and exact next steps. Ensure metadata, favicon, OG, sitemap and canonical behavior remain correct.

Use composition variety appropriate to the content: cinematic one-shot, editorial close-up, structured comparison, dense product panel, clear FAQ typography. Avoid making every page visually loud. At every section, ask: **What question does this answer? What visible evidence supports it? Why is this visual the best way to tell it? What should the visitor do next?** Delete sections that fail.

## 7 — QUALITY CONTROL: LOOK, FAIL, FIX, REPEAT

**Do not call a site "done" because 76 browser tests passed.** Performance and correctness are mandatory but do not equal visual excellence. Real screenshots are the decision substrate.

1. Capture **V2 BEFORE screenshots** at desktop 1440x900, laptop 1280x800, tablet 768, phone 390 and 320, including first viewport, key scroll beats, pricing and product/demo; save in `docs/v3/screenshots/before/`.
2. Build a real art-direction board or composition spec and implement the V3 hero + first full story before optimizing small details. Take **AFTER-PASS-1** screenshots and visually inspect them. Do not merely generate screenshots and never read them.
3. Run a critical design review. Identify top 10 weaknesses in hero balance, color, texture, type, lighting, motion, originality, business clarity, mobile and interaction. Fix each high-impact issue.
4. Build or refine the remaining pages, take **AFTER-PASS-2**, then a final pass with screenshots at every required viewport. Produce a concise HTML or image contact sheet comparing V2 and V3. Check composition *mid-scroll* and mobile pinned states, not just static top-of-page.
5. Use a genuinely skeptical independent reviewer/subagent if supported. Grade each dimension 1–10 with screenshot-grounded justification, and no automatic 10/10. The founder, not the agent, decides final aesthetic acceptance.
6. Include one first-viewport comprehension exercise: nontechnical owner should explain in plain words what BetterDesk is, why it matters, and what clicking the CTA does. Synthetic review is a preliminary diagnostic, not a replacement for real people.

**Minimum engineering gates:** `npm`/`pnpm` commands appropriate for actual repo; lint, TypeScript, production build, unit tests, Playwright Chromium/WebKit responsive journeys, browser console and network errors, keyboard/focus, accessibility audit, reduced-motion and JS-disabled/non-WebGL fallbacks, mobile menu, every CTA and form, SEO metadata and links. Report what ran vs didn't run. For a public site target WCAG 2.2 AA, contrast 4.5:1 ordinary text, and good Core Web Vitals (LCP ≤2.5s, INP <200ms, CLS <0.1) where measurable; never fabricate field-data scores or mark a goal achieved without evidence. Avoid large assets, hydration delays, scroll jank, layout shifts, unusable touch targets and hidden content. Keep the important first-viewport content readable before animation begins.

## 8 — VERCEL PREVIEW, NOT PRODUCTION

- Verify `.vercel/project.json` maps to the existing `betterdesk-redesign` project under `neel-s-projects9`. Preview-only deployment from this repo using a verified Vercel CLI/team. Do NOT run `vercel --prod`, change aliases/domains, modify `betterdesk.ai`, publish marketing claims to production, or alter Stripe billing in production.
- Confirm the preview build is READY and its routes work via authenticated tools. If preview is behind Vercel login, report that honestly and provide the deployment URL and inspector URL. Do not disable auth without approval.
- Include `docs/v3/FINAL_REVIEW.md`: before/after screenshots, design choices, original logo files, implemented features vs illustrative features, pricing recommendation and gating, test results, Lighthouse measurements with conditions, key known limitations, exact preview link, current Git commit/branch, and what the founder must approve.
- If the first preview isn't visually convincing, keep making meaningful improvements in this session, then create a new preview. Do not self-certify V3 based on a README, scorecard or successful build. Do not produce another autonomous runner.

## EXECUTION PRIORITY: START NOW

0. Verify source, save a Git checkpoint and create V3 branch.
1. Research the references and view the real V2/Sayable screenshots.
2. Write the anti-slop audit, creative thesis and revised business/pricing hypothesis.
3. Replace the brand/logo, hero and central scroll narrative; do not spend the whole session on documentation.
4. Render and visually review. Fix actual weak sections and motion.
5. Redesign the remaining pages and revenue-critical flows.
6. Test cross-device/cross-browser, improve performance and accessibility.
7. Deploy and verify a **new Vercel PREVIEW**. Report the exact URL, what changed, what is real, what is not yet done, and what needs founder approval.

When you are tempted to add another pill, tiny feature card, glow or generic claim, ask: **Would an extraordinary design studio use this element if it did not exist in the component library?** If not, remove it.

Now begin with the real code and browser. Do not reply with only a plan or ask me to set up an overnight runner. **BUILD V3.**
