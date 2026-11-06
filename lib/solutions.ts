export type Solution = {
  slug: "home-services" | "beauty-wellness";
  name: string;
  title: string;
  titleEm: string;
  lede: string;
  who: string[];
  pains: { k: string; v: string }[];
  flow: { k: string; v: string }[];
  rules: string[];
  scenarioId: string;
  faq: { q: string; a: string }[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "home-services",
    name: "Home services",
    title: "Your techs are on jobs.",
    titleEm: "The next job is calling.",
    lede: "For plumbing, HVAC, electrical, roofing and other trades. BetterDesk texts back the calls you miss on a job, sorts emergencies from routine work, routes the urgent ones and books the rest.",
    who: ["Plumbing", "HVAC", "Electrical", "Roofing", "Remodeling", "Handyman", "Pest control", "Garage doors"],
    pains: [
      { k: "Calls during jobs", v: "Hands full, phone buzzing, and the caller tries the next company before you can call back." },
      { k: "Emergencies mixed with routine", v: "A gas smell and a dripping faucet look the same in a missed-call log." },
      { k: "Estimates that go cold", v: "Quote requests wait until evening, and by then they've had three other bids." },
    ],
    flow: [
      { k: "Text back right away", v: "The caller gets a text in your company's name, usually while they're still looking at their phone." },
      { k: "Ask your triage questions", v: "Is water pooling? Is the system blowing warm? What's the zip? You write the questions." },
      { k: "Route by your rules", v: "Emergencies page your on-call tech. Out-of-area requests get a polite no. Routine work moves on." },
      { k: "Offer real windows", v: "Arrival windows from your connected calendar, like 8–10 or 1–3, so nobody gets double-booked." },
      { k: "Confirm and remind", v: "A confirmation now, a reminder before the visit, and a nudge if an estimate goes quiet." },
    ],
    rules: ["Gas smell → safety message and page on-call immediately", "Water pooling → call on-call tech", "Outside 78701–78759 → politely decline", "Install quotes → book a free estimate visit, owner approves"],
    scenarioId: "missed-call",
    faq: [
      { q: "Can it dispatch my on-call tech?", a: "It can alert the person you name for urgent conversations, based on rules you set, with the conversation attached. It doesn't replace your dispatch software; ask us how it would fit with yours." },
      { q: "Will it quote prices?", a: "Only the prices you approve, like a service-call fee or a standard range. Anything that needs eyes on the job gets an estimate visit instead." },
      { q: "Does it work with field-service software?", a: "Some booking and field-service tools can be connected, and custom integrations are part of the Scale plan. Tell us what you use and we'll tell you honestly what connects before you sign up." },
    ],
  },
  {
    slug: "beauty-wellness",
    name: "Beauty & wellness",
    title: "Booked between clients,",
    titleEm: "even after close.",
    lede: "For salons, barbers, spas, nail and lash studios, massage and fitness studios. BetterDesk answers texts and DMs with your availability, services and prices, books into your booking tool where it's connected, and sends reminders.",
    who: ["Hair salons", "Barbers", "Day spas", "Nail studios", "Lash & brow", "Massage", "Fitness studios"],
    pains: [
      { k: "Messages pile up mid-service", v: "Nobody can answer a DM with foils in. By the break there are twelve." },
      { k: "Evening requests", v: "People decide to book at 9 PM. If you answer at noon tomorrow, they've booked elsewhere." },
      { k: "No-shows and gaps", v: "A forgotten appointment leaves an empty chair you can't fill at short notice." },
    ],
    flow: [
      { k: "Answer from your menu", v: "Services, durations, starting prices and who does what, straight from what you set up." },
            { k: "Book the slot", v: "Where your booking tool is connected, it offers real openings. Otherwise it collects the request for your front desk." },
      { k: "Remind and rebook", v: "A reminder the day before with an easy reschedule option, so a conflict becomes a moved appointment, not a gap." },
      { k: "Ask for the review", v: "On Growth and Scale, a review request after the visit, at a sensible time." },
    ],
    rules: ["New color clients → patch test policy before booking", "Price questions → share 'starts at' prices only", "Complaints → straight to the owner", "Same-day requests → check with front desk"],
    scenarioId: "after-hours-text",
    faq: [
      { q: "Does it work with my salon booking software?", a: "Some booking tools can be connected so BetterDesk sees real openings. If yours can't be, BetterDesk collects the request and your front desk confirms. We'll tell you which applies before you sign up." },
      { q: "Can it handle Instagram DMs?", a: "Yes, Instagram DMs are included on the Growth and Scale plans, alongside Google Business messages and email." },
      { q: "What about deposits and cancellation fees?", a: "BetterDesk can explain the policies you give it. Ask us on the call about collecting deposits with your current tools." },
    ],
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
