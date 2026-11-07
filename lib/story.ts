/**
 * One illustrative afternoon, told across the whole homepage.
 * Every name, number and time here is a sample. Behaviour shown is limited to what
 * BetterDesk is described as doing in docs/v3/BUSINESS-TRUTH.md:
 * missed-call text-back, replies from owner-approved answers, intake questions,
 * follow-up, open times where a calendar is connected (otherwise handoff), owner inbox.
 */
export const BIZ = "Alder Plumbing";
export const OWNER = "Marco";
export const CALLER = { name: "Jess R.", first: "Jess", phone: "(512) 555-0148" };

export type Line = { from: "customer" | "desk"; text: string; time: string };

export type Station = {
  id: "inquiry" | "reply" | "follow-up" | "times" | "booked";
  label: string;
  /** What happens at this station, in one plain sentence (also the accessible text equivalent). */
  caption: string;
  time: string;
  lines: Line[];
};

export const STATIONS: Station[] = [
  {
    id: "inquiry",
    label: "The call",
    time: "2:14 PM",
    caption: "Jess calls about a leaking water heater. Marco is under a sink and can't pick up.",
    lines: [],
  },
  {
    id: "reply",
    label: "The reply",
    time: "2:14 PM",
    caption: "Within moments, BetterDesk texts Jess back in Alder Plumbing's name.",
    lines: [
      { from: "desk", time: "2:14 PM", text: "Hi, this is Alder Plumbing. Sorry we missed your call, we're out on a job. What's going on? I can help get you on the schedule." },
    ],
  },
  {
    id: "follow-up",
    label: "The follow-up",
    time: "3:20 PM",
    caption: "Jess doesn't answer. An hour later, BetterDesk follows up once, and she replies.",
    lines: [
      { from: "desk", time: "3:20 PM", text: "Just checking in. Still need a hand? Reply here and I'll find you a time." },
      { from: "customer", time: "3:31 PM", text: "Yes sorry! Water heater is leaking in the garage. Slow drip. 78704" },
    ],
  },
  {
    id: "times",
    label: "Open times",
    time: "3:31 PM",
    caption: "It offers two real openings from Marco's connected calendar. Jess picks one.",
    lines: [
      { from: "desk", time: "3:31 PM", text: "Thanks Jess. We can be there Thursday 8–10 AM or 1–3 PM. Which works?" },
      { from: "customer", time: "3:33 PM", text: "8–10 please" },
    ],
  },
  {
    id: "booked",
    label: "Booked",
    time: "3:33 PM",
    caption: "The visit is on the calendar and the whole conversation is waiting in Marco's inbox.",
    lines: [{ from: "desk", time: "3:33 PM", text: "You're booked for Thursday, 8–10 AM. Thanks Jess, see you then." }],
  },
];

export const BOOKING = { day: "Thursday", window: "8:00–10:00 AM", job: "Water heater, slow leak", zip: "78704" };
