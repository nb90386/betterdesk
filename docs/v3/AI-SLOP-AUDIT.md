# BetterDesk V2: AI-slop audit

Scope: V2 in `app/`, `components/`, `app/globals.css` (branch feat/betterdesk-v3-apple-editorial). Evidence: `docs/v3/screenshots/before/*` and `viewport/*`.
Honest baseline: V2 is past the worst template slop (no centered hero, no kicker pills, copy is mostly plain). What remains is slop of *system*: everything is a dark stage, a rounded container, a pill, a mono timestamp, an invented sample. Ranked by visual plus commercial damage.

## Counts (V2 baseline, for V3 to beat)

| Metric | V2 count | How measured | V3 target |
|---|---|---|---|
| `rounded-full` (tsx) | 61 across 12 files (+4 pill-ish in css) | `grep -rEo rounded-full app components --include=*.tsx` | <= 8 (avatars, status dots only) |
| Capsule button base | 1 class = every CTA site-wide | `Button.tsx:6` `rounded-full` | 0 |
| Container radii `rounded-[var(--radius-*)]` | 30 (+16 `rounded-md/lg/xl`) = 46 | grep | <= 12 |
| `bg-card` surfaces | 27; `border ` utilities 58; `shadow-[var(--shadow-*)]` 18 | grep | halve each |
| Rounded boxes inside rounded boxes | ~12 stacked (LeadJourney, ProductExplorer, SignalStory, NightDesk, HeroScene) | manual | 0 inside content panes |
| `radial-gradient` | 6 (3 in `globals.css:235-237`, 3 in tsx) | grep | 0 decorative |
| `blur(` | 4 (css keyframe + 3 in SignalStory/animate) | grep | 0 |
| `linear-gradient` | 12 | grep | only for real material |
| Glow/colored shadows (`--shadow-pearl-on-night`, `.lamp-ground`, inset amber) | 3 tokens + 2 utilities | globals.css:59-63, ~225-241 | 0 |
| `.reveal` uniform scroll reveals | 25 usages, one keyframe (`bd-reveal`, 22px rise) | grep | <= 3 purposeful |
| `@keyframes` | 13 | globals.css | <= 5 |
| `font-mono` usages | 35 (HeroScene 8, ProductExplorer 5, NightDesk 5) | grep | <= 8, data only |
| Eyebrow/kicker class uses | 14 (footer headings, PageHero aria) | grep | 0 above h2 |
| Text under 12px (`text-[0.5-0.7x rem]`) | 110 total, 101 in components | grep | 0 below 12px body |
| Homepage sections | 9 (hero, dusk, story, two endings, walkthrough, who, price, faq, CTA) | page.tsx | 6-7 |
| Distinct section layouts | ~6 of 9 are "h2 + lede left, big dark/pearl panel right/below" | manual | each unique job |
| Banned-copy hits (seamless, unlock, empower, supercharge...) | 0 (only "Smart" once, pricing) | grep | 0 |
| Homepage full-page height | 8801px @1440, 14431px @390 | PNG size | <= 6500 / 10000 |
| Console errors | React #418 hydration on `/` (1440, 390) | report-chromium.json | 0 |

## Findings (most damaging first)

