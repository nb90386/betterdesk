let counter = 0;
/** Short, collision-resistant ids for client-side records. Prefix makes logs readable. */
export function newId(prefix: string) {
  counter = (counter + 1) % 1_000_000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`;
}
