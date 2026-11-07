# Baseline critique (HEAD 894c13b, captured 2026-11-06 17:27 PST)

Evidence: `docs/quality-v2/screenshots/baseline/` (WebKit, local `next start` on :3917, contact sheet `index.html`). Sayable reference: `docs/quality-v2/screenshots/sayable/`. Findings are what I saw in those captures, plus source where noted.

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | serious | The hero has no signature. It is a split hero: serif headline on the left, three small floating UI cards on the right, and ~45% of the right half is empty cream. Nothing in the first viewport could not belong to any SaaS. | home-1440-top.png |
| 2 | serious | The world is the AI default: warm cream ground, high-contrast serif display (Newsreader), terracotta-red accent, and small tracked mono labels. The category could predict it. | home-1440-top, pricing-1440-top |
| 3 | serious | Content is invisible by default. `.reveal` starts at opacity 0 and waits on `animation-timeline: view()`. A full-page capture renders four long blank cream slabs. The same thing happens in any engine or state where the timeline does not resolve. | home-1440-full.png, globals.css `.reveal` |
| 4 | serious | There is no brand mark. A rounded "B" tile with a dot is a favicon placeholder, not an identity, and it never appears as a spatial element. | header in all shots |
| 5 | serious | The product UI is unconvincing. The walkthrough phone is a black-bezel rectangle holding one grey "Missed call" pill and 70% empty white. At first sight the demo stage reads as broken. | home-1440-mid.png |
| 6 | serious | On mobile the hero scene starts below the fold. At 390 the first viewport is headline, paragraph, buttons and a mono stat row, with no product and no visual. | home-390-top.png |
| 7 | medium | The page rhythm is monotonous: section after section of display headline, lede, then a list or cards on the same cream, with one dark band. There is no change of scale, image or density. | home-1440-full.png |
| 8 | medium | The lighting and materials are flat. Cards are cream on cream with 1px rules, so there is no depth, light source or material contrast. The "Apple-like product lighting" brief is unaddressed. | home-1440-top, pricing-1440-top |
| 9 | medium | The "four jobs" list is a document, not a story. Its four rows of serif heading and paragraph, with a dot marker, repeat what the walkthrough already shows. | home-1440-mid2.png |
| 10 | medium | Kicker labels and eyebrows (PRICING, SAMPLE CONVERSATION, FROM/SETUP/CONTROL) are tracked-mono costume, and they sit above headings throughout. | pricing-1440-top, home-390-top |
| 11 | medium | The pricing hero is a giant headline with an empty right half, then three equal cards. The featured plan is just black. Pricing tells no story about what you get. | pricing-1440-top.png |
| 12 | medium | Section headings float in blank space: the large headline's left column ends, and the right column is empty for 300px+ on desktop. | home-1440-mid2 ("Built for businesses...") |
| 13 | medium | The vertical "gutter thread" at the far left is a 1px red-to-green line in the margin. It is decorative and disconnected from the content. | home-1440-mid, mid2 |
| 14 | small | The mobile header's hamburger is an 88px cream circle that dominates the bar; the visual weight is wrong. | home-390-top.png |
| 15 | small | The hero meta row (From $149 / Setup with a real person / Control) uses three tiny mono labels that read as filler stats. | home-1440-top.png |
| 16 | small | The dashed "SAMPLE CONVERSATION" pill and the PAUSE/REPLAY mono links compete with the scene they label. | home-1440-top.png |
| 17 | small | The "booked" underline (dashed red into a green rule) is the only brand flourish, and it reads as a hand-drawn template detail. | home-1440-top.png |

## What was worth keeping
- The claims discipline (CLAIMS_AUDIT.md), the exact pricing, the honest FAQ copy, and the sample data in `lib/sample.ts`, which is coherent: Ridgeline Plumbing, Dana M., 78704, 8–10 AM.
- The working interactions (LeadJourney, ProductExplorer, ModeSwitcher, RoiCalculator, ContactForm), the tests, and axe coverage.
