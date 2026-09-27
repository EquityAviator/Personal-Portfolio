"use client";

import * as React from "react";
import { profile } from "@/content/site";
import { projects } from "@/content/projects";
import { education, heroValue, skillGroups, technicalFocus } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Print-only résumé document.
 *
 * Rendered at the end of <body> (sibling of the main page wrapper) and hidden
 * on screen. When `printResume()` adds `body.resume-print`, the print layout
 * in globals.css hides every other body child and shows only this document,
 * producing a clean one-file résumé (Cmd/Ctrl+P → PDF).
 *
 * Content is composed exclusively from the typed content files — nothing here
 * invents facts, and the printed links mirror the real repository/contact URLs.
 */

/**
 * Trigger the résumé-only print layout.
 * `compact` additionally adds `body.resume-compact`, which switches the
 * print CSS to a tighter one-page setting (same content, denser typography).
 */
export function printResume(compact = false) {
  document.body.classList.add("resume-print");
  if (compact) document.body.classList.add("resume-compact");
  const cleanup = () => {
    document.body.classList.remove("resume-print");
    document.body.classList.remove("resume-compact");
    window.removeEventListener("afterprint", cleanup);
  };
  // Chromium/Firefox fire afterprint when the dialog is dismissed (either way).
  window.addEventListener("afterprint", cleanup);
  // Safety net for browsers where afterprint doesn't fire on cancel.
  window.setTimeout(cleanup, 60_000);
  window.print();
}

/** Display form of a full URL for print, e.g. https://github.com/x → github.com/x */
function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ResumeHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="resume-heading" data-resume-heading>
      {children}
    </h2>
  );
}

export function ResumePrint() {
  return (
    <div
      data-resume-print
      /* hidden on screen; the body.resume-print print block reveals it */
      className="hidden"
      aria-hidden="true"
    >
      <div className="resume-doc" lang="en">
        {/* Accent identity bar */}
        <div className="resume-rule" aria-hidden />

        {/* ---------- Identity ---------- */}
        {/* NOTE: divs, not header/footer — the global print layout hides
            header/footer elements, which would blank the résumé identity. */}
        <div className="resume-header">
          <h1>{profile.name}</h1>
          <p className="resume-role">
            {profile.role} — {profile.specialization.join(" · ")}
          </p>
          <p className="resume-contact">
            <span>{profile.email}</span>
            <span aria-hidden>·</span>
            <span>{prettyUrl(profile.github)}</span>
            <span aria-hidden>·</span>
            <span>{prettyUrl(profile.linkedin)}</span>
            <span aria-hidden>·</span>
            <span>{profile.phone}</span>
            <span aria-hidden>·</span>
            <span>{profile.location}</span>
          </p>
          <p className="resume-availability">{profile.availability} · {profile.timezone}</p>
        </div>

        {/* ---------- Summary ---------- */}
        <section className="resume-section">
          <ResumeHeading>Summary</ResumeHeading>
          <p className="resume-summary">{heroValue}</p>
        </section>

        {/* ---------- Technical focus ---------- */}
        <section className="resume-section">
          <ResumeHeading>Technical focus</ResumeHeading>
          <div className="resume-focus">
            {technicalFocus.map((f) => (
              <p key={f.domain}>
                <span className="resume-focus-domain">{f.domain}</span>
                <span className="resume-focus-items">{f.items}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ---------- Selected work ---------- */}
        <section className="resume-section">
          <ResumeHeading>Selected work</ResumeHeading>
          <div className="resume-projects">
            {projects.map((p) => {
              const repo = p.links.find((l) => l.href.startsWith("https://github.com"));
              return (
                <article key={p.slug} className="resume-project print-avoid-break">
                  <p className="resume-project-title">
                    <span className="resume-project-name">{p.name}</span>
                    <span className="resume-project-meta">
                      {p.status} · {p.role} · {p.timeline}
                    </span>
                  </p>
                  <p className="resume-project-tagline">{p.tagline}</p>
                  <p className="resume-project-stack">
                    {p.stackPreview.join(" · ")}
                    {repo ? (
                      <>
                        {" — "}
                        <span className="resume-project-link">{prettyUrl(repo.href)}</span>
                      </>
                    ) : null}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="resume-note">
            Detailed, evidence-driven case studies for each project are available in
            the interactive portfolio.
          </p>
        </section>

        {/* ---------- Skills ---------- */}
        <section className="resume-section">
          <ResumeHeading>Skills</ResumeHeading>
          <div className="resume-skills">
            {skillGroups.map((g) => (
              <p key={g.name} className="print-avoid-break">
                <span className="resume-skill-group">{g.name}</span>
                <span className="resume-skill-items">{g.items.join(", ")}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ---------- Education ---------- */}
        <section className="resume-section">
          <ResumeHeading>Education</ResumeHeading>
          <div className="resume-education">
            {education.map((e) => (
              <p key={e.school} className="print-avoid-break">
                <span className="resume-edu-line">
                  <span className="resume-edu-school">{e.school}</span>
                  <span className="resume-project-meta">{e.period}</span>
                </span>
                <span className="resume-edu-detail">
                  {e.degree} — {e.campus}
                  {e.detail ? ` · ${e.detail}` : ""}
                  {e.focus.length ? ` · ${e.focus.join(" · ")}` : ""}
                </span>
              </p>
            ))}
          </div>
        </section>

        {/* ---------- Provenance ---------- */}
        <div className="resume-footer">
          <p>
            Generated from the interactive portfolio of {profile.name} —{" "}
            {prettyUrl(profile.github)} · {profile.email}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer/menu-styled trigger that prints the résumé. Rendered as a button so
 * it can live inside the (server) footer without prop-drilling handlers.
 */
export function PrintResumeLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      /* explicit no-arg call — passing the handler directly would feed the
         click event into the `compact` boolean param (TS-caught bug) */
      onClick={() => printResume()}
      className={cn("link-underline text-left", className)}
      aria-label="Print résumé as PDF"
    >
      Résumé (PDF)
    </button>
  );
}
