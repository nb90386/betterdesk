"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Small-screen conversion bar. Appears once the first screen has scrolled away and
 * hides again when the closing call-to-action band is visible. Never shown on /contact.
 */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const hidden = pathname.startsWith("/contact");

  useEffect(() => {
    if (hidden) return;
    let pastTop = false;
    let ctaVisible = false;
    const update = () => setShow(pastTop && !ctaVisible);
    const cta = document.getElementById("cta-title")?.closest("section");
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.9;
      // An IntersectionObserver never fires if a fast jump (End key, scrollTo) carries the closing band
      // from below the viewport to above it, so re-derive it here too.
      const ctaNow = cta ? cta.getBoundingClientRect().top < window.innerHeight : false;
      if (next !== pastTop || ctaNow !== ctaVisible) {
        pastTop = next;
        ctaVisible = ctaNow;
        update();
      }
    };
    const io = cta
      ? new IntersectionObserver(([e]) => {
          ctaVisible = e.isIntersecting || e.boundingClientRect.top < 0;
          update();
        })
      : null;
    if (cta && io) io.observe(cta);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [hidden, pathname]);

  if (hidden) return null;
  return (
    <div
      className={`on-night fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,opacity] duration-200 ease-out sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[0.82rem] leading-snug text-ink-2">
          From <span className="font-medium text-[#f7f6f3]">$149/mo</span> · setup with a person
        </p>
        <Link href="/contact" className="press inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#f7f6f3] px-5 text-[0.9rem] font-medium text-[#111214]">
          Book a demo
        </Link>
      </div>
    </div>
  );
}
