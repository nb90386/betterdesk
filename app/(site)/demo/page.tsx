import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { CloseCta } from "@/components/CloseCta";
import { ButtonLink, Arrow } from "@/components/Button";
import { RouteList, type RouteItem } from "@/components/marketing/RouteList";

export const metadata: Metadata = {
  title: "Product tour",
  description: "A seven-step tour of the BetterDesk sample workspace: run Scout on a sample list, approve an introduction, simulate a reply and book a walkthrough.",
  alternates: { canonical: "/demo" },
};

const STEPS: { title: string; body: string; href: string; link: string }[] = [
  { title: "Today", body: "Open the workspace and see what needs you first: drafts to approve, replies to answer, walkthroughs coming up.", href: "/app", link: "Open Today" },
  { title: "Scout", body: "Choose \"Use the sample list\", then \"Import and start Scout\". Watch Scout work through each building, then open Details on any one to see the rules it met, missed or could not check.", href: "/app/scout", link: "Open Scout" },
  { title: "Approve or edit an introduction", body: "Open a draft. Try changing the subject so it starts with \"Re:\". The honesty check blocks approval, because there was no earlier thread. Fix it and approve.", href: "/app/opportunities", link: "Open Opportunities" },
  { title: "Simulate delivery and a reply", body: "Mark the approved message as delivered, open the customer record, then simulate a reply that asks for a walkthrough. These steps are simulated and labeled. Nothing is sent.", href: "/app/inbox", link: "Open Inbox" },
  { title: "Book a sample walkthrough", body: "Pick a sample time for the walkthrough. Then look at the pipeline and the timeline on the record: both update.", href: "/app/pipeline", link: "Open Pipeline" },
  { title: "Settings", body: "See the suppression list and the integration status. Mailbox and calendar show as not connected, because they are not built yet.", href: "/app/settings", link: "Open Settings" },
  { title: "Reset the sample", body: "Use Reset sample in the top bar to put everything back and run it again.", href: "/app", link: "Back to the workspace" },
];

export default function DemoPage() {
  const items: RouteItem[] = STEPS.map((s) => ({
    key: s.title,
    title: s.title,
    body: s.body,
    side: (
      <Link href={s.href} className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-ink underline decoration-rule-strong underline-offset-[0.3em] hover:decoration-signal">
        {s.link} <Arrow className="h-3.5 w-3.5" />
      </Link>
    ),
  }));

  return (
    <>
      <PageIntro
        title="A five-minute tour of the sample workspace."
        aside={
          <div className="rounded-[var(--radius-lg)] border border-petrol-rule bg-petrol-2 p-6">
            <p className="text-[1rem] leading-relaxed text-petrol-ink">Nothing to sign up for. Nothing is sent.</p>
            <ButtonLink href="/app" variant="signal" className="mt-5">Open the sample workspace</ButtonLink>
          </div>
        }
      >
        <p>The tour follows one prospect from a list to a booked walkthrough. You do the clicking; this page tells you where to go.</p>
      </PageIntro>

      <section aria-labelledby="what-title" className="bg-mineral py-20 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 id="what-title" className="t-title max-w-[13ch] lg:col-span-4">What you are opening.</h2>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {[
              ["A fictional company", "Clearline Commercial Cleaning, in Denver. The buildings and contacts are made up."],
              ["Stored in your browser", "Your changes live in local storage on this device. No account, no upload."],
              ["Reset any time", "One button in the top bar puts the sample back to the start."],
              ["Nothing is sent", "Delivery, replies and the calendar are simulated and labeled as such."],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-rule-strong pt-4">
                <dt className="text-[1.0625rem] font-semibold">{k}</dt>
                <dd className="mt-1 max-w-[40ch] text-[1rem] text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="tour-title" className="bg-mineral-2 py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="tour-title" className="t-title max-w-[12ch] lg:sticky lg:top-28">Seven steps to follow.</h2>
            <ButtonLink href="/app" variant="primary" className="mt-8">Open the sample workspace</ButtonLink>
          </div>
          <div className="lg:col-span-8"><RouteList items={items} numbered /></div>
        </div>
      </section>

      <CloseCta />
    </>
  );
}
