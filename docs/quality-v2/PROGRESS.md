# Progress: Sayable-level quality v2

## Cycle 1 (2026-11-06, ~17:20–18:40 PST)
**Baseline:** HEAD 894c13b. Server on :3917 is the overnight build. I could not stop it (process not started by this session), so this mission's builds run on **:3918**.

**Research:** Sayable source (read-only) and live :3100 were captured in `screenshots/sayable/`. Notes are in `research/SAYABLE_NOTES.md` and the comparison in `SAYABLE_VS_BETTERDESK.md`. The baseline critique (17 findings) is in `BASELINE_CRITIQUE.md`, and the art direction in `ART_DIRECTION.md`.

**Changed (presentation layer):**
- New world, "After hours, then morning": graphite night lit by one amber lamp, pearl for what's settled. Tokens are in `app/globals.css`. An `.on-night` inverted scope lets shared components render on graphite.
- Display face Newsreader → Bricolage Grotesque (OFL, opsz axis, self-hosted 77 KB). Geist stays for text.
- New mark: amber signal rings closing onto a solid D (`components/Logo.tsx`, `app/icon.svg`).
- Set piece A, hero `components/NightDesk.tsx`. Panoramic call → text thread → Thursday schedule. The booking settles into a held slot. Server-rendered, resolved by default, with a CSS sequence of about 3.2s. Mobile gets its own vertical composition with the product in the first viewport.
- Set piece B, scroll story `components/SignalStory.tsx`. Five states (signal, reply, ask, route, owner) on a sticky stage with a persistent five-node conversation rail and motion layoutId transitions. Below `lg`, each state renders inline with no pinning.
- Homepage re-paced: night hero → dusk moments timeline → night story → gradient into pearl walkthrough → graphite control → fit → pricing → FAQ → morning close (`CtaBand`, booked card).
- Subpage heroes are now night bands (`PageHero`). Kickers and eyebrows were removed site-wide (Section marks retired). Header is a graphite bar with a pearl CTA.
- Reveal no longer hides content (transform only). This fixes the blank slabs in the baseline full-page capture.

**Screenshots:** `screenshots/baseline/`, `screenshots/pass-01/`, `screenshots/pass-02/`, each with an `index.html` contact sheet. Three loops ran: baseline → pass-01 (overflow at 320/390, stray thread strokes, empty slot, chip wrap, CTA indent, mobile product below fold) → pass-02 (all fixed; overflow false at every width) → independent REJECT review (`REVIEW_PASS02.md`) → contrast and test fixes.

**Tests:** typecheck ✓, lint ✓, unit ✓, build ✓. Playwright before the final fix: 79/80 (Chromium + WebKit, axe on every route). The final reduced-motion fix result is below in this file.

**Independent review (REVIEW_PASS02.md): REJECT.** It judged the work clearly better than the baseline but not at the Sayable bar.

