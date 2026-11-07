---
name: BetterDesk
description: Honed stone, satin-graphite directory boards, ink type, and one call-button lamp that only ever means "this needs you".
colors:
  stone: "#ecebe6"
  stone-2: "#e3e2dc"
  stone-3: "#d9d8d1"
  surface: "#f7f6f2"
  paper: "#fbfbf9"
  carbon: "#151719"
  carbon-2: "#3a3d41"
  slate: "#5d6065"
  hair: "#d3d2cb"
  hair-strong: "#b5b4ac"
  stroke: "#7f7e77"
  graphite: "#17191b"
  graphite-2: "#1d1f22"
  graphite-3: "#2a2d31"
  graphite-surface: "#23262a"
  graphite-rule: "#36393e"
  graphite-rule-strong: "#4a4d52"
  graphite-field: "#6c6f74"
  graphite-muted: "#a3a5a9"
  graphite-ink-2: "#cfd0cc"
  graphite-ink: "#eeede8"
  lamp: "#ffb547"
  lamp-deep: "#8a5200"
  lamp-wash: "#f6e6c8"
  danger: "#b42318"
  danger-wash: "#f8e4e1"
typography:
  hero: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(2.45rem, 1.25rem + 3.9vw, 4.6rem)", fontWeight: 620, lineHeight: 0.98, letterSpacing: "-0.038em" }
  display: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(2.1rem, 1.3rem + 3vw, 3.9rem)", fontWeight: 610, lineHeight: 1, letterSpacing: "-0.034em" }
  title: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(1.7rem, 1.15rem + 1.95vw, 3rem)", fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em" }
  head: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "1.1875rem", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.012em" }
  lede: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "clamp(1.125rem, 1.02rem + 0.4vw, 1.3125rem)", fontWeight: 420, lineHeight: 1.48, letterSpacing: "-0.006em" }
  body: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "1.0625rem", fontWeight: 420, lineHeight: 1.55 }
  small: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "0.9063rem", fontWeight: 420, lineHeight: 1.5 }
  label: { fontFamily: "General Sans, Helvetica Neue, system-ui, sans-serif", fontSize: "0.8125rem", fontWeight: 560, letterSpacing: "0.002em" }
  code: { fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace", fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.01em" }
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "32px"
  gutter-desktop: "56px"
  section: "80px"
  section-md: "112px"
  container: "84rem"
components:
  button-primary: { backgroundColor: "{colors.carbon}", textColor: "{colors.stone}", rounded: "{rounded.sm}", padding: "0 20px", height: "48px" }
  button-primary-hover: { backgroundColor: "{colors.carbon-2}", textColor: "{colors.stone}" }
  button-primary-on-graphite: { backgroundColor: "{colors.graphite-ink}", textColor: "{colors.graphite}", rounded: "{rounded.sm}", height: "48px" }
  button-outline: { backgroundColor: "transparent", textColor: "{colors.carbon}", rounded: "{rounded.sm}", padding: "0 20px", height: "48px" }
  app-button-secondary: { backgroundColor: "{colors.surface}", textColor: "{colors.carbon}", rounded: "{rounded.sm}", padding: "0 14px", height: "40px" }
  field: { backgroundColor: "{colors.paper}", textColor: "{colors.carbon}", rounded: "{rounded.sm}", padding: "10px 14px", height: "48px" }
  board: { backgroundColor: "{colors.graphite-2}", textColor: "{colors.graphite-ink}", rounded: "{rounded.md}" }
  paper: { backgroundColor: "{colors.paper}", textColor: "{colors.carbon}", rounded: "{rounded.md}" }
  popover: { backgroundColor: "{colors.paper}", textColor: "{colors.carbon}", rounded: "{rounded.md}", padding: "8px", width: "26rem" }
---

# Design System: BetterDesk

## Overview

**Creative North Star: "The Building Directory"**

Every business the customer deals with is one engraved line in a lobby directory, and the product's job is to move that line up the floors from Found to Customer. The page is honed stone; the product lives on satin-graphite directory boards set into it; type is ink; rules are hairlines; suite numbers are tabular and joined to names by dotted leaders. One colour is allowed to glow: an amber call-button lamp, and it means only "this needs you".

Density is calm on the marketing site (one idea per section, generous section padding) and working-dense in the `/app` workspace, which uses the same tokens in an operating register: paper panels on stone with one graphite board for whatever needs the user. The system refuses the split hero with a floating dashboard card and the dark AI-lab look of the previous version; graphite is a surface set into the stone, never the page.

