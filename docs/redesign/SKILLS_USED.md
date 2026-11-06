# Skills and tools actually used

| Tool / skill | Used? | What it did |
|---|---|---|
| Playwright (`@playwright/test` 1.65 driving the cached Chromium 1248 headless shell) | Yes | Baseline screenshots of the live site; screenshot rounds r1–r5; 18 functional e2e tests; 20 axe tests. |
| axe-core (`@axe-core/playwright`) | Yes | WCAG 2.2 AA scan of every route at 390 and 1440 px. Found contrast failures (faint grey, small vermilion, amber pills), a non-focusable scroll region and heading-order issues; all fixed. |
| Lighthouse 12 (unsaved local install) | Yes | Mobile lab runs. Found a 4.4 s TBT on home caused by a fixed blend-mode grain overlay; fixed. Results in `perf/`. |
| Motion (`motion/react` 14) | Yes | Shared-element pill indicators (`layoutId`), AnimatePresence for step/view transitions and the mobile menu, `useReducedMotion`. |
| Vercel CLI 59 | Yes | `whoami`, `teams ls`, `project ls`, `domains inspect betterdesk.ai` (not found → production blocked), deploys, `vercel curl` verification. |
| Impeccable | Partly | Its PostToolUse design hook scanned each component written (no deterministic issues reported). The full Impeccable skill workflow (audit/critique/polish passes) was **not** invoked. |
| reality-checker subagent | Yes | Independent red-team of claims, copy and code (see STATUS for outcome). |
| Scrollcraft, Awwwards Skill, Canvas Design, REA, Codex | No | Not installed locally or not needed; not installed tonight to protect build time. The scroll narrative uses CSS scroll-driven reveals with a no-animation fallback instead. |
| Context7 docs | No | Next 16 / Motion / Tailwind 4 APIs used are stable ones; typecheck and build verified them. |
| GitHub | No | `gh` token is invalid; nothing pushed. Work is in local git only. |
