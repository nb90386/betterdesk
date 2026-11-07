"use client";

import { useSyncExternalStore } from "react";

/** A shared clock that ticks every 30s, so components never call Date.now() during render. */
let now = Date.now();
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) timer = setInterval(() => { now = Date.now(); subs.forEach((f) => f()); }, 30_000);
  return () => {
    subs.delete(cb);
    if (!subs.size && timer) { clearInterval(timer); timer = null; }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => now, () => now);
}
