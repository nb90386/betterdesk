/**
 * Subpage opening on the petrol stage. The signal route enters from the left margin, passes
 * under the title and lands on a node, the same junction motif as the mark, kept quiet.
 */
export function PageIntro({ title, children, aside, id = "page-title" }: { title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} data-tone="dark" className="tone-dark relative overflow-hidden bg-petrol">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_85%_10%,rgb(127_216_194/0.10)_0%,transparent_60%),radial-gradient(60%_70%_at_10%_110%,rgb(21_41_45/0.9)_0%,transparent_70%)]" />
      <div className="wrap relative grid gap-10 pb-16 pt-32 md:pb-20 md:pt-40 lg:grid-cols-12 lg:gap-x-10">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <h1 id={id} className="t-display max-w-[18ch] text-petrol-ink">{title}</h1>
          {children ? <div className="mt-6 max-w-[52ch] space-y-4 text-[1.125rem] leading-relaxed text-petrol-muted">{children}</div> : null}
          <svg aria-hidden="true" viewBox="0 0 400 24" className="mt-10 h-6 w-[min(26rem,80%)] overflow-visible">
            <path d="M-600 12H240c30 0 40-8 70-8h50" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx="372" cy="4" r="5" fill="var(--color-signal-bright)" />
          </svg>
        </div>
        {aside ? <div className="lg:col-span-5 lg:self-end">{aside}</div> : null}
      </div>
    </section>
  );
}
