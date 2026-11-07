export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://betterdesk.ai").replace(/\/$/, "");
export const CONTACT_EMAIL = "hello@betterdesk.ai";

export const NAV = [
  { href: "/product", label: "Product" },
  { href: "/scout", label: "Scout" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/scout", label: "Scout" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/app", label: "Sample workspace" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "For",
    links: [{ href: "/solutions/commercial-cleaning", label: "Commercial cleaning" }],
  },
  {
    title: "Company",
    links: [
      { href: "/security", label: "Security and data" },
      { href: "/demo", label: "Product tour" },
      { href: "/contact", label: "Request a demo" },
    ],
  },
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