**Key Characteristics:**
- Stone ground, paper sheets, graphite boards; three surfaces and no more.
- One family (General Sans, variable) that tightens as it grows; Martian Mono only for code-like evidence.
- State is a drawn mark plus words (lamp, tick, ring, x, off-dot), never a coloured pill.
- At most one lit lamp per view.
- Radii 4 / 8 / 12; buttons are 8px rectangles.
- Motion is functional: arrivals ease out, moves between stable positions ease in-out, and the climb up the directory is the only long move.

### The mark

A wall and an open door's swing, the symbol every walkthrough floor plan uses, set so it reads as a lowercase b. On a 32 grid: wall 5 x 26 at x=6, y=3 (corner radius 1.2); the swing is a quarter disc r=15.5 hinged at (13.5, 29). The gap between wall and swing is the door opening and must survive every size. The wordmark sits at 1.06em, weight 620, tracking -0.032em, with the mark at 1.2em and a 0.42em gap. The favicon (`app/icon.svg`) is the same mark knocked out in graphite-ink inside a graphite-2 tile (rx 7.5), scaled 0.72. Trademark clearance has NOT been performed; founder approval is pending.

## Colors

A near-achromatic warm-grey world with one amber lamp and one failure red.

### Primary
- **Call-Button Lamp** (lamp): the lit state mark and its glow, the focus ring on graphite, the caret. On graphite it is 9.4:1 against graphite-2. It is a mark, not a fill: never a button, background, or headline colour.
- **Lamp Ink** (lamp-deep): the lamp as text or mark on stone, 5.35:1. Used for the one "needs you" figure in a row (the time or action on the lit line).
- **Lamp Wash** (lamp-wash): background of the workspace attention notice only.

### Neutral
- **Honed Stone** (stone): the page ground, the header when scrolled (85% with blur), the theme colour. stone-2 and stone-3 are recesses (inbound message, quiet hover).
- **Surface / Paper** (surface, paper): alternate section bands and the paper sheets laid on stone; paper also fills inputs and the popover.
- **Carbon Ink** (carbon): all primary text and the primary button. 15.1:1 on stone, 17.3:1 on paper.
- **Carbon 2** (carbon-2): ledes and secondary body, 9.1:1 on stone.
- **Slate** (slate): muted text, labels, captions. 5.3:1 on stone, 5.8:1 on surface.
- **Hairline / Hairline Strong** (hair, hair-strong): decorative rules vs separators that must read.
- **Field Stroke** (stroke): input borders, 3.4:1 on stone and 3.8:1 on surface.
- **Graphite family** (graphite, graphite-2, graphite-3, graphite-surface): the directory board, graded top to bottom from graphite-3 to graphite; graphite-3 also lifts the held row.
- **Graphite inks** (graphite-ink 14.1:1, graphite-ink-2, graphite-muted 6.7:1 on graphite-2) and graphite rules/field for strokes on boards.
- **Danger** (danger, danger-wash): failure only (invalid field, destructive action, error notice). 5.5:1 on stone.

### Named Rules
**The One Lamp Rule.** The lamp means "needs you" and nothing else, and at most one lamp is lit per view. If two things need the user, the view is wrong, not the rule.

**The Scoped Ink Rule.** Never hard-code light-on-dark colours. Put content on a board with the graphite scope, which re-maps ink, muted, rule, field, surface, paper and lamp-ink; a paper object set on a board takes the stone scope back.

## Typography

**Display Font:** General Sans variable, 200 to 700 (fallback Helvetica Neue, system-ui; Arial metric adjustment). ITF Free Font License: self-host only, no subsetting or modification.
**Body Font:** General Sans, same file.
**Label/Mono Font:** Martian Mono (OFL), loaded without preload, for code-like evidence only: robots.txt lines, JSON-LD, event IDs.

**Character:** One grotesk that tightens as it grows: negative tracking scales from -0.006em at lede size to -0.038em at hero size, weights sit between 420 and 620 rather than at 400/700.

