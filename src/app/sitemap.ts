import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { projects } from "@/content/projects";

/**
 * sitemap.xml — the homepage plus one canonical route per case study
 * (/work/<slug>). Case-study hash deep links (/#case-<slug>) remain as a
 * transition pattern but are not listed; the routes are the canonical URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
