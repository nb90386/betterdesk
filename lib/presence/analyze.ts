// Pure, deterministic analyzer: Snapshot in, PresenceReport out. No clock, no network, no node APIs.
// Product rule: findings describe technical and content facts observed on the fetched pages.
// Nothing here claims rankings, AI-answer inclusion, citations, or outcomes.

import type {
  BotAccess, CoverageEntry, Finding, FindingCategory, Owner, PageSnapshot, PageSummary, PresenceReport, Severity, Snapshot, Confidence,
} from "./types.ts";
import { jsonLdNodes, nodeTypes, parseHtml, type ParsedHtml } from "./html.ts";
import { botAccessReport, parseRobots } from "./robots.ts";

type Role = PageSummary["role"];
type Pg = { snap: PageSnapshot; doc: ParsedHtml | null; role: Role; isHome: boolean };

const STOP = new Set(["a", "an", "and", "the", "of", "in", "on", "for", "to", "near", "me", "my", "our", "your", "best", "top", "area", "areas", "metro", "greater", "serving", "serve", "company", "companies", "service", "services", "that", "with", "is", "are", "who", "what", "how", "do", "does", "can", "i", "we", "by", "at"]);
const DIRECTIONS = new Set(["central", "east", "west", "north", "south", "northeast", "northwest", "southeast", "southwest", "downtown", "greater", "metro", "county", "city"]);

const stem = (w: string) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
const tokens = (s: string) => words(s).filter((w) => !STOP.has(w)).map(stem);
const uniq = <T,>(a: T[]) => Array.from(new Set(a));

export function urlKey(u: string): string {
  try {
    const x = new URL(u);
    const p = x.pathname.replace(/\/+$/, "");
    return x.hostname.toLowerCase().replace(/^www\./, "") + p + x.search;
  } catch {
    return u;
  }
}
const pathOf = (u: string) => {
  try {
    const x = new URL(u);
    return x.pathname + x.search;
  } catch {
    return "/";
  }
};
const clip = (s: string, n = 140) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
function around(text: string, needle: string, span = 60): string | undefined {
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return undefined;
  return clip(text.slice(Math.max(0, i - span), i + needle.length + span).trim(), 160);
}

const PHONE_RE = /(?<![\d])(?:\+?1[\s.-]?)?(?:\((?<a>[2-9]\d{2})\)|(?<b>[2-9]\d{2}))[\s.-]?(\d{3})[\s.-](\d{4})(?!\d)/g;
function phonesIn(text: string): { raw: string; digits: string }[] {
  const out: { raw: string; digits: string }[] = [];
  for (const m of text.matchAll(PHONE_RE)) {
    out.push({ raw: m[0].trim(), digits: ((m.groups?.a ?? m.groups?.b ?? "") + m[3] + m[4]) });
  }
  return out;
}
const phoneDigits = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d.length >= 10 ? d.slice(-10) : d;
};

const LOCAL_TYPE_RE = /^(LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|GeneralContractor|Plumber|Electrician|HVACBusiness|Locksmith|MovingCompany|RoofingContractor|HousePainter|HealthAndBeautyBusiness|MedicalBusiness|Dentist|LegalService|AccountingService|RealEstateAgent|AutomotiveBusiness|AutoRepair|Store|FoodEstablishment|Restaurant|LodgingBusiness|SportsActivityLocation|EntertainmentBusiness|FinancialService|EmergencyService)$/;
const ORG_TYPE_RE = /^(Organization|Corporation|NGO|OnlineBusiness)$/;

const SEV_RANK: Record<Severity, number> = { high: 0, medium: 1, low: 2, info: 3 };
const CAT_RANK: Record<FindingCategory, number> = { access: 0, indexing: 1, content: 2, local: 3, "structured-data": 4, identity: 5, contact: 6 };

export const COVERAGE_LABEL =
  "Content coverage heuristic. It checks whether your own pages use the words in each question. It is not an observation of any AI answer or search result.";

function normName(s: string): string {
  return words(s).filter((w) => !["llc", "inc", "co", "corp", "company", "ltd", "the"].includes(w)).join(" ");
}

function roleOf(url: string, doc: ParsedHtml | null, isHome: boolean, placeTokens: string[]): Role {
  if (isHome) return "home";
  const path = pathOf(url).toLowerCase();
  const h1 = (doc?.h1[0] ?? "").toLowerCase();
  const hay = path + " " + h1;
  if (/contact|get-in-touch|request-(a-)?(quote|estimate)|get-a-quote/.test(hay)) return "contact";
  if (/about|our-story|who-we-are|our-team/.test(path)) return "about";
  if (/service[-\s]?areas?|areas?[-\s]we[-\s]serve|locations?|where[-\s]we|neighborhoods?|coverage/.test(hay) || placeTokens.some((t) => path.includes(t))) return "service-area";
  if (/services?|what-we-do|solutions|cleaning|janitorial/.test(hay)) return "services";
  return "other";
}