### Hierarchy
- **Hero** (620, clamp 2.45rem to 4.6rem, 0.98): the homepage h1 only, set as stacked one-line sentences.
- **Display** (610, clamp 2.1rem to 3.9rem, 1.0): route h1s, max ~18ch.
- **Title** (600, clamp 1.7rem to 3rem, 1.04): section h2s, max ~22ch.
- **Head** (600, 1.1875rem, 1.25): h3s inside sections and cards.
- **Lede** (420, clamp 1.125rem to 1.3125rem, 1.48, carbon-2): intro paragraphs, max 44ch (hero 46ch).
- **Body** (420, 1.0625rem, 1.55): running text, typically 52 to 68ch.
- **Small** (0.9063rem, 1.5) and **Label** (560, 0.8125rem, muted): captions, status words, sample notes, field labels.
- **Code** (Martian Mono, 0.75rem, 1.6): evidence only.
- **Workspace page title** (600, 1.75rem, -0.03em): `/app` h1s.

Headings balance their lines; paragraphs and list items use pretty wrapping. Numbers, times and `time` elements are tabular.

### Named Rules
**The Heading Carries Itself Rule.** Section headings stand alone: no eyebrow, kicker or category label above them.

**The Mono Is Evidence Rule.** Martian Mono appears only where the content is literally machine text.

## Layout

A single centred container (max 84rem) with gutters of 16px, 32px from 640px and 56px from 1280px. Marketing sections stack vertically with 80px block padding (112px from 768px), separated by a hairline top border and alternating stone and surface bands; inside, a 12-column grid at 1024px+ (typical split 4 / 8). The hero is left-aligned, headline across roughly eight columns, one primary plus one text link, then a full-width directory board from about 60% of the first viewport.

The directory line is the recurring layout unit: floor number column (2.25 to 2.5rem), floor label column (9rem, from 768px), the line itself, then a right-aligned tabular figure, with a dotted leader filling the run between name and figure. Below 768px the label column drops, details wrap under the name, and leaders hide.

Breakpoints: 400px (xs), 640, 768, 1024, 1280. The header nav becomes a full-height sheet below 768px. Grid children never grow to fit wide content; tables and code scroll in their own focusable region. The workspace uses a fixed left rail with the sample banner above, and stacks to a single column on mobile. Verified to 320px without horizontal overflow.

## Elevation & Depth

One key light from above. Paper sheets carry an inset top highlight and a short soft fall; boards are satin, with a faint top sheen, a 1px dark edge and a long soft drop. The header gains only a 1px bottom line and backdrop blur when scrolled. Depth otherwise comes from tonal layering (stone, surface, paper, graphite), not shadow.

### Shadow Vocabulary
- **Paper**: inset 0 1px white 70%; 0 1px 2px carbon 6%; 0 10px 24px -18px carbon 35%. Paper sheets on stone.
- **Board**: inset 0 1px white 7%; 0 0 0 1px black 25%; 0 2px 4px carbon 12%; 0 40px 80px -48px carbon 75%. Directory boards.
- **Held**: inset 0 1px white 6%; 0 10px 24px -14px black 80%. The one row lifted off a board (the climbing line).
- **Pop**: inset 0 1px white 60%; 0 0 0 1px carbon 8%; 0 12px 32px -12px carbon 35%. Popovers.
- **Bar**: 0 1px 0 carbon 9%. Scrolled header.

### Named Rules
**The Single Key Light Rule.** Every shadow falls straight down from one light above; no coloured glows except the lamp's own halo.

## Shapes

