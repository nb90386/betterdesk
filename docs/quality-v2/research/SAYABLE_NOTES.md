# Sayable craft notes (source-derived)

Scope: read-only study of `/Users/edge/Developer/projects/anything-research/sayable-site`. Live site: `http://localhost:3100` is up and is Sayable (title "Sayable · PDF accessibility audits..."; HTTP 200). The Vercel alias was blocked by the network allowlist.
**No screenshots were captured.** The Playwright install here has only firefox and webkit (no chromium). Both failed to launch inside the sandbox (webkit: `sandbox_extension_issue_file_to_process ... Operation not permitted`), and the request to run outside the sandbox was denied. Everything below comes from source and DESIGN.md. Visual claims are unverified by eye. `docs/quality-v2/screenshots/sayable/` is empty.

Key files: `src/app/globals.css` (tokens, type roles, buttons), `src/app/effects.css` (hero scene, dark scenes, nav, shadows), `src/lib/motion.ts`, `src/lib/useScrollVars.ts`, `src/components/story/Opening.tsx`, `DESIGN.md`, `MOTION-SYSTEM.md`, `REDESIGN-AUDIT.md`.

## Hero impact and composition
- Centred two-line claim ("Accessible documents. / Less guesswork.", second line in the accent blue) over one large object: a US-Letter permit form, drawn as SVG (850x1100 viewBox), not canvas or an image.
- The hero is a pinned stage: `.opening { height: 220vh }` (185vh on mobile) with `.opening-stage { position: sticky; top: 0; height: 100svh }` (`effects.css`).
- Scroll progress goes into one CSS variable. `useScrollVars` writes `--p` (0 to 1) on the section once per frame via rAF, gated by an IntersectionObserver, with no React re-render.
- Everything moves from `--p` in CSS:
  - Copy: `translateY(calc(var(--p) * -80px))`, opacity `clamp(0, 1 - p*4, 1)`.
  - Sheet: untilts from `rotateX(22deg)` to flat (`22deg - p*36deg`) inside `perspective: 2400px`, `transform-origin: 50% 0`, rises 46% of its height, scales 0.94 to 1.
  - Scan: `--s = clamp(0, (p-0.06)/0.74, 1)`. A 2px blue line sits at `top: s*100%`. A second SVG layer is revealed with `clip-path: inset(0 0 calc((1 - s)*100%) 0)`. Paths draw with `stroke-dashoffset: calc(100 - s*100)`.
- Above the fold it is readable before any scroll: headline, 52ch lede, one pill CTA plus a quiet chevron link, and three check-mark points.
- The reduced-motion state shows the resolved frame statically (`--s: 1`, no pin).
- The audit says the earlier version was a left-copy/right-product split, and this rebuild replaced it.

## Signature motif
- "The structure scan": one blue line that makes hidden document structure visible. The same sheet recurs in the audio chapter and the closing scene.
- The sheet has three layers (Paper, Broken, Fixed) in one SVG, with a rotated under-page behind it (`.permit-under`: `inset: 1.4% -1.2% -1.6% 1.4%; rotate(1.1deg)`).
- Colour is semantic. Blue means structure or the next action. Ember (a broken relationship) appears only where something is broken, never on buttons or hover.
- The footer ends on an oversized outlined wordmark at moon 30%.

## Typography
- Onest for every role (`next/font/google`, `display: swap`), JetBrains Mono (400/500, `preload: false`) only for text the file or computation says.
- Both fonts come from `next/font/google`, so there are no runtime requests to Google.
- Features: `font-feature-settings: "ss01"`, `text-wrap: balance` on headings and `pretty` on body text, tabular figures for numerals, slashed zero in mono.
- Scale is fluid clamp steps: step-5 `clamp(2.9rem, 1.9rem+4.4vw, 6rem)`, step-4 `clamp(2.5rem, 1.8rem+3.1vw, 4.6rem)`, step-0 `clamp(1.0625rem, 1.03rem+.16vw, 1.1875rem)`.

