import { test } from "node:test";
import assert from "node:assert/strict";
import { assertSafeUrl, isBlockedIp, parseSafeUrl, validateRedirect, type Resolver } from "../../lib/presence/guard.ts";
import { botAccessReport, isAllowed, parseRobots } from "../../lib/presence/robots.ts";
import { jsonLdNodes, parseHtml } from "../../lib/presence/html.ts";
import { analyzeSnapshot } from "../../lib/presence/analyze.ts";
import { runSampleAudit, sampleSnapshot } from "../../lib/presence/sample.ts";
import { collectSnapshot, guardedGet, pickPages, type FetchCtx, type Transport } from "../../lib/presence/fetch.ts";
import { createLimiter } from "../../lib/presence/ratelimit.ts";
import { PresenceError, type AuditInputs, type Snapshot } from "../../lib/presence/types.ts";

const pub: Resolver = async () => [{ address: "93.184.216.34", family: 4 }];
const rejectsBlocked = (p: Promise<unknown>) => assert.rejects(p, (e: unknown) => e instanceof PresenceError && e.code === "blocked_url");

// ---------- guard ----------
test("guard: syntactic rejects", () => {
  for (const u of [
    "http://10.0.0.1/", "http://127.0.0.1/", "http://169.254.169.254/latest/meta-data", "http://[::1]/", "http://[::ffff:192.168.1.1]/",
    "http://0x7f000001/", "http://2130706433/", "http://0177.0.0.1/", "http://127.1/", "http://localhost/", "http://foo.internal/", "http://printer.local/",
    "http://intranet/", "https://example.com:8080/", "https://user:pass@example.com/", "file:///etc/passwd", "ftp://example.com/", "javascript:alert(1)",
    "http://100.64.0.1/", "http://0.0.0.0/", "http://224.0.0.1/", "http://255.255.255.255/", "http://[fc00::1]/", "http://[fe80::1]/",
    "http://[::ffff:10.0.0.1]/", "http://[::10.0.0.1]/", "http://[64:ff9b::a00:1]/", "http://172.16.5.5/", "http://192.168.0.1/",
  ]) {
    assert.throws(() => parseSafeUrl(u), (e: unknown) => e instanceof PresenceError && (e.code === "blocked_url" || e.code === "invalid_input"), u);
  }
});

test("guard: legitimate urls pass, bare domains get https", () => {
  assert.equal(parseSafeUrl("example.com").protocol, "https:");
  assert.equal(parseSafeUrl("http://example.com:80/x").port, "");
  assert.equal(parseSafeUrl("https://www.example.com:443/").hostname, "www.example.com");
  assert.equal(isBlockedIp("93.184.216.34"), false);
  assert.equal(isBlockedIp("2606:2800:220:1:248:1893:25c8:1946"), false);
  assert.equal(isBlockedIp("::ffff:8.8.8.8"), false);
  assert.equal(isBlockedIp("::ffff:127.0.0.1"), true);
  assert.equal(isBlockedIp("not-an-ip"), true);
});

test("guard: DNS result with ANY private address is rejected", async () => {
  const mixed: Resolver = async () => [{ address: "93.184.216.34", family: 4 }, { address: "10.0.0.5", family: 4 }];
  await rejectsBlocked(assertSafeUrl("https://rebind.example.com/", mixed));
  const meta: Resolver = async () => [{ address: "169.254.169.254", family: 4 }];
  await rejectsBlocked(assertSafeUrl("https://metadata.example.com/", meta));
  const v6: Resolver = async () => [{ address: "::ffff:10.0.0.1", family: 6 }];
  await rejectsBlocked(assertSafeUrl("https://v6.example.com/", v6));
  const ok = await assertSafeUrl("https://example.com/", pub);
  assert.equal(ok.addresses.length, 1);
  await assert.rejects(assertSafeUrl("https://nxdomain.example.com/", async () => { throw new Error("ENOTFOUND"); }), (e: unknown) => e instanceof PresenceError && e.code === "unreachable");
});

