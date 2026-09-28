import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/site";
import { PROJECT_TYPE_LABELS } from "@/content/types";
import { SITE_URL } from "@/lib/site-url";
import { estimateReadMinutes } from "@/lib/reading";
import {
  CaseStudyProvider,
} from "@/components/case-study/case-study-context";
import { getCaseSections } from "@/lib/case-sections";
import { CaseSectionBar } from "@/components/case-study/case-section-bar";
import { ScrollProgress } from "@/components/site/scroll-progress";
import {
  CaseStudyBody,
  LinkRow,
  MetaChips,
} from "@/components/case-study/case-study-body";
import { StoryRail } from "@/components/case-study/primitives";
import { MediaSlot } from "@/components/case-study/media-slot";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BackToTop } from "@/components/site/back-to-top";
import { cn } from "@/lib/utils";

/**
 * V2 canonical case-study routes: /work/<slug>.
 *
 * The homepage overlay (#case-<slug>) remains as a transition pattern, but
 * every case study now owns a real URL — server-rendered, statically
 * generated, with route-level metadata, JSON-LD and prev/next navigation.
 * Sections a project doesn't support are omitted, never shown as empty
 * placeholders.
 */

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name} — Case Study`;
  const description = project.outcome;
  const url = `/work/${project.slug}`;
  const ogImage = `/api/og?case=${project.slug}`;

  return {
    title,
    description,
    keywords: project.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: `${profile.name} — ${profile.role}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${project.name} case study` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const related = project.relatedProjects
    .map((s) => getProject(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: `${project.name} — ${PROJECT_TYPE_LABELS[project.type]} case study`,
    description: project.outcome,
    url: `${SITE_URL}/work/${project.slug}`,
    genre: project.categories,
    keywords: project.keywords.join(", "),
    dateCreated: project.timeline,
    author: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role,
      url: SITE_URL,
    },
  };

  return (
    <CaseStudyProvider markViewed={project.slug}>
      <div className="flex min-h-dvh flex-col" style={{ ["--pa" as string]: project.accent }}>
        <SiteHeader />
        <main id="main" className="flex-1">
          <article aria-labelledby="case-title">
            {/* per-project accent identity hairline */}
            <div
              aria-hidden
              className="mt-14 h-[3px] w-full"
              style={{
                background: `linear-gradient(90deg, ${project.accent}, color-mix(in oklch, ${project.accent} 28%, transparent) 55%, transparent)`,
              }}
            />

            {/* ---------- Case header ---------- */}
            <header className="border-b border-border/60 bg-card/40 px-4 pb-8 pt-8 sm:px-6">
              <div className="mx-auto w-full max-w-5xl">
                <Link
                  href="/#work"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  All work
                </Link>

                <p className="pa-text mt-6 font-mono text-[10px] uppercase tracking-[0.22em]">
                  Case study {project.index} — {PROJECT_TYPE_LABELS[project.type]} ·{" "}
                  {project.categories.join(" · ")}
                </p>
                <h1
                  id="case-title"
                  className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {project.name}
                </h1>
                <p className="mt-3 max-w-3xl text-balance text-[14.5px] leading-relaxed text-muted-foreground">
                  {project.tagline}
                </p>

                <div className="mt-6">
                  <StoryRail story={project.story} accent={project.accent} compact />
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  <MetaChips project={project} />
                  <LinkRow project={project} />
                </div>

                <p className="mt-5 font-mono text-[10.5px] text-muted-foreground">
                  {project.outcome} <span aria-hidden>·</span> ~
                  {estimateReadMinutes(project)} min read
                </p>
              </div>
            </header>

            {/* ---------- Reading progress (per-project accent) ---------- */}
            <ScrollProgress accent={project.accent} />

            {/* ---------- Sticky section rail (scroll-spy) ---------- */}
            <CaseSectionBar sections={getCaseSections(project.slug)} accent={project.accent} />

            {/* ---------- Media slot (screenshots deferred — layout ready) ---------- */}
            <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
              <MediaSlot asset={project.media?.hero} label={project.shortTitle} priority />
            </div>

            {/* ---------- Case body (shared with the overlay) ---------- */}
            <div className="mx-auto mt-4 w-full max-w-5xl pb-4">
              <CaseStudyBody project={project} next={next} />
            </div>

            {/* ---------- Related projects ---------- */}
            {related.length > 0 && (
              <section
                aria-labelledby="related-heading"
                className="border-t border-border/50 px-4 py-10 sm:px-6"
              >
                <div className="mx-auto w-full max-w-5xl">
                  <h2
                    id="related-heading"
                    className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    <span className="text-primary">↳</span> Related work
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/work/${r.slug}`}
                        className="group rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-border sm:p-5"
                      >
                        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span
                            className="inline-block size-1.5 rounded-full"
                            style={{ background: r.accent }}
                            aria-hidden
                          />
                          {PROJECT_TYPE_LABELS[r.type]}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold tracking-tight">
                          {r.name}
                          <ArrowRight
                            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                            style={{ color: r.accent }}
                            aria-hidden
                          />
                        </p>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                          {r.outcome}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ---------- Prev / next navigation ---------- */}
            <nav
              aria-label="Case study pagination"
              className="grid border-t border-border/50 sm:grid-cols-2 print:hidden"
            >
              <Link
                href={`/work/${prev.slug}`}
                className={cn(
                  "group flex items-center gap-3 px-5 py-6 transition-colors hover:bg-secondary/40 sm:px-8",
                  "border-b border-border/50 sm:border-b-0 sm:border-r"
                )}
              >
                <ArrowLeft
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1"
                  style={{ color: prev.accent }}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Previous
                  </span>
                  <span className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight">
                    {prev.shortTitle}
                  </span>
                </span>
              </Link>
              <Link
                href={`/work/${next.slug}`}
                className="group flex items-center justify-end gap-3 px-5 py-6 text-right transition-colors hover:bg-secondary/40 sm:px-8"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Next
                  </span>
                  <span className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight">
                    {next.shortTitle}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                  style={{ color: next.accent }}
                  aria-hidden
                />
              </Link>
            </nav>
          </article>
        </main>
        <SiteFooter />
        <BackToTop />

        {/* Structured data for the case study (server-rendered) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </CaseStudyProvider>
  );
}
