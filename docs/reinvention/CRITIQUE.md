# BetterDesk independent design critique (r2 vs V4)

Critic: independent reviewer. Judged only from screenshots in `docs/reinvention/screenshots/r2/` (NEW) and `docs/v4/screenshots/final/` (V4), against `skill-checklists/awwwards-jury.md`, `stop-design-slop.md` and the judged-by-eye items of `hallmark.md`. No application source or DESIGN.md was read. Full-page captures show the fixed header mid-page; that is ignored as a capture artifact. V4's home full capture also shows a long empty dark band where a pinned scroll story sits; I count that as partly a capture artifact (see V4-4).

---

## 1. Five-second test

### NEW, `home-1440-first.png`
- **Who it's for:** clear by the first line of the lede ("one workspace for commercial cleaning companies"). The headline itself does not say "cleaning". "Book more walkthroughs" is trade language an owner will recognise straight away, so the audience comes through within seconds.
- **What it does:** three promises: find accounts, be easier to find, book walkthroughs. The dark panel underneath reads as "software with a pipeline". The owner gets the outcome but not the mechanism. "Be easier to find" doesn't say *where* (Google? maps?) until the lede.
- **What to click:** less clear than it should be. "Explore the product" appears twice in one viewport (header and hero), and the label doesn't say what happens: a video? sign-up? sandbox? The hero button sits at the far right, about 230px from the end of the lede, so the eye has to jump across empty space to find it. "Request a review" in the header will read to many cleaning owners as **Google review requests**, a different product category.
- **Verdict:** "Software for cleaning companies that gets me more walkthroughs. I'm not sure what Explore does or what a review is."

### NEW, `home-390-first.png`
- Headline wraps to five lines. The lede is seven lines and names the trade in line 2. The black "Explore the product" button sits at about y=570 with "See how it works" below it. The product panel only peeks in at the bottom. Who it's for and what to tap are both clear. What the product looks like is not, because the first screen is all text.

### V4, `home-1440-first.png`
- "More walkthroughs. Less chasing leads." The lede starts with "For commercial cleaning companies." The right side shows a small diagram: *Found: your prospect list* and *Inquiry: your website* both converge on *Walkthrough booked, Tuesday 8:00 AM*. The CTA is specific ("Explore the sample workspace") and comes with reassurance ("No sign-up, and nothing is ever sent… from $99 a month").
- **Honest comparison:** V4's first screen explained the *mechanism* and the *next click* at least as well as NEW, and arguably better. NEW adds the findability leg (Presence) and looks calmer and more trustworthy. V4 looked like a generic dark-teal AI-SaaS template. V4 also never mentioned being found in search.

---

## 2. Weak points, ranked by severity

Tags: **NEW** = r2 build, **V4** = old build. NEW has 22 entries and V4 has 8.

### High

**H1. NEW: Every subpage hero is type-only, with the right ~45% of the viewport empty.**
*Where:* `presence-1440-first`, `scout-1440-first`, `desk-1440-first`, `product-1440-first`, `solutions-commercial-cleaning-1440-first`, `pricing-1440-first`, `how-it-works-1440-full` (top), `security-1440-full` (top), `resources-1440-full` (top): x≈820–1336, y≈150–600.
*What's wrong:* a big headline, a paragraph and a button floated to the far bottom-right. Nothing else on the page is composed in that space.
*Why it matters:* the founder asked for Apple-level, and Apple leads with the product. A cleaning owner sees a wall of words and no proof. The empty half looks unfinished rather than deliberate.
*Fix:* put a real, cropped capture of that module's workspace screen in the right column (Scout list for /scout, the audit finding for /presence, the inbox thread for /desk). Where type-only is intentional, set the CTA directly under the lede and let the headline span the full measure.

**H2. NEW: The product page has no product.**
*Where:* `product-1440-full` (whole page).
*What's wrong:* a three-column text triptych, a 01–07 ordinal table, a source table and a data-model table. There are zero screenshots. V4's product page (`v4/.../product-1440-first`, y≈640+) showed the real Today screen.
*Why it matters:* this page should answer "what does it look like to use this?" and in this build it can't. That is a regression from V4.
*Fix:* show the real Today, Inbox and Scout screens at legible scale, each with a one-line caption. Keep one table at most.

