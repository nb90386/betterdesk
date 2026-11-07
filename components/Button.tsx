import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "press inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-[1rem] font-[550] tracking-[-0.01em] whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Solid ink is certainty; on the graphite act it inverts through the tone-dark token remap.
  primary: "bg-ink text-porcelain shadow-[0_1px_0_rgb(255_255_255/0.14)_inset,0_6px_14px_-8px_rgb(16_18_20/0.6)] hover:bg-ink-2 [.tone-dark_&]:text-graphite",
  secondary: "border border-rule-strong bg-transparent text-ink hover:border-ink",
  quiet: "px-1 text-ink underline decoration-rule-strong decoration-1 underline-offset-[0.3em] hover:decoration-signal min-h-11",
};

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Arrow({ className = "", down = false }: { className?: string; down?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-4 w-4 shrink-0 ${down ? "rotate-90" : ""} ${className}`} fill="none">
      <path d="M2.5 8h10M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
