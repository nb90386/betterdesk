# BetterDesk V3: final review for founder approval

**Preview (protected by Vercel Authentication; sign in to `neel-s-projects9`):** https://betterdesk-redesign-i88negb7a-neel-s-projects9.vercel.app
Inspector: https://vercel.com/neel-s-projects9/betterdesk-redesign/DVFG7imDHMGNVGUU3WY31UcJZvaY

- Deployed commit: `a2a0004` on `feat/betterdesk-v3-apple-editorial`. V2 is preserved untouched on `feat/betterdesk-sayable-quality-v2` at `a0eab3a`.
- Earlier V3 preview (cycle 1, superseded): https://betterdesk-redesign-42636qyi7-neel-s-projects9.vercel.app
- Production: **not touched.** No `--prod`, no alias, domain or DNS change, and no billing change.

## What changed
- **World:** V2's night graphite and amber lamp gave way to porcelain daylight, graphite ink and one vermilion route line. Display type is no longer Bricolage plus Geist; Instrument Sans is now the only family. Radii went from capsules to 4/8/12/16. See `BRAND-SYSTEM.md`.
- **Mark:** three concepts were drawn and compared (`screenshots/logo-concepts.png`). The chosen route "b" is in `public/brand/mark-b-route.svg`. There is a new favicon (`app/icon.svg`) and a new social card (`app/opengraph-image.tsx`).
- **Homepage, five acts of one illustrative afternoon** (`lib/story.ts`):
  1. Hero: a layered call object, reply and schedule, with pointer and scroll parallax, a route drawn on load with a travelling lit pulse, and a depth-of-field focus pull.
  2. Pinned "missed moment": the call rings out, the route breaks and frays, then BetterDesk reconnects it.
  3. Pinned, scroll-scrubbed signal-to-booking (520vh) through call, reply, follow-up, open times and booked. It has Play/Pause/Replay and an `sr-only` transcript.
  4. A full-bleed interactive inbox, a masked close-up of approved answers, "You choose / What it won't do", and a DIY vs answering service vs BetterDesk table.
  5. The value calculator with visible math, proposed pricing, the FAQ, and a close with "what happens after you click".
- **Every route rebuilt** on the same system: /platform, /how-it-works, /demo, /pricing, /roi, /solutions plus two industry pages, /contact and the 404. Seventeen V2 components were deleted.
- **Honesty fixes:**
  - "Book a demo" became **"Request a demo"**, because the form opens an email draft and there is no scheduler.
  - Every sample is labelled.
  - Pricing is labelled "Proposed price. Today's published price is $X."
  - On calls, the site claims only text-back, never live AI voice.

## Real vs illustrative
| Real, working on the site | Illustrative / proposal only |
|---|---|
| Navigation, mobile menu, header tone switching | All conversations, names, numbers, rules and the "Alder Plumbing" business |
| Play/Replay of the Act III sequence; scroll scrubbing | Inbox contents (the selection works; the data is sample) |
| Inbox thread selection | Pricing $129/$249/$499, conversation allowances, $0.40 overage |
| Value calculator (`lib/roi.ts`, unit-tested) | The product capabilities themselves: described from live-site copy, not verified against product code (none is in this repo) |
| Demo request form: validation, then a pre-filled email to hello@betterdesk.ai (disclosed; nothing is sent automatically) | |

## Process evidence
- Before: `screenshots/before/` (V2 at 1440, 1280, 768, 390 and 320 in `viewport/`, plus 7 full pages at 1440 and 390).
- Pass 1 → critique → pass 2 → independent review → pass 3: contact sheets in `screenshots/pass-1/`, `pass-2/` and `pass-3/`.
- Final: `screenshots/after/`. That holds the first viewport at 5 widths, the Act II and III mid-scroll beats, the lower sections, reduced motion, WebKit, and every subpage at 1440 and 390.
- V2 vs V3 comparison: `CONTACT_SHEET.html`.
- Research (`RESEARCH.md`): Apple, Attio, Linear, Inkwell, Heron AI and Grail were rendered. Awwwards pages return 403 to headless browsers and were read as text. The UAE Pavilion and Joy from Africa experiences did not render.
- Slop audit (`AI-SLOP-AUDIT.md`): 25 findings against V2.
- Independent review (`INDEPENDENT_REVIEW.md`): round 1 scored **5/10 overall** (business clarity 8, honesty 8, typography 7). Cycle 2 addressed its top weaknesses: the booking CTA, the Act III overlap, the hero centerpiece, the Act II defects, the mobile hero, the answers sliver, subpage sameness, and the pricing strikethrough and jargon. **No second independent grading was run.** The grades in that file are for cycle 1.

**Counts against V2**, from the audit: capsule radii went from 61 `rounded-full` (mostly buttons and chips) to circles only for avatars and dots. The 25 identical `.reveal` entrances became 0 uniform reveals, with 3 authored moments and 1 quiet accent. The 14 eyebrows became 0.

## Verification (local production build unless noted)
- `npm run lint` and `tsc --noEmit`: clean. `npm test` (unit): 4/4.
- Playwright **Chromium 42/42 and WebKit 42/42**. That covers every route (status, one h1, metadata, canonical, no console errors, no overflow at 320–1920), every internal link, the 404, the mobile menu with Escape and focus return, Play running the full sequence, inbox selection, calculator math, contact validation and mail composition, proposal labels, reduced-motion static acts with no hydration error, a JS-disabled check that the story stays readable, sticky CTA behaviour, and the header tone. Axe WCAG 2.2 AA passes on 10 routes at 390 and 1440 (reduced motion).
- **Lighthouse 12.8.2**, local `next start`, headless Chrome for Testing, single runs (lab data, not field data):

| Run | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home, mobile (simulated 4G) | 93 | 100 | 100 | 100 | **3.1 s** | 0 | 40 ms |
| Home, desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| Pricing, mobile | 97 | 100 | 100 | 100 | 2.5 s | 0 | 50 ms |

  Home mobile LCP misses the 2.5 s target. The LCP element is the hero lede, so this is text, not an image; render delay from local TTFB and the font swap is the likely cause, not yet confirmed.
- **Not run:** a real-device touch or trackpad pass, Firefox, field Core Web Vitals, real email delivery (there is no backend), and Lighthouse on the protected preview.

## Known limitations
1. With JS disabled, Act II shows all its lines and Act III shows a static transcript under its stage (tested). The pinned stage itself stays on its first beat.
2. Home mobile LCP is 3.1 s in the lab.
3. The hero route geometry is tuned for widths of 640px and up. Below that the route is hidden and the cards stack.
4. The solution pages keep V2's reminder and rebook lines, which need founder confirmation (see `BUSINESS-TRUTH.md`).
5. There are still no legal pages. SMS consent, privacy and terms are marked pending on /contact.
6. Heron AI, a recent Site of the Day, uses a related off-white, graphite and vermilion palette. V3 differs in its mark, route motif, layouts and story. The founder should judge whether that is distinct enough.

## Founder decisions needed
1. **Visual approval** of the direction, the headline and the route "b" mark.
2. **Pricing:** $129/$249/$499, 150/500/1,500 included conversations, $0.40 overage, and the definition of a conversation. Replace the cost assumptions with real invoices first.
3. **Booking:** either add a real scheduler (then the CTA can say "Book a demo") or keep the email-draft form.
4. Confirm every capability in `BUSINESS-TRUTH.md` against the actual product.
5. Approve a production rollout. Nothing goes to betterdesk.ai without that.
