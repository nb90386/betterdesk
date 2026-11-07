# Pass-05 Design Review (screenshots only)

## 1. Verdict
**REJECT (narrowly)**: the hero, mobile stack, sticky bar and several subpage heroes are now genuinely good and near the Sayable bar, but a visible text-collision bug in the hero schedule, an empty-feeling walkthrough first state, dead space in the scroll story, a cream-beige close that abandons the night world, and still-templated lower page rhythm keep it short of founder-review quality.

## 2. Pass-02 flaw status

| # | Pass-02 flaw | Status | Evidence |
|---|---|---|---|
| 1 | Dead voids in "Follow one call" | Partial | home-1440-mid now has a lit panel, progress segments and a Call/Reply/Asked/Booked/Inbox timeline, and the active step is full contrast. But the left column still has about 300px of black between steps. Inactive steps ("You see what happened.") are still washed-out grey. The panel has about 130px of empty interior between the note and the timeline. In home-1440-full the section is still about 2,100px tall. |
| 2 | Hero has no focal hierarchy | Mostly resolved | home-1440-top: the chat card is larger, with an amber rim and glow, and is clearly the focal object. The schedule rail is compact and the 8:00 slot is now a real "Booked" card. The missed-call node is small and stranded, and a dead band remains under the left column. |
| 3 | Empty product UI in captured states | Partial | The hero, reply and rule states render fully. The walkthrough default (home-1440-mid2, demo-1440-top) still opens at step 1 with a blank cream phone and an empty right pane about 250px tall. |
| 4 | Abrupt dark/cream seams | Partial | home-1440-full shows one feathered dark-to-cream transition (about y 3500). The close is still pale cream/beige, so the page ends in a different world from the hero. |
| 5 | Subpages are the old template with a banner | Partial | pricing has a receipt artifact, how-it-works has a setup-agenda card, platform has the inbox rising out of the banner, and roi has a live dot-chart panel. demo-1440-top has an empty right half and no artifact. contact-1440-top is fully cream with no night world. Below the heroes it is still cream cards. |
| 6 | Walkthrough toolbar clipping | Resolved | demo-1440-top: all three scenario tabs fit, and the toggle and sample label no longer collide. |
| 7 | Mobile hero / orphan CTA / wrapping node | Resolved | home-390-top and home-320-top: full-width primary CTA with a centred secondary. The missed-call node is a clean horizontal row with no stray dot. |
| 8 | Mobile sticky CTA overlap | Resolved | home-390-mid and mid2: an opaque dark bar with a hairline and short copy ("From $149/mo · setup with a person"). No bleed-through. |
| 9 | Too many equal-weight sections | Unresolved | home-1440-full is still hero / three columns / sticky story / walkthrough / two cards / three pricing cards / FAQ / CTA. There is no full-bleed peak or scale break. "Two endings" is not promoted. |
| 10 | Typography details | Partial | The CTA headline is now two lines and the card is no longer rotated at 1440. Hero microcopy ("For plumbers, salons...", 13px grey) is still low contrast. The hero schedule card is still rotated at 768 and 390, with ghost text (see new flaw 1). |

## 3. New / remaining hard flaws (ranked)

