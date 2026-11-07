import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Faq } from "@/components/Faq";
import { CloseCta } from "@/components/home/Sections";
import { ButtonLink, Arrow } from "@/components/Button";

export const metadata: Metadata = {
  title: "How it works",
  description: "How BetterDesk gets set up: a call with a person, connecting your channels and calendar, teaching it your business, and starting in assisted mode.",
  alternates: { canonical: "/how-it-works" },
};

const SETUP = [
  { k: "Demo and fit check", when: "Before you sign up", p: "We look at how calls and messages reach you today and which calendar or booking tool you use, and tell you plainly what will and won't connect." },
  { k: "Guided setup session", when: "After you sign up", p: "A person from BetterDesk sets up how missed calls, texts and forms reach BetterDesk, and connects your calendar where an integration exists." },
  { k: "Teach it your business", when: "During setup", p: "Services, prices you're comfortable sharing, hours, service area, intake questions, what counts as urgent and who it goes to. We import what you already have written down." },
  { k: "Test conversations", when: "Before going live", p: "We run sample inquiries together and adjust wording and rules until the replies sound like you." },
  { k: "Start in assisted mode", when: "First days", p: "Every reply waits for your OK. You approve, edit or reject. Most of the tuning happens here." },
  { k: "Loosen the reins", when: "When you're ready", p: "Let routine questions go out on their own and keep anything sensitive for your team. You can switch back any time." },
];

const NEED = [
  ["A phone line customers already call", "We'll work out how unanswered calls reach BetterDesk on the setup call."],
  ["A way you book work today", "A calendar or booking tool. If it can't connect, your team confirms times BetterDesk collects."],
  ["Your basics written down, roughly", "Services, hours, service area, the prices you quote and your policies. A rough list is fine."],
  ["Someone to approve replies at first", "Usually the owner or office manager, for the first stretch in assisted mode."],
];

const HOW_FAQ = [
  { q: "How long does setup take?", a: "Setup is one guided session plus your review of test conversations. How quickly you go live depends mostly on how fast you can get us your services, prices and rules, and on what your calendar supports. We'll give you a realistic date on the demo call." },
  { q: "Do I keep my phone number?", a: "BetterDesk is meant to work with the number your customers already call. The exact setup depends on your phone provider, and we go through it with you before you commit." },
  { q: "What if it says something wrong?", a: "In assisted mode nothing goes out without your approval. In the other modes, it answers from the business information you've given it, and your rules decide what goes to a person. Your edits improve future replies." },
  { q: "Can I turn it off?", a: "Yes. You can pause it, switch modes, or cancel your plan. Plans are monthly with no annual contract." },
  { q: "What about customer data and privacy?", a: "Ask us on the demo call. If you're a clinic or practice, or need specific privacy or compliance terms, raise it before connecting any customer data." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro title="Set up with a person. Then it runs on your rules.">
        <p>No software project and no prompt writing. We learn how your business runs, connect what can be connected, and you approve every reply until you trust it.</p>
      </PageIntro>

      <section aria-labelledby="setup-title" className="bg-porcelain pb-24 md:pb-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="setup-title" className="t-title max-w-[12ch] lg:sticky lg:top-28">From first call to going live.</h2>
          </div>
          <ol className="relative lg:col-span-8">
            <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-4 w-px bg-signal" />
            {SETUP.map((s, i) => (
              <li key={s.k} className="relative grid gap-2 border-b border-rule pb-8 pl-10 pt-8 first:pt-0 last:border-0 sm:grid-cols-[1fr_11rem] sm:gap-8">
                <span aria-hidden="true" className={`absolute left-0 h-[15px] w-[15px] rounded-full border-2 border-signal ${i === 0 ? "top-1" : "top-9"} ${i === SETUP.length - 1 ? "bg-signal" : "bg-porcelain"}`} />
                <div>
                  <h3 className="text-[1.375rem] font-semibold tracking-[-0.02em]">{s.k}</h3>
                  <p className="mt-2 max-w-[56ch] text-[1rem] leading-relaxed text-ink-2">{s.p}</p>
                </div>
                <p className="text-[0.875rem] text-muted sm:pt-1.5 sm:text-right">{s.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="need-title" className="tone-dark bg-graphite py-24 md:py-32" data-tone="dark">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="need-title" className="t-title max-w-[14ch]">Four things. You probably have them already.</h2>
            <ButtonLink href="/demo" variant="quiet" className="mt-8 gap-1.5 text-graphite-ink">See a sample conversation <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-graphite-rule sm:grid-cols-2 lg:col-span-7">
            {NEED.map(([k, v]) => (
              <div key={k} className="bg-graphite-2 p-6">
                <dt className="text-[1.0625rem] font-semibold text-graphite-ink">{k}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-snug text-graphite-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-porcelain py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Questions about setup.</h2>
          <Faq items={HOW_FAQ} className="lg:col-span-8" />
        </div>
      </section>
      <CloseCta />
    </>
  );
}
