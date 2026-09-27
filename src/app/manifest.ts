import type { MetadataRoute } from "next";
import { profile } from "@/content/site";

/**
 * Web app manifest — makes the portfolio installable as a standalone app
 * (Add to Home Screen) and gives browsers/PWAs correct identity + theme
 * colors. Icon reuses the existing app icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.shortName,
    description:
      "Software & AI Engineer building AI-enabled software systems — documented projects, evidence-driven research, production engineering.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#161411",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