1. **Hero headline is the star but the money line is dimmed.** `page.tsx:66-68`: "before they call someone else." set in `text-night-muted` (grey on near-black, `home-1440` viewport). The commercial hook (losing the job to a competitor) is the lowest-contrast text on screen. Hurts: owner skims the bold half only. V3: single ink colour, one weight; hierarchy via size and position, not dimming.
2. **Whole site is a dark "night desk" stage.** Hero, dusk, story, footer, CTA all `on-night` (`page.tsx:63,98,108`; home-1440 full page is ~60% black). A plumber/salon owner sees a SaaS-for-developers mood, not a trade tool; light-on-dark long reading hurts. V3: paper-first Apple-editorial; one dark moment max, justified (after-hours scene).
3. **Hero is a stack of three overlapping rounded panes** (chat pane, schedule behind it, booking card on top, `HeroScene.tsx`/`NightDesk.tsx`, `--shadow-pearl-on-night` at globals.css:63 with amber back-glow). The glow-lit device is the generic "AI product shot". The message is buried in 5 depth layers. V3: one flat, legible artifact (phone thread) with a real caption; drop the schedule frame, rim light and glow.
4. **Invented-looking data presented as product.** "Ridgeline Plumbing", "Dana M.", "Tech: Marco", "(512) 555-0148", 6:42 PM (`NightDesk.tsx:5,45,62`; hero caption admits "illustrative"). 555 number plus perfect timeline reads as mock. Owners can't tell what is real vs staged. V3: label once as a real-format sample; use a generic named business per solution; no fake phone numbers.
5. **Capsule buttons everywhere.** `Button.tsx:6` base `rounded-full` plus `min-h-11` pearl button with halo shadow (hero 1440). 5 header pills (`SiteHeader.tsx`), 4 inside hero. Looks like every 2023 landing page. V3: rectangular 8-10px (or square) buttons, text-weight primary, no halo.
6. **61 `rounded-full` uses, mostly chips.** LeadJourney 11, ProductExplorer 10, SignalStory 6, ModeSwitcher 3 (pill toggles, "Replying" chip in hero, "Without/With" segmented pill at `home-1440` walkthrough). Chips imply status UI where text would do. V3: remove the pattern; replace chips with plain labels or tables; reserve circles for avatars.
7. **Rounded-boxes-in-rounded-boxes.** Walkthrough panel (`LeadJourney.tsx:206` radial bg) holds phone in a rounded frame holding bubbles holding timestamp chips; pricing cards hold a rounded "only what you've approved" band (home-1440 y~3500-3700). 3 levels of radius (22/14/10) in one view. V3: one container level; content separated by rules and whitespace.
8. **Card grids stay in disguise.** Solutions pair (`page.tsx:152-171`), pricing 3-up (`PricingPlans.tsx`), `/platform` and `/solutions` card sets: 27 `bg-card`, 58 borders. Pairs of equal-height dark/light tiles with a tiny sample inside = bento. V3: solutions as a two-column editorial list with one real line each; pricing as a table/ledger.
9. **Same section recipe repeated.** `SectionHeading` (h2 + lede, `Section.tsx:22-39`) then a large panel, in dusk, story, walkthrough, who, price, faq (6 of 9). Rhythm is uniform; nothing earns the scroll. Homepage is 14431px tall at 390. V3: cut to 6-7 sections, each with a different structure and job (proof, how, price, answer).
10. **Radial-gradient lamp lighting.** `.lamp-ground` (`globals.css:233-240`) stacks 3 radial gradients amber top-left on hero and every PageHero (`PageHero.tsx:4`); plus `linear-gradient(180deg,#0d0e10...#221d17)` brown fade on story section (`page.tsx:111`). Brown mud band at home-1440 y~2800-3100. Decorative glow = slop signature. V3: flat grounds; if light is used it must come from an object in the scene.
11. **Scroll-reveal on everything.** 25 `.reveal` elements share one 22px rise (`globals.css:259`), plus 13 keyframes and `filter: blur(6px)` enters (`SignalStory.tsx:124-126`). Motion is uniform wallpaper, delays comprehension on mobile. V3: static by default; animate only the one thing that explains (message arriving), respect reduced motion.
12. **Mono as costume.** 35 `font-mono` for times and phone numbers (`6:42 PM` amber mono in hero, `7:00` schedule rows). Gives "terminal" vibe to an SMS product for salon owners; amber-on-black mono is the AI-tool trope. V3: tabular figures in the main sans; mono banned.
13. **Type stack has no stated rationale.** Bricolage Grotesque display (`layout.tsx:9`, opsz variable) + Geist + Geist Mono. Hero is tracked very tight (`-0.04em`-ish; "answered" glyphs touch at 1440) and Bricolage's quirky optical shapes read startup, not trusted. V3: one family system (SF-like neo-grotesk), documented scale, normal tracking at display sizes above 56px only.
14. **Micro-text under 12px.** 110 `text-[0.5-0.7x rem]` declarations (e.g. `NightDesk.tsx:127` `0.72rem` booking label). In `home-390` full page, chat timestamps and walkthrough captions are unreadable; owners over 45 will not read them. V3: 14px floor for anything read, 12px for timestamps only.
15. **Mobile hero pushes the product below the fold.** `home-320` viewport: headline, 4-line paragraph, full-width capsule, ghost link, then the missed-call meta; the thread starts at y~690 and is cut. At 390 the 14431px page has three consecutive dark tiles. V3: headline + one CTA + thread peek above the fold at 320/390; shorter paragraph.
16. **Mobile uses horizontal micro-layouts.** Dusk day ribbon (`DayRibbon.tsx`) and story timeline shrink to ~9px labels at 390 (home-390 y~230-290); the "6:44 / 6:47" comparison stacks into two oversized numerals. Diagrams scale down instead of re-composing. V3: re-author for mobile as a vertical list.
17. **Light and shadow incoherence.** 5 shadow tokens (`globals.css:59-63`): inset white top-highlight, drop shadows to the lower-right (`24px 44px`), amber rim from the upper-left, and card shadows straight down. Pearl cards on night glow amber from the left, on paper they drop grey. No single light source. V3: one flat or one consistent soft shadow; no inset highlights.
18. **Walkthrough duplicated on home and /demo.** `LeadJourney` embedded at `page.tsx:142` with `startAtEnd`, same widget on `/demo` (`demo-1440`). Interactive widget at depth 4 of a long page: owners rarely get there; hides the booking outcome. V3: homepage shows the finished thread statically; the interactive stays on /demo.
19. **"Two endings" comparison is symmetrical decoration.** `TwoEndings.tsx` splits 6:44 vs 6:47 into dark and pearl halves with a radial bg (line 40), numerals at ~96px. The idea is strong; the execution is a 50/50 split with tiny 12-line lists beneath. V3: one big sentence of contrast, numbers inline in prose or a two-row table.
20. **Pricing section reads as a SaaS tier grid.** Three rounded cards with a "Most popular" amber chip (`PricingPlans.tsx`, home-1440 y~3450). Price $149/$299/$599 with mono-looking small print; the real differentiator ("per business, not per seat") is the headline but the card contents lack outcomes per trade. V3: ledger rows with price, what is handled, who it suits; one recommended row marked in text.
21. **Logo mark is generic and over-built.** `Logo.tsx`: stroked D plus 1-2 amber "signal" arcs (looks like Wi-Fi/audio, sits beside "D" like a broadcast icon). At 28px the second ring disappears (code already drops rings) so the mark has two forms; `app/icon.svg` is a different mark (rounded-square #0d0e10 tile, different stroke widths, one arc). Mixed stroke weights 3.6/3.2/1.9/1.5. V3: one solid, single-weight mark that works at 16px; same asset for header, favicon, OG.
22. **Footer, header and CTA repeat the dark stage and pill.** `SiteHeader.tsx` 5 `rounded-full`, "Book a demo" pearl pill with amber dot; `CtaBand.tsx` (83 lines) repeats a booking mini-card ("Thursday - Marco's route") a third time after hero and walkthrough. Same sample used 3 times dilutes it. V3: header text link + one solid button; close with a plain contact line, no repeated artifact.
23. **Hydration error on `/`.** `report-chromium.json`: React #418 at 1440 and 390, none on other routes. Likely a server/client markup mismatch in the animated hero/scroll story. Not visual, but flashes content and signals fragility. V3: zero console errors gate.
24. **Copy is clean but self-congratulatory in cadence.** No banned words (0 grep hits), yet repeating the "Every X, Y before Z" rhythm: "Every missed call, answered...", "Wake up to bookings, not voicemails", "Straight answers." (home-390 y~1800). Slogans substitute for specifics (what it costs, how long setup takes, what exactly it texts). V3: lead lines state the job in plain nouns; push specifics (setup time, hours of coverage) to first screen.
25. **Empty/uneven space around dark panels.** Dusk section (`page.tsx:98-108`) is `py-20/28` for one heading plus a 3-item ribbon: ~560px of black for ~120 words (home-1440 y~880-1300); story section ends with `h-16/24` spacer then jumps to pearl. Spacing is generous but not tuned to content. V3: spacing scale tied to content blocks; remove the dusk section or merge it with the hero.

## Pattern-level removals for V3 (not renames)
- Delete the dark stage as a default; delete `.lamp-ground`, `--shadow-pearl-on-night`, `--shadow-stage`, `.reveal`, `bd-*`/`hs-*`/`nd-*` decorative keyframes.
- Delete `rounded-full` from Button and chips; delete nested panels.
- Delete mono from UI copy; delete sub-12px text.
- Delete repeated booking mini-card (CtaBand) and the duplicate embedded walkthrough.
- Keep: plain, specific copy; real-format sample content; the missed-call story as the single organising idea.
