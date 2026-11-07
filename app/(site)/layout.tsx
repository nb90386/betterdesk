import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RevealController } from "@/components/site/Reveal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
      <RevealController />
    </>
  );
}
