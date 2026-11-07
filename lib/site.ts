export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://betterdesk.ai").replace(/\/$/, "");
export const CONTACT_EMAIL = "hello@betterdesk.ai";

/** The three lenses over one record. Order follows the customer journey: be found, find, respond. */
export const LENSES = [
  { href: "/presence", name: "Presence", line: "How customers find you in Google, Maps and AI search", status: "Live beta audit" },
  { href: "/scout", name: "Scout", line: "Businesses worth contacting, with the evidence", status: "Demo" },
  { href: "/desk", name: "Desk", line: "Inquiries, replies, walkthroughs and the pipeline", status: "Demo" },
] as const;

export const NAV = [
  { href: "/solutions/commercial-cleaning", label: "For cleaning companies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Guides" },
] as const;

export const PRODUCT_MENU = [
  ...LENSES.map((l) => ({ href: l.href, label: l.name, line: l.line })),
  { href: "/product", label: "How they connect", line: "One record from first contact to signed contract" },
  { href: "/how-it-works", label: "Setup and support", line: "What you provide, what we do, what you get" },
  { href: "/demo", label: "Interactive demo", line: "Run the whole journey on a sample company" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "How it connects" },
      { href: "/presence", label: "Presence" },
      { href: "/scout", label: "Scout" },
      { href: "/desk", label: "Desk" },
      { href: "/demo", label: "Interactive demo" },
      { href: "/app", label: "Sample workspace" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/solutions/commercial-cleaning", label: "For commercial cleaning" },
      { href: "/how-it-works", label: "Setup and support" },
      { href: "/resources", label: "Guides" },
      { href: "/resources/ai-search-for-service-businesses", label: "AI search, plainly" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Request a review" },
      { href: "/security", label: "Security and data" },
    ],
  },
] as const;

/** Public, indexable marketing routes. Tests crawl this list; the sitemap is built from it. */
export const PUBLIC_ROUTES = [
  "/",
  "/product",
  "/presence",
  "/scout",
  "/desk",
  "/solutions/commercial-cleaning",
  "/how-it-works",
  "/demo",
  "/pricing",
  "/resources",
  "/resources/ai-search-for-service-businesses",
  "/contact",
  "/security",
] as const;

export type PlanId = "essential" | "growth" | "team";
export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  blurb: string;
  seats: number;
  prospects: number;
  drafts: number;
  conversations: number;
  onboarding: string;
  support: string;
  featured?: boolean;
  includes: string[];
};

/**
 * PROPOSED early-access pricing (docs/v4/PRICING-AND-UNIT-ECONOMICS.md). Not wired to billing.
 * Usage is hard-capped: Scout pauses at the limit; nothing is billed automatically.
 */
export const PRICING_STATUS = "Proposed early-access pricing. Not yet available to buy.";
export const PLANS: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 99,
    blurb: "For an owner who wants inquiries, customers and the pipeline in one place, plus Scout on a short list.",
    seats: 1,
    prospects: 150,
    drafts: 150,
    conversations: 100,
    onboarding: "Self-serve with guides",
    support: "Email",
    includes: ["Inbox for website inquiries", "Customer records and timeline", "Pipeline from prospect to won", "Scout qualification with evidence", "Introductions you approve"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 249,
    blurb: "For a company actively prospecting new buildings every week and booking walkthroughs.",
    seats: 3,
    prospects: 500,
    drafts: 500,
    conversations: 300,
    onboarding: "One guided setup session",
    support: "Email and chat",
    featured: true,
    includes: ["Everything in Essential", "Scout on larger lists", "Follow-up suggestions", "Walkthrough scheduling", "Shared pipeline for 3 people"],
  },
  {
    id: "team",
    name: "Team",
    price: 499,
    blurb: "For a small sales team with an owner, salespeople and an office coordinator.",
    seats: 10,
    prospects: 1000,
    drafts: 1000,
    conversations: 600,
    onboarding: "Guided import and two sessions",
    support: "Priority, named contact",
    includes: ["Everything in Growth", "Roles and approval rules", "Team view of every rep's pipeline", "Higher Scout and inbox limits"],
  },
];
export const TOP_UPS = ["+250 prospects researched, drafts included: $39", "+250 inbound conversations: $35", "Extra seat: $29 a month"];

export const BUSINESS_TYPES = [
  "Commercial cleaning (owner-led)",
  "Commercial cleaning (with a sales team)",
  "Janitorial franchise",
  "Facility services",
  "Something else",
] as const;
