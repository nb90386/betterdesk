import type { ReactNode } from "react";
import type { Qualification, Stage } from "@/lib/domain/types";
import { STAGE_LABEL } from "@/lib/domain/types";
import { Icon } from "./icons";

export function PageHeader({ title, lede, actions }: { title: string; lede?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">{title}</h1>
        {lede ? <p className="mt-1.5 max-w-[68ch] text-[0.9375rem] text-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "secondary" | "quiet" | "danger"; size?: "sm" | "md" };
export function Btn({ tone = "secondary", size = "md", className = "", ...p }: BtnProps) {
  const t = {
    primary: "bg-ink text-stone hover:bg-ink-2 disabled:bg-ink/40",
    secondary: "border border-rule-strong bg-surface text-ink hover:border-ink disabled:text-muted",
    quiet: "text-ink hover:bg-stone-2 disabled:text-muted",
    danger: "border border-danger/40 bg-surface text-danger hover:border-danger",
  }[tone];
  const s = size === "sm" ? "min-h-8 px-2.5 text-[0.8125rem]" : "min-h-10 px-3.5 text-[0.875rem]";
  return <button type="button" className={`press inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] font-medium ${s} ${t} ${className}`} {...p} />;
}

/** Paper panel for working content; tone="board" sets it as a graphite directory board (the product's own surface). */
export function Panel({ title, action, children, className = "", tone = "paper", pad = false }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; tone?: "paper" | "board"; pad?: boolean }) {
  return (
    <section className={`rounded-[var(--radius-md)] ${tone === "board" ? "on-graphite board" : "border border-rule bg-surface"} ${className}`}>
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
          <h2 className="text-[0.9375rem] font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {pad ? <div className="p-4">{children}</div> : children}
    </section>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-[0.9375rem] font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-[44ch] text-[0.875rem] text-muted">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Stage as text with a position marker, not a colored pill. */
export function StageMark({ stage }: { stage: Stage }) {
  const order = ["new", "qualified", "outreach-prepared", "contacted", "in-conversation", "walkthrough-scheduled", "proposal", "won", "lost"] as const;
  const i = order.indexOf(stage);
  return (
    <span className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-2">
      <span aria-hidden="true" className="flex gap-[2px]">
        {order.slice(0, 7).map((s, j) => (
          <span key={s} className={`h-2.5 w-[3px] rounded-[1px] ${stage === "lost" ? "bg-rule-strong" : j <= i ? "bg-ink" : "bg-rule"}`} />
        ))}
      </span>
      {STAGE_LABEL[stage]}
    </span>
  );
}

export function TierMark({ q }: { q: Qualification | undefined }) {
  if (!q) return <span className="text-[0.8125rem] text-muted">Not evaluated</span>;
  const label = { strong: "Strong fit", possible: "Worth checking", weak: "Weak fit", excluded: "Excluded" }[q.tier];
  const tone = { strong: "text-ink", possible: "text-ink-2", weak: "text-muted", excluded: "text-muted" }[q.tier];
  return (
    <span className={`inline-flex items-baseline gap-1.5 text-[0.8125rem] font-medium ${tone}`}>
      {label}
      {q.tier !== "excluded" ? <span className="tabular-nums text-[0.75rem] text-muted">{q.score}</span> : null}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "attention" | "danger"; children: ReactNode }) {
  const t = { info: "border-rule bg-stone-2 text-ink-2", attention: "border-lamp-ink/30 bg-lamp-wash text-lamp-ink", danger: "border-danger/30 bg-danger-wash text-danger" }[tone];
  return (
    <div role={tone === "danger" ? "alert" : undefined} className={`flex gap-2.5 rounded-[var(--radius-md)] border px-3.5 py-2.5 text-[0.875rem] ${t}`}>
      <Icon name={tone === "info" ? "check" : "alert"} className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export const fmtTime = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtSlot = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });
export function ago(iso: string) {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}
