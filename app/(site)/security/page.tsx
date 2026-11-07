import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security and data",
  description: "What this site does with the information you give it, how the website audit protects other people's networks, and what isn't built yet.",
  alternates: { canonical: "/security" },
};

const DATA = [
  ["Review request form", "Your answers are checked on our server and sent to the BetterDesk request inbox when one is connected. The site itself doesn’t keep a copy. If the inbox isn’t connected, the form tells you and nothing is sent or stored."],
  ["Website check", "The address and details you enter are used for that one check. We fetch public pages of that site, analyse them in memory and send you the result. Nothing is stored after the response."],
  ["Sample workspace and demo", "Everything runs in your browser on fictional data and is saved only in your browser’s local storage. “Reset the sample” clears it."],
  ["Analytics and cookies", "This site runs no analytics, advertising or tracking scripts and sets no cookies of its own."],
] as const;

const AUDIT = [
  "Only http and https on the standard ports; addresses with usernames or passwords are refused.",
  "Every hostname is resolved first and refused if any address is private, loopback, link-local (including cloud metadata), carrier-grade NAT, multicast or reserved, in IPv4 or IPv6, including mapped forms.",
  "The connection is made to the address that was checked, so a DNS change mid-request can’t redirect it.",
  "Redirects are followed by hand, at most three, and each hop is checked again.",
  "At most 6 pages, 1.5 MB per response, 8 seconds per request and about 20 seconds in total, one request at a time with a pause between.",
  "robots.txt is respected for our own crawler name, BetterDeskPresenceAudit.",
  "Requests are rate-limited per connection. You must confirm you own the site or are allowed to audit it.",
] as const;

const NOT_YET = [
  "Accounts and sign-in: there are none yet, so there is no customer data on our servers.",
  "A production database with each company’s records kept separate at the database level is designed but not built.",
  "No sending: outbound email, texts and calls are off. Scout can’t send.",
  "No compliance certifications are claimed.",
] as const;

export default function Security() {
  return (
    <section className="wrap pb-24 pt-32 md:pt-40">
      <h1 className="t-display max-w-[16ch]">Security and data, without the fine print.</h1>
      <p className="t-lede mt-6 max-w-[58ch]">What happens to what you type here, how our website check avoids becoming a tool against other people’s networks, and what doesn’t exist yet.</p>

      <div id="data" className="mt-16 grid scroll-mt-24 gap-10 border-t border-rule-strong pt-10 lg:grid-cols-12">
        <h2 className="t-title max-w-[12ch] lg:col-span-4">What this site does with your information.</h2>
        <dl className="lg:col-span-8">
          {DATA.map(([k, v]) => (
            <div key={k} className="border-b border-rule py-5">
              <dt className="text-[1.0625rem] font-[600]">{k}</dt>
              <dd className="mt-1.5 max-w-[66ch] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 grid gap-10 border-t border-rule-strong pt-10 lg:grid-cols-12">
        <h2 className="t-title max-w-[12ch] lg:col-span-4">How the website check stays safe.</h2>
        <ul className="lg:col-span-8">
          {AUDIT.map((a) => (
            <li key={a} className="border-b border-rule py-4 text-ink-2">{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid gap-10 border-t border-rule-strong pt-10 lg:grid-cols-12">
        <h2 className="t-title max-w-[12ch] lg:col-span-4">Not built yet.</h2>
        <ul className="lg:col-span-8">
          {NOT_YET.map((a) => (
            <li key={a} className="border-b border-rule py-4 text-ink-2">{a}</li>
          ))}
        </ul>
      </div>

      <p className="mt-16 max-w-[60ch] text-ink-2">
        Found a problem? Email <a href={`mailto:${CONTACT_EMAIL}`} className="link font-[560]">{CONTACT_EMAIL}</a>. A formal privacy policy and terms will be published after legal review, before BetterDesk takes real customer data.
      </p>
    </section>
  );
}
