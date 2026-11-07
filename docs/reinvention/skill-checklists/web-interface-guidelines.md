# Vercel Web Interface Guidelines: checklist

Source: vercel-labs/web-interface-guidelines @ 434b7f9 (MIT). Rules from `command.md` (the review prompt) plus
numeric items from `README.md`. Installed skill `~/.claude/skills/web-design-guidelines` WebFetches
`raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` at runtime (unpinned `main`).
Output format: group by file, `file:line - issue`, `✓ pass` for clean files.

## Accessibility & focus
- [ ] Icon-only buttons have `aria-label`; decorative icons `aria-hidden="true"`.
- [ ] Every control has `<label>`/`aria-label`; labels clickable (`htmlFor` or wrapping).
- [ ] `<button>` for actions, `<a>`/`<Link>` for navigation; no `<div onClick>`; non-native controls have key handlers.
- [ ] `<img>` has `alt` (`""` if decorative).
- [ ] Toasts and inline validation use `aria-live="polite"`.
- [ ] Hierarchical h1–h6, skip link, `scroll-margin-top` on anchored headings.
- [ ] `:focus-visible` ring on every interactive element; `:focus-within` for grouped controls; no `outline-none` without replacement.
- [ ] Sticky headers/footers/overlays never cover the focused element.
- [ ] Media: captions/transcripts; keyboard-operable controls.

## Targets, touch, mobile
- [ ] Hit target ≥24px (mobile ≥44px); expand hit area when visual <24px.
- [ ] Mobile `<input>` font-size ≥16px. (README also offers `maximum-scale=1` — rejected: conflicts with "never disable zoom".)
- [ ] No `user-scalable=no` / `maximum-scale=1`.
- [ ] `touch-action: manipulation`; `-webkit-tap-highlight-color` set intentionally.
- [ ] `overscroll-behavior: contain` in modals/drawers/sheets; `none` on `<html>` only inside `@media (pointer: fine)`.
- [ ] Drag/swipe/pinch have tap/click + keyboard alternatives; during drag disable selection and set `inert`.
- [ ] `autoFocus` only desktop, single primary input.
- [ ] Full-bleed layouts use `env(safe-area-inset-*)`.

## Forms
- [ ] `autocomplete` + meaningful `name`; correct `type` and `inputmode`; `spellCheck={false}` on email/code/username.
- [ ] Never block paste; never block typing (accept, then validate).
- [ ] Submit enabled until request starts, then disabled with spinner (+ idempotency key); incomplete submits allowed.
- [ ] Errors inline next to field; focus first error on submit.
- [ ] Placeholders end with `…` and show an example pattern.
- [ ] Enter submits single input; ⌘/Ctrl+Enter submits textarea.
- [ ] Warn on unsaved changes before navigation; trim values; checkbox/radio label + control share one hit target.
- [ ] Non-auth fields avoid password-manager triggers (`autocomplete="off"` or specific token).

## Loading, state, navigation
- [ ] Loading buttons keep original label + indicator; loading copy ends with `…` ("Saving…").
- [ ] Spinner/skeleton show-delay ~150–300ms and minimum visible ~300–500ms.
- [ ] URL reflects state: filters, tabs, pagination, expanded panels (deep-link all `useState` UI).
- [ ] Back/Forward restores scroll.
- [ ] Destructive actions need confirmation or an undo window.
- [ ] Optimistic updates roll back or offer Undo on failure.
- [ ] `POST/PATCH/DELETE` complete <500ms (README perf budget).

## Animation
- [ ] `prefers-reduced-motion` variant; muted decorative loops stop under it.
- [ ] Animate `transform`/`opacity` only; never `transition: all`.
- [ ] Correct `transform-origin`; SVG transforms on `<g>` with `transform-box: fill-box; transform-origin: center`.
- [ ] Interruptible by input; autoplay >5s alongside content has pause/stop/hide.

## Typography & content
- [ ] `…` not `...`; curly quotes; `&nbsp;` in `10&nbsp;MB`, `⌘&nbsp;K`, brand names.
- [ ] `tabular-nums` on number columns/comparisons; `text-wrap: balance`/`pretty` on headings.
- [ ] Long content handled: `truncate`/`line-clamp`/`break-words`; flex children `min-w-0`.
- [ ] Empty, sparse, dense and error states designed; no dead ends.
- [ ] Skeletons match final layout exactly; `<title>` reflects current context.
- [ ] Optical alignment ±1px where perception beats geometry (README Layout).

## Images & performance
- [ ] `<img>` explicit `width`/`height`; below fold `loading="lazy"`; hero `priority`/`fetchpriority="high"`.
- [ ] Lists >50 items virtualized or `content-visibility: auto`.
- [ ] No layout reads in render; batch DOM reads/writes.
- [ ] `<link rel="preconnect">` for asset origins; critical fonts preloaded with `font-display: swap`; subset fonts.
- [ ] Video (`autoplay muted loop playsinline`) over GIF, with still fallback.

## Theming, i18n, hydration
- [ ] `color-scheme: dark` on `<html>` in dark theme; `<meta name="theme-color">` matches background.
- [ ] Native `<select>` has explicit `background-color` and `color`.
- [ ] Hover/active/focus states have more contrast than rest.
- [ ] Layered shadows (≥2 layers); child radius ≤ parent and concentric (README Design).
- [ ] `Intl.DateTimeFormat` / `Intl.NumberFormat`; language from `Accept-Language`, not IP; `translate="no"` on brand/code tokens.
- [ ] Controlled inputs have `onChange`; guard date rendering against hydration mismatch.

## Copy (Vercel-specific, README "Vercel-specific")
- Active voice, second person, numerals for counts, specific button labels, errors give the fix.
- Title Case for headings/buttons is Vercel brand preference — conflicts with jakubkrehel and frontend-design
  (sentence case). Pick one project-wide; do not apply this rule blindly.
