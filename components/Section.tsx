import type { ReactNode } from "react";

export type MarkTone = "signal" | "ink" | "handled" | "light";

/**
 * The through-line, in miniature. Marks each section's place in the story:
 * frayed vermilion while the inquiry is unanswered, steady ink while it's being handled,
 * desk-green once it's resolved.
 */
/** v2: section marks retired (kicker ban). Kept as a no-op so legacy call sites compile. */
export function ThreadMark(props: { tone: MarkTone; className?: string }) {
  void props;
  return null;
}
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow flex items-center gap-3 ${className}`}>{children}</p>;
}

export function SectionHeading({
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
      <h2 id={id} className="display text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] text-ink">
        {title}
      </h2>
      {children ? <div className="lede mt-5">{children}</div> : null}
    </div>
  );
}
