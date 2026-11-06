import { Eyebrow, SectionHeading } from "./Section";
import { ButtonLink } from "./Button";
import { LeadJourney } from "./LeadJourney";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import type { Solution } from "@/lib/solutions";

export function SolutionPage({ s }: { s: Solution }) {
  return (
    <>
      <section className="border-b border-rule">
        <div className="container-bd grid gap-10 pb-14 pt-12 sm:pt-16 md:pb-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Solutions · {s.name}</Eyebrow>
            <h1 className="display mt-5 text-[clamp(2.6rem,1.6rem+4vw,4.9rem)] text-ink">
              {s.title} <em>{s.titleEm}</em>
            </h1>
            <p className="lede mt-6">{s.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <ButtonLink href="/contact" arrow className="group">Book a demo</ButtonLink>
              <ButtonLink href="#walkthrough" variant="ghost">See a sample conversation</ButtonLink>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Businesses this fits">
            {s.who.map((w) => (
              <li key={w} className="rounded-full border border-rule-strong bg-card px-3 py-1.5 text-[0.85rem] text-ink-2">{w}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-bd py-16 md:py-24" aria-labelledby="pain-title">
        <SectionHeading n="01" eyebrow="Sound familiar?" id="pain-title" title={<>Where the work <em>slips away.</em></>} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule md:grid-cols-3">
          {s.pains.map((p, i) => (
            <li key={p.k} className="reveal bg-card p-6 sm:p-7">
              <span className="font-mono text-[0.75rem] text-signal">0{i + 1}</span>
              <h3 className="mt-3 font-display text-[1.5rem] leading-tight tracking-[-0.015em] text-ink">{p.k}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{p.v}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-rule bg-paper-2/50 py-16 md:py-24" aria-labelledby="flow-title">
        <div className="container-bd grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading n="02" eyebrow="How it would run" id="flow-title" title={<>A workflow that sounds <em>like your shop.</em></>} />
            <ol className="mt-10 space-y-6">
              {s.flow.map((f, i) => (
                <li key={f.k} className="reveal grid grid-cols-[40px_1fr] gap-3 border-t border-rule pt-5">
                  <span className="font-mono text-[0.8rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-ink">{f.k}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{f.v}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="reveal self-start rounded-[var(--radius-lg)] bg-night p-6 text-card sm:p-7" aria-label="Example rules">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-night-muted">Example rules · you write your own</p>
            <ul className="mt-4 space-y-3">
              {s.rules.map((r) => (
                <li key={r} className="rounded-md border border-night-rule bg-night-2 px-3.5 py-2.5 font-mono text-[0.8rem] leading-snug text-card/90">{r}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="walkthrough" className="container-bd scroll-mt-20 py-16 md:py-24" aria-labelledby="walk-title">
        <SectionHeading n="03" eyebrow="Sample conversation" id="walk-title" title="Step through it." />
        <div className="reveal mt-10"><LeadJourney scenarioIds={[s.scenarioId]} /></div>
      </section>

      <section className="container-bd grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="sfaq">
        <SectionHeading n="04" eyebrow={`${s.name} questions`} id="sfaq" title="Asked on almost every call." />
        <Faq items={s.faq} />
      </section>
      <CtaBand />
    </>
  );
}
