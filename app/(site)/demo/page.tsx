import type { Metadata } from "next";
import { DemoWorkspaceProvider } from "@/lib/demo/store";
import { GuidedDemo } from "@/components/site/GuidedDemo";
import { StatusMark, TextLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Interactive demo",
  description: "Run the whole BetterDesk journey on a fictional cleaning company: a website fix, a Scout-qualified prospect, an approved introduction, a reply and a booked walkthrough.",
  alternates: { canonical: "/demo" },
};

export default function Demo() {
  return (
    <>
      <section className="wrap pb-10 pt-32 md:pt-40">
        <h1 className="t-display max-w-[20ch]">Run the whole journey in two minutes.</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
          <p className="t-lede max-w-[58ch] lg:col-span-8">
            You’re Dana, owner of Clearline Commercial Cleaning, a fictional company in Denver. Fix something on the website, let Scout check a list, approve an introduction, answer the reply and book the walkthrough. Every step updates the same record.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-span-4 lg:justify-end">
            <StatusMark status="DEMO" />
            <TextLink href="/app">Skip to the full workspace</TextLink>
          </div>
        </div>
      </section>
      <section className="wrap pb-24 pt-6">
        <div className="border-t border-rule-strong pt-8">
          <DemoWorkspaceProvider>
            <GuidedDemo />
          </DemoWorkspaceProvider>
        </div>
      </section>
    </>
  );
}
