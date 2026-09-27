import type { Project } from "@/content/types";

/**
 * Rough reading time from case-study content (no invented metric — it is a
 * UI affordance computed from the words actually documented).
 * Pure + server-safe so any component (client or server) can reuse it.
 */
export function estimateReadMinutes(project: Project): number {
  const words = [
    project.summary,
    project.problem,
    ...project.intro,
    ...project.features.map((f) => `${f.title} ${f.description}`),
    ...project.callouts.map((c) => `${c.title} ${c.text}`),
    ...project.findings.map((f) => `${f.title} ${f.text}`),
    ...project.built,
    ...project.used,
    ...project.limitations,
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

/** Total documented reading time across all case studies (minutes). */
export function totalReadingMinutes(projects: Project[]): number {
  return projects.reduce((n, p) => n + estimateReadMinutes(p), 0);
}
