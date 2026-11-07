# BetterDesk V4: outreach compliance research

**Not legal advice.** This is engineering research to set product guardrails. Have counsel review it before sending is enabled for any customer. All sources were checked on **2026-11-07**. **[UNCERTAIN]** marks a point that comes from secondary commentary or is still changing.

**Product context.** BetterDesk helps US commercial cleaning contractors qualify business prospects and draft B2B introduction emails. A human approves every email before it can be sent. Sending is off by default. Cold SMS and automated calls are disabled.

## 1. CAN-SPAM (email)
Source: FTC, *CAN-SPAM Act: A Compliance Guide for Business*, https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business (checked 2026-11-07).
- **B2B is covered.** The guide says "the law makes no exception for business-to-business email." Every BetterDesk intro email is a commercial message.
- **Headers.** From, To, Reply-To and routing information must be accurate and must identify the business that started the message.
- **Subject line.** It must accurately reflect the content of the message.
- **Ad disclosure.** A commercial message must clearly and conspicuously say it is an advertisement. The law is flexible about how.
- **Postal address.** Each message needs a valid physical postal address. That can be a street address, a USPS-registered PO box, or a private mailbox registered with a commercial mail receiving agency.
- **Opt-out.**
  - Each message must explain clearly how to opt out, including an option to stop all marketing email.
  - The mechanism must work for at least 30 days after the send.
  - Requests must be honored within **10 business days**.
  - The sender cannot charge a fee or ask for any information beyond the email address. It cannot make the person do more than reply or visit a single page.
  - Opted-out addresses cannot be sold or transferred, except to a compliance vendor.
- **Sending on someone else's behalf.** "You can't contract away your legal responsibility." The advertiser and the sender can both be liable. BetterDesk is the tool and the contractor is the advertiser, so both carry exposure.
- **Primary purpose.** Transactional or relationship messages are mostly exempt, but the guide "views these categories narrowly." Cold intro emails are commercial.
- **Penalties.** Up to **$53,088 per violating email** (the January 2024 inflation figure in the guide). More than one party can be held responsible. **[UNCERTAIN]** The FTC adjusts this figure every year, and the guide may not show the 2025 or 2026 amount.

## 2. FTC Telemarketing Sales Rule (calls)
Sources: FTC, *Complying with the Telemarketing Sales Rule*, https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule (checked 2026-11-07). TSR final rule, 89 FR 26760, published 2024-04-16, effective 2024-05-16: https://www.federalregister.gov/documents/2024/04/16/2024-07180/telemarketing-sales-rule (checked 2026-11-07).
- **The B2B exemption is broad.** "Most phone calls between a telemarketer and a business are exempt." The guide also says "the prohibition on calls to numbers on the Registry does not apply to business-to-business calls."
- **Limits on the exemption:**
  - **Nondurable office or cleaning supplies.** B2B calls that try to sell these at retail are not exempt. This matters for cleaning contractors who also resell supplies, but cleaning *services* are not supplies.
  - **Calls to employees.** Calling employees to sell them things for their own use is not B2B.
  - **Misrepresentation.** Since the 2024 amendments (effective 2024-05-16), B2B telemarketing must follow the TSR's ban on material misrepresentations and false or misleading statements.
- **The TSR does not override the TCPA.** The FCC's TCPA rules (section 3) apply separately.

## 3. FCC TCPA (calls and texts)
Sources:
- 47 CFR 64.1200, via Cornell LII: https://www.law.cornell.edu/cfr/text/47/64.1200 (checked 2026-11-07; eCFR was blocked from this environment).
- FCC, *Stop Unwanted Robocalls and Texts*: https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts (checked 2026-11-07).
- FCC enforcement page: https://www.fcc.gov/enforcement/areas/unwanted-communications (checked 2026-11-07).

**Core rules:**
- **Texts are calls.** The FCC treats text messages as calls under the TCPA.
- **Wireless numbers.** Calls or texts to a wireless number made with an autodialer, or with an artificial or prerecorded voice, need the called party's prior express consent (§64.1200(a)(1)(iii)). For telemarketing or advertising, that consent must be **prior express *written* consent** (§64.1200(a)(2)), which is a signed written agreement under (f)(9).
- **Quiet hours.** No telephone solicitations before 8 a.m. or after 9 p.m. in the called party's local time (§64.1200(c)(1)).
- **Do Not Call.** The National DNC rules protect "residential telephone subscribers" (§64.1200(c)(2)). Section 64.1200(e) extends the (c) and (d) protections to wireless numbers.
- **Opt-outs.** Revocations and company-specific do-not-call requests must be honored within a reasonable time, no later than 10 business days.

