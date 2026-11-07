// POST /api/presence/audit : guarded live audit of a site the caller is authorized to audit.
// Node runtime (default). Never echoes raw fetched HTML.

import { analyzeSnapshot } from "../../../../lib/presence/analyze.ts";
import { collectSnapshot } from "../../../../lib/presence/fetch.ts";
import { parseSafeUrl } from "../../../../lib/presence/guard.ts";
import { auditLimiter } from "../../../../lib/presence/ratelimit.ts";
import { PresenceError, type AuditInputs, type AuditResponse, type PresenceErrorCode } from "../../../../lib/presence/types.ts";

export const maxDuration = 30;

const STATUS: Record<PresenceErrorCode, number> = {
  not_authorized: 403, invalid_input: 400, blocked_url: 422, rate_limited: 429, timeout: 504, unreachable: 502, robots_disallowed: 422, internal: 500,
};

function respond(body: AuditResponse, extra: Record<string, string> = {}): Response {
  const status = body.ok ? 200 : STATUS[body.code];
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}
const err = (code: PresenceErrorCode, message: string, extra?: Record<string, string>) => respond({ ok: false, code, message }, extra);

const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();

function str(v: unknown, field: string, min: number, max: number): string {
  if (typeof v !== "string") throw new PresenceError("invalid_input", `${field} must be text.`);
  const s = clean(v);
  if (s.length < min) throw new PresenceError("invalid_input", `${field} is required.`);
  if (s.length > max) throw new PresenceError("invalid_input", `${field} is too long (max ${max} characters).`);
  return s;
}
function list(v: unknown, field: string, maxCount: number, maxLen: number): string[] {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new PresenceError("invalid_input", `${field} must be a list.`);
  if (v.length > maxCount) throw new PresenceError("invalid_input", `${field} can have at most ${maxCount} entries.`);
  return v.map((x) => str(x, field, 1, maxLen));
}

function validate(b: Record<string, unknown>): AuditInputs {
  const url = str(b.url, "Website address", 3, 2048);
  parseSafeUrl(url); // syntax + SSRF literal checks; DNS is checked again in the fetcher
  const profileUrls = list(b.profileUrls, "Profile links", 5, 300).map((p) => {
    try {
      const u = new URL(p);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      return u.toString();
    } catch {
      throw new PresenceError("invalid_input", "Profile links must be full web addresses starting with http:// or https://.");
    }
  });
  return {
    url,
    businessName: str(b.businessName, "Business name", 1, 120),
    serviceArea: str(b.serviceArea, "Service area", 1, 160),
    serviceCategory: str(b.serviceCategory, "Service category", 1, 120),
    profileUrls,
    competitors: list(b.competitors, "Competitors", 3, 120),
    questions: list(b.questions, "Questions", 5, 200),
  };
}

export async function POST(request: Request): Promise<Response> {
  let release: (() => void) | null = null;
  try {
    const text = await request.text();
    if (text.length > 20_000) return err("invalid_input", "That request is too large.");
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return err("invalid_input", "The request wasn't valid JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return err("invalid_input", "The request body must be an object.");
    const b = body as Record<string, unknown>;
    if (b.authorized !== true) return err("not_authorized", "Please confirm you own this website or are authorized to audit it.");

    let inputs: AuditInputs;
    try {
      inputs = validate(b);
    } catch (e) {
      if (e instanceof PresenceError) return err(e.code, e.message);
      throw e;
    }

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    const rl = auditLimiter.check(ip);
    if (!rl.ok) return err("rate_limited", `Too many audits from your connection. Try again in about ${Math.ceil(rl.retryAfterSec / 60)} minute(s).`, { "Retry-After": String(rl.retryAfterSec) });
    release = auditLimiter.acquire();
    if (!release) return err("rate_limited", "The audit service is busy right now. Please try again in a minute.", { "Retry-After": "30" });

    const snapshot = await collectSnapshot(inputs);
    return respond({ ok: true, report: analyzeSnapshot(snapshot) });
  } catch (e) {
    if (e instanceof PresenceError) return err(e.code, e.message);
    return err("internal", "Something went wrong running the audit. Please try again.");
  } finally {
    release?.();
  }
}
