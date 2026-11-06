# STATUS (updated 2026-11-06 ~02:50 PST)

## Done
- Repo reality check: no original BetterDesk repo on this machine; this workspace is the build target. betterdesk.ai is NOT in Vercel team `neel-s-projects9` (served via Cloudflare) → **production domain deploy is blocked**; deliver to a separate Vercel project.
- Baseline captured: `BASELINE.md`, `baseline-live-homepage-text.txt`, `screenshots/baseline/`.
- `CLAIMS_AUDIT.md`, `PLAN.md`, `INSPIRATION.md` written.
- Next.js 16.4 + React 19 + Tailwind 4 + Motion 14 app built from scratch. Fonts self-hosted (Newsreader, Geist, Geist Mono) because build-time Google Fonts fetch fails behind the sandbox proxy.
- Routes: `/`, `/platform`, `/how-it-works`, `/demo`, `/pricing`, `/roi`, `/solutions`, `/solutions/home-services`, `/solutions/beauty-wellness`, `/contact`, 404, sitemap, robots, icon, OG image.
- Interactions: hero scene (CSS sequence, pause/replay), LeadJourney (3 scenarios, with/without, play/pause/step, arrow keys), ProductExplorer (views × channel filter, approve draft, calendar), ModeSwitcher, RoiCalculator (unit-tested math), ContactForm (validated mailto composer, honest fallback).
- `npm run typecheck`, `npm run lint` (0 errors), `npm test` (4/4), `next build` all pass.

## Environment notes for resume
- Chromium must run with the sandbox disabled (mach-port error otherwise). Playwright browser download is blocked; `scripts/shoot.mjs` uses cached `~/Library/Caches/ms-playwright/chromium_headless_shell-1248`. WebKit is NOT available.
- Port 3100 is used by another project; local server for this site runs on **3917** (`npx next start -p 3917`).
- npm needs `npm_config_cache=$TMPDIR/npm-cache`.
- `vercel` CLI needs the sandbox disabled (Node fetch ignores proxy).

## Next 3 actions
1. Visual polish pass on every page (390/1440), fix issues, redeploy with `vercel deploy --prod` to the new project only.
2. Lighthouse/perf measurement; a11y contrast check; HANDOFF.md.
3. Visual polish pass on each subpage at 390/1440 (screenshots in `screenshots/r2+`).

## Live URL
- **https://betterdesk-redesign.vercel.app** (Vercel project `betterdesk-redesign`, `prj_huXJszKZP8QZbkl9ncUSshS8B9DN`, team `neel-s-projects9`). Public: anonymous curl returns 200 on all routes, 404 on unknown.
- Per-deployment URLs (e.g. `betterdesk-redesign-j4yblr94r-neel-s-projects9.vercel.app`) are behind Vercel Authentication (302). Share the project alias above.
- First deploy `dpl_DaYrnbGTmcNB219wayLCP3REhw5s` (02:55 PST) was auto-assigned production of the NEW project. betterdesk.ai is untouched.
- e2e: 18/18 pass against local and against the live URL (Chromium).
