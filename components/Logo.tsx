/** BetterDesk mark: two routes (businesses you find, inquiries that find you) merge into one and land on a node. */
export function Mark({ className = "", mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path d="M3.5 9.5H9c4.2 0 5.2 6.5 9.5 6.5h3.3M3.5 22.5H9c4.2 0 5.2-6.5 9.5-6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="16" r="3.4" fill={mono ? "currentColor" : "var(--color-signal)"} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${className}`}>
      <Mark className="h-[1.35em] w-[1.35em]" />
      <span className="font-display text-[1.08em] font-semibold tracking-[-0.03em]">BetterDesk</span>
    </span>
  );
}
