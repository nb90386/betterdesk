# Pricing recommendation (PROPOSED, not approved, no billing exists)

## What existed
V4 proposed three tiers: $99 / $249 / $499 per month with hard caps (docs/v4/PRICING-AND-UNIT-ECONOMICS.md). No customer has ever been billed; no billing is wired.

## Recommendation
One offer for the commercial-cleaning wedge instead of a three-tier buffet:
1. **Guided setup and visibility review: $490 one time.** A person reviews the site, Business Profile and inquiry path; Presence audit with owners; criteria and approval rules; first list imported; one 45-minute session.
2. **Workspace: $249/month.** Presence re-check up to 25 pages/month; Scout up to 500 businesses/month; Desk up to 300 conversations/month; 3 people; email support. Hard caps, no overage. Top-ups $39 / $35 / $29 per seat (carried over from V4).
Free path: the interactive demo, the free website check (rate-limited), and the "Get a free check" request.

## Why
- Owners judge one plan faster; the paid setup pays for the human review that GEO/visibility work needs and filters for serious buyers.
- $249 kept from V4's middle tier, where V4 modelled ~54–63% contribution margin at medium usage.

## Unit-cost assumptions (to verify before launch)
| Item | Assumption | Monthly cost at caps |
|---|---|---|
| Presence crawl | own HTTP fetches, ≤25 pages, negligible compute | < $0.10 |
| Scout research | rule-based today ($0); a model-backed drafter at ~2k tokens × 500 drafts | ~$1–5 depending on model (no provider approved) |
| Licensed business data | not chosen | unknown, the largest open cost |
| Email/calendar | customer's own mailbox via OAuth | $0 platform cost |
| Hosting (Vercel) | shared across customers | small per customer |
| Human setup | ~3–4 hours at $60–90/h loaded | $180–360 one time, covered by the $490 setup |
| Support | ~1–2 h/month | $60–180, the main margin risk (as in V4) |

Margin scenarios: with support at 1 h/month and no data-provider cost, contribution ≈ $249 − ~$80 ≈ 68%; at 2 h/month ≈ 37%. A data provider at $50+/customer/month would push the price or the caps.

**Founder decisions needed:** approve or change both prices, the caps, and whether the setup fee is waived for early customers. All prices on the site are labelled "proposed".
