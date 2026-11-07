# Sayable vs BetterDesk baseline

Sayable was inspected read-only: source at `~/Developer/projects/anything-research/sayable-site`, and live at http://localhost:3100, which was already running. Screenshots are in `screenshots/sayable/`. Detailed notes are in `research/SAYABLE_NOTES.md`. I'm borrowing lessons, not branding.

| Dimension | Sayable | BetterDesk baseline | Response in v2 |
|---|---|---|---|
| Hero impact | Huge two-line grotesk headline, and a real product artifact (a permit form) at full width directly under it (sayable-1440-top). | Serif headline beside small floating cards and empty space (home-1440-top). | Full-bleed night stage. The scene *is* the hero and the headline sits on it. |
| Brand motif | The artifact is the motif: a document with a scanning line that exposes hidden structure. | None. A dashed underline. | The signal-to-certainty mark: rings resolve into a solid stem. It is used at 24px and as stage geometry. |
| Composition | Centred, plus one big object per chapter. | Split columns, then lists. | Asymmetric: headline low-left, scene diagonal top-right to bottom; a different composition on mobile. |
| Typography | Onest 650, tracking -0.042em, line-height 0.98, one family. | Newsreader 380 serif display, Geist body, mono labels. | Bricolage Grotesque (opsz axis) for display, Geist for UI and body, Geist Mono only for real data such as times and numbers. |
| Art direction | Paper-white, ink, one structure blue, with ember reserved for problems. | Cream, ink, red, green. | Graphite and near-black, pearl, brushed silver, and one amber light. Amber is the incoming signal, pearl and solid ink are certainty. |
| Lighting / depth | Stacked shadows, and only "sheets" cast them. No glass or grain (sayable-1440-mid1). | Flat cream cards. | A single key light on the dark stage, with an edge highlight and long soft cast shadows only on objects. |
| Microinteractions | Shared nav hover pill, press scale .97, 200ms/160ms, popovers grow from the trigger. | Basic hover underline. | Adopt the same motion spec (it matches the brief), with BetterDesk-specific objects. |
| Scroll choreography | 220vh sticky hero; a CSS variable drives the tilt and scan. | View-timeline fades only. | Sticky story stage with five states and one persistent conversation object, plus a static fallback. |
| Product clarity | You see the failure (unnamed fields) immediately. | The walkthrough begins with an empty phone. | Every stage frame shows a complete, believable state. |
| Nav | Light bar, blue CTA, dropdowns. | Cream bar, black pill CTA. | Graphite bar sitting on the night hero, a pearl CTA, and a shared hover indicator. |
| Content quality | Plain, specific, labelled samples. | Honest and specific, but long. | Keep the honesty and cut length. |
| Visual rhythm | Light chapters alternate with dark scenes through long gradient fades (sayable-1440-mid2). | All cream, with one abrupt dark block. | Night to morning: the page brightens as the conversation resolves. |
| Mobile | Shorter pin, softer tilt, chips become a legend. | Desktop stacked; the scene falls below the fold. | A dedicated mobile hero where the scene stacks vertically above the fold. |
| Performance | CSS variables, one rAF, no hero media. | Good (Lighthouse 92–95). | Keep SVG/CSS scenes with no WebGL, and measure. |
