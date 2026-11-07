import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: "monthly", priority: r === "/" ? 1 : 0.7 }));
}
