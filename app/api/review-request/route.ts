import { coerceReview, cleanAttribution, formatReview, validateReview } from "@/lib/lead/review";
import { createLimiter } from "@/lib/presence/ratelimit";

/**
 * Review request intake. Delivery is real only when LEAD_WEBHOOK_URL (https) is configured on the
 * deployment: the request is POSTed as JSON with a plain-text `text` field (works with Slack incoming
 * webhooks, Zapier/Make catch hooks, or a CRM endpoint). Without it, the route says so (503) and the
 * form offers the visitor a working email fallback. It never reports success it didn't achieve.
 */

const limiter = createLimiter({ windowMs: 10 * 60_000, max: 4, maxConcurrent: 8 });
const seen = new Map<string, number>(); // per-instance de-duplication of double submits
const MIN_FILL_MS = 2500;

type Body = { ok: true; id: string; receivedAt: string } | { ok: false; code: string; message: string; errors?: Record<string, string> };
const json = (b: Body, status: number, extra: Record<string, string> = {}) =>
  Response.json(b, { status, headers: { "Cache-Control": "no-store", ...extra } });

function clientKey(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

export async function POST(req: Request) {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ ok: false, code: "invalid_input", message: "Send the form as JSON." }, 415);
  const raw = await req.text();
  if (raw.length > 12_000) return json({ ok: false, code: "invalid_input", message: "That request is too large." }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "invalid_input", message: "We couldn't read that request." }, 400);
  }

  // Bots: a hidden field people never see, and forms filled faster than a person can type.
  const started = typeof body.startedAt === "number" ? body.startedAt : 0;
  if ((typeof body.company_url === "string" && body.company_url !== "") || !started || Date.now() - started < MIN_FILL_MS) {
    return json({ ok: false, code: "rejected", message: "We couldn't accept that submission. If you're a person, please email us instead." }, 400);
  }

  const limit = limiter.check(clientKey(req));
  if (!limit.ok) return json({ ok: false, code: "rate_limited", message: "Too many requests from here in a short time. Please try again in a few minutes." }, 429, { "Retry-After": String(limit.retryAfterSec) });

  const input = coerceReview(body);
  if (!input) return json({ ok: false, code: "invalid_input", message: "We couldn't read that request." }, 400);
  const errors = validateReview(input);
  if (Object.keys(errors).length) return json({ ok: false, code: "invalid_input", message: "Some answers need another look.", errors: errors as Record<string, string> }, 422);

  const requestId = typeof body.requestId === "string" && /^[a-z0-9-]{8,64}$/i.test(body.requestId) ? body.requestId : crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const prior = seen.get(requestId);
  if (prior && Date.now() - prior < 10 * 60_000) return json({ ok: true, id: requestId, receivedAt }, 200);

  const hook = process.env.LEAD_WEBHOOK_URL;
  // Test-only escape hatch: a plain-http receiver on 127.0.0.1, accepted only when explicitly enabled.
  const localTest = process.env.LEAD_WEBHOOK_ALLOW_LOCAL === "1" && !!hook && /^http:\/\/127\.0\.0\.1:\d+\//.test(hook);
  if (!hook || !(/^https:\/\//.test(hook) || localTest)) {
    return json({ ok: false, code: "delivery_not_configured", message: "Our request inbox isn't connected on this preview yet, so this form can't deliver your request. Nothing was saved." }, 503);
  }

  const release = limiter.acquire();
  if (!release) return json({ ok: false, code: "busy", message: "We're busy for a moment. Please try again." }, 503);
  try {
    const msg = formatReview(input, cleanAttribution(body.attribution), receivedAt, requestId);
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: `${msg.subject}\n\n${msg.text}`, subject: msg.subject, id: requestId, receivedAt, replyTo: input.email.trim() }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    seen.set(requestId, Date.now());
    return json({ ok: true, id: requestId, receivedAt }, 200);
  } catch {
    return json({ ok: false, code: "delivery_failed", message: "We couldn't deliver your request just now. Nothing was lost on your side: try again, or email us." }, 502);
  } finally {
    release();
  }
}
