/**
 * Sample data for illustrations. Every business, person, number and time here is fictional.
 * Components that render this data must label it as a sample/illustration.
 */

export type Tone = "signal" | "amber" | "handled" | "muted" | "ink";
export type Speaker = "customer" | "desk" | "staff" | "system";
export type Message = { from: Speaker; text: string; meta?: string };

export type JourneyCard =
  | { kind: "booking"; title: string; when: string; detail: string }
  | { kind: "handoff"; title: string; to: string; detail: string }
  | { kind: "recap"; lines: string[] }
  | { kind: "lost"; title: string; detail: string };

export type JourneyStep = {
  time: string;
  label: string;
  note: string;
  status: { tone: Tone; text: string };
  messages?: Message[];
  rule?: string;
  card?: JourneyCard;
};

export type Scenario = {
  id: string;
  name: string;
  business: string;
  industry: string;
  channel: string;
  customer: string;
  with: JourneyStep[];
  without: JourneyStep[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "missed-call",
    name: "Missed call during a job",
    business: "Ridgeline Plumbing & Heating",
    industry: "Home services",
    channel: "Phone → text",
    customer: "Dana M.",
    with: [
      {
        time: "6:42 PM",
        label: "A call rings out",
        note: "Both techs are on jobs and the office has closed. The call goes unanswered.",
        status: { tone: "signal", text: "Missed call" },
        messages: [{ from: "system", text: "Missed call from (512) 555-0148", meta: "6:42 PM" }],
      },
      {
        time: "6:42 PM",
        label: "BetterDesk texts back",
        note: "A text goes out to the caller right away, in your business's name and tone.",
        status: { tone: "amber", text: "Text-back sent" },
        messages: [
          {
            from: "desk",
            text: "Hi, this is Ridgeline Plumbing. Sorry we missed your call. What's going on? I can help get you on the schedule.",
            meta: "6:42 PM",
          },
        ],
      },
      {
        time: "6:45 PM",
        label: "The caller explains",
        note: "Dana replies by text. No voicemail to listen to, no phone tag.",
        status: { tone: "amber", text: "In conversation" },
        messages: [{ from: "customer", text: "Water heater is leaking in the garage. Can someone come tomorrow?", meta: "6:45 PM" }],
      },
      {
        time: "6:45 PM",
        label: "It asks what you'd ask",
        note: "Your intake questions come from your setup: how urgent, and where.",
        status: { tone: "amber", text: "Qualifying" },
        messages: [
          { from: "desk", text: "Sorry to hear that. Is water actively pooling, or is it a slow drip? And what's the zip code?", meta: "6:45 PM" },
          { from: "customer", text: "Slow drip. 78704.", meta: "6:46 PM" },
        ],
      },
      {
        time: "6:46 PM",
        label: "Your rules decide the route",
        note: "Active flooding would page your on-call tech. A slow drip inside your service area gets offered times.",
        status: { tone: "ink", text: "Routine · in service area" },
        rule: "If water is pooling or there's a gas smell → call on-call tech now. Otherwise → offer next available times.",
      },
      {
        time: "6:46 PM",
        label: "It offers real openings",
        note: "Times come from the calendar you connect, so it never offers a slot you don't have.",
        status: { tone: "amber", text: "Offering times" },
        messages: [
          { from: "desk", text: "We can be there tomorrow 8–10 AM or 1–3 PM. Which works better?", meta: "6:46 PM" },
          { from: "customer", text: "8–10 please", meta: "6:47 PM" },
        ],
      },
      {
        time: "6:47 PM",
        label: "The job is booked",
        note: "The booking lands on your calendar with the details your tech needs.",
        status: { tone: "handled", text: "Booked" },
        messages: [{ from: "desk", text: "You're set for tomorrow, 8–10 AM. We'll send a reminder before the visit.", meta: "6:47 PM" }],
        card: { kind: "booking", title: "Water heater · slow leak", when: "Thu · 8:00–10:00 AM", detail: "Dana M. · 78704 · garage unit" },
      },
      {
        time: "6:47 PM",
        label: "You see what happened",
        note: "The whole conversation is in your inbox. It also counts toward your plain-English weekly summary.",
        status: { tone: "handled", text: "In your inbox" },
        card: {
          kind: "recap",
          lines: ["Missed call answered by text", "Job booked for tomorrow 8–10 AM", "Nothing waiting on you"],
        },
      },
    ],
    without: [
      {
        time: "6:42 PM",
        label: "A call rings out",
        note: "Both techs are on jobs and the office has closed. The call goes unanswered.",
        status: { tone: "signal", text: "Missed call" },
        messages: [{ from: "system", text: "Missed call from (512) 555-0148", meta: "6:42 PM" }],
      },
      {
        time: "6:43 PM",
        label: "Voicemail, no message",
        note: "Dana hears the greeting and hangs up without leaving a message.",
        status: { tone: "signal", text: "No voicemail" },
        messages: [{ from: "system", text: "Call ended after greeting · 0:14", meta: "6:43 PM" }],
      },
      {
        time: "6:44 PM",
        label: "They call the next plumber",
        note: "The next company on the list picks up and books her for the morning.",
        status: { tone: "muted", text: "Gone elsewhere" },
      },
      {
        time: "8:20 AM",
        label: "A callback, too late",
        note: "Someone spots the number in the call log and calls back. Dana doesn't pick up.",
        status: { tone: "muted", text: "No answer" },
        messages: [{ from: "system", text: "Outgoing call to (512) 555-0148 · no answer", meta: "8:20 AM" }],
        card: { kind: "lost", title: "Booked with someone else", detail: "You never find out why the call didn't turn into a job." },
      },
    ],
  },
  {
    id: "after-hours-text",
    name: "After-hours text",
    business: "Juniper Hair Studio",
    industry: "Beauty & wellness",
    channel: "Text message",
    customer: "Aisha K.",
    with: [
      {
        time: "9:48 PM",
        label: "A text after closing",
        note: "The salon closed at 7. The request comes in while everyone is home.",
        status: { tone: "signal", text: "New text" },
        messages: [{ from: "customer", text: "Hi! Anything Saturday for a cut and gloss?", meta: "9:48 PM" }],
      },
      {
        time: "9:48 PM",
        label: "It answers from your menu",
        note: "Services, prices and availability come from what you set up and the booking tool you connect.",
        status: { tone: "amber", text: "Answering" },
        messages: [
          {
            from: "desk",
            text: "Hi Aisha! A cut and gloss takes about 2 hours. Saturday we have 10:00 AM with Mei or 1:30 PM with Jordan. Want one of those?",
            meta: "9:48 PM",
          },
        ],
      },
      {
        time: "9:51 PM",
        label: "A question it can answer",
        note: "Prices you've approved can be shared. Anything else waits for a person.",
        status: { tone: "amber", text: "In conversation" },
        messages: [
          { from: "customer", text: "How much is that usually?", meta: "9:51 PM" },
          { from: "desk", text: "Cut and gloss starts at $95 with Mei. Your stylist confirms the final price at the chair.", meta: "9:51 PM" },
        ],
      },
      {
        time: "9:52 PM",
        label: "Booked",
        note: "The appointment goes into your booking tool, and the client gets a confirmation.",
        status: { tone: "handled", text: "Booked" },
        messages: [
          { from: "customer", text: "10 with Mei!", meta: "9:52 PM" },
          { from: "desk", text: "Done. Saturday 10:00 AM with Mei. We'll send a reminder Friday.", meta: "9:52 PM" },
        ],
        card: { kind: "booking", title: "Cut + gloss · 2 hr", when: "Sat · 10:00 AM", detail: "Aisha K. · with Mei" },
      },
      {
        time: "Fri 10:00 AM",
        label: "The reminder goes out",
        note: "A reminder goes out ahead of the appointment, so it doesn't slip anyone's mind.",
        status: { tone: "handled", text: "Reminder sent" },
        messages: [{ from: "desk", text: "Reminder: Saturday 10:00 AM with Mei. Reply here if you need to change it.", meta: "Fri 10:00 AM" }],
      },
      {
        time: "Sat 9:00 AM",
        label: "The owner's view",
        note: "The front desk opens to a booked chair and a clear inbox, not a pile of unread texts.",
        status: { tone: "handled", text: "In your inbox" },
        card: { kind: "recap", lines: ["After-hours text answered", "Saturday 10:00 AM booked with Mei", "Price question suggested for your FAQ, waiting for approval"] },
      },
    ],
    without: [
      {
        time: "9:48 PM",
        label: "A text after closing",
        note: "The salon closed at 7. The request comes in while everyone is home.",
        status: { tone: "signal", text: "New text" },
        messages: [{ from: "customer", text: "Hi! Anything Saturday for a cut and gloss?", meta: "9:48 PM" }],
      },
      {
        time: "Next day 11:30 AM",
        label: "Seen between clients",
        note: "Someone reads it between appointments, 14 hours later.",
        status: { tone: "amber", text: "Waiting 14 hrs" },
        messages: [{ from: "staff", text: "Hi! Sorry for the delay, Saturday is filling up. We have 3:30?", meta: "11:30 AM" }],
      },
      {
        time: "11:42 AM",
        label: "Already booked elsewhere",
        note: "She booked online with another salon last night.",
        status: { tone: "muted", text: "Gone elsewhere" },
        messages: [{ from: "customer", text: "Oh thanks, I found something already!", meta: "11:42 AM" }],
        card: { kind: "lost", title: "Saturday chair stays empty", detail: "The 10:00 AM slot with Mei goes unbooked." },
      },
    ],
  },
  {
    id: "web-form",
    name: "Late-night quote request",
    business: "Brightside Cleaning Co.",
    industry: "Cleaning",
    channel: "Website form",
    customer: "Tom R.",
    with: [
      {
        time: "11:06 PM",
        label: "A form comes in",
        note: "A move-out cleaning request from the website, late at night.",
        status: { tone: "signal", text: "New form" },
        messages: [{ from: "customer", text: "Move-out clean, 2 bed apartment. Need it before the 30th.", meta: "Web form · 11:06 PM" }],
      },
      {
        time: "11:06 PM",
        label: "It asks for the details",
        note: "The questions you'd normally ask on a callback, asked by text instead.",
        status: { tone: "amber", text: "Qualifying" },
        messages: [
          { from: "desk", text: "Thanks Tom! About how many square feet, and is the place empty yet?", meta: "11:06 PM" },
          { from: "customer", text: "About 900. Empty from the 27th. Can you do the oven too?", meta: "11:14 PM" },
        ],
      },
      {
        time: "11:14 PM",
        label: "It knows what it doesn't know",
        note: "Oven cleaning isn't on the price sheet it was given, so it says so and hands off.",
        status: { tone: "ink", text: "Handed to staff" },
        rule: "If a customer asks about a service or price that isn't in your knowledge → don't guess, flag it for the team.",
        messages: [
          {
            from: "desk",
            text: "A standard 2-bed move-out runs $260–$320. I'll check on the oven and have Priya confirm first thing tomorrow.",
            meta: "11:14 PM",
          },
        ],
        card: { kind: "handoff", title: "Add-on question · oven", to: "Priya (office)", detail: "Customer waiting on a yes/no and price." },
      },
      {
        time: "8:05 AM",
        label: "A person picks it up",
        note: "Priya sees the flagged question at the top of her list with the whole conversation.",
        status: { tone: "amber", text: "Staff replied" },
        messages: [{ from: "staff", text: "Morning Tom, yes we can do the oven, +$35. Does the 28th at 9 AM work?", meta: "8:05 AM · Priya" }],
      },
      {
        time: "8:11 AM",
        label: "Booked",
        note: "The job is confirmed and the follow-up reminder is scheduled.",
        status: { tone: "handled", text: "Booked" },
        messages: [{ from: "customer", text: "Perfect, book it.", meta: "8:11 AM" }],
        card: { kind: "booking", title: "Move-out clean + oven", when: "28th · 9:00 AM", detail: "Tom R. · 2 bed · ~900 sq ft" },
      },
    ],
    without: [
      {
        time: "11:06 PM",
        label: "A form comes in",
        note: "A move-out cleaning request from the website, late at night.",
        status: { tone: "signal", text: "New form" },
        messages: [{ from: "customer", text: "Move-out clean, 2 bed apartment. Need it before the 30th.", meta: "Web form · 11:06 PM" }],
      },
      {
        time: "Next day 2:40 PM",
        label: "Buried in the inbox",
        note: "The form lands in a shared email inbox between invoices and supplier emails.",
        status: { tone: "amber", text: "Waiting 15 hrs" },
      },
      {
        time: "2:40 PM",
        label: "A quote, a day late",
        note: "By the time a quote goes out, Tom has three others.",
        status: { tone: "muted", text: "Comparing quotes" },
        messages: [{ from: "staff", text: "Hi Tom, a 2-bed move-out is $260–$320. When would you like us?", meta: "2:40 PM" }],
        card: { kind: "lost", title: "No reply", detail: "Tom went with whoever answered first." },
      },
    ],
  },
];

