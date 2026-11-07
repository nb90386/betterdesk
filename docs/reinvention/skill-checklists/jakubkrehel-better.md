# jakubkrehel/skills "better-*": extracted rules

Source: jakubkrehel/skills @ 157da62 (MIT, plugin `interfaces` v1.19.0). Not installed. Paths under `skills/`.
Values marked exact are exact in the source (e.g. 0.96, not 0.95). Ownership: each rule lives in one skill.

## better-interface (orchestrator: `better-interface/SKILL.md`)
- Runs domains in order: accessibility, layout, writing, typography, colors, ui. Missing skill = `Not reviewed`.
- HIGH on sight (escalation triggers): control with no accessible name; no visible focus; pointer-only path;
  motion ignoring reduced-motion; clipping at 320px width or 200% zoom; failing text contrast; meaning by color
  alone; destructive action with no confirm/undo/distinct style; truncation with no way to full value; hidden
  content with no visible cue; error with no recovery; semantic color misused; state change carried only by motion.
- Verdict `Block` if any HIGH; never `Approve` uninspected coverage. Report row: Severity | file:line | Before | After | Why.

## better-ui (`better-ui/SKILL.md`, `surfaces.md`, `animations.md`, `icons.md`)
- [ ] Nested radius: outer = inner + padding + border (e.g. 12 + 8 = 20px). Past 24px padding treat as separate surfaces.
- [ ] Optical alignment: icon side of a button gets 2px less padding (16px text side / 14px icon side); play triangle nudged ~2px toward its point; fix asymmetric glyphs in the SVG.
- [ ] Borders only for structure (dividers, table cells, selected, inputs); depth via layered shadow:
      `0 0 0 1px oklch(0 0 0/.06), 0 1px 2px -1px oklch(0 0 0/.06), 0 2px 4px 0 oklch(0 0 0/.04)`.
- [ ] Shadow ring keeps `border: 1px solid transparent` for forced-colors.
- [ ] Content images: `outline: 1px solid` `oklch(0 0 0/0.1)` light / `oklch(1 0 0/0.1)` dark, `outline-offset: -1px`; never tinted.
- [ ] Interactive state uses transitions (reversible), never keyframes on toggled classes.
- [ ] Press: `scale(0.96)`, 150ms, ease-out; never on disabled; opt-out prop available.
- [ ] High-frequency (hover rows, tabs, keystrokes): instant or ≤150ms on opacity/background-color only.
- [ ] Staged entrance: chunks 100ms apart, each opacity + 4px blur + 12px translateY, 300ms ease-out. Never on routine UI.
- [ ] Exit: opacity + 4px blur + fixed -12px translateY, 150ms ease-out (never full container height).
- [ ] `AnimatePresence initial={false}` on state swaps (not on intentional hero entrance).
- [ ] Icon swap: scale 0.25→1, opacity 0→1, blur 4px→0; spring `{duration: 0.3, bounce: 0}` or 300ms `cubic-bezier(0.2,0,0,1)`. Bounce always 0.
- [ ] Theme switch suppresses all transitions for one frame.
- [ ] No `transition: all`; `will-change` only after observed stutter, naming the property.
- [ ] Hover styles inside `@media (hover: hover)`; `-webkit-tap-highlight-color: transparent` where custom pressed state exists.
- [ ] `overscroll-behavior: contain` on scrollable dialogs/drawers/menus.
- [ ] Icon stroke tracks text weight: 1.5px at 400 → 2.5px at 700; `currentColor`; one library per surface; outline default, fill = active.
- [ ] Every animated change also leaves a static cue (color, icon, label).

## better-typography (`better-typography/SKILL.md`, `spacing-and-sizing.md`)
- [ ] ≤3 font families; pairs must contrast (serif + sans, not two similar sans).
- [ ] Below 18px weight ≥400; weights 100–300 only at ≥28px.
- [ ] Starter scale: Display 36px/1.1/600, Title 24px/1.2/600, Heading 18px/1.3/600, Body 16px/1.5/400, Caption 13px/1.4/400.
- [ ] Line-height unitless: display 1.1, headings 1.2–1.3, body 1.5–1.6; anything wrapping to 3+ lines ≥1.4.
- [ ] Tracking: headings ≥24px -0.01 to -0.02em; uppercase labels ≤14px +0.05em; body 0; always `em`.
- [ ] Measure capped at 60–75 characters.
- [ ] `text-wrap: balance` on headings/short text only; `pretty` on paragraphs; no `justify` in UI.
- [ ] `tabular-nums` on timers, counters, prices, numeric columns.
- [ ] Size floors: long-form 16px; UI inputs/menus 14px; captions 13px; rarely <12px; `font-size` in rem.
- [ ] Inputs ≥16px on iOS (`text-base sm:text-sm` or scale trick).
- [ ] Use properties (`font-weight`, `font-variant-numeric`) over raw `font-feature-settings`/`font-variation-settings`.
- [ ] Load every weight used (no synthesized bold/italic).
- [ ] Typographic punctuation: `…`, en dash for ranges, curly quotes; case via `text-transform`.
- [ ] Antialiasing once on root; `text-box: trim-both cap alphabetic` in buttons/badges (progressive).
- [ ] Truncation always has a path to the full text.

