/** The five-stop through-line diagram. Static SVG + HTML, no JS. */
const STOPS = [
  { k: "Catch", t: "A call rings out, a text lands after hours, a form comes in at 11pm.", tone: "signal" },
  { k: "Reply", t: "The customer hears back right away, in your business's name.", tone: "ink" },
  { k: "Ask", t: "It asks your intake questions: what's wrong, where, how soon.", tone: "ink" },
  { k: "Book or hand off", t: "Routine work gets offered real times. Anything urgent or unusual goes to a person.", tone: "ink" },
  { k: "Follow up", t: "Reminders, a nudge if they go quiet, and a weekly summary for you.", tone: "handled" },
] as const;

export function ThroughLine() {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-signal via-ink-2 to-handled md:hidden" aria-hidden="true" />
      <svg className="absolute inset-x-0 top-[11px] hidden h-6 w-full md:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="tl-g" x1="0" x2="1">
            <stop offset="0" stopColor="var(--color-signal)" />
            <stop offset="0.2" stopColor="var(--color-ink-2)" />
            <stop offset="0.8" stopColor="var(--color-ink-2)" />
            <stop offset="1" stopColor="var(--color-handled)" />
          </linearGradient>
        </defs>
        <path d="M0 4 Q 30 0 50 8 T 100 2 Q 140 1 200 1 L 1000 1" fill="none" stroke="url(#tl-g)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="relative grid gap-8 md:grid-cols-5 md:gap-6">
        {STOPS.map((s, i) => (
          <li key={s.k} className="reveal relative pl-9 md:pl-0" style={{ animationDelay: `${i * 40}ms` }}>
            <span
              className={`absolute left-0 top-0 grid size-[23px] place-items-center rounded-full border-2 bg-paper font-mono text-[0.6875rem] md:relative ${
                s.tone === "signal" ? "border-signal text-signal" : s.tone === "handled" ? "border-handled bg-handled text-card" : "border-ink text-ink"
              }`}
            >
              {i + 1}
            </span>
            <h3 className="mt-0 text-[1.05rem] font-semibold tracking-[-0.01em] text-ink md:mt-5">{s.k}</h3>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-2">{s.t}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
