import type { Intent } from "../domain/types.ts";

/** Conservative reply classification. Opt-outs win over everything; anything unclear goes to a person. */
export function classifyReply(text: string): { intent: Intent; reason: string } {
  const t = text.toLowerCase();
  if (/\b(unsubscribe|stop emailing|remove me|take me off|do not contact|don't contact)\b/.test(t)) return { intent: "unsubscribe", reason: "Asked not to be contacted." };
  if (/\b(not interested|no thanks|no thank you|we're all set|we are all set|happy with our)\b/.test(t)) return { intent: "not-interested", reason: "Declined." };
  if (/\b(walkthrough|walk-through|come by|come out|site visit|take a look|stop by)\b/.test(t)) return { intent: "walkthrough", reason: "Asked for a walkthrough." };
  if (/\b(price|pricing|cost|quote|rate|how much)\b/.test(t)) return { intent: "pricing", reason: "Asked about price." };
  if (/\b(interested|sounds good|let's talk|tell me more)\b/.test(t)) return { intent: "interested", reason: "Positive reply." };
  if (/\?/.test(t)) return { intent: "question", reason: "Asked a question." };
  return { intent: "needs-review", reason: "Unclear. A person should read it." };
}
