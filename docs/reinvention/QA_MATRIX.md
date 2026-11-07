# QA matrix

Environment: macOS, Node 26.12.0, Next 16.4.5 production build (`next build` + `next start`), Playwright 1.65 (Chromium headless shell 1248, WebKit 2388), axe-core 4.14, Lighthouse 12.8.2 (mobile emulation, simulated throttling). Preview: Vercel, target preview. Date 2026-11-07. Final code commit: see FINAL_REPORT.md.

| Check | Result | Command | Evidence |
|---|---|---|---|
| Typecheck | PASS | `npx tsc --noEmit` | clean |
| Lint | PASS | `npm run lint` | clean |
| Unit tests | PASS 46/46 | `npm test` | workspace, lead validation, Presence engine (SSRF guard, robots, HTML, analyzer), prepared sample |
| Production build | PASS | `next build` | all marketing routes static; 2 dynamic APIs |
| E2E + a11y, Chromium + WebKit | PASS 168/168 | `BASE_URL=… npx playwright test` | `tests/e2e/site.spec.ts`, `app.spec.ts`, `a11y.spec.ts` |
| Every public route: 200, one h1, title, description, canonical, General Sans on h1 | PASS | e2e | 13 routes × 2 engines |
| No horizontal overflow 320/390/768/1024/1440/1920 | PASS | e2e | after fixes in 2add662 |
| No console/network errors | PASS | e2e + `scripts/console.mjs` | WebKit hydration bug (#418, ICU date strings) found and fixed via `lib/format.ts` |
| No text pills (DOM measurement on every route) | PASS | e2e "no text pills" | 0 elements; V4 had 19 `rounded-full` uses incl. pills |
| Internal links resolve; every route linked | PASS | e2e | |
| Sitemap = public routes; /app excluded; preview robots Disallow / | PASS | e2e + preview curl | `docs/reinvention/preview-api-check.txt` |
| 404 page | PASS | e2e + preview (`/nope` 404) | |
| Popover: opens from trigger, Esc closes, focus returns | PASS | e2e | recording `recordings/product-popover-1440.webm` |
| Mobile menu: open, navigate, Esc | PASS | e2e | |
| axe WCAG 2.2 AA, 21 routes × 390/1440 × 2 engines | PASS | `a11y.spec.ts` | fixed: scrollable regions focusable, heading order |
| Manual a11y: keyboard through header, popover, review form, demo, explorer | PASS (spot check) | Playwright keyboard + screenshots | `screenshots/r3/state-contact-focus-1440.png` |
| Reduced motion: board static with step controls, no hydration errors | PASS | e2e | |
| No-JS homepage still explains the product | PASS | e2e | |
| Review form: step validation, focus to first error, truthful "not connected" state with mailto fallback | PASS | e2e | |
| Review API abuse: 415 wrong type, 400 bot timing/honeypot, 422 invalid, 429 rate limit | PASS | e2e + curl (429 observed) | |
| Review delivery end to end | PASS (local receiver) / **BLOCKED on preview** | local webhook on 127.0.0.1 with test switch | `delivery-test-received.jsonl` (1 delivery, idempotent duplicate); preview returns 503 `delivery_not_configured` until `LEAD_WEBHOOK_URL` is set |
| Presence SSRF: loopback, metadata IP, localhost, [::1], decimal IP refused | PASS | e2e + preview | preview: 169.254.169.254 → 422 blocked_url |
| Presence live audit on Vercel | PASS | preview curl | example.com: 1 page, 13 findings, 6 passes |
| Guided demo end to end on shared store, then opens the record in /app, reset | PASS | e2e + `scripts/demo-flow.mjs` | `recordings/demo-handoff-1440.webm` |
| Lighthouse mobile home | 94 / 100 / 100 / 66 SEO, LCP 3.0 s, CLS 0, TBT 40 ms | lighthouse | `perf/lh-home-mobile.json` |
| Lighthouse mobile presence / pricing | 94 / 97 perf, LCP 3.1 / 2.5 s, CLS 0 | lighthouse | `perf/` |
| Lighthouse desktop home | 100 / 100 / 100 / 66, LCP 0.6 s | lighthouse | `perf/lh-home-desktop.json` |
| **Lighthouse mobile /demo** | **FAIL: perf 73, CLS 0.657** | lighthouse + layout-shift observer | open: the demo grid is recorded moving at hydration; two fixes (reserved height) did not remove it |
| **Mobile LCP ≤ 2.5 s** | **FAIL on home (3.0 s) and presence (3.1 s)** under simulated throttling; lab only, no field data | lighthouse | LCP element is the lede paragraph; CSS inlining tried and reverted (worse) |
| SEO score 66 | EXPECTED | lighthouse | `noindex` on non-production builds by design; production config indexes public routes |
| Hallmark sloplint static | 9 FAIL (explained) / 23 WARN | `sloplint.mjs app components` | stamp gate + required OG/icon literals; WARN = long h1/ledes |
| Cross-tenant / auth tests | N/A | | no backend or accounts exist (documented) |
| INP field data | NOT AVAILABLE | | no real traffic |
