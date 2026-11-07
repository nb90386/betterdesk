# Typography decision

## Rejected / previous
- **V4:** Funnel Display (display) + Geist (UI/text) + Geist Mono. Removed from `app/fonts/` and from every surface on this branch.
- **V3:** Instrument Sans. Not used anywhere.

## Selected
| Role | Face | Source | License | File |
|---|---|---|---|---|
| Display, UI, text (one family) | **General Sans** variable, wght 200–700 | Indian Type Foundry via Fontshare (api.fontshare.com download, 2026-11-07) | ITF Free Font License 2.0: commercial use and self-hosting permitted; **no subsetting, modification or redistribution** (so the full file is shipped, 38 KB woff2) | `app/fonts/GeneralSans-Variable.woff2` + `GeneralSans-LICENSE-ITF-FFL.txt` |
| Code-like evidence only (robots.txt lines, JSON-LD) | **Martian Mono** variable | `@fontsource-variable/martian-mono` 5.3.0 | SIL OFL 1.1 | `app/fonts/MartianMono-Variable.woff2` |
| OG image only | General Sans Semibold/Regular OTF | same download | ITF FFL (embedding in images permitted) | `assets/og/` (not web-served) |

Loading: `next/font/local`, `display: swap`, Arial-metric fallback adjustment for General Sans (no measured layout shift: CLS 0 on all content pages in Lighthouse); Martian Mono not preloaded.

## How it was chosen
Five candidates rendered with the real headline, wordmark, directory rows and numerals: `docs/reinvention/type/specimen.html` → `screenshots/type/specimen.png`.
- General Sans: most confident display, clean tabular figures in directory rows. **Chosen.**
- Host Grotesk (OFL): cleanest runner-up, slightly thinner voice. Best alternative if the founder wants a fully OFL stack.
- Hanken Grotesk: reads light at the same weight. Schibsted Grotesk: odd tabular comma spacing. Mona Sans: GitHub association.

## Scale (as shipped, `app/globals.css`)
| Token | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| `.t-hero` | clamp(2.45rem, 1.25rem + 3.9vw, 4.6rem) | 620 | 0.98 | −0.038em |
| `.t-display` | clamp(2.1rem, 1.3rem + 3vw, 3.9rem) | 610 | 1.0 | −0.034em |
| `.t-title` (h2) | clamp(1.7rem, 1.15rem + 1.95vw, 3rem) | 600 | 1.04 | −0.03em |
| `.t-lede` | clamp(1.125rem, 1.02rem + 0.4vw, 1.3125rem) | 420 | 1.48 | −0.006em |
| body | 1.0625rem | 420 | 1.55 | 0 |
| `.t-label` | 0.8125rem | 560 | — | +0.002em |

Numerals: `tabular-nums` on every data column, time and count. Mono is never used as a costume for "technical".

## Proof it shipped
- e2e asserts every public route's h1 computes to General Sans and not Funnel/Geist/Instrument (`tests/e2e/site.spec.ts`, 13 routes × 2 engines, passing).
- Before: `docs/v4/screenshots/final/home-1440-first.png`. After: `docs/reinvention/screenshots/r3/home-1440-first.png`.

## Honest risk
The independent finish reviewer noted the new display face is a *near-sibling* of V4's (both heavy neo-grotesks with tight tracking); the visible difference comes as much from ground, colour and composition as from letterforms. If the founder wants a more obviously different voice, the cheapest test is General Sans at 540–560 weight for display, or Host Grotesk. This is a founder decision.
