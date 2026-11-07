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

---

# Verdict pass (recaptures from commit 97c8845)

Evidence: valid. desktop.png is 1440x8632 and mobile.png is 780x29332; both show the top and match their names. The blank right column of the desktop story is again the sticky stage in a full-page capture, and home-1440-mid2 shows the stage in place.

## verdict
1. Seed: partial. The reference is now inside FORM and says plainly that the roll was skipped. But the token `seed: none (unavailable)` is reserved for a roll that printed "SEED REFERENCE unavailable". This roll never ran, so the token states an outcome that did not happen, and a skipped roll stays a material finding. Either run the roll once the CLI is installed, or write the token as a skipped roll (for example `seed: none (roll skipped, brief-pinned)`) and leave it open for the founder.
2. CtaBand overflow at 390: resolved. In mobile.png the pill and the "This morning" card sit inside the margins and the rows wrap (pass-10-sections/close-390.png).
3. Eyebrows: partial. On the home page it is resolved: the peak labels are folded into the h3s, the industry names are in the card headings, the story times are paragraph run-ins, and "Step 2 of 8 · 6:42 PM" now sits below its h3. On the solutions page (pass-10/solutions-1440-top.png) "Home services" and "Beauty & wellness" still sit above the card headings, and "Also a fit" heads the next block. On contact, "What the call covers" in amber sits above the list.
4. Mono as costume: partial. The uppercase mono labels and "Tech: Marco" are gone, and "Next morning" is sans. The walkthrough phone's meta lines are still mono with words in them: "BetterDesk · 6:42 PM", "Customer · 6:45 PM" and "Missed call from (512) 555-0148 · 6:42 PM" (desktop.png walkthrough, about y4300). That last one was named in the fix.
5. Glyph icons: partial. Solutions "Read more" now shows the authored arrow (solutions-1440-top). The pricing comparison table and the ModeSwitcher check appear in no recapture, so I can only see them in source. components/HeroScene.tsx:159 still contains "Thu 8–10 AM ✓".
6. Nav translucency: resolved. The bar is opaque in home-1440-mid2 over the walkthrough and in home-320-bottom over the footer, with no bleed-through.
7. States and spacing: resolved. The walkthrough first state reads "Watch what happens next." next to Pause. The step-5 inbox rows wrap at 390 with no truncation (mobile.png). The desktop progress segments now sit about 45px below the intro copy and no longer read as underlines.
8. Truth placeholders: partial. The footer shows "Privacy policy and terms: pending, not yet published." at 1440 and 390. The contact card carries a pending SMS-consent, opt-out, privacy and terms line (pass-10-sections/contact-1440.png). At 320 (home-320-bottom) the sticky CTA bar covers the footer's last lines at full scroll: "illustrations with sample data." is cut and the new privacy line is hidden under the bar. Pad the page bottom by the bar's height.

Regression from the batch:
- The story ground now warms from 6:42 to the morning, ending near rgb(31,27,22). It ends in a hard horizontal edge against the peak's #0d0e10 night half (desktop.png about y3600-3690; mobile.png at the story-to-peak boundary). The arc warms and then snaps back to night exactly at the peak. Either carry the warmed floor into the night half of the split, or fade it before the section edge.

## remaining
- Fix 1: the seed token misstates a skipped roll as an unavailable one.
- Fix 3: eyebrows remain on solutions (the industry labels, "Also a fit") and on contact ("What the call covers").
- Fix 4: mono wraps words in the walkthrough phone meta lines.
- Fix 5: the ✓ in HeroScene.tsx:159 remains, and the pricing-table and ModeSwitcher checks are unseen in any capture.
- Fix 8: the privacy placeholder is hidden under the sticky bar at 320.
- Regression: the hard seam between the warmed story floor and the night peak.
- Ceiling items (b) to (g) from the review round remain open and are not scored here. Founder approval of the direction is still owed.

disposition: fix
