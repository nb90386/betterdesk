# QA results (Apple Design round)

Environment: Node 26.12, Next 16.4.5 production build, Playwright 1.65 (Chromium headless shell 1248, WebKit 2388), Lighthouse 12.8.2 mobile emulation. Preview: dpl_Fp4xUUWthr2ZaMsikeMqkPKjhgui.

| Check | Result |
|---|---|
| Typecheck, lint, build | PASS |
| Unit (`npm test`) | 46/46 |
| E2E + axe, Chromium + WebKit | 199 passed, 1 skipped (query-string scroll case skips when the list fits the viewport) |
| **Navigation lands at the top** (`tests/e2e/navigation-scroll.spec.ts`): header, product menu, footer, pricing buttons, product CTA, mobile menu, phone footer, reduced motion; hash below header; Back restores; Forward to top; keyboard; query-only no jump | PASS both engines; frame-sampled (no frame of the new page >40px from top) |
| Nav root cause | Not reproducible on current build in either engine, desktop/phone, unthrottled or 6x CPU + slow network. Likely source: V4's pinned useScroll story with smooth scrollTo (removed). Hardened: mobile-sheet scroll lock released before the new route commits; doubled hash offset fixed |
| break-ui worst-case data, 390 + 1440, both engines | PASS after fixing pipeline overflow |
| Workspace never widens the page (9 routes × 2 widths) | PASS |
| Pricing estimator math | PASS |
| Lighthouse mobile perf / a11y / BP / SEO | home 93/100/100/66 (LCP 3.3s), presence 93 (3.3s), scout 94 (3.1s), demo 94 (3.1s, CLS 0, was 0.657), pricing 96 (2.8s). SEO 66 = deliberate preview noindex |
| LCP ≤ 2.5s mobile | **FAIL** (lab, simulated throttle). The serif display font adds a second preloaded webfont; LCP element is the headline/lede |
| Motion frame probe 4x CPU | climb 1/73 frames >20ms; popover 0/73 |
| Preview: all 20 public routes, app, OG, icon, sitemap, robots 200; /nope 404; 4 redirects 308; review API `delivery_not_configured`; Presence SSRF `blocked_url`; both fonts preloaded and served | PASS (`docs/v4/PREVIEW_CHECK.txt`) |
| Real iPhone / real Safari hardware | NOT RUN (emulation only) |
| Field Core Web Vitals / INP | NOT AVAILABLE (no traffic) |
