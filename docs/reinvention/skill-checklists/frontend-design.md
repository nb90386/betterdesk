# Anthropic frontend-design: checklist

Source: anthropics/skills @ 2c5958e `skills/frontend-design/SKILL.md` (Apache-2.0, LICENSE.txt).
Installed copy: plugin `frontend-design@claude-plugins-official` v1.1.1 (commit f8c5e7a), path
`~/.claude/plugins/cache/claude-plugins-official/frontend-design/1.1.1/skills/frontend-design/SKILL.md`
— byte-identical to upstream (71 lines). Invoke as `frontend-design:frontend-design`.

## Grounding (section "Ground your designs in the subject matter")
- [ ] Brief states subject, audience and the page's primary job before any design work.
- [ ] Visual choices trace to the subject's industry, materials, vernacular (commercial cleaning, not generic SaaS).
- [ ] Real content throughout; no lorem or generic placeholder copy.

## Plan before code (section "Process")
- [ ] Written plan exists: palette as 4–6 named hex values; typefaces + roles; layout concept with ASCII wireframe
      and alignment rule (left/center); 2–4 principles for what makes this page unique.
- [ ] Plan re-reviewed against the brief; any part that matches "what I'd produce for any similar page" revised,
      with the change and reason recorded.

## Hero & structure (section "Design principles")
- [ ] Hero opens with the most characteristic thing in the subject's world (headline, image, live demo, interaction).
- [ ] Big-number + small label + stats + gradient accent hero used only if justified.
- [ ] Numbered markers (01/02/03) only when content is a real sequence.
- [ ] Every border, eyebrow, divider, label encodes information; none purely decorative.

## Typography
- [ ] 1–2 families; if two, clearly distinct. Not the default families reached for on every project.
- [ ] Clear type scale (Elements of Typographic Style); intentional weights, widths, spacing.
- [ ] Line length <80 characters; serif body gets slightly more line-height than sans.
- [ ] Headline type is an active design element, not a neutral container.
- [ ] Avoid: single accented word in a headline (italic/bold/color); all-caps labels; unnecessary labels above content.

## Generated-design tells to avoid unless the brief asks (section "Process", calibration list)
- [ ] Cream bg (~#F4F1EA) + high-contrast serif + terracotta accent (~#D97757).
- [ ] Near-black bg + single acid-green or vermilion accent.
- [ ] Broadsheet layout: hairline rules, zero radius, dense newspaper columns.
- [ ] SaaS card kit: identical rounded cards, one radius everywhere, same `rgba(0,0,0,.1)` shadow, gradient washes.
- [ ] Template chrome: tracked ALL-CAPS eyebrow above every heading; `A · B · C` meta strings; `WORD — fragment`
      labels; tinted near-black (#0B0B0B, #111) instead of black; monospace for small data labels; `→` on links/buttons.
- Brief's explicit direction always wins over this list.

## Motion
- [ ] Non-user-triggered motion: one orchestrated moment (one load sequence or one reveal), not per-section effects.
- [ ] No fade-and-slide-up on every section, no hover transition on every card.
- [ ] User-triggered motion (open, expand, confirm) shows what changed.

## Restraint & quality floor (section "Restraint and self-critique")
- [ ] Boldness spent in one place; one memorable element; everything else quiet.
- [ ] Remove one accessory: cut decoration that does not serve the brief.
- [ ] Floor: responsive to mobile, visible keyboard focus, reduced motion respected, accessible contrast, harmonious palette.
- [ ] Screenshot self-critique during build; note what was tried for future passes.
- [ ] CSS specificity: no type-selector vs element-selector conflicts cancelling section padding/margin.

## Copy (section "More on writing in design")
- [ ] Name things in user terms ("notifications", not "webhook config"); describe, don't sell.
- [ ] Active voice; CTA states exact outcome ("Save changes", not "Submit").
- [ ] Action name constant through flow ("Publish" button → "Published" toast).
- [ ] Errors: what went wrong + how to fix, no apology, never vague. Empty screen invites action.
- [ ] Sentence case, plain verbs, no filler; each text element does one job.
