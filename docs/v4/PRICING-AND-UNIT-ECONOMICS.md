# BetterDesk V4 — Pricing and Unit Economics

Status: research draft, 2026-11-07. **Every price below is a proposal, not a binding offer.** Tags: **[V]** = verified on the official page on 2026-11-07 (URL given); **[A]** = assumption to validate. No customer usage data exists. Earlier pricing on file: the live site publishes $149/$299/$599 for the prior front-desk product, and V3 proposed $129/$249/$499 (`PRODUCT.md`, `docs/v3/BUSINESS-TRUTH.md`).

## 1. Verified input costs

### AI models — https://platform.claude.com/docs/en/about-claude/pricing [V]
| Model | Input / MTok | Cache hit / MTok | Output / MTok | Use in BetterDesk |
|---|---|---|---|---|
| Claude Sonnet 5.5 | $2.00 | $0.10 | $10.00 | Scout research, scoring, drafts (default) |
| Claude Haiku 5.5 (prompts ≤100k) | $0.10 | $0.01 | $0.50 | inquiry triage, spam filter, extraction |
| Claude Opus 5.5 | $4.00 | $0.20 | $20.00 | escalation only |
- Batch API: 50% off input and output [V]. Web search tool: $10 per 1,000 searches plus tokens [V]. Web fetch: no extra charge beyond tokens [V].
- Claude 4.7+ tokenizer produces ~30% more tokens for the same text [V]. That uplift is already in the estimates below.
- OpenAI, https://developers.openai.com/api/docs/pricing [V] (openai.com/api/pricing returned 403): gpt-6.1-sol $2.00 / $0.10 cached / $10.00; gpt-5.4-mini $0.75 / $4.50; gpt-5.4-nano $0.20 / $1.25. These are price-equivalent fallbacks.

### Business data
- **Google Places API (New)**, https://developers.google.com/maps/billing-and-pricing/pricing [V], per 1,000 calls at the first paid tier:
  - Text Search: Pro $32, Enterprise $35, IDs-only free.
  - Place Details: Essentials $5, Pro $17, Enterprise $20, Enterprise + Atmosphere $25.
  - Free monthly caps: 10k Essentials, 5k Pro, 1k Enterprise. Assumption: the caps are per billing account and shared by all BetterDesk customers. Assumption: website and phone fields bill at the Enterprise SKU.
- **Google storage terms**, https://developers.google.com/maps/documentation/places/web-service/policies [V]:
  - Place IDs may be stored indefinitely.
  - Lat/lng may be cached for at most 30 days.
  - Business names, addresses and reviews may not be copied and saved.
  - Attribution to Google Maps is required.
  - **Implication [A]:** Google can verify or refresh a prospect but cannot be BetterDesk's stored prospect database. Store the place_id plus customer-supplied fields only, and get legal review.
- **Apollo API**, https://docs.apollo.io/docs/api-pricing [V]: org enrichment 1 credit; person 1 credit (+8 for a mobile); org search 1 credit per 100 results. The dollar price per credit and the data-retention terms were not shown on the pages fetched, so treat both as unknown.
- **Clay**, https://www.clay.com/pricing [V]: data credits "from $0.05". No charge when nothing is found. BYO keys cost 1 action.
- **Overture Maps Places**, https://docs.overturemaps.org/attribution/ [V]: per-provider licenses CDLA-Permissive-2.0 / Apache-2.0 / CC0. Assumption: these permit commercial storage; confirm with counsel. Cost is $0 data plus ingestion infrastructure.

### Infrastructure [V unless marked]
| Service | Plan used | Price | URL |
|---|---|---|---|
| Vercel | Pro, 1 seat | $20/mo incl. $20 usage credit; 1M invocations; Hobby is non-commercial | https://vercel.com/pricing |
| Supabase | Pro | from $25/mo incl. $10 compute credit; 8 GB DB, 100k MAU; DB overage $0.125/GB | https://supabase.com/pricing |
| Trigger.dev | Pro | $50/mo incl. $50 usage; $0.000025/run | https://trigger.dev/pricing |
| Inngest (alt.) | Pro | from $99/mo, 1M executions | https://www.inngest.com/pricing |
| Resend | Pro | $20/mo, 50k emails; $0.90 per extra 1k | https://resend.com/pricing |
| Postmark (alt.) | Basic | $15/mo, 10k emails; $1.80 per extra 1k | https://postmarkapp.com/pricing |
| SendGrid (alt.) | Essentials | from $19.95/mo | https://www.twilio.com/en-us/products/email-api/pricing |

**Sending constraint [V]:** Resend's AUP prohibits "cold outreach, purchased lists, or scraped contact data" (https://resend.com/legal/acceptable-use). Postmark requires permission-based lists (https://postmarkapp.com/terms-of-service, via search). So transactional ESPs carry notifications only. Approved introductions go from the customer's own Google/Microsoft mailbox, whose sending policies were **not checked**. CAN-SPAM applies to B2B email, up to $53,088 per violating email (https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) [V].

## 2. Unit cost model [A, built from V prices]
| Unit | Token shape (after the 30% tokenizer uplift) | Medium cost | Heavy (2×) |
|---|---|---|---|
| Prospect researched | Sonnet 5.5: ~8k in, ~0.8k out, 1 web search, some retries | **$0.04** | $0.08 |
| AI draft (intro, follow-up, proposal cover) | Sonnet 5.5: ~3k in, ~0.3k out, avg 1 regeneration | **$0.02** | $0.04 |
| Inbound conversation | ~6 turns, cached system prompt; Haiku triage first (~$0.0003) | **$0.05** | $0.10 |
| Optional Google enrichment | Details Enterprise $0.02 + share of Text Search | +$0.02 | +$0.035 |
"Heavy" covers long websites, retries, Opus escalation (2× Sonnet price [V]) or a prompt regression. Batch API for overnight list research could cut token cost ~50% [V], but it is not assumed.

