import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a demo",
  description: "Request a demo call. Talk through your front desk with a person: how calls reach you today, what BetterDesk would do, and what it costs.",
  alternates: { canonical: "/contact" },
};

const COVERS = [
  ["How work reaches you now", "Your phone line, after-hours setup, website forms and social inboxes."],
  ["What BetterDesk would say", "A sample conversation built around your services."],
  ["What connects, and what doesn't", "Your calendar or booking tool, and what happens if there's no integration."],
  ["Which plan, if any", "Straight pricing. If it isn't a fit, we'll tell you."],
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <section className="relative overflow-hidden bg-mineral" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_10%_-10%,#ffffff_0%,transparent_60%)]" />
      <div className="wrap relative grid gap-14 pb-24 pt-32 md:pt-40 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <h1 id="contact-title" className="t-display max-w-[12ch]">Talk through your setup.</h1>
          <p className="t-lede mt-6">Tell us a little about the business. The form writes an email to us, and we reply to find a time for a call. There&rsquo;s no online booking calendar yet.</p>
          <h2 className="t-label mt-12">What the call covers</h2>
          <ol className="relative mt-5">
            <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-signal" />
            {COVERS.map(([k, v], i) => (
              <li key={k} className="relative pb-5 pl-8 last:pb-0">
                <span aria-hidden="true" className={`absolute left-0 top-[0.4em] h-[11px] w-[11px] rounded-full border-2 border-signal ${i === COVERS.length - 1 ? "bg-signal" : "bg-mineral"}`} />
                <span className="block text-[1rem] font-semibold">{k}</span>
                <span className="text-[0.9375rem] text-ink-2">{v}</span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[0.9375rem] text-ink-2">
            Prefer plain email? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-signal">{CONTACT_EMAIL}</a>.
          </p>
        </div>
        <div className="panel self-start p-5 shadow-[var(--shadow-lift)] sm:p-8 lg:col-span-7">
          <ContactForm initialPlan={plan ?? ""} />
          <p className="mt-5 border-t border-rule pt-4 text-[0.8125rem] leading-relaxed text-muted">
            SMS consent and opt-out wording for the texts BetterDesk sends your customers: pending, confirmed with you on the setup call. Privacy policy and terms: pending.
          </p>
        </div>
      </div>
    </section>
  );
}
