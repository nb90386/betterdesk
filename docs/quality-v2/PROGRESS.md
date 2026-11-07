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
