import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "press inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] text-[1rem] font-[550] tracking-[-0.01em] whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Solid ink is certainty; on the petrol act it inverts through the tone-dark token remap.
  primary: "px-5 bg-ink text-mineral shadow-[0_1px_0_rgb(255_255_255/0.14)_inset,0_6px_14px_-8px_rgb(16_18_20/0.6)] hover:bg-ink-2 [.tone-dark_&]:text-petrol",
  secondary: "px-5 border border-rule-strong bg-transparent text-ink hover:border-ink",
  quiet: "px-0 text-ink underline decoration-rule-strong decoration-1 underline-offset-[0.3em] hover:decoration-signal min-h-11",
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
