import Link from "next/link";
import { ArrowUpRight, Terminal } from "lucide-react";
import { profile } from "@/content/site";
import { projects } from "@/content/projects";
import { PrintResumeLink } from "@/components/site/resume-print";

/**
 * 404 — matches the design system (grid texture, mono eyebrows, amber accent)
 * and offers real recovery paths: the case-study deep links are real routes
 * (/#case-<slug>), so a visitor who hit a dead URL is one click from content.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-20 text-center">
        <div className="mx-auto flex items-center gap-2.5" aria-hidden>
          <span className="grid size-7 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
            <Terminal className="size-3.5" />
          </span>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          404 — not found
        </p>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
          Maybe the project you&apos;re looking for went somewhere else. The
          portfolio itself lives on the home page — and the case studies are
          reachable directly from here.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Back home
          </Link>
          <Link
            href="/#work"
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm text-foreground/85 transition-colors hover:bg-secondary"
          >
            View work
          </Link>
        </div>

        {/* Real recovery paths — every case study is a hash deep link away. */}
        <nav
          aria-label="Case study shortcuts"
          className="mx-auto mt-12 w-full max-w-md rounded-xl border border-border/70 bg-card/80 p-5 text-left backdrop-blur-sm"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Jump straight to a case study
          </p>
          <ul className="mt-3 grid gap-1 sm:grid-cols-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/#case-${p.slug}`}
                  className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{ background: p.accent }}
                    aria-hidden
                  />
                  <span className="truncate">{p.name}</span>
                  <ArrowUpRight
                    className="ml-auto size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Same documents as the contact section, as plain links so this
              server-rendered page needs zero hydration to be useful. */}
          <p className="mt-4 border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Or take the documents with you
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            <li>
              <PrintResumeLink className="text-[13px] text-foreground/85 hover:text-foreground" />
            </li>
            <li>
              <a
                href="/api/resume-md"
                download="hamza-mushtaq-resume.md"
                className="link-underline text-[13px] text-foreground/85 transition-colors hover:text-foreground"
              >
                Résumé (Markdown)
              </a>
            </li>
            <li>
              <a
                href="/api/vcard"
                download="hamza-mushtaq.vcf"
                className="link-underline text-[13px] text-foreground/85 transition-colors hover:text-foreground"
              >
                Add to contacts (vCard)
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <footer className="relative border-t border-border/60 py-5 text-center font-mono text-[11px] text-muted-foreground">
        {profile.name} — {profile.role} ·{" "}
        <a
          href={`mailto:${profile.email}`}
          className="link-underline transition-colors hover:text-foreground"
        >
          {profile.email}
        </a>
      </footer>
    </main>
  );
}
