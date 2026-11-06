import { Eyebrow } from "./Section";

export function PageHero({ eyebrow, title, children, aside }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="border-b border-rule">
      <div className={`container-bd grid gap-10 pb-14 pt-12 sm:pt-16 md:pb-20 ${aside ? "lg:grid-cols-[1.3fr_1fr] lg:items-end" : ""}`}>
        <div className="max-w-[760px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display mt-5 text-[clamp(2.6rem,1.6rem+4vw,4.9rem)] text-ink">{title}</h1>
          {children ? <div className="lede mt-6">{children}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  );
}
