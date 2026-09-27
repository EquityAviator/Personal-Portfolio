"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, Github, Globe } from "lucide-react";
import Link from "next/link";
import {
  CalloutCard,
  CaseSection,
  FindingsList,
  LimitationsList,
  MetricGrid,
  SplitList,
  StackGrid,
} from "./primitives";
import { DphPipeline } from "./dph-visual";
import {
  ChampionTable,
  ExperimentLadder,
  FailureLedger,
  ServingEngineering,
} from "./captionai-visual";
import {
  LifecycleStates,
  TrustStack,
  VerifySim,
} from "./chainproof-visual";
import {
  FsrsSimulator,
  LearningLoop,
  SecurityRealtime,
  VocabularyFoundation,
} from "./anglupol-visual";
import type { Project, ProjectSlug } from "@/content/types";

/**
 * V2 extraction: the case-study BODY (overview → interactive modules →
 * shared evidence sections → next-case handoff) lives here, shared by
 *
 *   1. the homepage overlay  (#case-<slug>, transition pattern — onOpenNext)
 *   2. the canonical routes  (/work/<slug>, link-based handoff)
 *
 * Project-specific interactive modules stay registered per slug — they are
 * the "genuinely unique interactive explanations" the spec allows. Adding a
 * fifth project requires new content plus, at most, one registry entry here.
 */

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Where the shared (non-project-specific) section numbering starts.
 *  Must stay in sync with CASE_SECTIONS in case-study-overlay.tsx. */
const TRAIL_START: Record<ProjectSlug, number> = {
  "dark-pattern-hunter": 4,
  captionai: 7,
  chainproof: 6,
  anglupol: 6,
};

