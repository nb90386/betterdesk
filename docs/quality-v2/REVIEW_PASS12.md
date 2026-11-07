# Pass-12 Design Review (screenshots only)

## 1. Verdict
**REJECT (narrowly, closer than pass 05)**: the ghost-text bug is gone, the close returns to night, and "Two endings" is now a real peak, but the interactive walkthrough still opens on a blank phone and a half-empty pane, the lower page is still cream cards, and the contact form still hands off through a mailto.

## 2. Pass-05 top five fixes

| # | Pass-05 fix | Status | Evidence |
|---|---|---|---|
| 1 | Ghost "Holding for Dana" text under the Booked card | **Resolved** | home-1440-top: the Booked card reads cleanly. home-768-top: the card is crisp, the label is gone, and the tilt is slight and reads as intentional. home-390-top shows no collision. |
| 2 | Walkthrough opens on its emptiest state | **Unresolved** | walkthrough-1440 and demo-1440-top still open at "01 / 08" with a "Press play" phone. The right pane has about 250px of blank cream between the body line and the progress bar. home-390-mid2 shows the same empty phone. A "Play walkthrough" button is the only invitation. |
| 3 | Story dead space | **Partial** | The left column in home-1440-mid is tighter, and the lit panel now has an inbox list plus a timeline with no slab gap. Inactive steps are still dim grey, and there is still about 300px of black between steps. In story-to-peak-1440 the left text column runs about 1,900px while the panel is only visible for the middle of it. The "Booked" and "Inbox" beats leave the right half black in that frame. Some of this is a capture artifact. |
| 4 | Close abandons the night world | **Resolved (close), partial (footer)** | close-1440 is graphite with an amber floor glow and a pearl route card showing the "Booked by text last night" row. That is the right "morning" payoff. The footer below it is still beige (home-1440-bottom), a mild seam. |
| 5 | Lower page templated, no peak | **Mostly resolved** | endings-1440 is a full-bleed split, dark 6:44 against pearl 6:47, with oversized numerals and amber on "booked". It is the best moment on the page after the hero. The stretch after it (walkthrough, "Built for" two cards, pricing trio, FAQ) is still cream cards in sequence. |

## 3. Remaining hard flaws (ranked)

1. **Walkthrough opens blank.** `components/` walkthrough component, right detail pane and phone. Default to step 7 ("The job is booked") with the booking card showing, or autoplay muted on entry. Fill the right pane with a mini timeline or a "Without / With" delta line. Page-level cost: this is the main interactive demo.
2. **Cream mid-page after the endings peak.** `app/page.tsx` sections "Now step through it" through the FAQ, on one flat #eeede9 plane. Make the walkthrough shell a dark device-stage so the amber lamp stays lit, or put a feathered dark band behind it. Keep pearl only for settled outcomes.
3. **"Built for businesses..." card pair.** home-1440-mid2 and home-1440-bottom: a dark card beside a cream card, with the headings clipping inside. Replace with a single strip of two rows, each with a one-line example and a text link, or give each a bespoke artifact. The pair currently reads as the same template as pricing.
4. **Pricing trio and the pledge card.** home-pricing-1440: three standard SaaS cards, then a large underlined-phrase card. The underlines on five phrases read like highlighter noise. Underline two phrases at most. Reuse the plan-selector receipt from pricing-1440-top, which is the better artifact, instead of three cards.
5. **Contact submits through mailto.** contact-1440: the form is good-looking and honest ("Nothing is sent until you press send"), but a mailto button is low-trust on a conversion page. Add a real POST route, or demote the form to a clear email composer with a copy-to-clipboard button.
6. **Story left column length.** `components/SignalStory.tsx`: step height and inactive opacity. Cut step height to about 60vh and raise inactive text to about 55% opacity. In story-to-peak-1440 the early steps (1 to 2) have no right-hand visual at all.
7. **Hero left column floats.** home-1440-top: the missed-call node, caption and the 17px body copy sit loosely beside the chat card, with a dead band below the CTAs. Tether the node to the chat with a stronger amber line, and set the footnote and microcopy to about #a0a0a8. The microcopy ("For plumbers, salons...") is still about 13px and dim.
8. **Footer and nav seams.** home-1440-bottom: the footer is beige beneath a graphite close. Make the footer graphite to end the page in the night world. Mid-page captures (home-390-mid2, pricing section crop) show the nav overlapping content, which reads as a capture artifact, but check that the sticky nav never clips headings at 768.

## 4. Scores (1-10; pass 05 in brackets)
- **Originality: 8 (7).** The amber lamp, the Dana-at-6:47 thread and the 6:44 / 6:47 split are distinctive. The lower cards are generic.
- **Hero impact: 9 (8).** The 90px two-tone headline, lit chat card and a clean Booked card hold at 1440, 1920 and 768. The remaining gap is the loose left column.
- **Art direction: 8 (7).** The close and endings now carry the lamp idea. The cream walkthrough and footer dilute it.
- **Product demonstration: 8 (8).** The story panel (intake rows, the rule, inbox list, timeline) is believable. The walkthrough's blank open still docks it.
- **Motion (inferred): 7 (6).** The booked card is clean at rest and the progress segments suggest scroll-driven state. Static frames cannot confirm more.
- **Typography: 9 (8).** The big numerals in the endings, the tracking in the headlines and the mono used only for times are well disciplined. Small grey microcopy still lags.
- **Information clarity: 9 (8).** What, who, price and how are clear. The "real / sample / depends on you" strip on the walkthrough is excellent honesty.
- **Page rhythm: 7 (5).** The hero, the lit story, the split peak and the dark close give a real beat. The middle is still a cream plateau.
- **Business copy: 8 (8).** Concrete and honest. Still long in the story steps.
- **Mobile execution: 7 (7).** The hero stack and sticky bar are clean, and the walkthrough phone is no longer clipped. The page is still very long, and the walkthrough still opens blank at 390.
- **Conversion/trust: 6 (6).** The price is visible and the pending legal and SMS notes are honest. The mailto form still undermines it, and there is no proof, by design.

## 5. Head-to-head against Sayable
- **Hero:** BetterDesk is ahead on atmosphere and premium feel (the lit chat, amber lamp, tight type). Sayable is clearer on one idea, with a centred headline over a single annotated document. BetterDesk shows three fragments, but they now cohere.
- **Product storytelling:** at parity or close. Sayable's annotated form ("no accessible name" pills) is a sharper single demonstration. BetterDesk's pinned story panel plus the 6:44 / 6:47 split matches its peak ("A document can look right and still...") in drama. Sayable's feathered dark band is still the more elegant transition.
- **Execution:** Sayable has no empty states in its demos. BetterDesk's walkthrough opening on a blank phone is the one place it is visibly behind.
- **Rhythm:** Sayable alternates whitespace and one big statement. BetterDesk now has two peaks (hero, endings) and a close, but a long cream middle.
- **Overall:** about 92% of the Sayable bar. Fixing flaws 1, 2 and 5 would put it at the bar.
