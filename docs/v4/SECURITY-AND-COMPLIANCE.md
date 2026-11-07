# Security and compliance (implementation view)

Sources: `research/COMPLIANCE-RESEARCH.md` (cited; not legal advice).

## Enforced in code today (DEMO, tested)
- Outbound email is draft-only. SMS and calls are hard-disabled. Scout has no send tool.
- Only a person can approve. The approver and time are recorded, and approval is re-validated against:
  - suppression;
  - sender name and company present;
  - postal address present;
  - an opt-out line;
  - no "Re:/Fwd:" subjects;
  - no pressure words;
  - no invented relationship.
- Suppression:
  - checked when drafting and again at approval;
  - adding an address withdraws pending drafts to it;
  - an "unsubscribe" reply auto-suppresses and closes the opportunity;
  - later runs never draft to it;
  - the UI offers no way to remove an entry.
- Personal email addresses (Gmail, Yahoo and similar) are never drafted to.
- Untrusted imported text is data. Instruction-like notes are withheld and flagged, and scope and permissions are independent of content.
- CSV handling: formula-prefix neutralisation, size and row limits, control-character stripping and length caps.
- Security headers in `next.config.ts`: nosniff, a strict referrer policy, `X-Frame-Options: DENY` and a restrictive permissions policy.

## Designed, not connected (BLOCKED)
- `schema.sql`: RLS on every table through `is_member` / `has_role(auth.uid())`. The tenant is never taken from the request body. Events are append-only by trigger, and a database trigger blocks drafts to suppressed contacts.
- A constraint: `approved_send` requires sender identity and a postal address.
- `body_hash`-bound approval, plus `idempotency_key` so each approved message is sent at most once.
- Sending from the customer's own mailbox, with RFC 8058 one-click unsubscribe and SPF/DKIM/DMARC checks before sending is enabled. Rate limits and a complaint-rate auto-pause.
- Data providers: store only what the terms allow (Google Places: place IDs only).

## Not yet tested, because the backend doesn't exist
Cross-tenant access, expired sessions, webhook signatures and rate limiting. They are listed as BLOCKED in `QA-RESULTS.md`.

## Not claimed
No SOC 2, no penetration test, no legal review.
