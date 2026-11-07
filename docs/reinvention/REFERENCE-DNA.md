# REFERENCE-DNA: NOT CAPTURED (blocked)

Status: no reference site was loaded; no screenshots or measurements exist. Nothing here is invented.

## What blocked it
- Chromium (Playwright cache build 1248, headless shell) cannot launch inside the Bash sandbox: `bootstrap_check_in ... MachPortRendezvousServer: Permission denied (1100)` (macOS Seatbelt). The gstack browse binary fails identically at browser launch.
- A retry with `dangerouslyDisableSandbox: true` was denied by the auto-mode classifier (safety-bypass flag). Not retried.
- Playwright's default Chromium (1254) is also not installed; the script uses 1248 via `executablePath`.

## Sites: all NOT CAPTURED
apple.com, apple.com/macbook-air, apple.com/iphone, attio.com, linear.app, raycast.com, vercel.com, wisprflow.ai, and the 4 Awwwards picks (awwwards.com never tried).

## What exists
- TypeUI extractor (bergside/design-md-chrome v0.4.0) read: permissions `activeTab`, `scripting`, `storage`, `downloads`; extracts typography, colors, spacing/gap, radius, shadows, motion.
- Ready script: `/private/tmp/claude-501/ref.mjs` (1440x900 + 390x844 screenshots, slow scroll, computed styles, pill count, CTA count, overflow). Output JSON goes to `/private/tmp/claude-501/<name>.json`.

## To unblock
Run outside the sandbox (e.g. `! node /private/tmp/claude-501/ref.mjs '<sites json>' r1` from the repo root), or authorize an unsandboxed browser launch, and the doc can be completed.
