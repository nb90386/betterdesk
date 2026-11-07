// SSRF / URL safety for the Presence fetcher. Pure logic plus an injectable DNS resolver.
// Server-only in practice (the default resolver uses node:dns), but nothing here touches the network
// unless the default resolver is used.

import { PresenceError } from "./types.ts";

export type ResolvedAddress = { address: string; family: 4 | 6 };
export type Resolver = (hostname: string) => Promise<ResolvedAddress[]>;

export async function defaultResolver(hostname: string): Promise<ResolvedAddress[]> {
  const dns = await import("node:dns");
  const res = await dns.promises.lookup(hostname, { all: true, verbatim: true });
  return res.map((r) => ({ address: r.address, family: r.family === 6 ? 6 : 4 }));
}

const blocked = (msg: string) => new PresenceError("blocked_url", msg);

// ---------- IP classification ----------

function v4Blocked(a: number, b: number, c: number): boolean {
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 169 && b === 254) return true; // link-local incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;
  if (a === 192 && b === 88 && c === 99) return true;
  if (a === 192 && b === 168) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;
  if (a >= 224) return true; // multicast, reserved, broadcast
  return false;
}

/** Parse dotted-quad and legacy inet_aton forms (decimal, octal 0nn, hex 0xnn, 1-4 parts). */
export function parseLooseIPv4(host: string): [number, number, number, number] | null {
  if (!/^[0-9a-fx.]+$/i.test(host) || host.startsWith(".") || host.endsWith(".")) return null;
  const parts = host.split(".");
  if (parts.length < 1 || parts.length > 4) return null;
  const nums: number[] = [];
  for (const p of parts) {
    if (p === "") return null;
    let n: number;
    if (/^0x[0-9a-f]+$/i.test(p)) n = parseInt(p.slice(2), 16);
    else if (/^0[0-7]+$/.test(p)) n = parseInt(p, 8);
    else if (/^(0|[1-9][0-9]*)$/.test(p)) n = parseInt(p, 10);
    else return null;
    if (!Number.isFinite(n)) return null;
    nums.push(n);
  }
  const last = nums[nums.length - 1];
  const maxLast = 256 ** (5 - nums.length) - 1;
  if (last > maxLast) return null;
  if (nums.slice(0, -1).some((n) => n > 255)) return null;
  let value = last;
  nums.slice(0, -1).forEach((n, i) => {
    value += n * 256 ** (3 - i);
  });
  if (value > 0xffffffff) return null;
  return [Math.floor(value / 2 ** 24) % 256, Math.floor(value / 2 ** 16) % 256, Math.floor(value / 256) % 256, value % 256];
}

/** Expand an IPv6 literal (no brackets) to 8 groups, or null when malformed. */
export function parseIPv6(input: string): number[] | null {
  let s = input.toLowerCase();
  if (s.includes("%")) return null; // zone ids are never legitimate for public hosts
  let tail: number[] = [];
  const lastColon = s.lastIndexOf(":");
  if (lastColon === -1) return null;
  const maybeV4 = s.slice(lastColon + 1);
  if (maybeV4.includes(".")) {
    const p = maybeV4.split(".");
    if (p.length !== 4 || p.some((x) => !/^(0|[1-9][0-9]{0,2})$/.test(x) || Number(x) > 255)) return null;
    const n = p.map(Number);
    tail = [(n[0] << 8) | n[1], (n[2] << 8) | n[3]];
    s = s.slice(0, lastColon + 1) + "0:0";
  }
  const dbl = s.split("::");
  if (dbl.length > 2) return null;
  const toGroups = (x: string) => (x === "" ? [] : x.split(":"));
  const head = toGroups(dbl[0]);
  const rest = dbl.length === 2 ? toGroups(dbl[1]) : [];
  const all = [...head, ...rest];
  if (all.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  if (dbl.length === 1 && head.length !== 8) return null;
  if (dbl.length === 2 && head.length + rest.length > 7) return null;
  const fill = dbl.length === 2 ? new Array(8 - head.length - rest.length).fill(0) : [];
  const out = [...head.map((g) => parseInt(g, 16)), ...fill, ...rest.map((g) => parseInt(g, 16))];
  if (tail.length) {
    out[6] = tail[0];
    out[7] = tail[1];
  }
  return out.length === 8 ? out : null;
}

function v4FromGroups(hi: number, lo: number): [number, number, number, number] {
  return [hi >> 8, hi & 255, lo >> 8, lo & 255];
}

/** True when an address (v4 or v6 literal, no brackets) must never be fetched. Unparseable = blocked. */
export function isBlockedIp(ip: string): boolean {
  const v4 = /^\d+\.\d+\.\d+\.\d+$/.test(ip) ? parseLooseIPv4(ip) : null;
  if (v4) return v4Blocked(v4[0], v4[1], v4[2]);
  const g = parseIPv6(ip);
  if (!g) return true;
  const [g0, g1, g2, g3, g4, g5, g6, g7] = g;
  const embedded = () => v4FromGroups(g6, g7);
  const checkEmbedded = () => {
    const e = embedded();
    return v4Blocked(e[0], e[1], e[2]);
  };
  if (g.every((x) => x === 0)) return true; // ::
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) return g6 === 0 && g7 === 1 ? true : checkEmbedded(); // ::1, v4-compatible
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0xffff) return checkEmbedded(); // v4-mapped
  if (g0 === 0x64 && g1 === 0xff9b) {
    if (g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) return checkEmbedded(); // NAT64
    return true; // 64:ff9b:1::/48 local-use
  }
  if (g0 === 0x2002) {
    const e = v4FromGroups(g1, g2); // 6to4
    return v4Blocked(e[0], e[1], e[2]);
  }
  if (g0 === 0x2001 && g1 === 0) return true; // Teredo
  if (g0 === 0x2001 && g1 === 0xdb8) return true; // documentation
  if ((g0 & 0xfe00) === 0xfc00) return true; // fc00::/7
  if ((g0 & 0xffc0) === 0xfe80) return true; // fe80::/10
  if ((g0 & 0xffc0) === 0xfec0) return true; // fec0::/10
  if ((g0 & 0xff00) === 0xff00) return true; // multicast
  return false;
}

