disposition: fix

# BetterDesk V3: independent design review

Reviewed from screenshots in `docs/v3/screenshots/after/` (home at 1440/390/320, beats missed-40/62, signal-4/45/95, lower sections; pages pricing, how-it-works, solutions/home-services, platform at full length), V2 `before/viewport/home-1440`, and source (`components/home/*`, `lib/story.ts`, `components/Pricing.tsx`). I did not open: the 768/1280 sets, webkit, reduced-motion, or the demo/contact/roi/beauty pages. There was no direction contract, no QUALITY BAR card and no craft-floor path, so I judged against brief sections 3, 4 and 7. I did not run motion live; motion is judged from the beats and the code.

## 1. Grades (1-10)

| Dimension | Grade | Why (screenshot-grounded) |
|---|---|---|
| Hero balance/composition | 6 | The headline block is excellent (home-1440-0-first). The right side has three loose fragments: a dark call card, a white text card, and a calendar that is blurred and cropped off the right edge. That calendar reads as a rendering bug, not as depth. The red hairline cuts through the calendar text. The bottom ~180px is dead, with an orphan caption in the far corner. |
| Originality vs generic AI SaaS | 5 | Left text, right floating UI cards, porcelain plus graphite, one accent hairline: the clean template of 2024-26. V2 (before/viewport/home-1440, with amber light and a full-width headline) was more art-directed. The original asset is the story: one plumbing afternoon (Marco/Jess) carried through every act. |
| Typography | 7 | Instrument Sans display is tightly tracked and the hierarchy is confident. Mono timestamps add texture. Against it: one family, a little anonymous. In Act II the lines are fading ghosts (text-ink/14%, below AA), and line 4 has a stray indent (see section 4). |
| Color/material/lighting | 5 | The brief asked for "natural reflection, one illuminated signal thread". What shipped is flat grey ground, a 135deg white sheen on graphite cards, soft drop shadows, and a 1px red line with no light. The Act III stage is a near-black void with a faint vignette. |
| Motion/scroll storytelling | 6 | All the parts exist: hero blur/parallax, the Act II pinned beats, Act III scrubbed with a Play/Replay control and text captions, and the answers clip-reveal. But Act II is an opacity step-switch, not a transformation, and its clock runs 2:14, 2:14, 2:16, then back to 2:14. Act III's "signal line" is a progress bar on the left, not a thread joining inquiry to calendar. The final beat covers its own payoff message. 360vh of pin for four sentences is long. |
| Business clarity | 8 | The headline and subhead say exactly what it does. The "for plumbers, salons..." line and "a person sets it up" answer fit and effort. Missing: any price in the first viewport (V2 said "Plans from $149"), and "Book a demo" does not book. |
| Mobile (390/320) | 6 | At 390 the hero reads well, but the call card is decapitated (number hidden). At 320 only "Alder Plumbing · ma..." and half an avatar show. "See a conversation" wraps and sits indented under the button. At 390 signal-95 the booking card hides the last two messages. Act II text is 17px ghosts. |
| Subpage quality | 6 | Consistent, calm and honest, but templated. Every page runs: H1 and paragraph, a red stub rule hanging off the left edge, a vertical red-dot timeline, a dark band, an accordion FAQ, then the identical "Bring last week's missed calls" close. Platform's "Your answers, your rules" renders as a clipped sliver ("l diagnostic visit, credited to the job if w") in a ~400px dead zone (platform-1440-full). |
| Honesty of claims/labels | 8 | "Illustrative" labels are everywhere. Pricing is marked Proposed with an FAQ. The calculator shows its math and says it is "not a promise". Deductions: "Book a demo" is a mailto, the strikethrough price reads as a sale, "V3 prices" is internal jargon on a public page, and the mobile first viewport shows sample data with no label. |
| Overall Apple-grade craft | 5 | Clean and competent, but not directed. Overlaps, a backwards clock, a stray indent, a clipped panel and dead zones are the details an Apple-grade pass removes first. The signature moment is not yet describable in one sentence. |

## 2. Top 10 weaknesses (ranked by visual + commercial damage)

