"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "@/lib/motion";
import { Logo } from "@/components/Logo";
import { NAV, PRODUCT_MENU, SOLUTIONS_MENU } from "@/lib/site";

const MENUS = [
  { id: "product", label: "Product", items: PRODUCT_MENU, dividerAt: 3 },
  { id: "solutions", label: "Solutions", items: SOLUTIONS_MENU, dividerAt: -1 },
] as const;
type MenuId = (typeof MENUS)[number]["id"];

const ENTER = SPRING.ui;
// Exits are quicker than entrances (a system response snaps); a navigation closes them instantly.
const EXIT = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const;
const POPOVER = {
  closed: { opacity: 0, scale: 0.96, y: -4, filter: "blur(4px)" },
  exit: (fast: boolean) => (fast ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.97, y: -3, transition: EXIT }),
};
const SHEET = {
  exit: (fast: boolean) => (fast ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10, transition: EXIT }),
};

export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<MenuId | null>(null); // which popover is open
  const [navFast, setNavFast] = useState(false); // a link was activated: close instantly, don't animate over the new page
  const openMenu = MENUS.find((m) => m.id === menu) ?? null;
  const [anchor, setAnchor] = useState({ x: 0, w: 96 }); // the open trigger's position, captured when it's pressed
  const [sheet, setSheet] = useState(false); // mobile sheet
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const popRef = useRef<HTMLDivElement>(null);
  const sheetBtn = useRef<HTMLButtonElement>(null);
  const popId = useId();

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
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
        setMenu(null);
        if (menu) triggerRefs.current[menu]?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !(menu && triggerRefs.current[menu]?.contains(t))) setMenu(null);
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

  // Runs in the bubble phase, after next/link has started the client navigation (closing in the capture phase
  // unmounts the link before its handler runs, which turns the click into a full page load). It still releases
  // the scroll lock before the new route commits: iOS Safari can drop a scroll-to-top while <html> is overflow:hidden.
  const releaseOnNavigate = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("a[href]")) return;
    document.documentElement.style.overflow = "";
    document.querySelectorAll<HTMLElement>("#main, #site-footer").forEach((el) => (el.inert = false));
    setNavFast(true);
    setSheet(false);
    setMenu(null);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      data-scrolled={scrolled || sheet || undefined}
      className={`site-bar fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow] duration-200 ease-[var(--ease-out)] ${
        sheet ? "bg-stone" : scrolled ? "bg-stone/80 backdrop-blur-md backdrop-saturate-150" : "bg-stone/0"
      }`}
    >
      <div className="wrap flex h-[4.25rem] items-center gap-4 lg:gap-8">
        <Link href="/" className="-ml-1 rounded-[var(--radius-sm)] px-1 py-1 text-[1.06rem] text-ink" aria-label="BetterDesk home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="relative mr-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {MENUS.map((m) => {
              const isOpen = menu === m.id;
              const isActive = m.items.some((it) => active(it.href));
              return (
                <li key={m.id}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[m.id] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? popId : undefined}
                    onClick={(e) => {
                      setNavFast(false);
                      setAnchor({ x: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth });
                      setMenu((cur) => (cur === m.id ? null : m.id));
                    }}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-[0.9375rem] transition-colors hover:text-ink ${isActive || isOpen ? "text-ink" : "text-ink-2"}`}
                  >
                    {m.label}
                    <motion.svg animate={{ rotate: isOpen ? 180 : 0 }} transition={SPRING.snap} viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true" fill="none">
                      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>
                </li>
              );
            })}
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
          <AnimatePresence custom={navFast}>
            {openMenu ? (
              <motion.div
                key="popover"
                ref={popRef}
                id={popId}
                custom={navFast}
                onClick={releaseOnNavigate}
                variants={POPOVER}
                initial="closed"
                animate={{ opacity: 1, scale: 1, y: 0, x: anchor.x, filter: "blur(0px)", transition: { ...SPRING.snap, x: SPRING.ui } }}
                exit="exit"
                style={{ transformOrigin: `${anchor.w / 2}px -8px`, x: anchor.x }}
                className="absolute left-0 top-[calc(100%+8px)] w-[26rem] rounded-[var(--radius-md)] bg-paper p-2 shadow-[var(--shadow-pop)]"
              >
                <ul>
                  {openMenu.items.map((it, i) => (
                    <li key={it.href}>
                      {i === openMenu.dividerAt ? <div className="mx-3 my-1.5 h-px bg-rule" aria-hidden="true" /> : null}
                      <Link
                        href={it.href}
                        aria-current={active(it.href) ? "page" : undefined}
                        className="group flex items-baseline gap-4 rounded-[var(--radius-sm)] px-3 py-2.5 hover:bg-stone-2 focus-visible:bg-stone-2"
                      >
                        <span className="w-[9rem] shrink-0 font-[600] text-ink">{it.label}</span>
                        <span className="text-[0.875rem] leading-snug text-muted">{it.line}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
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
            onClick={() => {
              setNavFast(false);
              setSheet((o) => !o);
            }}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <motion.path
                initial={false}
                animate={{ d: sheet ? "M5 5L15 15" : "M3 7.5L17 7.5" }}
                transition={ENTER}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={false}
                animate={{ d: sheet ? "M15 5L5 15" : "M3 12.5L17 12.5" }}
                transition={ENTER}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence custom={navFast}>
        {sheet ? (
          <motion.div
            id="mobile-menu"
            custom={navFast}
            variants={SHEET}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: ENTER }}
            exit="exit"
            className="h-[calc(100dvh-4.25rem-env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] overflow-y-auto bg-stone md:hidden"
          >
            <nav aria-label="Mobile" onClick={releaseOnNavigate} className="wrap flex min-h-full flex-col pb-8 pt-2">
              <p className="t-label pt-4">Product</p>
              <ul className="mt-2">
                {PRODUCT_MENU.map((m) => (
                  <li key={m.href} className="border-b border-rule">
                    <Link href={m.href} aria-current={active(m.href) ? "page" : undefined} className="flex min-h-14 flex-col justify-center py-2">
                      <span className="text-[1.25rem] font-[600] tracking-[-0.02em]">{m.label}</span>
                      <span className="text-[0.875rem] text-muted">{m.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="t-label pt-6">Solutions</p>
              <ul className="mt-2">
                {SOLUTIONS_MENU.map((m) => (
                  <li key={m.href} className="border-b border-rule">
                    <Link href={m.href} aria-current={active(m.href) ? "page" : undefined} className="flex min-h-14 flex-col justify-center py-2">
                      <span className="text-[1.125rem] font-[600] tracking-[-0.01em]">{m.label}</span>
                      <span className="text-[0.875rem] text-muted">{m.line}</span>
                    </Link>
                  </li>
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
