import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SetupAgenda } from "@/components/HeroArtifacts";
import { SectionHeading } from "@/components/Section";
import { ThroughLine } from "@/components/ThroughLine";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";

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
      <PageHero eyebrow="How it works" title={<>Set up with a person. Live on your terms.</>} aside={<SetupAgenda />}>
        <p>No DIY software puzzle. Someone from BetterDesk sets it up with you, you approve what it says, and you decide when it runs on its own.</p>
      </PageHero>

      <section className="container-bd py-16 md:py-24" aria-labelledby="daily-title">
        <SectionHeading mark="ink" id="daily-title" title={<>What happens to each inquiry.</>} />
        <div className="mt-12"><ThroughLine /></div>
      </section>

      <section className="border-y border-rule bg-paper-2/50 py-16 md:py-24" aria-labelledby="setup-title">
        <div className="container-bd grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading mark="ink" id="setup-title" title={<>From first call to first booking.</>}>
            <p>The order things happen in. Timing depends on your business and your tools, so we confirm a date with you rather than promise one here.</p>
          </SectionHeading>
          <ol className="reveal relative space-y-0">
            <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-signal via-ink-2 to-handled" aria-hidden="true" />
            {SETUP.map((s, i) => (
              <li key={s.k} className="relative grid grid-cols-[32px_1fr] gap-5 pb-9 last:pb-0">
                <span className={`relative z-10 grid size-[31px] place-items-center rounded-full border-2 font-mono text-[0.72rem] ${i === SETUP.length - 1 ? "border-handled bg-handled text-card" : i === 0 ? "border-signal bg-paper text-signal" : "border-ink bg-paper text-ink"}`}>
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-[0.74rem] font-medium text-muted">{s.when}</p>
                  <h3 className="mt-1 text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">{s.k}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-[0.96rem] leading-relaxed text-ink-2">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-bd py-16 md:py-24" aria-labelledby="need-title">
        <SectionHeading mark="ink" id="need-title" title="Four things. You probably have them already." />
        <dl className="reveal mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-rule sm:grid-cols-2">
          {NEED.map(([k, v]) => (
            <div key={k} className="bg-card p-6">
              <dt className="text-[1.02rem] font-semibold tracking-[-0.01em] text-ink">{k}</dt>
              <dd className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-bd grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="hfaq">
        <SectionHeading mark="handled" id="hfaq" title="The practical stuff." />
        <Faq items={HOW_FAQ} />
      </section>
      <CtaBand />
    </>
  );
}
