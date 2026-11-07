type Moment = { time: string; where: string; today: string; after: string };

const START = 6; // 6 AM
const SPAN = 18; // to midnight
const OPEN = 8;
const CLOSE = 17; // sample office hours: 8 AM to 5 PM
const TICKS = [6, 9, 12, 15, 18, 21, 24];

const hourOf = (t: string) => {
  const [hm, ap] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) + m / 60;
};
const pct = (h: number) => ((h - START) / SPAN) * 100;
const label = (h: number) => (h === 12 ? "Noon" : h === 24 ? "Midnight" : `${h > 12 ? h - 12 : h} ${h >= 12 ? "PM" : "AM"}`);

/**
 * One day at a service business as a single object: a 6 AM–midnight ribbon with sample office hours,
 * the three moments plotted at their real times, each tethered to its note. Desktop only; mobile reads as a list.
 */
export function DayRibbon({ moments }: { moments: readonly Moment[] }) {
  const xs = moments.map((m) => pct(hourOf(m.time)));
  return (
    <div className="mt-14">
      {/* Ribbon (md+) */}
      <div className="relative hidden md:block" aria-hidden="true">
        <div className="relative h-12 overflow-hidden rounded-[12px] bg-[linear-gradient(90deg,#1b1d21_0%,#1b1d21_55%,#1d1a16_80%,#2a2118_100%)]">
          <div
            className="absolute inset-y-0 bg-white/[0.07]"
            style={{ left: `${pct(OPEN)}%`, width: `${pct(CLOSE) - pct(OPEN)}%` }}
          />
          <p className="absolute top-1/2 -translate-x-full -translate-y-1/2 pr-3 text-[0.74rem] text-night-muted" style={{ left: `${pct(CLOSE)}%` }}>
            Office open (sample hours)
          </p>
          <p className="absolute top-1/2 -translate-y-1/2 pl-3 text-[0.74rem] text-lamp" style={{ left: `${pct(CLOSE)}%` }}>
            After close
          </p>
          {xs.map((x, i) => (
            <span key={i} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%` }}>
              <span className={`block size-3 rounded-full ${i === moments.length - 1 ? "bg-lamp shadow-[0_0_0_4px_rgb(244_169_71/0.18)]" : "bg-[#f7f6f3]"}`} />
            </span>
          ))}
        </div>
        <div className="relative mt-2 h-4 text-[0.72rem] text-night-muted tabular">
          {TICKS.map((h) => (
            <span key={h} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: `${pct(h)}%` }}>
              {label(h)}
            </span>
          ))}
        </div>
        {/* tethers from each moment down to its note column */}
        <svg className="mt-1 block h-14 w-full overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
          {xs.map((x, i) => {
            // land on the left edge of each note (3 columns with 2rem gaps, about 2.7% at desktop widths)
            const target = i * 34.2 + 0.4;
            return (
              <path
                key={i}
                d={`M${x} 0 C ${x} 6, ${target} 4, ${target} 10`}
                fill="none"
                stroke={i === moments.length - 1 ? "rgb(244 169 71 / 0.7)" : "rgb(255 255 255 / 0.22)"}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {moments.map((m, i) => (
          <li key={m.time} className="reveal relative border-l border-white/[0.1] pl-5 md:border-l-0 md:pl-0">
            <p className="font-display text-[2.2rem] leading-none tracking-[-0.03em] text-[#f7f6f3] tabular">{m.time}</p>
            <p className={`mt-2 text-[0.85rem] font-medium ${i === moments.length - 1 ? "text-lamp" : "text-[#d4d6da]"}`}>{m.where}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-night-muted">{m.today}</p>
            <p className="mt-3 border-t border-white/[0.08] pt-3 text-[0.95rem] leading-relaxed text-[#eceae6]">{m.after}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
