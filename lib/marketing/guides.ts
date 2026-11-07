import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdown } from "./markdown";

export const GUIDES = [
  { slug: "ai-search-for-service-businesses", file: "ai-search-for-service-businesses.md", minutes: 9, topic: "AI search" },
  { slug: "why-you-dont-show-up-in-local-search", file: "why-you-dont-show-up-in-local-search.md", minutes: 8, topic: "Being found" },
  { slug: "commercial-cleaning-walkthrough-checklist", file: "commercial-cleaning-walkthrough-checklist.md", minutes: 8, topic: "Winning work" },
  { slug: "follow-up-after-a-cleaning-estimate", file: "follow-up-after-a-cleaning-estimate.md", minutes: 6, topic: "Follow-up" },
] as const;

export function loadGuide(slug: string) {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) return null;
  const doc = parseMarkdown(readFileSync(join(process.cwd(), "content/guides", g.file), "utf8"));
  return { ...g, ...doc };
}
