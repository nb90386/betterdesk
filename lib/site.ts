export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://betterdesk.ai").replace(/\/$/, "");
export const CONTACT_EMAIL = "hello@betterdesk.ai";

export const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Walkthrough" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "Platform" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/demo", label: "Sample walkthrough" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roi", label: "ROI calculator" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/home-services", label: "Home services" },
      { href: "/solutions/beauty-wellness", label: "Beauty & wellness" },
      { href: "/solutions", label: "All solutions" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Book a demo" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export type PlanId = "starter" | "growth" | "scale";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  blurb: string;
  bestFor: string;
  cta: string;
  featured?: boolean;
  includes: string[];
};

/** Public pricing, preserved exactly from betterdesk.ai on 2026-11-06. */
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 149,
    blurb: "For solo operators and single-location service businesses plugging the leaks.",
    bestFor: "1 location, under 25 leads a week",
    cta: "Get started",
    includes: [
      "AI replies on calls, SMS, and web forms",
      "Missed-call recovery",
      "Appointment booking",
      "Basic follow-up sequences",
      "Unified inbox",
      "Onboarding included",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    blurb: "For businesses that want recovery, booking, follow-up, and analytics working together.",
    bestFor: "1–3 locations, 25–100 leads a week",
    cta: "Book a demo",
    featured: true,
    includes: [
      "Everything in Starter",
      "Instagram DMs, Google Business, email",
      "Advanced multi-step follow-up",
      "Review requests",
      "Lead scoring and owner alerts",
      "Plain-English analytics",
      "Priority human support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 599,
    blurb: "For multi-location operators, franchises, and high-volume teams that need deeper integrations.",
    bestFor: "3+ locations, 100+ leads a week",
    cta: "Talk to us",
    includes: [
      "Everything in Growth",
      "Multi-location routing",
      "Custom CRM and booking integrations",
      "Custom voice and brand training",
      "Dedicated success manager",
      "SLA and premium support",
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