1. **The primary CTA lies by one word.** "Book a demo" goes to /contact, and the form "opens your email app" (CloseCta step 1). Brief section 3 allowed that label only if booking works. Fix: rename it to "Request a demo" / "Ask for a demo" in `components/home/Hero.tsx:64`, `components/SiteHeader.tsx:108,147`, `components/home/Sections.tsx` (CloseCta) and `components/Pricing.tsx`, or wire a real scheduler.
2. **The Act III payoff covers itself.** At signal-95 (1440 and 390) the booking card sits over the confirmation bubble ("AM. Thanks Jess,") and over "8-10 please". Fix in `components/home/SignalToBooking.tsx`: when the card arrives, translate the thread up by the card's height (or dock the card below the pane, outside it), so no message is occluded.
3. **The hero object is not a centerpiece.** Fix in `components/home/Hero.tsx`: bring the calendar inside `.wrap`, or crop it on purpose with a mask fade. Start `backBlur` (line 26) at 0px, since blur at rest reads as a bug. Route the red thread around the calendar text, not through it. Scale the cluster so it ends near y≈780. Move the "Illustrative example" caption up under the object.
4. **Act II defects.** (a) In `MissedMoment.tsx:56` the transparent dot `span` (inline-block plus mr-2) still takes ~18px when beat<3, which indents line 4 at every width. Render it only at beat 3, or position it absolutely in the gutter. (b) `BEATS[3].time` is "2:14 PM" after "2:16 PM", so the card's clock runs backwards. Label beat 4 "Same call, with BetterDesk" and keep 2:14 visibly as a rewind. (c) Raise the future-line opacity from 14% to at least 35%, and the past-line opacity to 55%.
5. **Material and light are below the brief.** The signal thread should be light: a bright core, a soft glow falloff, and a specular catch where it meets each card. The graphite card wants a real edge highlight and reflection, not a diagonal sheen. Work in `app/globals.css` (shadow-object, tone-dark) and the SVG thread in `Hero.tsx` / `SignalToBooking.tsx`. Without this the page is "clean", not "premium".
6. **Act III is not the signature motion.** At signal-4 the right pane holds one row, and the lower ~40% of the stage is empty. The brief's "single signal line connects inquiry, response, follow-up, times, calendar" is only a stepper. Fix in `SignalToBooking.tsx`: draw one continuous line across the stage, from the call surface through the thread to a calendar surface that slides in. Centre the stage vertically. Grow the pane with the conversation.
7. **Mobile hero object.** Fix in `Hero.tsx` below 400px: offset the text card so the call card's name and number stay visible, or merge both into one "Missed call from Jess R., text sent 2:14" surface. The 320 quiet link indent comes from the quiet-variant padding in `components/Button.tsx`; zero the inline padding when wrapped, or set `-ml`.
8. **The scroll reveal gates content.** `ApprovedAnswers.tsx:33` clips to `inset(38% 30% ...)` until "start 0.3", leaving a sliver and a dead zone in any un-scrolled or fast-jump render (platform-1440-full). Start at about `inset(6% 4%)`, finish by "start 0.6", and keep the text readable at every scroll position.
9. **Subpage sameness.** Vary the structure per question. How-it-works gets a real artifact (the setup checklist as a document). Home-services gets a trade artifact (a day's dispatch board with an urgent gas-smell row). Platform's channel table is good, so keep it. Remove or vary the left-edge stub rule in `components/PageIntro.tsx`. Give CloseCta per-page copy instead of an identical close five times.
10. **Price presentation.** The `<s>$149</s>` in `Pricing.tsx:28` reads as "sale, 13% off" to a buyer, a discount the business has not authorised. Use plain "Preview price. Current list price $149." Replace "the proposed V3 prices" in the calculator with "proposed prices". Add "From $129/mo, setup included" to the hero footnote. Update `PRODUCT.md`, which still says "$149/$299/$599 preserved exactly" and contradicts the shipped page.

## 3. First-viewport comprehension (owner's voice)

**From home-1440-0-first:** "It's a service that texts people back when I miss their call, keeps after them, and gets them booked on my calendar. It's for plumbers and salons like me, and somebody helps me set it up. It matters because I'm under a sink half the day and those calls go to the next guy. 'Book a demo': I'd pick a time on a calendar and someone walks me through it."
- What actually happens: a form that opens their email app, then they wait for a reply. This is the biggest mismatch.
- Hesitations:
  - "Inquiry" is office language. A plumber says "call".
  - "Is it a robot texting as me? Does it use my number?" Nothing answers this.
  - "How much?" No price is shown.
  - "Who is Marco? Is Alder Plumbing a real customer?" The sample caption sits alone in the bottom-right corner and is easy to miss.
  - The blurred calendar on the right looks broken.

**From home-390-0-first:** The same core understanding, from the headline, the subhead and the text card. Two losses:
- The "for plumbers, salons..." fit line falls off the fold.
- There is no "Illustrative" label anywhere in the viewport, so Alder Plumbing / Jess R. read as a real customer.

The dark card's phone number is hidden, so it reads as a decorative black block. "Booked Thursday" with a tick is persuasive, but it implies booking always happens. The calendar condition is only explained in Act III.

## 4. Broken or misleading

- **Overlap and cut-off text:** at home-*-signal-95 the booking card hides the final messages; at 390 the "3:33" bubble is half covered.
- **Stray indent:** line 4 of Act II at every width (missed-40, missed-62).
- **Time inconsistency:** the call-card clock goes back from 2:16 to 2:14. The header time and the giant clock show the same value twice.
- **Dead zones:**
  - home-1440 hero bottom band
  - lower ~40% of the Act III stage (signal-4)
  - platform "Your answers" section (sliver panel)
  - the empty left column under the answers copy (home-1440-answers-title)
- **Rendering-bug look:** the blurred, cropped calendar at the hero's right edge.
- **Unlabelled sample data:** the 390 and 320 first viewports.
- **Hidden content:** the 320 hero call card is almost fully covered.
- **Contrast (likely under 4.5:1, not measured):** Act II ghost lines; on the dark stage, the step labels ("The reply", "Open times") and "or keep scrolling".
- **Misleading CTA:** "Book a demo" leads to mailto (the close section admits it; the hero does not).
- **Pricing:** the strikethrough reads as a discount, "V3" jargon appears in the calculator footnote, and there is no price above the fold. The pricing page's "Nothing is charged here" is good and should be kept.

## persistence
Partial fail.
- `PRODUCT.md` exists but is stale: it says pricing is $149/$299/$599 "preserved exactly", while the site ships $129/$249/$499 marked proposed.
- `DESIGN.md` predates V3 (commit a7368cb documents the V2 build). I did not verify it against V3; it likely describes the V2 world.
- No `.impeccable/build/state.json`. This is a code-led build, so not applicable.
- `.impeccable/review/desktop.png` and `mobile.png` exist.

## fidelity
There is no approved comp, so the check runs against the brief.
- Act I: adaptation. The headline and subhead match the brief. The centerpiece is contradicted: the "illuminated signal thread / reflection" is not rendered.
- Act II: match on the scenario and labels; contradicted on in-place transformation (step-switched copy, backwards clock).
- Act III: missing the single connecting signal line. The Play control and text equivalent match.
- Act IV: match for the full-bleed inbox and the approved-answers detail. The limitations block is present on platform.
- Act V: match for the calculator (visible math, disclaimer) and the proposed pricing with limits.
- TYPE: match (a committed display face). MATERIAL: contradicted (flat cards against a brief asking for light and reflection). GROUND: no authority (OWN-WORLD names no color), so no verdict.

## ceiling
No QUALITY BAR card was provided. Unused devices: light on the signal thread and the card edges; a hero object scaled and anchored as one composed artifact; the shared-element close-up transition (brief section 4.3), of which the clip-reveal is a weak stand-in; per-page signature artifacts on subpages.

## material_fixes
1. Relabel or wire "Book a demo" (weakness 1; brief section 3).
2. Un-occlude the Act III final beat (weakness 2).
3. Recompose the hero object and remove the blur and crop at rest (weakness 3).
4. Act II indent, clock and contrast (weakness 4).
5. Give the signal thread and card surfaces real light (weakness 5).
6. Draw one continuous signal line in Act III and fill the stage (weakness 6).
7. Mobile hero object at 390/320, plus an above-fold sample label (weakness 7, section 3).
8. Soften the ApprovedAnswers clip gate; fix the pricing strikethrough, the jargon and the stale PRODUCT.md (weaknesses 8, 10).

## keep
The plain-English headline and subhead, the single Marco/Jess afternoon threaded through every act, the visible calculator math, and the honest "Proposed" and "Illustrative" labelling. Do not trade any of these for spectacle.
