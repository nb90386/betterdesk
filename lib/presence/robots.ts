// robots.txt parsing and bot-access reporting. Pure.

import type { BotAccess } from "./types.ts";

export const PRESENCE_UA = "BetterDeskPresenceAudit/0.1 (+https://betterdesk.ai/presence)";
export const PRESENCE_UA_TOKEN = "betterdeskpresenceaudit";

export type RobotsRule = { allow: boolean; pattern: string };
export type RobotsGroup = { agents: string[]; rules: RobotsRule[] };
export type ParsedRobots = { groups: RobotsGroup[]; sitemaps: string[] };

export function parseRobots(body: string): ParsedRobots {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;
  const lines = body.replace(/^﻿/, "").split(/\r\n|\r|\n/);
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === "sitemap") {
      if (value) sitemaps.push(value);
    } else if (key === "allow" || key === "disallow") {
      if (!current) continue;
      if (value === "") continue; // empty Disallow = allow all; empty Allow = no-op
      current.rules.push({ allow: key === "allow", pattern: value });
    }
  }
  return { groups, sitemaps };
}

function patternToRegExp(pattern: string): RegExp {
  let anchored = false;
  let p = pattern;
  if (p.endsWith("$")) {
    anchored = true;
    p = p.slice(0, -1);
  }
  const src = p.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp("^" + src + (anchored ? "$" : ""));
}

/** Specificity of a pattern = its length (RFC 9309: longest match wins). */
function ruleLength(pattern: string): number {
  return pattern.length;
}

/** Pick the rules that apply to a user-agent token: the most specific matching group(s), else "*". */
function rulesFor(parsed: ParsedRobots, uaToken: string): RobotsRule[] {
  const token = uaToken.toLowerCase();
  let bestLen = -1;
  let rules: RobotsRule[] = [];
  for (const g of parsed.groups) {
    for (const a of g.agents) {
      if (a === "*") continue;
      if (token.includes(a) && a.length >= bestLen) {
        if (a.length > bestLen) rules = [];
        bestLen = a.length;
        rules = rules.concat(g.rules);
      }
    }
  }
  if (bestLen >= 0) return rules;
  // fall back to "*" groups (merged)
  return parsed.groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules);
}

export function isAllowed(parsed: ParsedRobots, uaToken: string, pathWithQuery: string): { allowed: boolean; matchedRule?: string } {
  const path = pathWithQuery || "/";
  let best: RobotsRule | null = null;
  for (const r of rulesFor(parsed, uaToken)) {
    if (!patternToRegExp(r.pattern).test(path)) continue;
    if (!best) best = r;
    else {
      const a = ruleLength(r.pattern);
      const b = ruleLength(best.pattern);
      if (a > b || (a === b && r.allow && !best.allow)) best = r;
    }
  }
  if (!best) return { allowed: true };
  return { allowed: best.allow, matchedRule: `${best.allow ? "Allow" : "Disallow"}: ${best.pattern}` };
}

type BotDef = { bot: string; token: string; purpose: string; blockedNote: string; kind: "search" | "training" | "user" };

