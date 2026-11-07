# UI/UX Pro Max: extracted checks (IA, tokens, mobile, a11y)

Source: nextlevelbuilder/ui-ux-pro-max-skill @ 4f2dbb6 (MIT). Not installed. Rule IDs are the skill's own.
Primary file: `cli/assets/templates/base/quick-reference.md` (QR); mobile-only extras from
`.claude/skills/ui-ux-pro-max/references/pro-rules.md` (PR); 120-row detail in `cli/assets/data/ux-guidelines.csv`.

## Information architecture / navigation (QR §9, §4, §5)
- [ ] `primary-action`: exactly one primary CTA per screen; secondary actions visibly subordinate.
- [ ] `navigation-consistency`: nav placement identical on every page; no per-page-type variation.
- [ ] `avoid-mixed-patterns`: no Tab + Sidebar + Bottom nav at the same hierarchy level.
- [ ] `nav-state-active`: current location highlighted (color + weight or indicator, not color alone).
- [ ] `nav-label-icon`: nav items have a text label; no icon-only primary nav.
- [ ] `bottom-nav-limit`: mobile bottom nav ≤ 5 items, top-level destinations only.
- [ ] `adaptive-navigation`: ≥1024px may use sidebar; small screens use top/bottom nav.
- [ ] `breadcrumb-web`: breadcrumbs for hierarchies 3+ levels deep.
- [ ] `deep-linking`: every key screen/state reachable by URL.
- [ ] `back-behavior` / `state-preservation`: Back restores scroll, filters and input; never silently resets to home.
- [ ] `modal-vs-navigation`: modals never used for primary navigation flows.
- [ ] `destructive-nav-separation`: logout/delete-account spatially separated from normal nav.
- [ ] `empty-nav-state`: unavailable destination explains why instead of disappearing.
- [ ] `content-priority`: core content first on mobile; secondary content folded.
- [ ] `visual-hierarchy`: hierarchy via size, spacing, contrast, not color alone.

## Design tokens (QR §4, §5, §6, §7; PR icons)
- [ ] `color-semantic`: components use semantic tokens (primary, surface, on-surface, error); no raw hex in components.
- [ ] `spacing-scale`: spacing on a 4/8px increment scale.
- [ ] `font-scale`: one consistent type scale (example 12/14/16/18/24/32).
- [ ] `weight-hierarchy`: headings 600–700, body 400, labels 500.
- [ ] `elevation-consistent`: one shadow/elevation scale; no ad-hoc shadow values.
- [ ] `z-index-management`: layered z-index scale (e.g. 0/10/20/40/100/1000), no magic numbers.
- [ ] `breakpoint-consistency`: systematic breakpoints (e.g. 375/768/1024/1440).
- [ ] `container-width`: one desktop max-width used everywhere.
- [ ] `motion-consistency`: shared duration/easing tokens, not per-component values.
- [ ] Icon sizes as tokens (icon-sm / icon-md = 24 / icon-lg); one stroke width per layer (1.5 or 2px); one icon set; filled vs outline not mixed at one level (PR).
- [ ] `dark-mode-pairing` / `color-dark-mode`: dark theme uses desaturated tonal variants (not inversion); contrast re-tested.

## Mobile (QR §2, §5, §8; PR)
- [ ] `touch-target-size`: ≥44×44pt (iOS) / 48×48dp (Android); expand hit area beyond visual bounds.
- [ ] `touch-spacing`: ≥8px between adjacent touch targets.
- [ ] `touch-friendly-input`: mobile input height ≥44px.
- [ ] `readable-font-size`: body ≥16px on mobile (prevents iOS zoom).
- [ ] `line-length-control`: 35–60 chars/line mobile, 60–75 desktop.
- [ ] `viewport-meta`: `width=device-width, initial-scale=1`; never disable zoom.
- [ ] `horizontal-scroll`: no horizontal page scroll at 375px.
- [ ] `viewport-units`: `min-h-dvh` instead of `100vh` for full-height mobile panes.
- [ ] `fixed-element-offset`: fixed header/bottom bar reserves padding for content beneath.
- [ ] `safe-area-awareness`: primary targets clear of notch, Dynamic Island, gesture bar.
- [ ] `hover-vs-tap`: no hover-only interactions.
- [ ] `tap-delay`: `touch-action: manipulation` on controls.
- [ ] `input-type-keyboard`: semantic `type`/`inputmode` (email, tel, number).
- [ ] `gesture-alternative`: every swipe/gesture action also has a visible control.
- [ ] `orientation-support`: usable in landscape.
- [ ] Tap feedback visible within 80–150ms (PR); `tap-feedback-speed` ≤100ms (QR §3).

## Accessibility (QR §1, §8)
- [ ] `color-contrast`: text 4.5:1, large text 3:1; `contrast-data` non-text/data marks 3:1.
- [ ] `focus-states`: visible 2–4px focus ring; `focus-not-obscured`: sticky UI never hides focused control (WCAG 2.2 AA).
- [ ] `web-target-size`: web pointer targets ≥24×24 CSS px (WCAG 2.5.8).
- [ ] `aria-labels` / `icon-context`: icon-only buttons named; decorative icons hidden.
- [ ] `keyboard-nav`: tab order equals visual order; `skip-links` present.
- [ ] `heading-hierarchy`: sequential h1→h6, no skipped level.
- [ ] `color-not-only`: status uses icon or text in addition to color.
- [ ] `reduced-motion`: animations reduced/disabled under `prefers-reduced-motion`.
- [ ] `auto-rotation-controls`: carousels/moving content have pause; stop on focus.
- [ ] `input-labels`: visible label per input, never placeholder-only.
- [ ] `error-placement`: error below field, linked with `aria-describedby`; `aria-live-errors` / `role="alert"`.
- [ ] `focus-management`: after failed submit focus the error summary or first invalid field.
- [ ] `toast-accessibility`: toasts don't steal focus; `aria-live="polite"`; auto-dismiss 3–5s (`toast-dismiss`).
- [ ] `disabled-states`: opacity 0.38–0.5 + semantic `disabled`.
- [ ] `accessible-authentication`: paste and password managers allowed.
- [ ] `focus-on-route-change`: move focus to main region after client-side navigation.

## Not adopted
Style/palette/font "recommendations" from the BM25 search (`search.py --design-system`) are generic
product-type presets and conflict with the anti-template goals in `frontend-design.md`. Use as lint only.
