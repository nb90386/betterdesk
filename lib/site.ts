export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://betterdesk.ai").replace(/\/$/, "");
export const CONTACT_EMAIL = "hello@betterdesk.ai";

export const NAV = [
  { href: "/platform", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/solutions", label: "Who it's for" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "Product" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/demo", label: "See a conversation" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roi", label: "Value calculator" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { href: "/solutions/home-services", label: "Home services" },
      { href: "/solutions/beauty-wellness", label: "Salons and spas" },
      { href: "/solutions", label: "Other service businesses" },
    ],
  },
  {
    title: "Talk to us",
    links: [{ href: "/contact", label: "Request a demo" }],
  },
] as const;

export type PlanId = "starter" | "growth" | "scale";

export type Plan = {
  id: PlanId;
  name: string;
  /** V3 proposed monthly price (preview only, not wired to billing). */
  price: number;
  /** Currently published price, kept so the proposal is never mistaken for the live offer. */
  currentPrice: number;
  blurb: string;
  bestFor: string;
  /** Proposed included usage; see docs/v3/BUSINESS-TRUTH.md for the unit-economics reasoning. */
  includedConversations: number;
  locations: string;
  cta: string;
  featured?: boolean;
  includes: string[];
};

/** Pricing is a PROPOSAL for founder approval. There is no checkout in this site; every plan CTA goes to /contact. */
export const PRICING_IS_PROPOSAL = true;
export const OVERAGE_PROPOSAL = "$0.40 per conversation over the included amount";

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 129,
    currentPrice: 149,
    blurb: "One location that mostly hears from customers by phone, text and your website.",
    bestFor: "1 location, up to about 25 new inquiries a week",
    includedConversations: 150,
    locations: "1 location",
    cta: "Start with Starter",
    includes: [
      "Missed-call text-back",
      "Replies on calls, SMS and web forms",
      "Appointment booking, or handoff to your team",
      "Basic follow-up",
      "Unified inbox",
      "Setup with a person",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 249,
    currentPrice: 299,
    blurb: "Busier shops that also hear from customers on Instagram, Google and email.",
    bestFor: "1–3 locations, about 25–100 inquiries a week",
    includedConversations: 500,
    locations: "Up to 3 locations",
    cta: "Request a demo",
    featured: true,
    includes: [
      "Everything in Starter",
      "Instagram DMs, Google Business, email",
      "Multi-step follow-up",
      "Review requests",
      "Lead scoring and owner alerts",
      "Plain-English weekly summary",
      "Priority human support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 499,
    currentPrice: 599,
    blurb: "Multi-location operators and franchises that need routing and custom integrations.",
    bestFor: "3+ locations, 100+ inquiries a week",
    includedConversations: 1500,
    locations: "Multiple locations",
    cta: "Talk to us",
    includes: [
      "Everything in Growth",
      "Multi-location routing",
      "Custom CRM and booking integrations",
      "Custom voice and brand training",
      "Dedicated success manager",
      "SLA and premium support (terms in contract)",
      "Quarterly business reviews",
    ],
  },
];

export const BUSINESS_TYPES = [
  "Home services (HVAC, plumbing, electrical)",
  "Contractor or remodeler",
  "Cleaning company",
  "Salon, barber, or spa",
  "Wellness or fitness studio",
  "Auto shop",
  "Clinic or practice",
  "Something else",
] as const;
