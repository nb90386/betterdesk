/**
 * The homepage peak: the same 6:42 PM call, split down the middle.
 * Night half = without BetterDesk, pearl half = with. Times come from the "missed-call" sample in lib/sample.ts.
 */
const WITHOUT = [
  ["6:42", "The call rings out. Both techs are on jobs."],
  ["6:43", "Voicemail greeting. She hangs up without a message."],
  ["6:44", "She calls the next plumber on the list."],
] as const;
const WITH = [
  ["6:42", "A text goes out in your name."],
  ["6:45", "Dana explains: slow drip, garage, 78704."],
  ["6:46", "She's offered Thursday 8–10 or 1–3."],
  ["6:47", "Booked. The thread is in your inbox."],
] as const;

export function TwoEndings() {
  return (
    <section className="relative" aria-labelledby="endings-title">
      <h2 id="endings-title" className="sr-only">
        Same call, two endings
      </h2>
      <div className="grid md:grid-cols-2">
        <div className="on-night relative overflow-hidden bg-[linear-gradient(180deg,#221d17_0%,#141312_42%,#0d0e10_100%)]">
          <div className="relative ml-auto max-w-[640px] px-5 py-16 sm:px-8 md:py-24 lg:pl-12 lg:pr-14">
            <p className="display text-[clamp(4.2rem,2rem+8vw,8.5rem)] leading-[0.86] text-[#6f737a] tabular" aria-hidden="true">
              6:44
            </p>
            <h3 className="display mt-3 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] text-[#f7f6f3]">Without BetterDesk, <span className="text-[#8e939a]">the job goes to whoever picked up.</span></h3>
            <ol className="mt-8 space-y-3 border-t border-white/[0.08] pt-6">
              {WITHOUT.map(([t, v]) => (
                <li key={t} className="grid grid-cols-[3.5rem_1fr] gap-3 text-[0.95rem]">
                  <time className="font-mono text-night-muted">{t}</time>
                  <span className="text-[#c9ccd1]">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative bg-[radial-gradient(90%_80%_at_0%_0%,#fbfaf7_0%,#eeede9_60%)]">
          <div className="relative mr-auto max-w-[640px] px-5 py-16 sm:px-8 md:py-24 lg:pl-14 lg:pr-12">
            <p className="display text-[clamp(4.2rem,2rem+8vw,8.5rem)] leading-[0.86] text-ink tabular" aria-hidden="true">
              6:47
            </p>
            <h3 className="display mt-3 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] text-ink">With BetterDesk, <span className="text-signal">booked for Thursday, 8&ndash;10 AM.</span></h3>
            <ol className="mt-8 space-y-3 border-t border-rule pt-6">
              {WITH.map(([t, v], i) => (
                <li key={t + v} className="grid grid-cols-[3.5rem_1fr] gap-3 text-[0.95rem]">
                  <time className={`font-mono ${i === WITH.length - 1 ? "text-signal" : "text-muted"}`}>{t}</time>
                  <span className="text-ink-2">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <p className="container-bd mt-4 text-[0.78rem] text-muted">Same sample call, same three to five minutes. Names and times are illustrative.</p>
    </section>
  );
}

/** Trust statement: one composed sentence built only from claims the product already makes (docs/redesign/CLAIMS_AUDIT.md). */
export function TrustStrip({ className = "" }: { className?: string }) {
  const mark = "underline decoration-signal/60 decoration-[0.08em] underline-offset-[0.18em]";
  return (
    <div className={`grid gap-6 rounded-[var(--radius-xl)] bg-card p-7 shadow-[var(--shadow-card)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-10 ${className}`}>
      <p className="display max-w-[30ch] text-[clamp(1.45rem,1.05rem+1.4vw,2.2rem)] leading-[1.12] text-ink">
        It says <span className={mark}>only what you&rsquo;ve approved</span>, hands emergencies and complaints{" "}
        <span className={mark}>to a person</span>, starts with every reply waiting for your OK, and runs month to month.
      </p>
      <p className="max-w-[30ch] text-[0.88rem] leading-relaxed text-ink-2 md:text-right">
        When a customer asks something it hasn&rsquo;t been taught, it says it will check and passes the question on. Setup is with a real person.
      </p>
    </div>
  );
}
