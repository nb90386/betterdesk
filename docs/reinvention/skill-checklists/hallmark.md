# Hallmark checklist (sloplint gates)

Source: `~/.claude/skills/hallmark/references/gates.md` (installed copy; upstream Nutlope/hallmark @ 407fa68, v2.0.0, MIT).
Tiers: **Floor** = never ships; **Reflex** = fix, or waive in a CSS stamp with a page-specific reason; **Finish** = report only.
Class: M = static (CSS/TSX/Tailwind), R = rendered (`--url`), J = judged by eye.

## Run it
```bash
cd /Users/edge/Developer/betterdesk-redesign
# static tier (no network, writes nothing). Pass dirs explicitly: the installed copy skips a top-level "." path.
node ~/.claude/skills/hallmark/scripts/sloplint.mjs app components --scope page
# render tier against the dev or prod server (puppeteer-core 24.43.1 in node_modules + /Applications/Google Chrome)
node ~/.claude/skills/hallmark/scripts/sloplint.mjs app components --url http://localhost:3000/ --url http://localhost:3000/pricing
# add --json for machine output; exit code 1 on any FAIL or REFLEX
```
Render tier writes `.hallmark/shots/*.png` and `.hallmark/.gitignore` in cwd. Expect gate 20 (Hallmark stamp missing) to FAIL on any non-Hallmark build: treat as noise, not a defect.

## Colour and surface
- [ ] 2a Floor: no purple-to-blue / purple-to-pink / cyan-on-dark gradient anywhere, incl. `background-clip: text`.
- [ ] 2b: no gradient text in other hues (unless single-hue ramp, stops within 40deg).
- [ ] 7a Floor: no `#000`, `#fff`, `oklch(0%)`, `oklch(100%)` outside the token block; neutrals carry chroma >= 0.005.
- [ ] 23: accent covers <= 5% of any viewport (render FAIL past 8%).
- [ ] 29: no aurora/mesh blobs, blurred orbs, radial halos, zero-offset coloured glow on dark.
- [ ] 65: avoid cream paper + high-contrast serif + terracotta accent (the "named look").
- [ ] 74: no Tailwind stock swatch (indigo-500, violet-600, slate-900) as a token or utility.

## Type
- [ ] 1: display face is not Inter/Roboto/Open Sans/Poppins/Lato/system.
- [ ] 25: running prose max-width 45-75ch; rendered lines < ~88 chars.
- [ ] 37: <= 3 font families. 38i Floor: no single italic word in a roman heading. 38iii: no accent-coloured/underlined word in a heading.
- [ ] 55a Floor: wrapping uppercase display head has line-height >= 1.0 (1.02-1.08 recommended).
- [ ] 64: no monospace on labels/captions/meta/table heads unless content is code or a measurement.
- [ ] 67 Floor: no text <= 15px set uppercase/small-caps or tracked > 0.03em (wordmark excepted).
- [ ] 75 (R): running text >= 12px, functional text >= 11px, multi-line prose leading >= 1.3; body 16px at 1.5-1.65.

## Structure and layout
- [ ] 3: no three equal icon-above-heading tiles; no thick coloured side stripe on cards. 4 Floor: no card inside a card.
- [ ] 6a Floor: hero never sized in `vh` (use `dvh`/`svh`).
- [ ] 8/9 (J): not hero + 3 features + CTA + footer; sections not all separated by the same gap.
- [ ] 24a Floor: no raw padding/margin/gap where a `--space-*` token exists; <= 3 off-scale optical nudges.
- [ ] 34 Floor: no horizontal scroll 320-1920px; `overflow-x: clip` on html+body; no `100vw` widths.
- [ ] 44b Floor: headline, lede, primary action, focal visual all visible at 1280x800 without scroll.
- [ ] 44c: at 1440x900 the next section starts between y 760 and y 900.
- [ ] 44d Floor: at 1920 container capped 1360-1520px, gutters >= 120px, same column count.
- [ ] 50 Floor: image grid tracks use `minmax(0,1fr)`; display heads have `overflow-wrap: break-word; min-width: 0`.
- [ ] 56 Floor: never two `position: sticky; top: 0` elements.
- [ ] 58 Floor: <= ~80 words in any 900px window at 1440; hero has <= 2 text blocks before its actions.
- [ ] 59: section gaps >= 120px at 1440 (64px where the paper changes), and varied.
- [ ] 71: space above h2-h4 >= 2x space below. 72: padded boxes >= max(8px, .5em) sides; 16px phone gutter.
- [ ] 77/78: no thin sections (< 3/4 container); median h2 >= 40px at 1440. 79: <= 160px dead band below hero content.
- [ ] 80/81: no drawn SVG illustrations > 120px standing in for photos; no empty gradient picture blocks >= 300x200.
- [ ] 84 (J): no div-built mock of a product that exists; capture the real product.
- [ ] 85: page does not close on an email sign-up unless the job is subscribing.

## Chrome and copy
- [ ] 19 Floor: no Jane Doe/Acme, no seamless/robust/empower/elevate/unlock/world-class..., no em/en dashes, no "Learn more"/"Get started"/"Book a demo" as stock second action.
- [ ] 42: nav/footer shape decided, not default (wordmark-links-button; 4 link columns + social row).
- [ ] 46a Floor: no invented metric, testimonial, logo wall or case-study count.
- [ ] 47a Floor: no hand-drawn browser bar or traffic lights; 47b: at most one device frame, real content inside.
- [ ] 54 Floor: no eyebrow (short inert label above a heading, pill, ordinal, TRUSTED BY).
- [ ] 63 Floor: no `A · B · C` meta strings, no `Learn more →` glued arrows, no decorative status dots.
- [ ] 66: no scroll cues, BETA pills, locale strips, `01 / 4` tile counters. 69: a fact printed in <= 3 sections.
- [ ] 70 Floor: no form that prints success without a real request behind it.

## Motion and interaction
- [ ] 10a Floor: no `transition: all`; never animate width/height/top/left. 12: no bounce/overshoot easing on UI state.
- [ ] 15 Floor: focus ring appears instantly. 17: tooltip hover delay 800-1000ms, focus delay 0. 18: auto-rotation pauses on hover+focus.
- [ ] 26a Floor: every interactive element has `:focus-visible` at >= 3:1. 26b: `:active` and `:disabled` defined.
- [ ] 27 Floor: every keyframe/transform transition has a `prefers-reduced-motion: reduce` fallback.
- [ ] 28a Floor: autoplay video is `muted playsinline`; LCP element never `loading="lazy"`; LCP image `fetchpriority="high"`.
- [ ] 39a Floor: input border width constant across states, focus via outline, input height = adjacent button height. 39b: controls 44-52px on marketing pages.
- [ ] 62 Floor: no content hidden at rest that depends on JS to reveal (scope under `.js` or use `@starting-style`).

## Assets and access
- [ ] 30a Floor: no emoji as icon; 30b: one icon library. 33 Floor: decorative svg/canvas has `aria-hidden="true"`.
- [ ] 40 Floor: body text 4.5:1 (APCA Lc 60); large text, icons, rings, field edges 3:1.
- [ ] 41 Floor: button text distinct from its fill; no grey text on coloured surfaces.
- [ ] 48 Floor: no colour or font-family literal outside the token block.
- [ ] 49a Floor: button labels and primary nav links never wrap 320-1920px.
- [ ] 73 Floor (R): no text painted under another element. 76 Floor: no broken images; library photos credited.