**H3. NEW: "Request a review" is the wrong name for the sales conversation.**
*Where:* header on every page; `contact-1440-full` H1 "Request a review."; `pricing-1440-first` primary button.
*What's wrong:* in this trade, "review" means Google or Yelp reviews. Review-request software (Podium, NiceJob) is a category these owners already get pitched.
*Why it matters:* an owner may think BetterDesk is a review-generation tool, or may not know what they're signing up for.
*Fix:* rename it to something like "Get your setup reviewed by a person", "Book a setup call" or "Get a free visibility check". Use one name everywhere.

**H4. NEW: Engineering-voice content sits on buyer-facing pages.**
*Where:*
- `presence-1440-full`: the 13-row crawler table (y≈3,150–4,250), the raw JSON-LD code block (y≈4,700), "Not connected (BLOCKED)" (y≈6,350).
- `security-1440-full`: "private, loopback, link-local (including cloud metadata), carrier-grade NAT, multicast…" (y≈1,270).
- `scout-1440-full`: "Follow instructions hidden in data" and "These are rules in the code, covered by tests".
- `product-1440-full`: "A real backend would keep each company's records separate…".

*Why it matters:* an owner-operator concludes this is a developer tool. "A real backend would…" tells a buyer the product isn't real yet in the worst possible words.
*Fix:* buyer copy states the outcome ("ChatGPT can't see your site. Here's the 2-minute fix for whoever runs your website"). Move crawler tables, schema, network-safety and data-model detail to a "For your web person" or technical page, linked once.

**H5. NEW: "Blocked" status shown to buyers.**
*Where:* `home-1440-full` "What works today, plainly" (y≈6,190 "Review request form ✕ Blocked"); `how-it-works-1440-full` (y≈1,750); `desk-1440-full` (y≈2,580 "Email and calendar connection ✕ Blocked").
*What's wrong:* "Blocked" is project-tracker vocabulary. Labelling the site's own contact path as Blocked tells visitors the form may not reach anyone.
*Why it matters:* it puts trust and conversion at risk exactly where the visitor is deciding to act.
*Fix:* keep the honesty but use buyer vocabulary: "Works now", "Try it on sample data", "Coming next". Fix the review-form delivery itself rather than label it.

**H6. NEW: Workspace cards have no inner padding on body text.**
*Where:*
- `app-1440-first`: "Your website" card, x≈981, where "No audit yet. Run the sample audit…" touches the left border.
- `app-presence-1440-first`: "Open tasks · 0" and "How we measure" bodies flush to the edge, x≈950.
- The same bug on phones: `app-390-full` (y≈590) and `app-presence-390-full` (y≈615, 715).

*Why it matters:* this is a visible build defect in the product itself, on the first screen behind "Explore the product".
*Fix:* apply the card header's horizontal padding (about 16px) to every card body slot.

**H7. NEW: The sample workspace contradicts the homepage story.**
*Where:* `home-1440-first` says "3 fixes would help customers find you" and shows Juniper Lane Law found with "Approve intro". But `app-1440-first` says "Your website: No audit yet", "Scout: No runs yet" and "Qualified 0, Outreach prepared 0".
*Why it matters:* the main CTA lands on a half-empty dashboard that doesn't match what the visitor was just promised. That reads as a bait-and-switch or a broken demo.
*Fix:* seed the workspace to the same state as the homepage panel: audit run, three open fixes, Juniper in Found with a draft waiting.

### Medium

**M1. NEW: One section skeleton everywhere.**
*Where:* `home-1440-full`, `product-1440-full`, `scout-1440-full`, `presence-1440-full`, `desk-1440-full`, `how-it-works-1440-full`, `security-1440-full`.
*What's wrong:* almost every section is a big H2 in the left third plus a hairline list or table on the right, on alternating grey and paper bands, with one charcoal band.
*Why it matters:* the founder's "disconnected sections" complaint has become "monotonous sections" (Hallmark 8/9, J). After three screens the page has no rhythm, and nothing marks a peak moment.
*Fix:* define 3–4 distinct section types (full-bleed product capture, wide editorial statement, split demo, dense table). Never run more than two H2-left/list-right sections in a row.

