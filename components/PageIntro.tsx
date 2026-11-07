/**
 * Subpage opening: left-aligned title on the mineral table, with the route arriving from the
 * left margin and landing on a point beneath the lede. Same signature as the homepage, quieter.
 */
export function PageIntro({ title, children, aside, id = "page-title" }: { title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="relative overflow-hidden bg-mineral">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_-10%,#ffffff_0%,transparent_60%)]" />
      <div className="wrap relative grid gap-10 pb-16 pt-32 md:pb-24 md:pt-40 lg:grid-cols-12 lg:gap-x-10">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <h1 id={id} className="t-display max-w-[17ch]">{title}</h1>
          {children ? <div className="t-lede mt-6 max-w-[46ch] space-y-4">{children}</div> : null}
          <div aria-hidden="true" className="relative mt-10 h-3 w-[min(22rem,70%)]">
            <span className="absolute inset-y-[5px] -left-[50vw] right-1.5 h-px bg-signal" />
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-signal" />
          </div>
        </div>
        {aside ? <div className="lg:col-span-5 lg:self-end">{aside}</div> : null}
      </div>
    </section>
  );
}