export const BOTS: BotDef[] = [
  {
    bot: "Googlebot",
    kind: "search",
    token: "googlebot",
    purpose: "Google's Search crawler.",
    blockedNote: "Blocking Googlebot affects Google Search, including eligibility for AI Overviews and AI Mode, which draw on pages Google can crawl and index.",
  },
  {
    bot: "Bingbot",
    kind: "search",
    token: "bingbot",
    purpose: "Bing's Search crawler.",
    blockedNote: "Blocking Bingbot affects Bing Search and products that rely on Bing's index.",
  },
  {
    bot: "OAI-SearchBot",
    kind: "search",
    token: "oai-searchbot",
    purpose: "OpenAI's crawler used for ChatGPT search results.",
    blockedNote: "OpenAI says sites that block OAI-SearchBot \"will not be shown in ChatGPT search answers\" (they may still appear as navigational links). We cannot observe whether any page would otherwise appear.",
  },
  {
    bot: "GPTBot",
    kind: "training",
    token: "gptbot",
    purpose: "OpenAI's training crawler.",
    blockedNote: "GPTBot is the training crawler. Blocking it is a training choice, separate from search; ChatGPT search uses OAI-SearchBot.",
  },
  {
    bot: "ChatGPT-User",
    kind: "user",
    token: "chatgpt-user",
    purpose: "Fetches pages when a ChatGPT user asks for them directly.",
    blockedNote: "This fetcher acts when a user asks ChatGPT to open a page. OpenAI notes robots.txt rules may not apply to it, so this is reported but not scored.",
  },
  {
    bot: "PerplexityBot",
    kind: "search",
    token: "perplexitybot",
    purpose: "Perplexity's crawler that surfaces and links sites in its search results (not used for model training).",
    blockedNote: "Perplexity recommends allowing PerplexityBot so a site can be included in its search results.",
  },
  {
    bot: "ClaudeBot",
    kind: "training",
    token: "claudebot",
    purpose: "Anthropic's crawler that collects content which may contribute to model training.",
    blockedNote: "ClaudeBot is a training crawler. Blocking it is a training choice, separate from search.",
  },
  {
    bot: "Google-Extended",
    kind: "training",
    token: "google-extended",
    purpose: "A control token for whether Google may use your content for Gemini training and grounding.",
    blockedNote: "Google-Extended is a control token, not a Search crawler. Google says it does not impact inclusion in Google Search and is not a ranking signal. Blocking it is a training choice.",
  },
  {
    bot: "Claude-SearchBot",
    kind: "search",
    token: "claude-searchbot",
    purpose: "Anthropic's crawler that indexes content to improve search results in Claude.",
    blockedNote: "Anthropic says blocking Claude-SearchBot \"may reduce your site's visibility and accuracy in user search results\".",
  },
  {
    bot: "Applebot-Extended",
    kind: "training",
    token: "applebot-extended",
    purpose: "A control token (it does not crawl) for whether Apple may use your content to train its foundation models.",
    blockedNote: "Apple says pages can still be included in search results. Blocking it is a training choice, separate from search.",
  },
  {
    bot: "Claude-User",
    kind: "user",
    token: "claude-user",
    purpose: "Fetches a page when a Claude user asks for it.",
    blockedNote: "This fetcher acts when a user asks Claude to open a page. It is reported but not scored.",
  },
  {
    bot: "Perplexity-User",
    kind: "user",
    token: "perplexity-user",
    purpose: "Fetches a page when a Perplexity user asks for it.",
    blockedNote: "Perplexity says this fetcher generally ignores robots.txt, so it is reported but not scored.",
  },
  {
    bot: "Applebot",
    kind: "search",
    token: "applebot",
    purpose: "Apple's crawler used for Siri and Spotlight suggestions.",
    blockedNote: "Blocking Applebot means the pages are not crawled for Apple search features (Spotlight, Siri, Safari).",
  },
];

/**
 * Report access per bot. robotsStatus null = no response; 5xx/429 = unknown (Google treats persistent
 * 5xx as full disallow, so this deserves a look); other 4xx = no robots file = everything allowed.
 */
export function botAccessReport(robotsStatus: number | null, body: string | null, paths: string[]): BotAccess[] {
  const testPaths = Array.from(new Set(["/", ...paths]));
  const unknown = robotsStatus === null || robotsStatus >= 500 || robotsStatus === 429 || (robotsStatus === 200 && body === null);
  const noFile = !unknown && robotsStatus !== 200;
  const parsed = !unknown && !noFile && body !== null ? parseRobots(body) : null;
  return BOTS.map((b) => {
    if (unknown) {
      return {
        bot: b.bot,
        kind: b.kind,
        purpose: b.purpose,
        status: "unknown" as const,
        explanation: `We couldn't read robots.txt (${robotsStatus === null ? "no response" : "HTTP " + robotsStatus}), so access for ${b.bot} is unknown. Crawlers may treat a persistently failing robots.txt cautiously.`,
      };
    }
    if (!parsed) {
      return { bot: b.bot, kind: b.kind, purpose: b.purpose, status: "allowed" as const, explanation: "No robots.txt file was found, which means crawlers are allowed by default." };
    }
    const results = testPaths.map((p) => ({ p, ...isAllowed(parsed, b.token, p) }));
    const blockedCount = results.filter((r) => !r.allowed).length;
    const rootRule = results[0];
    if (blockedCount === 0) {
      return { bot: b.bot, kind: b.kind, purpose: b.purpose, status: "allowed" as const, explanation: `${b.bot} is allowed on the pages we checked. ${b.purpose}${b.bot === "Google-Extended" || b.bot === "GPTBot" ? " " + b.blockedNote : ""}` };
    }
    const first = results.find((r) => !r.allowed)!;
    if (blockedCount === results.length) {
      return {
        bot: b.bot,
        kind: b.kind,
        purpose: b.purpose,
        status: "blocked" as const,
        matchedRule: rootRule.matchedRule ?? first.matchedRule,
        explanation: `${b.bot} is blocked from the pages we checked. ${b.blockedNote}`,
      };
    }
    return {
      bot: b.bot,
      kind: b.kind,
      purpose: b.purpose,
      status: "partly" as const,
      matchedRule: first.matchedRule,
      explanation: `${b.bot} is blocked from some pages we checked (for example ${first.p}). ${b.blockedNote}`,
    };
  });
}
