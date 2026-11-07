import type { Metadata } from "next";
import { ReviewForm } from "@/components/site/ReviewForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a free visibility and lead-flow check",
  description: "Tell us about your cleaning business. A person reviews how customers find you and how inquiries reach you, and replies with what we found.",
  alternates: { canonical: "/contact" },
};

const STEPS = [
  ["You send this form", "Two short steps. About a minute."],
  ["A person reads it", "We look at your public website and your answers. Nothing is automated, and we don’t run tools against sites you don’t own."],
  ["We reply by email", "What we found, what we’d fix first, and whether BetterDesk is a fit. If it isn’t, we say so."],
] as const;

export default function Contact() {
  return (
    <section className="wrap pb-24 pt-32 md:pt-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="t-display max-w-[16ch]">Get a free visibility and lead-flow check.</h1>
          <p className="t-lede mt-6">
            Tell us where you clean and what gets in the way. We’ll look at how customers find you and how inquiries reach you, and reply with what we found.
          </p>
          <ol className="mt-10 border-t border-rule-strong">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr] border-b border-rule py-4">
                <span className="tabular-nums text-muted">{i + 1}</span>
                <div>
                  <p className="font-[600]">{t}</p>
                  <p className="mt-0.5 text-[0.9375rem] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[0.9375rem] text-ink-2">
            Prefer email? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link font-[560]">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
