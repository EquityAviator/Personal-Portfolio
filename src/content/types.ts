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

export interface Project {
  slug: ProjectSlug;
  /** Display order on the homepage */
  index: string;
  name: string;
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
}
