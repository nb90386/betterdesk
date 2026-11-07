/**
 * Prospect-supplied and imported text is untrusted DATA. It can never change Scout's goal, tools
 * or permissions (those come only from the run's scope, set by a signed-in user). This module
 * additionally withholds text that reads like instructions so it is never quoted in a draft or
 * shown as evidence without a human looking at it.
 */
const PATTERNS = [
  /ignore (all |any )?(previous|prior|above) (instructions|prompts?)/i,
  /\b(system|developer) prompt\b/i,
  /\byou are (now )?(an? )?(ai|assistant|scout)\b/i,
  /\b(send|email|text|message) (this|it|everyone|all|the list)\b/i,
  /\b(reveal|print|show) (your|the) (secrets?|keys?|instructions|prompt)\b/i,
  /\b(api[_ -]?key|password|token)\b/i,
  /\bdisregard\b.*\b(rules|instructions|policy)\b/i,
  /<\/?(script|iframe)\b/i,
];

export function looksLikeInstructions(text: string) {
  return PATTERNS.some((p) => p.test(text));
}

/** Plain-text cleanup for display: strips control characters and markup, caps length. */
export function cleanText(text: string, max = 400) {
  return text.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").replace(/<[^>]*>/g, "").replace(/^'/, "").trim().slice(0, max);
}
