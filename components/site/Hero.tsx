import { ButtonLink } from "@/components/Button";

/**
 * Hero on the petrol stage. The headline is readable instantly; the composition on the right is
 * the product's own claim in miniature: a business you found and an inquiry that found you join
 * one route and land on a booked walkthrough. Motion is CSS only (route draw + travelling pulse).
 */
const ROUTE_A = "M6 18 C 40 18, 48 50, 86 50 L 120 50";
const ROUTE_B = "M6 82 C 40 82, 48 50, 86 50";

export function Hero() {
  return (
    <section data-tone="dark" aria-labelledby="hero-title" className="tone-dark relative overflow-hidden bg-petrol">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_78%_38%,rgb(127_216_194/0.11)_0%,transparent_62%),radial-gradient(80%_60%_at_0%_100%,rgb(21_41_45/0.95)_0%,transparent_70%)]" />
      <div className="wrap relative grid min-h-[100svh] content-center gap-12 pb-16 pt-28 md:pt-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-6">
          <h1 id="hero-title" className="t-hero max-w-[11ch] text-petrol-ink">More walkthroughs. Less chasing leads.</h1>
          <p className="mt-7 max-w-[44ch] text-[clamp(1.0625rem,1rem+0.35vw,1.3rem)] leading-relaxed text-petrol-muted">
            For commercial cleaning companies. BetterDesk finds businesses worth contacting, drafts introductions you approve, and keeps every lead and inquiry in one record until the walkthrough is booked.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/app" variant="signal" className="w-full sm:w-auto">Explore the sample workspace</ButtonLink>
            <ButtonLink href="/contact" variant="secondary" className="w-full sm:w-auto border-petrol-rule text-petrol-ink hover:border-petrol-muted">Request a demo</ButtonLink>
          </div>
          <p className="mt-6 max-w-[50ch] text-[0.9375rem] text-petrol-ink/80">
            Explore opens a sample workspace with a fictional cleaning company. No sign-up, and nothing is ever sent. Early access; proposed plans from $99 a month.
          </p>
        </div>

        <div className="relative lg:col-span-6" aria-label="Illustration: a business you found and an inquiry that found you join one route and become a booked walkthrough" role="img">
          <div className="relative mx-auto aspect-[1.2] w-full max-w-[40rem]">
            <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <path d={ROUTE_A} fill="none" stroke="var(--color-petrol-rule)" strokeWidth="0.5" />
              <path d={ROUTE_B} fill="none" stroke="var(--color-petrol-rule)" strokeWidth="0.5" />
              <path d={ROUTE_A} pathLength={100} fill="none" stroke="var(--color-signal)" strokeWidth="0.55" strokeLinecap="round" className="hero-draw" />
              <path d={ROUTE_B} pathLength={100} fill="none" stroke="var(--color-signal)" strokeWidth="0.55" strokeLinecap="round" className="hero-draw delay" />
              <path d={ROUTE_A} pathLength={100} fill="none" stroke="var(--color-signal-bright)" strokeWidth="1.1" strokeLinecap="round" className="route-pulse" />
            </svg>
            <Panel className="left-0 top-[4%] w-[46%]" label="Found · your prospect list" title="Juniper Lane Law" detail="Office · 12,000 sq ft · 80202" />
            <Panel className="bottom-[4%] left-0 w-[46%]" label="Inquiry · your website" title="Alder & Finch Architects" detail="“Could someone take a look?”" />
            <div className="absolute right-0 top-1/2 w-[44%] -translate-y-1/2">
              <div className="tone-light rounded-[var(--radius-lg)] bg-[linear-gradient(180deg,#f8faf8,#e9eeeb)] p-4 text-ink shadow-[0_1px_0_#fff_inset,0_0_0_1px_rgb(127_216_194/0.35),20px_40px_70px_-30px_rgb(0_0_0/0.9)]">
                <p className="text-[0.75rem] font-medium text-signal-ink">Walkthrough booked</p>
                <p className="mt-1.5 font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.02em]">Tuesday, 8:00 AM</p>
                <p className="mt-1 text-[0.8125rem] text-muted">Juniper Lane Law · Elena Brooks</p>
                <div className="mt-3 flex items-center gap-2 border-t border-rule pt-3 text-[0.75rem] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Pipeline: Walkthrough scheduled
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[0.75rem] text-petrol-muted lg:text-right">Fictional sample records</p>
        </div>
      </div>
    </section>
  );
}

function Panel({ className, label, title, detail }: { className: string; label: string; title: string; detail: string }) {
  return (
    <div className={`absolute rounded-[var(--radius-md)] border border-petrol-rule bg-[linear-gradient(180deg,#14292e,#0e2125)] p-3.5 shadow-[0_1px_0_rgb(255_255_255/0.07)_inset,14px_30px_50px_-26px_rgb(0_0_0/0.9)] ${className}`}>
      <p className="text-[0.75rem] text-signal-bright">{label}</p>
      <p className="mt-1 text-[0.9375rem] font-medium text-petrol-ink">{title}</p>
      <p className="mt-0.5 truncate text-[0.8125rem] text-petrol-muted">{detail}</p>
    </div>
  );
}
