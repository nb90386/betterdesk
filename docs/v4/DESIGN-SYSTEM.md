# V4 design system: "Signal Architecture"

## Direction
I compared three directions as rendered test compositions (`screenshots/art-direction-board.png`):
- **A, Mineral Instrument** (graphite and lit steel, Schibsted Grotesk): credible but generic dark.
- **B, Field Notes** (warm paper, Newsreader): needs documentary photography we don't have.
- **C, Signal Architecture** (petrol with edge-lit panels and one route): **chosen**, with A's material discipline. Its motif is the product itself: separate records joined by one route.

## Tokens (`app/globals.css`)
- **Petrol stage:** `#071315` → `#15292d`; rule `#22393c`; text `#e8f1ef` / `#9cb2b0`.
- **Limestone work surface:** `#f4f5f2`, `#e9ece8`, surface `#fff`; ink `#0b1a1d` / `#283a3e`; muted `#55676a` (≥5.5:1).
- **Signal (celadon), the only accent:**
  - `#2fbf9f` for graphics on either ground;
  - `#7fd8c2` for text and marks on petrol (9.6:1);
  - `#0e6b5a` for text on limestone (6.2:1).

  It means connected, live, or next action.
- **States only:** attention `#9a4a0b`, danger `#b42318`.
- **Scopes:** `.tone-dark` and `.tone-light` swap the ink tokens, so the same components work on either ground.
- **Radii:** 4, 6, 10 and 14px. Circles are used only for dots and nodes; there are no pills.
- **Shadows:** one key light from the upper left. Rest, lift and object shadows sit on limestone; the petrol shadow adds a faint celadon edge.

## Type
All three faces are OFL and self-hosted:
- **Funnel Display** (variable 300–800), headings only. The hero is 620 weight with −0.042em tracking.
- **Geist** (variable) for UI and text.
- **Geist Mono** only for IDs, times and counts.

Rejected alternatives: Schibsted Grotesk (too neutral) and Newsreader serif (a cream-editorial cliché without photography).

## Mark
I drew three concepts and tested them at 16, 24, 32, 64 and 256px (`screenshots/logo-concepts.png`):
- continuous b: rejected as too close to V3's mark;
- junction: **chosen**;
- framed monogram: rejected as a generic app tile.

The junction is two routes (businesses you find, and inquiries that find you) merging into one line that lands on a celadon node. Files: `public/brand/v4/mark.svg`, `mark-dark.svg`, `mark-mono.svg`, and `app/icon.svg` (petrol tile). No trademark search has been performed.

## Motion (Motion for React; CSS for simple states)
1. **Hero:** both routes draw once and a light pulse travels the found route. CSS only, no JS. Disabled under reduced motion.
2. **Journey scene (signature):** a 300vh pinned stage. Scroll scrubs seven stages, stage buttons jump to any stage, and upcoming stages show as outlined placeholders. At the end, the stage cards travel by shared layout into one customer timeline. Phones and reduced-motion users get a static vertical route.
3. **Scout inspector:** a shared-layout expand that shows the real rule engine's output.

In the app:
- pipeline cards use `layoutId` when they change stage;
- drafts animate in and exit fast;
- live run state shows as a pulsing dot.

There is no scroll-jacking, and native scroll is preserved.

## Anti-slop decisions
There are no eyebrows, no gradient text, no 3-up icon cards and no fake testimonials, logos or metrics. Stage is shown as a position marker, not a colored pill. Every sample is labelled fictional.

## Open critique (`INDEPENDENT-REVIEW.md`)
The reviewer argues that the mark reads as a generic arrow and that dark teal is a category default. That is unresolved and a founder decision.