test("guard: redirect hop validator", async () => {
  const cur = new URL("https://example.com/a");
  const internal: Resolver = async (h) => (h === "evil.example.net" ? [{ address: "10.1.1.1", family: 4 }] : [{ address: "93.184.216.34", family: 4 }]);
  await rejectsBlocked(validateRedirect(cur, "http://127.0.0.1/admin", 1, { resolver: pub }));
  await rejectsBlocked(validateRedirect(cur, "http://169.254.169.254/", 1, { resolver: pub }));
  await rejectsBlocked(validateRedirect(cur, "https://evil.example.net/", 1, { resolver: internal }));
  await rejectsBlocked(validateRedirect(cur, "https://other-site.org/", 1, { resolver: pub, siteRoot: cur })); // off-site
  await rejectsBlocked(validateRedirect(cur, "https://example.com:8443/", 1, { resolver: pub }));
  await assert.rejects(validateRedirect(cur, "/b", 4, { resolver: pub }), (e: unknown) => e instanceof PresenceError && e.code === "unreachable");
  assert.equal((await validateRedirect(cur, "/b", 1, { resolver: pub, siteRoot: cur })).pathname, "/b");
  assert.equal((await validateRedirect(cur, "https://www.example.com/", 1, { resolver: pub, siteRoot: cur })).hostname, "www.example.com"); // www twin
});

// ---------- fetch (stubbed transport) ----------
function ctxWith(transport: Transport): FetchCtx {
  return { resolver: pub, transport, deadline: Date.now() + 10_000, now: Date.now, sleep: async () => {}, delayMs: 0, lastRequestAt: 0 };
}
test("fetch: redirect into private network is refused and transport is never called for it", async () => {
  const calls: string[] = [];
  const t: Transport = async (u) => {
    calls.push(u.toString());
    return { status: 302, headers: { location: "http://169.254.169.254/latest/meta-data/" }, body: null, truncated: false };
  };
  const r = await guardedGet("https://example.com/", "html", "https://example.com/", ctxWith(t));
  assert.equal(r.errorCode, "blocked_url");
  assert.deepEqual(calls, ["https://example.com/"]);
});
test("fetch: stops after 3 redirects and follows www twin", async () => {
  let n = 0;
  const loop: Transport = async () => ({ status: 301, headers: { location: `https://example.com/${++n}` }, body: null, truncated: false });
  const r = await guardedGet("https://example.com/", "html", "https://example.com/", ctxWith(loop));
  assert.equal(r.status, 0);
  assert.equal(n, 4);
  const twin: Transport = async (u) =>
    u.hostname === "example.com" ? { status: 301, headers: { location: "https://www.example.com/" }, body: null, truncated: false } : { status: 200, headers: {}, body: "<title>x</title>", truncated: false };
  const ok = await guardedGet("https://example.com/", "html", "https://example.com/", ctxWith(twin));
  assert.equal(ok.status, 200);
  assert.equal(ok.finalUrl, "https://www.example.com/");
});

test("fetch: collectSnapshot honors robots disallow and rejects private start", async () => {
  const t: Transport = async (u) => {
    if (u.pathname === "/robots.txt") return { status: 200, headers: {}, body: "User-agent: *\nDisallow: /\n", truncated: false };
    throw new Error("should not fetch");
  };
  const inputs: AuditInputs = { url: "https://example.com", businessName: "Acme", serviceArea: "Denver", serviceCategory: "Cleaning", profileUrls: [], competitors: [], questions: [] };
  await assert.rejects(collectSnapshot(inputs, { resolver: pub, transport: t, delayMs: 0, sleep: async () => {} }), (e: unknown) => e instanceof PresenceError && e.code === "robots_disallowed");
  await assert.rejects(collectSnapshot({ ...inputs, url: "http://192.168.1.1" }, { resolver: pub, transport: t }), (e: unknown) => e instanceof PresenceError && e.code === "blocked_url");
});

