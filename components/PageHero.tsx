/** Subpage opening: continues the night desk header, then hands off to pearl. Eyebrow kept for the document title only. */
export function PageHero({ eyebrow, title, children, aside, overlap = false }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode; overlap?: boolean }) {
  return (
    <section className="on-night lamp-ground relative -mt-16 overflow-hidden pt-16" aria-label={eyebrow}>
      <div className={`container-bd relative grid gap-10 pt-12 sm:pt-16 ${overlap ? "pb-40 md:pb-52" : "pb-16 md:pb-24"} ${aside ? "lg:grid-cols-[1.25fr_1fr] lg:items-center" : ""}`}>
        <div className="max-w-[820px]">
          <h1 className="display text-[clamp(2.5rem,1.4rem+4.2vw,5rem)] text-[#f7f6f3]">{title}</h1>
          {children ? <div className="lede mt-6 !text-[#d4d6da]">{children}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  );
}
