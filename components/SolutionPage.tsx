import { PageIntro } from "@/components/PageIntro";
import { Faq } from "@/components/Faq";
import { CloseCta } from "@/components/home/Sections";
import { ButtonLink, Arrow } from "@/components/Button";
import type { Solution } from "@/lib/solutions";

/** Industry page: the problem as a ledger, the route as a vertical line, the owner's rules on petrol. */
export function SolutionPage({ s }: { s: Solution }) {
  return (
    <>
      <PageIntro
        title={
          <>
            {s.title} <span className="text-muted">{s.titleEm}</span>
          </>
        }
        aside={<p className="text-[0.9375rem] leading-relaxed text-muted">{s.who.join(" · ")}</p>}
      >
        <p>{s.lede}</p>
      </PageIntro>

      <section aria-labelledby="pain-title" className="bg-mineral pb-24 md:pb-32">
        <div className="wrap">
          <h2 id="pain-title" className="t-title">Where the work slips away today.</h2>
          <dl className="mt-10 grid border-t border-ink md:grid-cols-3">
            {s.pains.map((p, i) => (
              <div key={p.k} className={`border-b border-rule py-6 md:border-b-0 md:py-8 md:pr-7 ${i > 0 ? "md:border-l md:pl-7" : ""}`}>
                <dt className="text-[1.25rem] font-semibold tracking-[-0.015em]">{p.k}</dt>
                <dd className="mt-2 text-[1rem] leading-snug text-ink-2">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="flow-title" className="border-t border-rule bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="flow-title" className="t-title max-w-[12ch] lg:sticky lg:top-28">What BetterDesk does instead.</h2>
          </div>
          <ol className="relative lg:col-span-8">
            <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-2 w-px bg-signal" />
            {s.flow.map((f, i) => (
              <li key={f.k} className="relative pb-9 pl-10 last:pb-0">
                <span aria-hidden="true" className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-signal ${i === s.flow.length - 1 ? "bg-signal" : "bg-mineral"}`} />
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">{f.k}</h3>
                <p className="mt-1.5 max-w-[56ch] text-[1rem] leading-relaxed text-ink-2">{f.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="rules-title" data-tone="dark" className="tone-dark bg-petrol py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="rules-title" className="t-title max-w-[14ch]">Your rules, written down once.</h2>
            <p className="mt-5 max-w-[38ch] text-[1.0625rem] leading-relaxed text-petrol-muted">Examples of rules owners set during setup. Yours will be different.</p>
            <ButtonLink href="/demo" variant="quiet" className="mt-8 gap-1.5 text-petrol-ink">See a sample conversation <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <ul className="panel-petrol divide-y divide-petrol-rule self-start px-5 sm:px-7 lg:col-span-7">
            {s.rules.map((r) => {
              const [when, then] = r.split(" → ");
              return (
                <li key={r} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto_1.2fr] sm:items-center sm:gap-4">
                  <span className="text-[0.9375rem] font-[550] text-petrol-ink">{when}</span>
                  <span aria-hidden="true" className="hidden h-px w-8 bg-signal-bright sm:block" />
                  <span className="text-[0.9375rem] text-petrol-muted">{then}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Common questions.</h2>
          <Faq items={s.faq} className="lg:col-span-8" />
        </div>
      </section>
      <CloseCta compact title={s.slug === "beauty-wellness" ? "Bring last week’s unanswered messages." : "Bring last week’s missed calls."} lede="We’ll walk through what BetterDesk would have sent each of them, using your services, hours and rules." />
    </>
  );
}
