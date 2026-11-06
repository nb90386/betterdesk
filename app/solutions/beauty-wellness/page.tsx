import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/SolutionPage";
import { getSolution } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Beauty & wellness",
  description: "BetterDesk for salons, spas and studios: answer texts and DMs with your menu, book the right provider and send reminders.",
  alternates: { canonical: "/solutions/beauty-wellness" },
};

export default function Page() {
  const s = getSolution("beauty-wellness");
  if (!s) notFound();
  return <SolutionPage s={s} />;
}
