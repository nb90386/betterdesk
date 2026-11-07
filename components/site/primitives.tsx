import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Buttons are 8px rectangles. One ink primary per view; everything else is a text link. */
const base =
  "press inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-[1rem] font-[560] tracking-[-0.01em] whitespace-nowrap";
const variants = {
  primary: "bg-ink text-stone shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_8px_18px_-12px_rgb(21_23_25/0.7)] hover:bg-ink-2 [.on-graphite_&]:bg-graphite-ink [.on-graphite_&]:text-graphite [.on-graphite_&]:hover:bg-white",
  outline: "border border-field text-ink hover:border-ink bg-transparent",
} as const;
type Variant = keyof typeof variants;

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} disabled:opacity-50 ${className}`} {...props} />;
}

/** The secondary action: a plain link with an arrow that travels 2px on hover. */
export function TextLink({ children, className = "", ...props }: ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link className={`group inline-flex min-h-11 items-center gap-1.5 font-[560] text-ink ${className}`} {...props}>
      <span className="link">{children}</span>
      <Arrow className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-4 w-4 shrink-0 ${className}`} fill="none">
      <path d="M2.5 8h10M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Honest status, set as a mark plus words. Never a coloured pill. */
export type Status = "LIVE" | "BETA" | "SANDBOX" | "DEMO" | "BLOCKED" | "PLANNED";
const STATUS_TEXT: Record<Status, string> = {
  LIVE: "Live",
  BETA: "Live beta",
  SANDBOX: "Sandbox",
  DEMO: "Demo, sample data",
  BLOCKED: "Blocked",
  PLANNED: "Planned",
};
export function StatusMark({ status, className = "" }: { status: Status; className?: string }) {
  const mark = status === "LIVE" || status === "BETA" ? "mark-tick" : status === "BLOCKED" ? "mark-x" : "mark-ring";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.8125rem] font-[560] text-muted ${className}`}>
      <StateGlyph kind={mark} />
      {STATUS_TEXT[status]}
    </span>
  );
}

/** Drawn state marks, one stroke weight. */
export function StateGlyph({ kind, className = "" }: { kind: "mark-tick" | "mark-x" | "mark-ring"; className?: string }) {
  if (kind === "mark-ring") return <span aria-hidden="true" className={`mark-ring ${className}`} />;
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-3 w-3 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {kind === "mark-tick" ? <path d="M2.2 6.4l2.4 2.3 5.2-5.4" /> : <path d="M3 3l6 6M9 3l-6 6" />}
    </svg>
  );
}

/** Section heading: the heading carries its own weight; no eyebrow. */
export function SectionHead({ title, lede, id, className = "", as: As = "h2" }: { title: ReactNode; lede?: ReactNode; id?: string; className?: string; as?: "h1" | "h2" }) {
  return (
    <div className={className}>
      <As id={id} className={As === "h1" ? "t-display max-w-[18ch]" : "t-title max-w-[22ch]"}>
        {title}
      </As>
      {lede ? <p className="t-lede mt-5">{lede}</p> : null}
    </div>
  );
}

/** Sample-data caption, used under every fictional object. */
export function SampleNote({ children = "Fictional sample company. Nothing here is a real business or a real result.", className = "" }: { children?: ReactNode; className?: string }) {
  return <p className={`text-[0.8125rem] leading-snug text-muted ${className}`}>{children}</p>;
}
