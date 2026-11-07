# Scroll-craft checklist

Source: nateherkai/scroll-craft @ 75d81f7 (MIT, plugin `nateherk-design` v0.3.1),
`plugins/nateherk-design/skills/scroll-craft/references/{taste,feel,uniqueness,verify}.md`. Not installed.
doctor.mjs was read, not run (see TOOL-AUDIT.md: it walks up the tree reading `.env` files for `KIE_AI_API_KEY`).

## Spacing and type (taste.md)
- [ ] 4px-base spacing scale; rhythm from tight vs generous, never one repeated value.
- [ ] More space above a heading than below it.
- [ ] Two families max; tracking tightens as size grows.
- [ ] Body measure 45-75ch (62ch default); line height rises with measure.
- [ ] Light text on dark: slightly more leading, slightly lighter weight, slightly more tracking.
- [ ] Hero display steps down one rung below ~700px viewport height.

## Colour and depth
- [ ] Six roles, one accent: canvas, surface, ink, ink-soft, accent, accent-ink. Accent locked for the whole page.
- [ ] Secondary text tinted from the foreground hue, never flat grey. No pure `#000`.
- [ ] Shadows have offset + blur and are tinted to the canvas hue; no zero-offset coloured halo.
- [ ] Raised surfaces may use a 1px top edge highlight; distance = smaller + softer + lower contrast.

## Text over media
- [ ] Never a full-frame overlay. Copy in a corner gets a corner scrim sized to the copy; full-width copy gets a band scrim (transparent above ~58%). Below 860px corner anchors become bands.
- [ ] The scrim is a sibling of the copy, never a child.
- [ ] Contrast measured at the worst frame of a scrubbed clip, not the mean (4.5:1 body, 3:1 large).

## Cards and structure
- [ ] No grid of identical icon+heading+text cards; no nested cards; no three equal feature columns.
- [ ] No hero-metric template; <= 2 consecutive image-left/text-right zigzags; same layout family never twice on a page.
- [ ] No split header (giant headline left, small explainer floating right).
- [ ] Hero: headline <= 2 lines, subtext <= 20 words, CTA visible without scrolling, <= 4 text elements.

## Motion
- [ ] Continuous motion uses transform and opacity (clip-path for wipes); never width/height/margin/padding/top/left; never `transition: all`.
- [ ] Never `ease-in` on UI. Ease-out `cubic-bezier(0.23, 1, 0.32, 1)`.
- [ ] UI transitions < 300ms: hover 120-180ms, buttons 100-160ms (scroll devices exempt).
- [ ] Never `scale(0)`; enter from `scale(0.95)` + opacity 0. Press feedback `scale(0.97)` or `translateY(1px)`.
- [ ] Group stagger 30-80ms. Hover motion gated to `(hover: hover) and (pointer: fine)`.
- [ ] Reduced motion = fewer and gentler, not zero: keep comprehension-carrying opacity, drop position changes.

## States and content
- [ ] Hover, focus-visible, active, disabled on every interactive element; focus ring themed to the accent with offset.
- [ ] Button text on one line at desktop; primary CTA labels 1-3 words.
- [ ] One label per intent site-wide (not "Get in touch" in the nav and "Let's talk" in the footer).
- [ ] No invented statistics or fake precision (4.1x, 92%, 48k).
- [ ] Browser surfaces themed: selection, caret, focus ring, scrollbar, underline offset/thickness, tabular numerals.

## Refuse list
- [ ] Eyebrow above every section heading (max one per three sections); section numbers unless meaningful.
- [ ] Scroll cues ("scroll to explore", mouse icons); decoration strips; locale/time/weather strips; pills on photos; version stamps.
- [ ] Gradient text, neon/outer glows, hard offset zero-blur shadows, decorative glass, coloured border-left > 1px.
- [ ] Mono as costume; emoji icons; custom cursors.
- [ ] Em dashes in visible copy; div-built fake screenshots/dashboards/terminals; text baked into images; elevate/seamless/unleash/next-gen/revolutionize/supercharge.

## Feel check (feel.md section 6, do cold, before rereading the brief)
- [ ] Scroll top to bottom once at reading pace; write one word per act. An act with no word is a finding.
- [ ] Diff the felt curve against the intended curve; where they disagree, fix the page, not the brief.
- [ ] The peak is the largest visual change and gets the most scroll room; the act before it is quieter.
- [ ] The last screen can stand still with content on it (resolves, does not just end).
- [ ] Two adjacent acts with the same word: cut one.

## Uniqueness gate (uniqueness.md section 4)
- [ ] Record 6 dimensions: grammar, nav treatment, hero device, act-sequence shape, close pattern, signature move.
- [ ] A new page/build differs from every prior row on >= 4 of 6. Change the plan, never the log.
- [ ] Pick a page grammar on purpose (filmic one-shot, chaptered editorial, live surface, continuous world, typographic poster, gallery, split stage, rhythmic cutlist).
