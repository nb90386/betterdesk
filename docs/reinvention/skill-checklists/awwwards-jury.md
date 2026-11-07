# Awwwards / jury checklist

Source: juliobsz/skills @ add880b (MIT), `jury/SKILL.md`, `jury/references/quality-bar.md`, `jury/references/calibration.md`, `awwwards/SKILL.md` "Hard rules". Not installed; scripts read from the clone at `/tmp/claude-501/vendor-skills/juliobsz_skills`.

## Run /jury (needs Playwright + axe-core, both already in this repo's node_modules)
```bash
cd /Users/edge/Developer/betterdesk-redesign
npm run build && npx next start -p 4400            # background; never score `next dev`
J=/tmp/claude-501/vendor-skills/juliobsz_skills/jury
OUT=/Users/edge/Developer/betterdesk-redesign/.jury/127.0.0.1-4400
node $J/scripts/shoot.mjs http://127.0.0.1:4400/ --crawl --nav --out $OUT/shots   # 1440 desktop, 390 phone @4x CPU + slow 4G, reduced motion, focus, hover pairs
node $J/scripts/audit.mjs http://127.0.0.1:4400/ > $OUT/audit.txt                # exit 1 = found a FAIL (a finding, not a crash)
```
Chromium: Playwright bundled build (1254) is absent, so `browser.mjs` falls back to `~/Library/Caches/ms-playwright/chromium-1248`, then channel `chrome`. axe resolves from node_modules (no CDN fetch). Then hand a **fresh subagent** only the rubric path + shots dir + audit.txt (the "Critic brief" in quality-bar.md). Never show it code, DESIGN.md or calibration.md. Add `.jury/` to .gitignore before running.

## Scoring categories
Weighted overall = 0.4 Design + 0.3 Usability + 0.2 Creativity + 0.1 Content. Start every category at 6; each point above needs a cited screenshot or report field.
Bands (on jury estimate = critic + ~1.1 offset from calibration.md): < 6.5 below HM; 6.5-7.1 Honorable Mention; >= 7.2 Site of the Day range.
- **Design 40%**: 7 = clear type system, intentional palette, 1-2 memorable compositions; 8 = every frame composed, type as image, varied rhythm, every detail designed (hover, focus, captions, footer, 404).
- **Usability 30%**: 7 = fast, clear nav, mobile works, reduced motion OK; 8 = instant orientation, phone composed for the hand, 60fps, every primary hover answers in the site's motion (`hover.noHoverChange` empty).
- **Creativity 20%**: 7 = one subject-specific idea partially carried; 8 = concept drives layout, motion and a signature moment.
- **Content 10%**: 7 = specific copy, honest imagery, clear story; 8 = voice and substance.
Developer areas (each 1-10, no jury offset): Semantics/SEO, Animations/Transitions, Accessibility, WPO, Responsive, Markup/Meta-data.

## What an 8 needs (developer areas)
- [ ] Semantics/SEO: 0 audit FAILs; `lang`; one `<h1>` in server HTML (not JS-only); ordered headings; `<main>`; unique title + description per page; canonical; robots; sitemap; real 404 status.
- [ ] Animations: continuous page transition; no primary target in `noHoverChange`; no CTA/nav link whose hover is a text-colour swap only; smooth scroll.
- [ ] Accessibility: 0 serious/critical axe; skip link is the first focus stop; every focus stop visible; `reduced.hiddenText` 0; nothing moving under reduced motion.
- [ ] WPO (throttled mobile): LCP < 2.5s; CLS < 0.05; loader/intro done <= 2.6s; JS < 300KB gzip; page < 3MB.
- [ ] Responsive: no overflowX at 390; tap targets >= 24px; phone layout recomposed, not squished.
- [ ] Markup/Meta: OG + Twitter tags; `og:image` loads; favicon; viewport; alt text; accessible names.

## Critic self-test
- [ ] Hero static frame works as a poster on its own.
- [ ] Throttled (4x CPU, slow 4G) it still paints fast and holds frame rate.
- [ ] Transitions between states are continuous, not hard cuts or plain fades.
- [ ] Reduced motion: site complete and calm.
- [ ] Phone width: designed, not squished.
- [ ] Pointing at links/buttons/images: they answer in one voice. Mouse still 5s: concept still breathes (or the stillness is a stated choice).

## Hard rules worth applying (awwwards/SKILL.md)
- [ ] Body 16-18px, leading 1.45-1.6; small UI 12-14px only if AA passes; display tracking negative and set per size; optical alignment of display type.
- [ ] Every interactive element has hover, focus-visible, active; one hover treatment per role, reused; inline body links underlined at rest.
- [ ] One easing family; big things move slower; stagger 20-80ms; animate transform/opacity/clip-path only.
- [ ] Under reduced motion: no smooth scroll, no scrub, no loader theatrics, all content visible.
- [ ] If a background changes on scroll, all text colour follows one global variable; check readability at the very end of every page.
- [ ] Fixed corner UI never collides with content; fixed UI over imagery uses a scrim or `mix-blend-mode: difference`.
- [ ] Nav visible or one tap away on every page; current page indicated; native cursor always visible; nothing depends on hover on touch.
- [ ] LCP element is real HTML text or an `<img>`.
- [ ] One h1, landmarks, skip link, AA contrast, unique title/description, OG image, canonical, sitemap, robots, JSON-LD, 404.
- [ ] Decorative text duplicates (marquee copies, outlines) live outside headings/links with `aria-hidden="true"`.
- [ ] No sentence repeated across sections; device-correct copy ("tap" not "hover" on touch); no em/en dashes; no elevate/seamless/unleash/cutting-edge; sentence case.
- [ ] Avoid unless the concept demands it: centred hero over a gradient blob; three equal feature cards; purple-blue gradients; cream + terracotta serif; acid green on black; glass everywhere; eyebrow on every heading; decorative 01/02/03; hidden cursor; scroll-jacking; horizontal gallery as the only idea; 6s loaders.
