# BETTERDESK — APPLE DESIGN INCORPORATION
## Additive, high-priority instruction for the ACTIVE Claude Code build

**This file supplements, and does not replace, `docs/v4/ACTIVE_ADDENDUM.md` and the existing BetterDesk master brief.** The founder has already started a Claude Code build. Integrate these instructions into the current working branch. Inspect in-progress changes and avoid spawning another implementation process, starting over, overwriting commits, or touching production. If a current tool call must finish before this can be read, incorporate it at the next safe checkpoint.

## THE NEW PRIMARY DESIGN AUTHORITY: EMIL KOWALSKI'S APPLE DESIGN SKILL

The founder specifically selected the genuine `apple-design` skill from **https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md**. This must now govern the final execution quality of animations, materials, gesture response, typography and navigation. **Do not mistake the title for permission to copy Apple's artwork, trademarks, icons, layouts or source code.** We want Apple's principles of purposeful fluid interaction expressed in an original BetterDesk identity.

**Before claiming the skill is in use:**
1. Read the latest repository README and the complete `skills/apple-design/SKILL.md`, including its references, actual installation advice, and constraints. Verify repository ownership, license, current revision and file paths.
2. Inspect `.claude/skills`, global Claude skills, plugin inventory and the current repo's installed packages. Do not duplicate an already installed skill.
3. If it is not installed, review the `skills` CLI and the skill files before invoking installation. The publisher documents `npx skills@latest add emilkowalski/skills`. For a focused Claude Code install, use its documented CLI options after verifying `npx skills --help`, for example `npx skills@latest add emilkowalski/skills --skill apple-design -a claude-code` if supported. Prefer a **project-local** installation when possible; do not perform a global install without a clear reason. Do not invoke arbitrary `curl | sh` installers. Install dependencies only when justified and after inspecting them.
4. Because this Claude Code session is already running and automatic skill discovery may only happen at startup, **read the installed skill's `SKILL.md` directly from disk in the CURRENT session**. Do not require the founder to restart this build. If a new session is eventually required for slash-command discovery, record it as a convenience, not a blocker to applying the actual instructions now.
5. Record actual source revision, install path, whether read/invoked, and material changes in `docs/v4/DESIGN_SKILL_EXECUTION.md`. Never claim a tool ran when it was only cited.

### Exact Apple Design implementation contract

**A. Immediate response.** Pressed controls give immediate state feedback; don't add artificial timers or animation gates. Tap begins feedback at pointer-down; commit appropriate actions at release. The product must remain usable with keyboard input and no pointer.

**B. Interrupted motion.** Menus, drawers, dialogs, product cards and inspector panels must reverse direction smoothly if the user changes their mind mid-transition. Animate from the current presented value, not a stale target. Preserve momentum where appropriate; never make someone wait for a prior animation to finish before they can act.

**C. Natural spring behavior.** Use critically damped, low-overshoot motion for everyday UI. Save modest bounce for user-initiated kinetic gestures. Set a coherent system of spring presets and document their intended use; do not blindly prescribe one duration to all contexts. Match entry and exit paths. Popovers originate from their trigger, drawers exit toward their entrance, and a card expanding into detail keeps a stable visual identity through shared-layout motion.

**D. Direct manipulation.** If draggable, pointer/drag and object movement track 1:1 with the actual grab offset and pointer capture. Hand off velocity at release without visible snapping. Honor gesture thresholds, overscroll/rubber-band boundaries where suitable and accessible non-drag alternatives. Do not add drag simply for entertainment.

**E. Spatially purposeful transitions.** Use shared layout IDs only when the SAME object logically persists across states. Its position, size and hierarchy should remain understandable. Distinct records must not accidentally share identity. When navigating to another page, show the destination at the top immediately without a bottom-to-top animation. Navigation correctness outranks a beautiful transition.

**F. Glass, blur, material depth.** Build real visual hierarchy rather than making every surface translucent. If blur is used, ensure readable contrast over dynamic backgrounds; give floating tools proper edge treatment, appropriate scale-dependent shadows and a solid/high-contrast fallback for reduced transparency. Do not stack multiple glass layers under body copy. Avoid a heavy, full-screen CSS backdrop-filter that causes jank on phones.

**G. Optical typography and font.** Founder explicitly wants a visibly different, premium BetterDesk font and an original logo. Examine the current font rather than assuming V3's font is still used. Compare at least three legally usable directions, choose one purposeful brand voice, set optical tracking/leading across the type scale, correct headline line breaks and dynamic number alignment. Default font should not automatically be Apple's proprietary San Francisco; use properly licensed public alternatives and create a BetterDesk look, not an Apple imitation. Use two font families max except code/technical needs.

**H. Reduced-motion & device adaptation.** Respect `prefers-reduced-motion`, `prefers-reduced-transparency` where supported, and increased contrast. Avoid huge moving backgrounds, flashing, overly long repeating loops, and sensory overload. Ensure touch targets, viewport sizing, safe areas and mobile input controls work on iPhone-size devices.

