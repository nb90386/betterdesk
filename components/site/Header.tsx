"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { NAV, PRODUCT_MENU } from "@/lib/site";

const ENTER = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };
const EXIT = { duration: 0.14, ease: [0.4, 0, 1, 1] as const };

export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false); // product popover
  const [sheet, setSheet] = useState(false); // mobile sheet
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const sheetBtn = useRef<HTMLButtonElement>(null);
  const popId = useId();

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
    setSheet(false);
  }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Popover: Escape and outside click close it and return focus to the trigger.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !triggerRef.current?.contains(t)) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  // Mobile sheet: traps the page behind it.
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSheet(false);
        sheetBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const behind = [document.getElementById("main"), document.querySelector("body > footer, #site-footer")].filter(Boolean) as HTMLElement[];
    behind.forEach((el) => (el.inert = true));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
    };
  }, [sheet]);

  // Release the sheet's scroll lock before navigation starts (not after the new route commits):
  // iOS Safari can drop a programmatic scroll-to-top while <html> is overflow:hidden.
  const releaseOnNavigate = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("a[href]")) return;
    document.documentElement.style.overflow = "";
    document.querySelectorAll<HTMLElement>("#main, #site-footer").forEach((el) => (el.inert = false));
    setSheet(false);
    setMenu(false);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const productActive = PRODUCT_MENU.some((m) => active(m.href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || sheet ? "bg-stone/85 shadow-[var(--shadow-bar)] backdrop-blur-xl backdrop-saturate-150" : "bg-stone/0"
      }`}
    >
      <div className="wrap flex h-[4.25rem] items-center gap-4 lg:gap-8">
        <Link href="/" className="-ml-1 rounded-[var(--radius-sm)] px-1 py-1 text-[1.06rem] text-ink" aria-label="BetterDesk home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="mr-auto hidden md:block">
          <ul className="flex items-center gap-1">
            <li className="relative">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={menu}
                aria-controls={popId}
                onClick={() => setMenu((m) => !m)}
                className={`inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-[0.9375rem] transition-colors hover:text-ink ${productActive || menu ? "text-ink" : "text-ink-2"}`}
              >
                Product
                <motion.svg animate={{ rotate: menu ? 180 : 0 }} transition={ENTER} viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true" fill="none">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {menu ? (
                  <motion.div
                    ref={popRef}
                    id={popId}
                    onClickCapture={releaseOnNavigate}
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: ENTER }}
                    exit={{ opacity: 0, scale: 0.97, y: -2, transition: EXIT }}
                    style={{ transformOrigin: "24px 0px" }}
                    className="absolute left-0 top-[calc(100%+8px)] w-[26rem] rounded-[var(--radius-md)] bg-paper p-2 shadow-[var(--shadow-pop)]"
                  >
                    <ul>
                      {PRODUCT_MENU.map((m, i) => (
                        <motion.li key={m.href} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0, transition: { ...ENTER, delay: 0.03 * i } }}>
                          {i === 3 ? <div className="mx-3 my-1.5 h-px bg-rule" aria-hidden="true" /> : null}
                          <Link
                            href={m.href}
                            aria-current={active(m.href) ? "page" : undefined}
                            className="group flex items-baseline gap-4 rounded-[8px] px-3 py-2.5 hover:bg-stone-2 focus-visible:bg-stone-2"
                          >
                            <span className="w-[7.5rem] shrink-0 font-[600] text-ink">{m.label}</span>
                            <span className="text-[0.875rem] leading-snug text-muted">{m.line}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
            {NAV.map((n) => (
              <li key={n.href} className={n.href === "/resources" ? "hidden lg:block" : undefined}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className="inline-flex h-10 items-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link href="/contact" className="hidden h-10 items-center px-2 text-[0.9375rem] text-ink-2 hover:text-ink lg:inline-flex">
            Get a free check
          </Link>
          <Link
            href="/demo"
            className="press hidden h-10 items-center whitespace-nowrap rounded-[var(--radius-sm)] bg-ink px-4 text-[0.9375rem] font-[560] text-stone hover:bg-ink-2 sm:inline-flex"
          >
            Try the demo
          </Link>
          <button
            ref={sheetBtn}
            type="button"
            className="press -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-ink md:hidden"
            aria-expanded={sheet}
            aria-controls="mobile-menu"
            aria-label={sheet ? "Close menu" : "Open menu"}
            onClick={() => setSheet((o) => !o)}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <motion.path
                initial={false}
                animate={{ d: sheet ? "M5 5L15 15" : "M3 7.5H17" }}
                transition={ENTER}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={false}
                animate={{ d: sheet ? "M15 5L5 15" : "M3 12.5H17" }}
                transition={ENTER}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sheet ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: ENTER }}
            exit={{ opacity: 0, transition: EXIT }}
            className="h-[calc(100dvh-4.25rem)] overflow-y-auto bg-stone md:hidden"
          >
            <nav aria-label="Mobile" onClickCapture={releaseOnNavigate} className="wrap flex min-h-full flex-col pb-8 pt-2">
              <p className="t-label pt-4">Product</p>
              <ul className="mt-2">
                {PRODUCT_MENU.map((m, i) => (
                  <motion.li key={m.href} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { ...ENTER, delay: 0.03 * i } }} className="border-b border-rule">
                    <Link href={m.href} aria-current={active(m.href) ? "page" : undefined} className="flex min-h-14 flex-col justify-center py-2">
                      <span className="text-[1.25rem] font-[600] tracking-[-0.02em]">{m.label}</span>
                      <span className="text-[0.875rem] text-muted">{m.line}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="mt-6">
                {[...NAV, { href: "/contact", label: "Get a free check" }, { href: "/security", label: "Security and data" }].map((n) => (
                  <li key={n.href} className="border-b border-rule">
                    <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className="flex min-h-13 items-center text-[1.125rem] font-[560]">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link href="/demo" className="press flex min-h-13 items-center justify-center rounded-[var(--radius-sm)] bg-ink text-[1.05rem] font-[560] text-stone">
                  Try the demo
                </Link>
                <p className="mt-3 text-center text-[0.875rem] text-muted">Runs on a fictional company in your browser. Nothing is sent.</p>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
