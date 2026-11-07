/**
 * "Visibility and lead-flow review" request: the site's primary lead capture.
 * Pure validation and payload shaping, shared by the form (client) and the API route (server).
 * The server never trusts the client's validation; it re-runs `validateReview` on the raw body.
 */

export const PAINS = [
  { id: "not-found", label: "Customers don’t find us online" },
  { id: "few-leads", label: "Not enough good leads to contact" },
  { id: "slow-replies", label: "Inquiries wait too long for a reply" },
  { id: "no-follow-up", label: "Follow-ups and proposals slip" },
  { id: "scattered", label: "Everything lives in different places" },
  { id: "other", label: "Something else" },
] as const;
export type PainId = (typeof PAINS)[number]["id"];

export const BUSINESS_KINDS = ["Commercial cleaning", "Janitorial franchise", "Facility services", "Other B2B service"] as const;

export type ReviewInput = {
  business: string;
  website: string;
  serviceArea: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  pain: string;
  note: string;
  heardFrom: string;
  consent: boolean;
};

export type ReviewErrors = Partial<Record<keyof ReviewInput, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:]+@[^\s@<>()[\]\\,;:]+\.[a-z]{2,}$/i;
const LIMITS: Record<Exclude<keyof ReviewInput, "consent">, number> = {
  business: 120, website: 200, serviceArea: 120, kind: 40, name: 80, email: 160, phone: 30, pain: 30, note: 1500, heardFrom: 80,
};

export const STEP_FIELDS: (keyof ReviewInput)[][] = [
  ["business", "website", "serviceArea", "kind"],
  ["name", "email", "phone", "pain", "note", "heardFrom", "consent"],
];

/** Accepts "clearline.com", "www.clearline.com" or a full URL; rejects anything that isn't a public-looking web address. */
export function normalizeWebsite(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) return null;
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname)) return null;
    return `${u.protocol}//${u.hostname}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    return null;
  }
}

export function validateReview(v: ReviewInput, step: 0 | 1 | "all" = "all"): ReviewErrors {
  const e: ReviewErrors = {};
  const want = (k: keyof ReviewInput) => step === "all" || STEP_FIELDS[step].includes(k);
  for (const [k, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    if (want(k) && typeof v[k] === "string" && v[k].length > max) e[k] = `Please keep this under ${max.toLocaleString()} characters.`;
  }
  if (want("business") && !v.business.trim()) e.business = "What’s the business called?";
  if (want("website") && v.website.trim() && !normalizeWebsite(v.website)) e.website = "That doesn’t look like a website address. Try something like clearlinecleaning.com.";
  if (want("serviceArea") && !v.serviceArea.trim()) e.serviceArea = "Where do you clean? A city or a few neighborhoods is enough.";
  if (want("name") && !v.name.trim()) e.name = "Who should we reply to?";
  if (want("email")) {
    if (!v.email.trim()) e.email = "We need an email address to reply to.";
    else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email address looks incomplete.";
  }
  if (want("phone") && v.phone.trim() && !/^[\d\s()+.-]{7,30}$/.test(v.phone.trim())) e.phone = "Use digits, spaces and ( ) + - only.";
  if (want("pain") && !PAINS.some((p) => p.id === v.pain)) e.pain = "Pick the one that’s closest.";
  if (want("consent") && v.consent !== true) e.consent = "We can only reply if you agree to be contacted about this request.";
  return e;
}

/** Coerces an untrusted JSON body into ReviewInput shape (strings only, trimmed lengths enforced later). */
export function coerceReview(body: unknown): ReviewInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const s = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : "");
  return {
    business: s("business"), website: s("website"), serviceArea: s("serviceArea"), kind: s("kind"),
    name: s("name"), email: s("email"), phone: s("phone"), pain: s("pain"), note: s("note"), heardFrom: s("heardFrom"),
    consent: b.consent === true,
  };
}

/** Only utm_* keys with short plain values survive. Nothing is inferred from them. */
export function cleanAttribution(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (/^utm_(source|medium|campaign|term|content)$/.test(k) && typeof v === "string" && /^[\w .:/-]{1,80}$/.test(v)) out[k] = v;
  }
  return out;
}

/** Plain-text message a person reads in the inbox. No HTML, so nothing in the request can render as markup. */
export function formatReview(v: ReviewInput, attribution: Record<string, string>, receivedAt: string, id: string) {
  const pain = PAINS.find((p) => p.id === v.pain)?.label ?? v.pain;
  const site = normalizeWebsite(v.website);
  const lines = [
    `Review request ${id}`,
    `Received: ${receivedAt}`,
    "",
    `Business: ${v.business.trim()}${v.kind ? ` (${v.kind})` : ""}`,
    `Website: ${site ?? "not given"}`,
    `Service area: ${v.serviceArea.trim()}`,
    "",
    `Contact: ${v.name.trim()} <${v.email.trim()}>${v.phone.trim() ? `, ${v.phone.trim()}` : ""}`,
    `Biggest problem: ${pain}`,
    v.note.trim() ? `Note: ${v.note.trim()}` : null,
    v.heardFrom.trim() ? `How they heard of us (their words): ${v.heardFrom.trim()}` : null,
    Object.keys(attribution).length ? `Landing URL tags: ${Object.entries(attribution).map(([k, x]) => `${k}=${x}`).join(", ")}` : null,
    "",
    "Consent: agreed to be contacted about this request.",
  ];
  return { subject: `Review request: ${v.business.trim().slice(0, 80)}`, text: lines.filter((l) => l !== null).join("\n") };
}
