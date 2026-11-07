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
