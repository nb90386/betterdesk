/** One icon family: 20px grid, 1.5 stroke, round caps. Drawn for BetterDesk; no icon font. */
const P: Record<string, string> = {
  today: "M4 7.5h12M4 4.5h12v11H4zM7.5 2.5v3M12.5 2.5v3M7 11h3",
  scout: "M9 3.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11zM13 13l3.5 3.5M7 9h4M9 7v4",
  opportunities: "M3.5 5.5h13M3.5 10h13M3.5 14.5h8",
  inbox: "M3.5 11.5V5a1.5 1.5 0 0 1 1.5-1.5h10A1.5 1.5 0 0 1 16.5 5v6.5M3.5 11.5h4l1 2h3l1-2h4v3.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z",
  pipeline: "M3.5 4.5h3v11h-3zM8.5 4.5h3v7h-3zM13.5 4.5h3v4h-3z",
  calendar: "M4 6h12v10H4zM4 9h12M7 4v3M13 4v3M7.5 12.5h2",
  customers: "M7.5 9a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM3 16c.5-2.5 2.3-4 4.5-4s4 1.5 4.5 4M13 8.5a2 2 0 1 0 0-4M14.5 12c1.3.4 2.2 1.6 2.5 3.5",
  analytics: "M4 16V9M8.5 16V5M13 16v-4.5M3 16.5h14",
  settings: "M10 7a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4",
  check: "M4.5 10.5l3.5 3.5 7.5-8",
  x: "M5 5l10 10M15 5L5 15",
  arrow: "M4 10h12M11 5l5 5-5 5",
  alert: "M10 3.5l7 12.5H3zM10 8.5v3.5M10 14v.5",
  upload: "M10 13V4M6 8l4-4 4 4M4 13.5v2h12v-2",
  reset: "M4 10a6 6 0 1 0 2-4.5M4 3.5v3h3",
  menu: "M3.5 6h13M3.5 10h13M3.5 14h13",
};
export type IconName = keyof typeof P;
export function Icon({ name, className = "h-5 w-5" }: { name: IconName | string; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d={P[name]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
