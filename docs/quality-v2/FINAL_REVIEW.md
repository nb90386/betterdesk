# Founder review checkpoint after cycle 2 (not final; not approved)

- **Preview:** https://betterdesk-redesign-fejrjm0wo-neel-s-projects9.vercel.app. Target preview, status Ready, commit 51cdb78. It's **protected**, so sign in to Vercel (team neel-s-projects9) to view it. Anonymous requests get 302. Signed in, all 9 routes return 200 and unknown routes return 404.
- **Production / betterdesk.ai:** untouched. No `--prod` deploy was run.
- **Rollback:** the cycle-1 preview, https://betterdesk-redesign-8u64w2vv1-neel-s-projects9.vercel.app, and the pre-v2 preview, https://betterdesk-redesign-eaioporgk-neel-s-projects9.vercel.app, are both still live. In git, `894c13b` is the pre-v2 head.

## Before / after (open side by side)
| View | Before (baseline) | After (pass-06) |
|---|---|---|
| Home hero, desktop | screenshots/baseline/home-1440-top.png | screenshots/pass-06/home-1440-top.png |
| Home hero, phone | screenshots/baseline/home-390-top.png | screenshots/pass-06/home-390-top.png |
| Home hero, 320 | screenshots/baseline/home-320-top.png | screenshots/pass-06/home-320-top.png |
| Whole homepage | screenshots/baseline/home-1440-full.png | screenshots/pass-06/home-1440-full.png |
| Pricing | screenshots/baseline/pricing-1440-top.png | screenshots/pass-06/pricing-1440-top.png |
| Platform | screenshots/baseline/platform-1440-top.png | screenshots/pass-06/platform-1440-top.png |
| ROI | screenshots/baseline/roi-1440-top.png | screenshots/pass-06/roi-1440-top.png |
| Close | screenshots/baseline/home-1440-bottom.png | screenshots/pass-06/home-1440-bottom.png |
| Sayable reference | screenshots/sayable/sayable-1440-top.png | |
Contact sheets: `screenshots/<pass>/index.html`. The OG image is `screenshots/pass-03/og.png`.

## Honest status
- The independent reviewer on pass-05 gave a **narrow REJECT** (REVIEW_PASS05.md). It put the work at roughly 85–90% of the Sayable bar: the hero at or slightly above, the story at the bar, rhythm and lower-page polish below. Four of its top five fixes landed in pass-06. **Still open: a full-bleed mid-page peak and the even run of cream sections** (rhythm 5/10).
- Set pieces built: A, the hero (night desk); B, the scroll story (five states with a persistent rail); C, the walkthrough (designed first state, autoplays on the homepage); D, the ROI unit chart.
- Mobile LCP (simulated slow 4G) is 3.3 s, the same as the baseline and above the 2.5 s target.
- Tests are 80/80. Visual quality is **not self-approved**. That decision is yours.

## Claims matrix
Unchanged from docs/redesign/CLAIMS_AUDIT.md. The new copy adds no metrics, customers, integrations, certifications or testimonials. All product scenes are labelled as samples. The pricing receipt restates published plan copy only. The ROI chart is a projection from visitor inputs, and its disclaimer is kept. One sample line was removed because it was unverified ("Marco on the way").

## Founder decisions needed
1. Direction: "after hours, then morning" (night graphite, one amber lamp, pearl for what's settled). Keep it, or steer it?
2. Headline: "Every missed call, answered before they call someone else."
3. Trust cues: the reviewer flags missing proof, consent and integration cues. We need real material from you (customer quotes you can share, an SMS consent/opt-out policy, confirmed integrations). None were invented.
4. Still open from earlier: privacy policy and terms, plus real demo delivery to replace the mailto composer.
