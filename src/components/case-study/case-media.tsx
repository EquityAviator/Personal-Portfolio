"use client";

import { MediaSlot } from "./media-slot";
import { getCaseMediaFor } from "@/content/case-media";
import { AVAILABLE_CASE_MEDIA } from "@/content/case-media.generated";
import type { Project } from "@/content/types";

/**
 * Screenshot gallery for one case-study section.
 *
 * Renders the manifest entries mapped to (project, section) — but ONLY the
 * ones whose converted WebP asset actually exists (see
 * scripts/ingest-media.ts + case-media.generated.ts). With no assets yet it
 * renders nothing, so sections never look unfinished; the moment the owner's
 * screenshots are ingested, each gallery appears in its documented spot with
 * zero further code changes.
 */
export function CaseMedia({ project, section }: { project: Project; section: string }) {
  const entries = getCaseMediaFor(project.slug, section).filter((e) =>
    AVAILABLE_CASE_MEDIA.includes(e.id)
  );
  if (entries.length === 0) return null;

  return (
    <div className="mt-5 grid gap-4">
      {entries.map((e) => (
        <MediaSlot
          key={e.id}
          asset={{
            src: `/media/${project.slug}/${e.id}.webp`,
            alt: e.alt,
            caption: e.caption,
            type: "image",
            aspectRatio: e.aspectRatio,
          }}
          label={e.alt}
          fit="contain"
        />
      ))}
    </div>
  );
}
