// Server-only safe fetcher and live-audit crawler. Uses node:http/https with a validating DNS
// `lookup` so the socket can only connect to an address we checked (no DNS-rebinding window).
// Redirects are followed manually (max 3) and re-validated at every hop.

import * as http from "node:http";
import * as https from "node:https";
import * as zlib from "node:zlib";
import {
  assertSafeUrl, defaultResolver, isBlockedIp, MAX_REDIRECT_HOPS, sameSite, validateRedirect, type Resolver,
} from "./guard.ts";
import { parseHtml } from "./html.ts";
import { isAllowed, parseRobots, PRESENCE_UA, PRESENCE_UA_TOKEN, type ParsedRobots } from "./robots.ts";
import { PresenceError, type AuditInputs, type PageSnapshot, type PresenceErrorCode, type Snapshot } from "./types.ts";

export const LIMITS = {
  requestTimeoutMs: 8000,
  maxBodyBytes: 1_500_000,
  totalBudgetMs: 20000,
  maxPages: 6,
  delayMs: 250,
  maxSitemapUrls: 500,
} as const;

export type RawResponse = {
  status: number;
  headers: Record<string, string | undefined>;
  body: string | null;
  truncated: boolean;
  /** Set when the body was not read because the content type was not acceptable. */
  contentTypeRejected?: boolean;
};
export type TransportOptions = { kind: "html" | "text"; timeoutMs: number; maxBytes: number; resolver: Resolver };
export type Transport = (url: URL, opts: TransportOptions) => Promise<RawResponse>;

const HTML_RE = /^(text\/html|application\/xhtml\+xml)\b/i;
const TEXT_RE = /^(text\/(plain|xml|html)|application\/(xml|rss\+xml|atom\+xml)|application\/xhtml\+xml)\b/i;

function decodeBody(buf: Buffer, contentType: string): string {
  const cs = /charset=["']?([\w-]+)/i.exec(contentType)?.[1]?.toLowerCase();
  try {
    return new TextDecoder(cs && cs !== "utf8" ? cs : "utf-8").decode(buf);
  } catch {
    return new TextDecoder("utf-8").decode(buf);
  }
}

export const nodeTransport: Transport = (url, opts) =>
  new Promise<RawResponse>((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const lookup = (hostname: string, options: { all?: boolean }, cb: (...a: unknown[]) => void) => {
      opts
        .resolver(hostname)
        .then((addrs) => {
          if (!addrs.length) return cb(new Error("no address"));
          if (addrs.some((a) => isBlockedIp(a.address))) return cb(new PresenceError("blocked_url", "Resolved to a blocked address."));
          if (options && options.all) return cb(null, addrs.map((a) => ({ address: a.address, family: a.family })));
          cb(null, addrs[0].address, addrs[0].family);
        })
        .catch((e) => cb(e));
    };
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn();
    };
    const req = lib.request(
      {
        protocol: url.protocol,
        hostname: url.hostname.replace(/^\[|\]$/g, ""),
        port: url.port || undefined,
        path: url.pathname + url.search,
        method: "GET",
        headers: {
          "User-Agent": PRESENCE_UA,
          Accept: opts.kind === "html" ? "text/html,application/xhtml+xml;q=0.9" : "text/plain,application/xml,text/xml;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
        lookup: lookup as never,
        servername: /^[\d.]+$/.test(url.hostname) || url.hostname.includes(":") ? undefined : url.hostname,
      },
      (res) => {
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) headers[k.toLowerCase()] = Array.isArray(v) ? v.join(", ") : (v ?? "");
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return finish(() => resolve({ status, headers, body: null, truncated: false }));
        }
        const ct = headers["content-type"] ?? "";
        const okType = status < 200 || status >= 300 ? true : !ct || (opts.kind === "html" ? HTML_RE.test(ct) : TEXT_RE.test(ct));
        if (!okType) {
          res.resume();
          return finish(() => resolve({ status, headers, body: null, truncated: false, contentTypeRejected: true }));
        }
        let stream: NodeJS.ReadableStream = res;
        const enc = (headers["content-encoding"] ?? "").toLowerCase();
        if (enc === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (enc === "deflate") stream = res.pipe(zlib.createInflate());
        else if (enc === "br") stream = res.pipe(zlib.createBrotliDecompress());
        const chunks: Buffer[] = [];
        let total = 0;
        let truncated = false;
        stream.on("data", (c: Buffer) => {
          if (truncated) return;
          total += c.length;
          if (total > opts.maxBytes) {
            truncated = true;
            chunks.push(c.subarray(0, c.length - (total - opts.maxBytes)));
            res.destroy();
            return finish(() => resolve({ status, headers, body: decodeBody(Buffer.concat(chunks), ct), truncated: true }));
          }
          chunks.push(c);
        });
        stream.on("end", () => finish(() => resolve({ status, headers, body: decodeBody(Buffer.concat(chunks), ct), truncated })));
        stream.on("error", (e: Error) => finish(() => reject(e)));
        res.on("error", (e: Error) => finish(() => reject(e)));
      },
    );
    const timer = setTimeout(() => {
      req.destroy(new Error("timeout"));
      finish(() => reject(new Error("timeout")));
    }, opts.timeoutMs);
    req.on("error", (e) => finish(() => reject(e)));
    req.end();
  });

