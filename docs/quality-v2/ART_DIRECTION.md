# Art direction v2: "After hours, then morning"

## Concept
**From signal to certainty, told as one night at a service business.** The page opens at 9:48 PM in a dark shop lit by one warm lamp. A missed call arrives as amber rings. The page follows that one call as it becomes a text thread, a few questions, and a held slot. It ends in pearl morning light with "Thu 8:00 AM, booked." The page physically brightens as the conversation resolves. Amber is always the *incoming*; solid pearl and ink are always the *settled*.

## 12-line creative rationale
1. Service owners know this exact scene: the phone lighting up after close.
2. Darkness is where missed work happens, so the hero is night: that's narrative, not a "dark mode SaaS" choice.
3. One lamp is the only light. Every highlight and shadow agrees with it, so the scene feels physical.
4. Amber is a ringing phone and a porch light. It is warm and urgent without being an alarm red.
5. Pearl is morning paper and a printed appointment card: the colour of things that are decided.
6. Brushed silver carries the UI chrome: the hardware of a front desk, quiet and exact.
7. The mark is literally the mechanism: open rings (signal) closing onto a solid stem (certainty).
8. Bricolage Grotesque's optical sizes let one family be both a poster headline and a 13px label.
9. Geist stays the reading and UI face. Clarity is the product's promise, so the text face must be clear too.
10. Mono appears only for what is literally data: times, phone numbers, prices.
11. Every scene shows real-looking work: names, zip codes, time windows, a human taking over.
12. Motion follows the call and never decorates. Without motion the page still tells the whole story.

## Tokens (implemented in `app/globals.css`)
| Role | Token | Value | Note |
|---|---|---|---|
| Night ground | `--color-night` | `#0d0e10` | Faint warm near-black, not pure black |
| Stage surface | `--color-night-2` | `#16181b` | Raised objects on night |
| Stage raised | `--color-night-3` | `#202327` | |
| Night rule | `--color-night-rule` | `#2c3036` | |
| Text on night | `--color-card` / `--color-night-muted` | `#f7f6f3` / `#a4a8ae` | Muted is 7.6:1 on night |
| Pearl ground | `--color-paper` | `#eeede9` | Cool-neutral pearl, deliberately not cream |
| Pearl 2/3 | `--color-paper-2/3` | `#e4e3de` / `#d8d6d0` | |
| Ink | `--color-ink` / `--color-ink-2` | `#111214` / `#2a2c30` | |
| Muted on pearl | `--color-muted` | `#55585e` | 6.4:1 |
| Signal (amber, on light) | `--color-signal` | `#9a5208` | 5.2:1 on pearl |
| Lamp (amber, light source) | `--color-lamp` | `#f4a947` | Only on night surfaces |
| Silver | `--color-silver` / `-2` | `#c9ccd1` / `#8e939a` | Chrome hairlines, mark rings |
| Handled (status only) | `--color-handled` | `#2c5c4c` | Booked chips in product UI |

## Type
- Display: **Bricolage Grotesque** (OFL, variable: opsz 12–96, wght 200–800), self-hosted. Weight 540, `font-optical-sizing: auto`, tracking -0.035em at display sizes, line-height 0.96–1.02. Size max 6rem.
- Text and UI: **Geist** (OFL), 16–18px, line-height 1.55, measure ≤68ch.
- Data: **Geist Mono**, only for times, phone numbers, prices and counts.
- Why not Newsreader: it is the AI-default editorial serif, and it was the rejected look.

## Light and shadow
- One key light, upper left of the stage (a lamp off-frame). It's implemented as a large elliptical falloff *on the ground surface*, not as a floating glow blob.
- Objects get an inset top edge highlight (`rgb(255 255 255 / .08)` on night, `.9` on pearl), a 1px contact shadow, and a long soft cast shadow offset down and right (away from the lamp).
- Grain: a 4% noise only on night surfaces, to stop gradient banding.
- No glass. No gradient text. No neon edges.

## Surface hierarchy
Night ground → stage objects (night-2, with edge light) → pearl "settled" objects (appointment card), which are the brightest things on the night stage. On pearl pages the order inverts: pearl ground → white card → ink objects.

## Shape vocabulary
- Rings: concentric open arcs, 1.25px silver or amber. This is the signal.
- Stem: a solid vertical bar with a rounded cap. This is certainty.
- Thread: one continuous 1.5px path joining states, dashed while unresolved and solid once settled.
- Radii: 6px for UI chips, 14px for panes, 22px for stage objects. No pills except for status chips.

## Graphic direction
All illustration is authored SVG and HTML product UI with labelled sample data. No stock photography, no 3D renders, no logos of integrations.

## Page rhythm
Night hero → dusk (the moments ribbon) → the night-to-dawn scroll story → pearl walkthrough → graphite control → pearl fit, pricing and FAQ → morning close with the booked card. Dense passages alternate with quiet ones, and there's more space above headings than below.

## References
Sayable (craft bar) is in `screenshots/sayable/`. Conceptual lessons came from Attio (product UI as the story), Linear (motion and precision) and Apple (one lit object per frame). No layouts or assets were copied.
