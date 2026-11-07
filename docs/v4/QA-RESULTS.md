# V4 QA results

All runs below are on a local production build (`next build && next start`, port 3932) on 2026-11-07, at commit `ffc55bc` or later.

## Ran and passed
- **`tsc --noEmit`:** clean.
- **`eslint .`:** clean.
- **Unit tests** (`node --test tests/unit/*.test.ts`): **16/16.** They cover:
  - CSV parsing and formula neutralisation, import, and duplicate skipping;
  - the untrusted-note guard;
  - qualification tiers and unknowns;
  - drafts only to business contacts;
  - suppression blocking and withdrawal;
  - person-only approval, which doesn't send;
  - the compliance check blocking a deceptive edit;
  - canceled runs producing no effects;
  - provider failure blocking a run with a retry;
  - invalid state transitions;
  - the simulated delivery, reply and booking chain, with timeline coherence;
  - unsubscribe auto-suppression across runs;
  - an inbound inquiry joining an existing account;
  - reply classification;
  - Scout being unable to move stages;
  - Scout never regressing an advanced deal.
- **Playwright e2e: 130/130** (65 Chromium + 65 WebKit). They cover:
  - all 9 marketing routes: status, one h1, metadata, canonical, no console errors, and no overflow at 320, 375, 390, 768, 1024, 1440 and 1920;
  - every internal link resolving, the 404 page, and retired-route redirects;
  - the mobile menu, including Escape and focus return;
  - all 9 app routes rendering without errors;
  - the full workflow, end to end in the UI;
  - the honesty check and Reset sample;
  - cancel and the unavailable-provider error;
  - a malformed CSV upload;
  - the suppression list blocking replies;
  - an inbound inquiry;
  - contact form validation and the mailto it composes;
  - the pricing proposal labels;
  - reduced motion with no hydration errors;
  - the homepage with JavaScript disabled;
  - the header tone.
- **axe-core WCAG 2.2 AA:** 16 routes at 390 and 1440, including 7 app screens, with no violations, in both engines.
- **Browser tour** (`scripts/v4-app-tour.mjs`) at 1440 and 390: no console errors.
- **Screenshots:** `screenshots/final/` (the site at 320 to 1920, journey frames mid-scroll, WebKit) and `screenshots/final/app/`.

## Lighthouse 12.8.2
These are local lab runs (single runs, simulated throttling on mobile), not field data. INP was not measured.

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| / mobile | 94 | 100 | 100 | 100 | **3.0 s** | 0 | 30 ms |
| / desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| /app mobile | 97 | 100 | 100 | 66* | 2.5 s | 0 | 60 ms |
| /pricing mobile | 98 | 100 | 100 | 100 | 2.4 s | 0 | 60 ms |

\* `/app` is deliberately `noindex`.

The homepage's mobile LCP is the hero lede paragraph (text), at 3.0 s. That misses the 2.5 s target.

## Not run, or blocked
- **Firefox:** not run.
- **Manual testing:** no real-device touch, trackpad or screen-reader pass.
- **Blocked, because no backend exists:**
  - cross-tenant access;
  - expired sessions;
  - webhook signatures;
  - rate limits;
  - duplicate external sends (idempotency is designed in `schema.sql`);
  - real email and calendar delivery.
