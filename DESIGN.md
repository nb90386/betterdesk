---
name: BetterDesk
description: After hours, then morning. A night desk lit by one amber lamp, resolving into pearl certainty.
colors:
  night: "#0d0e10"
  night-2: "#16181b"
  night-3: "#202327"
  night-rule: "#2c3036"
  night-muted: "#a4a8ae"
  night-ink: "#f7f6f3"
  night-ink-2: "#d4d6da"
  lamp: "#f4a947"
  signal: "#9a5208"
  signal-soft: "#f2e4cc"
  amber: "#8a5a0c"
  amber-soft: "#f2e5c9"
  paper: "#eeede9"
  paper-2: "#e4e3de"
  paper-3: "#d8d6d0"
  card: "#f8f7f4"
  ink: "#111214"
  ink-2: "#2a2c30"
  muted: "#55585e"
  faint: "#5d6066"
  rule: "#d3d1cb"
  rule-strong: "#b7b4ad"
  silver: "#c9ccd1"
  silver-2: "#8e939a"
  handled: "#2c5c4c"
  handled-soft: "#dde6e1"
  handled-bright: "#9fd8bb"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 0.9rem + 5.3vw, 5.6rem)"
    fontWeight: 540
    lineHeight: 0.98
    letterSpacing: "-0.034em"
  numeral:
    fontFamily: "Bricolage Grotesque, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.2rem, 2rem + 8vw, 8.5rem)"
    fontWeight: 540
    lineHeight: 0.86
    letterSpacing: "-0.034em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Bricolage Grotesque, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 2.6vw, 3.6rem)"
    fontWeight: 540
    lineHeight: 0.98
    letterSpacing: "-0.034em"
  title:
    fontFamily: "Bricolage Grotesque, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.02rem, 0.96rem + 0.3vw, 1.18rem)"
    lineHeight: 1.58
    fontFeature: "\"ss01\", \"cv11\""
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"ss01\", \"cv11\""
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0em"
  data:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.86rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "22px"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  container-max: "1280px"
  section-mobile: "80px"
  section-desktop: "112px"
  header-height: "64px"
  tap-min: "44px"
components:
  button-light:
    backgroundColor: "{colors.night-ink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-light-hover:
    backgroundColor: "#ffffff"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    textColor: "{colors.ink}"
    padding: "0"
    height: "44px"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "48px"
  stage-pane:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  pearl-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip-lamp:
    textColor: "{colors.lamp}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  nav-link:
    textColor: "{colors.night-ink-2}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
---

# Design System: BetterDesk

## Overview

**Creative North Star: "After Hours, Then Morning"**

The system is one evening at a service business, told from signal to certainty. Pages open on night graphite, lit by a single warm lamp off-frame at the upper left. As the conversation resolves, the ground brightens: night, then dusk, then a warm floor that carries into the night/pearl split, and finally a dawn band where the morning inbox sits on a pearl card. Amber always means something is coming in or still open. Pearl and solid ink always mean it is settled. Brushed silver is the quiet hardware in between.

Depth is physical, not decorative. Every highlight and shadow agrees with that one lamp. Edges catch light on the upper left, and cast shadows fall long, down and to the right. The lamp lights the ground as a large elliptical falloff. It is never a floating glow blob. All imagery is authored SVG and HTML product UI with labelled sample data: names, zip codes, time windows, a person taking over. There are no photos, renders, or integration logos.

The density is product-real. Small, exact UI type (11 to 15px) sits inside large, quiet display headlines. Dense scenes alternate with open space, and there is more air above a heading than below it. Motion follows the call and never decorates. The resolved scene is the static frame, and without motion the page still tells the whole story.

**Key Characteristics:**
- Night graphite ground with one amber lamp from the upper left; pearl for what is decided.
- Amber means incoming or unresolved; pearl and ink mean settled; green (handled) is product status only.
- Bricolage Grotesque display at weight 540 with tight tracking; Geist for everything you read; Geist Mono for digits.
- Stage panes edge-lit by the lamp; pearl cards are the brightest object on a night stage and cast the longest shadows.
- Pill-shaped actions; 6/10/14/22px corners for chips, controls, panes and stage objects.
- Sample data is always labelled in place.

## Colors

The palette is near-black graphite and cool pearl, joined by one warm amber light and one deep green status. Nothing is saturated except the lamp.

