# DESIGN.md (pointer)

The single design source of truth is the repository root **`/DESIGN.md`** (with its sidecar `.impeccable/design.json`), linked from `CLAUDE.md` so every agent reads it before UI work. It covers the font/token system, the D-swing mark and its usage, hierarchy, grid, the spring motion presets (`lib/motion.ts`), material/backdrop treatment, accessibility and platform adaptations. This file exists so the path the Apple Design brief names resolves; it intentionally holds no second copy that could drift.
