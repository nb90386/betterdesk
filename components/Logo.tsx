/**
 * BetterDesk mark: a wall and an open door's swing, the symbol every walkthrough floor plan uses,
 * set so it reads as a lowercase b. The gap between wall and swing is the opening.
 * Geometry (32 grid): wall 5×26 at x=6; swing is a quarter disc r=15.5 hinged at (13.5, 29).
 * Trademark clearance has NOT been performed.
 */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect x="6" y="3" width="5" height="26" rx="1.2" />
      <path d="M13.5 29V13.5A15.5 15.5 0 0 1 29 29z" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.42em] ${className}`}>
      <Mark className="h-[1.2em] w-[1.2em] -translate-y-[0.04em]" />
      <span className="text-[1.06em] font-[620] tracking-[-0.032em]">BetterDesk</span>
    </span>
  );
}