## Next highest-impact changes (cycle 2)
1. Story section: tighten the step spacing, give the left column a persistent clock or timeline, and make the stage content fill the pane at larger scale (reviewer #1).
2. Walkthrough (LeadJourney): render the completed thread by default; the empty phone is still baseline finding #5 (reviewer #2).
3. Hero focal point: enlarge and light the conversation pane as the hero object and shrink the schedule (reviewer #3).
4. Subpages: give pricing, platform, demo and how-it-works a hero artifact each; the pricing right half is still empty (reviewer #4).
5. ROI set piece D: an editorial redesign of the calculator. Not started.
6. OG image in the new identity (still the old cream). Mobile sticky CTA restyle (reviewer: cream bar overlapping content).
7. Lighthouse and CWV measurement on the new hero.

## Blockers
- A Vercel PREVIEW is the target. Its result is recorded below.
- Port 3917 is held by the old overnight server.
**Final e2e (cycle 1):**     [webkit] › tests/e2e/site.spec.ts:152:1 › reduced motion: hero shows the finished scene immediately    79 passed (50.3s) 

**Preview (cycle 1):** https://betterdesk-redesign-8u64w2vv1-neel-s-projects9.vercel.app. Target preview, status Ready, built from commit 3b8c4f6. It is **protected**: anonymous requests get 302 to the Vercel login. Authenticated `vercel curl` returned 200 on /, /pricing, /demo and /contact, and 404 on an unknown route. To review, sign in to Vercel as a member of `neel-s-projects9`, then open the URL. Production and betterdesk.ai were not touched.
**Known failing test:** `reduced motion: hero shows the finished scene immediately`. It fails in one engine per run (Chromium once, WebKit twice), even with `animation: none` under reduce. Root cause is not yet identified. The test was not disabled.

## Cycle 2 (2026-11-06, evening)
**Flaky test, root cause:** Playwright's `toBeVisible` counts opacity 0 as visible, and WebKit sometimes applies the reduced-motion emulation one frame after first style resolution. A probe confirmed opacity 1 and `animation: none` in both engines on every run. The test now waits up to 500ms for opacity 1. That still proves the card is "immediate" against the 3.1s animated arrival. 12 of 12 repeat runs passed.

**Changed (from REVIEW_PASS02 and then REVIEW_PASS05):**
- Hero: the conversation pane is now the lit focal object (`.nd-focal`, with a lamp edge on its upper left). The schedule is compact and the column is wider, so "Thu · 8:00–10:00 AM" stays on one line. The "Holding" placeholder fades as the card lands, with no blur. Mobile: CTAs stack, the call node is 60px, and the number and time sit on separate lines.
- Walkthrough: a designed first state (ringing call) replaces the blank phone. The homepage instance autoplays once at 55% in view, unless reduced motion is set. The bezel is now graphite, the status chip uses sans, the sample label sits under the device, and the tabs are masked. The scrollable log is keyboard-focusable (axe).
- Set piece D, ROI: a new unit chart with one mark per unanswered inquiry in a month. Marks are nested: booked (amber fill) ⊂ reached (pearl ring) ⊂ all (stone dot). A bracket shows how many bookings cover the plan. There's a hover readout, an eased headline number, and an sr-only live summary. The palette was checked with the dataviz validator (CVD ΔE 14.3, normal 15.3, contrast ≥3:1; the categorical lightness and chroma checks are N/A for an ordinal, shape-encoded state). The calculator now lifts into the night band.
- Subpages: the pricing hero has an itemised plan receipt (published plan copy only). How-it-works has a setup-call agenda. The platform explorer and ROI calculator overlap the night band. Pricing cards dropped the mono captions, and the featured plan is lit graphite.
- Homepage: the Control/ModeSwitcher section moved to /platform. The story has tighter steps (40svh) and a 27rem stage. The night→pearl transition is now a longer feathered ramp.
- Close (`CtaBand`, site-wide): first light. A graphite-to-dawn ground with a lamp horizon line and a "This morning" owner inbox card, which replaces the repeated Dana booking on beige.
- Mobile sticky CTA: an opaque night bar, "From $149/mo".
- OG image redrawn in the new identity (screenshots/pass-03/og.png).

**Screenshots:** pass-03, pass-04, pass-05, pass-06. Each loop was captured, critiqued and fixed before the next.
**Independent review:** REVIEW_PASS05.md gave a narrow REJECT: hero 8, typography 8, product demo 8, rhythm 5. Its top 5 were addressed in pass-06 except #4 (a full-bleed "two endings" peak and collapsing the lower cream run), which remains open.
**Tests (pass-06 build):** typecheck ✓, lint ✓, unit ✓, build ✓. Playwright **80/80** (Chromium + WebKit, axe on every route at 390 and 1440).
**Lighthouse mobile (local prod, simulated slow 4G), /, pass-05 build:** performance 92, accessibility 96, LCP 3.3 s, TBT 30 ms, CLS 0, FCP 1.1 s. LCP is still above the 2.5 s target, the same as the baseline (3.0–3.3 s).

## Next highest-impact (cycle 3)
1. Page rhythm (reviewer #4): turn "Same call. Two endings." into a full-bleed peak and compress "Built for", pricing and FAQ into one composed lower movement.
2. Demo and contact hero artifacts. Solutions pages are still the old body layout.
3. Find the Lighthouse a11y 96 item. Cut mobile LCP (the headline is the likely LCP element; check font swap timing).
4. Shorten the mobile page (about 13,000 CSS px at 390).
5. DESIGN.md via the Impeccable documenter, plus an Impeccable finish review.

## Cycle 3 (2026-11-06, night)
**Changed (from REVIEW_PASS05 #2, #5, #7, #8, #10 and its rhythm score):**
- **Peak** (`components/TwoEndings.tsx`): a full-bleed night/pearl split after the story. Without: 6:44, "The job goes to whoever picked up." With: 6:47, "Booked for Thursday, 8–10 AM." The minute-by-minute lists come from `lib/sample.ts`. The walkthrough heading became "Now step through it yourself."
- **Trust strip** (home pricing and /pricing). Only existing claims: approved answers only, people for the hard ones, start supervised, no lock-in. Nothing invented (no consent policy, integrations or quotes; those need the founder).
- **/pricing hero**: `PlanPicker`, an accessible radiogroup with a shared-layout knob (Starter/Growth/Scale). The total updates live, with a break-even line at the ROI calculator's $250 example job that links to /roi.
- **/contact**: a night band. The agenda sits on the left and the pearl form card on the right (new `.on-pearl` token scope). Selects are now `appearance-none` with a drawn chevron, so they match the 48px inputs in WebKit.
- **Solutions pages**: a night hero. A "Your rules, in plain English" card is the hero artifact, and the chips moved to the lower aside. The mono 01/02 markers became numbered rings.
- **/demo**: the walkthrough overlaps the night band.
- **PageHero**: asides centre-align with the headline.
- **Performance root cause:** the SVG `feTurbulence` grain tiles caused intermittent 1.2–2.3 s "Unattributable" long tasks (TBT swung from 30 to 2,260 ms across identical runs). Grain retired. After: TBT 20–60 ms across 7 runs, longest task ≤155 ms.
- A hero bubble timestamp was darkened (Lighthouse sampled it mid-fade at 2.1:1).

**Evidence:** screenshots pass-07, pass-08, pass-09 and their `-sections` folders (new `scripts/capture-sections.mjs`). Lighthouse JSON is in `docs/quality-v2/perf/`.
**Lighthouse mobile (simulated slow 4G, local prod):** home perf 92–93 (runs 4–10), a11y 96–100 (it varies because Lighthouse samples hero frames mid-animation), LCP 3.2–3.3 s, TBT 20–60 ms, CLS 0. /pricing: 93 / 100. /demo: 80 / 100 (TBT 510 ms; the three-scenario walkthrough is the next performance lead). I tried `font-display: optional`; LCP did not move (it is bound by the lab's critical-chain model), so I reverted to `swap`.
**Tests:** typecheck ✓, lint ✓, unit 4/4 ✓, build ✓, Playwright 80/80 (Chromium + WebKit, axe on every route).
**Impeccable:** direction contract written to `.impeccable/surfaces/app-page-tsx.md` (all 6 blocks + seed + FINISH). Detector: no findings. Finish reviewer dispatched (IMPECCABLE_FINISH_REVIEW.md).
**Preview:** https://betterdesk-redesign-6ksoo810u-neel-s-projects9.vercel.app (Ready, commit 1dff70b, protected). Signed in, 200 on all 10 routes and 404 on unknown.

### Cycle 3 continued: Impeccable finish review (two fix rounds, the unattended ceiling)
- **Round 0 review** (IMPECCABLE_FINISH_REVIEW.md), disposition **fix**. 8 material fixes: seed record, close overflow at 390, eyebrow ban, mono as costume, glyph icons, nav translucency, state/spacing, honest legal/SMS placeholders. Ceiling notes: brightening arc, lighting, hero depth, mark motif, close repetition, equal-column scaffolds, empty subpage stages.
- **Round 1 fixes:** all 8 addressed, plus the story ground now warms across the steps and pearl shadows are longer and lamp-consistent. Verdict: 3 resolved, 5 partial, 1 regression (a hard seam between the warmed story floor and the peak).
- **Round 2 fixes:** honest seed token; eyebrows removed on solutions and contact; walkthrough meta set in sans; HeroScene glyph removed; seam removed (the peak starts at the warmed floor). Two real bugs found along the way: the **sticky CTA** and the **story stage** both depended on crossing-only IntersectionObservers, so a fast jump or a mid-page reload left them wrong (the bar covered the footer, and the stage showed "Call" beside step 5). Both now derive their state from scroll position. Verdict: 6 resolved, plus 2 items not closable here.
- **Post-verdict defect** spotted by the reviewer and fixed: the ModeSwitcher customer bubble and Approve pill were invisible on /platform. They were pearl surfaces with token ink that flips light inside the night scope; I caused this in cycle 2 when I removed the `--color-card` remap. Both states were captured (pass-11-sections/modeswitcher-*). Axe did not catch it; that is a test gap to look at.
- **Still open from the review:** (1) the concept roll was never run, which needs the impeccable CLI or the founder accepting the brief-pinned direction; (2) the ceiling items: lamp lighting strength, hero depth/overlap, the mark as a story motif, the close repeating the step-5 inbox rows, the equal-column triptych and trust strip, and empty right halves on the platform and roi night heroes.
- **Incident (contained):** one `surface-brief write` ran in an unsandboxed shell where `$TMPDIR` points elsewhere, and it picked up another session's brief.md. It overwrote only this repo's `.impeccable/surfaces/app-page-tsx.md`, which I restored from the original text and verified (no foreign content). Temp files for that tool now use a unique name inside the sandboxed temp dir.
- **Tests at f0d7651:** typecheck ✓, lint ✓, unit 4/4 ✓, build ✓, Playwright 80/80 (Chromium + WebKit, axe on every route).
- **Preview:** https://betterdesk-redesign-l3hf3qstx-neel-s-projects9.vercel.app (Ready, f0d7651, protected). Signed in, 200 on all 10 routes and 404 on unknown.

## Next highest-impact (cycle 4)
1. Lighting pass (ceiling b): readable lamp-edge specular on stage panes, longer cast shadows on the hero booking card, and the booking card physically overlapping the conversation pane (c).
2. Close: replace the step-5 inbox duplicate with a new morning artifact, such as the weekly summary (Growth+) or the confirmed Thursday route (e).
3. Replace the moments triptych with a single timeline object; turn the trust strip into one composed statement (f).
4. Platform and ROI night heroes: put an artifact in the empty right halves (g).
5. /demo TBT 510 ms: lazy-mount the non-default scenarios.
6. Add an axe or contrast check that drives the ModeSwitcher through all three states.
- **DESIGN.md + .impeccable/design.json** written by the Impeccable documenter from the shipped code (it records the code where ART_DIRECTION.md drifted). It flagged a likely invisible mobile-menu "Book a demo" button (pearl on pearl inside the night header). I confirmed it in source and fixed it (verified: pass-11-sections/mobile-menu-390.png), removed the menu's 01–06 index numerals, folded the 404 kicker into its h1, and set an explorer phrase in sans instead of mono. Its remaining low-severity leftovers (hidden grain divs, an unused Button "resolve" variant, untokenized night text hexes, stale comments) are listed in its report and queued for cleanup.
**Final preview (cycle 3):** https://betterdesk-redesign-jgw506r02-neel-s-projects9.vercel.app (Ready, commit a7368cb, protected). Signed in, 200 on all 10 routes and 404 on unknown. Playwright 80/80 at this build.

## Cycle 4 (2026-11-06, late night)
**Changed (the cycle-3 next list, then REVIEW_PASS12):**
- **Hero depth and lighting:** the Thursday schedule is now a framed calendar tucked behind the conversation pane, and the pearl booking card settles on top of both, overhanging only the pane's padding. Stage panes carry a lamp specular (upper left, falling off). The focal pane rim is stronger. The lamp falloff on the ground is brighter but stays on the surface.
- **The mark as motif:** the story rail's terminal "Inbox" node becomes the BetterDesk mark once reached.
- **Day ribbon** (`components/DayRibbon.tsx`): a single 6 AM–midnight object with sample office hours and "After close". The three moments are plotted at their real times and tethered to their notes. This replaces the three-column triptych. Mobile reads as a list.
- **Trust:** one composed sentence (two marks) instead of four equal tiles. It uses only existing claims.
- **Close:** "Thursday · Marco's route". The 8:00 slot that was empty at closing is booked ("Booked by text last night at 6:47 PM"). This replaces the duplicate of the step-5 inbox.
- **Subpage heroes:** /platform has a channel board (plan gating from `lib/sample.ts` CHANNELS) into "One inbox". /roi works the default formula through on a pearl card (`ROI_DEFAULTS` now lives in `lib/roi.ts`, shared with the calculator).
- **Walkthrough (home):** it opens on the finished thread (`startAtEnd`; Replay walks it from step 1). It is presented as a solid pearl device on a lit night stage, which removes the cream plateau mid-page. /demo still opens on step 1 (tested).
- **Footer** is graphite. Hero microcopy is brightened.
- **Cleanup:** removed the hidden grain divs, the retired grain CSS and the unused Button "resolve" variant.
- **New regression test:** "reply-mode switcher: every text node meets contrast in all three modes". It normalises colours through a canvas, because Tailwind v4 opacity modifiers compute to `oklab()`, and it composites text alpha. **Proven:** with the original pearl-on-pearl bubble reintroduced it fails at 1.01:1, and restored it passes.

**Screenshots:** pass-12, pass-13 and their -sections folders (day-ribbon, close, walkthrough, modeswitcher, and so on).
**Independent scored review** (REVIEW_PASS12.md, on pass-12): narrow REJECT. Scores rose against pass-05: originality 8 (7), hero 9 (8), art direction 8 (7), product demo 8 (8), motion 7 (6), typography 9 (8), clarity 9 (8), rhythm 7 (5), copy 8 (8), mobile 7 (7), conversion/trust 6 (6). It puts the site at about 92% of the Sayable bar. Its fixes #1 (blank walkthrough), #2 (cream plateau) and part of #5 (graphite footer, brighter microcopy, fewer underlines) landed in pass-13. **Not yet re-reviewed.**
**Tests at 186949c:** typecheck ✓, lint ✓, unit 4/4 ✓, build ✓, Playwright **82/82** (Chromium + WebKit; axe on every route plus the new contrast test).
**Lighthouse mobile (local prod):** home perf 92, a11y 96 (mid-animation sampling); /platform 92 / 100. LCP 3.3 s, TBT 30–40 ms, CLS 0.
**Preview:** https://betterdesk-redesign-pqkunzhdh-neel-s-projects9.vercel.app (Ready, 186949c, protected). Signed in, 200 on all 10 routes and 404 on unknown.

## Next (cycle 5)
1. A real contact submission (REVIEW_PASS12 #4). This needs a founder decision on a form or email backend through the Vercel Marketplace, so the mailto composer stays honest until then.
2. Replace the "Built for" card pair and the pricing trio on the homepage with one bespoke strip, or reuse the plan picker (REVIEW_PASS12 #3).
3. Story step spacing at about 60vh, plus a full re-review of pass-13 by a fresh reviewer.
4. /demo TBT (510 ms): lazy-mount the non-default scenarios.
5. Mobile LCP of 3.3 s in the lab.
