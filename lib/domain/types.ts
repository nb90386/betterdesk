/**
 * BetterDesk V4 domain model. One organization owns accounts (businesses); everything else
 * hangs off an account so a prospect never has to be re-entered to continue the workflow:
 * Account → Contacts, Evidence, Qualification, Opportunity → Drafts, Conversation, Appointments.
 * Every change appends an Event (the audit trail and the customer timeline).
 */

export type Mode = "DEMO" | "SANDBOX" | "LIVE";
export type ISODate = string;

export type SourceKind = "csv-import" | "manual" | "inbound-form" | "referral" | "sample-seed";
/**
 * Where a record came from. `reportedChannel` is ONLY what the person told us ("How did you find us?"),
 * never an inferred attribution. Unknown stays unknown.
 */
export type ReportedChannel = "google-search" | "google-maps" | "ai-assistant" | "bing" | "referral" | "social" | "other" | "not-asked";
export const REPORTED_CHANNEL_LABEL: Record<ReportedChannel, string> = {
  "google-search": "Google search",
  "google-maps": "Google Maps",
  "ai-assistant": "An AI assistant (ChatGPT, Gemini, Copilot…)",
  bing: "Bing",
  referral: "A referral",
  social: "Social media",
  other: "Something else",
  "not-asked": "Not asked",
};
export type Source = { kind: SourceKind; label: string; retrievedAt: ISODate; reportedChannel?: ReportedChannel };

export type Organization = {
  id: string;
  name: string;
  mode: Mode;
  serviceArea: { label: string; zips: string[] };
  services: string[];
  idealCustomer: { categories: string[]; minSqft: number };
  sender: { name: string; title: string; company: string; email: string; postalAddress: string };
  /** Outbound policy. "draft-only" means nothing can be sent, whatever is approved. */
  outbound: { email: "draft-only" | "approved-send"; sms: "disabled"; calls: "disabled" };
  members: { id: string; name: string; role: "owner" | "sales" | "viewer" }[];
};

export type Address = { street: string; city: string; state: string; zip: string };

export type Account = {
  id: string;
  orgId: string;
  name: string;
  domain: string | null;
  address: Address;
  category: string;
  /** Facility size, only when a source states it. Never inferred. */
  sqft: { value: number; source: Source } | null;
  status: "prospect" | "customer" | "excluded";
  source: Source;
  dedupeKey: string;
  createdAt: ISODate;
};

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string | null;
  emailKind: "business" | "personal" | "none";
};

export type Evidence = {
  id: string;
  accountId: string;
  claim: string;
  source: Source;
  /** Untrusted text that looked like instructions is withheld, never shown to drafting. */
  flagged?: "withheld-instructions";
};

export type CriterionResult = "met" | "not-met" | "unknown";
export type Criterion = { id: string; label: string; result: CriterionResult; weight: number; detail: string; evidenceIds: string[] };
export type Qualification = {
  accountId: string;
  score: number;
  /** Share of weight that could be evaluated; low coverage means "needs research", not "bad fit". */
  coverage: number;
  tier: "strong" | "possible" | "weak" | "excluded";
  criteria: Criterion[];
  missing: string[];
  recommendation: string;
  needsHumanReview: boolean;
  ruleVersion: string;
  evaluatedAt: ISODate;
};

