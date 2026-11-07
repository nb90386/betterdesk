/**
 * Date formatting that renders identically on the server (Node ICU) and in every browser engine.
 * `toLocaleString` output differs between ICU versions (e.g. "Nov 2, 9:00 AM" vs "Nov 2 at 9:00 AM"),
 * which breaks hydration; this assembles the string from parts instead.
 */
const parts = (iso: string, timeZone: string) =>
  Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZone })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

/** "Mon, Nov 2, 9:00 AM" in the sample company's time zone. */
export function fmtWhen(iso: string, timeZone = "America/Denver") {
  const p = parts(iso, timeZone);
  return `${p.weekday}, ${p.month} ${p.day}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
}
