"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Github, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Section } from "./section";
import { Reveal } from "@/components/motion/reveal";
import { estimateReadMinutes } from "@/lib/reading";
import { useCaseStudy } from "@/components/case-study/case-study-context";
import { MediaSlot } from "@/components/case-study/media-slot";
import { PROJECT_TYPE_LABELS } from "@/content/types";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Mini visuals — one per project, each a distinct engineering motif    */
/* ------------------------------------------------------------------ */

function DphVisual({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 220 84" className="h-20 w-full" role="img" aria-label="Browser page being scanned for dark patterns">
      <rect x="6" y="6" width="150" height="72" rx="6" fill="none" stroke="currentColor" className="text-border" strokeWidth="1.2" />
      <rect x="6" y="6" width="150" height="12" rx="6" fill="currentColor" className="text-secondary" />
      <circle cx="15" cy="12" r="1.8" fill="currentColor" className="text-border" />
      <circle cx="22" cy="12" r="1.8" fill="currentColor" className="text-border" />
      {/* flagged element */}
      <rect x="18" y="28" width="60" height="10" rx="2" fill="currentColor" className="text-secondary" />
      <rect x="18" y="44" width="126" height="6" rx="2" fill="currentColor" className="text-secondary/70" />
      <rect x="18" y="54" width="100" height="6" rx="2" fill="currentColor" className="text-secondary/70" />
      <rect x="96" y="24" width="48" height="18" rx="3" fill={accent} opacity="0.85" />
      {/* scan brackets */}
      <g stroke={accent} strokeWidth="1.4" fill="none" strokeLinecap="square">
        <path d="M92 20 h-6 v4 M148 20 h6 v4 M92 46 h-6 v-4 M148 46 h6 v-4" />
      </g>
      {/* analysis panel */}
      <rect x="164" y="14" width="50" height="56" rx="6" fill="none" stroke="currentColor" className="text-border" strokeWidth="1.2" />
      <path d="M170 26 h38 M170 34 h30 M170 42 h34 M170 50 h26" stroke="currentColor" className="text-border" strokeWidth="1.4" />
      <circle cx="189" cy="60" r="6" fill="none" stroke={accent} strokeWidth="1.4" />
      <path d="M186 60 l2.5 2.5 L193 57" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaptionVisual({ accent }: { accent: string }) {
  const bars = [34, 46, 60, 72];
  return (
    <svg viewBox="0 0 220 84" className="h-20 w-full" role="img" aria-label="Model generations improving step by step">
      <g>
        {bars.map((h, i) => (
          <g key={i}>
            <rect
              x={24 + i * 34}
              y={78 - h}
              width={22}
              height={h}
              rx={3}
              fill={i === bars.length - 1 ? accent : "currentColor"}
              className={i === bars.length - 1 ? "" : "text-border"}
            />
          </g>
        ))}
        {/* trend line */}
        <polyline
          points="35,52 69,40 103,26 137,10"
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
        <circle cx="137" cy="10" r="3" fill={accent} />
        <text x="152" y="14" fontSize="9" fill={accent} fontFamily="monospace">champion</text>
        {/* baseline label */}
        <text x="24" y="80" fontSize="8" fill="currentColor" className="text-muted-foreground" fontFamily="monospace">baseline</text>
      </g>
    </svg>
  );
}

function ChainVisual({ accent }: { accent: string }) {
  const nodes = [28, 76, 124, 172];
  return (
    <svg viewBox="0 0 220 84" className="h-20 w-full" role="img" aria-label="Proof chain — review, analysis, hash, verification">
      <line x1="28" y1="34" x2="172" y2="34" stroke="currentColor" className="text-border" strokeWidth="1.4" />
      {nodes.map((x, i) => (
        <g key={x}>
          <circle
            cx={x}
            cy="34"
            r="7"
            fill={i >= 2 ? accent : "currentColor"}
            className={i >= 2 ? "" : "text-border"}
          />
          <circle cx={x} cy="34" r="3" fill="var(--background)" />
        </g>
      ))}
      <text x="16" y="58" fontSize="8" fill="currentColor" className="text-muted-foreground" fontFamily="monospace">review → ai → decision → hash → ledger</text>
      <rect x="16" y="64" width="82" height="12" rx="3" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />
      <text x="22" y="73" fontSize="7.5" fill={accent} fontFamily="monospace">sha-256 · abc8…91f</text>
      <rect x="112" y="64" width="60" height="12" rx="3" fill="none" stroke={accent} strokeWidth="1" />
      <text x="121" y="73" fontSize="7.5" fill={accent} fontFamily="monospace">✓ verified</text>
    </svg>
  );
}

function AngluPolVisual({ accent }: { accent: string }) {
  const states = [
    { x: 30, label: "learn" },
    { x: 78, label: "remember" },
    { x: 128, label: "practice" },
    { x: 178, label: "master" },
  ];
  return (
    <svg viewBox="0 0 220 84" className="h-20 w-full" role="img" aria-label="Spaced repetition loop with learning states">
      {/* loop */}
      <path d="M30 40 h148" stroke="currentColor" className="text-border" strokeWidth="1.4" fill="none" />
      <path d="M178 40 c14 0 14 24 0 24 H40 c-14 0 -14 -24 0 -24" stroke={accent} strokeWidth="1.2" fill="none" strokeDasharray="4 3" />
      {states.map((s, i) => (
        <g key={s.x}>
          <circle cx={s.x} cy="40" r="6.5" fill={i === 3 ? accent : "currentColor"} className={i === 3 ? "" : "text-border"} />
          <text x={s.x} y="26" fontSize="7.5" fill="currentColor" className="text-muted-foreground" fontFamily="monospace" textAnchor="middle">{s.label}</text>
        </g>
      ))}
      <text x="30" y="80" fontSize="8" fill="currentColor" className="text-muted-foreground" fontFamily="monospace">FSRS-4.5 · 15.6k senses · next review ↓</text>
      <text x="158" y="80" fontSize="8" fill={accent} fontFamily="monospace">+2d</text>
    </svg>
  );
}

const VISUALS: Record<Project["slug"], React.ComponentType<{ accent: string }>> = {
  "dark-pattern-hunter": DphVisual,
  captionai: CaptionVisual,
  chainproof: ChainVisual,
  anglupol: AngluPolVisual,
};

const LINK_ICONS = { github: Github, demo: Globe, external: ExternalLink } as const;

/* ------------------------------------------------------------------ */
/* Project card                                                         */
/* ------------------------------------------------------------------ */

function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const Visual = VISUALS[project.slug];
  const router = useRouter();
  // Session-local orientation: has this case study been read (overlay open
  // or canonical route visit) during this browser session?
  const { viewed } = useCaseStudy();
  const isViewed = viewed.includes(project.slug);

  // Cursor spotlight: write position directly to CSS vars (no re-render).
  const onSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // V2: cards navigate to the canonical route /work/<slug>.
  const openRoute = () => router.push(`/work/${project.slug}`);

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      onClick={openRoute}
      onMouseMove={onSpotlightMove}
      className="work-card group relative flex isolate cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card hover:-translate-y-0.5"
      style={{ ["--pa" as string]: project.accent }}
    >
      {/* accent edge */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 opacity-70 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* meta row — index · type · timeline | status */}
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="pa-text">{project.index}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{PROJECT_TYPE_LABELS[project.type]}</span>
            <span aria-hidden>·</span>
            <span className="shrink-0">{project.timeline}</span>
          </p>
          <span
            className="pa-text inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
            style={{
              background: `color-mix(in oklch, ${project.accent} 10%, transparent)`,
            }}
          >
            {project.status === "Live" && (
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: project.accent }} />
                <span className="relative inline-flex size-1.5 rounded-full" style={{ background: project.accent }} />
              </span>
            )}
            {project.status}
          </span>
        </div>

        <h3 className="mt-3.5 text-xl font-semibold tracking-tight sm:text-[1.35rem]">
          <Link
            href={`/work/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="decoration-border underline-offset-4 transition-colors hover:underline"
          >
            {project.name}
          </Link>
        </h3>
        {/* V2 card hierarchy: large title → one-line outcome → context */}
        <p className="mt-1.5 text-pretty text-[13.5px] font-medium leading-relaxed text-foreground/90">
          {project.outcome}
        </p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        {/* media slot — per-project diagram motif until a real screenshot lands */}
        <div
          className="mt-5 rounded-xl border p-3"
          style={{
            borderColor: `color-mix(in oklch, ${project.accent} 18%, transparent)`,
            background: `color-mix(in oklch, ${project.accent} 4%, transparent)`,
          }}
        >
          {project.media?.hero ? (
            <MediaSlot asset={project.media.hero} label={project.shortTitle} priority />
          ) : (
            <Visual accent={project.accent} />
          )}
        </div>

        {/* story strip */}
        <p className="mt-5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
          narrative
        </p>
        <p className="pa-text mt-1.5 font-mono text-[11.5px] leading-relaxed">
          {project.story.map((s, i) => (
            <React.Fragment key={s.label}>
              {s.label}
              {i < project.story.length - 1 && (
                <span className="mx-1.5 text-muted-foreground" aria-hidden>
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </p>

        {/* metrics */}
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-4">
          {project.cardMetrics.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
                {m.label}
              </dt>
              <dd className="mt-0.5 font-mono text-[12.5px] font-semibold text-foreground">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* stack preview */}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Key technologies">
          {project.stackPreview.map((t) => (
            <li
              key={t}
              className="rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* actions — primary: canonical route; secondary: repo/demo links */}
        <div
          className="mt-5 flex items-center justify-between gap-3 border-t border-border/50 pt-4 print:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors"
          >
            <span
              className="pa-text border-b border-transparent transition-colors group-hover:border-current"
              aria-hidden
            >
              Open case study
            </span>
            <span className="font-mono text-[10px] font-normal text-muted-foreground" aria-hidden>
              ~{estimateReadMinutes(project)} min
            </span>
            {isViewed && (
              <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-muted-foreground" title="Opened earlier this session">
                <Check
                  className="size-3"
                  style={{ color: project.accent }}
                  aria-label="Already viewed this session"
                />
                Viewed
              </span>
            )}
            <ArrowRight
              className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <div className="flex items-center gap-1">
            {project.links.map((l) => {
              const Icon = LINK_ICONS[l.icon ?? "external"];
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} — ${l.label}`}
                  onClick={(e) => e.stopPropagation()}
                  className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */

export function SelectedWork() {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Systems, products and experiments I've built"
      description="Four documented systems across multimodal AI, machine-learning research, trust infrastructure and full-stack product engineering. Each case study adapts its storytelling to what the project actually is."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <Reveal>
        <p className="print:hidden mt-6 text-center font-mono text-[11px] text-muted-foreground">
          All metrics shown are documented project outputs with their evaluation context — nothing rounded up, nothing invented.
        </p>
      </Reveal>
    </Section>
  );
}
