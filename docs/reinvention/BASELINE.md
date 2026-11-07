# Baseline and rollback

Recorded 2026-11-07 before any change on this branch.

| Item | Value |
|---|---|
| Baseline branch | `feat/betterdesk-v4-growth-os` (strongest and newest working build: V4 "Signal Architecture") |
| Baseline / rollback SHA | `cb7993254dd580315f6ec07683b4869cf559c887` |
| New branch | `feat/betterdesk-signature-presence-rebuild`, created from the SHA above |
| Older versions kept | `feat/betterdesk-sayable-quality-v2` (V2), `feat/betterdesk-v3-apple-editorial` (V3), `feat/betterdesk-2026-premium-redesign`, `main`, all untouched |
| Remote | none configured, nothing pushed |
| Working tree at start | clean apart from untracked founder files (`BETTERDESK_*_PROMPT.md`, `START_HERE.md`, `VISUAL_REVIEW_SCORECARD.md`, `run_betterdesk_quality.py`, `.betterdesk-sayable/`, `.impeccable/review/`). Left untracked and unmodified. |
| Vercel link | `.vercel/project.json` → project `betterdesk-redesign` (`prj_huXJszKZP8QZbkl9ncUSshS8B9DN`); team verified at deploy time |
| Last V4 preview | `betterdesk-redesign-lp0ui63p8-neel-s-projects9.vercel.app` (protected) |

## What V4 was
- **Look:** dark petrol and celadon, Funnel Display with Geist, and a route-junction mark with a node.
- **Pages:** 9 marketing routes and 9 `/app` routes.
- **Contact:** the form only opened the visitor's email app (`mailto:`).
- **Presence:** none.
- **Sample workspace:** Scout, the workspace event model and its unit tests are real and are kept on this branch.

## Rollback
`git checkout feat/betterdesk-v4-growth-os` (or `git checkout cb79932`). Vercel previews are immutable, so the V4 preview URL above stays available.
