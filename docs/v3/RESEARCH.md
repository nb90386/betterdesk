# V3 visual reference teardown

Captured 2026-11-07: headless Chromium, 1440x900, top viewport plus frames at about 30% and 60% of page height. Wheel-scrolled extra frames (`-x*`) were added for smooth-scroll sites. All PNGs are in `docs/v3/screenshots/references/`. Notes cover only what rendered. Anything I took from text alone is marked.

## What could not be rendered
- **All awwwards.com pages** return HTTP 403 to the headless browser. I did not bypass the block. I read the three given Awwwards pages and the SOTD list as text with a fetch tool, then rendered the original sites they point to.
- **UAE Pavilion** (2025.uaepavilionexpo.com/en). The first visit never got past its preloader in about 6.5s. The second visit got a Cloudflare "you have been blocked" page, and I deleted those frames. **I never saw the sand-particle cursor.** The only frames are the preloader.
- **Joy from Africa** (jfa-awards.snp.agency). Only the gated intro rendered: a "LOADING 09%" counter, then the illustrated scene behind an ENTER SITE gate. My click did not get through, so **I never saw its scroll interactions.**
- **Apple product page.** At 30% a tall band is blank above "Great powers come with great privacy". That is very likely lazy or scroll-triggered media that did not paint in headless, not a design choice.

## Apple: home and MacBook Air
- **Good.** The MacBook Air hero is mostly empty white. The product sits edge-on as a thin sliver at the centre. The headline sits low-left at about 64px with a two-tone ink-to-blue fill. Under it is one warm line ("Now supercharged by M5", orange). It is the only warm pixel on the screen, so it reads instantly. The home page alternates full-bleed black and light tiles with a 12px gutter. Type is always centred above the object. Body copy fills in by scroll: the key phrase is in ink and the rest is in grey (product page, 30% and 60% frames).
- **Transfer.** One warm accent on a cool, quiet ground, used once per screen for the single fact that matters.
- **Don't borrow.** The pill CTA pair ("Learn more / Buy") on every tile, the gradient-filled headlines, or the tile grid. That grid is a catalogue pattern, not a story.

## Attio
- **Good.** The light hero gives way to a **dark act mid-page** (60% frame). There is no hard cut: the nav itself inverts. 1px hairline rules frame every section like a drafting sheet. A sticky left rail of five goals dims to grey except the active one ("Forecast revenue"), so scroll position becomes a chapter index without numbers. In the dark act, thin radial guide lines carry **one bright dot travelling along a line**.
- **Transfer.** A signal dot moving along a hairline path in a dark act is almost exactly our signal-to-booking beat. Attio shows it works at small scale, so it doesn't need to be huge.
- **Don't borrow.** The macOS-chrome app screenshot hero, the announcement bar plus badge plus two CTAs stack (the generic SaaS opener), or the soft lavender gradient wash.

## Linear
- **Good.** The whole site is dark. The headline is left-aligned with tight tracking at about 72px. The product UI sits under a heavy dim and fades into black at its lower edge, so it reads as *atmosphere*, not as a screenshot. At 30% the chat panel is sharp while the issue board behind it dims and fades toward the right edge: **a focus pull done with opacity and masking**. At 60%: headline left, paragraph right, then a code diff where **one red-marked line** carries the meaning.
- **Transfer.** Depth of field as a hierarchy tool. The thing being discussed is sharp and everything else recedes, instead of being boxed.
- **Don't borrow.** Dark as the default world, the purple send button, or the dense product chrome. Small-business owners need to read the interface, not just feel it.

## Inkwell (SavoirFaire; Awwwards case study read as text)
- **Good.** One continuous scroll with no chapter skipping. The top nav is only a position readout (INTRO / VISION / INTELLIGENCE fading from grey to ink). At 20 wheel steps, about 30 thumbnails sit in a ring around one centred line. At 45, the same thumbnails are re-laid as an **isometric diagonal stack**: translucent, softly blurred at the far end, one card in focus. At 70, the page **insets into a rounded frame** (about 18px margin) for an atmospheric act with blurred portrait orbs behind white type. Per the case study they wrote a synopsis, a three-act arc and a storyboard before designing.
- **Transfer.** Keep the *same objects* and recompose them each act, so the scroll reads as one camera move, not a series of sections. Also the inset frame as the doorway into a different act. Our dark act could enter the same way.
- **Don't borrow.** The periwinkle-to-peach gradient sky, or the large frame radius (about 48px, against our 16px cap). Also not the opening: it sat **blank for 2.5s+** in my capture, and the first readable line appeared only at about 30%. Too slow for a missed-call owner.

