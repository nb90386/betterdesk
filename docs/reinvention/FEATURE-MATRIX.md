# Feature truth matrix

LIVE = works for real now. BETA = works for real, early. SANDBOX = real logic against a safe target. DEMO = real logic on fictional data in the browser. BLOCKED = built but needs credentials/approval. PLANNED = not built.

| Feature | Status | Proof |
|---|---|---|
| Presence live audit of a site you own (robots, sitemap, ≤6 pages, indexing, content, local, identity, contact, structured data, crawler access incl. OAI-SearchBot / Claude-SearchBot / PerplexityBot) | BETA | preview run on example.com; unit tests; SSRF refusals in e2e |
| Presence sample audit (bundled fictional site, same analyzer, in browser) | LIVE | homepage + /presence explorer |
| Presence finding → owned task → Today | DEMO | unit test "a Presence finding becomes one owned task"; e2e |
| Search Console / Bing AI Performance / Business Profile connections | PLANNED | — |
| AI-answer observations (prompt sampling) | PLANNED, deliberately not faked | GEO-RESEARCH.md |
| Scout import, de-duplication, formula neutralisation, instruction withholding | DEMO | unit + e2e |
| Scout qualification (5 weighted criteria, evidence, unknowns) | DEMO | unit; /scout table computed by the code |
| Scout drafting + human approval + suppression | DEMO | unit + e2e |
| Sending email / SMS / calls | BLOCKED (off by design) | `outbound: draft-only` |
| Desk inbox, suggested reply, sample booking, pipeline, timeline | DEMO | e2e workflow |
| Inquiry "how did you find us" provenance (self-reported only) | DEMO | unit test |
| Real calendar / mailbox | PLANNED | — |
| Review request intake (validation, anti-bot, rate limit, webhook delivery) | BLOCKED on preview (no `LEAD_WEBHOOK_URL`); delivery proven locally | `delivery-test-received.jsonl` |
| Accounts, database, tenant isolation | PLANNED | V4 `docs/v4/schema.sql` design only |
| Billing | PLANNED / not approved | PRICING.md |
