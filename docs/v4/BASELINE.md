# V4 baseline (2026-11-07)

- **Repo:** `/Users/edge/Developer/betterdesk-redesign`.
- **Git:** no remote is configured.
- **Branches:**
  - V2: `feat/betterdesk-sayable-quality-v2` at `a0eab3a`
  - V3: `feat/betterdesk-v3-apple-editorial` at `edf4590`
  - V4: `feat/betterdesk-v4-growth-os`, branched from `edf4590`
- **Uncommitted work at start:** none tracked. Untracked prompt files, runner scripts and `.betterdesk-sayable/` were left untouched and never committed.
- **Stack:** Next.js 16.4.5 App Router, React 19.3, TypeScript 5.9, Tailwind 4.3, Motion 14.10, Playwright 1.65, axe-core.
- **No backend dependencies.** There's no `.env*` and no Supabase, auth, email, calendar or AI SDK.
- **Vercel:** `.vercel/project.json` points at `betterdesk-redesign` (`prj_huXJszKZP8QZbkl9ncUSshS8B9DN`), team `neel-s-projects9`, verified with `vercel project inspect`. The project has **no environment variables**.
- **V3 state at baseline:**
  - Build and tests: 84/84 e2e (Chromium + WebKit), unit tests passing.
  - Preview: `https://betterdesk-redesign-80odjfzds-neel-s-projects9.vercel.app`, protected.
  - Product: a marketing site for missed-call text-back aimed at home services. It had no application, data model or agent.
- **Known environment quirks:**
  - Chromium needs to run outside the sandbox (mach-port).
  - `next dev` with Turbopack panics on FSEvents, so verification uses `next build && next start`.
  - A stale `next-server` from an earlier session holds port 3917.
