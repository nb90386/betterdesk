// In-memory sliding-window rate limit plus a global concurrency cap.
// NOTE: on serverless platforms each warm instance has its own memory, so this is per-instance,
// best-effort protection only. It stops casual abuse and accidental loops; it is not a security
// boundary. For a hard limit, back it with a shared store (e.g. Redis/KV) behind the same interface.

export type LimiterOptions = { windowMs: number; max: number; maxConcurrent: number; maxKeys?: number };

export function createLimiter(o: LimiterOptions) {
  const hits = new Map<string, number[]>();
  let active = 0;
  const maxKeys = o.maxKeys ?? 5000;

  function prune(now: number) {
    for (const [k, v] of hits) {
      const kept = v.filter((t) => now - t < o.windowMs);
      if (kept.length) hits.set(k, kept);
      else hits.delete(k);
    }
  }

  return {
    /** Records an attempt when allowed. */
    check(key: string, now: number = Date.now()): { ok: true } | { ok: false; retryAfterSec: number } {
      if (hits.size > maxKeys) prune(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < o.windowMs);
      if (recent.length >= o.max) {
        return { ok: false, retryAfterSec: Math.max(1, Math.ceil((recent[0] + o.windowMs - now) / 1000)) };
      }
      recent.push(now);
      hits.set(key, recent);
      return { ok: true };
    },
    /** Returns a release function, or null when the concurrency cap is reached. */
    acquire(): (() => void) | null {
      if (active >= o.maxConcurrent) return null;
      active++;
      let released = false;
      return () => {
        if (!released) {
          released = true;
          active--;
        }
      };
    },
    get active() {
      return active;
    },
  };
}

/** 5 audits per 10 minutes per client IP, 4 audits running at once per instance. */
export const auditLimiter = createLimiter({ windowMs: 10 * 60_000, max: 5, maxConcurrent: 4 });
