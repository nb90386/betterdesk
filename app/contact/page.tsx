import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Eyebrow } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Talk through your front desk with a person: how calls reach you today, what BetterDesk would do, and what it costs.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <section className="container-bd grid gap-14 pb-24 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
      <div>
        <Eyebrow>Book a demo</Eyebrow>
        <h1 className="display mt-5 text-[clamp(2.6rem,1.6rem+4vw,4.6rem)] text-ink">
          Talk through <em>your</em> setup.
        </h1>
        <p className="lede mt-6">Tell us a little about the business and we&rsquo;ll reply by email to find a time.</p>
        <div className="mt-10 border-t border-rule pt-6">
          <h2 className="eyebrow">What the call covers</h2>
          <ol className="mt-4 space-y-4">
            {[
              ["How work reaches you now", "Your phone line, after-hours setup, website forms and social inboxes."],
              ["What BetterDesk would say", "We walk through a sample conversation built around your services."],
              ["What connects, and what doesn't", "Your calendar or booking tool, and what happens if there's no integration."],
              ["Which plan, if any", "Straight pricing. If it isn't a fit, we'll tell you."],
            ].map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[28px_1fr] gap-2">
                <span className="font-mono text-[0.8rem] text-signal">0{i + 1}</span>
                <span>
                  <span className="block text-[0.98rem] font-medium text-ink">{k}</span>
                  <span className="text-[0.92rem] text-ink-2">{v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-10 text-[0.92rem] text-ink-2">
          Prefer plain email? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
      <div className="card-stock self-start p-5 sm:p-8">
        <ContactForm initialPlan={plan ?? ""} />
      </div>
    </section>
  );
}
