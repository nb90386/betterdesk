import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";

export const metadata: Metadata = {
  title: { default: "Sample workspace", template: "%s · BetterDesk sample workspace" },
  description: "Explore BetterDesk with a fictional commercial cleaning company. Nothing is sent; data stays in your browser.",
  robots: { index: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
