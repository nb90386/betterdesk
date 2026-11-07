# UX and CRO audit (three bounded cycles)

Before: docs/reinvention/screenshots/r3 (General Sans, door-swing b). After: docs/v4/screenshots/apple/final.

## Cycle 1: homepage, navigation, first screen (f7d8d20)
| Issue (evidence) | Change |
|---|---|
| Display face read as a sibling of V4's grotesk (finish review) | Sentient serif display + General Sans text, chosen from 5 rendered heroes |
| Mark read as a bar chart at 20px (jury critic) | D-swing mark, tested 16–64px |
| Lede 5–6 lines on phones (c1-home-390) | 27-word lede |
| No Solutions menu; flat link | Product ▾ / Solutions ▾ |
| No answer to "why not ChatGPT + spreadsheet?" | Comparison table + six objections |
| Page-wide reveals, idle lamp loop | Removed |

## Cycle 2: demo, Scout, Presence, Desk interactions (9390c33)
All 22 independent motion findings fixed (APPLE_MOTION_AUDIT.md). Scout list → evidence + editable draft with a travelling selection plate. A regression the nav suite caught (close-on-click caused full page loads) fixed.

## Cycle 3: pricing, contact, mobile (6b52260, 533a38d)
| Issue | Change |
|---|---|
| Pricing had no way to judge usage | Estimator with tabular figures |
| Workspace pipeline widened the page to 1287px on phones (break-ui) | Scroll regions are containing blocks; regression test |
| Demo layout shift 0.657 (Lighthouse) | Loading state renders the same grid; CLS 0 |
| iOS field zoom, notch, sticky hover risks | Mobile baseline |

## First-screen comprehension (simulated owner, labelled as simulation)
From home-390-first: for commercial cleaning companies (first clause), finds businesses + checks Google/AI visibility + books walkthroughs, next step "Try the demo", no sign-up. Not real user research; founder and real-owner review still needed.