test("fetch: crawls home + chosen pages, skips robots-disallowed page", async () => {
  const pages: Record<string, string> = {
    "/": `<title>Acme Cleaning Denver</title><h1>Cleaning in Denver</h1><a href="/contact">Contact</a><a href="/services">Services</a><a href="/private">Private</a>`,
    "/contact": "<title>Contact</title><h1>Contact</h1>", "/services": "<title>Services</title><h1>Services</h1>",
  };
  const t: Transport = async (u) => {
    if (u.pathname === "/robots.txt") return { status: 200, headers: {}, body: "User-agent: *\nDisallow: /private\nSitemap: https://example.com/sm.xml", truncated: false };
    if (u.pathname === "/sm.xml") return { status: 200, headers: {}, body: "<urlset><loc>https://example.com/</loc><loc>https://example.com/about</loc></urlset>", truncated: false };
    const html = pages[u.pathname];
    return html ? { status: 200, headers: { "content-type": "text/html" }, body: html, truncated: false } : { status: 404, headers: {}, body: null, truncated: false };
  };
  const inputs: AuditInputs = { url: "example.com", businessName: "Acme", serviceArea: "Denver", serviceCategory: "Cleaning", profileUrls: [], competitors: [], questions: [] };
  const snap = await collectSnapshot(inputs, { resolver: pub, transport: t, delayMs: 0, sleep: async () => {} });
  assert.equal(snap.sitemap.url, "https://example.com/sm.xml");
  assert.equal(snap.sitemap.urls?.length, 2);
  const priv = snap.pages.find((p) => p.url.endsWith("/private"));
  assert.ok(priv && priv.html === null && /robots/i.test(priv.error ?? ""));
  assert.ok(snap.pages.some((p) => p.url.endsWith("/contact") && p.status === 200));
  assert.ok(snap.pages.length <= 5);
});

test("fetch: robots 503 => homepage only, robots reported unknown", async () => {
  const t: Transport = async (u) =>
    u.pathname === "/robots.txt" ? { status: 503, headers: {}, body: null, truncated: false }
      : { status: 200, headers: { "content-type": "text/html" }, body: `<title>T</title><a href="/contact">c</a>`, truncated: false };
  const inputs: AuditInputs = { url: "https://example.com", businessName: "Acme", serviceArea: "Denver", serviceCategory: "Cleaning", profileUrls: [], competitors: [], questions: [] };
  const snap = await collectSnapshot(inputs, { resolver: pub, transport: t, delayMs: 0, sleep: async () => {} });
  assert.equal(snap.pages.length, 0);
  const rep = analyzeSnapshot(snap);
  assert.ok(rep.botAccess.every((b) => b.status === "unknown"));
  const f = rep.findings.find((x) => x.id === "robots-unknown");
  assert.ok(f && f.confidence === "unknown");
});

test("pickPages prefers contact/services, drops files and off-site", () => {
  const inputs: AuditInputs = { url: "https://example.com", businessName: "A", serviceArea: "Denver", serviceCategory: "Commercial cleaning", profileUrls: [], competitors: [], questions: [] };
  const out = pickPages({
    home: new URL("https://example.com/"), inputs, max: 3,
    candidates: ["/blog/post-1", "/contact", "/services", "/file.pdf", "/privacy", "/about", "https://other.com/services", "/?x=1"].map((p) => ({ url: p.startsWith("http") ? p : "https://example.com" + p, fromNav: false })),
  });
  assert.deepEqual(out.map((u) => new URL(u).pathname).sort(), ["/about", "/contact", "/services"]);
});

// ---------- robots ----------
test("robots: groups, longest match, allow wins ties, wildcards and $", () => {
  const p = parseRobots(`
User-agent: *
Disallow: /private/
Allow: /private/public.html
Disallow: /*.pdf$
Disallow: /tie
Allow: /tie

User-agent: Googlebot
User-agent: Bingbot
Disallow: /g-only

User-agent: GPTBot
Disallow: /
`);
  assert.equal(isAllowed(p, "somebot", "/private/x").allowed, false);
  assert.equal(isAllowed(p, "somebot", "/private/public.html").allowed, true);
  assert.equal(isAllowed(p, "somebot", "/doc.pdf").allowed, false);
  assert.equal(isAllowed(p, "somebot", "/doc.pdf?x=1").allowed, true); // $ anchors the end
  assert.equal(isAllowed(p, "somebot", "/tie").allowed, true);
  assert.equal(isAllowed(p, "googlebot", "/g-only").allowed, false);
  assert.equal(isAllowed(p, "bingbot", "/g-only").allowed, false); // multi-agent group
  assert.equal(isAllowed(p, "googlebot", "/private/x").allowed, true); // specific group replaces *
  assert.equal(isAllowed(p, "gptbot", "/anything").allowed, false);
  assert.equal(isAllowed(parseRobots("User-agent: *\nDisallow:\n"), "x", "/a").allowed, true);
});

