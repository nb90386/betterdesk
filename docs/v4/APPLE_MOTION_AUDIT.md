# Apple motion audit

## System (lib/motion.ts)
| Preset | Spring | Used for |
|---|---|---|
| `SPRING.snap` | bounce 0, response 0.26s | popover, chevron, selection plates |
| `SPRING.ui` | bounce 0, response 0.34s | panels, inspector, messages, record stage, form steps |
| `SPRING.move` | bounce 0, response 0.55s | directory climb, draft → message, pipeline card |
| `FADE` | 180ms ease-out | content swaps; the reduced-motion substitute |
Exits: 140ms tween; instant when a link navigates. Press: 0.97 on `:active`. Nothing bounces: no surface is thrown by a gesture.

## Independent review → fixes (review-animations format, verdict was Block)
High: hamburger morph never morphed (path command counts) · menu item stagger on a frequent surface · directory content swap never played · draft handoff dimmed mid-flight · review form exits ran the wrong way · app used Motion's default underdamped spring. Medium/Low: symmetric exits, double popovers when switching menus, exits animating over the new page, full-viewport blur behind the opaque sheet, origin not at trigger centre, squish from size layout, neighbours snapping, no reduced-motion cross-fade, demo panel direction, Today list gap, Presence inspector y-motion on a frequent surface, mobile cursor flight, pipeline layoutScroll, sticky aside layout, no-op motion nodes, box-shadow keyframe loop. All 22 fixed in commit 9390c33.

## Interruptibility checks
- Popover: open, close and reopen 60ms apart (recordings/menu-switch-and-reverse-1440.webm): reverses from the current value; switching Product → Solutions slides the same surface.
- Mobile sheet: open/close/open within 80ms (recordings/hamburger-sheet-390.webm).
- Directory: step buttons can be pressed mid-climb; the row re-targets.

## Frame evidence (local production build, Chromium, 4x CPU throttle)
| Interaction | Frames | Over 20ms | Worst | Median |
|---|---|---|---|---|
| Directory climb (2 floors) | 73 | 1 | 23.0ms | 16.7ms |
| Product popover open | 73 | 0 | 16.8ms | 16.7ms |
Filmstrip: `screenshots/apple/filmstrip/climb-*.png` (row settles first, content reaches full contrast after).

## Reduced motion / transparency / contrast
`MotionConfig reducedMotion="user"` (site + app) turns movement into cross-fades; autoplay removed; e2e verifies the board, steps and no hydration errors. `prefers-reduced-transparency` and `prefers-contrast: more` make the bar solid.

## Not done
No real-device (iPhone) recording; emulation cannot prove touch feel. No drag interactions were added (nothing in the product needs one).
