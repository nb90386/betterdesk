import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = ["", "/platform", "/how-it-works", "/demo", "/pricing", "/roi", "/solutions", "/solutions/home-services", "/solutions/beauty-wellness", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: "monthly", priority: r === "" ? 1 : 0.7 }));
}
