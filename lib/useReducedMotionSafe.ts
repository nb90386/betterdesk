"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Hydration-safe reduced-motion flag. The server cannot know the preference, so the hydration
 * render must match it (motion on); the real preference applies on the next client render.
 */
export function useReducedMotionSafe() {
  const pref = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && !!pref;
}
