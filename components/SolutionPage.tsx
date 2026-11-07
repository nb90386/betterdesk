import { SectionHeading } from "./Section";
import { ButtonLink } from "./Button";
import { LeadJourney } from "./LeadJourney";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import type { Solution } from "@/lib/solutions";

export function SolutionPage({ s }: { s: Solution }) {
  return (
    <>
      <section className="on-night lamp-ground relative -mt-16 overflow-hidden pt-16" aria-label={`Solutions: ${s.name}`}>
        <div className="container-bd relative grid gap-10 pb-16 pt-12 sm:pt-16 md:pb-24 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h1 className="display text-[clamp(2.6rem,1.6rem+4vw,4.9rem)] text-[#f7f6f3]">
              {s.title} {s.titleEm}
            </h1>
            <p className="lede mt-6 !text-[#d4d6da]">{s.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <ButtonLink href="/contact" variant="light" arrow className="group">Book a demo</ButtonLink>
              <ButtonLink href="#walkthrough" variant="ghost">See a sample conversation</ButtonLink>
            </div>
          </div>
          <aside className="nd-focal stage-pane relative w-full max-w-[460px] self-center p-5 sm:p-6 lg:ml-auto" aria-label="Example rules">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-[0.8rem]">
              <span className="font-medium text-[#f7f6f3]">Your rules, in plain English</span>
              <span className="text-night-muted">Examples</span>
            </div>
            <ul className="mt-4 space-y-2">
              {s.rules.map((r) => (
                <li key={r} className="rounded-[10px] bg-white/[0.04] px-3.5 py-3 text-[0.88rem] leading-snug text-[#e6e4df]">{r}</li>
              ))}
            </ul>
            <p className="mt-4 text-[0.78rem] text-night-muted">You write your own during setup.</p>
          </aside>
        </div>
      </section>

      <section className="container-bd py-16 md:py-24" aria-labelledby="pain-title">
        <SectionHeading mark="signal" id="pain-title" title={<>Where the work slips away.</>} />
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
            <SectionHeading id="flow-title" title={<>A workflow that sounds like your shop.</>} />
            <ol className="mt-10 space-y-6">
              {s.flow.map((f, i) => (
                <li key={f.k} className="reveal grid grid-cols-[40px_1fr] gap-3 border-t border-rule pt-5">
                  <span className="grid size-6 place-items-center rounded-full border border-rule-strong text-[0.74rem] font-medium text-ink-2 tabular">{i + 1}</span>
                  <div>
                    <h3 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-ink">{f.k}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{f.v}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="reveal self-start rounded-[var(--radius-lg)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-7" aria-label="Businesses this fits">
            <p className="text-[0.9rem] font-medium text-ink">Businesses this fits</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.who.map((w) => (
                <li key={w} className="rounded-[8px] border border-rule-strong px-3 py-1.5 text-[0.85rem] text-ink-2">{w}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="walkthrough" className="container-bd scroll-mt-20 py-16 md:py-24" aria-labelledby="walk-title">
        <SectionHeading mark="ink" id="walk-title" title="Step through it." />
        <div className="reveal mt-10"><LeadJourney scenarioIds={[s.scenarioId]} /></div>
      </section>

      <section className="container-bd grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="sfaq">
        <SectionHeading mark="handled" id="sfaq" title="Asked on almost every call." />
        <Faq items={s.faq} />
      </section>
      <CtaBand />
    </>
  );
}
