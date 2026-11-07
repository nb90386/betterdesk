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
      { href: "/contact", label: "Get a free check" },
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

/**
 * PROPOSED early-access offer (docs/reinvention/PRICING.md). Not wired to billing, not for sale yet.
 * Replaces the V4 three-tier proposal ($99 / $249 / $499) with one offer for the commercial cleaning wedge.
 * Usage is hard-capped: work pauses at the limit; nothing is billed automatically.
 */
export const PRICING_STATUS = "Proposed early-access pricing. Not available to buy yet, and no card is ever taken on this site.";
export const OFFER = {
  setup: { name: "Guided setup and visibility review", price: 490, unit: "one time", includes: [
    "A person reviews your website, Google Business Profile and inquiry path",
    "Presence audit with a prioritised fix list and owners",
    "Your service area, target buildings and approval rules set up",
    "Your first prospect list imported, de-duplicated and checked",
    "One 45-minute working session with your team",
  ] },
  workspace: { name: "BetterDesk workspace", price: 249, unit: "per month", includes: [
    "Presence re-check of up to 25 pages every month",
    "Scout research on up to 500 businesses a month, drafts included",
    "Desk inbox for up to 300 conversations a month",
    "Pipeline, customers, tasks and timeline",
    "3 people, email support",
  ] },
  limits: [
    "Hard caps, no overage: when a limit is reached, that work pauses until next month or you choose a top-up.",
    "Top-ups (proposed): 250 more businesses researched for $39; 250 more conversations for $35; extra person $29 a month.",
    "Sending email, calendar sync and Search Console data need connections that aren’t built yet; they’ll be included when they are.",
    "Month to month. No contract.",
  ],
} as const;
