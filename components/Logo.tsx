/**
 * The BetterDesk "resolve" mark: open signal rings (amber) closing onto a solid D (certainty).
 * Inherits currentColor for the D so it works on night and pearl. `rings` drops to 1 at tiny sizes.
 */
export function LogoMark({ className = "size-7", rings = 2 }: { className?: string; rings?: 1 | 2 }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M7.5 6.5v19" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M7.5 6.5h4.5a9.5 9.5 0 0 1 0 19H7.5" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M24.4 8.2a12.6 12.6 0 0 1 0 15.6" stroke="var(--color-lamp)" strokeWidth="1.9" strokeLinecap="round" />
      {rings === 2 ? <path d="M27.9 5.2a17 17 0 0 1 0 21.6" stroke="var(--color-lamp)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.55" /> : null}
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      <LogoMark className="size-7" />
      <span className="font-display text-[1.14rem] font-[600] tracking-[-0.03em]">BetterDesk</span>
    </span>
  );
}