## Heron AI (verified Site of the Day, Oct 12 2026: awwwards.com/sites/heron-ai; original heronaiapp.com)
- **Good.** It is the closest palette to ours: warm grained off-white, graphite, one vermilion (#F15534 per Awwwards). The preloader is a **vermilion horizontal line with a % readout sweeping down a line drawing**. Between two rules it reveals the rendered, stippled building: wireframe becomes rendered as the line passes. Vermilion is spent only on tiny squares, the line and the CTA. The 60% frame has a large display paragraph that fills ink to grey with scroll, next to a line-drawn tower. The problem grid is four hairline columns of isometric wireframes, and the one active column gets a vermilion square.
- **Transfer.** Vermilion as an *instrument* (a line, a cursor, a 6px square), never as a fill. It shows how far one restrained accent can carry a whole site.
- **Don't borrow.** All-caps condensed grotesk headlines, mono "spec sheet" labels, crosshair-ruled page frames. That blueprint dress is Heron's identity, and it would make us look like an architecture tool. The scan-line reveal is also Sayable's signature, so ours must route, not sweep.

## Grail (verified Site of the Day, Nov 4 2026: awwwards.com/sites/grail; original grail-app.com)
- **Good.** Chapters arrive as **sheets that slide up over the previous chapter** (rounded top edge, "Chapter 02 → 03" corner labels). The old headline ghosts behind at low opacity. The 60% frame is a dark brown act where a 3D armoured duck **occludes and interleaves with the display type** ("DUCK THE KNIGHT"): the object is in front of some letters and behind others. That is real type-to-visual depth. The persistent bottom "Join Waitlist" pill sits in the same spot through every act.
- **Transfer.** Let the hero object physically overlap the headline (phone or booking card in front of part of the words), so type and object share one plane of depth instead of sitting side by side.
- **Don't borrow.** Pink ground, high-contrast didone display, 3D mascot, the playing-card hero. All of it is playful-consumer, wrong for trust with a plumber.

## Joy from Africa and UAE Pavilion (only partly seen)
- JFA: the illustration enters through an **organic blob mask that grows into a framed rectangle** while a large serif % counter runs. A preloader and an ENTER gate are not things to copy. Its scroll interactions are unverified.
- UAE: the preloader is calligraphic concentric rings with a vermilion progress arc on a sand ground. It is elegant, but loader craft doesn't count for us, since we should not have a loader.

## Sayable (local, read-only: DESIGN.md, MOTION-SYSTEM.md, Opening.tsx)
- Notes worth keeping as discipline, not as look: "One hero object recurs from the opening to the close". One accent with a written semantic rule ("Blue is structure", "Ember is a broken relationship"). One family in every role, with hierarchy from weight and tracking. A **single `--p` CSS progress variable** drives the pinned 220vh stage, with no per-frame React render. Reduced motion shows the resolved frame statically. Light-to-dark ground changes go through 5–10rem gradients, never hard cuts. "Only objects cast shadows."
- **Don't copy.** The tilted-sheet-on-seamless-paper composition, the scan line down a document, pill-everything shapes (we are low-radius), or its blue/ember pairing.

## Implications for BetterDesk V3
1. **Give vermilion one job, written down like Sayable's rules.** Vermilion is the live signal: the missed call becoming a text, then a booking. It is the routed line, its leading dot and the one fact per screen (Apple's single orange line, Heron's squares). It is never a button fill, hover, or decoration. Graphite ink carries every CTA.
2. **The porcelain world stays quiet and flat.** Use #F3F3F1 ground, hairline graphite rules (Attio, Heron) and shadows only on objects (the phone, the booking card). No gradient skies or washes. The light is a soft key on the objects, not on the ground.
3. **One dark act, entered as a camera move, not a section.** For the scrubbed signal-to-booking sequence, inset the porcelain frame (Inkwell) or soften the ground over 5–10rem (Sayable), never a hard cut. Leave the same way and land back on porcelain with the booked result.
4. **The routed line is the narrative spine.** Like Inkwell's recomposed thumbnails, the line from the hero should be the same object that routes through the dark act and ends at the booking. Draw it with a dash offset driven by one `--p` variable, with a leading dot like Attio's. It routes at right angles around content. It never sweeps down a page, because that is Heron's and Sayable's move.
5. **Depth of field is hierarchy, not decoration.** As in Linear's focus pull, the active message or booking slot is sharp and the rest of the schedule or thread recedes with blur plus lowered contrast. Animate blur radius with scroll, cap it at 2–3 steps (for example 0/4/12px), and turn blur into a plain opacity drop under reduced motion. No glass panels.
6. **Type and object share depth.** Let the phone or booking card overlap part of the display headline (Grail), set in Instrument Sans at a tighter width for display and a wider width for small labels. One family, hierarchy from weight, width and tracking, and no mono except where the system "speaks" (timestamps, a phone number).
7. **Make the first viewport readable in 0s.** Inkwell's blank opening and the JFA and UAE preloaders are the cautionary set. The headline, the one vermilion fact and the CTA must paint without waiting on motion. The scroll story is a reward, not a gate.
8. **Low radii hold the line against the references' softness.** Use 4px on chips and timestamps, 8px on inputs and buttons, 12px on message bubbles and cards, and 16px on the device and the dark-act frame. Every reference here goes larger: Inkwell about 48, Grail about 24, Apple's pills. Staying at 16 or below is part of what keeps BetterDesk feeling precise, not playful.
