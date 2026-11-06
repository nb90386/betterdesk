# STATUS (updated 2026-11-06 03:35 PST)

## Where things stand
- **Public URL (older build, commit 84e7eaa, 02:55 PST):** https://betterdesk-redesign.vercel.app. Anonymous 200, indexable, canonicals point at https://betterdesk.ai.
- **Latest preview (HEAD, behind Vercel login):** https://betterdesk-redesign-fi9sr8h14-neel-s-projects9.vercel.app. `vercel curl`: 200 on all 13 routes, 404 on unknown.
- **Blocked:** this unattended session can't run `vercel deploy --prod`, even for the new project. The founder runs one command to publish HEAD (see HANDOFF.md).
- **betterdesk.ai is untouched.** It isn't in this Vercel team, and its DNS points at Cloudflare.

## Verified at HEAD
- typecheck ✓ · lint ✓ (0 problems) · unit 4/4 ✓ · `next build` ✓ (local and Vercel)
- Playwright **80/80**: 40 tests × Chromium (cached 1248) and WebKit (2388). Covers: routes, metadata, overflow on direct load at 320/375/390/768/1024/1440/1920, all internal links, 404, mobile menu, sticky CTA, lead journey, explorer, ROI, contact, reduced motion, and axe WCAG 2.2 AA on every route at 390 and 1440.
- Lighthouse mobile lab (local prod server): perf 92–95, a11y 100, best practices 100, SEO 100 on /, /demo, /pricing, /platform and /solutions/home-services. Simulated slow-4G LCP 3.0–3.3 s, observed unthrottled LCP 0.29 s, TBT 40–110 ms, CLS ≤ 0.002.
- Firefox: **not tested.** It downloads but won't launch here ("Could not find profile folder").

## History of this session
1. Baseline, claims audit, plan → Next.js 16 site, 10 routes, 6 interactions.
2. Perf/a11y: blend-mode overlay removed (TBT 4.4 s → 0.1 s), display font instanced then made roman-only, contrast tokens, heading order.
3. Independent claims red-team: 15 issues fixed (invented privacy/overage/telephony statements, sample-only features, plan copy restored word for word).
4. Impeccable critique: detector plus an isolated design review. Numbered kickers became thread marks, italic display emphasis was removed, "booked" got a thread underline, the problem section became a ledger, "What's inside" was cut to four jobs, and a sticky mobile CTA and a green closing CTA were added.
5. Fixed a real overflow bug on /pricing at ≤390 px; the test now reloads per width.

## Environment notes for resume
- Chromium, WebKit, Lighthouse and `vercel` must run with the sandbox disabled. Browsers live in `.pw-browsers/` (ignored by git, ESLint and Vercel).
- Port 3100 belongs to another project; this site runs on **3917**. Rebuild **then** restart `next start`; rebuilding under a running server serves stale CSS hashes.
- npm needs `npm_config_cache=$TMPDIR/npm-cache`.

## Next actions (founder)
1. Publish HEAD: `vercel deploy --prod --scope neel-s-projects9`.
2. Provide a privacy policy and terms, or approve drafting from real practices, before sending real traffic.
3. Decide on real demo delivery (a scheduling link or a form backend with credentials) to replace the mailto composer.
