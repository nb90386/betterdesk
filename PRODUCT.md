# Product

Rewritten 2026-11-07 for the signature rebuild (branch `feat/betterdesk-signature-presence-rebuild`). Sources: `BETTERDESK_MASTER_CLAUDE_REINVENTION_PROMPT.md`, the V4 code and `docs/v4/*`. The previous version of this file described the retired V3 missed-call product and is superseded.

## Platform
web (Next.js marketing site + a browser-only sample workspace at `/app`)

## Users
Owners, sales managers and operations managers at owner-led commercial cleaning and facilities-service contractors (roughly 5–50 staff) who want recurring B2B accounts: offices, medical and dental practices, property managers, coworking, light industrial. Other local B2B service firms are secondary and never dilute the homepage.

## Product purpose
One workspace for winning cleaning contracts. Three lenses over one record:
- **Scout** finds and qualifies businesses worth contacting from lists the owner provides, with evidence, dates and confidence, and drafts introductions that a person approves. It never sends.
- **Presence** audits how findable the company's own website is in Google, Bing and AI search experiences: crawl access, indexability, service and service-area clarity, contact paths, consistent identity, structured data that matches the page. Findings become tasks.
- **Desk** handles inquiries, conversation context, walkthrough booking, the pipeline, customers and follow-ups.
A prospect Scout found, an inquiry from the website and a referral all land in the same account record and event timeline, each with its source.

## Brand commitments
- Plain, short, human B2B copy with concrete cleaning-company examples. No "unlock", "supercharge", "seamless", "revolution", "AI-powered" headings.
- No invented customers, testimonials, logos, metrics, citations, rankings, reviews or bookings. Sample data is fictional (Clearline Commercial Cleaning, Denver; `.example` domains) and labelled.
- AI search is described as an emerging discovery channel. Never promise placement, rankings or being recommended by any AI.
- Every feature carries an honest status: LIVE, SANDBOX, DEMO, BLOCKED or PLANNED.
- Pricing stays labelled "proposed" until the founder approves it. No billing exists.
- Nothing is sent to real people from the site or the sample workspace.

## Evidence on hand
Working code for Scout qualification, de-duplication, drafting, approval and the workspace event model (unit-tested). A Presence audit engine (this branch). No customers, no case studies, no connected providers.