**M2. NEW: Typography is competent but not ownable.**
*Where:* `home-1440-first` headline; every H1 and H2.
*What's wrong:* one geometric grotesk at heavy weight with tight negative tracking does both display and body. That is the 2024–26 Framer and indie-SaaS default. The founder rejected "generic fonts", and this is a better generic, not a distinctive one.
*Fix:* add a display face with real character, used only at headline sizes, tied to the concept (lobby-directory signage, condensed letterboard, tabular figures for suite numbers). Keep the grotesk for body text.

**M3. NEW: The logo mark doesn't read as a door at real size.**
*Where:* header logo, `home-1440-first` (x≈108–122, y≈24–40).
*What's wrong:* at 16px the bar plus quarter-circle reads as a bar chart, or as an "lh" ligature. The door-swing idea only lands if someone explains it.
*Fix:* test it at 16, 24 and 32px with five people who have no context. Exaggerate the hinge and arc or add a threshold line, or lead with the wordmark.

**M4. NEW: The "Directory" concept is barely visible.**
*Where:* the only traces are the dotted leader in the hero panel's "Your website" row (`home-1440-first`, y≈631), the 404 ("This suite isn't in the directory", `nope-1440-first`) and the phrase "floor by floor" (`product-1440-full`).
*What's wrong:* nobody would name the concept from the site alone.
*Why it matters:* it caps Creativity at 6 and leaves the founder's "unoriginal" complaint standing.
*Fix:* either commit to it (hero as a literal lobby directory board of accounts, suite-number tabular rows, directory leaders in nav, pricing and footer, letterboard display type) or drop it.

**M5. NEW: The primary CTA is vague, duplicated and far from the lede.**
*Where:* `home-1440-first` (header button and hero button both say "Explore the product"; the hero button sits at x≈965 while the lede ends at x≈737), `desk-1440-first`, `scout-1440-first`, `presence-1440-first`.
*Why it matters:* the owner doesn't know what the click does. V4's "Explore the sample workspace" plus "No sign-up, nothing is sent" was clearer.
*Fix:* use "Try the sample workspace" with a one-line reassurance underneath, placed directly under the lede.

**M6. NEW: The mobile menu has no primary action.**
*Where:* `state-mobile-menu-390`: the list ends at "Security and data" and there is no "Explore the product" button.
*Why it matters:* phone visitors lose the main conversion path the moment they open the menu.
*Fix:* pin the primary button at the bottom of the sheet.

**M7. NEW: The Scout results table contradicts itself.**
*Where:* `scout-1440-full`, y≈1,940: "Maple & Main Pediatric Dental, Good fit, 100, 100%" next to "Do not contact: this address is on your suppression list". Summit Ridge scores 80 and is marked "Worth checking", yet the recommendation says "Weak fit". Copperline scores 81 with 80% known while Summit scores 80 with 100% known.
*Why it matters:* the pitch is "Scout shows its work". Contradictions in the showcase table undo that promise.
*Fix:* give suppressed rows a result of "Do not contact" and hide their score, and make result labels follow fixed score bands.

**M8. NEW: The homepage demo sections have dead zones.**
*Where:*
- `home-1440-full` Scout band: the left column ends around y≈4,190 while the right column runs to about y≈4,560, leaving a large empty charcoal block bottom-left.
- Inquiry section (y≈5,040–5,630): "The account record" holds three lines beside a 600px card.

*Fix:* grow the account record as the simulated thread advances, or stack it under the card. Make the Scout list column sticky or move it under the heading.

**M9. NEW: The same content repeats across pages (Hallmark 69).**
*Where:*
- "You bring / We set up / You get" (`home-1440-full`, y≈5,650) repeats as "You provide / BetterDesk does / You receive" (`how-it-works-1440-first`).
- The status list appears on home, how-it-works and desk.
- The identical Alder & Finch inquiry demo appears on home and desk.

*Why it matters:* it inflates page length and makes every page feel the same.
*Fix:* each fact lives on one page. Home summarises and links out.

**M10. NEW: Mobile pages are very long and table-heavy.**
*Where:* `home-390-full` is 12,741px, `presence-390-full` is 11,975px and the guide article is 13,430px.
*Why it matters:* an owner checking this between jobs on a phone won't scroll 15 screens of findings and crawler rows.
*Fix:* show the top five findings with "Show all 17", collapse the crawler table, and cut the duplicated sections from M9.