## better-layout (`better-layout/SKILL.md`, `spacing-and-adaptivity.md`)
- [ ] Group with space first: gap between groups ≥2× gap within (8px inside → ≥16px between).
- [ ] One spacing step per nesting level (16px default); few shared alignment edges.
- [ ] Controls visibly distinct from content (shape, border, underline or toolbar zone).
- [ ] DOM order = visual order (no `order`, `row-reverse` reordering).
- [ ] One primary action per view; >3 secondary actions go behind a menu.
- [ ] Hidden content cue: next item peeks 16–32px past scroll edge, or disclosure control.
- [ ] Clearance: 12px between bordered controls; 24px between glyphs of borderless controls.
- [ ] Full-width mobile buttons inset ~16px inline.
- [ ] `scroll-padding-block-start` = sticky header height.
- [ ] Logical properties (`margin-inline-start`, `text-align: start`).
- [ ] Detection: `minmax(0,1fr)` / `min-width: 0` for long-text tracks; `100%` not `100vw`; `100dvh` not `100vh`;
      `min-height` not fixed `height` on text boxes; `@container` in reusable components; `viewport-fit=cover` if using safe-area env.
- [ ] Breakpoints from content; test with German / pseudo-localized strings.

## better-accessibility (`better-accessibility/SKILL.md`, `hit-areas.md`)
- [ ] Targets: WCAG 2.5.8 AA 24×24px; aim 44×44 touch, 40×40 desktop; extend via pseudo-element; no overlap.
- [ ] Decorative overlay layers `pointer-events: none`.
- [ ] `:focus-visible` ring with 3:1 against adjacent colors; 2px solid perimeter is the AAA target; never `outline: none` without replacement.
- [ ] Focus never fully hidden by sticky chrome (2.4.11).
- [ ] Contrast: text 4.5:1; large (≥24px or ≥18.67px bold) 3:1; UI boundaries/graphics 3:1.
- [ ] `<dialog>.showModal()` or inert background + focus moved in and restored to trigger.
- [ ] Route change: update `document.title`, focus `<h1>`/`<main>`.
- [ ] Only `tabindex` 0 / -1; roving tabindex in composite widgets.
- [ ] Validate on submit (don't pre-disable submit); `aria-invalid` + `aria-describedby`; focus first invalid.
- [ ] Never block paste; valid `autocomplete`, `type`, `inputmode`.
- [ ] Live regions: `role="status"` mounted empty before text; `role="alert"` urgent only.
- [ ] Auto-moving content >5s has pause (2.2.2); toasts with action/error persist.
- [ ] Reduced motion: slides/scales become opacity cross-fades; parallax/autoplay off.
- [ ] 200% text resize and 320px reflow without horizontal scroll; no `maximum-scale=1`.
- [ ] Skip link first focusable when chrome precedes `<main>`; one `<main>`.

## better-colors (`better-colors/SKILL.md`, `contrast.md`)
- [ ] One neutral ramp, one accent ramp, only status ramps actually rendered.
- [ ] Primitives (`--blue-600`) never in components; components use role tokens (`--color-text-secondary`).
- [ ] Brand token named `accent` (avoid `--color-primary` vs `--color-text-primary` clash).
- [ ] One hue = one meaning; hues within 15° OKLCH count as the same color; status hue ≥15° from accent.
- [ ] One filled (primary) action per view; color on background, not label.
- [ ] Light-end ramp steps ~0.04–0.05 OKLCH L apart; chroma as proportion of each hue's max.
- [ ] Dark theme ≠ reversed light ramp: lower accent chroma, remeasure every pair.
- [ ] Measure rendered pair (incl. alpha) not page bg; white on Tailwind 500 usually fails, use 600.
- [ ] APCA reference: body Lc 75 (pref 90), labels/headlines Lc 60, large Lc 45, solid icons/UI Lc 30, dividers Lc 15.
- [ ] Fix contrast via lightness, not hue. Gradients `in oklab` (oklch if two-hue goes gray).
- [ ] One theme switching mechanism (media query OR `.dark` class, not both).

## better-writing (`better-writing/SKILL.md`, `patterns.md`)
- [ ] Inventory existing nouns/verbs first; one term per object across the product.
- [ ] Flow vocabulary fixed: "Get started" → "Continue"/"Next" → "Done".
- [ ] Buttons start with a verb + object ("Save draft"); never "OK", "Yes/No", "Let's go!".
- [ ] Links name destination; no "Click here"; suffix "Learn more about X".
- [ ] One capitalization policy per element type (sentence case default).
- [ ] Toggles describe the ON state; no "Don't…" labels.
- [ ] Errors: what failed + how to fix, beside the field; no "Oops", no "!", no blame.
- [ ] Destructive confirm: title "Delete 'Q3 report'?", body states loss + counts, buttons verb+object; prefer Undo for reversible frequent actions.
- [ ] Empty state: what this is + one next action; filtered empty names query + "Clear filters".
- [ ] Placeholder = realistic example (`name@example.com`), not instruction.
- [ ] Cut "successfully", routine "Please"; "you" not "the user"; no idioms.
- [ ] Whole strings with ICU plurals; `Intl` for dates/numbers.