**Why "B2B" does not exempt texting a cell phone:**
- Section 64.1200(a)(1)(iii) covers any cellular number. It makes no business/residential distinction and has no B2B carve-out.
- The text has no B2B exemption for wireless numbers. A contractor's prospect's "business" mobile is usually a personal cell.
- **[UNCERTAIN]** How the DNC rules treat mixed-use or "business" cell phones turns on facts and is actively litigated.
- **[UNCERTAIN]** *Facebook v. Duguid* (2021) narrowed the federal autodialer definition. It does not touch the prerecorded-voice rules, the DNC rules, or state mini-TCPAs (section 5), so it is not a safe harbor for automated texting.

**Current status, 2024–2026 (checked carefully):**
- **One-to-one consent rule: gone.**
  - The Eleventh Circuit vacated it on 2025-01-24 in *Insurance Marketing Coalition v. FCC*, before its 2025-01-27 effective date. Analysis: https://www.mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule (checked 2026-11-07).
  - The FCC then restored the earlier §64.1200(f)(9) in DA 25-621 (released 2025-07-14; 90 FR 42137, published and effective 2025-08-29): https://www.govinfo.gov/content/pkg/FR-2025-08-29/html/2025-16641.htm (checked 2026-11-07).
  - The FCC consumer guide still describes the rule as taking effect on 2025-01-27. That text is stale.
- ***McLaughlin Chiropractic v. McKesson*** (U.S. Supreme Court, 2025-06-20). District courts are not bound by FCC interpretations of the TCPA, so FCC guidance is a weaker shield in private suits. Summary: https://www.gibsondunn.com/supreme-court-holds-that-district-courts-are-not-bound-by-agency-interpretations-in-enforcement-proceedings/ (checked 2026-11-07).
- **Consent-revocation order FCC 26-67.**
  - Timeline: adopted 2026-09-30, published 2026-10-26, **effective 2026-11-25**. It is not yet in force as of today.
  - Telemarketing: a "stop" still applies to *all* of a caller's marketing calls and texts.
  - Informational messages: an opt-out can be limited to that message category.
  - Exclusive opt-out methods: callers may designate one, but must still honor all seven keywords: stop, quit, end, revoke, opt out, cancel, unsubscribe.
  - The 10-business-day honoring limit stays. The accompanying FNPRM asks whether to cut it to 7 business days (comments due 2026-11-25).
  - Source: https://commlawgroup.com/2026/fccs-new-tcpa-consent-revocation-rules-on-category-specific-opt-outs/ (checked 2026-11-07). The FCC PDF is at https://docs.fcc.gov/public/attachments/FCC-26-67A1.pdf but its text could not be extracted here. **[UNCERTAIN]** Exact rule text is unverified, so check the Federal Register version.

## 4. Gmail and Yahoo sender requirements (deliverability)
Sources:
- Google, *Email sender guidelines*: https://support.google.com/a/answer/81126 (checked 2026-11-07).
- Google, sender guidelines FAQ: https://support.google.com/a/answer/14229414 (checked 2026-11-07).
- Yahoo Sender Hub, *Best practices*: https://senders.yahooinc.com/best-practices/ (checked 2026-11-07).

**All senders:**
- SPF **or** DKIM.
- Valid forward and reverse DNS (PTR).
- TLS (Gmail).
- RFC 5322-compliant messages.
- Spam rate under **0.3%**.

**Bulk senders** (Gmail: more than 5,000 messages a day to Gmail):
- SPF **and** DKIM, plus DMARC (`p=none` or stricter) with From-domain alignment.
- DKIM keys of at least 1024 bits; 2048 recommended.
- One-click unsubscribe (List-Unsubscribe and List-Unsubscribe-Post headers, RFC 8058) in marketing messages, plus a visible unsubscribe link in the body.
- Honor unsubscribes within 2 days (Yahoo) or 48 hours (Gmail).
- Gmail recommends keeping the spam rate under **0.10%**. At or above 0.3%, senders are ineligible for mitigation until the rate stays below 0.3% for 7 consecutive days.
- **Bulk status is permanent** once reached.

**Enforcement.** Gmail began "ramping up" enforcement in November 2025, including temporary and permanent rejections.

