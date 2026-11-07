import { ButtonLink } from "@/components/Button";

/** Closing band: the two real next steps, and exactly what each does. */
export function CloseCta({ title = "See it with a sample cleaning company.", lede = "Open the sample workspace, run Scout on a list of fictional Denver businesses, approve an introduction and book a walkthrough. It takes about five minutes and nothing is sent." }: { title?: string; lede?: string }) {
  return (
    <section data-close-cta data-tone="dark" aria-labelledby="close-title" className="tone-dark relative overflow-hidden bg-petrol">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_100%,rgb(127_216_194/0.12)_0%,transparent_65%)]" />
      <div className="wrap relative grid gap-12 py-24 md:py-28 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2 id="close-title" className="t-display max-w-[16ch] text-petrol-ink">{title}</h2>
          <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-relaxed text-petrol-muted">{lede}</p>
        </div>
        <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/app" variant="signal">Explore BetterDesk</ButtonLink>
            <ButtonLink href="/contact" variant="secondary" className="border-petrol-rule text-petrol-ink hover:border-petrol-muted">Request a demo</ButtonLink>
          </div>
          <p className="max-w-[40ch] text-[0.875rem] text-petrol-muted lg:text-right">
            Request a demo opens a short form that writes an email to us; we reply to find a time.
          </p>
        </div>
      </div>
    </section>
  );
}
