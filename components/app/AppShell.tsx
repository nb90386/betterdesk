"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DemoWorkspaceProvider, useWorkspace } from "@/lib/demo/store";
import { Mark } from "@/components/Logo";
import { Icon } from "./icons";

const NAV = [
  { href: "/app", label: "Today", icon: "today" },
  { href: "/app/presence", label: "Presence", icon: "presence" },
  { href: "/app/scout", label: "Scout", icon: "scout" },
  { href: "/app/opportunities", label: "Opportunities", icon: "opportunities" },
  { href: "/app/inbox", label: "Inbox", icon: "inbox" },
  { href: "/app/pipeline", label: "Pipeline", icon: "pipeline" },
  { href: "/app/calendar", label: "Calendar", icon: "calendar" },
  { href: "/app/customers", label: "Customers", icon: "customers" },
  { href: "/app/analytics", label: "Analytics", icon: "analytics" },
  { href: "/app/settings", label: "Settings", icon: "settings" },
] as const;

function useCounts() {
  const { ws, ready } = useWorkspace();
  if (!ready) return {} as Record<string, number>;
  const drafts = ws.drafts.filter((d) => d.approval === "pending").length;
  const inbox = ws.conversations.filter((c) => c.messages.at(-1)?.direction === "inbound").length;
  const tasks = ws.tasks.filter((t) => t.status === "open").length;
  return { "/app/scout": drafts, "/app/inbox": inbox, "/app/presence": tasks } as Record<string, number>;
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const counts = useCounts();
  return (
    <ul className="space-y-0.5">
      {NAV.map((n) => {
        const active = n.href === "/app" ? path === "/app" : path.startsWith(n.href);
        const c = counts[n.href];
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className="group flex min-h-9 items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 text-[0.875rem] text-ink-2 hover:bg-stone-2 hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-ink aria-[current=page]:shadow-[var(--shadow-paper)]"
            >
              <Icon name={n.icon} className="h-[18px] w-[18px] text-muted group-aria-[current=page]:text-ink" />
              {n.label}
              {c ? <span className="ml-auto text-[0.75rem] font-[600] tabular-nums text-ink" aria-label={`${c} waiting`}>{c}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function DemoBar() {
  const { reset } = useWorkspace();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="on-graphite flex flex-wrap items-center gap-x-4 gap-y-1 bg-graphite px-4 py-2 text-[0.8125rem] text-graphite-muted">
      <span className="font-medium text-graphite-ink">Sample workspace · DEMO</span>
      <span className="hidden sm:inline">Fictional company and contacts. Nothing is sent. Changes stay in this browser.</span>
      <span className="ml-auto flex items-center gap-3">
        {confirm ? (
          <>
            <span className="text-graphite-ink">Reset all sample data?</span>
            <button className="underline underline-offset-2 hover:text-graphite-ink" onClick={() => { reset(); setConfirm(false); }}>Reset</button>
            <button className="underline underline-offset-2 hover:text-graphite-ink" onClick={() => setConfirm(false)}>Keep</button>
          </>
        ) : (
          <button className="inline-flex items-center gap-1 underline-offset-2 hover:text-graphite-ink hover:underline" onClick={() => setConfirm(true)}>
            <Icon name="reset" className="h-3.5 w-3.5" /> Reset sample
          </button>
        )}
        <Link href="/" className="hover:text-graphite-ink hover:underline">Back to site</Link>
      </span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { ready, ws } = useWorkspace();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-dvh flex-col bg-stone">
      <DemoBar />
      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-rule px-3 py-4 lg:block">
          <Link href="/app" className="mb-5 flex items-center gap-2 px-2.5">
            <Mark className="h-6 w-6" />
            <span className="min-w-0">
              <span className="block truncate text-[0.875rem] font-semibold">{ws.org.name}</span>
              <span className="block text-[0.75rem] text-muted">BetterDesk</span>
            </span>
          </Link>
          <nav aria-label="App">
            <Nav />
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2.5 lg:hidden">
            <Link href="/app" className="flex items-center gap-2 text-[0.875rem] font-semibold"><Mark className="h-5 w-5" /> {ws.org.name}</Link>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)]" aria-expanded={open} aria-controls="app-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? "x" : "menu"} />
            </button>
          </div>
          {open ? (
            <nav id="app-menu" aria-label="App" className="border-b border-rule bg-stone px-3 py-3 lg:hidden">
              <Nav onNavigate={() => setOpen(false)} />
            </nav>
          ) : null}
          <main id="main" className="mx-auto w-full max-w-[84rem] px-4 py-6 md:px-8 md:py-8">
            {ready ? children : <div className="h-64 animate-pulse rounded-[var(--radius-md)] bg-stone-2" aria-label="Loading workspace" />}
          </main>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoWorkspaceProvider>
      <Shell>{children}</Shell>
    </DemoWorkspaceProvider>
  );
}
