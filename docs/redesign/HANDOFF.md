# BetterDesk redesign · handoff

_Last updated: see STATUS.md timestamp. Fill-in markers are removed only once verified._

## URLs (real, checked)
- **Public:** https://betterdesk-redesign.vercel.app (alias of the new project's production deployment). Anonymous `curl` returns 200 on every route and 404 on unknown paths. **It still serves the first build (commit `84e7eaa`, 02:55 PST)**; see "Making the latest build public" below.
- **Latest build (preview, behind Vercel login):** see STATUS.md "Latest preview". Verified with `vercel curl`.
- **betterdesk.ai was not changed.** The domain is not in Vercel team `neel-s-projects9` (`vercel domains inspect betterdesk.ai` → not found) and DNS points at Cloudflare. No original BetterDesk repo exists on this machine. Both preconditions for a production cut-over failed, so production was held.

## Making the latest build public (one command, needs your approval)
The unattended session isn't permitted to run production deploys, even to the new project. From the repo root:
```bash
vercel deploy --prod --scope neel-s-projects9      # builds HEAD and moves betterdesk-redesign.vercel.app to it
# or promote the already-built preview:
vercel promote <latest preview URL from STATUS.md> --scope neel-s-projects9
```
Rollback: `vercel rollback dpl_DaYrnbGTmcNB219wayLCP3REhw5s --scope neel-s-projects9` (the first deployment).

To move betterdesk.ai onto this site later, whoever controls the Cloudflare DNS and the current host has to add the domain to the `betterdesk-redesign` project (`vercel domains add betterdesk.ai`), then update DNS. Set `NEXT_PUBLIC_SITE_URL` only if the canonical domain should be something other than https://betterdesk.ai (the current default for canonicals, sitemap and OG).

## Pages
`/`, `/platform`, `/how-it-works`, `/demo`, `/pricing`, `/roi`, `/solutions`, `/solutions/home-services`, `/solutions/beauty-wellness`, `/contact`, a custom 404, plus `sitemap.xml`, `robots.txt`, favicon and a generated OG image. No link points to an unbuilt route (tested).

## What's different
1. **Positioning:** "Missed calls become booked appointments." replaces "The AI front desk that never misses revenue." AI is the method, not the headline. The voice addresses an owner whose hands are full, not a software buyer.
2. **One visual signature, "the through-line":** a frayed vermilion thread (the unanswered moment) resolves into calm desk-green (handled). It runs through the hero, the five-step diagram, the setup timeline and the closing band.
3. **Hero built from product fragments:** missed call → text thread → offered times → booking → morning recap, connected by the thread. It is CSS-animated, so it renders fully without JavaScript, and has pause and replay controls.
4. **Honest numbers:** the only figures on the site are published prices, inputs you type, and labeled sample data. Every unsupported stat from the old site was removed (see CLAIMS_AUDIT.md).
5. **"Where it stops" boundaries** on the platform page, and explicit "what's real / what's sample / what depends on you" notes on the demo.
6. **Editorial type system:** Newsreader display (static opsz-72 instance), Geist UI, Geist Mono for data. All self-hosted.
7. **Real IA:** separate, interlinked pages instead of one long scroll of anchors.

## Interactions
| Interaction | Status |
|---|---|
| Lead journey (`/demo`, home, solution pages): 3 scenarios, With/Without, play/pause/step, ← → keys | Implemented. **Simulated** (labeled sample data). |
| Product explorer (`/platform`): Inbox / Calendar / Needs a person / Weekly summary (Growth+), channel filter, approve a draft, calendar → thread | Implemented. **Simulated**; recap counts are computed from the sample dataset. |
| Reply-mode switcher (home): assisted / escalation / autonomous | Implemented. **Simulated.** |
| ROI calculator (`/roi`): 4 inputs + plan, validation, visible formula, disclaimer | Implemented. **Real math** (`lib/roi.ts`, unit-tested). |
| Contact (`/contact`, `?plan=` prefill) | Implemented. **mailto fallback**: validates, then opens the visitor's email app with a prefilled message to hello@betterdesk.ai, with copy-to-clipboard if no mail app opens. There is no server-side delivery because no email credentials exist. |
| Mobile menu, FAQ accordions (native `<details>`), header active state | Implemented. |

Nothing is truly integrated with a live phone line, calendar or AI endpoint.

## Content and claims
- Pricing **preserved exactly**: Starter $149, Growth $299, Scale $599, with the same plan contents.
- Kept as current public policy from the old site (please confirm): "No annual contract / cancel any time", "setup, calibration and human support included on every plan".
- Not shipped: Privacy, Terms, Security and DPA pages. The old site's footer linked to `#` for these and no authentic text exists. **Blocker before real traffic**: a privacy policy is needed, especially because the contact flow collects contact details.

## Verification
See STATUS.md for the latest numbers. Summary at the time of writing:
- `npm run typecheck` ✓, `npm run lint` ✓ (0 problems), `npm test` 4/4 ✓, `next build` ✓ (local and on Vercel).
- Playwright: 38/38 in Chromium and 38/38 in WebKit (routes, metadata, overflow at 320/375/390/768/1024/1440/1920, links, 404, mobile menu, journey, explorer, ROI, contact, reduced motion, axe WCAG 2.2 AA on every route at 390 and 1440).
- Lighthouse mobile (local production server, simulated slow 4G): performance 91–93, accessibility 100, best practices 100, SEO 100. LCP 3.2–3.5 s, TBT 60–100 ms, CLS ≤ 0.026. **The lab LCP is above the 2.5 s target**; real-user LCP is unmeasured.
- Firefox was not tested (not installed).

## Repo
- Branch `feat/betterdesk-2026-premium-redesign` (local only; `gh` auth is invalid, nothing pushed). `main` has no commits.
- Vercel project `betterdesk-redesign` (`prj_huXJszKZP8QZbkl9ncUSshS8B9DN`), team `neel-s-projects9`.
