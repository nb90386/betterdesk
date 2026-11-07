import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light" | "resolve";
const base =
  "press inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none min-h-11 text-[0.95rem]";
const variants: Record<Variant, string> = {
  primary: "px-5 bg-ink text-card hover:bg-ink-2 shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_10px_22px_-12px_rgb(17_18_20/0.7)]",
  secondary: "px-5 border border-rule-strong bg-card/60 text-ink hover:border-ink/40 hover:bg-card",
  ghost: "text-ink underline decoration-rule-strong underline-offset-[6px] hover:decoration-ink px-0 min-h-11",
  light: "px-5 bg-[#f7f6f3] text-[#111214] hover:bg-white shadow-[0_1px_0_#fff_inset,0_12px_28px_-12px_rgb(244_169_71/0.45)]",
  resolve: "px-5 bg-[#111214] text-[#f7f6f3] hover:bg-[#2a2c30] shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_14px_30px_-14px_rgb(154_82_8/0.6)]",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  arrow,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} disabled:opacity-50 ${className}`} {...props} />;
}

export function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
