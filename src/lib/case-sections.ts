import type { ProjectSlug } from "@/content/types";

/**
 * Section map — one ordered, uniquely-numbered list per case study.
 *
 * Lives in a server-safe module because it is consumed from both worlds:
 *
 *   - client components (the #case-<slug> overlay mini-TOC, ⌘K palette,
 *     the sticky section rail on /work/<slug>)
 *   - server components (the /work/<slug> route renders the rail's data
 *     during static generation)
 *
 * Numbers must stay in sync with the `num` props of the interactive
 * modules in src/components/case-study/*-visual.tsx and with TRAIL_START
 * in case-study-body.tsx.
 */

export interface CaseSectionMeta {
  num: string;
  title: string;
}

export const CASE_SECTIONS: Record<ProjectSlug, CaseSectionMeta[]> = {
  "dark-pattern-hunter": [
    { num: "01", title: "Overview" },
    { num: "02", title: "The pipeline" },
    { num: "03", title: "Pattern taxonomy" },
    { num: "04", title: "Data engine" },
    { num: "05", title: "Capabilities" },
    { num: "06", title: "Engineering decisions" },
    { num: "07", title: "Built vs used" },
    { num: "08", title: "Technology stack" },
    { num: "09", title: "Design findings" },
    { num: "10", title: "Limitations" },
  ],
  captionai: [
    { num: "01", title: "Overview" },
    { num: "02", title: "The numbers" },
    { num: "03", title: "Experimental ladder" },
    { num: "04", title: "Champion vs baseline" },
    { num: "05", title: "What didn't work" },
    { num: "06", title: "Serving engineering" },
    { num: "07", title: "Engineering decisions" },
    { num: "08", title: "Built vs used" },
    { num: "09", title: "Technology stack" },
    { num: "10", title: "Design findings" },
    { num: "11", title: "Limitations" },
  ],
  chainproof: [
    { num: "01", title: "Overview" },
    { num: "02", title: "How it works" },
    { num: "03", title: "Review lifecycle" },
    { num: "04", title: "Trust stack" },
    { num: "05", title: "Public verification" },
    { num: "06", title: "Engineering decisions" },
    { num: "07", title: "Built vs used" },
    { num: "08", title: "Technology stack" },
    { num: "09", title: "Design findings" },
    { num: "10", title: "Limitations" },
  ],
  anglupol: [
    { num: "01", title: "Overview" },
    { num: "02", title: "Learning loop" },
    { num: "03", title: "Vocabulary foundation" },
    { num: "04", title: "FSRS-4.5" },
    { num: "05", title: "Security & realtime" },
    { num: "06", title: "Engineering decisions" },
    { num: "07", title: "Built vs used" },
    { num: "08", title: "Technology stack" },
    { num: "09", title: "Design findings" },
    { num: "10", title: "Limitations" },
  ],
};

/** Sections of a case study (ordered, uniquely numbered). */
export function getCaseSections(slug: ProjectSlug) {
  return CASE_SECTIONS[slug] ?? [];
}
