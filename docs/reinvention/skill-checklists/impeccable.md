# Impeccable checklist

Source: installed `~/.claude/skills/impeccable` (skill v4.8.0, engine 0.1.18) = upstream pbakaus/impeccable @ 687bc38 (Apache-2.0).
Sections: `reference/craft-floor.md` (Verify, Refuse), `reference/polish.md`, `reference/audit.md`, `reference/mode-persuade.md`.

## Run it
```bash
cd /Users/edge/Developer/betterdesk-redesign
S=~/.claude/skills/impeccable/scripts/impeccable        # sh launcher -> bundled darwin-arm64 binary (sha256 pinned)
$S context --target 'app/(site)/page.tsx'                 # loads PRODUCT.md, DESIGN.md, surface brief; once per session
$S detect --json app components                          # static anti-pattern scan
$S detect --json http://localhost:3000/                  # rendered scan (uses installed Chrome)
$S detect --list-rules                                   # rule catalog, no scan
```
Sub-commands are prompts, not binaries: `/impeccable <cmd> [target]` loads `reference/<cmd>.md`.
Build: shape, init (alias teach), document, extract, craft (deprecated). Evaluate: critique, audit.
Refine: polish, bolder, quieter, distill, harden, onboard. Enhance: animate, colorize, typeset, layout, delight, overdrive.
Fix: clarify, adapt, optimize. Iterate: live, generate. Utility: hooks, doctor, pin.
"persuade" and "operate" are **modes** (Persuade / Operate / Read / Experience), not commands; the marketing site is Persuade.

## Persuade-mode bar (mode-persuade.md)
- [ ] The first viewport makes the offer intelligible, exposes the real action in its working form, and shows something only this product can prove.
- [ ] The world carries the page's parts: nav reads as links, copy reads against its backdrop, primary action unmistakable, steady vertical rhythm.

## Verify (craft-floor.md, check on the render)
- [ ] Contrast: body and placeholder text >= 4.5:1, large text >= 3:1; secondary text on coloured surfaces is tinted from that hue, never grey.
- [ ] Depth: every shadow has an offset and a soft blur; no zero-offset coloured halos.
- [ ] Spacing: tight groups, generous separation, more space above a heading than below. Read computed values.
- [ ] Type: body measure 65-75ch; display max 6rem; tracking floor -0.04em; `text-wrap: balance` on headings; visible scale and weight steps; real copy at every breakpoint, nothing overflows.
- [ ] Motion: one authored moment, not an identical entrance on every section; exponential ease-out from an already-visible default.
- [ ] States: hover, disabled, loading, error, empty exist; keyboard focus visible.
- [ ] Browser surfaces themed from the palette: `::selection`, `caret-color`, scrollbar, focus ring, `text-underline-offset`, `font-variant-numeric: tabular-nums` in tabular data.
- [ ] Copy: controls name their action; errors name the problem and the recovery.
- [ ] Coverage: every brief requirement findable within seconds.

## Refuse (bans marked BAN; the rest need a reason from the brief)
- [ ] BAN: kicker/eyebrow above a heading.
- [ ] Same-size icon+heading+text cards as page structure; any nested card.
- [ ] Hero-metric template (big number, small label, supporting stats, accent).
- [ ] Section numbers 01/02/03 unless the sequence is information.
- [ ] Modal for a task that needs no interruption.
- [ ] Gradient text; decorative glass/blur; coloured `border-left/right` > 1px on cards, callouts, alerts.
- [ ] Hard offset zero-blur shadows (`4px 4px 0`) outside a genuinely neobrutalist world.
- [ ] Sparklines, progress rings, soft rounded rectangles standing in for content.
- [ ] Monospace as a "technical" costume; system display face (Arial Black, platform sans) as display voice.
- [ ] Unicode glyphs or emoji as icons; icons from one library in one stroke weight.
- [ ] Geometric masks (circle/polygon) faking an organic photo edge.
- [ ] Light/dark chosen by category instead of use scene.

## Polish pass (polish.md)
- [ ] Classify each defect: missing token / one-off implementation / conceptual mismatch / local defect.
- [ ] Optical as well as mathematical alignment to the grid and spacing scale.
- [ ] Same-role typography identical across pages; test wrapping, localisation expansion, zoom, font loading.
- [ ] Semantic colour tokens; contrast checked in every state, both themes.
- [ ] Icons: one family, consistent stroke/size, optically centred.
- [ ] Images reserve aspect ratio (no CLS), responsive sources, useful alt.
- [ ] Every control: default, hover, focus, active, disabled, loading, error, success.
- [ ] Logical tab order, labels, platform touch targets.
- [ ] Validate long, missing, slow and offline content where reachable.
- [ ] Remove debug output, dead code, unused imports, obsolete styles.
- [ ] Verify mobile, intermediate and wide; console errors; layout shift; interaction latency.

## Audit report shape (audit.md)
Score 0-4 each: Accessibility, Performance, Theming, Responsive, Implementation Integrity (critical) -> /20.
Severity P0-P3. Start with an Implementation Integrity pass/fail verdict citing detector findings.