// ---------- URL / hostname checks ----------

const BAD_SUFFIXES = [".local", ".localhost", ".internal", ".localdomain", ".lan", ".home", ".home.arpa", ".corp", ".intranet", ".private"];

/** Throws blocked_url unless the (already URL-parsed) hostname is an acceptable public name or public IP literal. */
export function assertPublicHostname(rawHost: string): void {
  let host = rawHost.toLowerCase();
  if (host.startsWith("[") && host.endsWith("]")) {
    if (isBlockedIp(host.slice(1, -1))) throw blocked("That address points to a private or reserved network, so it can't be audited.");
    return;
  }
  host = host.replace(/\.$/, "");
  if (!host) throw blocked("That web address has no host name.");
  if (parseLooseIPv4(host)) {
    const v = parseLooseIPv4(host)!;
    if (v4Blocked(v[0], v[1], v[2])) throw blocked("That address points to a private or reserved network, so it can't be audited.");
    return;
  }
  if (/^[0-9.]+$/.test(host) || /^0x/i.test(host)) throw blocked("That host name looks like an IP address in an unsupported format.");
  if (host === "localhost" || BAD_SUFFIXES.some((s) => host.endsWith(s))) throw blocked("Internal host names can't be audited.");
  if (!host.includes(".")) throw blocked("Use a full domain name such as example.com.");
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/.test(host)) throw blocked("That host name isn't valid.");
}

/** Add https:// when the user typed a bare domain; leave real schemes alone so they can be rejected. */
export function normalizeInputUrl(raw: string): string {
  const s = raw.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^[^/:\s]+:\d+(\/|$)/.test(s)) return s; // javascript:, mailto:, data: ...
  return "https://" + s;
}

/** Syntactic validation only (no DNS). Returns the parsed URL or throws blocked_url. */
export function parseSafeUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(normalizeInputUrl(raw));
  } catch {
    throw new PresenceError("invalid_input", "That doesn't look like a valid web address.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw blocked("Only http and https addresses can be audited.");
  if (u.username || u.password) throw blocked("Addresses containing a username or password can't be audited.");
  if (u.port && u.port !== (u.protocol === "https:" ? "443" : "80")) throw blocked("Only the standard web ports (80 and 443) can be audited.");
  assertPublicHostname(u.hostname);
  u.hash = "";
  return u;
}

/** Syntax check, then resolve DNS and require EVERY returned address to be public. */
export async function assertSafeUrl(raw: string | URL, resolver: Resolver = defaultResolver): Promise<{ url: URL; addresses: ResolvedAddress[] }> {
  const url = parseSafeUrl(typeof raw === "string" ? raw : raw.toString());
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (parseIPv6(host) || parseLooseIPv4(host)) return { url, addresses: [{ address: host, family: host.includes(":") ? 6 : 4 }] };
  let addresses: ResolvedAddress[];
  try {
    addresses = await resolver(host);
  } catch {
    throw new PresenceError("unreachable", "We couldn't find that domain. Check the spelling.");
  }
  if (!addresses.length) throw new PresenceError("unreachable", "We couldn't find that domain. Check the spelling.");
  for (const a of addresses) {
    if (isBlockedIp(a.address)) throw blocked("That domain resolves to a private or reserved network address, so it can't be audited.");
  }
  return { url, addresses };
}

// ---------- site identity & redirects ----------

/** Host with a leading "www." removed, lower-cased, no trailing dot. */
export function siteKey(host: string): string {
  return host.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

export function sameSite(a: URL | string, b: URL | string): boolean {
  const ha = typeof a === "string" ? new URL(a).hostname : a.hostname;
  const hb = typeof b === "string" ? new URL(b).hostname : b.hostname;
  return siteKey(ha) === siteKey(hb);
}

export const MAX_REDIRECT_HOPS = 3;

/**
 * Validate one redirect hop: resolves Location against the current URL, enforces hop count,
 * the full URL/DNS safety rules, and (when siteRoot is given) that the target stays on the same
 * site or its www/apex twin. Returns the next URL.
 */
export async function validateRedirect(
  current: URL,
  location: string,
  hop: number,
  opts: { resolver?: Resolver; siteRoot?: URL | string } = {},
): Promise<URL> {
  if (hop > MAX_REDIRECT_HOPS) throw new PresenceError("unreachable", "The site redirected too many times.");
  let next: URL;
  try {
    next = new URL(location, current);
  } catch {
    throw new PresenceError("unreachable", "The site sent an invalid redirect.");
  }
  const { url } = await assertSafeUrl(next, opts.resolver ?? defaultResolver);
  if (opts.siteRoot && !sameSite(url, opts.siteRoot)) {
    throw new PresenceError("blocked_url", "The site redirected to a different domain, which we don't follow.");
  }
  return url;
}