export type FetchCtx = {
  resolver: Resolver;
  transport: Transport;
  deadline: number;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  delayMs: number;
  lastRequestAt: number;
};

export type Fetched = {
  url: string;
  finalUrl: string;
  status: number;
  headers: { xRobotsTag?: string | null; contentType?: string | null };
  body: string | null;
  truncated: boolean;
  error?: string;
  errorCode?: PresenceErrorCode;
};

/** Fetch one resource, following up to 3 manual redirects that each pass the full guard and stay on-site. */
export async function guardedGet(startUrl: string, kind: "html" | "text", siteRoot: string | URL, ctx: FetchCtx): Promise<Fetched> {
  const base: Fetched = { url: startUrl, finalUrl: startUrl, status: 0, headers: {}, body: null, truncated: false };
  let current: URL;
  try {
    current = (await assertSafeUrl(startUrl, ctx.resolver)).url;
  } catch (e) {
    return fail(base, e);
  }
  for (let hop = 0; hop <= MAX_REDIRECT_HOPS; hop++) {
    const remaining = ctx.deadline - ctx.now();
    if (remaining <= 250) return { ...base, finalUrl: current.toString(), error: "Time budget for this audit was reached.", errorCode: "timeout" };
    const wait = ctx.lastRequestAt + ctx.delayMs - ctx.now();
    if (wait > 0) await ctx.sleep(wait);
    ctx.lastRequestAt = ctx.now();
    let raw: RawResponse;
    try {
      raw = await ctx.transport(current, { kind, timeoutMs: Math.min(LIMITS.requestTimeoutMs, remaining), maxBytes: LIMITS.maxBodyBytes, resolver: ctx.resolver });
    } catch (e) {
      return fail({ ...base, finalUrl: current.toString() }, e);
    }
    if (raw.status >= 300 && raw.status < 400 && raw.headers["location"]) {
      try {
        current = await validateRedirect(current, raw.headers["location"], hop + 1, { resolver: ctx.resolver, siteRoot });
      } catch (e) {
        return fail({ ...base, finalUrl: current.toString() }, e);
      }
      continue;
    }
    return {
      url: startUrl, finalUrl: current.toString(), status: raw.status,
      headers: { xRobotsTag: raw.headers["x-robots-tag"] ?? null, contentType: raw.headers["content-type"] ?? null },
      body: raw.body, truncated: raw.truncated,
      ...(raw.contentTypeRejected ? { error: "Not a page we can read (unsupported content type)." } : {}),
    };
  }
  return { ...base, finalUrl: current.toString(), error: "The site redirected too many times.", errorCode: "unreachable" };
}

function fail(base: Fetched, e: unknown): Fetched {
  if (e instanceof PresenceError) return { ...base, error: e.message, errorCode: e.code };
  const msg = e instanceof Error ? e.message : "";
  if (/timeout/i.test(msg)) return { ...base, error: "The request timed out.", errorCode: "timeout" };
  return { ...base, error: "The site couldn't be reached.", errorCode: "unreachable" };
}

// ---------- sitemap ----------

export function parseSitemapXml(xml: string): { urls: string[]; children: string[] } {
  const locs = Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)).map((m) => m[1].replace(/&amp;/g, "&").trim());
  return /<sitemapindex\b/i.test(xml) ? { urls: [], children: locs } : { urls: locs, children: [] };
}

// ---------- page selection ----------

const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|svg|ico|css|js|xml|zip|mp4|mp3|docx?|xlsx?)$/i;