Three radii: 4px for compact inline controls (the pipeline's in-row stage select), 8px for buttons, fields and held rows, 12px for boards, paper sheets, panels, notices and the popover. State marks are 9px circles. The workspace stage meter is seven 3 x 10px bars (1px radius) filled in ink up to the current stage. Edges are hairlines; strong separators use hair-strong; inputs use the field stroke.

## Components

### Buttons
Plain and certain: ink rectangles, one per view.
- **Shape:** 8px rectangle, min height 48px (workspace 40px, small 32px).
- **Primary:** carbon fill, stone text, 560 weight, 20px inline padding, inset top highlight and a short dark fall. Hover to carbon-2. On graphite it inverts to graphite-ink fill with graphite text.
- **Outline:** field-stroke border, ink text, border to ink on hover.
- **Text link (the secondary action):** 560 weight, drawn underline at 35% that solidifies on hover, arrow that travels 2px.
- **Press:** scale 0.97 in 70ms, release in 160ms ease-out. Disabled is 50% opacity with a not-allowed cursor.
- **Workspace:** primary, secondary (surface fill, hair-strong border), quiet (stone-2 hover), danger (danger text and 40% border).

### Inputs / Fields
- **Style:** paper fill, 1px field stroke, 8px radius, min height 48px, 16px text, muted placeholder; selects draw their own chevron.
- **Focus:** the border goes to ink with a 3px ink ring at 14%, instantly; hover takes the border to carbon-2.
- **Error:** border goes to danger with words beside it. Audit and review forms are validated linear steps.

### State marks and status
- **Lamp** (lit, haloed; pulses on a 2.4s cycle only while live): needs you.
- **Tick**: done or allowed. **Ring** (hollow, 55%): waiting or partly. **X**: blocked. **Off dot** (22% fill): not now.
- **Status** is a mark plus words in the label style: LIVE and BETA take the tick, BLOCKED the x, DEMO, SANDBOX and PLANNED the ring. DEMO always reads "Demo, sample data".

### Directory board (signature)
Graphite board, nameplate row (the sample company name with "Sample workspace, fictional company" opposite), a WEB row for the company's own website, then floors 4 to 1 top-down. One line (Juniper Lane Law) climbs the floors via a shared layout move, lifted on graphite-3 with the held shadow; its detail text swaps in after the move lands. Step buttons (1 to 4) and Play/Pause/Replay; the caption below is a polite live region that says everything the motion shows. Autoplay advances every 2.6s only while 40% in view and stops at the top.

### Navigation
Fixed 68px header, transparent over stone until scrolled. Logo, a Product popover (paper, 12px, 26rem, the pop shadow) and plain links in carbon-2 that go to ink on hover or when current; one primary button at the right. Below 768px a two-line morphing toggle opens a full-height stone sheet with large links on hairlines and the primary button at the foot.

### Paper panels and notices (workspace)
Panels are surface fill with a hairline border and 12px radius, header row on a hairline; the "Needs you" panel is a board. Notices are 12px boxes: info (stone-2), attention (lamp-wash with lamp-deep text), danger (danger-wash, role alert). Every fictional object carries a sample caption in muted label type.

### Motion
- **Arrivals:** ease-out (0.22, 1, 0.36, 1), 260 to 320ms for swaps and step panels; scroll reveals rise 14px over 620 to 720ms, staggered 40ms per sibling (capped at 8).
- **Popover:** in 180ms from scale 0.95 and 4px up, origin at the trigger (24px 0); out 140ms ease-in (0.4, 0, 1, 1) to 0.97. Menu items stagger 30ms. The chevron rotates 180 degrees.
- **Moves between stable positions:** ease-in-out (0.65, 0, 0.35, 1). Directory climb 0.8s; Presence finding-to-task 0.3s; demo draft-to-message handoff 0.55s.
- **Lamp:** 2.4s in-out breathing on the live lamp; a single 700ms settle ring when something resolves.
- **Reduced motion:** all CSS transitions and animations collapse to 0.01ms, reveals are shown immediately, shared-layout moves get zero duration or are not paired, autoplay and the Play button are removed, and the step buttons plus caption carry the story as a static sequence.

## Do's and Don'ts

### Do:
- **Do** put product objects on a graphite board with the graphite scope, and paper objects on stone.
- **Do** light at most one lamp per view, and only for something that needs the user.
- **Do** show state as a mark plus words, and every feature with an honest status (LIVE, BETA, SANDBOX, DEMO, BLOCKED, PLANNED).
- **Do** caption every fictional object as sample data, and keep sample domains on `.example`.
- **Do** write plain, short headings in the customer's own work (walkthroughs, inquiries, dental practices), with no hype words.
- **Do** keep text pairs at 4.5:1 or better and input strokes at 3:1; focus is a visible 2px ink outline (lamp on graphite) offset 3px; targets are at least 40px (44 to 48px on the site).
- **Do** use one ink primary per view and make every other action a text link.

### Don't:
- **Don't** use coloured pills, badges or tinted status chips.
- **Don't** use the lamp as a fill, button, link or decoration, or for anything other than "needs you".
- **Don't** add eyebrows or kickers above headings.
- **Don't** introduce radii outside 4 / 8 / 12, or a second accent colour.
- **Don't** make graphite the page ground or float a dashboard card beside the hero.
- **Don't** use Martian Mono for headings, labels or numbers that are not machine text.
- **Don't** invent customers, testimonials, logos, metrics or rankings, or promise placement in Google or AI search.
- **Don't** animate anything that the caption or a static state cannot also tell under reduced motion.