/* ---------------- Product explorer dataset ---------------- */

export type Channel = "call" | "sms" | "form" | "instagram" | "google" | "email";
export const CHANNELS: { id: Channel; label: string; plan?: "Growth" }[] = [
  { id: "call", label: "Missed calls" },
  { id: "sms", label: "Texts" },
  { id: "form", label: "Web forms" },
  { id: "instagram", label: "Instagram", plan: "Growth" },
  { id: "google", label: "Google Business", plan: "Growth" },
  { id: "email", label: "Email", plan: "Growth" },
];

export type ThreadState = "booked" | "awaiting-approval" | "answered" | "handed-off" | "rescheduled";

export type Thread = {
  id: string;
  customer: string;
  channel: Channel;
  received: string;
  preview: string;
  state: ThreadState;
  messages: Message[];
  knew: string[];
  booking?: { day: number; start: number; end: number; title: string };
  handoff?: { to: string; reason: string };
  draft?: string;
};

export const STATE_LABEL: Record<ThreadState, { text: string; tone: Tone }> = {
  booked: { text: "Booked", tone: "handled" },
  "awaiting-approval": { text: "Draft · needs approval", tone: "amber" },
  answered: { text: "Answered", tone: "ink" },
  "handed-off": { text: "With your team", tone: "signal" },
  rescheduled: { text: "Rescheduled", tone: "handled" },
};

