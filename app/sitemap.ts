import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = ["", "/product", "/scout", "/how-it-works", "/solutions/commercial-cleaning", "/pricing", "/security", "/demo", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: "monthly", priority: r === "" ? 1 : 0.7 }));
}