**Fixed platform cost [A]:** Vercel $20 + Supabase $25 + ~$50 compute upgrade [A] + Trigger.dev $50 + Resend $20 + ~$115 monitoring, logs, domains and buffer [A] ≈ **$280/mo**. That is **$7 per customer at 40 customers** ($28 at 10).
Other [A]: payment processing ~3% of revenue (Stripe not checked); support at $40/h loaded; onboarding of 2 / 4 / 8 h amortized over 12 months ($7 / $13 / $27 per month).

## 3. Proposed tiers (proposal)
| | **Essential** | **Growth** | **Team** |
|---|---|---|---|
| Monthly price | **$99** | **$249** | **$499** |
| Seats | 1 | 3 | 10 |
| Prospects researched / mo | 150 | 500 | 1,000 |
| AI drafts / mo | 150 | 500 | 1,000 |
| Inbound conversations / mo | 100 | 300 | 600 |
| Connected mailboxes / calendars | 1 / 1 | 3 / 3 | 10 / 10 |
| Onboarding | self-serve + docs | 1 guided session | guided import + 2 sessions |
| Support | email | email + chat | priority, named contact |
Top-ups (proposal):
- **+250 prospects incl. drafts: $39** (cost $15 medium, $30 heavy).
- **+250 inbound conversations: $35** (cost $12.50 / $25).
- **Extra seat: $29/mo**, matching Jobber's verified $29 extra-user price.
Default is a **hard cap with no automatic overage**: Scout pauses and the owner gets an alert, so there is no bill shock. Spam and residential misroutes flagged by Haiku triage don't count toward conversations.

## 4. Scenario table (per customer per month) [A]
Low = 20% of the included usage at medium unit cost. Medium = 60% at medium cost. Heavy = 100% at 2× unit cost. Fixed share is $7 ($10 for Team). The Variable column covers AI and data plus 3% payment fees.
| Tier · scenario | Revenue | Fixed share | Variable | Support | Onboarding (amort.) | **Contribution** | **CM %** |
|---|---|---|---|---|---|---|---|
| Essential · low | $99 | $7 | $5.80 | $10 (0.25 h) | $7 | **$69** | 70% |
| Essential · medium | $99 | $7 | $11.40 | $20 (0.5 h) | $7 | **$54** | 54% |
| Essential · heavy | $99 | $7 | $31.00 | $40 (1 h) | $7 | **$14** | 14% |
| Growth · low | $249 | $7 | $16.50 | $20 | $13 | **$193** | 77% |
| Growth · medium | $249 | $7 | $34.50 | $40 | $13 | **$155** | 62% |
| Growth · heavy | $249 | $7 | $97.50 | $80 | $13 | **$52** | 21% |
| Team · low | $499 | $10 | $33.00 | $40 | $27 | **$389** | 78% |
| Team · medium | $499 | $10 | $69.00 | $80 | $27 | **$313** | 63% |
| Team · heavy | $499 | $10 | $195.00 | $160 | $27 | **$107** | 21% |
Excluded: CAC, sales commissions, refunds, legal review, and SMS/voice. SMS and voice are not in any tier; Twilio pricing was not checked.

## 5. Sensitivity and abuse exposure
- **Support, not AI, is the main margin risk.** On Essential, one extra support hour costs $40 against $11 of medium variable cost. Keep Essential self-serve, put onboarding in the product, and consider a paid setup option [A].
- **Low customer count:** at 10 customers the fixed share is $28, which pulls Essential medium down to ~33% CM.
- **Model price or prompt drift:** a 2× token cost is already the heavy case. A 5× regression on Team heavy (~$450 variable) would go negative, so per-workspace cost metering and alerts are required.
- **Bulk-list abuse:** uploads of 10k+ rows. Mitigate with a dedupe step, an explicit "research N of M" approval, metering only completed research, and a cap of 2 web searches per prospect.
- **Inbound flooding:** form spam or bot traffic. Mitigate with a Haiku pre-filter (~$0.0003 per message), rate limits per source, and not counting spam.
- **Shared free caps:** Google's free monthly caps are consumed by all customers together [A], so the enrichment cost per customer rises with scale. It should be opt-in or a paid top-up.
- **Reselling:** agencies running many clients through one Team workspace. Prohibit in the ToS and cap the number of workspaces per account.
- **Compliance exposure:** if a customer enables sending and misuses it, the account and domain reputation at risk is the customer's own mailbox's, not BetterDesk's ESP. CAN-SPAM liability can't be contracted away [V]. Keep sending off by default and enforce opt-out and suppression.

## 6. Recommendation (proposal, not binding)
- **Essential $99 / Growth $249 / Team $499 per month**, with the included usage in §3.
  - Annual billing at ~2 months free [A].
  - $99 is inside the verified range of vertical tools: CleanGuru $79–$159, Swept $150–$225, Jobber Core $29–$49, GoHighLevel Starter $97.
- Medium-usage contribution margins of ~54–63% hold with $7 fixed share. Heavy users still contribute 14–21%.
- **Validate before launch:**
  - Willingness to pay (interview Q10).
  - Whether 150 researched prospects a month is meaningful for a 5-person company. It may be more than they can act on, which argues for lowering included usage rather than price.
  - Actual token usage from a 20-prospect pilot run.
- Revisit $129 for Essential only if interviews show strong pull and support load stays above 0.5 h a month.
