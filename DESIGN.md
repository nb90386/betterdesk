---
name: BetterDesk
description: Porcelain daylight, graphite ink, one vermilion route from the missed call to the booked time.
colors:
  porcelain: "#f2f2ef"
  porcelain-2: "#e9e9e5"
  surface: "#fbfbf9"
  ink: "#101214"
  ink-2: "#2b2e33"
  muted: "#595d65"
  rule: "#d5d5d0"
  rule-strong: "#b4b4ae"
  graphite: "#0b0c0e"
  graphite-2: "#141619"
  graphite-3: "#1e2125"
  graphite-rule: "#2a2e34"
  graphite-muted: "#a2a6ad"
  graphite-ink: "#f4f4f1"
  signal: "#e2462c"
  signal-ink: "#b3321b"
  signal-bright: "#ff6a4f"
typography:
  hero: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(2.6rem, 1.2rem + 5.6vw, 5.75rem)", fontWeight: 600, lineHeight: 0.96, letterSpacing: "-0.038em", fontVariation: "'wdth' 92" }
  display: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(2.1rem, 1.2rem + 3.4vw, 4rem)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.032em", fontVariation: "'wdth' 94" }
  title: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.4rem)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.024em", fontVariation: "'wdth' 96" }
  lede: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.35rem)", fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.008em" }
  body: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.55, fontFeature: "'ss01' on" }
  small: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.45 }
  label: { fontFamily: "Instrument Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "0.8125rem", fontWeight: 550, letterSpacing: "0.005em" }
  mono: { fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace", fontSize: "0.8125rem", fontWeight: 400, fontFeature: "'tnum' on" }
rounded: { xs: "4px", sm: "8px", md: "12px", lg: "16px" }
spacing: { gutter-mobile: "16px", gutter-tablet: "32px", gutter-desktop: "48px", container: "82rem", section-mobile: "96px", section-desktop: "128px" }
components:
  button-primary: { backgroundColor: "{colors.ink}", textColor: "{colors.porcelain}", rounded: "{rounded.sm}", padding: "0 20px", height: "48px" }
  button-primary-hover: { backgroundColor: "{colors.ink-2}" }
  button-secondary: { backgroundColor: "transparent", textColor: "{colors.ink}", rounded: "{rounded.sm}", padding: "0 20px", height: "48px" }
  button-quiet: { textColor: "{colors.ink}", padding: "0", height: "44px" }
  input-field: { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", rounded: "{rounded.md}", padding: "0 14px", height: "48px" }
  panel: { backgroundColor: "{colors.surface}", rounded: "{rounded.lg}" }
  panel-graphite: { backgroundColor: "{colors.graphite-2}", textColor: "{colors.graphite-ink}", rounded: "{rounded.lg}" }
  message-bubble: { backgroundColor: "{colors.porcelain-2}", textColor: "{colors.ink}", rounded: "{rounded.md}", padding: "12px 14px" }
  nav-link: { textColor: "{colors.ink-2}", typography: "{typography.small}" }
---

# Design System: BetterDesk

## Overview

**Creative North Star: "The Route"**

A porcelain table in window daylight, with graphite objects set on it and one vermilion line crossing between them. The line is the customer's inquiry travelling toward a booked appointment, and it is the only color in the system. Every surface restates it in its own form: the stroke of the mark, the line under a subpage title that ends on a point, the vertical rail of a process list, the progress rail of the scroll film.

Pages are editorial and ruled, not carded: plans, comparisons, modes and limits sit in hairline-ruled rows and columns on the porcelain ground. Depth belongs to the few physical objects (the call slab, the reply card, the schedule), lit by one key light from the upper left. Dark appears only where the story calls for it: the call object, the rules panels, the graphite close.

**Key Characteristics:**
- One family (Instrument Sans variable) condensed and tightened at display sizes; Geist Mono only for clock times and phone numbers.
- One accent, vermilion, used for lines, points and focus, never for fills of large areas.
- Solid ink means certainty: the primary action and the booked state are ink, not color.
- Hairline rules over cards; real-offset shadows only on objects.

## Colors

Warm-neutral porcelain and cool graphite, with a single vermilion signal.

### Primary
- **Route Vermilion** (signal): the route itself. Lines, station dots, the logo point, focus rings, caret, the active nav underline, input error borders. Graphics only; it is 3.4:1 on porcelain.
- **Vermilion Ink** (signal-ink): vermilion as text on porcelain (error messages, hover state of a solution title). Inside `.tone-dark` it remaps to Bright Vermilion.
- **Bright Vermilion** (signal-bright): the route on graphite (ring arcs, the travelling pulse, rule-arrow connectors).

### Neutral
- **Porcelain** / **Porcelain 2**: page ground; recessed bands and message bubbles.
- **Surface**: objects that sit on the table (panels, cards, inputs).
- **Ink** / **Ink 2**: primary text and the primary button; secondary text in body copy and table cells.
- **Muted**: captions, help text, labels (6.0:1 on porcelain).
- **Rule** / **Rule Strong**: hairlines between rows; button and input strokes.
- **Graphite** / **Graphite 2** / **Graphite 3**: the dark act ground; call slab and thread panels; avatars and raised chips on graphite.
- **Graphite Rule**, **Graphite Muted**, **Graphite Ink**: dividers, secondary text (7.7:1) and primary text on graphite.

**The One Line Rule.** Vermilion is the route and nothing else. No second accent, no gradient text, no colored fills behind sections.

**The Certainty Is Ink Rule.** Booked states and the primary action are solid ink (inverting to graphite-ink on dark), never vermilion.

**The Tone Scope Rule.** Dark sections use `.tone-dark` (with `data-tone="dark"` so the header can follow), which remaps ink, muted, rule and surface; shared primitives must read tokens, never hard-coded light values.

## Typography

**Display and Body Font:** Instrument Sans variable (wght 400 to 700, wdth 75 to 100), fallback Helvetica Neue, system-ui
**Mono Font:** Geist Mono, for times and phone numbers only

**Character:** One voice that changes posture with size: display sizes condense (wdth 92 to 96) and tighten tracking as they grow; text stays at full width with the ss01 alternates on.

### Hierarchy
- **Hero** (600, clamp 2.6 to 5.75rem, 0.96): the homepage H1 only, max about 11ch.
- **Display** (600, clamp 2.1 to 4rem, 1.0): subpage H1 and the closing statement, max 13 to 17ch.
- **Title** (600, clamp 1.6 to 2.4rem, 1.08): section headings, max 12 to 20ch.
- **Lede** (400, clamp 1.125 to 1.35rem, 1.45): the paragraph under a hero or display heading, in Ink 2, max 38 to 46ch.
- **Body** (400, 1.0625rem, 1.55): running text; list and row copy steps to 1rem or 0.9375rem with snug leading.
- **Label** (550, 0.8125rem, +0.005em, sentence case, Muted): column and list headings, footer group titles, data labels.
- **Mono** (0.8125rem or 0.75rem, tabular): clock times and phone numbers.

**The Measurement Rule.** Mono is for measurements only (times, phone numbers). Prices and counts use the sans with tabular numerals.

**The Sentence Case Rule.** Labels are small, sentence case and muted. They head a list or column; they never sit as an uppercase kicker above a headline.

## Layout

A centered container (82rem max) with 16px, 32px and 48px gutters at mobile, 640px and 1280px. Content sits on a 12-column grid at `lg`: text-led spreads split 5/7, 6/5 with an offset start, or 4/8 with a sticky title. Sections are 96px tall-padded on mobile and 128px from `md`, separated by a single rule rather than color bands. Headings are left-aligned; nothing is centered except short mobile CTA captions. The header is 64px and fixed, so anchors scroll with 5rem padding. Interactive targets are at least 44px (buttons 48px). An extra `xs` breakpoint exists at 25rem.

The homepage is a five-act scroll film: hero with layered parallax; a missed-call moment; a pinned scroll-scrubbed thread through five stations with Play/Pause and a transcript; a masked reveal of approved answers; a porcelain close. Subpages open with the route arriving from the left margin under the title.

## Elevation & Depth

A hybrid: rows and tables are flat and ruled; physical objects carry soft shadows that fall down and to the right from a single upper-left key light, with an inset top highlight. Each porcelain opening carries a white radial falloff from the upper-left corner. Graphite objects add a 135 degree specular wash (white at 10% fading out).

### Shadow Vocabulary
- **Rest**: the default panel on porcelain.
- **Lift**: an object held closer (contact form panel, inbox canvas).
- **Object**: hero and story objects (call slab, reply card, answers panel).
- **Graphite**: panels on the dark act, edged with a faint white ring.

**The Window Light Rule.** Shadows always have offset down-right. No zero-offset glows; the only emissive effect is the drop-shadow on the travelling route pulse.

**The Camera Blur Rule.** Blur is focus, not decoration: the hero schedule sits behind the focal plane and pulls into focus, new messages arrive from a 6px defocus, and the header frosts only while content scrolls under it. Body text is never blurred.

## Shapes

Radii are 4, 8, 12 and 16px, stepping down one size when nested: panels 16px, inputs and bubbles 12px, buttons 8px, focus outline and small links 2 to 4px. True circles are only for avatars, station dots, ring arcs and the route point. Lines are 1px hairlines; a 2px ink rule marks a featured or result column. Line icons are hand-drawn SVG at a 1.5 to 1.6 stroke with round caps.

**The No Capsule Rule.** No pill-shaped nav links, badges or buttons.

## Components

### Buttons
- **Shape:** gently squared (8px), min height 48px, 1rem at weight 550, tracking -0.01em.
- **Primary:** ink fill, porcelain text, 20px side padding, inset top highlight and a short dark drop. On graphite it inverts to light ink with graphite text.
- **Hover / Focus / Active:** primary hovers to Ink 2; secondary darkens its stroke to ink; focus is the global 2px vermilion outline at 3px offset; press scales to 0.975 in 60ms.
- **Secondary:** transparent with a Rule Strong stroke.
- **Quiet:** an underlined text link that turns its underline vermilion on hover, usually followed by the 16px arrow.

### Cards / Containers
- **Panel:** Surface on porcelain, 16px, Rest shadow. **Graphite panel:** a near-black vertical gradient, 16px, Graphite shadow, divided by Graphite Rule.
- **Message bubble:** Porcelain 2 at 12px, 0.9375rem snug text, with a mono timestamp; the booked row uses an ink check at weight 550.
- Plans, modes and limits are not cards: they are ruled rows under an ink top rule.

### Inputs / Fields
- **Style:** Surface fill, Rule Strong stroke, 12px, min height 48px, 1rem text, vermilion caret. Selects use a drawn chevron.
- **Focus:** stroke shifts to ink. **Error:** vermilion stroke with Vermilion Ink message below.
- **Range slider:** a 2px track filled vermilion to the value, with a 20px Surface thumb.

### Navigation
- Fixed 64px bar, transparent at top, frosting to porcelain at 78% (or graphite at 72% over a dark act). Links are 0.9375rem in Ink 2; hover and current page draw a 1px vermilion underline from the left. Mobile opens a full-height porcelain sheet of 1.6rem ruled rows, with a vermilion dot marking the current page and a full-width ink CTA at the bottom.

### Route Rail (signature)
A 1px vertical vermilion line with hollow stations (vermilion stroke, porcelain fill); the last station is filled. Used for process steps and "what happens next". The horizontal form ends on a 12px vermilion point under subpage titles.

## Do's and Don'ts

### Do:
- **Do** draw the route as a 1px vermilion line that ends on a point or a filled station.
- **Do** use ruled rows and columns (rule hairlines under a 1px or 2px ink top rule) for plans, comparisons and lists.
- **Do** read tokens inside `.tone-dark` so primitives invert on graphite without forks.
- **Do** render every motion act statically with full content under reduced motion.

### Don't:
- **Don't** use vermilion for text on porcelain below the Vermilion Ink value, or as a large fill.
- **Don't** add a second accent, gradient text, neon or glows.
- **Don't** set uppercase kickers or pill eyebrows above headings.
- **Don't** use mono for prices, labels or body copy.
- **Don't** introduce zero-offset or colored shadows.