**For BetterDesk:** Individual contractors will rarely reach bulk volume. Even so, the product should meet the bulk-sender bar by default, because the cost is low and the reputation risk is shared across customers.

## 5. State-level considerations (brief)
**State mini-TCPAs:**
- **Florida (FTSA, amended by HB 761 in 2023).** Requires consent for automated telephonic sales calls. The 2023 amendment narrowed "automated system" to equipment that both *selects and dials* numbers, and added a "STOP" reply safe harbor with 15 days to comply. Sources: https://www.flsenate.gov/Committees/BillSummaries/2023/html/761 and https://www.quarles.com/newsroom/publications/a-return-to-relative-sanity-amendments-to-the-florida-telephone-solicitation-act (checked 2026-11-07).
- **Oklahoma (OTSA, HB 3168, effective 2022-11-01).** Modeled on the Florida law. It bars automated commercial telephonic sales calls without prior express written consent, and it is not limited to cell phones. Sources: https://oklegislature.gov/cf_pdf/2021-22%20ENR/hB/HB3168%20ENR.PDF and https://www.consumerfinancemonitor.com/2022/05/25/oklahoma-governor-signs-bill-limiting-use-of-automated-dialing-systems/ (checked 2026-11-07). **[UNCERTAIN]** The reported limits (8 a.m.–8 p.m. calling hours, at most 3 calls per 24 hours) come from vendor summaries and were not checked against the enrolled text.
- **Other states.** Several other states have similar laws, often with stricter hours and private rights of action. **[UNCERTAIN]** Not surveyed here.

**State privacy:**
- **California.** The CCPA/CPRA exemption for B2B contacts **expired 2023-01-01** and was not extended. Business contacts at California companies now have full CCPA rights: notice, access, deletion and opt-out of sale or sharing. Source: https://www.morganlewis.com/pubs/2022/10/california-consumer-privacy-act-employee-and-b2b-exemptions-expire-january-1-2023 (checked 2026-11-07).
- **Applicability.** CCPA applies only to businesses above its thresholds. Most contractors fall below them; BetterDesk as a platform might not. **[UNCERTAIN]** Not analyzed here.
- **Other comprehensive state laws.** Many exempt people acting in a commercial or employment context. **[UNCERTAIN]** Each needs its own check.

## 6. Prospect data sourcing
**Google Places API.** Source: Places API policies, https://developers.google.com/maps/documentation/places/web-service/policies (checked 2026-11-07).
- **Place IDs** may be stored indefinitely.
- **Latitude and longitude** may be cached for at most 30 consecutive days, then deleted.
- **All other content** (business names, addresses, phone numbers, reviews) may not be "pre-fetched, indexed, stored, or redistributed" outside the Services.
- **Attribution** must stay visible, and Google content must be visually distinguished from other content.
- **Implication:** BetterDesk should store the place_id plus its own derived qualification notes, and fetch details fresh when needed. It should not build a persistent prospect database from Places fields.

**Scraping.**
- ***hiQ v. LinkedIn.*** LinkedIn won summary judgment on breach of its user agreement (N.D. Cal., Nov 2022), and the case ended in a $500k consent judgment with an injunction.
- ***Meta v. Bright Data*** (N.D. Cal., 2024-01-23). Scraping public data while logged off did not breach Meta's terms.
- Neither case is binding precedent beyond its parties. Commentary: https://www.privacyworld.blog/2022/12/linkedins-data-scraping-battle-with-hiq-labs-ends-with-proposed-judgment/ and https://www.fbm.com/technology/publications/major-decision-affects-law-of-scraping-and-online-data-collection-meta-platforms-v-bright-data/ (checked 2026-11-07).
- **Rule of thumb:** Never scrape behind a login or against the site's terms. Prefer licensed providers and follow their storage and use terms.

**Personal vs. business email.**
- CAN-SPAM applies to both (section 1).
- A personal address (gmail.com and similar) found for a "business" contact is personal information under state privacy laws, and it raises the complaint rate.
- Prefer role or company-domain addresses. Flag free-mail domains for extra human review.

## 7. Product requirements
Each rule must be enforced server-side and covered by an automated test.
1. **Sending off by default.** Every new workspace starts with sending disabled. Enabling it requires an explicit admin action, which is logged with the user, time and IP.
2. **Sender gate.** Sending cannot be enabled until all of these are stored and verified:
   - legal business name;
   - valid physical postal address (street, USPS PO box, or registered private mailbox);
   - a From name and From domain the workspace controls;
   - a working Reply-To.
