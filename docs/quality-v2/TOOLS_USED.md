# Tools actually used (cycle 1)
- **Impeccable skill** (`~/.claude/skills/impeccable`): `impeccable context` ran (no PRODUCT/DESIGN.md). I followed new-work.md, mode-persuade.md and craft-floor.md, and the design hook scanned every edited UI file (no findings). I skipped the concept-seed roll because the brief pins the direction, which new-work.md allows. The build was code-led because there was no interactive approver for comps. No finish-reviewer or documenter yet, so DESIGN.md is not written (owed).
- **Subagents (ui-designer)**: a Sayable read-only study (source notes) and an independent reject-by-default reviewer (REVIEW_PASS02.md). The first critic could not launch a browser (its sandbox bypass was denied), so its screenshots were captured by the main thread.
- **Playwright/WebKit**: captures via `scripts/capture-pass.mjs`; e2e and axe tests.
- **Motion** (motion/react 14): AnimatePresence and layoutId in SignalStory; already in the project.
- Not used: Scrollcraft and Awwwards skills (not installed as skills here), REA, Canvas, WebGL/R3F (not justified yet), Context7 (no new library APIs introduced).