export function analyzeSnapshot(snap: Snapshot): PresenceReport {
  const { inputs } = snap;
  const findings: Finding[] = [];
  const passes: Finding[] = [];

  const areaTokensAll = tokens(inputs.serviceArea);
  const placeTokens = (() => {
    const p = areaTokensAll.filter((t) => !DIRECTIONS.has(t));
    return p.length ? p : areaTokensAll;
  })();

  const all: Pg[] = [snap.home, ...snap.pages].map((s, i) => {
    const ok = s.status >= 200 && s.status < 300 && typeof s.html === "string";
    const doc = ok ? parseHtml(s.html as string, s.finalUrl || s.url) : null;
    return { snap: s, doc, role: roleOf(s.finalUrl || s.url, doc, i === 0, placeTokens), isHome: i === 0 };
  });
  const live = all.filter((p) => p.doc);
  const homeP = all[0];
  const homeUrl = snap.home.finalUrl || snap.home.url;
  const domain = (() => {
    try {
      return new URL(homeUrl).hostname.replace(/^www\./, "");
    } catch {
      return inputs.url;
    }
  })();

  type Draft = { id: string; category: FindingCategory; severity: Severity; confidence?: Confidence; title: string; whyItMatters: string; url: string; excerpt?: string; fix: string; owner: Owner; nextCheck: string };
  const mk = (d: Draft): Finding => ({
    id: d.id, category: d.category, severity: d.severity, confidence: d.confidence ?? "confirmed", title: d.title, whyItMatters: d.whyItMatters,
    evidence: { url: d.url, ...(d.excerpt ? { excerpt: d.excerpt } : {}) }, fix: d.fix, owner: d.owner, nextCheck: d.nextCheck,
  });
  const bad = (d: Draft) => findings.push(mk(d));
  const good = (d: Omit<Draft, "severity" | "fix" | "owner" | "nextCheck"> & { fix?: string }) =>
    passes.push(mk({ ...d, severity: "info", fix: d.fix ?? "Nothing to change. Keep it this way.", owner: "Website editor", nextCheck: "Re-run this audit after site changes." }));
  const pu = (p: Pg) => p.snap.finalUrl || p.snap.url;

  // ---------- access ----------
  const home = snap.home;
  if (home.status >= 200 && home.status < 300) {
    good({ id: "home-reachable", category: "access", title: "Your homepage loads", whyItMatters: "Search engines and customers can open your site.", url: homeUrl, excerpt: `HTTP ${home.status}` });
  } else {
    bad({
      id: "home-unreachable", category: "access", severity: "high",
      title: home.status ? `Your homepage returned an error (HTTP ${home.status})` : "We couldn't load your homepage",
      whyItMatters: "If the homepage doesn't load, neither customers nor search engines can see your business.",
      url: homeUrl, excerpt: home.error ?? (home.status ? `HTTP ${home.status}` : undefined),
      fix: "Ask whoever hosts your site why this address isn't returning a normal page, and confirm it loads in a private browser window.",
      owner: "Developer", nextCheck: "Re-run the audit once the homepage loads normally.",
    });
  }
  if (home.html && (() => { try { return new URL(homeUrl).protocol === "https:"; } catch { return false; } })()) {
    good({ id: "https", category: "access", title: "Your site is served over HTTPS", whyItMatters: "Browsers warn visitors about sites without HTTPS, and search engines prefer secure pages.", url: homeUrl });
  } else if (home.html) {
    bad({
      id: "https-missing", category: "access", severity: "medium", title: "Your site loads over plain HTTP",
      whyItMatters: "Browsers label HTTP sites \"Not secure\", which can make visitors hesitate to send you a request.",
      url: homeUrl, fix: "Turn on HTTPS (a free certificate is usually one setting at your host) and redirect every HTTP address to HTTPS.",
      owner: "Developer", nextCheck: "Load the http:// version of your address and confirm it redirects to https://.",
    });
  }

  // page errors (4xx/5xx) for linked/sitemap pages
  for (const p of all.slice(1)) {
    if (p.snap.status >= 400) {
      bad({
        id: `page-error:${urlKey(pu(p))}`, category: "indexing", severity: "medium", title: `A page on your site returned HTTP ${p.snap.status}`,
        whyItMatters: "Links or sitemap entries that lead to errors waste visitors' time and tell search engines your site is poorly maintained.",
        url: pu(p), fix: "Restore the page, or remove the link or sitemap entry that points to it (or redirect it to the closest working page).",
        owner: "Website editor", nextCheck: "Open the address in a browser after the fix.",
      });
    }
  }

  // noindex
  for (const p of live) {
    const meta = p.doc!.metaRobots ?? "";
    const hdr = p.snap.headers.xRobotsTag ?? "";
    const metaHit = /\b(noindex|none)\b/i.test(meta);
    const hdrHit = /\b(noindex|none)\b/i.test(hdr);
    if (metaHit || hdrHit) {
      const important = p.role === "home" || p.role === "services" || p.role === "service-area" || p.role === "contact";
      bad({
        id: `noindex:${urlKey(pu(p))}`, category: "indexing", severity: important ? "high" : "medium",
        title: `This page tells search engines not to list it${metaHit && hdrHit ? "" : metaHit ? " (meta robots tag)" : " (X-Robots-Tag header)"}`,
        whyItMatters: "A noindex instruction asks Google and Bing to leave the page out of search results. It is often left over from when the site was being built.",
        url: pu(p), excerpt: metaHit ? `meta robots: ${meta}` : `X-Robots-Tag: ${hdr}`,
        fix: "If this page should be found, remove the noindex instruction (in your site builder's SEO settings, or ask your developer to remove the tag or header).",
        owner: metaHit ? "Website editor" : "Developer", nextCheck: "View the page source and confirm no noindex remains, then request re-indexing in Search Console once it is connected.",
      });
    }
  }
  if (live.length && !findings.some((f) => f.id.startsWith("noindex:"))) {
    good({ id: "no-noindex", category: "indexing", title: `No noindex found on the ${live.length} pages checked`, whyItMatters: "Pages are not telling search engines to stay away.", url: homeUrl });
  }

  // robots
  const checkedPaths = live.map((p) => pathOf(pu(p)));
  const botAccess: BotAccess[] = botAccessReport(snap.robots.status, snap.robots.body, checkedPaths);
  const robotsUnknown = botAccess.every((b) => b.status === "unknown");
  const robotsUrl = (() => { try { return new URL("/robots.txt", homeUrl).toString(); } catch { return homeUrl; } })();
  if (robotsUnknown) {
    bad({
      id: "robots-unknown", category: "access", severity: "medium", confidence: "unknown", title: "We couldn't read your robots.txt file",
      whyItMatters: "Crawlers read robots.txt before visiting. If it fails to load, some crawlers hold back, so it's worth knowing which it is.",
      url: robotsUrl, excerpt: snap.robots.status === null ? "No response" : `HTTP ${snap.robots.status}`,
      fix: "Open yourdomain/robots.txt in a browser. It should either load as plain text or return \"not found\" (404), never a server error.",
      owner: "Developer", nextCheck: "Re-run the audit; if it keeps failing, ask your host to check the file.",
    });
  } else {
    const sev: Record<string, { s: Severity; owner: Owner }> = {
      Googlebot: { s: "high", owner: "Developer" }, Bingbot: { s: "high", owner: "Developer" }, "OAI-SearchBot": { s: "medium", owner: "Developer" },
      "ChatGPT-User": { s: "low", owner: "Developer" }, PerplexityBot: { s: "low", owner: "Developer" }, Applebot: { s: "low", owner: "Developer" },
      GPTBot: { s: "info", owner: "Owner" }, ClaudeBot: { s: "info", owner: "Owner" }, "Google-Extended": { s: "info", owner: "Owner" },
    };
    for (const b of botAccess) {
      if (b.status !== "blocked" && b.status !== "partly") continue;
      const cfg = sev[b.bot] ?? { s: "low" as Severity, owner: "Developer" as Owner };
      const choice = cfg.s === "info";
      bad({
        id: `robots-${b.bot.toLowerCase()}`, category: "access", severity: b.status === "partly" && cfg.s === "high" ? "medium" : cfg.s,
        title: `${b.bot} is ${b.status === "blocked" ? "blocked" : "partly blocked"} in your robots.txt`,
        whyItMatters: b.explanation, url: robotsUrl, excerpt: b.matchedRule,
        fix: choice
          ? `If you chose this on purpose, no change is needed. If it was copied from a "block AI bots" snippet by accident, remove the ${b.bot} rule.`
          : `Remove or narrow the rule that blocks ${b.bot} unless you blocked it deliberately.`,
        owner: cfg.owner, nextCheck: "Open yourdomain/robots.txt and confirm the rule is gone, then re-run this audit.",
      });
    }
    const crit = botAccess.filter((b) => ["Googlebot", "Bingbot", "OAI-SearchBot"].includes(b.bot));
    if (crit.every((b) => b.status === "allowed")) {
      good({ id: "robots-ok", category: "access", title: "robots.txt allows Google, Bing and OpenAI's search crawler", whyItMatters: "The crawlers behind Google Search, Bing and ChatGPT search are not blocked from the pages we checked.", url: robotsUrl });
    }
  }

  // ---------- sitemap ----------
  const sm = snap.sitemap;
  const smUrl = sm.url ?? (() => { try { return new URL("/sitemap.xml", homeUrl).toString(); } catch { return homeUrl; } })();
  if (sm.urls && sm.urls.length && sm.status === 200) {
    good({ id: "sitemap-found", category: "indexing", title: `A sitemap lists ${sm.urls.length} page${sm.urls.length === 1 ? "" : "s"}`, whyItMatters: "A sitemap helps search engines discover every page you want found.", url: smUrl });
    const set = new Set(sm.urls.map(urlKey));
    const missing = live.filter((p) => !set.has(urlKey(pu(p))));
    if (missing.length) {
      bad({
        id: "sitemap-missing-pages", category: "indexing", severity: "low", title: `${missing.length} page${missing.length === 1 ? "" : "s"} we checked ${missing.length === 1 ? "isn't" : "aren't"} in your sitemap`,
        whyItMatters: "Pages left out of the sitemap are harder for search engines to find, and an out-of-date sitemap often means pages were added without being published properly.",
        url: pu(missing[0]), excerpt: missing.map((p) => pathOf(pu(p))).join(", "),
        fix: "Add these pages to the sitemap (most site builders do this automatically when the page is set to 'visible in search').",
        owner: "Website editor", nextCheck: "Reload the sitemap and confirm the pages appear.",
      });
    }
  } else if (sm.status === null || (sm.status !== null && sm.status >= 500)) {
    bad({
      id: "sitemap-unknown", category: "indexing", severity: "low", confidence: "unknown", title: "We couldn't read your sitemap",
      whyItMatters: "We can't tell whether search engines have a complete list of your pages.", url: smUrl,
      excerpt: sm.status === null ? "No response" : `HTTP ${sm.status}`, fix: "Open the sitemap address in a browser; it should load as XML.", owner: "Developer", nextCheck: "Re-run the audit.",
    });
  } else {
    bad({
      id: "sitemap-not-found", category: "indexing", severity: "medium", confidence: "likely", title: "We didn't find a sitemap",
      whyItMatters: "Without a sitemap, search engines rely only on links to discover your pages, so new or deep pages can be missed.",
      url: smUrl, excerpt: "Checked the Sitemap line in robots.txt and /sitemap.xml",
      fix: "Generate a sitemap (your site builder or an SEO plugin can do it) and add a line to robots.txt: Sitemap: https://yourdomain/sitemap.xml",
      owner: "Developer", nextCheck: "Open /sitemap.xml in a browser. We only looked at the robots.txt Sitemap line and /sitemap.xml, so a sitemap elsewhere would not have been seen.",
    });
  }

  // ---------- canonical ----------
  const noCanon = live.filter((p) => !p.doc!.canonical);
  const wrongCanon = live.filter((p) => p.doc!.canonical && urlKey(p.doc!.canonical) !== urlKey(pu(p)));
  for (const p of wrongCanon) {
    bad({
      id: `canonical-elsewhere:${urlKey(pu(p))}`, category: "indexing", severity: p.isHome ? "high" : "medium",
      title: "This page's canonical tag points to a different address",
      whyItMatters: "The canonical tag tells search engines which address is the 'main' version. Pointing it elsewhere asks them to show that other address instead of this page.",
      url: pu(p), excerpt: `canonical: ${p.doc!.canonical}`,
      fix: "If this page should stand on its own, set its canonical to its own address. If it is a deliberate duplicate, no change is needed.",
      owner: "Website editor", nextCheck: "View the page source and confirm the canonical matches the page address.",
    });
  }
  if (noCanon.length) {
    bad({
      id: "canonical-missing", category: "indexing", severity: "low", title: `${noCanon.length} page${noCanon.length === 1 ? " has" : "s have"} no canonical tag`,
      whyItMatters: "Without a canonical tag, tracking links or address variants (with and without www) can be treated as separate pages.",
      url: pu(noCanon[0]), excerpt: noCanon.map((p) => pathOf(pu(p))).join(", "),
      fix: "Add a self-referencing canonical tag to each page (most SEO plugins and site builders have a switch for this).",
      owner: "Website editor", nextCheck: "View source on one fixed page and look for rel=\"canonical\".",
    });
  }
  if (live.length && !noCanon.length && !wrongCanon.length) {
    good({ id: "canonical-ok", category: "indexing", title: "Canonical tags point to each page's own address", whyItMatters: "Search engines are told clearly which address is the main version of each page.", url: homeUrl });
  }

  // ---------- titles / descriptions / h1 ----------
  const GENERIC = new Set(["home", "homepage", "home page", "welcome", "index", "untitled", "untitled document", "main", "default", "new page", "page"]);
  for (const p of live) {
    const t = p.doc!.title;
    if (!t) {
      bad({
        id: `title-missing:${urlKey(pu(p))}`, category: "content", severity: p.isHome ? "high" : "medium", title: "This page has no title",
        whyItMatters: "The title is the headline people see in search results and browser tabs.", url: pu(p),
        fix: `Add a title that says what the page is and where. Example: "${inputs.serviceCategory} in ${inputs.serviceArea} | ${inputs.businessName}"`,
        owner: "Website editor", nextCheck: "Search your page title in the browser tab after saving.",
      });
      continue;
    }
    const first = t.split(/\s*[|–—\-:·]\s*/)[0].trim().toLowerCase();
    if (GENERIC.has(first) || GENERIC.has(t.toLowerCase())) {
      bad({
        id: `title-generic:${urlKey(pu(p))}`, category: "content", severity: p.isHome ? "medium" : "low", title: `The title is generic: "${clip(t, 70)}"`,
        whyItMatters: "A title like \"Home\" gives people and search engines no idea what you do or where. It is usually the first thing a searcher reads about your business.",
        url: pu(p), excerpt: `<title>${t}</title>`,
        fix: p.isHome
          ? `Rewrite it to say what you do and where. Example: "${inputs.serviceCategory} in ${inputs.serviceArea} | ${inputs.businessName}"`
          : `Rewrite it to describe this page specifically, ending with "| ${inputs.businessName}".`,
        owner: "Website editor", nextCheck: "Check the browser tab and re-run the audit.",
      });
    } else if (t.length > 70) {
      bad({
        id: `title-long:${urlKey(pu(p))}`, category: "content", severity: "low", title: `The title is long (${t.length} characters)`,
        whyItMatters: "Long titles are often cut off in search results, hiding the end of your message.", url: pu(p), excerpt: clip(t, 120),
        fix: "Shorten to roughly 60 characters, with the most important words first.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    } else if (t.length < 15) {
      bad({
        id: `title-short:${urlKey(pu(p))}`, category: "content", severity: "low", title: `The title is very short (${t.length} characters)`,
        whyItMatters: "A short title leaves out the details that help someone choose your result.", url: pu(p), excerpt: t,
        fix: `Add what you do and where. Example: "${inputs.serviceCategory} in ${inputs.serviceArea}"`, owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
  }
  const titleGroups = new Map<string, Pg[]>();
  for (const p of live) if (p.doc!.title) titleGroups.set(p.doc!.title.toLowerCase(), [...(titleGroups.get(p.doc!.title.toLowerCase()) ?? []), p]);
  for (const [t, ps] of titleGroups) {
    if (ps.length > 1) {
      bad({
        id: `title-duplicate:${t.slice(0, 40)}`, category: "content", severity: "medium", title: `${ps.length} pages share the same title`,
        whyItMatters: "Identical titles make pages look interchangeable, so search engines have little reason to show one over the other.",
        url: pu(ps[0]), excerpt: `"${clip(ps[0].doc!.title!, 80)}" on ${ps.map((p) => pathOf(pu(p))).join(", ")}`,
        fix: "Give each page its own title that names the specific service or topic.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
  }
  const homeTitle = homeP.doc?.title;
  if (homeTitle && !findings.some((f) => f.id.startsWith("title-generic:") || f.id.startsWith("title-missing:")) && live.length) {
    good({ id: "titles-ok", category: "content", title: "Page titles are present and specific", whyItMatters: "Searchers see a meaningful headline for each page.", url: homeUrl, excerpt: clip(homeTitle, 100) });
  }

  const noDesc = live.filter((p) => !p.doc!.metaDescription);
  if (noDesc.length) {
    bad({
      id: "meta-description-missing", category: "content", severity: noDesc.some((p) => p.isHome) ? "medium" : "low",
      title: `${noDesc.length} page${noDesc.length === 1 ? " has" : "s have"} no meta description`,
      whyItMatters: "The description is the short blurb that can appear under your title in search results. Without one, Google picks text from the page, which is often not the best sales pitch.",
      url: pu(noDesc[0]), excerpt: noDesc.map((p) => pathOf(pu(p))).join(", "),
      fix: "Write a 120-155 character description for each page that says what the page offers and who it's for.", owner: "Website editor", nextCheck: "Re-run the audit.",
    });
  }
  const descGroups = new Map<string, Pg[]>();
  for (const p of live) if (p.doc!.metaDescription) descGroups.set(p.doc!.metaDescription.toLowerCase(), [...(descGroups.get(p.doc!.metaDescription.toLowerCase()) ?? []), p]);
  for (const [d, ps] of descGroups) {
    if (ps.length > 1) {
      bad({
        id: `meta-description-duplicate:${d.slice(0, 30)}`, category: "content", severity: "medium", title: `${ps.length} pages use the same meta description`,
        whyItMatters: "Copying one description across pages makes different services look identical in search results.",
        url: pu(ps[0]), excerpt: `"${clip(ps[0].doc!.metaDescription!, 90)}" on ${ps.map((p) => pathOf(pu(p))).join(", ")}`,
        fix: "Write a unique description for each page that reflects its own content.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
  }

  const noH1 = live.filter((p) => p.doc!.h1.length === 0);
  const multiH1 = live.filter((p) => p.doc!.h1.length > 1);
  const vagueH1 = live.filter((p) => {
    const h = p.doc!.h1[0];
    if (!h) return false;
    const w = words(h);
    return /^(welcome|home|homepage|hello|untitled)\b/i.test(h.trim()) || (!p.isHome && w.length < 2);
  });
  if (noH1.length) {
    bad({
      id: "h1-missing", category: "content", severity: noH1.some((p) => p.isHome) ? "medium" : "low", title: `${noH1.length} page${noH1.length === 1 ? " has" : "s have"} no main heading (H1)`,
      whyItMatters: "The main heading tells visitors and search engines what the page is about at a glance.", url: pu(noH1[0]), excerpt: noH1.map((p) => pathOf(pu(p))).join(", "),
      fix: "Add one clear heading at the top of each page that names the service and place.", owner: "Website editor", nextCheck: "Re-run the audit.",
    });
  }
  for (const p of multiH1) {
    bad({
      id: `h1-multiple:${urlKey(pu(p))}`, category: "content", severity: "low", title: `This page has ${p.doc!.h1.length} main headings (H1)`,
      whyItMatters: "Several top-level headings blur what the page is mainly about.", url: pu(p), excerpt: p.doc!.h1.slice(0, 3).map((h) => clip(h, 50)).join(" / "),
      fix: "Keep one H1 and demote the others to H2.", owner: "Website editor", nextCheck: "Re-run the audit.",
    });
  }
  for (const p of vagueH1) {
    bad({
      id: `h1-vague:${urlKey(pu(p))}`, category: "content", severity: p.isHome ? "medium" : "low", title: `The main heading is vague: "${clip(p.doc!.h1[0], 60)}"`,
      whyItMatters: "A greeting like \"Welcome\" doesn't tell anyone what you do or where. The main heading is the clearest signal of the page's subject.",
      url: pu(p), excerpt: `<h1>${p.doc!.h1[0]}</h1>`,
      fix: p.isHome ? `Say it plainly. Example: "${inputs.serviceCategory} for offices in ${inputs.serviceArea}"` : "Name the specific service or topic of the page.",
      owner: "Website editor", nextCheck: "Re-run the audit.",
    });
  }
  if (live.length && !noH1.length && !multiH1.length && !vagueH1.length) {
    good({ id: "h1-ok", category: "content", title: "Each page has one clear main heading", whyItMatters: "The subject of each page is clear at a glance.", url: homeUrl });
  }

  // ---------- category + area content ----------
  if (homeP.doc) {
    const text = homeP.doc.text.toLowerCase();
    const cat = inputs.serviceCategory.trim().toLowerCase();
    const catTokens = tokens(inputs.serviceCategory);
    const phrase = cat && text.includes(cat);
    const allTok = catTokens.length > 0 && catTokens.every((t) => text.split(/\W+/).map(stem).includes(t));
    const headTxt = [homeP.doc.title ?? "", ...homeP.doc.h1, ...homeP.doc.h2].join(" ").toLowerCase();
    const inHeads = catTokens.length > 0 && catTokens.every((t) => words(headTxt).map(stem).includes(t));
    if (phrase || allTok) {
      good({ id: "category-in-text", category: "content", title: `Your homepage says what you do (\"${inputs.serviceCategory}\")`, whyItMatters: "People and search engines can tell your business category from the page text.", url: homeUrl, excerpt: around(homeP.doc.text, phrase ? cat : catTokens[0]) });
      if (!inHeads) {
        bad({
          id: "category-not-in-headings", category: "content", severity: "low", title: "The category isn't in your homepage title or headings",
          whyItMatters: "What you do appears in the body text, but not in the title or main headings, which are the strongest places to say it.",
          url: homeUrl, excerpt: `title: ${homeP.doc.title ?? "(none)"} | H1: ${homeP.doc.h1[0] ?? "(none)"}`,
          fix: `Work "${inputs.serviceCategory}" into the title and H1 in natural language.`, owner: "Website editor", nextCheck: "Re-run the audit.",
        });
      }
    } else {
      const some = catTokens.some((t) => text.split(/\W+/).map(stem).includes(t));
      bad({
        id: "category-missing", category: "content", severity: some ? "low" : "medium", title: `Your homepage doesn't clearly say "${inputs.serviceCategory}"`,
        whyItMatters: "If the page never states what you do in plain words, visitors and search engines have to guess.",
        url: homeUrl, excerpt: some ? "Only part of the phrase appears on the page" : "The phrase does not appear in the page text",
        fix: `State your service plainly near the top, for example: "${inputs.businessName} provides ${inputs.serviceCategory.toLowerCase()} in ${inputs.serviceArea}."`,
        owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
  }

  if (live.length && placeTokens.length) {
    let mentions = 0;
    const pagesWith: string[] = [];
    let inHeading = false;
    for (const p of live) {
      const ws = words(p.doc!.text).map(stem);
      const n = ws.filter((w) => placeTokens.includes(w)).length;
      mentions += n;
      if (n) pagesWith.push(pathOf(pu(p)));
      const h = words([p.doc!.title ?? "", ...p.doc!.h1, ...p.doc!.h2].join(" ")).map(stem);
      if (h.some((w) => placeTokens.includes(w))) inHeading = true;
    }
    if (mentions === 0) {
      bad({
        id: "area-not-mentioned", category: "local", severity: "medium", title: `"${inputs.serviceArea}" isn't mentioned on the pages we checked`,
        whyItMatters: "A local business that never names the places it serves gives nobody a reason to connect it with those places.",
        url: homeUrl, excerpt: `Looked for: ${placeTokens.join(", ")}`,
        fix: `Add a sentence and a dedicated page naming the neighborhoods and cities you actually serve in ${inputs.serviceArea}.`, owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    } else if (mentions < 4 || !inHeading) {
      bad({
        id: "area-thin", category: "local", severity: "low", title: `Your service area is only mentioned in passing (${mentions} mention${mentions === 1 ? "" : "s"} across ${live.length} pages)`,
        whyItMatters: "A place name that appears once in a footer is a weak signal. Local customers look for pages that clearly say they serve their neighborhood.",
        url: homeUrl, excerpt: `Mentioned on: ${pagesWith.join(", ")}${inHeading ? "" : "; not in any title or heading"}`,
        fix: `List the specific neighborhoods and cities you serve within ${inputs.serviceArea} on a dedicated service-area page, and mention the main area in your homepage heading.`,
        owner: "Website editor", nextCheck: "Re-run the audit after adding the page. We can't know which neighborhoods you serve, so those must come from you.",
      });
    } else {
      good({ id: "area-ok", category: "local", title: "Your service area appears in page text and headings", whyItMatters: "The places you serve are stated clearly.", url: homeUrl, excerpt: `${mentions} mentions across ${pagesWith.length} pages` });
    }
  }

  // services / service-area page existence (heuristic)
  const homeLinks = homeP.doc?.links.filter((l) => l.internal) ?? [];
  const servicesHit = live.find((p) => p.role === "services") ?? null;
  const servicesLink = homeLinks.find((l) => /services?|what[-\s]we[-\s]do|solutions|janitorial/i.test(pathOf(l.href) + " " + l.text));
  const areaHit = live.find((p) => p.role === "service-area") ?? null;
  const areaLink = homeLinks.find((l) => /service[-\s]?areas?|areas?[-\s]we[-\s]serve|locations?|where[-\s]we|neighborhoods?|coverage/i.test(pathOf(l.href) + " " + l.text) || placeTokens.some((t) => pathOf(l.href).toLowerCase().includes(t)));
  if (homeP.doc) {
    if (servicesHit || servicesLink) {
      good({ id: "services-page", category: "local", title: "A services page exists", whyItMatters: "Visitors and search engines have a place that lists what you offer.", url: servicesHit ? pu(servicesHit) : servicesLink!.href, confidence: "likely" });
    } else {
      bad({
        id: "services-page-missing", category: "local", severity: "medium", confidence: "likely", title: "We didn't find a dedicated services page",
        whyItMatters: "A page per service is how you show up for specific searches such as \"medical office cleaning\" rather than only your company name.",
        url: homeUrl, excerpt: "No services page found by URL, link text, or heading among the pages we checked",
        fix: "Create a page for each core service with its own title, heading and a few paragraphs of real detail.", owner: "Website editor", nextCheck: "This is a heuristic based on URLs, link text and headings. If you have such a page, link it from your homepage so it's discoverable.",
      });
    }
    if (areaHit || areaLink) {
      good({ id: "area-page", category: "local", title: "A service-area page exists", whyItMatters: "There is a page that names where you work.", url: areaHit ? pu(areaHit) : areaLink!.href, confidence: "likely" });
    } else {
      bad({
        id: "area-page-missing", category: "local", severity: "medium", confidence: "likely", title: "We didn't find a service-area page",
        whyItMatters: "Without a page that names the neighborhoods and cities you cover, nothing on your site speaks directly to someone searching for help in a specific part of town.",
        url: homeUrl, excerpt: "No service-area page found by URL, link text, or heading among the pages we checked",
        fix: `Add a page such as "${inputs.serviceCategory} in ${inputs.serviceArea}" listing the specific neighborhoods you serve, typical response times, and a way to request a quote. Only list places you really serve.`,
        owner: "Website editor", nextCheck: "This is a heuristic based on URLs, link text and headings; we checked at most six pages.",
      });
    }
  }

  // thin pages
  for (const p of live) {
    const min = p.role === "contact" ? 40 : 175;
    if (p.doc!.wordCount < min) {
      bad({
        id: `thin:${urlKey(pu(p))}`, category: "content", severity: p.role === "services" || p.role === "service-area" || p.isHome ? "medium" : "low",
        title: `This page has very little text (${p.doc!.wordCount} words)`,
        whyItMatters: "A page with only a few lines doesn't give a customer enough to decide, and gives search engines little to understand it from.",
        url: pu(p), excerpt: clip(p.doc!.text, 140),
        fix: "Add the substance a buyer would ask about: what's included, how often, how you price it, who it suits, and proof such as certifications or named clients (only what's true).",
        owner: "Owner", nextCheck: "Re-run the audit after adding content.",
      });
    }
  }

  // ---------- contact + NAP ----------
  const phoneByPage = live.map((p) => ({ p, ph: [...phonesIn(p.doc!.text), ...p.doc!.telLinks.map((t) => ({ raw: t, digits: phoneDigits(t) }))].filter((x) => x.digits.length === 10) }));
  const ldNodesByPage = live.map((p) => ({ p, nodes: jsonLdNodes(p.doc!.jsonLd) }));
  const ldPhones: { p: Pg; raw: string; digits: string }[] = [];
  for (const { p, nodes } of ldNodesByPage) for (const n of nodes) if (typeof n.telephone === "string") ldPhones.push({ p, raw: n.telephone, digits: phoneDigits(n.telephone) });
  const visiblePhones = phoneByPage.flatMap(({ p, ph }) => ph.map((x) => ({ p, ...x })));
  const distinct = uniq([...visiblePhones.map((x) => x.digits), ...ldPhones.map((x) => x.digits)]);
  if (distinct.length > 1) {
    const counts = new Map<string, number>();
    visiblePhones.forEach((x) => counts.set(x.digits, (counts.get(x.digits) ?? 0) + 1));
    const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const odd = [...visiblePhones.filter((x) => x.digits !== main), ...ldPhones.filter((x) => x.digits !== main)][0] ?? ldPhones[0];
    const mainEx = visiblePhones.find((x) => x.digits === main) ?? ldPhones[0];
    bad({
      id: "phone-inconsistent", category: "local", severity: "medium", title: `Your site shows ${distinct.length} different phone numbers`,
      whyItMatters: "Customers may call a number that's no longer yours, and mismatched business details make it harder for search engines to trust any of them.",
      url: pu(odd.p), excerpt: `${mainEx.raw} on ${pathOf(pu(mainEx.p))}; ${odd.raw} on ${pathOf(pu(odd.p))}${ldPhones.includes(odd as never) ? " (structured data)" : ""}`,
      fix: "Pick the one number customers should call and use it everywhere: page text, footer, tap-to-call links, and structured data.", owner: "Website editor", nextCheck: "Re-run the audit after updating.",
    });
  } else if (distinct.length === 1 && visiblePhones.length) {
    good({ id: "phone-consistent", category: "local", title: "One phone number is used consistently", whyItMatters: "Customers and search engines see the same number everywhere.", url: homeUrl, excerpt: visiblePhones[0].raw });
  } else if (distinct.length === 1) {
    bad({
      id: "phone-only-structured", category: "local", severity: "medium", title: "Your phone number appears only in structured data, not on the page",
      whyItMatters: "Search engines expect structured data to match what visitors can see. Visitors who can't see a number can't call it.",
      url: pu(ldPhones[0].p), excerpt: `JSON-LD telephone: ${ldPhones[0].raw}`, fix: "Show the number in the page header or footer and make it a tap-to-call link.", owner: "Website editor", nextCheck: "Re-run the audit.",
    });
  }

  if (live.length) {
    const tels = live.filter((p) => p.doc!.telLinks.length);
    const mails = live.filter((p) => p.doc!.mailtoLinks.length);
    const forms = live.filter((p) => p.doc!.formCount > 0);
    const anyVisiblePhone = visiblePhones.length > 0;
    if (!tels.length && !mails.length && !forms.length && !anyVisiblePhone) {
      bad({
        id: "contact-missing", category: "contact", severity: "high", title: "We couldn't find any way to contact you on the pages checked",
        whyItMatters: "A visitor who's ready to call or request a quote needs a phone number, email or form within a click.", url: homeUrl,
        excerpt: "No phone, email link or form detected", fix: "Add a visible phone number (tap-to-call) and a short quote-request form to the header, footer and a Contact page.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    } else {
      const parts = [tels.length ? "tap-to-call link" : null, mails.length ? "email link" : null, forms.length ? "contact form" : null, anyVisiblePhone && !tels.length ? "phone number in text" : null].filter(Boolean);
      good({ id: "contact-path", category: "contact", title: `Visitors can reach you (${parts.join(", ")})`, whyItMatters: "There is at least one clear path from the site to your business.", url: forms[0] ? pu(forms[0]) : homeUrl });
    }
    if (!tels.length && (anyVisiblePhone || ldPhones.length)) {
      const target = live.find((p) => p.role === "contact") ?? homeP;
      bad({
        id: "tel-link-missing", category: "contact", severity: "low", title: "The phone number isn't a tap-to-call link",
        whyItMatters: "Most local searches happen on a phone. A number that can't be tapped adds a step, and some visitors won't take it.", url: pu(target),
        excerpt: `No tel: link found on any of the ${live.length} pages checked`, fix: "Wrap the phone number in a link that starts with tel: (for example tel:+13035550142) in the header, footer and contact page.", owner: "Website editor", nextCheck: "Tap the number on a phone.",
      });
    }
  }

  // ---------- identity ----------
  if (homeP.doc) {
    const want = normName(inputs.businessName);
    const nodes = ldNodesByPage.flatMap((x) => x.nodes.map((n) => ({ p: x.p, n })));
    const orgNodes = nodes.filter(({ n }) => nodeTypes(n).some((t) => LOCAL_TYPE_RE.test(t) || ORG_TYPE_RE.test(t)));
    const ldNames = orgNodes.filter(({ n }) => typeof n.name === "string").map(({ p, n }) => ({ p, name: n.name as string }));
    const mism = ldNames.filter((x) => want && !normName(x.name).includes(want) && !want.includes(normName(x.name)));
    const ogMis = live.filter((p) => p.doc!.ogSiteName && want && !normName(p.doc!.ogSiteName).includes(want) && !want.includes(normName(p.doc!.ogSiteName)));
    const visibleHome = want && normName(homeP.doc.text).includes(want);
    if (mism.length) {
      bad({
        id: "name-jsonld-mismatch", category: "identity", severity: "medium", title: "The business name in structured data differs from the name you gave us",
        whyItMatters: "Consistent naming across your site and listings helps search engines treat them as the same business.", url: pu(mism[0].p),
        excerpt: `JSON-LD name: "${mism[0].name}" vs "${inputs.businessName}"`, fix: "Use one exact business name everywhere (or tell us if the name you entered isn't your legal or trading name).", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
    if (ogMis.length) {
      bad({
        id: "name-og-mismatch", category: "identity", severity: "low", title: "The social sharing site name differs from your business name",
        whyItMatters: "Link previews show this name when someone shares your site.", url: pu(ogMis[0]), excerpt: `og:site_name: "${ogMis[0].doc!.ogSiteName}"`,
        fix: "Set the site name in your site builder's social settings to your business name.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    }
    if (!visibleHome) {
      bad({
        id: "name-not-visible", category: "identity", severity: "medium", title: `"${inputs.businessName}" doesn't appear in your homepage text`,
        whyItMatters: "If the full business name isn't on the page, people and search engines can't confirm they're in the right place.", url: homeUrl,
        fix: "Show your full business name in the header or footer as it appears on your listings.", owner: "Website editor", nextCheck: "Re-run the audit.",
      });
    } else if (!mism.length && !ogMis.length) {
      good({ id: "name-consistent", category: "identity", title: "Your business name is shown and consistent", whyItMatters: "The same name appears on the page and in the data we could read.", url: homeUrl, excerpt: around(homeP.doc.text, inputs.businessName) });
    }

    // third-party profiles: never fetched
    bad({
      id: "profiles-not-verified", category: "identity", severity: "info", confidence: "unknown", title: "Not verified: connect Google Business Profile",
      whyItMatters: "Your name, address, phone and hours on Google and other listings should match your website. We don't fetch third-party profile sites, so we have not compared them.",
      url: homeUrl, excerpt: inputs.profileUrls.length ? `Recorded, not fetched: ${inputs.profileUrls.join(", ")}` : "No profile links provided",
      fix: "Connect Google Business Profile so a future check can compare name, address, phone and hours with your website. Until then, compare them by hand.", owner: "Owner", nextCheck: "Connect Google Business Profile (not yet available in this audit).",
    });

    // ---------- structured data ----------
    for (const p of live) {
      const errs = p.doc!.jsonLd.filter((b) => b.error);
      if (errs.length) {
        bad({
          id: `jsonld-error:${urlKey(pu(p))}`, category: "structured-data", severity: "medium", title: `${errs.length} structured data block${errs.length === 1 ? "" : "s"} on this page can't be read`,
          whyItMatters: "Search engines ignore structured data that isn't valid JSON, so the details you meant to share are lost.", url: pu(p), excerpt: `${errs[0].error}`,
          fix: "Fix the syntax (often a stray comma or smart quote) and test it with Google's Rich Results Test or the Schema Markup Validator.", owner: "Developer", nextCheck: "Run the page through the Schema Markup Validator.",
        });
      }
    }
    const types = uniq(nodes.flatMap((x) => nodeTypes(x.n)));
    const hasLocal = types.some((t) => LOCAL_TYPE_RE.test(t));
    const hasOrg = types.some((t) => ORG_TYPE_RE.test(t));
    if (hasLocal) {
      good({ id: "schema-localbusiness", category: "structured-data", title: "LocalBusiness structured data is present", whyItMatters: "Your business details are stated in a machine-readable form (this is optional and doesn't guarantee any special display).", url: homeUrl, excerpt: types.join(", ") });
    } else if (hasOrg) {
      bad({
        id: "schema-org-only", category: "structured-data", severity: "low", confidence: "likely", title: "Structured data describes an Organization, not a local business",
        whyItMatters: "LocalBusiness lets you state your address, service area and hours in a form search engines read. Organization alone doesn't carry local details. It's optional and doesn't guarantee any special search display.",
        url: homeUrl, excerpt: `Found: ${types.join(", ")}`, fix: "Replace or extend it with LocalBusiness markup. A draft is included in this report. Only publish fields that match what's visible on your page.", owner: "Developer", nextCheck: "Validate with the Schema Markup Validator after publishing.",
      });
    } else if (!live.some((p) => p.doc!.jsonLd.length)) {
      bad({
        id: "schema-none", category: "structured-data", severity: "low", title: "No structured data found",
        whyItMatters: "Structured data isn't required for Google Search or its AI features, but it can state your business details clearly. Treat it as a tidy-up, not a ranking lever.",
        url: homeUrl, fix: "Add LocalBusiness JSON-LD that matches your visible page content. A draft is included in this report.", owner: "Developer", nextCheck: "Validate with the Schema Markup Validator after publishing.",
      });
    }

    // claimed in JSON-LD but not visible
    for (const { p, n } of orgNodes) {
      const text = p.doc!.text.toLowerCase();
      const missing: string[] = [];
      const addr = n.address as Record<string, unknown> | undefined;
      if (addr && typeof addr === "object" && typeof addr.streetAddress === "string" && !text.includes(addr.streetAddress.toLowerCase().replace(/\s+/g, " ").trim())) missing.push(`street address "${addr.streetAddress}"`);
      if (typeof n.email === "string" && !text.includes(n.email.toLowerCase()) && !p.doc!.mailtoLinks.some((m) => m.toLowerCase() === (n.email as string).toLowerCase())) missing.push(`email "${n.email}"`);
      const areas = Array.isArray(n.areaServed) ? n.areaServed : n.areaServed ? [n.areaServed] : [];
      for (const a of areas) {
        const nm = typeof a === "string" ? a : typeof (a as Record<string, unknown>)?.name === "string" ? ((a as Record<string, unknown>).name as string) : "";
        if (nm && !text.includes(nm.toLowerCase())) missing.push(`area served "${nm}"`);
      }
      if (missing.length) {
        bad({
          id: `jsonld-not-visible:${urlKey(pu(p))}`, category: "structured-data", severity: "medium", title: "Structured data claims details that aren't visible on the page",
          whyItMatters: "Google's guidance is that structured data should reflect content visitors can see. Mismatches can make the markup untrustworthy or ineligible.", url: pu(p), excerpt: `Not found in visible text: ${missing.join("; ")}`,
          fix: "Either show these details on the page or remove them from the markup.", owner: "Developer", nextCheck: "Re-run the audit.",
        });
      }
    }
    const withSameAs = orgNodes.some(({ n }) => Array.isArray(n.sameAs) ? n.sameAs.length > 0 : typeof n.sameAs === "string");
    if (orgNodes.length && !withSameAs) {
      bad({
        id: "schema-sameas-missing", category: "structured-data", severity: "low", title: "Structured data doesn't link to your other profiles (sameAs)",
        whyItMatters: "Linking to your Google Business Profile and other official profiles helps connect them to your site. Only link profiles you control.", url: pu(orgNodes[0].p),
        fix: "Add your official profile URLs to the sameAs field once you've confirmed them.", owner: "Developer", nextCheck: "Re-run the audit.",
      });
    }
  }

  // ---------- coverage heuristic ----------
  const coverage: CoverageEntry[] = inputs.questions.map((q) => {
    const qt = uniq(tokens(q));
    if (!qt.length) return { question: q, matchedPage: null, matchedTerms: [], missingTerms: [], note: "No distinctive words to check." };
    type Best = { p: Pg; hit: string[]; head: number };
    let bestRaw = null as Best | null;
    for (const p of live) {
      const ws = new Set(words(p.doc!.text + " " + (p.doc!.title ?? "")).map(stem));
      const top = new Set(words([p.doc!.title ?? "", ...p.doc!.h1].join(" ")).map(stem));
      const h2s = new Set(words(p.doc!.h2.join(" ")).map(stem));
      const hit = qt.filter((t) => ws.has(t));
      const head = qt.filter((t) => top.has(t)).length * 2 + qt.filter((t) => h2s.has(t)).length;
      const cur = bestRaw;
      if (!cur || hit.length > cur.hit.length || (hit.length === cur.hit.length && head > cur.head)) bestRaw = { p, hit, head };
    }
    const best: Best | null = bestRaw;
    const bestHit: string[] = best ? best.hit : [];
    if (!best || best.hit.length / qt.length < 0.5) {
      return { question: q, matchedPage: null, matchedTerms: bestHit, missingTerms: qt.filter((t) => !bestHit.includes(t)), note: "No page we checked uses most of these words together. If this is a real service you offer, a page that says so plainly would cover it." };
    }
    const missing = qt.filter((t) => !bestHit.includes(t));
    const where = pathOf(pu(best.p));
    return {
      question: q, matchedPage: pu(best.p), matchedTerms: best.hit, missingTerms: missing,
      note: missing.length
        ? `Partly covered on ${where}: it uses ${best.hit.join(", ")} but not ${missing.join(", ")}.`
        : `All the key words appear on ${where}${best.head >= qt.length ? ", including in its title or headings" : ", but not all in its title or headings"}.`,
    };
  });

  // ---------- suggested schema ----------
  const sources: Record<string, string> = {};
  const omitted: string[] = [];
  const ld: Record<string, unknown> = { "@context": "https://schema.org", "@type": "LocalBusiness", name: inputs.businessName };
  sources.name = "your input";
  ld.url = new URL(homeUrl).origin + "/";
  sources.url = "observed: homepage address";
  if (inputs.serviceArea) { ld.areaServed = inputs.serviceArea; sources.areaServed = "your input"; }
  if (homeP.doc?.metaDescription) { ld.description = homeP.doc.metaDescription; sources.description = `observed: meta description on ${pathOf(homeUrl)}`; }
  if (distinct.length === 1 && visiblePhones[0]) { ld.telephone = visiblePhones[0].raw; sources.telephone = `observed: ${pathOf(pu(visiblePhones[0].p))}`; }
  else omitted.push(distinct.length > 1 ? "telephone: the numbers on your site differ, so choose one" : "telephone: no phone number found on the page");
  const mail = live.flatMap((p) => p.doc!.mailtoLinks)[0];
  if (mail) { ld.email = mail; sources.email = "observed: mailto link"; } else omitted.push("email: none observed");
  const existingAddr = ldNodesByPage.flatMap((x) => x.nodes).map((n) => n.address).find((a) => a && typeof a === "object");
  if (existingAddr) { ld.address = existingAddr; sources.address = "observed: existing structured data (verify it is visible on the page)"; } else omitted.push("address: add your street address as shown on the page and your Google Business Profile");
  if (inputs.profileUrls.length) { ld.sameAs = inputs.profileUrls; sources.sameAs = "your input (not fetched or verified)"; }
  omitted.push("openingHours, priceRange, geo: add only if you display them on the page");

  const summary = {
    high: findings.filter((f) => f.severity === "high").length, medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length, info: findings.filter((f) => f.severity === "info").length, passes: passes.length,
  };
  findings.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || CAT_RANK[a.category] - CAT_RANK[b.category] || a.id.localeCompare(b.id));

  const limitations = [
    "We read the HTML your server returns, without running JavaScript. Text added by scripts after load isn't seen.",
    `We checked at most 6 pages (${all.length} this time) at one moment in time. Other pages may differ.`,
    "We do not query ChatGPT, Gemini, Perplexity or any AI provider. AI answers vary by prompt, time, location, provider and personalization, so no audit can promise or predict whether you will be mentioned or cited.",
    "Google's AI features (AI Overviews, AI Mode) need no special markup beyond normal Search eligibility: pages that are indexed and can show a snippet. Structured data is optional and does not guarantee rich results.",
    "Not connected (BLOCKED): Google Search Console, Bing Webmaster Tools and Google Business Profile. We have not observed what is indexed, what people searched, or how you rank.",
    "Third-party profile sites and competitors are never fetched. Profile identity checks are 'not verified'.",
    "robots.txt expresses crawl permissions; crawlers can differ in how they honor it, and it says nothing about whether a page will be shown.",
    "The coverage section is a word-matching heuristic over your own pages, not an observation of any search or AI answer.",
    ...(snap.notes ?? []),
  ];
  if (robotsUnknown) limitations.push("robots.txt could not be read, so crawler access is reported as unknown.");

  const pagesChecked: PageSummary[] = all.map((p) => ({
    url: p.snap.url, finalUrl: pu(p), status: p.snap.status, title: p.doc?.title ?? null, wordCount: p.doc?.wordCount ?? 0, role: p.role,
    ...(p.snap.error ? { note: p.snap.error } : {}),
  }));

  return {
    domain, fetchedAt: snap.fetchedAt, method: snap.method,
    business: { name: inputs.businessName, serviceArea: inputs.serviceArea, serviceCategory: inputs.serviceCategory },
    pagesChecked, botAccess, findings, passes,
    coverage: { label: COVERAGE_LABEL, questions: coverage },
    suggestedSchema: { jsonLd: ld, note: "Draft: verify every field matches your visible page content before publishing.", sources, omitted },
    profiles: inputs.profileUrls.map((u) => ({ url: u, status: "not_verified" as const, note: "Not verified: connect Google Business Profile. This page was not fetched." })),
    competitors: inputs.competitors, summary, limitations,
  };
}

export { parseRobots };
