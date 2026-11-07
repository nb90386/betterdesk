import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdown } from "./markdown";

export const GUIDES = [{ slug: "ai-search-for-service-businesses", file: "ai-search-for-service-businesses.md", minutes: 8 }] as const;

export function loadGuide(slug: string) {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) return null;
  const doc = parseMarkdown(readFileSync(join(process.cwd(), "content/guides", g.file), "utf8"));
  return { ...g, ...doc };
}
