import { MotionConfig } from "motion/react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </MotionConfig>
  );
}
