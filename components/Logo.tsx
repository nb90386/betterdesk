/**
 * BetterDesk mark: a wall and a door's half swing, drawn the way a floor plan shows a doorway,
 * which together read as a capital D (BetterDesk, Desk). The gap between wall and swing is the opening.
 * Geometry (32 grid): wall 4.8×26 at x=5; swing is a half disc r=13 from (12.2,3) to (12.2,29).
 * Trademark clearance has NOT been performed.
 */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect x="5" y="3" width="4.8" height="26" rx="1.4" />
      <path d="M12.2 3h3.3a13 13 0 0 1 0 26h-3.3z" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.42em] ${className}`}>
      <Mark className="h-[1.1em] w-[1.1em] -translate-y-[0.02em]" />
      <span className="font-display text-[1.12em] font-[520] tracking-[-0.018em]">BetterDesk</span>
    </span>
  );
}
