# Plan

## Concept: "The through-line"
Every customer inquiry is drawn as a single ink thread. On the left of the system it arrives frayed (a missed call, an after-hours text, a form at 11pm). BetterDesk is the point where the thread is gathered. On the right it runs calm and straight into a booked slot, a reminder, and a line in the owner's daily recap. The thread is the brand's one signature: it appears in the hero scene, the step diagrams, section rules, the pricing ledger and the logo.

Material world: warm paper (existing pearl equity, refined), deep ink, ledger rules, appointment-card stock, one signal colour (vermilion, used only for the unanswered moment and the primary CTA) and one resolution colour (deep desk-green, used only for "booked/handled"). No purple/blue gradients, no glass.

Type: Newsreader (editorial display, optical sizes, italics for the human voice) + Geist (UI) + Geist Mono (timestamps, data). All OFL, self-hosted via `next/font`.

## Stack
Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (tokens in `@theme`), Motion (`motion/react`) for interaction states, CSS/SVG for the thread. No WebGL.

## Routes (priority order)
1. `/` homepage
2. `/demo` interactive lead journey (state machine, play/pause/step, with/without)
3. `/platform` product explorer (channels × views)
4. `/pricing` preserved prices, comparison, FAQ
5. `/how-it-works` setup journey and controls
6. `/roi` calculator with visible formula
7. `/solutions`, `/solutions/home-services`, `/solutions/beauty-wellness`
8. `/contact` working mailto composer (no backend credentials exist)
9. `not-found`, sitemap, robots, OG image

Legal pages are intentionally **not** built (no authentic source). See CLAIMS_AUDIT.

## Acceptance
- `npm run build`, `typecheck`, `lint`, unit tests pass.
- Playwright: all routes 200, no console errors, no horizontal overflow at 320–1920, nav/CTA/footer links resolve, demo + explorer + ROI interactive tests pass in Chromium and WebKit.
- Every number on the site is either a published price, a user input, or labeled sample data.
- Deployed to a Vercel URL that returns 200 to an anonymous request.
