# BetterDesk V4 independent review

Reviewer stance: skeptical, screenshot-grounded. I viewed home 1440/390 (first, full), journey frames 5/30/75/97, scout/product full pages, app Today, Scout run, Opportunities+inspector, Pipeline (1440 and 390), Analytics, and V3 home 1440. I did not re-run the app, so motion is judged from frames plus the code's intent, not from live playback. Pages not opened: pricing, security, contact, tour, settings, inbox, record, calendar; they are unscored.

## 1. Scores (1-10)

| Dimension | Score | Why |
|---|---|---|
| Originality | 6 | The flow-line hero and the stage-driven "one opportunity" scene are specific to this product. But dark teal page + mint CTA + cards-with-mono-labels is the 2024-26 dev-tool default. Fonts and layout aren't distinctive enough to survive a logo-swap test. |
| Brand recognition | 4 | The mark is a small arrow-into-dot glyph (home nav). It reads as a generic "flow/merge" icon. The wordmark is plain. Nothing ownable besides the mint-on-ink palette. |
| First-screen clarity | 7 | Headline is outcome-led and the sub-line names commercial cleaning, Scout-like prep, approval and walkthrough. But the visual proves only "two things become a booking". Home 390 shows no product visual above the fold, with cards cut mid-text at the fold. |
| Typography | 7 | The wide grotesque display face (home 1440) has real character and strong scale contrast. Body and UI text is competent. In the app the grey half of "2 things need you." is low-contrast. Small mono labels and 11-12px captions are too frequent. |
| Lighting / material | 5 | Dark ink with a faint teal glow is coherent but flat. Cards are all the same border + shadow. The only material shift is dark site to light app, so there is little depth hierarchy. The scout hero (right half) is just a dark void. |
| Composition | 5 | Hero is a good 2-column asymmetric. After that, the page falls back to a left-heading / right-card rhythm repeated 5 times (home full, product full). Large dead zones: journey frame 5 (right 60% is empty dots), Scout hero (right half), bottom-right of home hero. |
| Motion (frames + code) | 6 | The scroll-driven stage scene is the best idea in the build: rail on the left, cards accrue on the right, final card becomes a timeline. Frame 30 shows cards overlapping so the Qualified card's last line is clipped ("business contact . not a customer" under the Introduced card). The staggered zig-zag is cramped. Frames 5 and 97 are mostly empty or a flat swap. |
| Product demonstration | 7 | Real, specific sample data (Juniper Lane Law, 5-criteria evidence with points, draft approval, timeline) is the strongest asset. Marketing "screens" on the product page are shrunk app screenshots in browser chrome whose text is unreadable at 1440, which wastes it. |
| Information hierarchy | 6 | Marketing is clear. In the app, Today puts 2 attention items above a row of seven zero/one counters of equal weight; the Needs-you card has a large empty gap and the page bottom (~200px) is blank. Opportunities mixes "Strong fit 100" mono, stage bars, and stage text with equal weight. |
| Commercial value explanation | 6 | "What works today vs doesn't" table and the Today vs With BetterDesk table are credible. But no number, outcome, or contractor-world proof (cleaning bids, recurring contracts, margins) is on the home first screens. The headline promises walkthroughs but the page never quantifies what a walkthrough is worth. |
| Dashboard usability | 6 | Sidebar, inspector with evidence, a rule-based explanation per criterion: genuinely good. Pipeline at 1440 cuts off the Won/Lost columns (header shows a clipped "W..."), stage selects truncate ("Outreach prepar"), cards are only movable via select. Analytics is a plain table of counts: no trend, no visual. |
| Mobile | 5 | The 390 Today screen is clean. The 390 pipeline shows 2 columns clipped at right with horizontal scroll and no scroll affordance. The demo banner takes ~90px of 844. Home 390 is a 10,900px scroll; hero visual is below the fold. |
| Accessibility (visual) | 6 | Mint CTA on ink is strong; focus states not verifiable from stills. Concerns: 11-12px grey-on-ink captions ("Fictional sample records", sub-CTA fine print), dim "waiting" rail dots, grey half-headline on Today, orange "Worth checking" 81 text on white at small size. |
| Trust / credibility | 7 | Honest to a fault: "Fictional sample records", "Nothing is sent", "Works today / not yet" table, "Revenue attributed: Unknown". This is distinctive and good. It is undermined slightly by `Strong fit 100` shown for 6 of 6 sample rows, which looks scripted. |

## 2. Five-second test

home-1440-first:
- Who: Only the sub-paragraph says "commercial cleaning companies." The headline does not. Pass, but not in 5 seconds.
- What it does: "find businesses, prepare introductions you approve, answer inquiries, keep moving to a booked walkthrough." Four verbs in one sentence; the first read is "lead tool."
- Problem: "Less chasing leads" implies it, but it never names the real pain (research lives in six places; follow-up falls through).
- Why connected matters: The graphic (two sources converging to one booked walkthrough) hints at it. Words don't say so above the fold.
- What to click: Clear. Mint "Explore BetterDesk" vs ghost "Request a demo".
- Hesitation: "Explore BetterDesk" is vague (explore what?). A contractor won't know if they are signing up. The fine print under it ("No sign-up, nothing is ever sent. Early access; plans from $99") is 12px grey and doing a lot of work. "Scout" in the nav is never explained in the hero.

