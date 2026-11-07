# Design skill execution record

Date 2026-11-07. Only what actually ran is listed as run.

## Installed this round
| Skill | Source / revision | Licence | Install | Path | Read | Invoked / used for |
|---|---|---|---|---|---|---|
| apple-design | emilkowalski/skills @ c8a7962 | MIT | `npx skills@latest add emilkowalski/skills -s … -a claude-code --copy -y` (project-local; telemetry opted out) | `.claude/skills/apple-design` | Full SKILL.md, in this session | Governing rules: springs (lib/motion.ts), interruptibility, trigger-anchored popover, symmetric paths, material + reduced transparency/contrast, size-specific tracking |
| review-animations | same | MIT | same | `.claude/skills/review-animations` | SKILL + STANDARDS (by me and by a fresh reviewer) | Independent review: 22 findings, verdict Block → all fixed in 9390c33 |
| choreograph | same | MIT | same | `.claude/skills/choreograph` | by the reviewer | Climb beats (content lands at ~0.28s), handoff "carry", no menu re-entrance |
| animation-performance | same | MIT | same | `.claude/skills/animation-performance` | by the reviewer + me | Removed box-shadow loop, smaller header blur, opaque bar behind sheet; frame probe at 4x CPU |
| mobile-native | same | MIT | same | `.claude/skills/mobile-native` | Hard rules, Baseline, Never Ship | viewport-fit=cover, safe areas, 16px fields on touch, touch-action, hover gating, svh/dvh |
| break-ui | same | MIT | same | `.claude/skills/break-ui` | SKILL | `tests/e2e/break-ui.spec.ts`; found the pipeline overflow (fixed) |
| pick-ui-library | same | MIT | same | `.claude/skills/pick-ui-library` | SKILL | Checked: no new UI library needed; native range input + Motion only |
| remove-animations | same | MIT | same | `.claude/skills/remove-animations` | SKILL | Removed page-wide scroll reveals, idle lamp loop, menu item staggers, no-op motion nodes |

Installed files were diffed against the reviewed clone: byte-identical. Hashes in `skills-lock.json`. All eight are Markdown only (no scripts). They appeared as callable skills mid-session.

## Previously in use (kept)
- Impeccable (context, concept-seed, surface brief, design hook on every edit, finish reviewer, documenter).
- Hallmark sloplint (static + render), Playwright Chromium/WebKit, axe, Lighthouse 12.8.2, Vercel Web Interface Guidelines checklist.
- Motion 14.10 (the only animation engine; no GSAP, Lenis or second library).

## Not run / skipped
- Awwwards `/jury` scripts: auto-mode classifier denied executing cloned code (earlier round). Rubric applied by a screenshot-only critic instead.
- Scroll Craft `doctor.mjs`: reads `.env` files up to 8 directories up looking for a key; not run. Its guidance (one story, no long pinning) is followed: the only scroll-adjacent motion is an in-view, pausable directory climb.
- Stop Design Slop: the named repo (Juuzoe) does not exist publicly; a same-name substitute was used as a checklist only.
- Taste Skill: installed plugin is a different author's repo; rules read, inspector not run.
- Anatomy, Motion Primitives: not needed; the workflow is shown with the real product (directory board, demo), not an illustration.
- Reference-site capture (Apple, Attio, Linear…): blocked in the sandbox for the research agent; not captured. The direction is not based on measured reference DNA.