export function LinkRow({ project }: { project: Project }) {
  const icons = { github: Github, demo: Globe, external: ExternalLink };
  return (
    <div className="flex flex-wrap gap-2">
      {project.links.map((l) => {
        const Icon = icons[l.icon ?? "external"];
        return (
          <a
            key={l.href + l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1 text-[12px] text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Icon className="size-3.5" aria-hidden />
            {l.label}
            <ExternalLink className="size-3 text-muted-foreground" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

export function MetaChips({ project }: { project: Project }) {
  const meta = [
    ["Role", project.role],
    ["Timeline", project.timeline],
    ["Status", project.status],
    ["Domain", project.domain],
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
      {meta.map(([k, v]) => (
        <div key={k}>
          <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {k}
          </dt>
          <dd className="mt-0.5 text-[12px] leading-snug text-foreground/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FeaturesGrid({
  features,
  accent,
}: {
  features: Project["features"];
  accent: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map((f) => (
        <div key={f.title} className="rounded-xl border border-border/70 bg-card p-4 sm:p-5">
          <p className="flex items-center gap-2 text-[13.5px] font-medium">
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: accent }}
              aria-hidden
            />
            {f.title}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyBody({
  project,
  next,
  onOpenNext,
}: {
  project: Project;
  /** The next project in reading order (optional) */
  next?: Project;
  /**
   * Overlay mode: open the next case inside the dialog.
   * Omitted on routes → the handoff renders as a real link to /work/<slug>.
   */
  onOpenNext?: (slug: ProjectSlug) => void;
}) {
  const trail = TRAIL_START[project.slug];

  return (
    <>
      <CaseSection num="01" title="Overview">
        <div className="max-w-3xl space-y-3.5">
          {project.intro.map((p, i) => (
            <p key={i} className="text-[14px] leading-relaxed text-foreground/85">
              {p}
            </p>
          ))}
        </div>
      </CaseSection>

      {project.slug === "dark-pattern-hunter" && (
        <>
          <div className="border-t border-border/50" />
          <DphPipeline accent={project.accent} />
          <CaseSection num="03" title="Capabilities">
            <FeaturesGrid features={project.features} accent={project.accent} />
          </CaseSection>
        </>
      )}

      {project.slug === "captionai" && (
        <>
          <div className="border-t border-border/50" />
          <CaseSection num="02" title="The numbers — protocol-annotated">
            <MetricGrid
              metrics={[
                { label: "BLEU-1", value: "0.6559", context: "+22.9% vs baseline · full 1,214-image validation split" },
                { label: "BLEU-4", value: "0.1727", context: "+41.8% vs baseline" },
                { label: "ROUGE-L", value: "0.2782", context: "+25.5% vs baseline" },
                { label: "CIDEr-D", value: "0.5243", context: "trade-off vs CLIP-CE 0.6207 — documented" },
                { label: "CHAIR-img", value: "47.3%", context: "down from CLIP-CE's 61.9% (CHAIR-lite protocol)" },
                { label: "ECE served", value: "0.0862", context: "raw 0.2542 → T=1.3 temperature scaling" },
                { label: "CPU latency", value: "~590 ms", context: "warm request · 16 GB CPU-only machine" },
                { label: "Model size", value: "8.42M", context: "parameters · 32 MB checkpoint" },
              ]}
            />
          </CaseSection>
          <div className="border-t border-border/50" />
          <ExperimentLadder accent={project.accent} />
          <div className="border-t border-border/50" />
          <ChampionTable />
          <div className="border-t border-border/50" />
          <FailureLedger />
          <div className="border-t border-border/50" />
          <ServingEngineering />
        </>
      )}

      {project.slug === "chainproof" && (
        <>
          <div className="border-t border-border/50" />
          <CaseSection num="02" title="How it works">
            <FeaturesGrid features={project.features} accent={project.accent} />
          </CaseSection>
          <div className="border-t border-border/50" />
          <LifecycleStates accent={project.accent} />
          <div className="border-t border-border/50" />
          <TrustStack accent={project.accent} />
          <div className="border-t border-border/50" />
          <VerifySim accent={project.accent} />
        </>
      )}

      {project.slug === "anglupol" && (
        <>
          <div className="border-t border-border/50" />
          <LearningLoop accent={project.accent} />
          <div className="border-t border-border/50" />
          <VocabularyFoundation />
          <div className="border-t border-border/50" />
          <FsrsSimulator accent={project.accent} />
          <div className="border-t border-border/50" />
          <SecurityRealtime />
        </>
      )}

      {/* Callouts */}
      <div className="border-t border-border/50" />
      <CaseSection num={pad2(trail)} title="Engineering decisions & honesty">
        <div className="grid gap-3 md:grid-cols-2">
          {project.callouts.map((c) => (
            <CalloutCard key={c.title} callout={c} />
          ))}
        </div>
      </CaseSection>

      <div className="border-t border-border/50" />
      <CaseSection num={pad2(trail + 1)} title="What I built vs what I used">
        <SplitList built={project.built} used={project.used} />
      </CaseSection>

      <div className="border-t border-border/50" />
      <CaseSection num={pad2(trail + 2)} title="Technology stack">
        <StackGrid stack={project.stack} />
      </CaseSection>

      <div className="border-t border-border/50" />
      <CaseSection num={pad2(trail + 3)} title="Design findings">
        <FindingsList findings={project.findings} />
      </CaseSection>

      <div className="border-t border-border/50" />
      <CaseSection num={pad2(trail + 4)} title="Limitations — stated plainly">
        <LimitationsList items={project.limitations} />
      </CaseSection>

      {/* Next case handoff — overlay button vs route link */}
      {next && (
        <div className="border-t border-border/50 print:hidden">
          {onOpenNext ? (
            <button
              onClick={() => onOpenNext(next.slug)}
              className="group flex w-full items-center justify-between gap-4 px-5 py-6 text-left transition-colors hover:bg-secondary/40 sm:px-8"
            >
              <NextCaseLabel next={next} />
              <ArrowRight
                className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                style={{ color: next.accent }}
                aria-hidden
              />
            </button>
          ) : (
            <Link
              href={`/work/${next.slug}`}
              className="group flex w-full items-center justify-between gap-4 px-5 py-6 text-left transition-colors hover:bg-secondary/40 sm:px-8"
            >
              <NextCaseLabel next={next} />
              <ArrowRight
                className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                style={{ color: next.accent }}
                aria-hidden
              />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function NextCaseLabel({ next }: { next: Project }) {
  return (
    <span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Next case study
      </span>
      <span className="mt-1 block text-lg font-semibold tracking-tight">
        {next.shortTitle}
      </span>
      <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
        {next.categories.join(" · ")}
      </span>
    </span>
  );
}
