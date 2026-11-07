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

type BotDef = { bot: string; token: string; purpose: string; blockedNote: string };

export const BOTS: BotDef[] = [
  {
    bot: "Googlebot",
    token: "googlebot",
    purpose: "Google's Search crawler.",
    blockedNote: "Blocking Googlebot affects Google Search, including eligibility for AI Overviews and AI Mode, which draw on pages Google can crawl and index.",
  },
  {
    bot: "Bingbot",
    token: "bingbot",
    purpose: "Bing's Search crawler.",
    blockedNote: "Blocking Bingbot affects Bing Search and products that rely on Bing's index.",
  },
  {
    bot: "OAI-SearchBot",
    token: "oai-searchbot",
    purpose: "OpenAI's crawler used for ChatGPT search results.",
    blockedNote: "Blocking OAI-SearchBot can keep your pages out of ChatGPT search results. Whether a given page would appear is still not something we can observe.",
  },
  {
    bot: "GPTBot",
    token: "gptbot",
    purpose: "OpenAI's training crawler.",
    blockedNote: "GPTBot is the training crawler. Blocking it is a content-use choice and does not remove you from ChatGPT search, which uses OAI-SearchBot.",
  },
  {
    bot: "ChatGPT-User",
    token: "chatgpt-user",
    purpose: "Fetches pages when a ChatGPT user asks for them directly.",
    blockedNote: "Blocking ChatGPT-User can stop ChatGPT from opening your page when a user asks it to.",
  },
  {
    bot: "PerplexityBot",
    token: "perplexitybot",
    purpose: "Perplexity's crawler for its search index.",
    blockedNote: "Blocking PerplexityBot can keep pages out of Perplexity's search index.",
  },
  {
    bot: "ClaudeBot",
    token: "claudebot",
    purpose: "Anthropic's crawler for collecting public web content.",
    blockedNote: "Blocking ClaudeBot is a content-use choice by the site owner.",
  },
  {
    bot: "Google-Extended",
    token: "google-extended",
    purpose: "A control token for whether Google may use your content for Gemini training and grounding.",
    blockedNote: "Google-Extended is a control token, not a Search crawler. Blocking it does not affect Google Search inclusion.",
  },
  {
    bot: "Applebot",
    token: "applebot",
    purpose: "Apple's crawler used for Siri and Spotlight suggestions.",
    blockedNote: "Blocking Applebot can keep pages out of Apple search features.",
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
        purpose: b.purpose,
        status: "unknown" as const,
        explanation: `We couldn't read robots.txt (${robotsStatus === null ? "no response" : "HTTP " + robotsStatus}), so access for ${b.bot} is unknown. Crawlers may treat a persistently failing robots.txt cautiously.`,
      };
    }
    if (!parsed) {
      return { bot: b.bot, purpose: b.purpose, status: "allowed" as const, explanation: "No robots.txt file was found, which means crawlers are allowed by default." };
    }
    const results = testPaths.map((p) => ({ p, ...isAllowed(parsed, b.token, p) }));
    const blockedCount = results.filter((r) => !r.allowed).length;
    const rootRule = results[0];
    if (blockedCount === 0) {
      return { bot: b.bot, purpose: b.purpose, status: "allowed" as const, explanation: `${b.bot} is allowed on the pages we checked. ${b.purpose}${b.bot === "Google-Extended" || b.bot === "GPTBot" ? " " + b.blockedNote : ""}` };
    }
    const first = results.find((r) => !r.allowed)!;
    if (blockedCount === results.length) {
      return {
        bot: b.bot,
        purpose: b.purpose,
        status: "blocked" as const,
        matchedRule: rootRule.matchedRule ?? first.matchedRule,
        explanation: `${b.bot} is blocked from the pages we checked. ${b.blockedNote}`,
      };
    }
    return {
      bot: b.bot,
      purpose: b.purpose,
      status: "partly" as const,
      matchedRule: first.matchedRule,
      explanation: `${b.bot} is blocked from some pages we checked (for example ${first.p}). ${b.blockedNote}`,
    };
  });
}
