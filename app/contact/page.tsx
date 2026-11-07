import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Talk through your front desk with a person: how calls reach you today, what BetterDesk would do, and what it costs.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <section className="on-night lamp-ground relative -mt-16 overflow-hidden pt-16" aria-labelledby="contact-title">
      <div className="grain-night pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-bd relative grid gap-12 pb-24 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <h1 id="contact-title" className="display text-[clamp(2.6rem,1.6rem+4vw,4.6rem)] text-[#f7f6f3]">
            Talk through your setup.
          </h1>
          <p className="lede mt-6 !text-[#d4d6da]">Tell us a little about the business and we&rsquo;ll reply by email to find a time.</p>
          <div className="mt-10 border-t border-white/[0.08] pt-6">
            <h2 className="text-[0.9rem] font-medium text-lamp">What the call covers</h2>
            <ol className="mt-5 space-y-5">
              {[
                ["How work reaches you now", "Your phone line, after-hours setup, website forms and social inboxes."],
                ["What BetterDesk would say", "We walk through a sample conversation built around your services."],
                ["What connects, and what doesn't", "Your calendar or booking tool, and what happens if there's no integration."],
                ["Which plan, if any", "Straight pricing. If it isn't a fit, we'll tell you."],
              ].map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="grid size-6 place-items-center rounded-full border border-lamp/50 text-[0.74rem] font-medium text-lamp tabular">{i + 1}</span>
                  <span>
                    <span className="block text-[0.98rem] font-medium text-[#f7f6f3]">{k}</span>
                    <span className="text-[0.92rem] text-night-muted">{v}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-10 text-[0.92rem] text-night-muted">
            Prefer plain email? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#f7f6f3] underline decoration-white/30 underline-offset-4 hover:decoration-white">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="on-pearl card-stock self-start p-5 shadow-[var(--shadow-pearl-on-night)] sm:p-8">
          <ContactForm initialPlan={plan ?? ""} />
        </div>
      </div>
    </section>
  );
}
