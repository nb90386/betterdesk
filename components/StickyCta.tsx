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
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.9;
      if (next !== pastTop) {
        pastTop = next;
        update();
      }
    };
    const cta = document.getElementById("cta-title")?.closest("section");
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,opacity] duration-200 ease-out sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[0.82rem] leading-snug text-ink-2">
          Plans from $149/mo. <span className="text-muted">Setup with a person.</span>
        </p>
        <Link href="/contact" className="press inline-flex min-h-11 shrink-0 items-center rounded-full bg-ink px-5 text-[0.9rem] font-medium text-card">
          Book a demo
        </Link>
      </div>
    </div>
  );
}
