export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="var(--color-ink)" />
      <path
        d="M22 16v32M22 16h11a8 8 0 0 1 0 16H22M22 32h13a8 8 0 0 1 0 16H22"
        fill="none"
        stroke="var(--color-card)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="47" cy="17" r="3.6" fill="var(--color-signal-glow)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[1.06rem] font-semibold tracking-[-0.02em] text-ink">BetterDesk</span>
    </span>
  );
}
