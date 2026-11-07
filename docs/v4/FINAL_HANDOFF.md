# Final handoff (Apple Design round)

## Preview
- **URL:** https://betterdesk-redesign-7vzxjtu12-neel-s-projects9.vercel.app
- **Deployment:** dpl_9i71vfUW6AD77H4xJh8YByDX39zf, Ready, target preview, team `neel-s-projects9`, project `betterdesk-redesign`.
- **Protection:** sign in to Vercel as a team member (unauthenticated requests get 302).
- **Production:** untouched. No `--prod`, domain, DNS, billing or env change.

## Git
- **Branch:** `feat/betterdesk-signature-presence-rebuild`
- **Deployed code:** `7363032`. Docs come after it.
- **Rollback:**
  - previous preview code: `839ceb8`;
  - V4: `cb79932`.
- **History:** all earlier branches are untouched.

## What changed this round
- **Navigation (release blocker):**
  - the bug doesn't reproduce on the current build;
  - the scroll lock is hardened;
  - a frame-sampled regression suite now runs in both engines.
- **Brand:**
  - Sentient serif display with General Sans text;
  - new D-swing mark, replaced everywhere.
- **Motion:**
  - interruptible critically damped springs, from the apple-design skill;
  - all 22 findings from an independent review fixed;
  - reduced-motion, reduced-transparency and contrast fallbacks;
  - mobile baseline.
- **Product:**
  - Scout list → evidence + editable draft;
  - pricing estimator;
  - guided demo handoff fixed;
  - prepared sample shared by `/demo` and `/app`.
- **IA:**
  - `/product/*` with redirects;
  - Solutions menu;
  - `/integrations`, `/about`, `/solutions/b2b-services`, `/privacy` (draft);
  - four sourced guides;
  - comparison and objections on the home page.

## Evidence
- **Screenshots:** `docs/v4/screenshots/apple/final` (95 captures).
- **Cycles 1 to 3:** `c1-*` captures and the filmstrip.
- **Recordings:** `docs/v4/recordings/*.webm`.
- **Earlier evidence:**
  - V4 → this branch contact sheet: `docs/reinvention/CONTACT_SHEET.html`;
  - type and logo comparisons: `docs/reinvention/screenshots/type/hero-compare.png`, `logo-board-r2.png`.

## Truth table
| Area | Status |
|---|---|
| Presence live audit | BETA (verified on Vercel) |
| Sample audit | LIVE |
| Scout, Desk, demo, workspace | DEMO, sample data in the browser |
| Lead delivery | BLOCKED until `LEAD_WEBHOOK_URL` is set (delivery proven locally) |
| Sending, mailbox, calendar, Search Console, Business Profile, accounts, billing | PLANNED |

## Remaining limitations
1. Mobile LCP is 2.8 to 3.3 s in the lab (target 2.5 s); the second webfont costs time.
2. There has been no real-device iPhone test.
3. The reference-site study was never captured.
4. Trademark clearance has not been done.
5. Privacy and terms need legal review.
6. All design judgements are self-assessed or come from AI critics. Founder review is the real gate.
