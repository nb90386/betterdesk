# Taste-skill checklist

Two different projects share the name:
- **Installed plugin** `taste-skill:design-taste-frontend` = Leonxlnx/taste-skill v2.1.5 (commit 12af471, MIT), at
  `~/.claude/plugins/cache/taste-skill/taste-skill/2.1.5/skills/taste-skill`. This holds the house rules and the inspector below.
- **Requested repo** senlindesign/taste-skill @ 6dce223 (README says MIT; no LICENSE file in the repo) is a different tool:
  `/taste <url>` reverse-engineers a site into `{domain}.md/.json` tokens + "Taste DNA" and needs the Playwright MCP. Its only reusable rule is the banned-adjective grep at the end.

## Run the installed inspector (zero deps, Node 22+, drives installed Chrome over CDP)
```bash
T=~/.claude/plugins/cache/taste-skill/taste-skill/2.1.5/skills/taste-skill/scripts
cd /Users/edge/Developer/betterdesk-redesign
node $T/lint.mjs app components                                   # source scan: banned patterns + stock phrases
node $T/inspect.mjs http://localhost:3000/ --out "$TMPDIR/taste-inspect" --widths 1440,768,390 --json
node $T/inspect.mjs http://localhost:3000/ --app ...              # app-screen rules (references/app-screens.md)
```
Writes screenshots only to `--out` (default `.taste-skill/inspect/`). Exit 1 = a FAIL. It warns on dev servers; run the final gate on `next build && next start`.
Exempt from inspection: `<pre>/<code>`, real tables and form fields, and any root marked `data-ui` (a real product fragment).

## House rules (SKILL.md "House rules", measured by inspect.mjs)
- [ ] Every h1-h6, and the main line of the first screen, is <= 2 lines at 1440, 768 and 390.
- [ ] One `h1` with a clear title on the first screen; every section has a heading.
- [ ] Equal outer margins; no section huddled on one half with the other half empty.
- [ ] No blank stretch taller than ~half a screen (one deliberate rest per page).
- [ ] Statements are `<p>`/`<blockquote>`, <= 36px desktop / 24px phone, ~25 words, <= 3 lines.
- [ ] No eyebrows, pill badges above headlines, or "New ·" chips.
- [ ] No monospace outside real code. Tabular figures where numbers align.
- [ ] No index numbering (01/02, (001), "Step 2"); use a real `<ol>` if order matters.
- [ ] No hairline dividers, 1px outlined boxes, grid lines, crosshairs, crop marks (tone steps instead).
- [ ] No gradients on backgrounds, buttons or text (neutral scrim on a photo is the one exception).
- [ ] No shadows on things at rest; no glows. Shadows only on menus and dialogs.
- [ ] No cream + terracotta/rust; no violet or indigo.
- [ ] No tiny uppercase letter-spaced labels.
- [ ] No icon-topped feature cards; no rows of identical cards.
- [ ] No glass/backdrop-blur panels; no floating pill nav.
- [ ] No emoji, gradient blobs, decorative shapes, fake grey-bar dashboards.
- [ ] No styled accent word in a headline (italic, serif, coloured, underlined).
- [ ] At most two typefaces, usually one.
Note: these are stricter than hallmark/impeccable (bans all hairlines and all resting shadows). Apply where they do not fight the chosen direction; record conflicts.

## Laws of the craft (SKILL.md, study of 247 gallery sites)
- [ ] Two or three sizes do the visible work; <= 5 sizes per page; headline:body ratio ~4.3+; largest type ~8vw on strong sites.
- [ ] Display tracking -0.02 to -0.05em, leading 0.85-1.05. Text 16-20px, leading 1.45-1.6, 45-75 chars/line.
- [ ] Left-aligned by default; centre at most one moment.
- [ ] One grid; outer margins 16-32px; text blocks share 2-3 left edges across the page.
- [ ] Section gap clearly larger than any inner gap: 120-240px desktop.
- [ ] Each section's composition differs from its neighbours; none is a card grid.
- [ ] One ground, one ink, one accent; accent on the action and at most one other thing. Running text in full ink, not soft grey.
- [ ] One dominant image beats six small ones; hero media >= half the first screen; consistent crops; square corners by default.
- [ ] Nothing overlaps a headline or statement.
- [ ] Buttons flat, one fill, square or fully round (avoid the 9-16px "soft" radius); <= 1 button in the hero.
- [ ] Nav: wordmark, 3-5 plain links, one action.
- [ ] Field limits (password rules, file size) visible beside the field and tied via `aria-describedby`.
- [ ] Footer is a designed close (name returns at full width), not a sitemap.

## Copy self-audit (senlindesign/taste-skill step3-taste.md, Phase 4)
- [ ] `grep -inE 'clean|modern|sleek|visually appealing|user-friendly|intuitive|seamless|\belegant\b|minimalist|polished|refined|sophisticated|delightful|stunning|\bbeautiful\b|\bpremium\b'` over our docs/copy returns 0 positive self-descriptions.
- [ ] Each design principle we write states the rejected alternative and the evidence (px/hex), not adjectives.
