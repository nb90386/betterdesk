/** BetterDesk mark: one continuous route forms the "b"; it lands on the vermilion point (the booked time). */
export function Mark({ className = "", mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6.6 1.9V16.4A5.1 5.1 0 1 1 8.09 20.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="6.6" cy="21.5" r="1.7" fill={mono ? "currentColor" : "var(--color-signal)"} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.4em] ${className}`}>
      <Mark className="h-[1.2em] w-[1.2em] -translate-y-[0.04em]" />
      <span className="text-[1.1em] font-semibold tracking-[-0.03em] [font-stretch:94%]">BetterDesk</span>
    </span>
  );
}
