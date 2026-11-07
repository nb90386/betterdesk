import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Production allows the public marketing routes; the sample workspace and APIs are never indexed.
// Every non-production deployment (previews) disallows everything.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/app", "/api/"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