3. **Domain gate.** Sending cannot be enabled until SPF, DKIM (at least 1024-bit) and DMARC (`p=none` or stricter, aligned) pass a DNS check. Sending turns off automatically if a later re-check fails.
4. **Footer and headers.** Every commercial email automatically includes:
   - the sender's postal address;
   - a clear advertisement disclosure;
   - a visible unsubscribe link;
   - `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058) headers.

   A draft missing any of these cannot be approved, and the user cannot edit these elements out.
5. **Unsubscribe flow.** One click or a single page. No login, no fee, no data asked for beyond the email address. The link stays valid for at least 90 days, which exceeds the 30-day legal minimum.
6. **Fast suppression.** An opt-out is added to the suppression list within minutes. The hard limit is 48 hours, and 10 business days is the legal ceiling.
7. **Suppression scope.** Suppression is per workspace, across *all* campaigns and senders in that workspace. It is keyed on the normalized email address, plus the domain if the recipient asks.
8. **Suppression checks.** The suppression list is checked:
   - when a draft is generated;
   - when a draft is approved;
   - again right before each message is sent.

   A match blocks the action and records why.
9. **Opt-out sources.** Bounces, spam complaints (feedback loops) and replies that read as opt-outs (for example "unsubscribe" or "remove me") are suppressed automatically. Ambiguous replies go to a review queue.
10. **No suppression export.** Suppressed addresses can never be exported, sold, or moved into another workspace's send list.
11. **Subject check.** The draft linter blocks deceptive subject lines (for example a fake "Re:" or "Fwd:", false urgency, or claims of a prior relationship that does not exist).
12. **Header check.** From, Reply-To and routing headers must match the verified sender. Display names that impersonate another person or company are not allowed.
13. **Content check.** The linter blocks unverifiable claims (for example "certified" without a stored certification) to reduce misrepresentation risk.
14. **Human approval.** No email is sent without a recorded human approval of that exact rendered message. If the content changes after approval, the approval is void.
15. **Approval audit record.** Each approval stores:
   - the approver ID;
   - a timestamp;
   - a hash of the rendered content;
   - the recipient;
   - the data source of the recipient;
   - the suppression-check result.

   Records are append-only and kept for at least 5 years. **[UNCERTAIN]** The 5-year retention period is a product choice, not a legal requirement.
16. **Rate limits.**
    - Per-sender daily caps (for example 50 a day for new domains, ramping slowly).
    - Per-recipient-domain throttling.
    - A workspace-wide cap that stays below Gmail's 5,000-a-day bulk threshold unless an admin opts in.
17. **Complaint brakes.**
    - Sending pauses automatically if the complaint rate reaches 0.1% over 7 days, or if the hard-bounce rate goes above about 2%.
    - Reaching 0.3% requires admin review before sending can resume.
    - **[UNCERTAIN]** The bounce limit is an industry norm, not an official threshold.
18. **SMS and automated calls hard-disabled.** The code path stays off unless both of these exist:
    - a separately documented prior express written consent for that phone number, with a stored signature, timestamp, the exact disclosure text, and the seller name;
    - a counsel sign-off flag.

    "B2B" status never unlocks SMS or calls.
19. **If calls or texts are ever enabled:**
    - enforce 8 a.m.–8 p.m. in the *recipient's* local time (the stricter state window; the federal window is 8 a.m.–9 p.m.);
    - scrub against the National DNC list and the company's own do-not-call list;
    - honor all seven stop keywords, and process opt-outs immediately, well within 10 business days;
    - apply state mini-TCPA rules (Florida, Oklahoma and others) based on area code.
20. **Google Places storage.** Only place_id is stored long-term. Places-derived coordinates are deleted after at most 30 days. Other Places fields are fetched on demand and not saved. Google attribution is shown wherever Places content appears.
21. **Data provenance.** Every prospect record stores its source (licensed provider, user entry, or Places place_id) and the date it was collected. Scraping behind logins, or against a site's terms, is not supported.
22. **Free-mail flag.** Contacts at free-mail domains are flagged at approval for extra review.
23. **Privacy requests.** A tool for deletion and access requests (for CCPA and similar laws) removes or exports a contact's data but keeps a hashed suppression entry so they are not contacted again.
24. **Customer terms and in-app attestation.** The contractor attests that they are the sender of record, that they will comply with CAN-SPAM, and that they understand they remain liable (FTC: the advertiser cannot contract away its responsibility).
