import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/SolutionPage";
import { getSolution } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Home services",
  description: "BetterDesk for plumbing, HVAC, electrical and other trades: text back missed calls, triage emergencies, route urgent work and book the rest.",
  alternates: { canonical: "/solutions/home-services" },
};

export default function Page() {
  const s = getSolution("home-services");
  if (!s) notFound();
  return <SolutionPage s={s} />;
}
