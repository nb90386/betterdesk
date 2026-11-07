import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanAttribution, coerceReview, formatReview, normalizeWebsite, validateReview, type ReviewInput } from "../../lib/lead/review.ts";

const good: ReviewInput = {
  business: "Clearline Commercial Cleaning", website: "clearline.example.com", serviceArea: "Central and east Denver", kind: "Commercial cleaning",
  name: "Dana Ortiz", email: "dana@clearline.example.com", phone: "(303) 555-0187", pain: "not-found", note: "", heardFrom: "", consent: true,
};

test("a complete request validates; each required field has a human error", () => {
  assert.deepEqual(validateReview(good), {});
  const e = validateReview({ ...good, business: "", serviceArea: " ", name: "", email: "dana@", pain: "x", consent: false });
  assert.deepEqual(Object.keys(e).sort(), ["business", "consent", "email", "name", "pain", "serviceArea"]);
  assert.match(e.email!, /incomplete/);
});

test("step validation only checks that step's fields", () => {
  const blank = { ...good, name: "", email: "", consent: false };
  assert.deepEqual(validateReview(blank, 0), {});
  assert.ok(validateReview(blank, 1).email);
});

test("website normalisation accepts bare domains and rejects junk", () => {
  assert.equal(normalizeWebsite("clearline.com"), "https://clearline.com");
  assert.equal(normalizeWebsite("http://www.clearline.com/"), "http://www.clearline.com");
  assert.equal(normalizeWebsite("javascript:alert(1)"), null);
  assert.equal(normalizeWebsite("https://user:pw@clearline.com"), null);
  assert.equal(normalizeWebsite("not a site"), null);
  assert.ok(validateReview({ ...good, website: "localhost" }).website);
});

test("untrusted bodies are coerced to strings; consent must be literally true", () => {
  const c = coerceReview({ business: 42, consent: "true", email: ["x"] })!;
  assert.equal(c.business, "");
  assert.equal(c.consent, false);
  assert.equal(coerceReview(null), null);
});

test("only well-formed utm tags survive, and the message is plain text", () => {
  assert.deepEqual(cleanAttribution({ utm_source: "google", utm_medium: "cpc", gclid: "abc", utm_campaign: "<script>" }), { utm_source: "google", utm_medium: "cpc" });
  const m = formatReview({ ...good, note: "<b>hi</b>" }, { utm_source: "google" }, "2026-11-07T16:00:00.000Z", "req-12345678");
  assert.match(m.subject, /^Review request: Clearline/);
  assert.match(m.text, /utm_source=google/);
  assert.match(m.text, /Consent: agreed/);
  assert.ok(m.text.includes("<b>hi</b>"), "kept as literal text; it is never rendered as HTML");
});

test("overlong fields are rejected with a limit message", () => {
  assert.match(validateReview({ ...good, note: "x".repeat(1501) }).note!, /under 1,500/);
});