**M11. NEW: Native, unstyled select controls.**
*Where:* "Luis Romero" owner select (`home-1440-full` y≈2,760; `presence-1440-full`; `demo-1440-full` y≈1,180); "Type of business" (`contact-1440-full` y≈634).
*What's wrong:* the OS chevron and a different visual weight from the custom inputs and buttons next to them (Hallmark 39a).
*Fix:* style the select to the input token: same height, radius, border and chevron icon.

**V4-1. V4: The palette is the named AI-SaaS look.**
*Where:* `v4/home-1440-first`, `product-1440-first`, `pricing-1440-first`, `demo-1440-first`.
*What's wrong:* near-black teal, a mint accent, radial glow behind every hero, and a glowing mint primary button (stop-design-slop: "near-black + gradient glow"; Hallmark 29).
*Why it matters:* this is the main reason V4 read as templated.

**V4-2. V4: Every subpage hero is the same dark band with the same decorative swoosh line ending in a dot.**
*Where:* `v4/product-`, `scout-`, `how-it-works-`, `demo-`, `pricing-1440-first`, at y≈400–500.
*What's wrong:* the swoosh is ornament with no meaning, repeated five times.

**V4-3. V4: The scroll-journey truncates its own cards and can leave a huge empty canvas.**
*Where:* `v4/home-1440-journey-55` ("…above 5,000 sq ft · busin…", "to Elena Brooks, office a…"); `v4/home-1440-full` y≈2,200–4,500, which is mostly empty dark.
*Why it matters:* the signature moment ships with ellipses, and it depends on scroll position to show anything.

**V4-4. V4: Hero cards clip off the right edge on phones.**
*Where:* `v4/home-390-first`, y≈780–844: the "Walkthrough booked / Tuesday, 8:00" card is cut at the viewport edge.
*Why it matters:* it reads as overflow, not a deliberate bleed.

### Low

**L1. NEW: Eyebrow labels above H1s (Hallmark 54).**
*Where:* "✓ Live beta" (`presence-1440-first` y≈173), "○ Demo, sample data" (`scout-` and `demo-1440-first`), the amber notice line (`pricing-1440-first` y≈171), "404" (`nope-1440-first`).
*Fix:* fold the status into the lede or a note under the CTA.

**L2. NEW: Decorative ordinals.**
*Where:* "01–07" (`product-1440-full`, "The journey, floor by floor") and the 1–9 stage strip (`desk-1440-full` y≈1,740).
*Fix:* remove them, or make them meaningful floor or suite numbers if the directory concept is carried (M4).

**L3. NEW: The Product popover wraps its labels.**
*Where:* `state-product-popover-1440`: "How they / connect", "Setup and / support", "Interactive / demo" (Hallmark 49a).
*Fix:* widen the popover or give the label column a min-width and nowrap.

**L4. NEW: Placeholders look like filled values.**
*Where:* `contact-1440-full` ("Central and east Denver", "clearlinecleaning.com"); in `state-contact-error-1440` an error shows under a field that appears filled.
*Fix:* lighter placeholder tone and an "e.g." prefix.

**L5. NEW: The mobile workspace pipeline is a 7-tile KPI grid with an orphan grey cell.**
*Where:* `app-390-full`, y≈1,310–1,400. It is also a dashboard tell (stop-design-slop).
*Fix:* a vertical stage list with counts, or one segmented bar.

**L6. NEW: The finding summary doesn't add up on its face.**
*Where:* `home-1440-full` y≈1,770 and `presence-1440-full`: "8 to fix soon, 7 worth fixing, 7 done well" sits beside "17 findings", with two unlabelled dash-marked items.
*Fix:* name all the groups that make up 17.

**V4-5. V4: The logo is a generic connector glyph (">-" with a dot).**
*Where:* `v4/home-1440-first`, x≈113.
*What's wrong:* indistinguishable from a hundred workflow tools.

**V4-6. V4: Meta-string chips.**
*Where:* "Found · your prospect list", "Inquiry · your website" in `v4/home-1440-first` (Hallmark 63).

**V4-7. V4: Templated pricing triad.**
*Where:* `v4/pricing-1440-first`: three equal plans with a "Most companies start here" badge on the middle one. NEW's First/Then structure is better.

