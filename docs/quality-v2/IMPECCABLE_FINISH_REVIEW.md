disposition: fix

Missing or unread inputs: there was no QUALITY BAR card file, so the Sayable captures (1440 top, mid1) stood in as the bar. The `impeccable` CLI is not on PATH, so `--check-seed` could not run (exit 127). Not read: REVIEW_PASS02/05, sayable-1440-mid2 and sayable-390-top, most pass-09-sections crops, subpage 390 captures, and the how-it-works/demo/pricing/solutions/contact 1440 tops. Motion was not judged because the evidence is stills.

Evidence (check 0): passes. desktop.png is 1440x8639 and mobile.png is 780x29310 (390 @2x). Both show the document top and match their names. In desktop.png the right column of the scroll story is blank from about y1900 to y3500. That is the sticky stage pinned at its start position in a full-page capture, not breakage; home-1440-mid.png shows the stage in place. The 35px offset on the pearl half of the peak is a mid-reveal frame; the settled crop endings-1440.png is aligned.

## persistence
pass. PRODUCT.md exists. The build is code-led, so no state.json, spec, or comp is owed. There is no .impeccable/mocks/, so no approval record is owed. DESIGN.md is absent, which is expected for a new world because the documenter writes it after this review.

## fidelity
No approved comp and no critique comp, so the build is judged against OWN-WORLD and the contract.
- TYPE: match. Bricolage Grotesque display is tightly tracked with an open-counter grotesque character. Geist text, and the muted second headline line, are as contracted.
- MATERIAL: match. There is no faked physicality, no bevel, emboss, or imitation texture. The panes are honest UI surfaces. The contracted "lamp-edge highlight" and "long shadows down-right" are present but faint (see ceiling).
- GROUND: match, sampled from pixels. Night is rgb(13,14,16) = #0d0e10, the secondary band is rgb(22,24,27) = #16181b, and pearl is rgb(238,237,233) = #eeede9, all exact. The pricing and footer band at rgb(232,231,226) is a slightly darker pearl of the same temperature, with no drift toward cream.
- First viewport: two-line headline with the second line muted; left subcopy, pearl CTA and ghost link; right panorama of rings, lit thread pane and Thursday schedule with the pearl booking card. Match.
- Mobile first viewport: headline, copy, stacked CTAs, then a vertical call and thread. Match. Dropping the schedule column and moving the booking card under the thread is an acceptable adaptation, cited by the contract's own mobile line.
- STORY, five steps 6:42 to the next morning, with the persistent five-node rail: match on desktop and mobile.
- Peak, the full-bleed night/pearl split "6:44 vs 6:47": match.
- Close, dawn with the morning inbox: present. But it is a dark band with a brown floor gradient, not a dawn, and its inbox repeats the story's step-5 rows word for word (see ceiling).
- Mobile CTA band at 390: contradicted (responsive). The pill and the "This morning" card run past the right edge. Visible clipping includes "7:52 AM · sampl" and "needs your pric".
- Seed reference: see material fix 1.

## ceiling
These are the world's own devices the build left unused:
- (a) The brightening arc. The contract's premise is a page that "brightens as the missed call resolves". In fact the five story steps sit on one unchanged graphite, then cut hard to pearl at the peak. The lamp's warmth, or the ground's value, should rise step by step from 6:42 to the next morning.
- (b) Lighting. The upper-left amber lamp is a barely visible wash. The panes carry no readable lamp-edge specular and no lamp-consistent falloff. Pearl cards cast soft, short shadows, not the contracted long down-right ones. The founder's "Apple-like product lighting" is not reached.
- (c) Hero depth. The thread pane and the Thursday column sit side by side without overlap. The schedule floats unframed, and the booking card never physically settles onto the schedule over the pane.
- (d) The mark (amber rings closing onto the D) appears only in the nav and the call icon. It is never used as the story's motif or as the rail's terminal state.
- (e) The close does not advance the story. It shows the same four inbox rows as story step 5, and the walkthrough replays the same Ridgeline call a fourth time.
- (f) Equal-column scaffolds dilute the art direction. One is the three-column "phone rings" triptych (time, label, two lines). The other is the four-tile trust strip, whose short dash rules stand in for icons.
- (g) The subpage night heroes (platform, roi) leave the right two-thirds of the stage empty above the artifact.
Against Sayable, the product artifact is not as crisp or as confident: there is no single unforgettable object like Sayable's annotated paper.

## material_fixes
1. Contract (check 4): the contract has `seed: none (unavailable)` on its own line outside FORM, and nothing corroborates it. No roll output was in the packet, and `impeccable concept-seed --check-seed none` cannot run here (CLI missing, exit 127). Show the roll's "SEED REFERENCE unavailable" output, or record that the roll was skipped, and move the reference into FORM.
2. Responsive overflow (fidelity): the CTA band overflows at 390, with the pill and "This morning" card cut at the right edge in mobile.png. In components/CtaBand.tsx:19 the implicit grid track grows to the card's no-wrap min-content. Give it `grid-cols-[minmax(0,1fr)]` and let the card rows wrap.
3. Floor ban on eyebrows (check 6): small labels sit above headings in several places. They are "Home services" and "Beauty & wellness" on the industry cards, "Without BetterDesk" and "With BetterDesk" above 6:44 and 6:47, the story stamps "6:42 PM" and "Next morning", and "STEP 2 OF 8 · 6:42 PM" in the walkthrough. Move the story times into a time column in the left rail gutter, and fold the industry and side names into the headings.
4. Monospace as costume (floor, and OWN-WORLD says "Geist Mono only for times/numbers"): mono labels include "HOME SERVICES", "STEP N OF 8", "MISSED CALLS / WEB FORMS / GOOGLE BUSINESS" tags, "WHAT IT WENT ON", "Next morning", "Tech: Marco" and "BetterDesk · 6:42 PM". Keep mono for the digits only.
5. Glyph icons (floor): ✓ in the pricing comparison table (app/pricing/page.tsx:121) and in components/ModeSwitcher.tsx:76; → in solutions "Read more" (app/solutions/page.tsx:32); ✓ in components/HeroScene.tsx:159 if it ships. Replace them with the authored SVG arrow and check used by ButtonLink.
6. Legibility (craft): content shows through the sticky nav. In home-1440-mid2 the walkthrough phone text reads between "Platform" and "How it works"; in home-320-bottom the footer copy ghosts under the logo. Give the bar an opaque night base.
7. States and spacing: the walkthrough's first state says "Press play, or use the arrow keys" while the control already reads Pause (components/LeadJourney.tsx:405). At 390 the story's step-5 inbox cuts its payoff rows ("Booked Thu 8–10 …", "Quote request · n…"); wrap the summary under the name. On desktop the stage's five amber progress segments sit about 8px under the story intro and read as underlines on "call and the booked visit…" (desktop.png ~y1740); open a real gap.
8. Truth (check 5): privacy, terms and SMS-consent language are left out, not marked as placeholders, on a product that texts callers. Add labeled "Privacy policy (pending)" and "Terms (pending)" placeholders in the footer, and an SMS-consent placeholder line near the contact form and the demo CTA.

## keep
The lit night conversation pane settling into the pearl booking card, the exact-to-token night/pearl grounds, the 6:44 vs 6:47 split, and the "sample data" labeling on every artifact.