export const EXPLORER_BUSINESS = "Ridgeline Plumbing & Heating";
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export const THREADS: Thread[] = [
  {
    id: "dana",
    customer: "Dana M.",
    channel: "call",
    received: "Wed 6:42 PM",
    preview: "Water heater is leaking in the garage…",
    state: "booked",
    messages: [
      { from: "system", text: "Missed call · (512) 555-0148", meta: "6:42 PM" },
      { from: "desk", text: "Hi, this is Ridgeline Plumbing. Sorry we missed your call. What's going on?", meta: "6:42 PM" },
      { from: "customer", text: "Water heater is leaking in the garage. Can someone come tomorrow?", meta: "6:45 PM" },
      { from: "desk", text: "Is water pooling, or a slow drip? And what's your zip?", meta: "6:45 PM" },
      { from: "customer", text: "Slow drip. 78704.", meta: "6:46 PM" },
      { from: "desk", text: "We can do tomorrow 8–10 AM or 1–3 PM. Which works?", meta: "6:46 PM" },
      { from: "customer", text: "8–10 please", meta: "6:47 PM" },
    ],
    knew: ["Service area: 78701–78759", "Emergency rule: pooling water or gas smell → on-call", "Calendar: Thu 8–10 open"],
    booking: { day: 3, start: 8, end: 10, title: "Water heater leak · Dana M." },
  },
  {
    id: "marcus",
    customer: "Marcus T.",
    channel: "form",
    received: "Wed 9:12 PM",
    preview: "Quote for a tankless water heater install",
    state: "awaiting-approval",
    messages: [
      { from: "customer", text: "Looking for a quote to replace a 50-gal tank with tankless. 3 bath house.", meta: "Web form · 9:12 PM" },
    ],
    draft:
      "Thanks Marcus! Tankless installs need a quick on-site look to size the unit and venting. Our estimate visits are free. Would Thu 1–3 PM or Fri 8–10 AM work?",
    knew: ["Price sheet: install quotes require on-site estimate", "Estimate visits: free, 1 hr", "Mode: assisted for quotes"],
  },
  {
    id: "priya",
    customer: "Priya S.",
    channel: "google",
    received: "Thu 7:30 AM",
    preview: "Do you service Round Rock?",
    state: "answered",
    messages: [
      { from: "customer", text: "Do you service Round Rock?", meta: "Google Business · 7:30 AM" },
      { from: "desk", text: "Not right now. We cover central and south Austin, zip codes 78701–78759. Sorry we can't help this time!", meta: "7:30 AM" },
    ],
    knew: ["Service area: 78701–78759", "Round Rock (78664) is outside the area"],
  },
  {
    id: "leah",
    customer: "Leah K.",
    channel: "instagram",
    received: "Thu 12:10 PM",
    preview: "Can you fix a running toilet this week?",
    state: "booked",
    messages: [
      { from: "customer", text: "Can you fix a running toilet this week?", meta: "Instagram · 12:10 PM" },
      { from: "desk", text: "Yes! Our service call fee is $89, applied to the repair. Friday 1–3 PM is open. Want it?", meta: "12:10 PM" },
      { from: "customer", text: "Yes please", meta: "12:14 PM" },
    ],
    knew: ["Approved price: service call $89", "Calendar: Fri 1–3 open"],
    booking: { day: 4, start: 13, end: 15, title: "Running toilet · Leah K." },
  },
  {
    id: "omar",
    customer: "Omar R.",
    channel: "email",
    received: "Thu 2:02 PM",
    preview: "Smells like gas near the meter",
    state: "handed-off",
    messages: [
      { from: "customer", text: "There's a gas smell near our meter outside. Is that something you handle?", meta: "Email · 2:02 PM" },
      {
        from: "desk",
        text: "Please leave the area and call your gas company's emergency line now. I've alerted our on-call tech, who will call you shortly.",
        meta: "2:02 PM",
      },
    ],
    knew: ["Emergency rule: gas smell → safety message + page on-call", "On-call today: Luis"],
    handoff: { to: "Luis (on-call)", reason: "Emergency rule: gas smell" },
  },
  {
    id: "jalvarez",
    customer: "J. Alvarez",
    channel: "sms",
    received: "Thu 4:25 PM",
    preview: "Following up on that drain quote",
    state: "booked",
    messages: [
      { from: "desk", text: "Hi Jordan, following up on the drain cleaning quote from Monday. Want to get it on the schedule?", meta: "Follow-up · 4:25 PM" },
      { from: "customer", text: "Yes, can you do Friday morning?", meta: "4:31 PM" },
      { from: "desk", text: "Friday 10 AM–12 PM is open. You're booked.", meta: "4:31 PM" },
    ],
    knew: ["Follow-up sequence: quote sent, no reply after 3 days", "Calendar: Fri 10–12 open"],
    booking: { day: 4, start: 10, end: 12, title: "Drain cleaning · J. Alvarez" },
  },
];