**V4-8. V4: The findability value is missing entirely.**
*Where:* across V4's home. Nothing addresses "can customers find me in Google, maps or AI", the leg NEW adds.

### What works (NEW), briefly
- **Trade-specific problem framing:** "One Tuesday, five places to look" (`home-1440-full` y≈1,250) is the best section on the site: concrete, timed and in the owner's world.
- **Sample introduction email:** factual, names the sender, includes an address and an opt-out (`home-1440-full` y≈3,660). It is believable.
- **Pricing:** First/Then structure, hard caps and plain limits (`pricing-1440-full`). It is clear and honest.
- **Contact form:** visible labels, "Optional" marked on the minority field, a two-step split, and human inline errors ("What's the business called?") in `state-contact-error-1440`.
- **404:** "This suite isn't in the directory" with dotted leaders. The one place the concept fully lands.
- **Guide article:** comfortable measure (~75ch), sources linked, a table of contents (`resources-ai-search-…-1440-full`).
- **Palette:** no pills, no glass, no gradients, no glow. The warm grey and charcoal palette is restrained, and the amber accent is rationed (`home-1440-first` "Approve intro").
- **Small screens:** 320px recomposes without overflow (`home-320-first`), and the 1920 container is capped (`home-1920-first`).

---

## 3. Jury scores (diagnostic only)

> These are a **diagnostic**, not an award and not a prediction of one. They come from one critic looking at static screenshots, without motion, performance or audit data. They are **not a substitute for the founder's judgment** about whether this is the brand he wants. Raw critic scores are shown. The rubric's ~+1.1 "jury estimate" offset is deliberately **not** applied, because it would make both builds look like Site-of-the-Day candidates, which neither is.

Method: each category starts at 6, and every half-point above 6 cites a screenshot.

| Category (weight) | V4 | NEW |
|---|---|---|
| Design (40%) | **6.5** | **6.5** |
| Usability (30%) | **6.5** | **7.0** |
| Creativity (20%) | **6.5** | **6.0** |
| Content (10%) | **7.0** | **7.0** |
| **Weighted overall** | **6.55** | **6.60** |

**V4 justification**
- **Design +0.5:** two composed moments, the hero convergence diagram and the "six places" scattered-notes composition (`v4/home-1440-first`; `v4/home-1440-full` y≈1,300–1,620). Capped by the AI-SaaS palette (V4-1) and the repeated swoosh hero (V4-2).
- **Usability +0.5:** current page indicated by an underline (`v4/product-1440-first`, "Product"), and a specific CTA with reassurance microcopy (`v4/home-1440-first`). Held back by phone clipping (V4-4).
- **Creativity +0.5:** a subject-specific journey idea, list → walkthrough as a route (`v4/home-1440-journey-55`). Partly carried, but it truncates (V4-3).
- **Content +1.0:** specific copy and an honest "Today vs With BetterDesk" table that refuses to invent savings (`v4/home-1440-full`, the "Less admin between you and the walkthrough" section).

**NEW justification**
- **Design +0.5:** a clear, consistent type system and an intentional restrained palette (`home-1440-first`, `pricing-1440-first`), plus one memorable composition, the hero account panel (`home-1440-first`). It doesn't reach 7: hero right halves are empty site-wide (H1), every section uses the same skeleton (M1), and the app has a padding bug (H6).
- **Usability +1.0:**
  - Current page indicated (`pricing-1440-first`, "Pricing" darker).
  - Phone layouts recomposed rather than squished (`home-390-first`, `home-320-first`).
  - Form validation is clear and humane (`state-contact-error-1440`).
  - Capped against the mobile menu with no CTA (M6) and the vague CTA (M5).
- **Creativity +0:** the directory concept is only visible on the 404 and in one dotted leader (M4), which doesn't carry it.
- **Content +1.0:** specific, honest, trade-literate copy ("One Tuesday, five places to look"; the sample email; the pricing limits). It doesn't reach 8 because the voice tips into engineering documentation (H4, H5).

**Bottom line:** NEW is calmer, more honest and more trustworthy than V4, but it is **not measurably better as design**. It swapped V4's palette while keeping V4's page skeleton, the same samples, the same H2-left layout and the same footer. On originality, the founder's main objection, it is about level.

---

## 4. Pill, eyebrow and card-template audit (NEW, by eye)