| Role | Weight | Line height | Tracking |
|---|---|---|---|
| Display | 650 | 0.98 | -0.042em |
| Headline | 640 | 1.02 | -0.036em |
| Title | 600 | 1.15 | -0.022em |
| Lede | 400 | 1.45 | -0.012em |
| Body | 400 | 1.58 | -0.006em |

- Hierarchy comes from size, weight and tracking. There is no second display face. Emphasis is colour, never italic.
- Chapter headlines are held to 14 to 17ch. Ledes are 38 to 52ch.
- The earlier serif-plus-italic look was dropped as a recognisable default (`REDESIGN-AUDIT.md`).

## Palette, material, lighting
- Tokens (`globals.css @theme`):
  - paper `#f8f9fb`, paper-deep `#eef1f5`, sheet `#fff`, surface `#e7ebf1`
  - ink `#12151b`, ink-soft `#3a414d`, muted `#535b69`
  - signal `#2458e8`, signal-deep `#1a44c2`, signal-wash `#e6edfd`, signal-light `#8fb0ff`
  - warm `#e5521f`, ember text `#b53d12`, ember-wash `#fdebe3`
  - night `#10141c`, moon `#f3f5f8`, moon-muted `#a9b1bf`
- Contrast ratios are documented per pairing (for example, signal-light on night is 8.62:1).
- Hairlines are ink at 10%, strong rules ink at 24%, night rules moon at 14%.
- No grain or noise texture. Material comes from layered shadows only. Only objects cast shadows, so buttons, rows and bands stay flat.
- Sheet shadow: `0 .5px 0 rgb(255 255 255/.9) inset, 0 1px 2px rgb(16 20 28/.06), 0 18px 36px -18px rgb(16 20 28/.22), 0 60px 110px -50px rgb(16 20 28/.38)`.
  - It has an inset top highlight, a contact shadow, and two large negative-spread ambient shadows.
  - On night it becomes `0 40px 90px -40px rgb(0 0 0/.9)` and the under-page turns `#dfe3ea`.
- Dark scenes use no hard cuts. `.scene-dark::before/::after` are 4 to 6.5rem gradients from paper through a `color-mix(in oklab, paper, night 70%)` midpoint to night.
- No gradients are used as decoration and there are no glass effects. The header has no `backdrop-filter` (it would trap the fixed mobile menu).
- Icons are CSS masks on inline SVG data URIs, so they inherit `currentColor` with no icon library.

## Depth
- Depth comes from the tilted sheet, the rotated under-page, the heavy soft shadows and the dark scenes, not from layered blobs.
- Radii: paper 6px, product windows 14 to 18px, fields 10px, actions and labels full pill. Rule: "A pill means interactive or labelled."

## Microinteractions and motion tokens (`src/lib/motion.ts`, `MOTION-SYSTEM.md`)
- Easings: entrance `cubic-bezier(.22,1,.36,1)`, travel `(.65,0,.35,1)`. CSS also defines out-quart `(.25,1,.5,1)`, out-expo `(.16,1,.3,1)` and in-out-quint `(.83,0,.17,1)`.
- Durations: UI 200ms, exit 160ms (20% shorter), knob travel 320ms, story 700ms, row stagger 30ms (capped at 10 rows), settle delay 12% of the parent's duration.
- Press: `scale(.97)`, 60ms in and 160ms back, with no spring.
- Hover on the primary button mixes 12% black in OKLab. The arrow nudges 2px with out-expo.
- Nav: one shared hover pill (`layoutId`) travels between items. Popovers grow from the trigger at 0.95 scale over 200ms and exit back toward it. The active item gets a 1.5px blue underline.
- Segmented control: one shared knob travels on `arc()` and stretches 12% mid-travel. Labels re-colour a beat later. The checkbox switch thumb stretches while pressed.
- Stage description crossfade: old and new text overlap in one grid cell, with a 2px blur on entry.
- Success feedback is one restrained 1.035 pulse after a confirmed save.
- Generic reveal: `[data-reveal]` rises 10px, 0.8s opacity and 1s transform, out-expo, per-element delay via `--d`.
- Reduced motion is a first-class state everywhere (knobs jump, popovers fade, staggers go to zero, the hero is static).

