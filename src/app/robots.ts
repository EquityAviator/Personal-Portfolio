import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * robots.txt — everything on the single-route portfolio is public content
 * (the case studies live at /#case-<slug> hash deep links on the one page),
 * so the blanket allow is honest. No admin or private paths exist to hide.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