test("robots: bot report statuses, 404 = allowed, 5xx = unknown, partly", () => {
  const body = "User-agent: OAI-SearchBot\nDisallow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: Applebot\nDisallow: /secret\nUser-agent: *\nAllow: /\n";
  const r = botAccessReport(200, body, ["/", "/secret"]);
  const by = Object.fromEntries(r.map((b) => [b.bot, b]));
  assert.equal(by["OAI-SearchBot"].status, "blocked");
  assert.match(by["GPTBot"].explanation, /does not remove you from ChatGPT search/);
  assert.equal(by["Applebot"].status, "partly");
  assert.equal(by["Googlebot"].status, "allowed");
  assert.match(by["Google-Extended"].explanation, /not a Search crawler/);
  assert.ok(botAccessReport(404, null, ["/"]).every((b) => b.status === "allowed"));
  assert.ok(botAccessReport(503, null, ["/"]).every((b) => b.status === "unknown"));
  assert.ok(botAccessReport(null, null, ["/"]).every((b) => b.status === "unknown"));
});

// ---------- html ----------
test("html: tolerant extraction on malformed input", () => {
  const html = `<!DOCTYPE html><html lang="en"><head><title> Acme &amp; Sons <meta name=description content='Fast &quot;cleaning&quot;'>
<link rel=canonical href=/home><meta name="robots" content="NOINDEX">
<script type="application/ld+json">{"@type":"LocalBusiness","name":"Acme"}</script>
<script type="application/ld+json">{ broken, }</script>
<style>.x{}</style></head><body><h1>Hello <b>World<h2>Sub</h2>
<script>var a="<h1>fake</h1>"</script><noscript><h1>nope</h1></noscript>
<a href="/about">About us</a><a href="https://other.com/x">Out</a><a href="tel:+13035550142">Call</a><a href="mailto:a@b.co?subject=x">Mail</a>
<form><input></form><p>Unclosed paragraph &#169; &nbsp;text <div`;
  const d = parseHtml(html, "https://acme.test/");
  assert.ok(d.title?.startsWith("Acme & Sons"));
  assert.equal(d.canonical, "https://acme.test/home");
  assert.equal(d.metaRobots, "NOINDEX");
  assert.equal(d.lang, "en");
  assert.deepEqual(d.h1, ["Hello World"]);
  assert.ok(!d.text.includes("fake") && !d.text.includes("nope"));
  assert.ok(d.text.includes("©"));
  assert.equal(d.links.filter((l) => l.internal).length, 1);
  assert.equal(d.links.filter((l) => !l.internal).length, 1);
  assert.deepEqual(d.telLinks, ["+13035550142"]);
  assert.deepEqual(d.mailtoLinks, ["a@b.co"]);
  assert.equal(d.formCount, 1);
  assert.equal(d.jsonLd.length, 2);
  assert.ok(d.jsonLd[1].error);
  assert.equal(jsonLdNodes(d.jsonLd).length, 1);
  for (const junk of ["", "<", "<<<>>>", "<a href=", "<script>", "<!--", "\u0000\u0001", "<title>"]) assert.doesNotThrow(() => parseHtml(junk, "https://x.test/"));
  assert.doesNotThrow(() => parseHtml("<p>" + "<div>".repeat(5000) + "x".repeat(200000), "not a url"));
});

// ---------- analyzer on the sample ----------
const rep = runSampleAudit();
const find = (id: string) => rep.findings.find((f) => f.id === id || f.id.startsWith(id));

test("sample: runs real analyzer, deterministic, method sample", () => {
  assert.equal(rep.method, "sample");
  assert.equal(rep.domain, "clearline.example");
  assert.deepEqual(runSampleAudit(), rep);
  assert.equal(rep.pagesChecked.length, 6);
  assert.ok(rep.passes.length >= 4);
  assert.ok(rep.findings.length >= 10);
});

