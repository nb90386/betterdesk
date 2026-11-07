import type { ReactNode } from "react";

export type RouteItem = { key: string; title: string; body: ReactNode; side?: ReactNode };

/** Vertical route: hollow nodes on a signal line, the last node filled. Shared by the process pages. */
export function RouteList({ items, numbered = false }: { items: RouteItem[]; numbered?: boolean }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-4 w-px bg-signal" />
      {items.map((s, i) => (
        <li key={s.key} className="relative grid gap-3 border-b border-rule pb-8 pl-10 pt-8 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[1fr_15rem] sm:gap-8">
          <span aria-hidden="true" className={`absolute left-0 h-[15px] w-[15px] rounded-full border-2 border-signal ${i === 0 ? "top-1" : "top-9"} ${i === items.length - 1 ? "bg-signal" : "bg-mineral"}`} />
          <div>
            <h3 className="text-[1.375rem] font-semibold tracking-[-0.02em]">
              {numbered ? <span className="tabular mr-2 text-muted">{i + 1}.</span> : null}
              {s.title}
            </h3>
            <div className="mt-2 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">{s.body}</div>
          </div>
          {s.side ? <div className="text-[0.875rem] leading-snug text-muted sm:pt-1.5">{s.side}</div> : null}
        </li>
      ))}
    </ol>
  );
}

/** Plain status text with a dot: filled = works in the sample workspace, hollow = planned. */
export function Status({ state, children }: { state: "demo" | "planned" | "blocked"; children: ReactNode }) {
  const dot = state === "demo" ? "bg-signal border-signal" : state === "blocked" ? "border-attention bg-attention-wash" : "border-rule-strong bg-transparent";
  return (
    <span className="inline-flex items-start gap-2 text-ink-2">
      <span aria-hidden="true" className={`mt-[0.45em] size-2.5 shrink-0 rounded-full border ${dot}`} />
      <span>{children}</span>
    </span>
  );
}
