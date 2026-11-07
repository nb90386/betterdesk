# Skills and tools audit (V4)

| Resource | Installed? | Actually used in V4? | Influence / evidence |
|---|---|---|---|
| Impeccable (`~/.claude/skills/impeccable`) | Yes | **Partly.** Its design-detector hook ran automatically on every UI file I wrote and reported no deterministic issues. I followed the craft floor it loaded earlier in the V3 session: no eyebrows, no gradient text, no card grids, browser-surface theming. I did **not** run its critique, audit, typeset or animate commands in V4. | Hook output on each write. The independent review used the `ui-designer` agent instead. |
| Hallmark | Yes | **No.** Not invoked. | None |
| Taste Skill (`taste-skill:design-taste-frontend` plugin) | Yes | **No.** Not invoked. | None |
| gstack design-review | Yes | **No.** A ui-designer subagent did the screenshot review instead. | `INDEPENDENT-REVIEW.md` |
| Scroll Craft | **Not installed** | No | Unavailable. I followed the Motion docs for scroll scenes instead. |
| Stop Design Slop | **Not installed** | No | I applied its intent manually (no eyebrows, pills or fake proof). |
| UI/UX Pro Max | **Not installed** | No | — |
| Motion docs via Context7 (`/websites/motion_dev`) | CLI available | Yes, in the V3 session. I checked the `useScroll` target/offset, `useTransform` and `useMotionValueEvent` APIs, and V4 uses the same APIs plus `layoutId` and `LayoutGroup`. | `JourneyScene`, `ScoutInspector`, pipeline |
| Playwright (Chromium headless shell, WebKit) | Yes | Yes | e2e suite (130 tests); app tour script; screenshot capture; axe-core |
| Lighthouse 12.8.2 (npx) | Fetched on demand | Yes | `perf/*.json` |
| Subagents | Yes | Yes, 5 bounded agents | market/competitor/pricing research; compliance research; 5 marketing subpages (frontend-developer, non-overlapping files); independent design review (ui-designer); V3-era documenter not reused |
| WebSearch / WebFetch (by the research agents) | Yes | Yes | Cited sources in `PRODUCT-STRATEGY.md`, `COMPETITIVE-RESEARCH.md`, `PRICING-AND-UNIT-ECONOMICS.md`, `research/COMPLIANCE-RESEARCH.md` |

**Not done in V4.** I didn't run Hallmark or Taste Skill, or a formal Impeccable critique, against V4. That's an honest gap, and the cheapest next design-QA step.
