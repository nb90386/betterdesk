"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Phone-only conversion bar: appears after the first screen, hides near the closing call to action and on /contact. */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const hidden = pathname.startsWith("/contact");

  useEffect(() => {
    if (hidden) return;
    let raf = 0;
    const probe = () => {
      raf = 0;
      const close = document.querySelector("[data-close-cta]");
      const closeVisible = close ? close.getBoundingClientRect().top < window.innerHeight : false;
      // Stay out of the way while a pinned act owns the screen.
      let pinned = false;
      document.querySelectorAll("[data-pinned]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 1 && r.bottom >= window.innerHeight - 1) pinned = true;
      });
      setShow(window.scrollY > window.innerHeight * 0.9 && !closeVisible && !pinned);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [hidden, pathname]);

  if (hidden) return null;
  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-porcelain/85 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 ease-[var(--ease-out)] md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[0.875rem] leading-tight text-ink-2">See it on your own missed calls.</p>
        <Link href="/contact" className="press inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[550] text-porcelain">
          Book a demo
        </Link>
      </div>
    </div>
  );
}
