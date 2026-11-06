# Skills and tools actually used

| Tool / skill | Used? | What it did |
|---|---|---|
| Playwright (`@playwright/test` 1.65; cached Chromium 1248 + WebKit 2388) | Yes | Baseline and final screenshots; 40 tests × 2 engines (80). Firefox was installed but won't launch here. |
| axe-core (`@axe-core/playwright`) | Yes | WCAG 2.2 AA scan of every route at 390 and 1440 px. Found contrast failures (faint grey, small vermilion, amber pills), a non-focusable scroll region and heading-order issues; all fixed. |
| Lighthouse 12 (unsaved local install) | Yes | Mobile lab runs. Found a 4.4 s TBT on home caused by a fixed blend-mode grain overlay; fixed. Results in `perf/`. |
| Motion (`motion/react` 14) | Yes | Shared-element pill indicators (`layoutId`), AnimatePresence for step/view transitions and the mobile menu, `useReducedMotion`. |
| Vercel CLI 59 | Yes | `whoami`, `teams ls`, `project ls`, `domains inspect betterdesk.ai` (not found → production blocked), deploys, `vercel curl` verification. |
| Impeccable | Yes | Hook scanned each component. `critique` was run: `impeccable detect` on source and on the live page at 1440/390 (flags: sub-11px labels, kicker above every heading, italic serif hero, stragglers), plus an isolated design-review subagent. Acted on: 11 px text floor, thread marks instead of numbered kickers, roman display with a thread underline, problem ledger, shorter feature list, sticky mobile CTA, green closing CTA. Kept on purpose: cream background (live-site brand equity), Geist, illustrative nested cards. The interview and question steps were skipped because the run is unattended. |
| reality-checker subagent | Yes | Independent red-team of claims, copy and code: 15 findings, all fixed (CLAIMS_AUDIT.md). |
| ui-designer subagent | Yes | Impeccable Assessment A (isolated design review with heuristic scores). |
| Scrollcraft, Awwwards Skill, Canvas Design, REA, Codex | No | Not installed locally or not needed; not installed tonight to protect build time. The scroll narrative uses CSS scroll-driven reveals with a no-animation fallback instead. |
| Context7 docs | No | Next 16 / Motion / Tailwind 4 APIs used are stable ones; typecheck and build verified them. |
| GitHub | No | `gh` token is invalid; nothing pushed. Work is in local git only. |
