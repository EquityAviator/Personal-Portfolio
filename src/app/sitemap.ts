import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * sitemap.xml — the portfolio is a single route; case studies are hash
 * deep links (/#case-<slug>) which search engines index as part of that
 * one URL, so the sitemap lists exactly the canonical page. Listing more
 * would be fabricating crawlable URLs — kept honest instead.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