1. **Ghost text collides with the "Booked" card.** The "Holding for Dana M." label shows through behind "Booked · 6:47 PM" and the check badge. It is faint in home-1440-top (about x1190, y460) and clearly broken in home-768-top (about y1225) and the mobile hero. The card is also visibly tilted and soft at 768. Fix: in the hero schedule component, set the hold label and its container to opacity 0 and `visibility:hidden` once the booked card lands. Remove the rotation, or animate it to 0deg at rest. This is the most visible defect in the hero.
2. **Walkthrough opens on its emptiest state.** Step 1 shows a blank phone ("A call rings out / Press play...") beside a mostly empty right pane (home-1440-mid2, demo-1440-top, home-390-mid2, where the phone is also clipped under the nav). This is the interactive centrepiece. Fix, in the walkthrough component: default to step 4 or 5 (booked), or autoplay muted on entry. Fill the right pane with a mini timeline or the two-ending contrast.
3. **The story section still has dead space.** The left column (home-1440-mid, y 150-800) has 300px gaps and dimmed inactive steps. The panel has an empty slab at y 500-620. Fix: cut the step height to about 70vh, raise inactive steps to about 55% opacity, and collapse the panel interior or put a live inbox-preview row there.
4. **The close abandons the night world.** home-1440-bottom has a pale beige CTA, a footer in the same beige, and a card that repeats the hero booking. The page "settles" visually, but the hero's drama never returns. Fix: end on a graphite band with one amber lamp glow and a pearl booking card. Keep the footer dark. Replace the duplicate Dana card with the owner's morning inbox summary, which is the "then morning" payoff.
5. **The lower page is still templated** (home-1440-full, y 3600-8240). "Built for" (two cards), pricing (three cards), FAQ and CTA are sequential same-weight blocks on one cream plane. There is no peak moment comparable to the hero. Fix: promote "Same call. Two endings." to a full-bleed split, dark "Without" against pearl "With", with oversized numerals. Compress "Built for" into a strip and give pricing one scale-breaking element.
6. **Hero composition leaves holes.** home-1440-top has a 100px dead band below the left copy and the schedule. The body copy is about 17px against a 90px headline, which is a big jump. The missed-call node and its caption float unanchored. The product trio is smaller than the headline's visual weight. Fix: scale the chat card about 1.2x with a lit top edge. Tether the node to the chat with a visible amber line. Bring the 13px footnote up to #a0a0a8 or lighter.
7. **demo and contact subpages are weaker than the rest.** demo-1440-top has an empty right half in the dark hero and a pale panel below. contact-1440-top is a plain cream form with no hero, no night styling and a mailto-style "Write the email" button, which feels low-trust. Fix: add a hero artifact to demo (the phone, partially lit). Give contact a dark left column in the home palette and replace the mailto behaviour with a real submit, or state clearly what happens next.
8. **The pricing hero receipt carries little information.** The "included / included / included" rows (pricing-1440-top, pricing-390-top) repeat the headline. The three plan cards below are the standard SaaS trio. Fix: turn the receipt into the plan-selector (a Starter/Growth/Scale toggle changes the total), and show a "pays for itself at N bookings" line from the ROI model.
9. **Mobile length and hero order.** home-390-full is about 13,000 CSS px. In home-390-top the chat artifact is below the fold, and only the missed-call row shows. Fix: tighten the hero copy to two lines and show a condensed chat above the CTA or immediately under it. Merge the "Built for" and FAQ blocks on mobile.
10. **Trust is thin.** Every surface is "sample data". There is no consent/opt-out language for texting, no integration logos (which calendars), no customer quote, and no security or privacy statement. The price is clear, which helps. Fix: add a compact trust strip near pricing: texts include opt-out and quiet hours, owner-approved answers only, supported calendars, and a founder note.

## 4. Scores (1-10)
- **Originality: 7.** The night-desk amber world and the Dana-at-8:00 thread are distinctive, but the lower page is conventional.
- **Hero impact: 8.** The tight 90px two-tone headline, the lit chat card and the believable schedule hold up at 1440 and 1920. The ghost-text bug and trailing dead band cost points.
- **Art direction: 7.** The hero, story panel and subpage dark banners are cohesive. The cream mid/lower page and the beige close break the "lamp" idea.
- **Product demonstration: 8.** Call, text, intake, rule, booked, inbox, the inbox mock on platform and the ROI dot-chart all show the product. Docked for the empty walkthrough open.
- **Motion (inferred): 6.** Frames show settled hero states and a progress timeline, but the stray hold label and the tilted card suggest unresolved end states.
- **Typography: 8.** Strong headline tracking, clean mono for times, readable body. Small grey microcopy and the headline-to-body gap are the weak points.
- **Information clarity: 8.** What, who, price and how it works are all clear in the hero, with a clear step model.
- **Page rhythm: 5.** Strong hero, then a long even run of similar sections and a flat close.
- **Business copy: 8.** Concrete and honest ("Office closed at 5. Both techs are still on jobs."). A bit long in the story.
- **Mobile execution: 7.** The hero stack, CTA and sticky bar are fixed. The page is very long, the chat sits below the fold, and the walkthrough phone clips under the nav.
- **Conversion/trust: 6.** Clear CTA and visible price, but no consent, integration or proof, and the contact form is weak.

## 5. Head-to-head against Sayable
- **Hero:** at or slightly above. Sayable's hero is a clean centred headline plus a bespoke annotated-document artifact. BetterDesk's lit-chat plus schedule hero has more atmosphere and a darker, more premium treatment. Sayable's artifact is a single, clearer story with annotation callouts ("no accessible name"), where BetterDesk shows three fragments.
- **Product storytelling:** at the bar in the scroll story (a pinned lit panel with a timeline). Below Sayable's mid-page, where the annotated overlay is a single hard-hitting demonstration and a feathered dark band gives a deliberate peak ("A document can look right and still..."). BetterDesk has no equivalent peak after the hero.
- **Rhythm and execution:** below. Sayable alternates clear peaks (dark band, big centred statement) with whitespace. BetterDesk's lower half is a series of cream cards.
- **Execution polish:** Sayable has no visible text-collision bugs. BetterDesk's ghost label is one, so it is slightly below on polish.
- **Overall:** about 85-90% of the Sayable bar. The remaining gap is a mid-page peak, the close, the empty walkthrough open and the stray-text bug.
