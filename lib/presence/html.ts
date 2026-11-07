// Tolerant HTML extraction for the Presence audit. Regex based on purpose: it must never throw on
// malformed input and needs no dependency. Pure.

export type LinkInfo = { href: string; text: string; internal: boolean };
export type JsonLdBlock = { raw: string; parsed: unknown | null; error?: string };

export type ParsedHtml = {
  lang: string | null;
  title: string | null;
  metaDescription: string | null;
  metaRobots: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogSiteName: string | null;
  h1: string[];
  h2: string[];
  text: string;
  wordCount: number;
  links: LinkInfo[];
  telLinks: string[];
  mailtoLinks: string[];
  formCount: number;
  jsonLd: JsonLdBlock[];
};

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", copy: "©",
  reg: "®", trade: "™", middot: "·", bull: "•", times: "×",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      if (!Number.isFinite(code) || code < 1 || code > 0x10ffff) return " ";
      try {
        return String.fromCodePoint(code);
      } catch {
        return " ";
      }
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function squash(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function stripTags(s: string): string {
  return squash(decodeEntities(s.replace(/<[^>]*>?/g, " ")));
}

function parseAttrs(tagBody: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tagBody))) {
    const k = m[1].toLowerCase();
    if (!(k in out)) out[k] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

/** Remove whole elements, tolerating missing closing tags (drops to end of document). */
function removeElements(html: string, names: string[]): string {
  let out = html;
  for (const n of names) {
    out = out.replace(new RegExp(`<${n}\\b[^>]*>[\\s\\S]*?(?:</${n}\\s*>|$)`, "gi"), " ");
  }
  return out;
}

export function sameHostKey(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

export function parseHtml(htmlIn: string, baseUrl: string): ParsedHtml {
  const html = typeof htmlIn === "string" ? htmlIn : "";
  let base: URL | null = null;
  try {
    base = new URL(baseUrl);
  } catch {
    base = null;
  }

  // JSON-LD first (before scripts are removed).
  const jsonLd: JsonLdBlock[] = [];
  const ldRe = /<script\b([^>]*)>([\s\S]*?)(?:<\/script\s*>|$)/gi;
  let lm: RegExpExecArray | null;
  while ((lm = ldRe.exec(html))) {
    const attrs = parseAttrs(lm[1]);
    if ((attrs.type ?? "").toLowerCase().split(";")[0].trim() !== "application/ld+json") continue;
    const raw = lm[2].trim();
    try {
      jsonLd.push({ raw, parsed: JSON.parse(raw) });
    } catch (e) {
      jsonLd.push({ raw, parsed: null, error: e instanceof Error ? e.message.slice(0, 160) : "parse error" });
    }
    if (ldRe.lastIndex === lm.index) ldRe.lastIndex++;
  }

  const noComments = html.replace(/<!--[\s\S]*?(?:-->|$)/g, " ");
  const cleaned = removeElements(noComments, ["script", "style", "noscript", "template", "svg"]);

  const htmlTag = /<html\b([^>]*)>/i.exec(cleaned);
  const lang = htmlTag ? parseAttrs(htmlTag[1]).lang?.trim() || null : null;

  const titleM = /<title\b[^>]*>([\s\S]*?)(?:<\/title\s*>|$)/i.exec(cleaned);
  const title = titleM ? stripTags(titleM[1]) || null : null;

  const meta: Record<string, string> = {};
  const metaRe = /<meta\b([^>]*)>/gi;
  let mm: RegExpExecArray | null;
  while ((mm = metaRe.exec(cleaned))) {
    const a = parseAttrs(mm[1]);
    const key = (a.name ?? a.property ?? "").toLowerCase();
    if (key && a.content !== undefined && !(key in meta)) meta[key] = squash(a.content);
  }

  let canonical: string | null = null;
  const linkRe = /<link\b([^>]*)>/gi;
  let km: RegExpExecArray | null;
  while ((km = linkRe.exec(cleaned))) {
    const a = parseAttrs(km[1]);
    if ((a.rel ?? "").toLowerCase().split(/\s+/).includes("canonical") && a.href) {
      try {
        canonical = new URL(a.href, base ?? undefined).toString();
      } catch {
        canonical = a.href;
      }
      break;
    }
  }

  const heads = (tag: string) => {
    const out: string[] = [];
    const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)(?:</${tag}\\s*>|(?=<(?:h[1-6]|p|div|section|ul|ol|form|table|header|footer|nav|main|article)\\b)|$)`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(cleaned))) {
      const t = stripTags(m[1]);
      if (t) out.push(t.slice(0, 300));
    }
    return out;
  };

  const links: LinkInfo[] = [];
  const telLinks: string[] = [];
  const mailtoLinks: string[] = [];
  const aRe = /<a\b([^>]*)>([\s\S]*?)(?:<\/a\s*>|(?=<a\b)|$)/gi;
  let am: RegExpExecArray | null;
  while ((am = aRe.exec(cleaned))) {
    const a = parseAttrs(am[1]);
    const href = (a.href ?? "").trim();
    if (!href || href.startsWith("#") || /^javascript:/i.test(href)) continue;
    const text = stripTags(am[2]).slice(0, 200);
    if (/^tel:/i.test(href)) {
      let t = href.slice(4);
      try {
        t = decodeURIComponent(t);
      } catch {
        /* keep raw */
      }
      telLinks.push(t.trim());
      continue;
    }
    if (/^mailto:/i.test(href)) {
      mailtoLinks.push(href.slice(7).split("?")[0].trim());
      continue;
    }
    try {
      const u = new URL(href, base ?? undefined);
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      u.hash = "";
      const internal = base ? sameHostKey(u.hostname) === sameHostKey(base.hostname) : false;
      links.push({ href: u.toString(), text, internal });
    } catch {
      /* skip unparseable href */
    }
  }

  const formCount = (cleaned.match(/<form\b/gi) ?? []).length;

  const bodyM = /<body\b[^>]*>([\s\S]*)/i.exec(cleaned);
  const text = stripTags(bodyM ? bodyM[1] : cleaned.replace(/<head\b[\s\S]*?(?:<\/head\s*>|$)/i, " "));
  const wordCount = text ? text.split(/\s+/).length : 0;

  return {
    lang,
    title,
    metaDescription: meta["description"] || null,
    metaRobots: meta["robots"] || meta["googlebot"] || null,
    canonical,
    ogTitle: meta["og:title"] || null,
    ogSiteName: meta["og:site_name"] || null,
    h1: heads("h1"),
    h2: heads("h2"),
    text,
    wordCount,
    links,
    telLinks,
    mailtoLinks,
    formCount,
    jsonLd,
  };
}

/** Flatten JSON-LD blocks (arrays and @graph) into individual typed nodes. */
export function jsonLdNodes(blocks: JsonLdBlock[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const visit = (v: unknown, depth: number) => {
    if (depth > 4 || !v || typeof v !== "object") return;
    if (Array.isArray(v)) {
      v.forEach((x) => visit(x, depth + 1));
      return;
    }
    const o = v as Record<string, unknown>;
    if (o["@type"]) out.push(o);
    if (Array.isArray(o["@graph"])) visit(o["@graph"], depth + 1);
  };
  blocks.forEach((b) => visit(b.parsed, 0));
  return out;
}

export function nodeTypes(node: Record<string, unknown>): string[] {
  const t = node["@type"];
  return (Array.isArray(t) ? t : [t]).filter((x): x is string => typeof x === "string");
}
