# STATUS (updated 2026-11-06 ~03:35 PST)

## Where things stand
- **Public URL (older build, commit 84e7eaa):** https://betterdesk-redesign.vercel.app. Anonymous 200.
- **Latest preview (commit 8975b07, behind Vercel login):** https://betterdesk-redesign-ab2adbvbq-neel-s-projects9.vercel.app (`vercel curl` shows 200 on all 13 routes, 404 on unknown).
- Production deploys (`--prod`), even to the new project, are not permitted in this unattended session. The founder can make HEAD public with `vercel deploy --prod --scope neel-s-projects9` (see HANDOFF.md).
- betterdesk.ai untouched: not in this Vercel team; Cloudflare DNS.

## Done
- Discovery, baseline, claims audit, plan, inspiration notes (docs/redesign/*).
- 10 routes + 404/sitemap/robots/icon/OG. Interactions: hero sequence, lead journey (3 scenarios), product explorer, reply-mode switcher, ROI calculator, contact mailto composer.
- Perf: removed blend-mode overlay (home TBT 4.4 s → 60–100 ms); Newsreader instanced (279 → 120 KB). Lighthouse mobile lab: perf 91–93, a11y 100 (98 → fixed heading order), BP 100, SEO 100; LCP 3.2–3.5 s (above 2.5 s target), CLS ≤ 0.026.
- A11y: axe WCAG 2.2 AA clean on all routes at 390/1440; contrast tokens darkened; inert page behind mobile menu.
- Independent red-team (reality-checker agent): 15 issues, all addressed (see CLAIMS_AUDIT.md, final section).
- Tests: typecheck ✓, lint ✓, unit 4/4, Playwright 76/76 (Chromium + WebKit).

## Environment notes for resume
- Chromium/WebKit/Lighthouse/vercel must run with the sandbox disabled. WebKit is in `.pw-browsers/` (gitignored, lint-ignored, vercelignored). Chromium is the cached 1248 build.
- Port 3100 belongs to another project; this site runs on **3917**.
- npm needs `npm_config_cache=$TMPDIR/npm-cache`.

## Next 3 actions
1. Mobile hero: bring the scene closer to the fold at 390 px.
2. Final screenshot contact sheet (before/after) in screenshots/final.
3. Finalize HANDOFF.md; rerun all gates; redeploy preview.