## Scroll choreography
- Only the hero is a scroll-scrubbed pinned scene. Other chapters trigger in view (inventory sheets sort over 1.1s out-expo after a 500ms delay, cost bars ease over 0.6s) rather than scrubbing.
- The redesign audit removed a dead pin (`min-h-[85vh]` stage articles that showed an unchanged sheet) and decorative ribbons. Every scroll effect has to carry information.
- Chapter order: opening scan, hear the form twice (dark), sort the collection, one file through five stages, estimator (band), method and sample report, audit offer (band), resolved form (dark close).

## Product clarity
- Every claim is demonstrated on one document ("show the document, not the pitch").
- Honesty labels are part of the components: "Illustrative sample. Fictional city.", the text-to-speech disclaimer, "Sample report · fictional city".
- Drawn documents carry text equivalents. Audio demos have transcripts.

## Navigation
- Fixed 3.5rem paper bar that gains a hairline on scroll. Wordmark left, "Request an Audit" pill right.
- Five entries, three of them disclosure popovers with a one-line note under each link. There is a separate mobile menu with staggered `menu-in` rows (40ms steps, 600ms out-expo).
- Focus rings are 2.5px blue with 3px offset. There is a skip link and a consent card (bottom-left, 26rem).

## Copy voice
- Plain and procedural: "Accessible documents. Less guesswork.", "Under the paper: five fields with no name, a title that is not a heading, and a footer read first."
- It uses concrete objects and numbers, and makes no inflated claims. `PRODUCT.md` bans "compliant", "certified" and "100% accessible", and also testimonials, logos and invented metrics.

## Section rhythm
- Light chapters pad `clamp(7rem, 14vh, 11rem)` and dark scenes `clamp(9rem, 18vh, 13rem)`.
- Light bands alternate paper and `#eef1f5`, with dark scenes between them. Every chapter opens the same way (centred headline, lede, one demo), but the demonstrations differ.
- The wrap is 82rem with a fluid gutter `clamp(1.1rem, .5rem+2.6vw, 3rem)`.

## Mobile composition
- It is designed rather than stacked. The hero shortens to 185vh and the tilt eases to 14deg. The sheet travels by `svh` units and the scan label pill is hidden.
- Annotation chips on the sheet are replaced by a numbered `.sheet-legend` list. The inventory becomes an ordered lane list.
- The estimator pins a three-figure result bar under the header. The hero points stack in one column. The consent card becomes a full-width bottom sheet.

## Performance approach
- Scroll work is CSS-variable driven with one rAF per frame and an IntersectionObserver gate. `will-change: transform` is used on the tilt layer only.
- The SVG is a single document and the icons are data-URI masks. There is no image or video hero. The mono font is not preloaded.
- The `motion` library is used only for nav and controls, behind a `MotionProvider` with a `features.ts`.

## 12 transferable craft lessons
1. Pick one hero object and make everything else defer to it. It should be large, centred and lit.
2. Drive scroll scenes from one progress variable (`--p`) in CSS, so the scene is cheap and rewindable.
3. Give the signature motif a meaning (the scan line reveals structure), not a decoration job.
4. Use one typeface family and get hierarchy from weight and tracking: 650 weight, -0.04em at display, -0.006em at body, line-height 0.98 to 1.02.
5. Give every colour a semantic job, so the accent is rare enough to mean something.
6. Build depth from stacked shadows (inset highlight, contact, two ambient with negative spread), and let only physical objects cast them.
7. Fade between light and dark sections through 5 to 10rem gradients, never hard cuts.
8. Keep one easing vocabulary (out-quint-like for entrances, in-out for travel) and short durations (200/160/320ms), with exits about 20% faster.
9. Make controls feel physical: a 0.97 press, a travelling shared knob, a popover that grows from its trigger.
10. Remove effects that carry no information (ribbons, dead pins), and run a self-audit that names which patterns read as generated.
11. Design mobile as its own composition (shorter pin, swap hover annotations for a legend, pin key numbers), not a stacked desktop.
12. Treat honesty and accessibility as craft: label every sample, give reduced motion a finished static state, and set contrast targets per pairing.