export const STAGES = ["new", "qualified", "outreach-prepared", "contacted", "in-conversation", "walkthrough-scheduled", "proposal", "won", "lost"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = {
  new: "New prospect",
  qualified: "Qualified",
  "outreach-prepared": "Outreach prepared",
  contacted: "Contacted",
  "in-conversation": "In conversation",
  "walkthrough-scheduled": "Walkthrough scheduled",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export type Opportunity = {
  id: string;
  accountId: string;
  stage: Stage;
  ownerId: string;
  /** An estimate the user typed; never shown as revenue. */
  estimatedMonthly: number | null;
  nextAction: string;
  origin: "scout" | "inbound" | "manual";
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type DraftApproval = "pending" | "approved" | "rejected";
/** Delivery is separate from approval. In DEMO mode delivery can only ever be "not-sent" or "simulated". */
export type DraftDelivery = "not-sent" | "simulated" | "sent";
export type Draft = {
  id: string;
  opportunityId: string;
  contactId: string;
  subject: string;
  body: string;
  approval: DraftApproval;
  delivery: DraftDelivery;
  approvedBy: string | null;
  approvedAt: ISODate | null;
  edited: boolean;
  generator: string;
  basedOnEvidenceIds: string[];
  createdAt: ISODate;
};

export type Intent = "interested" | "question" | "pricing" | "walkthrough" | "not-interested" | "unsubscribe" | "needs-review";
export type Message = {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  body: string;
  at: ISODate;
  /** True for sample/simulated traffic. Real provider messages would carry a provider id instead. */
  simulated: boolean;
  intent?: Intent;
};
export type Conversation = { id: string; accountId: string; channel: "email" | "web-form"; subject: string; messages: Message[]; handledBy: "scout-draft" | "human" };

export type Appointment = {
  id: string;
  opportunityId: string;
  kind: "walkthrough";
  start: ISODate;
  end: ISODate;
  /** "sample-booked" is a demo slot. "confirmed" would require a calendar provider confirmation. */
  status: "proposed" | "sample-booked" | "confirmed" | "canceled";
};

export type Suppression = { value: string; kind: "email" | "domain"; reason: "unsubscribed" | "do-not-contact" | "bounced"; at: ISODate };

export const RUN_STATES = ["created", "queued", "running", "waiting-approval", "paused", "blocked", "failed", "completed", "canceled"] as const;
export type RunState = (typeof RUN_STATES)[number];

export type RunTask = { id: string; label: string; status: "pending" | "done" | "skipped" | "failed"; detail?: string };
export type ScoutRun = {
  id: string;
  orgId: string;
  actorId: string;
  goal: string;
  scope: { sources: SourceKind[]; serviceAreaOnly: boolean; maxProspects: number; allowedTools: ScoutTool[] };
  state: RunState;
  history: { state: RunState; at: ISODate; note?: string }[];
  tasks: RunTask[];
  accountIds: string[];
  draftIds: string[];
  errors: { at: ISODate; message: string; retryable: boolean }[];
  retries: number;
  createdAt: ISODate;
  completedAt: ISODate | null;
  summary: string | null;
};

/** Tools Scout may use. Sending is deliberately absent: Scout can never send. */
export type ScoutTool = "read-records" | "import-list" | "dedupe" | "qualify" | "draft-outreach" | "classify-reply" | "suggest-times";

export type EventType =
  | "account.imported"
  | "account.duplicate-skipped"
  | "account.excluded"
  | "qualification.evaluated"
  | "evidence.withheld"
  | "draft.created"
  | "draft.edited"
  | "draft.approved"
  | "draft.rejected"
  | "draft.blocked-suppressed"
  | "delivery.simulated"
  | "message.received"
  | "appointment.proposed"
  | "appointment.booked"
  | "opportunity.created"
  | "opportunity.stage-changed"
  | "contact.suppressed"
  | "run.state-changed"
  | "inquiry.received"
  | "presence.audit-recorded"
  | "task.created"
  | "task.completed";

export type Event = {
  id: string;
  orgId: string;
  at: ISODate;
  actor: { kind: "user" | "scout" | "system" | "simulation"; id: string; name: string };
  type: EventType;
  accountId: string | null;
  subjectId: string | null;
  summary: string;
  data?: Record<string, string | number | boolean | null>;
};

/** A to-do that came from somewhere specific (today: a Presence finding). Owned by one person. */
export type Task = {
  id: string;
  orgId: string;
  title: string;
  detail: string;
  ownerId: string;
  status: "open" | "done";
  origin: { kind: "presence-finding"; findingId: string; auditId: string; evidenceUrl: string; severity: "high" | "medium" | "low" | "info" } | { kind: "manual" };
  createdAt: ISODate;
  completedAt: ISODate | null;
};

/** The workspace keeps a summary of each Presence audit it was given; the full report lives with the audit. */
export type PresenceAuditRecord = {
  id: string;
  domain: string;
  method: "live" | "sample";
  fetchedAt: ISODate;
  pagesChecked: number;
  findings: { id: string; title: string; severity: "high" | "medium" | "low" | "info"; category: string; evidenceUrl: string }[];
};

export type Workspace = {
  version: 2;
  org: Organization;
  accounts: Account[];
  contacts: Contact[];
  evidence: Evidence[];
  qualifications: Qualification[];
  opportunities: Opportunity[];
  drafts: Draft[];
  conversations: Conversation[];
  appointments: Appointment[];
  suppressions: Suppression[];
  runs: ScoutRun[];
  events: Event[];
  tasks: Task[];
  presenceAudits: PresenceAuditRecord[];
  /** Demo availability (no calendar connected). */
  sampleSlots: { start: ISODate; end: ISODate }[];
};