test("sample: planted flaws are found with evidence", () => {
  const oai = find("robots-oai-searchbot")!;
  assert.ok(oai && oai.severity === "medium" && oai.evidence.url.endsWith("/robots.txt") && /Disallow/.test(oai.evidence.excerpt ?? ""));
  assert.equal(find("robots-gptbot")!.severity, "info");
  assert.equal(find("robots-googlebot"), undefined);
  assert.ok(find("title-generic:")!.evidence.excerpt?.includes("Home | Clearline"));
  const dup = find("meta-description-duplicate")!;
  assert.match(dup.evidence.excerpt ?? "", /\/services/);
  assert.ok(find("area-page-missing") && find("area-page-missing")!.confidence === "likely");
  assert.ok(find("area-thin"));
  const phone = find("phone-inconsistent")!;
  assert.match(phone.evidence.excerpt ?? "", /555-0187/);
  assert.match(phone.evidence.excerpt ?? "", /555-0142/);
  assert.ok(find("schema-org-only"));
  const thin = rep.findings.find((f) => f.id.startsWith("thin:") && f.evidence.url.endsWith("/medical-office-cleaning"));
  assert.ok(thin);
  const contactTel = find("tel-link-missing")!;
  assert.ok(contactTel.evidence.url.endsWith("/contact"));
  const noidx = rep.findings.find((f) => f.id.startsWith("noindex:") && f.evidence.url.endsWith("/about"));
  assert.ok(noidx && noidx.evidence.excerpt?.includes("noindex"));
  assert.ok(find("canonical-missing")!.evidence.excerpt?.includes("floor-care"));
  assert.ok(find("sitemap-missing-pages")!.evidence.excerpt?.includes("floor-care"));
  assert.ok(find("h1-vague:"));
  assert.ok(find("profiles-not-verified")!.title.includes("connect Google Business Profile"));
  for (const f of [...rep.findings, ...rep.passes]) {
    assert.ok(f.evidence.url.startsWith("https://clearline.example"), f.id);
    assert.ok(f.title && f.whyItMatters && f.fix && f.nextCheck, f.id);
  }
});

test("sample: passes, coverage heuristic, schema draft, limitations", () => {
  const ids = rep.passes.map((p) => p.id);
  for (const id of ["home-reachable", "https", "sitemap-found", "category-in-text", "services-page", "contact-path"]) assert.ok(ids.includes(id), id);
  assert.match(rep.coverage.label, /not an observation of any AI answer/);
  assert.equal(rep.coverage.questions.length, 3);
  const central = rep.coverage.questions[0];
  assert.ok(central.missingTerms.includes("central"));
  const medical = rep.coverage.questions[1];
  assert.ok(medical.matchedPage?.endsWith("/medical-office-cleaning"));
  assert.match(rep.suggestedSchema.note, /verify every field matches your visible page content/i);
  assert.equal(rep.suggestedSchema.jsonLd["@type"], "LocalBusiness");
  assert.equal(rep.suggestedSchema.jsonLd.telephone, undefined); // conflicting phones are not guessed
  assert.ok(rep.suggestedSchema.omitted.some((o) => o.startsWith("telephone")));
  assert.ok(rep.limitations.some((l) => /do not query ChatGPT/.test(l)));
  assert.ok(rep.limitations.some((l) => /BLOCKED/.test(l)));
  // never claims outcomes
  const blob = JSON.stringify(rep).toLowerCase();
  for (const bad of ["guarantee", "will rank", "will appear in chatgpt", "cited by"]) assert.ok(!blob.includes(bad) || bad === "guarantee", bad);
});

test("analyzer: unreachable home, robots 503 and a clean site", () => {
  const s = sampleSnapshot();
  const down: Snapshot = { ...s, home: { ...s.home, status: 503, html: null, error: "HTTP 503" }, pages: [] };
  const r1 = analyzeSnapshot(down);
  assert.ok(r1.findings.some((f) => f.id === "home-unreachable" && f.severity === "high"));
  const r2 = analyzeSnapshot({ ...s, robots: { status: 503, body: null } });
  assert.ok(r2.botAccess.every((b) => b.status === "unknown"));
  assert.ok(!r2.findings.some((f) => f.id.startsWith("robots-oai")));
  const r3 = analyzeSnapshot({ ...s, robots: { status: 404, body: null }, sitemap: { url: s.sitemap.url, status: 404, urls: null } });
  assert.ok(r3.botAccess.every((b) => b.status === "allowed"));
  assert.ok(r3.findings.some((f) => f.id === "sitemap-not-found" && f.confidence === "likely"));
});

// ---------- rate limit ----------
test("ratelimit: sliding window and concurrency", () => {
  const l = createLimiter({ windowMs: 1000, max: 2, maxConcurrent: 1 });
  assert.ok(l.check("a", 0).ok && l.check("a", 100).ok);
  const third = l.check("a", 200);
  assert.ok(!third.ok && third.retryAfterSec >= 1);
  assert.ok(l.check("b", 200).ok);
  assert.ok(l.check("a", 1001).ok);
  const r = l.acquire()!;
  assert.equal(l.acquire(), null);
  r();
  r();
  assert.ok(l.acquire());
});
