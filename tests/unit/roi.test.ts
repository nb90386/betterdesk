import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRoi, sanitize, WEEKS_PER_MONTH } from "../../lib/roi.ts";

test("computes bookings and revenue from inputs", () => {
  const r = computeRoi({ missedPerWeek: 10, engageRate: 0.5, bookRate: 0.2, jobValue: 300, planPrice: 299 });
  assert.ok(Math.abs(r.engagedPerMonth - 10 * WEEKS_PER_MONTH * 0.5) < 1e-9);
  assert.ok(Math.abs(r.bookingsPerMonth - 10 * WEEKS_PER_MONTH * 0.1) < 1e-9);
  assert.ok(Math.abs(r.revenuePerMonth - r.bookingsPerMonth * 300) < 1e-9);
  assert.ok(Math.abs(r.revenuePerYear - r.revenuePerMonth * 12) < 1e-9);
  assert.ok(Math.abs(r.netPerMonth - (r.revenuePerMonth - 299)) < 1e-9);
  assert.equal(r.breakEvenBookings, 1);
});

test("zero inquiries produce zero revenue and negative net", () => {
  const r = computeRoi({ missedPerWeek: 0, engageRate: 0.5, bookRate: 0.5, jobValue: 200, planPrice: 149 });
  assert.equal(r.revenuePerMonth, 0);
  assert.equal(r.netPerMonth, -149);
});

test("break-even rounds up and handles zero job value", () => {
  assert.equal(computeRoi({ missedPerWeek: 1, engageRate: 1, bookRate: 1, jobValue: 100, planPrice: 299 }).breakEvenBookings, 3);
  assert.equal(computeRoi({ missedPerWeek: 1, engageRate: 1, bookRate: 1, jobValue: 0, planPrice: 299 }).breakEvenBookings, Infinity);
});

test("sanitize clamps out-of-range and non-finite values", () => {
  const s = sanitize({ missedPerWeek: -5, engageRate: 4, bookRate: Number.NaN, jobValue: 1e9, planPrice: 149 });
  assert.deepEqual(s, { missedPerWeek: 0, engageRate: 1, bookRate: 0, jobValue: 100000, planPrice: 149 });
});
