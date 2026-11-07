/**
 * BetterDesk motion presets (apple-design skill, §4): springs, because they start from the current
 * on-screen value and can be re-targeted mid-flight, so every menu, panel and record move is
 * interruptible. Critically damped (bounce 0) everywhere; nothing here is a user-thrown gesture,
 * so nothing bounces. "duration" in Motion's spring API is Apple's "response", not a fixed length.
 */
export const SPRING = {
  /** Small, frequent UI: popover, selection cursor, tab indicator. */
  snap: { type: "spring", bounce: 0, duration: 0.26 },
  /** Panels and content arriving: inspector, step panel, message entering a thread. */
  ui: { type: "spring", bounce: 0, duration: 0.34 },
  /** One object travelling between regions (directory climb, draft becoming a sent message). */
  move: { type: "spring", bounce: 0, duration: 0.55 },
} as const;

/** Text/content swaps that shouldn't move: a short cross-fade (also the reduced-motion fallback). */
export const FADE = { duration: 0.18, ease: [0.22, 1, 0.36, 1] } as const;
