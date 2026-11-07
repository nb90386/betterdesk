import type { RunState, ScoutRun, ISODate } from "./types.ts";

/** Allowed Scout run transitions. Anything not listed is impossible and throws. */
export const RUN_TRANSITIONS: Record<RunState, RunState[]> = {
  created: ["queued", "canceled"],
  queued: ["running", "canceled", "blocked"],
  running: ["waiting-approval", "completed", "failed", "paused", "blocked", "canceled"],
  "waiting-approval": ["running", "completed", "canceled"],
  paused: ["running", "canceled"],
  blocked: ["queued", "canceled"],
  failed: ["queued", "canceled"],
  completed: [],
  canceled: [],
};

export const TERMINAL: RunState[] = ["completed", "canceled"];

export class InvalidTransition extends Error {
  constructor(from: RunState, to: RunState) {
    super(`Scout run cannot move from ${from} to ${to}`);
  }
}

export function canTransition(from: RunState, to: RunState) {
  return RUN_TRANSITIONS[from].includes(to);
}

export function transition(run: ScoutRun, to: RunState, at: ISODate, note?: string): ScoutRun {
  if (!canTransition(run.state, to)) throw new InvalidTransition(run.state, to);
  return {
    ...run,
    state: to,
    retries: to === "queued" && (run.state === "failed" || run.state === "blocked") ? run.retries + 1 : run.retries,
    history: [...run.history, { state: to, at, note }],
    completedAt: TERMINAL.includes(to) || to === "failed" ? at : run.completedAt,
  };
}

/** True when a run may still produce effects. Canceled and completed runs never do. */
export const isActive = (s: RunState) => s === "queued" || s === "running";