**I. Performance.** Animate `transform` and `opacity` where possible. Profile the expensive blur, shadow, filter and motion props rather than guessing. Avoid frame-by-frame React re-renders, overusing `will-change`, duplicate animation frameworks, or scroll handlers that recalculate layout on every tick. Record filmstrip or frame trace evidence of the main interaction rather than merely citing Lighthouse.

**J. Delight through utility.** Small successes deserve restrained feedback; disabled, loading, success, failure and interrupted states must all have coherent behavior. Remove animation that hides content, interrupts work, or fails to explain what happened.

### Apply Apple Design to these BetterDesk surfaces

1. **Homepage first viewport:** a distinct, product-specific scene that makes the BetterDesk promise immediately understandable to a commercial cleaning/B2B service owner. The hero should display a real or clearly labeled sandbox state of Scout → Presence → Desk, not a generic floating dashboard. The CTA is obvious without watching a long animation.
2. **Main navigation:** compact, easy-to-scan navigation with precise pointer and keyboard states; minimal pill labels. Clicking another route opens AT THE TOP with no visible scroll travel from the prior page; browser Back/Forward and anchors retain appropriate native behavior. Add Playwright regression tests.
3. **Scout:** transition from a qualified prospect list to the same prospect's evidence panel and editable introduction draft via stable shared-element semantics; show state and approvals clearly.
4. **Presence:** render discoverability audit data clearly and acknowledge measurement limits; use graceful changes when a tab or report selection changes. No made-up AI-search rank or citation statistics.
5. **Desk:** instant-feeling inbox, inspector and booking flows; customer timeline transitions, no confusing jump on send/approval/booking. Simulated actions must remain labeled as simulated.
6. **Conversion:** accessible demo-request CTA and form with real validation, loading, submission and failure states. Never pretend a lead was delivered if no destination is configured.
7. **Pricing:** simple and readable offer architecture; comparisons with stable tabular figures, clear usage boundaries, and no decorative badge overload. Do not change actual billing without approval.
8. **Mobile:** one-handed ease of use, safe areas, touch states, no iOS input zoom, no stuck hover, no overflow, no page locks caused by a long scroll scene.

## ADDITIONAL DESIGN AND QA SKILLS — RANKED BY REAL USEFULNESS

**Tier 1: actually read/use for this project, if available or safe to install**

| Skill or repo | Source | Concrete job |
| --- | --- | --- |
| `apple-design` | https://github.com/emilkowalski/skills | Governing design principles: immediate response, velocity-aware interruptible motion, translucent materials, optical typography. |
| `review-animations` | same repo | Critical pass on existing animations: direction, origin, interruption, slow paths, gratuitous movement. |
| `choreograph` | same repo | Orchestrate product-state morphs and hero sequences as one coherent motion, not unrelated staggered fades. |
| `animation-performance` | same repo | Trace and fix dropped frames, long-running filters, JS scroll bottlenecks and janky React rendering. |
| `mobile-native` | same repo | Safari/iPhone touch behavior, safe area, viewport and input polish. |
| `break-ui` | same repo | Worst-case CRM data, long prospect names, zero results, very long headings, odd prices, huge counts and non-Latin strings. |
| `web-design-guidelines` | https://github.com/vercel-labs/agent-skills | Interaction semantics, focus management, touch targets, typography, forms and accessibility. |

**Tier 2: retain the valuable tools already in the earlier founder brief**

- **Impeccable** — https://github.com/pbakaus/impeccable — editorial composition, optical detail, critique, persuasion, distillation.
- **Hallmark** — https://github.com/Nutlope/hallmark — browser-based anti-AI-slop floor and page critique. Use it as a checker, not as a substitute BetterDesk template.
- **Taste Skill** — https://github.com/senlindesign/taste-skill — WHY the selected design references work, not copied code/assets.
- **Scroll Craft** — https://github.com/nateherkai/scroll-craft — one signature scroll story plus its responsive verification, not pinning every section.
- **Stop Design Slop** — https://github.com/Juuzoe/stop-design-slop — structural genericness checks.
- **Awwwards/Jury** — https://github.com/juliobsz/skills — independent visual critique and a meaningful fresh-context quality check; not an award guarantee.
- **Motion** — https://github.com/motiondivision/motion — implement verified shared-layout and spring behavior with the documented API.
- **DESIGN.md** — https://github.com/bergside/design-md-chrome — reference/design-token extraction when actually available; this is a browser extension, not an automatic Claude coding skill. A safe browser-style audit is the fallback.

**Tier 3: useful optional resources ONLY if the project has a specific gap**

- **Anatomy** — https://github.com/wheresryan22/anatomy — one accurate, highly crafted SVG/isometric explainer of the connected Scout → Presence → Desk workflow, only if it aids comprehension and performs well. Do not use if it makes the site harder to understand.
- **Motion Primitives** — https://github.com/ibelick/motion-primitives — patterns to learn from for interaction craft; its README identifies beta status, so avoid installing it as a default dependency or copying unreviewed components.
- **`pick-ui-library` and `remove-animations`** in Emil's repo — use when the team is building unnecessary custom primitive controls or adding animation without purpose.