export function pickPages(opts: { home: URL; candidates: { url: string; fromNav: boolean }[]; inputs: AuditInputs; max: number }): string[] {
  const catTokens = opts.inputs.serviceCategory.toLowerCase().split(/\W+/).filter((t) => t.length > 3);
  const placeTokens = opts.inputs.serviceArea.toLowerCase().split(/\W+/).filter((t) => t.length > 3 && !["central", "north", "south", "east", "west", "greater", "metro", "area"].includes(t));
  const seen = new Map<string, { url: string; score: number }>();
  const homeKey = opts.home.hostname.replace(/^www\./, "") + opts.home.pathname.replace(/\/+$/, "");
  for (const c of opts.candidates) {
    let u: URL;
    try {
      u = new URL(c.url);
    } catch {
      continue;
    }
    if (!sameSite(u, opts.home) || (u.protocol !== "http:" && u.protocol !== "https:") || SKIP_EXT.test(u.pathname) || u.search) continue;
    u.hash = "";
    const key = u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/+$/, "");
    if (key === homeKey) continue;
    const p = u.pathname.toLowerCase();
    let score = c.fromNav ? 2 : 0;
    if (/contact|quote|estimate/.test(p)) score += 6;
    if (/service/.test(p) || /what-we-do|solutions/.test(p)) score += 6;
    if (/service-?areas?|areas?-we|locations?|where-we|neighborhood|coverage/.test(p)) score += 6;
    if (/about/.test(p)) score += 3;
    if (catTokens.some((t) => p.includes(t))) score += 3;
    if (placeTokens.some((t) => p.includes(t))) score += 3;
    if (/privacy|terms|cookie|login|cart|checkout|wp-|tag\/|category\/|author\/|feed/.test(p)) score -= 8;
    if (/blog|news|post/.test(p)) score -= 2;
    score -= Math.max(0, p.split("/").filter(Boolean).length - 1) * 0.5;
    const prev = seen.get(key);
    if (!prev || prev.score < score) seen.set(key, { url: u.toString(), score });
  }
  return [...seen.values()]
    .filter((x) => x.score > -3)
    .sort((a, b) => b.score - a.score || a.url.length - b.url.length || a.url.localeCompare(b.url))
    .slice(0, opts.max)
    .map((x) => x.url);
}

// ---------- the live audit ----------

