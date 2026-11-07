import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Faq } from "@/components/Faq";
import { CloseCta } from "@/components/CloseCta";
import { ButtonLink, Arrow } from "@/components/Button";

export const metadata: Metadata = {
  title: "For commercial cleaning companies",
  description: "BetterDesk is a sales and inquiry system for owner-led commercial cleaning companies: one record per building, from first note to signed contract.",
  alternates: { canonical: "/solutions/commercial-cleaning" },
};

const SCATTER: [string, string][] = [
  ["A spreadsheet of targets", "Buildings you meant to call, last touched whenever."],
  ["Research in your notes", "Who manages it, how big it is, what the lobby looked like."],
  ["Emails in Gmail", "The introduction, the reply, the second reply you never answered."],
  ["Walkthroughs in a calendar", "A time and an address, with no memory of why you are going."],
  ["Proposals in Drive", "Version four of the quote, named something close to final."],
  ["Follow-ups in your head", "The one that matters most, and the one you will forget."],
];

const RULES: [string, number, string][] = [
  ["Inside your service area", 30, "ZIP code against the area you set."],
  ["A facility type you serve", 25, "Office, medical, property management, retail."],
  ["Facility around your minimum size", 20, "Only when a source states the size."],
  ["A business contact to address", 15, "A work email, not a personal one."],
  ["Not already a customer", 10, "Checked against your customer records."],
];

const NOT: [string, string][] = [
  ["Crew scheduling", "Who cleans which building tonight."],
  ["Payroll and time clocks", "Hours, wages and pay runs."],
  ["Invoicing", "Billing the customers you already won."],
  ["Inspections and quality scoring", "Walk-throughs of finished work."],
];

const FAQ = [
  { q: "Is this a CRM?", a: "It keeps records, a pipeline and a timeline, but it is narrower than a general CRM. It is built around finding commercial buildings, qualifying them and getting to a walkthrough." },
  { q: "Will it replace my operations software?", a: "No. Keep your operations software, such as Swept or Janitorial Manager. BetterDesk covers the part before the contract is signed." },
  { q: "Can I try it with my own buildings?", a: "Not yet. Accounts and storage are not built. You can try the sample workspace, which uses a fictional Denver company and keeps its data in your browser." },
  { q: "What if my list has personal emails or buildings outside my area?", a: "Scout marks them. A personal email is not drafted to, and a ZIP outside your service area scores lower. You see the reason on each record." },
  { q: "Do I have to let it send email?", a: "Sending is off. When it is available, it would send from your own mailbox, and only after you approve each message." },
];

export default function CommercialCleaningPage() {
  return (
    <>
      <PageIntro title="Built for the owner who is also the salesperson.">
        <p>BetterDesk is for owner-led commercial cleaning companies with 5 to 50 staff and recurring contracts: offices, medical suites, property managers, retail. It handles the selling, not the cleaning.</p>
      </PageIntro>

      <section aria-labelledby="scatter-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="scatter-title" className="t-title max-w-[14ch]">Your sales are in six places.</h2>
            <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2">
              BetterDesk keeps one record per building. The research, the emails, the walkthrough time and the next step sit on that record, so you open one thing instead of six.
            </p>
          </div>
          <dl className="divide-y divide-rule border-y border-rule lg:col-span-7">
            {SCATTER.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[15rem_1fr] sm:gap-6">
                <dt className="text-[1.0625rem] font-semibold">{k}</dt>
                <dd className="text-[1rem] text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="rules-title" data-tone="dark" className="tone-dark bg-petrol py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="rules-title" className="t-title max-w-[14ch]">An example set of rules you can read.</h2>
            <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-petrol-muted">
              Scout scores a building with rules like these, set to your area and your customers. Every score comes with the reasons. When a fact is missing, the rule is marked unknown and left out of the score. Unknown is never guessed.
            </p>
            <ButtonLink href="/scout" variant="quiet" className="mt-6 gap-1.5 text-petrol-ink">How Scout works <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <div className="panel-petrol p-5 sm:p-7">
              <table className="w-full text-left text-[1rem]">
                <caption className="sr-only">Example qualification rules and weights</caption>
                <thead>
                  <tr className="border-b border-petrol-rule text-[0.8125rem] text-petrol-muted">
                    <th scope="col" className="pb-3 pr-4 font-medium">Rule</th>
                    <th scope="col" className="pb-3 pr-4 text-right font-medium">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {RULES.map(([k, w, d]) => (
                    <tr key={k} className="border-b border-petrol-rule last:border-0">
                      <td className="py-4 pr-4">
                        <span className="block font-semibold text-petrol-ink">{k}</span>
                        <span className="block text-[0.9375rem] text-petrol-muted">{d}</span>
                      </td>
                      <td className="tabular py-4 text-right align-top text-[1.125rem] font-semibold text-signal-bright">{w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 border-t border-petrol-rule pt-4 text-[0.875rem] text-petrol-muted">
                Also checked: your suppression list, before any draft is made. Example weights, which you can change in the planned service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="not-title" className="bg-mineral-2 py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="not-title" className="t-title max-w-[14ch]">What BetterDesk leaves alone.</h2>
            <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2">Keep your operations software. It already does these jobs, and BetterDesk is not trying to replace it.</p>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {NOT.map(([k, v]) => (
              <li key={k} className="border-t border-rule-strong py-5">
                <h3 className="text-[1.0625rem] font-semibold">{k}</h3>
                <p className="mt-1 text-[1rem] text-ink-2">{v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Questions from cleaning owners.</h2>
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </section>

      <CloseCta />
    </>
  );
}
