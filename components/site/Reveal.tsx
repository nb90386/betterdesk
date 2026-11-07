"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reveals [data-reveal] blocks once as they enter. Siblings marked data-reveal="stagger" step 40ms apart. */
export function RevealController() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const idx = el.dataset.reveal === "stagger" ? Array.from(el.parentElement?.children ?? []).indexOf(el) : 0;
          el.style.transitionDelay = `${Math.min(idx, 8) * 40}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