**Pill-shaped text containers: 0.**
Buttons are about 8px-radius rectangles. Status markers ("Live beta", "Demo, sample data", "Planned", "Blocked") are icon plus plain text, not capsules. The hero pager (1 2 3 4 Pause) uses square cells. The inquiry message is a rounded-rectangle bubble, not a pill.

**Eyebrow labels above headings: 9 kinds, roughly 14 instances.**

| # | Label | Where it appears |
|---|---|---|
| 1 | "✓ Live beta" | above the /presence H1 |
| 2 | "○ Demo, sample data" | above the /scout and /demo H1s |
| 3 | Amber "Proposed early-access pricing…" | above the /pricing H1 |
| 4 | "First" / "Then" | above the two pricing plan headings |
| 5 | "404" | above the /nope H1 |
| 6 | "Step 1 of 6 · Presence" | above "Check the website" on /demo (also a meta string) |
| 7 | "Crawler access · Fix soon · Confidence: confirmed" | above the finding title (home and /presence) |
| 8 | "The account record" | above "Alder & Finch Architects" (home and /desk) |
| 9 | "Updated November 7, 2026, about 8 minutes to read" | above the guide H1 (acceptable as article meta) |

Group labels ("Product" in the mobile menu, footer column heads) are navigation labels, not eyebrows.

**Repeated same-size card or column grids: 7.**
1. Three equal columns, "You bring / We set up / You get" (`home-1440-full`).
2. Three equal columns, "You provide / BetterDesk does / You receive" (`how-it-works-1440-first`). This is the same triptych as #1, rewritten.
3. Three equal columns, "Presence / Scout / Desk" (`product-1440-first`). Three equal text tiles (Hallmark 3).
4. Four equal pipeline columns in the home hero panel. Justified by the content (stages), so acceptable.
5. Nine equal stage cells (`desk-1440-full`).
6. Seven equal KPI tiles (`app-1440-first`, `app-390-full`), a dashboard tell.
7. The workspace Today screen is a uniform rounded-card stack (`app-1440-first`). It is a generic SaaS dashboard pattern, but tolerable inside the app.

The footer's three equal link columns are a default footer shape (Hallmark 42, unchanged from V4).

---

## 5. Top 8 fixes for the next iteration, by impact

1. **Show the real product where the empty space is.** Fill every hero's right column and rebuild /product around real workspace captures (Today, Inbox, Scout list, Presence finding) at legible size. *(H1, H2)*
2. **Fix the conversion path.**
   - Rename "Request a review" so it can't be mistaken for Google reviews.
   - Use one primary label with a promise ("Try the sample workspace") and "No sign-up. Fictional data. Nothing is sent." underneath, placed directly under the lede.
   - Add the primary button to the mobile menu.

   *(H3, M5, M6)*
3. **Make the demo you link to match what you promise.** Seed the sample workspace to the homepage state (audit run, three fixes, Juniper drafted) and fix the card-body padding bug. *(H7, H6)*
4. **Separate buyer copy from technical documentation.**
   - Outcome-first copy on marketing pages.
   - Crawler tables, JSON-LD, network-safety rules and the data model move to one "For your web person" or technical page.
   - Replace "Blocked" and "Planned" with buyer vocabulary, and fix the review-form delivery rather than label it.

   *(H4, H5)*
5. **Break the single section skeleton.**
   - Introduce 3–4 distinct section types and stop running H2-left/list-right back to back.
   - Delete the duplicated triptychs, status lists and the inquiry demo across pages.
   - Cut mobile page length roughly in half.

   *(M1, M9, M10)*
6. **Commit to an identity: concept, display type and mark.** Carry the directory concept visibly (directory-board hero, suite-number rows, signage display face) or replace it. Test the logo at 16–32px with people who have no context. *(M2, M3, M4)*
7. **Fix the trust details in the showcase data.** Remove the Scout table contradictions (suppressed rows marked "Good fit 100", score labels out of band) and the finding-count summary that doesn't add up. *(M7, L6)*
8. **Polish pass.**
   - Styled selects.
   - Popover labels on one line.
   - Remove eyebrows and decorative ordinals.
   - Lighter placeholders.
   - Mobile pipeline without the orphan cell.
   - Close the dead zones in the Scout and inquiry sections.

   *(M8, M11, L1–L5)*
