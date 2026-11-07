import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a demo",
  description: "Request a BetterDesk demo call: how you sell today, a walkthrough of the sample workspace with your service area, what would connect, and early-access pricing.",
  alternates: { canonical: "/contact" },
};

const COVERS = [
  ["How you sell today", "Where your target buildings, notes, emails and follow-ups live right now."],
  ["The sample workspace, with your service area", "A walkthrough of Scout and the pipeline, using your ZIP codes and the kinds of buildings you want."],
  ["What would connect", "Your mailbox and calendar. Neither is available yet, and we will say so plainly."],
  ["Early-access pricing", "The proposed numbers, and whether they make sense for your size. If it is not a fit, we will tell you."],
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <>
      <PageIntro title="Request a demo.">
        <p>Tell us a little about your company. The form writes an email to us, and we reply to find a time for a call. There is no online booking calendar yet.</p>
      </PageIntro>

      <section aria-labelledby="covers-title" className="bg-mineral py-20 md:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <h2 id="covers-title" className="t-title max-w-[12ch]">What the call covers.</h2>
            <ol className="relative mt-8">
              <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-signal" />
              {COVERS.map(([k, v], i) => (
                <li key={k} className="relative pb-6 pl-8 last:pb-0">
                  <span aria-hidden="true" className={`absolute left-0 top-[0.4em] h-[11px] w-[11px] rounded-full border-2 border-signal ${i === COVERS.length - 1 ? "bg-signal" : "bg-mineral"}`} />
                  <span className="block text-[1.0625rem] font-semibold">{k}</span>
                  <span className="block max-w-[42ch] text-[1rem] text-ink-2">{v}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-[1rem] text-ink-2">
              Prefer plain email? Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-signal">{CONTACT_EMAIL}</a>.
            </p>
          </div>
          <div className="panel self-start p-5 shadow-[var(--shadow-lift)] sm:p-8 lg:col-span-7">
            <ContactForm initialPlan={plan ?? ""} />
            <p className="mt-5 border-t border-rule pt-4 text-[0.8125rem] leading-relaxed text-muted">
              Privacy policy and terms: pending legal review. Consent and opt-out wording for any future email or text outreach: pending legal review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
