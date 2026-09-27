import { profile, heroValue, technicalFocus, skillGroups, education } from "@/content/site";
import { projects } from "@/content/projects";

/**
 * Markdown résumé builder — pure string composition from the typed content
 * files (the same source the print résumé uses), served at /api/resume.md as
 * a downloadable attachment.
 *
 * Why Markdown: plain text survives ATS parsers and copy-paste into forms
 * better than PDF layout, and it stays truthful — every line traces to
 * src/content, nothing is invented or embellished.
 *
 * This module is intentionally server-safe (no DOM) so the API route can use
 * it; the client only needs to hit the route as a normal link.
 */

/** Display form of a full URL, e.g. https://github.com/x → github.com/x */
function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function buildResumeMarkdown(): string {
  const lines: string[] = [];

  /* ---------- Identity ---------- */
  lines.push(`# ${profile.name}`);
  lines.push("");
  lines.push(
    `**${profile.role}** — ${profile.specialization.join(" · ")}`
  );
  lines.push("");
  lines.push(
    [
      `[${profile.email}](mailto:${profile.email})`,
      `[${prettyUrl(profile.github)}](${profile.github})`,
      `[${prettyUrl(profile.linkedin)}](${profile.linkedin})`,
      profile.phone,
      profile.location,
    ].join(" · ")
  );
  lines.push("");
  lines.push(`> ${profile.availability} · ${profile.timezone}`);
  lines.push("");

  /* ---------- Summary ---------- */
  lines.push("## Summary");
  lines.push("");
  lines.push(heroValue);
  lines.push("");

  /* ---------- Technical focus ---------- */
  lines.push("## Technical focus");
  lines.push("");
  for (const f of technicalFocus) {
    lines.push(`- **${f.domain}** — ${f.items}`);
  }
  lines.push("");

  /* ---------- Selected work ---------- */
  lines.push("## Selected work");
  lines.push("");
  for (const p of projects) {
    const repo = p.links.find((l) => l.href.startsWith("https://github.com"));
    const repoPart = repo ? ` — [${prettyUrl(repo.href)}](${repo.href})` : "";
    lines.push(
      `### ${p.name}`
    );
    lines.push("");
    lines.push(`*${p.status} · ${p.role} · ${p.timeline}*`);
    lines.push("");
    lines.push(p.tagline);
    lines.push("");
    lines.push(`${p.stackPreview.join(" · ")}${repoPart}`);
    lines.push("");
  }
  lines.push(
    "Detailed, evidence-driven case studies for each project are available in the interactive portfolio."
  );
  lines.push("");

  /* ---------- Skills ---------- */
  lines.push("## Skills");
  lines.push("");
  for (const g of skillGroups) {
    lines.push(`- **${g.name}** — ${g.items.join(", ")}`);
  }
  lines.push("");

  /* ---------- Education ---------- */
  lines.push("## Education");
  lines.push("");
  for (const e of education) {
    lines.push(`### ${e.school}`);
    lines.push("");
    lines.push(`*${e.period}*`);
    lines.push("");
    lines.push(
      `${e.degree} — ${e.campus}` +
        (e.detail ? ` · ${e.detail}` : "") +
        (e.focus.length ? ` · ${e.focus.join(" · ")}` : "")
    );
    lines.push("");
  }

  /* ---------- Provenance ---------- */
  lines.push("---");
  lines.push("");
  lines.push(
    `Generated from the interactive portfolio of ${profile.name} — ${prettyUrl(profile.github)} · [${profile.email}](mailto:${profile.email})`
  );
  lines.push("");

  return lines.join("\n");
}
