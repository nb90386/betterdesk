import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
import { TextLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "About",
  description: "Why BetterDesk exists, what we will and won't do, and how to reach us. Early-access software for commercial cleaning and B2B service companies.",
  alternates: { canonical: "/about" },
};

const WONT = [
  "Show you a customer, testimonial or result that isn't real.",
  "Send anything to a prospect without a person approving it.",
  "Promise you a ranking in Google or a mention in any AI answer.",
  "Run tools against websites you don't own.",
  "Charge you before prices are agreed with you in writing.",
] as const;

export default function About() {
  return (
    <section className="wrap pb-24 pt-32 md:pt-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="t-display max-w-[18ch]">Built for businesses that don’t have time to chase every detail.</h1>
          <div className="mt-8 grid max-w-[60ch] gap-5 text-[1.125rem] leading-relaxed text-ink-2">
            <p>Most commercial cleaning companies are run by people who are also quoting, hiring, covering shifts and fixing the vacuum. Good opportunities slip through the gaps between the inbox, a spreadsheet and somebody’s memory.</p>
            <p>BetterDesk is our attempt to close those gaps in one place: find the businesses worth a walkthrough, make sure customers can find you, and keep every conversation moving until it’s booked.</p>
            <p>We’re in early access. The product you can try on this site runs on a fictional sample company so you can judge it honestly before giving us anything.</p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <h2 className="t-head">What we won’t do</h2>
          <ul className="mt-3 border-t border-rule-strong">
            {WONT.map((w) => (
              <li key={w} className="border-b border-rule py-3.5 text-ink-2">{w}</li>
            ))}
          </ul>
          <h2 className="t-head mt-10">Company details</h2>
          <p className="mt-3 text-ink-2">Our legal entity and address will be listed here before we take any payment. Until then, the best way to reach us is <a href={`mailto:${CONTACT_EMAIL}`} className="link font-[560]">{CONTACT_EMAIL}</a>.</p>
          <div className="mt-6"><TextLink href="/demo">Try the product first</TextLink></div>
        </div>
      </div>
    </section>
  );
}
