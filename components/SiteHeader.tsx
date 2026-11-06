"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu on navigation (derived during render, not in an effect).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="header-scrolled sticky top-0 z-50 border-b border-transparent backdrop-blur-md supports-[not(animation-timeline:scroll())]:bg-paper/90">
      <div className="container-bd flex h-16 items-center justify-between gap-6">
        <Link href="/" className="rounded-md" aria-label="BetterDesk home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative rounded-full px-3.5 py-2 text-[0.92rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-signal"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="press group hidden min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-[0.9rem] font-medium text-card hover:bg-ink-2 sm:inline-flex"
          >
            <span className="size-1.5 rounded-full bg-signal-glow transition-colors group-hover:bg-handled-bright" aria-hidden="true" />
            Book a demo
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="press inline-flex size-11 items-center justify-center rounded-full border border-rule-strong bg-card/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path
                d={open ? "M5 5l10 10M15 5 5 15" : "M3 7h14M3 13h14"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-rule bg-paper lg:hidden"
          >
            <nav aria-label="Mobile" className="container-bd py-6">
              <ul className="divide-y divide-rule border-y border-rule">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex items-center justify-between py-4 font-display text-[1.7rem] tracking-[-0.02em] aria-[current=page]:text-signal"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-faint">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
                <li>
                  <Link href="/roi" className="flex items-center justify-between py-4 font-display text-[1.7rem] tracking-[-0.02em]">
                    ROI calculator
                    <span className="font-mono text-xs text-faint">06</span>
                  </Link>
                </li>
              </ul>
              <Link
                href="/contact"
                className="press mt-8 flex min-h-12 items-center justify-center rounded-full bg-ink text-card"
              >
                Book a demo
              </Link>
              <p className="mt-4 text-center text-sm text-muted">
                Or email <a className="underline underline-offset-4" href="mailto:hello@betterdesk.ai">hello@betterdesk.ai</a>
              </p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