export type LiveOptions = { resolver?: Resolver; transport?: Transport; now?: () => number; sleep?: (ms: number) => Promise<void>; delayMs?: number; budgetMs?: number };

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function collectSnapshot(inputs: AuditInputs, o: LiveOptions = {}): Promise<Snapshot> {
  const now = o.now ?? Date.now;
  const resolver = o.resolver ?? defaultResolver;
  const ctx: FetchCtx = {
    resolver, transport: o.transport ?? nodeTransport, now, sleep: o.sleep ?? defaultSleep,
    deadline: now() + (o.budgetMs ?? LIMITS.totalBudgetMs), delayMs: o.delayMs ?? LIMITS.delayMs, lastRequestAt: 0,
  };
  const notes: string[] = [];
  const start = (await assertSafeUrl(inputs.url, resolver)).url;
  const origin = (u: URL) => `${u.protocol}//${u.host}`;

  const loadRobots = async (o2: URL) => {
    const r = await guardedGet(new URL("/robots.txt", o2).toString(), "text", o2, ctx);
    return r;
  };
  let robotsFetch = await loadRobots(start);
  const parseIfOk = (r: Fetched): ParsedRobots | null => (r.status === 200 && r.body !== null ? parseRobots(r.body) : null);
  let robotsParsed = parseIfOk(robotsFetch);
  const robotsUnknown = () => robotsFetch.status === 0 || robotsFetch.status >= 500 || robotsFetch.status === 429;
  const allowedByRobots = (u: string) => {
    if (!robotsParsed) return true;
    const x = new URL(u);
    return isAllowed(robotsParsed, PRESENCE_UA_TOKEN, x.pathname + x.search).allowed;
  };

  if (!allowedByRobots(start.toString())) throw new PresenceError("robots_disallowed", "This site's robots.txt asks automated tools not to visit this page, so we didn't fetch it. If it's your site, allow BetterDeskPresenceAudit in robots.txt and try again.");

  const homeF = await guardedGet(start.toString(), "html", start, ctx);
  if (homeF.status === 0) {
    if (homeF.errorCode === "blocked_url") throw new PresenceError("blocked_url", homeF.error ?? "That address can't be audited.");
    if (homeF.errorCode === "timeout") throw new PresenceError("timeout", "The site took too long to respond.");
    throw new PresenceError("unreachable", homeF.error ?? "We couldn't reach that site.");
  }
  const homeUrl = new URL(homeF.finalUrl);
  if (origin(homeUrl) !== origin(start)) {
    robotsFetch = await loadRobots(homeUrl);
    robotsParsed = parseIfOk(robotsFetch);
    if (!allowedByRobots(homeUrl.toString())) throw new PresenceError("robots_disallowed", "This site's robots.txt asks automated tools not to visit this page, so we didn't use it.");
  } else if (!allowedByRobots(homeUrl.toString())) {
    throw new PresenceError("robots_disallowed", "This site's robots.txt asks automated tools not to visit the page it redirects to.");
  }
  if (homeF.truncated) notes.push("The homepage was larger than 1.5 MB; only the first part was read.");

  const toSnap = (f: Fetched): PageSnapshot => ({
    url: f.url, finalUrl: f.finalUrl, status: f.status, headers: f.headers, html: f.body, ...(f.error ? { error: f.error } : {}),
  });

  // sitemap
  let sitemapUrl: string | null = null;
  let sitemapStatus: number | null = null;
  let sitemapUrls: string[] | null = null;
  const robotsSitemap = robotsParsed?.sitemaps.map((s) => { try { return new URL(s, homeUrl).toString(); } catch { return null; } }).find((s) => s && sameSite(new URL(s), homeUrl)) ?? null;
  sitemapUrl = robotsSitemap ?? new URL("/sitemap.xml", homeUrl).toString();
  let smF = await guardedGet(sitemapUrl, "text", homeUrl, ctx);
  if (smF.status === 200 && smF.body) {
    let parsed = parseSitemapXml(smF.body);
    if (parsed.children.length) {
      const child = parsed.children.find((c) => { try { return sameSite(new URL(c), homeUrl); } catch { return false; } });
      if (child) {
        notes.push("Your sitemap is an index of several sitemaps; we read only the first one.");
        smF = await guardedGet(child, "text", homeUrl, ctx);
        parsed = smF.status === 200 && smF.body ? parseSitemapXml(smF.body) : { urls: [], children: [] };
      }
    }
    sitemapStatus = smF.status;
    sitemapUrls = parsed.urls.filter((u) => { try { return sameSite(new URL(u), homeUrl); } catch { return false; } }).slice(0, LIMITS.maxSitemapUrls);
  } else {
    sitemapStatus = smF.status === 0 ? null : smF.status;
  }

  // choose + fetch pages
  const homeDoc = homeF.body ? parseHtml(homeF.body, homeF.finalUrl) : null;
  const cands = [
    ...(homeDoc?.links.filter((l) => l.internal).map((l) => ({ url: l.href, fromNav: true })) ?? []),
    ...(sitemapUrls ?? []).map((u) => ({ url: u, fromNav: false })),
  ];
  const chosen = pickPages({ home: homeUrl, candidates: cands, inputs, max: LIMITS.maxPages - 1 });
  const pages: PageSnapshot[] = [];
  if (robotsUnknown() && chosen.length) {
    notes.push("robots.txt could not be read, so we checked only the homepage to stay cautious.");
  } else {
    for (const u of chosen) {
      if (!allowedByRobots(u)) {
        pages.push({ url: u, finalUrl: u, status: 0, headers: {}, html: null, error: "Not fetched: robots.txt disallows BetterDeskPresenceAudit on this page." });
        continue;
      }
      if (ctx.deadline - now() <= 500) {
        notes.push(`Time budget reached; ${chosen.length - pages.length} page(s) were not checked.`);
        break;
      }
      const f = await guardedGet(u, "html", homeUrl, ctx);
      if (f.truncated) notes.push(`${new URL(f.finalUrl).pathname} was larger than 1.5 MB; only the first part was read.`);
      pages.push(toSnap(f));
    }
  }

  return {
    method: "live",
    inputs,
    fetchedAt: new Date(now()).toISOString(),
    home: toSnap(homeF),
    pages,
    robots: { status: robotsFetch.status === 0 ? null : robotsFetch.status, body: robotsFetch.status === 200 ? robotsFetch.body : null, ...(robotsFetch.error ? { error: robotsFetch.error } : {}) },
    sitemap: { url: sitemapUrl, status: sitemapStatus, urls: sitemapUrls },
    notes,
  };
}
