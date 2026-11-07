# BetterDesk V3 brand system: "The route"

**Thesis.** A business owner is busy. The opportunity should not disappear with the unanswered ring. BetterDesk is the quiet connection from an incoming inquiry to a clear next step.

**Signature.** One vermilion line, the *route*. It is always the customer's inquiry travelling toward a booked appointment, and it is the only color on the site. It shows up differently on each surface:

| Where | How the route appears |
|---|---|
| Mark | One stroke forms the "b"; it lands on a vermilion point (the booked time) |
| Hero | Draws on load from the incoming call, runs under the reply, lands on Thursday 8:00 in the schedule |
| Act II | Whole while ringing, dashed when missed, frays off-frame without a reply, reconnects with BetterDesk |
| Act III | Progress rail through five stations, scrubbed by scroll or driven by Play |
| Subpages | Arrives from the left margin under each title and stops on a point |
| Process lists | Vertical line with hollow stations; the last station is filled |
| Inbox | A small dot marks what needs the owner |

## Logo
Three concepts drawn and compared at 16, 24, 48 and 96px, on light and dark, in color and mono (`docs/v3/screenshots/logo-concepts.png`):
- **A, signal-to-calendar** (`public/brand/mark-a-calendar.svg`): rejected. It reads as a stock calendar-check icon, and many products use it.
- **B, route "b"** (`public/brand/mark-b-route.svg`, mono `mark-b-route-mono.svg`): **chosen.** It is one continuous stroke, legible at 16px, works in one color and carries the story in the mark. The stem was raised after the first comparison so it can't read as "ь".
- **C, editorial terminal** (`public/brand/mark-c-terminal.svg`): rejected. Its "k" didn't read as a letter at 24px.

No trademark clearance has been done; that needs counsel before any filing. Favicon: `app/icon.svg` (porcelain tile, with a dark-scheme variant). Social card: `app/opengraph-image.tsx`.

## Type
One family, **Instrument Sans** variable (OFL; wght 400–700, wdth 75–100), self-hosted as `app/fonts/InstrumentSans.woff2` (latin, 57 KB). Geist Mono appears only for clock times and phone numbers, which are measurements.

Alternatives considered: (1) Schibsted Grotesk display with Inter text was rejected because two faces add no story and Inter is the default. (2) Hanken Grotesk with a serif accent was rejected because the serif accent is the cream-editorial cliché.

Tuning: display sizes condense (`font-stretch` 92–96%) and tighten tracking with size (−0.038em at hero, −0.024em at title); text stays at full width.

| Token | Size | Weight / tracking |
|---|---|---|
| `.t-hero` | clamp(2.6rem → 5.75rem) | 600 / −0.038em / lh 0.96 |
| `.t-display` | clamp(2.1rem → 4rem) | 600 / −0.032em |
| `.t-title` | clamp(1.6rem → 2.4rem) | 600 / −0.024em |
| `.t-lede` | clamp(1.125rem → 1.35rem) | 400, max 38ch |
| body | 1.0625rem / 1.55 | 400 |

## Color

| Token | Hex | Use |
|---|---|---|
| porcelain | #f2f2ef | The table: page ground |
| porcelain-2 / -3 | #e9e9e5 / #dcdcd7 | Recessed bands, bubbles |
| surface | #fbfbf9 | Objects that sit on the table |
| ink / ink-2 | #101214 / #2b2e33 | Text; solid ink means *certain* (booked, primary action) |
| muted | #595d65 | Secondary text (6.0:1 on porcelain) |
| rule / rule-strong | #d5d5d0 / #b4b4ae | Hairlines |
| graphite / -2 / -3 | #0b0c0e / #141619 / #1e2125 | The one dark act, the call object, the rules panels |
| graphite-muted | #a2a6ad | Secondary text on graphite (7.7:1) |
| signal | #e2462c | The route: lines and dots only (3.4:1, graphics) |
| signal-ink | #b3321b | Vermilion text on porcelain (5.6:1) |
| signal-bright | #ff6a4f | The route on graphite |

There is no second accent, no purple, no neon, no brass and no gradient text. Dark is chosen by the story (the call object and the Act III night stage), not by category.

## Material and light
- **Key light:** one window light from the upper left. Each porcelain section has a soft white falloff from that corner, and the hero light follows the pointer by a few percent.
- **Shadows:** they fall down and right with real offset (`--shadow-rest`, `--shadow-lift`, `--shadow-object`). There are no zero-offset glows. A contact shadow seats the hero objects on the table.
- **Edges:** graphite objects carry a 135° specular wash (white at 10% to transparent) and an inset top highlight.
- **Blur is camera language:** the hero schedule sits behind the focal plane (2.4px) and pulls into focus as you scroll. New messages in Act III arrive from a 6px defocus. The header frosts only while content is underneath it. Body text is never blurred.

## Shape
Radii are 4 / 8 / 12 / 16px. Buttons are 8px. True circles are used only for avatars, station dots and the route point. There are no capsule nav links and no pill eyebrows.

## Motion system
**Motion** (`motion/react`) is the single orchestrator for scroll scenes (`useScroll` + `useTransform` / `useMotionValueEvent`), and CSS handles small controls. Three authored moments:
1. **Hero:** layered optical parallax (pointer and scroll), the route drawing on load, and back-plane focus pull.
2. **Signal to booking:** pinned 520vh stage, scroll-scrubbed through five stations, with a Play/Pause/Replay control and an `sr-only` transcript.
3. **Approved answers:** a masked close-up that opens from a slit to the full panel as it arrives (desktop only; tall phone layouts get the open panel).

There is also one quiet accent: Act II's typographic focus handoff, where the active line is ink and past lines step back.

Reduced motion renders every act statically with the full content, after a hydration-safe check (`lib/useReducedMotionSafe.ts`).
