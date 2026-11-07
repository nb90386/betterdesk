import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Faq } from "@/components/Faq";
import { CloseCta } from "@/components/CloseCta";
import { ButtonLink, Arrow } from "@/components/Button";
import { RouteList, Status, type RouteItem } from "@/components/marketing/RouteList";

export const metadata: Metadata = {
  title: "How it works",
  description: "The BetterDesk workflow from finding a building to winning and keeping the contract: who does each step, and what works today in the sample workspace.",
  alternates: { canonical: "/how-it-works" },
};

type Step = { title: string; what: string; who: string; state: "demo" | "planned"; status: string };

const STEPS: Step[] = [
  { title: "Find", what: "You bring the buildings you want: a list from your own notes, a referral sheet, a chamber directory you are allowed to use. Website inquiries land in the same records.", who: "You", state: "demo", status: "Works in the sample workspace with a sample list. A licensed data provider is planned." },
  { title: "Qualify", what: "Scout checks each building against your criteria and shows which rules were met, which were not, and which are unknown. It does not guess a missing fact.", who: "Scout", state: "demo", status: "Works in the sample workspace." },
  { title: "Prepare", what: "Scout drafts a short introduction from a template, using only facts already in the record. Anything it cannot support stays out.", who: "Scout", state: "demo", status: "Works in the sample workspace. Drafts come from a template, not an AI model." },
  { title: "Approve", what: "A person reads the draft, edits it if needed and approves it. A check blocks approval for things like a subject that starts with \"Re:\" when there was no earlier thread.", who: "You", state: "demo", status: "Works in the sample workspace." },
  { title: "Connect", what: "The approved message goes out from your own mailbox, and replies come back to the same record. Today delivery and replies are simulated and labeled as such.", who: "BetterDesk", state: "planned", status: "Simulated in the sample workspace. Real sending is off and needs a mailbox connection, not built yet." },
  { title: "Book walkthrough", what: "When a contact asks to see the building, you pick a time and the record moves to the walkthrough stage.", who: "You", state: "demo", status: "Works in the sample workspace on a sample calendar. Google and Microsoft calendar sync is planned." },
  { title: "Propose", what: "The record carries what you learned at the walkthrough into the proposal stage, so the quote starts from the notes, not from memory.", who: "You", state: "planned", status: "The stage exists in the sample pipeline. Proposal documents are planned." },
  { title: "Win", what: "You mark the contract won. The prospect becomes a customer and drops out of prospecting, so nobody pitches a client you already serve.", who: "You", state: "demo", status: "Works in the sample workspace." },
  { title: "Retain", what: "The customer record keeps the full timeline from first note to signed contract, which is where you start when it is time to check in or renew.", who: "You", state: "demo", status: "Customer records and timeline work in the sample workspace." },
];

const ONBOARDING: [string, string][] = [
  ["Business details", "Company name, who is sending, and the address that will appear on any email."],
  ["Service area", "The ZIP codes or counties you will drive to. Scout uses this as its first rule."],
  ["Services", "What you offer: nightly office cleaning, medical suites, floor care, and so on."],
  ["Ideal customer criteria", "Facility types you want, a minimum size if you have one, and the contacts worth writing to."],
  ["Prospect list import", "A CSV of buildings you are allowed to contact. You keep the source note with it."],
  ["Outreach preferences and approval policy", "Your template wording and who approves. In the current design a person approves every message."],
  ["Mailbox and calendar connection", "Optional, and not available yet. Until it is, you copy approved drafts into your own email."],
  ["Workspace review", "A look at the records Scout built, before anything is acted on."],
];

const FAQ = [
  { q: "What can I actually use today?", a: "The sample workspace at /app. It is a fictional cleaning company in Denver. You can import the sample list, run Scout, approve drafts and move records through the pipeline. Your own data cannot be connected yet." },
  { q: "Does Scout send anything?", a: "No. Outbound sending is off. In the sample workspace, delivery and replies are simulated and labeled. In the planned service, sending would come from your own Google or Microsoft mailbox, only after a person approves the exact message." },
  { q: "Where does Scout find businesses?", a: "It does not search the web for you. It works on lists you bring. A licensed data provider is something we may add later; none is connected today." },
  { q: "Is an AI model writing the emails?", a: "Not today. Drafts are filled from a template using facts in the record. An AI model is not connected. If one is added, it would stay behind the same approval step." },
  { q: "What does it cost?", a: "Early-access pricing is proposed and not yet billable. See the pricing page for the numbers and what they are based on." },
];

export default function HowItWorksPage() {
  const items: RouteItem[] = STEPS.map((s) => ({
    key: s.title,
    title: s.title,
    body: s.what,
    side: (
      <dl className="space-y-2">
        <div><dt className="t-label">Done by</dt><dd className="text-ink">{s.who}</dd></div>
        <div><dt className="t-label">Status today</dt><dd><Status state={s.state}>{s.status}</Status></dd></div>
      </dl>
    ),
  }));

  return (
    <>
      <PageIntro title="One route from a building on your list to a signed contract.">
        <p>BetterDesk follows nine steps. Some work today in a sample workspace and some are planned. Each step below says which, and who does the work.</p>
      </PageIntro>

      <section aria-labelledby="route-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="route-title" className="t-title max-w-[13ch] lg:sticky lg:top-28">Find to Retain, in order.</h2>
            <p className="mt-5 max-w-[34ch] text-[1rem] text-ink-2 lg:sticky lg:top-60">A filled dot means you can try it now in the sample workspace. A hollow dot means planned.</p>
          </div>
          <div className="lg:col-span-8"><RouteList items={items} numbered /></div>
        </div>
      </section>

      <section aria-labelledby="start-title" className="bg-mineral-2 py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="start-title" className="t-title max-w-[12ch]">Getting started with your own workspace.</h2>
            <p className="mt-5 max-w-[36ch] text-[1rem] text-ink-2">This is the setup we are building toward. Accounts are not open yet, so today you can walk through it in the sample.</p>
            <ButtonLink href="/demo" variant="quiet" className="mt-6 gap-1.5">Take the product tour <Arrow className="h-3.5 w-3.5" /></ButtonLink>
          </div>
          <ol className="divide-y divide-rule border-y border-rule lg:col-span-8">
            {ONBOARDING.map(([k, v], i) => (
              <li key={k} className="grid gap-1 py-5 sm:grid-cols-[3rem_14rem_1fr] sm:gap-6">
                <span className="tabular text-[0.9375rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[1.0625rem] font-semibold">{k}</h3>
                <p className="max-w-[50ch] text-[1rem] leading-relaxed text-ink-2">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-mineral py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="faq-title" className="t-title lg:col-span-4">Straight answers.</h2>
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </section>

      <CloseCta />
    </>
  );
}
