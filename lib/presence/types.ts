// Presence audit: shared types. Pure, no imports; safe for client components.

export type AuditInputs = {
  url: string;
  businessName: string;
  serviceArea: string;
  serviceCategory: string;
  /** Recorded only. Third-party profile sites are never fetched. */
  profileUrls: string[];
  /** Echoed only. Never fetched. */
  competitors: string[];
  /** User-approved search-intent questions for the content coverage heuristic. */
  questions: string[];
};

export type PresenceErrorCode =
  | "not_authorized"
  | "invalid_input"
  | "blocked_url"
  | "rate_limited"
  | "timeout"
  | "unreachable"
  | "robots_disallowed"
  | "internal";

export class PresenceError extends Error {
  code: PresenceErrorCode;
  constructor(code: PresenceErrorCode, message: string) {
    super(message);
    this.name = "PresenceError";
    this.code = code;
  }
}

export type PageSnapshot = {
  /** URL we asked for. */
  url: string;
  /** URL after redirects. */
  finalUrl: string;
  /** HTTP status, or 0 when no response was obtained. */
  status: number;
  headers: { xRobotsTag?: string | null; contentType?: string | null };
  html: string | null;
  error?: string;
};

export type Snapshot = {
  method: "live" | "sample";
  inputs: AuditInputs;
  fetchedAt: string;
  home: PageSnapshot;
  /** Additional internal pages (not including home). */
  pages: PageSnapshot[];
  /** status null = no response (network error): treated as unknown. */
  robots: { status: number | null; body: string | null; error?: string };
  sitemap: { url: string | null; status: number | null; urls: string[] | null };
  /** Facts about the crawl itself (skipped pages, time budget...). */
  notes?: string[];
};

export type FindingCategory = "access" | "indexing" | "content" | "local" | "structured-data" | "identity" | "contact";
export type Severity = "high" | "medium" | "low" | "info";
export type Confidence = "confirmed" | "likely" | "unknown";
export type Owner = "Website editor" | "Owner" | "Developer";

export type Finding = {
  id: string;
  category: FindingCategory;
  severity: Severity;
  confidence: Confidence;
  title: string;
  whyItMatters: string;
  evidence: { url: string; excerpt?: string };
  fix: string;
  owner: Owner;
  nextCheck: string;
};

export type BotAccess = {
  bot: string;
  /** search = affects inclusion in that product's results; training = owner choice; user = user-triggered fetcher (reported, not scored). */
  kind?: "search" | "training" | "user";
  /** Plain description of what the bot is for. */
  purpose: string;
  status: "allowed" | "blocked" | "partly" | "unknown";
  matchedRule?: string;
  explanation: string;
};

export type PageSummary = {
  url: string;
  finalUrl: string;
  status: number;
  title: string | null;
  wordCount: number;
  role: "home" | "services" | "service-area" | "contact" | "about" | "other";
  note?: string;
};

export type CoverageEntry = {
  question: string;
  matchedPage: string | null;
  matchedTerms: string[];
  missingTerms: string[];
  note: string;
};

export type PresenceReport = {
  domain: string;
  fetchedAt: string;
  method: "live" | "sample";
  business: { name: string; serviceArea: string; serviceCategory: string };
  pagesChecked: PageSummary[];
  botAccess: BotAccess[];
  findings: Finding[];
  passes: Finding[];
  coverage: { label: string; questions: CoverageEntry[] };
  suggestedSchema: {
    jsonLd: Record<string, unknown>;
    note: string;
    sources: Record<string, string>;
    omitted: string[];
  };
  profiles: { url: string; status: "not_verified"; note: string }[];
  competitors: string[];
  summary: { high: number; medium: number; low: number; info: number; passes: number };
  limitations: string[];
};

export type AuditResponse =
  | { ok: true; report: PresenceReport }
  | { ok: false; code: PresenceErrorCode; message: string };
