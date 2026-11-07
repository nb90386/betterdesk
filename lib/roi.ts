export const WEEKS_PER_MONTH = 52 / 12;

/** Deliberately modest starting assumptions, shared by the calculator and the /roi hero. */
export const ROI_DEFAULTS = { missedPerWeek: 6, engagePct: 40, bookPct: 30, jobValue: 250 } as const;

export type RoiInputs = {
  /** Calls, texts and forms per week that currently go unanswered or get a slow reply. */
  missedPerWeek: number;
  /** Share of those you believe a fast reply would actually reach and engage (0–1). */
  engageRate: number;
  /** Share of engaged inquiries that become a booked job (0–1). */
  bookRate: number;
  /** Average revenue of one booked job or appointment, in dollars. */
  jobValue: number;
  /** Monthly plan cost in dollars. */
  planPrice: number;
};

export type RoiResult = {
  engagedPerMonth: number;
  bookingsPerMonth: number;
  revenuePerMonth: number;
  revenuePerYear: number;
  netPerMonth: number;
  breakEvenBookings: number;
};

export const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

export function sanitize(i: RoiInputs): RoiInputs {
  return {
    missedPerWeek: clamp(i.missedPerWeek, 0, 500),
    engageRate: clamp(i.engageRate, 0, 1),
    bookRate: clamp(i.bookRate, 0, 1),
    jobValue: clamp(i.jobValue, 0, 100000),
    planPrice: clamp(i.planPrice, 0, 100000),
  };
}

export function computeRoi(raw: RoiInputs): RoiResult {
  const i = sanitize(raw);
  const engagedPerMonth = i.missedPerWeek * WEEKS_PER_MONTH * i.engageRate;
  const bookingsPerMonth = engagedPerMonth * i.bookRate;
  const revenuePerMonth = bookingsPerMonth * i.jobValue;
  return {
    engagedPerMonth,
    bookingsPerMonth,
    revenuePerMonth,
    revenuePerYear: revenuePerMonth * 12,
    netPerMonth: revenuePerMonth - i.planPrice,
    breakEvenBookings: i.jobValue > 0 ? Math.ceil(i.planPrice / i.jobValue) : Infinity,
  };
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