home-390-first:
- Same copy, but the visual is cut off after the fold, so there is no product proof at all on first view. The headline is ~4 lines before the CTA; two CTAs stacked, the second is left-aligned and a different width than the first (looks unaligned).
- Owner hesitation: a 5-line grey paragraph is the entire explanation.

## 3. Top 8 weaknesses (ranked by damage)

1. **Brand is not ownable.** Mark and palette are generic dev-tool defaults; no recurring visual idea beyond the thin green line. Fix: in `components/site/` nav/footer and `public/brand/v4/mark.svg`, commission one distinctive device (e.g. a "route line that terminates in a signed-contract notch") and reuse it as section divider, favicon, loader and hero line; stop using the bare arrow glyph.
2. **Marketing "product" is shrunk app screenshots.** On `/product`, framed 1440 screenshots become illegible thumbnails and alternate left/right (5x the same layout). Fix: replace in `app/(site)/product/page.tsx` with live-rendered cropped fragments of the real components (one inspector, one timeline), at actual size, with annotations. Vary layout per section (one full-bleed, one inline, one over a dark band).
3. **Scroll scene has dead and overlapping states.** Frame 5 leaves ~60% empty; frame 30 clips the "Qualified" card behind "Introduced". Fix: in the home journey component (`components/site/*` journey), lock card heights, start from a centered card that moves to the left stack, and reserve non-overlapping offsets; fill empty state with the faint ghosts of future stages (they exist as unlabeled dots now).
4. **Pipeline broken at desktop and mobile.** Won/Lost columns cut off at 1440 with no scroll cue; selects are truncated; cards show only a select for movement. Fix: in `app/app/**/pipeline`, use `minmax(168px,1fr)` columns with a trailing fade + visible scroll rail, collapse empty "New prospect"/"Contacted" columns to narrow rails, add drag + keyboard move, shorten stage labels in the select. On mobile switch to a stage-segment control showing one column at a time.
5. **Today under-delivers its "needs you" promise.** Two items, ~120px blank under them, a 7-up count row of mostly zeros, an empty area of 200px below. Fix: `app/app/**/today`: make the top card the only primary surface (inline "Reply" / "Review draft" actions instead of arrows), collapse zero stages into one line, move Scout card below with the last-run state, and fill height with "Next up" timeline.
6. **Analytics is a table, not insight.** Nine counts equal weight; "Revenue attributed Unknown" is honest but ends the page. Fix: add a 7-stage funnel strip (conversion between stages, same data) and a one-line "what changed this week"; keep Unknown but label why/how to connect.
7. **Mobile hero and density.** Product proof is below the fold at 390; CTA widths mismatched; the demo banner eats ~90px on every app screen. Fix: hero in `app/(site)/page.tsx`: at <640px show a compact 2-card version of the flow above the paragraph; make both CTAs full width; in the app shell make the demo banner a single-line collapsed pill after first view.
8. **Small / low-contrast text and sample realism.** 11-12px grey captions on ink; grey "2 things need you." ; every sample row reads `Strong fit 100`, which makes explainable scoring look rigged. Fix: raise caption token in `app/globals.css` to >=13px and lighten (target 4.5:1 on ink); vary sample data (scores 100/92/81/64 and one "unknown" criterion) in the sample seed so the inspector shows an unknown evidence state.

Other callouts: Scout page hero right half is empty with a detached line ending in a dot (reads as unfinished); "Worth checking 81 / Strong fit 100" use mono with coloured text only (no icon/shape, color-dependent); 1440 hero has a lot of empty bottom-right. No misleading claims found: sample data is labelled on the hero, in the app banner, and in captions. "Early access; proposed plans from $99" is appropriately hedged.

## 4. V3 to V4

V4 is a real step up in strategy, a moderate step in visual craft, and not yet a leap in originality.

- Strategy: V3 (Alder Plumbing, missed-call text-back, light grey, black CTA) was a different product with a pretty hero. V4 has a defensible wedge (qualify with evidence, human approval, one record), a working sample app with inspector, timeline and honest analytics. This is the depth the founder said was missing. Not a reskin.
- Visual: V3 was light, quiet and Linear-ish; V4 is dark, more atmospheric and more consistent with its app. But the move to dark teal landed in the most common slot of the category. The marketing/app split (dark site, pale app) is coherent but also unspectacular.
- Remaining gap vs the bar: Apple restraint is partly met (the headline, the copy), Linear precision is met in the inspector but not in the pipeline, Attio storytelling is partly met by the journey scene, weakened by overlap/void states. "Hard to mistake for a generic SaaS template": still mistakable at a glance of full-page screenshots, because the lower marketing sections repeat heading-left/card-right.
- Verdict: ship-worthy as a credible early-access site; not yet "award-level". The cheapest fixes by return are 3, 4 and 2 above, then the brand device (1).
