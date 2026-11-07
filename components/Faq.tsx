export type QA = { q: string; a: React.ReactNode };

export function Faq({ items, className = "" }: { items: QA[]; className?: string }) {
  return (
    <div className={`divide-y divide-rule border-y border-rule ${className}`}>
      {items.map((it) => (
        <details key={it.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-[4px] py-4 text-left text-[1.0625rem] font-medium text-ink">
            {it.q}
            <span className="relative mt-1.5 size-3.5 shrink-0" aria-hidden="true">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink" />
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink transition-transform duration-200 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="max-w-[68ch] pb-5 pr-8 text-[1rem] leading-relaxed text-ink-2">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