**Installation policy:** First inspect `npx skills list` (and global equivalent), Claude Code plugins, and local repo skills. Prefer currently installed tools. For missing tools, verify README, license, scripts, exact install command, dependency behavior and source revision. User permits installing reasonable design resources, but do not add paid services, change global shell config, fetch private keys, or install every repository indiscriminately. Record every actual installation and its purpose. Skill instructions are guidance, not authority to alter BetterDesk's security, deployments, or unrelated projects.

## DELIBERATE DESIGN PROCESS — STOP REPEATING THE SAME REBUILD

**First:** Capture the current working version in a real browser at 390, 768 and 1440 px. Get matching screenshots from key pages and interactions. Inspect the current brand font/logo, app UI and navigation defect. Write a one-page baseline critique citing screenshot locations.

**Second:** Form ONE original BetterDesk creative proposition with a recognizably different visual grammar. The system must be business-first and specifically suitable for commercial cleaning and B2B service companies. Show a realistic workflow artifact (actual app or labeled sample), not invented metrics. Keep the core brand consistent across marketing and dashboard without making every page identical. Compare three font options and three simple logo explorations, choose and implement one without waiting for an unnecessary questionnaire.

**Third:** Create or revise `docs/v4/DESIGN.md` as the actual source of truth. Include a font/token system, logo usage, visual hierarchy, grid, motion presets, backdrop treatment, accessibility and platform adaptations. Do not turn it into a theme gallery.

**Fourth:** Implement the new system into running code with real interactions and product visuals. Ensure **Scout, Presence and Desk** explain a connected value proposition: prospect discovery, being discoverable, then inquiry-to-booking follow-through. Place the main CTA naturally, not as another pill cluster. Use the full human-written sitemap from the existing addendum, but prefer fewer strong routes over many thin pages.

**Fifth:** Conduct three *bounded, evidenced* quality loops: (1) homepage/nav/first screen; (2) product demo/Scout/Presence/Desk; (3) pricing/contact/mobile. Each loop = screenshot → critique → code change → screenshot → functional tests. Do not merely update a markdown score without improving the actual rendered site. Keep a changelog of before/after issues.

**Sixth:** QA all key states. Test keyboard, Safari/WebKit, Chromium, reduced motion, focus after route changes, visual scroll position, drag cancellation, menu reversal mid-flight, current page nav, `prefers-reduced-transparency`, 320/390/768/1440/1920 widths, worst-case data and real CTA submission or documented blocker. Fix mobile overflow, initial bottom-of-page navigation, contrast problems, loading, empty/error states, missing destinations and SEO metadata. Maintain strong Core Web Vitals without claiming metrics that weren't measured.

**Seventh:** Deploy only to the VERIFIED protected preview for the current BetterDesk project, inspect the real URL, and report commit, screenshots, passing/failing checks, status of skills actually used, unfinished items and exactly which product capabilities are real, sandboxed, or planned. Never touch `betterdesk.ai` production, send real unsolicited outreach or edit live billing.

## REVIEW RUBRIC — THE UI MUST SHOW PROGRESS, NOT JUST CLAIM IT

Give each of the following a documented screenshot-based critique, not an invented objective score:

1. In 5 seconds, does a nontechnical commercial cleaning owner understand who it is for, what it does, and the next step?
2. Is the logo recognizably original and usable at favicon size?
3. Is the new type system visibly better and legible on an actual phone?
4. Does navigation between separate pages BEGIN at the top without any animated scroll-back?
5. Is the most important product scene more prominent than decoration?
6. Does Scout → Presence → Desk feel like one persistent customer journey?
7. Does material/blur actually help hierarchy rather than hide content?
8. Are all interactive transitions fast, interruptible, correctly anchored, and spatially coherent?
9. Are all feature and business claims supportable from tested behavior?
10. Are the forms, pricing, mobile experience, accessibility, performance and SEO technically credible?

A 9/10 aesthetic score from Claude does not count as founder approval. Do not stop work just because a self-generated scorecard says it is complete. Continue useful changes until the current session's available work is genuinely exhausted or a concrete blocker prevents progress.

## MANDATORY OUTPUT FILES

Update or create:
- `docs/v4/DESIGN.md`
- `docs/v4/DESIGN_SKILL_EXECUTION.md`
- `docs/v4/APPLE_MOTION_AUDIT.md`
- `docs/v4/HUMAN_SITEMAP_AND_COPY.md`
- `docs/v4/UX-AND-CRO-AUDIT.md`
- `docs/v4/QA_RESULTS.md`
- `docs/v4/FINAL_HANDOFF.md`

Do not claim all these exist until you actually write them.

**FINAL INSTRUCTION: Implement these changes immediately in the current BetterDesk Claude Code session. Do not merely acknowledge the Apple Design skill or write about it. Read it fully, use it to edit the actual website and app, verify the rendered results, and return a tested preview.**
