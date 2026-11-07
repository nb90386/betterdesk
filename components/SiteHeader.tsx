"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";

/**
 * Frosted only where it earns readability: the bar blurs what scrolls under it and
 * switches to graphite glass while a [data-tone=dark] act passes beneath it.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      const y = 32;
      let isDark = false;
      document.querySelectorAll<HTMLElement>("[data-tone=dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) isDark = true;
      });
      setDark(isDark);
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const behind = [document.getElementById("main"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
    behind.forEach((el) => (el.inert = true));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const toneDark = dark && !open;

  return (
    <header
      data-dark={toneDark || undefined}
      className={`group/h fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300 ${toneDark ? "tone-dark" : ""} ${
        scrolled || open
          ? toneDark
            ? "bg-graphite/72 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-porcelain/78 shadow-[0_1px_0_rgb(16_18_20/0.08)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="rounded-[4px] text-ink" aria-label="BetterDesk home">
          <Logo className="text-[1.05rem]" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative py-2 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="press hidden min-h-10 items-center rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[550] text-porcelain hover:bg-ink-2 sm:inline-flex [.tone-dark_&]:text-graphite"
          >
            Request a demo
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="press -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <path d={open ? "M5 5l10 10M15 5L5 15" : "M3 7h14M3 13h14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-rule bg-porcelain md:hidden">
          <nav aria-label="Mobile" className="wrap flex h-full flex-col pb-8 pt-4">
            <ul>
              {[...NAV, { href: "/demo", label: "See a conversation" }].map((item) => (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex min-h-16 items-center justify-between text-[1.6rem] font-semibold tracking-[-0.025em] text-ink [font-stretch:94%]"
                  >
                    {item.label}
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal opacity-0 [[aria-current=page]_&]:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Link href="/contact" className="press flex min-h-13 items-center justify-center rounded-[var(--radius-sm)] bg-ink text-[1.05rem] font-[550] text-porcelain">
                Request a demo
              </Link>
              <p className="t-small mt-3 text-center text-muted">A short form. We reply by email to find a call time.</p>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
