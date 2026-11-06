import type { ReactNode } from "react";

export type MarkTone = "signal" | "ink" | "handled" | "light";

/**
 * The through-line, in miniature. Marks each section's place in the story:
 * frayed vermilion while the inquiry is unanswered, steady ink while it's being handled,
 * desk-green once it's resolved.
 */
export function ThreadMark({ tone, className = "" }: { tone: MarkTone; className?: string }) {
  const stroke =
    tone === "signal" ? "var(--color-signal)" : tone === "handled" ? "var(--color-handled)" : tone === "light" ? "var(--color-night-muted)" : "var(--color-ink)";
  return (
    <svg viewBox="0 0 72 12" className={`h-3 w-[72px] overflow-visible ${className}`} aria-hidden="true">
      {tone === "signal" ? (
        <path d="M1 6 C 5 0, 8 12, 13 6 S 20 1, 24 6 S 31 10, 35 6 L 62 6" fill="none" stroke={stroke} strokeWidth="1.4" strokeDasharray="1.6 2.6" strokeLinecap="round" />
      ) : (
        <path d="M1 6 H 62" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      )}
      <circle
        cx="66"
        cy="6"
        r="3.6"
        fill={tone === "handled" ? stroke : "var(--mark-fill, var(--color-paper))"}
        stroke={stroke}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow flex items-center gap-3 ${className}`}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  mark,
  title,
  children,
  className = "",
  id,
}: {
  eyebrow?: string;
  mark?: MarkTone;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`reveal max-w-3xl ${className}`}>
      {mark ? <ThreadMark tone={mark} /> : null}
      {eyebrow ? <Eyebrow className={mark ? "mt-4" : ""}>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className={`display text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] text-ink ${mark || eyebrow ? "mt-4" : ""}`}>
        {title}
      </h2>
      {children ? <div className="lede mt-5">{children}</div> : null}
    </div>
  );
}