### Primary
- **Lamp Amber** (lamp): The only light source. Ringing-call rings, the active nav underline, the story progress rail and tick, status chips on night ("Replying", "Most popular"), timestamps on night, the mark's signal rings, and the skip-link. It appears only on night surfaces or inside dark objects, never as text on pearl.
- **Signal Umber** (signal): Amber's legible form on pearl: focus rings, field errors, the closing time in a timeline, emphasized second lines on pearl, and the short rule above each trust-strip item. Inside `.on-night` it remaps to Lamp Amber, so shared components read correctly on graphite.
- **Signal Wash** (signal-soft): Text selection on pearl and soft callouts (the "Covered by N bookings" note in the plan picker). It remaps to a dark umber wash (#3a2a14) on night.

### Secondary
- **Handled Pine** (handled) / **Pine Wash** (handled-soft) / **Pine Glow** (handled-bright): Booked and resolved status inside product UI only, such as booked slots, handled counts and the final setup step. Handled Pine is for pearl, and Pine Glow is its form on night.
- **Ledger Amber** (amber) / **Amber Wash** (amber-soft): The "waiting on you" status in the sample inbox and explorer. It is a status hue, not an accent.

### Neutral
- **Night Graphite** (night): The ground of the hero, header, subpage heroes, CTA close and the night half of the peak. It is a faint warm near-black, not pure black. It is also the `html` background and the theme color.
- **Stage Graphite** (night-2) / **Stage Raised** (night-3): The dusk band, stage objects and raised controls on night.
- **Night Rule** (night-rule): Hairlines on night. Most night dividers are written as white at 6 to 8% opacity.
- **Night Ink** (night-ink) / **Night Ink 2** (night-ink-2): Headlines and body copy on night. In the build these are mostly literal hex values inside night sections. The `.on-night` scope also remaps `ink` and `ink-2` to the same values.
- **Night Muted** (night-muted): Secondary copy on night, the muted second line of every two-tone headline, and captions. It holds 7.6:1 on Night Graphite.
- **Pearl** (paper) / **Pearl 2** (paper-2) / **Pearl 3** (paper-3): Daylight grounds, deliberately cool-neutral and not cream. Pearl 2 is used for tinted bands and segmented-control tracks, and Pearl 3 for busy calendar slots.
- **Card Stock** (card): The brightest pearl, used for cards, fields and the trust strip. Pearl cards on night use a #fbfaf7 to #efeee9 vertical gradient around this value.
- **Ink** (ink) / **Ink 2** (ink-2): Text and solid "settled" objects on pearl, including the primary button and check badges.
- **Muted** (muted) / **Faint** (faint): Secondary text and labels on pearl. Both pass AA, and Faint is deliberately only a little lighter than Muted.
- **Rule** (rule) / **Rule Strong** (rule-strong): Dividers, then outlines for fields and the secondary button.
- **Brushed Silver** (silver) / **Silver 2** (silver-2): Chrome copy on night, such as busy slots and idle story titles at desktop.

### Named Rules
**The One Lamp Rule.** Amber is the incoming signal and the only light. If something on the page is amber, it is either ringing, waiting, or lit by the lamp. It never marks something settled.

**The Settled-Is-Solid Rule.** Booked and decided states are solid pearl or solid ink, usually with an ink check badge. They are never outlined, dashed or amber. Dashed outlines are reserved for open or held slots.

**The Scope Swap Rule.** On graphite, wrap the subtree in `.on-night`, which remaps paper, ink, muted, faint, rule, signal and handled. Inside a night band, `.on-pearl` restores the daylight tokens for forms and receipts. `.on-night` does not remap `card`, so on night write Night Ink for light text instead of `card`.

## Typography

**Display Font:** Bricolage Grotesque, variable (opsz 12 to 96, wght 200 to 800), self-hosted (with Avenir Next, system-ui)
**Body Font:** Geist (with ui-sans-serif, system-ui, Segoe UI)
**Label/Mono Font:** Geist Mono (with ui-monospace, SF Mono, Menlo)

**Character:** Bricolage's optical sizing lets one family carry both a poster headline and an 18px card title, with warmth in its irregular grotesque shapes. Geist stays clear and neutral because clarity is the product's promise.

### Hierarchy
- **Display** (540, clamp 2.3 to 5.6rem, 0.98, -0.034em): The hero h1 only. It is a two-line statement whose second line drops to Night Muted. Subpage h1s use the same face at clamp 2.5 to 5rem.
- **Numeral** (540, clamp 4.2 to 8.5rem, 0.86, tabular): Giant clock times at the peak ("6:44" against "6:47"). This is the only place display type exceeds the hero size.
- **Headline** (540, clamp 2.1 to 3.6rem on pearl, 2 to 3.4rem on night bands, 0.98): Section h2s, often two-tone with a muted second clause, held to 15 to 18ch.
- **Title** (Bricolage at its default weight, 1.45 to 1.5rem, -0.015 to -0.02em): Card and row titles, the plan total, "This morning" and booked times. Big prices use 3.4rem at -0.03em.
- **Lede** (Geist 400, clamp 1.02 to 1.18rem, 1.58, max 58ch): Section introductions.
- **Body** (Geist 400, 0.95 to 1.05rem, relaxed 1.625, 40 to 50ch in heroes): Running copy, with stylistic sets ss01 and cv11 on.
- **Label** (Geist 500, 0.72 to 0.85rem, no tracking, sentence case): Status lines ("Booked · 6:47 PM"), field labels, captions, footer column heads.
- **Data** (Geist Mono 400, 0.66 to 0.95rem, tabular): Times, phone numbers, prices and numeric inputs.

### Named Rules
**The Digits-Only Mono Rule.** Geist Mono is set only on things that are literally data: clock times, phone numbers, amounts and numeric inputs. Words, labels and controls stay in Geist. The story rail tests this at runtime, setting a step's time in mono only when it contains a digit.

**The Two-Tone Headline Rule.** Major headlines split their thought, with the claim in ink and the consequence in the muted tone (Night Muted on night, Signal on pearl in the "with" ending). There is never a gradient on text.

**The Sentence-Case Label Rule.** Labels are 13px, weight 500, with zero tracking in sentence case. There are no uppercase tracked microlabels.

## Layout

Content sits in a single container that is 1280px max, with gutters of 20px on mobile, 32px from 640px and 48px from 1280px. Sections breathe at 80px vertically on mobile and 112px from md. Pearl sections that are not full-bleed use the container directly. Night and dusk bands are full-bleed, with the container nested inside.

The grid is asymmetric. The hero headline spans the full width above a 4/13 and 9/13 split: subcopy and CTAs on the left, the panoramic product scene on the right. The scene runs call node, then focal conversation pane, then schedule across three uneven columns (0.6 / 1.3 / 0.98fr). The scroll story uses 5/12 and 7/12 columns. On the left the steps each hold at least 40svh with a thin rail, and on the right a sticky stage shows a five-segment progress bar. The peak is a full-bleed 50/50 split, with each half's content capped at 640px and hugging the seam. The CTA close is 1.25fr / 1fr. Below lg, everything stacks in story order, CTAs become full-width stacked pills, and the story repeats each stage inline as a still frame.

The page rhythm is: night hero, dusk moments band (night-2), the night-to-warm scroll story, the night/pearl split peak, pearl sections (who it's for, pricing on a Pearl 2 tint, FAQ), and the dawn CTA close. Subpages open with a night hero that continues the header and hands off to pearl, and can optionally overlap the first pearl object up into the night.

The header is sticky, 64px tall, and opaque Night Graphite. Tap targets are at least 44px. A mobile-only sticky CTA bar appears after the first screen and hides once the closing band is visible.

## Elevation & Depth

Depth is lit, with one key light at the upper left. Objects carry an inset top highlight, a 1 to 2px contact shadow, and a long, soft cast shadow offset down and right, away from the lamp. On night, the focal object additionally catches amber on its upper-left inset edge and throws a faint amber bloom behind that corner. Grounds are lit by the radial lamp falloff from the upper left (amber at 16% fading out by 60%), with a faint silver counter-light at the lower right. No surface uses backdrop glass, and there is no grain. Night grain was retired in cycle 3.

### Shadow Vocabulary
- **Card** (`0 1px 0 rgb(255 255 255 / 0.85) inset, 0 1px 2px rgb(17 18 20 / 0.07), 0 10px 24px -14px rgb(17 18 20 / 0.28)`): Resting cards and selected segmented-control knobs on pearl.
- **Lift** (`0 1px 0 rgb(255 255 255 / 0.9) inset, 0 2px 4px rgb(17 18 20 / 0.06), 0 28px 48px -24px rgb(17 18 20 / 0.38)`): Raised product panels on pearl.
- **Device** (`0 0 0 1px rgb(17 18 20 / 0.1), 0 40px 70px -34px rgb(17 18 20 / 0.5), 0 14px 26px -18px rgb(17 18 20 / 0.3)`): Phone frames and the featured dark plan.
- **Stage** (`0 1px 0 rgb(255 255 255 / 0.07) inset, 0 0 0 1px rgb(255 255 255 / 0.045), 0 2px 3px rgb(0 0 0 / 0.5), 24px 44px 70px -30px rgb(0 0 0 / 0.85)`): Stage panes on night.
- **Pearl on Night** (six layers: white inset top, a 1px amber upper-left edge at 35%, contact, two long down-right casts, and an amber upper-left bloom): The settled pearl card on a night stage. It is the brightest and most lifted object in any night frame.
- **Focal** (amber inset upper-left edge at 22%, a 6% white ring, contact, a 28px 56px 90px cast, and a soft amber bloom): The single focal pane in the hero.

### Named Rules
**The Down-And-Right Rule.** Every cast shadow falls down and right, and every edge highlight sits upper left. A shadow that falls straight down or to the left contradicts the lamp.

**The Brightest-Is-Settled Rule.** On a night stage, the pearl card holding the settled outcome is the brightest and most elevated object. Nothing in progress outranks it.

## Shapes

Actions and avatars are pills and circles. Containers step up in radius with their scale: 6px for chips and small status tags, 8 to 10px for fields, segmented controls and schedule slots, 14px for cards, panes, message bubbles and the trust strip, and 22px for stage panes and night feature tiles. Message bubbles are 14px with the corner nearest the speaker tucked to 5px. Hairlines are 1px, using white at 6 to 8% on night and Rule on pearl. Dashed hairlines always mean open, held or unresolved, and a dashed amber thread links the call to the conversation. The mark is the system's geometry in miniature: a solid D stem in currentColor (certainty) with two open amber arcs (signal) closing onto it.

## Components

### Buttons
Buttons are confident, rounded and physical, and they compress slightly when pressed.
- **Shape:** Full pill (9999px), at least 44px tall, 20px horizontal padding, Geist 500 at 0.95rem. An optional trailing 14px arrow nudges 2px right on hover.
- **Light (main CTA on night):** Night Ink fill with Ink text, a white inset top edge, and an amber under-glow (`0 12px 28px -12px rgb(244 169 71 / 0.45)`). It goes to pure white on hover. "Book a demo" in the hero and the close uses this. The header version adds a 6px amber dot that turns Handled Pine on hover.
- **Primary (on pearl):** Ink fill with Card text and a dark drop shadow. It goes to Ink 2 on hover.
- **Secondary:** A Rule Strong outline over Card at 60%. On hover it becomes a solid Card fill with an ink-tinted border.
- **Ghost:** Bare Ink text with a Rule Strong underline at a 6px offset. The underline darkens to Ink on hover. It always sits beside a filled button as the quieter second path.
- **Press:** Every button scales to 0.97 on press (60ms in, 160ms out on the soft ease-out). Focus shows a 2px Signal outline at a 3px offset.

### Chips
- **Style:** A small status tag with a 6px radius, 0.7 to 0.74rem Geist 500, and a tinted fill. On night that is Lamp Amber text over amber at 12 to 15% ("Replying", "Most popular"), or white at 6% for neutral facts ("Mode: autonomous").
- **Sample tag:** A 12px muted label led by a 6px open ring, marking illustrative data in place.

### Cards / Containers
- **Corner Style:** 14px for cards, 22px for stage objects.
- **Background:** Card Stock on pearl. On night, a stage pane is a vertical gradient from #1b1d21 to #15171a. The featured plan is a dark #1b1d21 to #111214 gradient with an amber inset edge.
- **Shadow Strategy:** Card at rest on pearl, Stage on night, Pearl on Night for settled objects (see Elevation & Depth).
- **Border:** None on stage objects (the shadow ring stands in). Pearl plan cards use a 1px Rule border.
- **Internal Padding:** 20 to 28px (p-5 to p-7). Gap-px grids over a Rule ground produce hairline-divided strips (trust strip, pains list).

### Inputs / Fields
- **Style:** At least 48px tall, Card fill, a 1px Rule Strong border, 10px radius, 1rem Ink text. Labels sit above in Geist 500 at 0.9rem, with "Optional" in muted at weight 400. Selects carry an inline chevron SVG.
- **Focus:** The border shifts to Ink, and the global 2px Signal outline applies to keyboard focus.
- **Error:** The border turns Signal, with a 0.82rem Signal message below.
- **Range:** A 4px Rule track with a 22px Card thumb in a 2px Ink ring. On focus the thumb gains a Signal outline.

### Navigation
- **Desktop:** An opaque Night Graphite bar, 64px tall, with a hairline bottom (white at 6%). Links are 0.92rem Night Ink 2 pills that turn Night Ink on hover. The active page gets a 1px Lamp Amber underline that springs between links. The light "Book a demo" pill sits at the right.
- **Mobile:** A 44px round menu button on Stage Graphite. The menu is a full-height night sheet with links set in 1.7rem Bricolage, divided by hairlines. It ends in a full-width pill CTA and an email fallback. The page behind is made inert, and Escape closes the sheet.

### Night Desk scene (signature)
The hero's product scene runs left to right. It starts with a missed-call node: three amber rings expanding on loop and a phone glyph drawn in SVG. A dashed amber thread leads to the focal conversation stage pane, then to the Thursday schedule, where the pearl booked card settles into the 8:00 slot from the upper left (rotate -3deg, scale 1.03, to rest). A dashed amber "Holding for…" placeholder fades out beneath it. The pieces arrive in story order once (fade, rise and unblur, then bubble pops), then hold. Under reduced motion the resolved frame shows immediately and the rings are removed. A caption labels it as a sample.

### Signal story (signature)
Five steps run signal, reply, ask, route, then owner. On desktop, a thin left rail carries a 7px amber tick that slides to the active step, and idle titles dim to Silver 2. A sticky stage on the right shows a five-segment amber progress bar. The active step is derived from scroll position, so jumps and reloads land correctly. The section ground warms from night to #221d17 as the call resolves.

### Two endings (signature peak)
A full-bleed split of the same call. The night half has a warm-to-night gradient and a dim numeral "6:44" in #6f737a. The pearl half has a radial pearl gradient from the upper left and an ink numeral "6:47". Each half carries a mono-timed list with a hairline above, and the final settled time is in Signal.

### Plan picker / Morning inbox (pearl receipts)
These are pearl cards that state the outcome. Plan picker is a monthly receipt with a three-way segmented control. A Card knob with the Card shadow travels between options on the travel ease (320ms). Below are ink check badges with amber checks, an Ink rule above the total, and the total in 2.1rem tabular Bricolage. Morning inbox sits in the dawn close and lists the night's threads, with ink dots for done and amber dots for waiting on you.

### Motion
- **Easings:** soft ease-out `cubic-bezier(0.22, 1, 0.36, 1)` for arrivals, travel `cubic-bezier(0.65, 0, 0.35, 1)` for things moving between states, soft ease-in `cubic-bezier(0.55, 0, 0.78, 0.4)` for exits.
- **Durations:** 160ms quick, 220ms base, 420ms slow.
- **Reveal:** Sections rise 22px on a scroll-driven view timeline, through the first 42% of entry. Content is visible by default, and motion only adds travel.
- **Reduced motion:** All animation and transition durations collapse, looping rings are removed, and the night desk shows its resolved frame.

## Do's and Don'ts

### Do:
- **Do** light every night surface from the upper left: lamp-ground falloff on the floor, an amber inset edge on the focal object, and long casts falling down-right.
- **Do** make the settled outcome a pearl card or solid ink with an ink check badge, and make it the brightest object on a night stage.
- **Do** use Lamp Amber (#f4a947) for signal on night and Signal Umber (#9a5208) for signal on pearl. Swap them with `.on-night` / `.on-pearl` rather than hand-picking.
- **Do** set times, phone numbers, prices and numeric inputs in Geist Mono with tabular figures, and nothing else.
- **Do** label every piece of illustrative data in place with a sentence-case caption or a sample tag (open 6px ring).
- **Do** keep actions as 44px+ pills: light on night, ink on pearl, with a ghost underline link as the second path.
- **Do** let the ground brighten with resolution: night for the problem, warm dusk as it is handled, pearl for the decision, dawn for the close.

### Don't:
- **Don't** add uppercase tracked microlabels, kickers or eyebrows above headings. Section headings stand alone.
- **Don't** use mono for words, labels, buttons or section indexes.
- **Don't** reintroduce grain or noise overlays on night. They were retired in cycle 3 for raster cost.
- **Don't** use glass or backdrop blur as a surface treatment, gradient text, neon edges or floating glow blobs. Light falls on a surface; it does not hover.
- **Don't** use amber to mark a settled or booked state, and don't use Handled Pine outside product status.
- **Don't** cast shadows upward or to the left, or use hard offset shadows.
- **Don't** use stock photography, 3D renders or integration logos. Illustration is authored SVG and HTML product UI.
- **Don't** use `card` for light text inside `.on-night`, because it is not remapped there and stays pearl. Use Night Ink.
