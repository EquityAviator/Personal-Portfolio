/**
 * Typed content model for the portfolio.
 * Content is data — components are presentation. Adding a project means
 * adding structured data, not rewriting UI.
 */

export type ProjectSlug =
  | "dark-pattern-hunter"
  | "captionai"
  | "chainproof"
  | "anglupol";

export interface StoryStep {
  /** Short label, e.g. "Detect" */
  label: string;
  /** One-line explanation of the step */
  hint: string;
}

export interface Metric {
  label: string;
  value: string;
  /** Context that keeps the metric honest (protocol, split, scope…) */
  context?: string;
}

export interface TechGroup {
  name: string;
  items: string[];
}

export interface Feature {
  title: string;
  description: string;
}

export type CalloutTone = "accent" | "warn" | "danger" | "neutral";

export interface Callout {
  title: string;
  text: string;
  tone?: CalloutTone;
}

export interface Finding {
  title: string;
  text: string;
}

export interface LinkItem {
  label: string;
  href: string;
  external: boolean;
  icon?: "github" | "external" | "demo";
}

export type ProjectStatus =
  | "Live"
  | "Completed"
  | "Research system"
  | "Open Source";

/**
 * V2 project-type taxonomy. Drives project-type renderer selection and the
 * card meta line. Adding a 5th project should require a new content object —
 * at most a new renderer configuration, never new project-specific logic
 * in the shell.
 */
export type ProjectType =
  | "research"
  | "ai-system"
  | "product"
  | "learning"
  | "full-stack";

/** Human-readable labels for ProjectType (single source, keeps UI honest). */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  research: "ML Research",
  "ai-system": "AI System",
  product: "Product",
  learning: "Learning Technology",
  "full-stack": "Full-Stack",
};

/**
 * Media asset descriptor (V2 media architecture — screenshots deferred).
 * `src` is empty/absent until a real capture exists; the MediaSlot component
 * renders a neutral placeholder when no asset is supplied, so adding real
 * screenshots later changes the content file — never the layout system.
 */
export interface MediaAsset {
  src: string;
  alt: string;
  caption?: string;
  type: "image" | "video" | "diagram";
  /** CSS aspect-ratio value, e.g. "16/9" or "4/3" */
  aspectRatio?: string;
  credit?: string;
}

/** Structured media slots per project. All optional by design. */
export interface ProjectMedia {
  hero?: MediaAsset;
  gallery?: MediaAsset[];
  video?: MediaAsset;
  poster?: MediaAsset;
}

export interface Project {
  slug: ProjectSlug;
  /** Display order on the homepage */
  index: string;
  name: string;
  /** Compact name for prev/next navigation and tight UI contexts */
  shortTitle: string;
  /** V2 taxonomy — drives renderer selection and card meta */
  type: ProjectType;
  /** One-line outcome statement (V2 card hierarchy: title → outcome) */
  outcome: string;
  /** One-sentence problem / outcome statement for cards */
  tagline: string;
  categories: string[];
  /** Per-project storytelling motif */
  story: StoryStep[];
  status: ProjectStatus;
  role: string;
  timeline: string;
  /** oklch accent used for this project's identity */
  accent: string;
  domain: string;
  /** Card + case-study summary */
  summary: string;
  problem: string;
  /** 3–4 key metrics for the card */
  cardMetrics: Metric[];
  stackPreview: string[];
  links: LinkItem[];
  /** Case-study: opening paragraphs */
  intro: string[];
  /** Case-study: key features / capability blocks */
  features: Feature[];
  /** Case-study: engineering decisions & honesty callouts */
  callouts: Callout[];
  /** Case-study: "built by me" vs "used as foundations" */
  built: string[];
  used: string[];
  /** Case-study: grouped technology stack */
  stack: TechGroup[];
  /** Case-study: design findings (architectural conclusions, not marketing) */
  findings: Finding[];
  /** Case-study: honest limitations */
  limitations: string[];
  /**
   * V2 media architecture: hero/gallery/video/poster slots. Omitted until
   * real screenshots exist — components must treat absence as normal and
   * render media-ready placeholders with zero layout rework later.
   */
  media?: ProjectMedia;
  /** Typed related-project slugs (rendered as prev/next-style links) */
  relatedProjects: ProjectSlug[];
  /** Keywords for SEO metadata and social sharing */
  keywords: string[];
}
