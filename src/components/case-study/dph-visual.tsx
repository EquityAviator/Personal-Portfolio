"use client";

import * as React from "react";
import { Crosshair, Eye, GraduationCap, RotateCcw } from "lucide-react";
import { CaseSection, OwnerPanel } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * Dark Pattern Hunter — interactive pipeline explorer.
 * Observe → Detect → Ground → Verify, mapped onto the real pipeline stages.
 */

interface Stage {
  key: string;
  label: string;
  detail: string;
  tech: string[];
}

const STAGES: Stage[] = [
  {
    key: "user",
    label: "User",
    detail:
      "The process starts with a real browsing session — the user visits a page exactly as they normally would.",
    tech: ["Context"],
  },
  {
    key: "extension",
    label: "Browser extension",
    detail:
      "A Chrome extension (Manifest V3) observes the active page and triggers analysis on demand — no background scraping of unrelated traffic.",
    tech: ["Chrome Extension APIs", "Manifest V3"],
  },
  {
    key: "capture",
    label: "Page capture",
    detail:
      "The page is captured in two complementary forms: the visual state the user sees, and the structural DOM behind it. Interface manipulation is partly visual and partly structural — both are needed.",
    tech: ["Screenshot", "DOM Snapshot"],
  },
  {
    key: "analysis",
    label: "Structured analysis",
    detail:
      "Raw page data is normalized into structured context: elements, text, layout roles and interaction patterns that a model can reason over reliably.",
    tech: ["DOM Analysis", "Browser Automation"],
  },
  {
    key: "vlm",
    label: "Vision / language model",
    detail:
      "A vision-language model (Qwen family) reasons over screenshot + DOM context to classify suspicious patterns — from false urgency to hidden costs and confirm-shaming.",
    tech: ["Qwen (VLM)", "Structured Outputs"],
  },
  {
    key: "decision",
    label: "Decision engine",
    detail:
      "Model reasoning is converted into a structured verdict per pattern, with a confidence value — never an unexplained score.",
    tech: ["Schema Validation"],
  },
  {
    key: "grounding",
    label: "Result grounding",
    detail:
      "Each detection is attached to the specific page element it refers to, so users can see exactly what was flagged and why.",
    tech: ["Element Mapping"],
  },
  {
    key: "record",
    label: "Report / record",
    detail:
      "Findings, evidence and page context are recorded — powering user-facing reports, educational context, and a growing dataset for model work.",
    tech: ["Recording", "Dataset Creation"],
  },
];

export function DphPipeline({ accent }: { accent: string }) {
  const [active, setActive] = React.useState(4); // default: the VLM stage
  const stage = STAGES[active];

  return (
    <CaseSection num="02" title="How it works — the pipeline">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Step rail */}
        <ol className="relative flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Pipeline stages">
          {STAGES.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.key} className="shrink-0 lg:shrink">
                <button
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? "border-transparent bg-secondary"
                      : "border-border/60 hover:bg-secondary/50"
                  }`}
                >
                  <span
                    className="grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[9px]"
                    style={{
                      borderColor: isActive ? accent : "var(--border)",
                      color: isActive ? accent : "var(--muted-foreground)",
                      background: isActive
                        ? `color-mix(in oklch, ${accent} 12%, transparent)`
                        : "transparent",
                    }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[12.5px] ${
                      isActive ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Detail panel — content vertically centered against the taller rail */}
        <div
          className="flex min-h-[13rem] flex-col justify-center rounded-xl border p-5 lg:min-h-0"
          style={{ borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }}
          aria-live="polite"
        >
          <div key={stage.key} className="stage-in">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Stage {String(active + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
            </p>
            <p className="pa-text mt-2 text-base font-semibold">
              {stage.label}
            </p>
            <p className="mt-2.5 max-w-prose text-[13.5px] leading-relaxed text-foreground/80">
              {stage.detail}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stage technologies">
              {stage.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Pattern taxonomy — the documented core categories                    */
/* ------------------------------------------------------------------ */

interface PatternCategory {
  key: string;
  name: string;
  modality: "Visual" | "Structural" | "Language";
  modalityNote: string;
  mock: string;
  grounding: string;
  learn: string;
}

const PATTERNS: PatternCategory[] = [
  {
    key: "false-urgency",
    name: "False urgency",
    modality: "Visual",
    modalityNote:
      "Lives in pixels — a countdown timer is visual pressure, exactly where screenshot reasoning matters.",
    mock: "⏱ Offer ends in 04:59 — 2 left in stock",
    grounding:
      "The detection is grounded to the specific element carrying the timer, so the user can see exactly what was flagged and why.",
    learn: "Recognize manufactured scarcity: real deadlines don't reset when you reload.",
  },
  {
    key: "hidden-costs",
    name: "Hidden costs",
    modality: "Structural",
    modalityNote:
      "Lives in the DOM — a hidden subscription is structural, revealed by the page's markup rather than its looks.",
    mock: "Total at checkout: $39.99 (+ $9.99 service fee)",
    grounding:
      "DOM analysis ties the finding to the element that introduces the fee — the exact node where the price changed.",
    learn: "Compare the first price you saw with the last one you pay. The gap is the pattern.",
  },
  {
    key: "confirm-shaming",
    name: "Confirm-shaming",
    modality: "Language",
    modalityNote:
      "Lives in wording — guilt-tripping copy that punishes the user for declining.",
    mock: "“No thanks, I don't want to save money”",
    grounding:
      "The finding attaches to the text element holding the phrasing, with the model's reasoning recorded alongside it.",
    learn: "A decline button shouldn't insult you. Neutral wording is the fair default.",
  },
];

export function PatternTaxonomy({ accent }: { accent: string }) {
  const [active, setActive] = React.useState(0);
  const pattern = PATTERNS[active];

  return (
    <CaseSection num="03" title="The pattern taxonomy — what counts as manipulation">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        The documented core categories span all three ways an interface can
        manipulate: visually, structurally, and through wording. Select one to
        inspect how detection, grounding and education apply.
      </p>

      {/* Category selector */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-3" role="tablist" aria-label="Pattern categories">
        {PATTERNS.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={cn(
                "group rounded-xl border p-4 text-left transition-all",
                isActive
                  ? "bg-secondary"
                  : "border-border/60 hover:bg-secondary/50"
              )}
              style={
                isActive
                  ? { borderColor: `color-mix(in oklch, ${accent} 45%, transparent)` }
                  : undefined
              }
            >
              <span className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-[13.5px] font-medium",
                    isActive ? "text-foreground" : "text-foreground/75"
                  )}
                >
                  {p.name}
                </span>
                <Eye
                  className="size-3.5 shrink-0 transition-opacity"
                  style={{
                    color: isActive ? accent : "var(--muted-foreground)",
                    opacity: isActive ? 1 : 0.45,
                  }}
                  aria-hidden
                />
              </span>
              <span
                className="mt-2 inline-block rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em]"
                style={{
                  background: `color-mix(in oklch, ${accent} ${isActive ? 14 : 8}%, transparent)`,
                  color: `color-mix(in oklch, ${accent} 75%, var(--foreground))`,
                }}
              >
                {p.modality}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div
        className="mt-4 rounded-xl border p-5"
        style={{ borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }}
        aria-live="polite"
      >
        <div key={pattern.key} className="stage-in grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {pattern.name} · {pattern.modality} pattern
            </p>
            <p className="mt-2 max-w-prose text-[13.5px] leading-relaxed text-foreground/80">
              {pattern.modalityNote}
            </p>

            <dl className="mt-4 space-y-3.5">
              <div className="flex gap-3">
                <Crosshair className="mt-0.5 size-4 shrink-0" style={{ color: accent }} aria-hidden />
                <div>
                  <dt className="text-[12.5px] font-medium">Grounding</dt>
                  <dd className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                    {pattern.grounding}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <GraduationCap className="mt-0.5 size-4 shrink-0" style={{ color: accent }} aria-hidden />
                <div>
                  <dt className="text-[12.5px] font-medium">What the user learns</dt>
                  <dd className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                    {pattern.learn}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Illustrative mock */}
          <div className="flex flex-col justify-center gap-2">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Illustrative example
            </p>
            <div className="rounded-lg border border-border/70 bg-background p-3.5">
              <p className="text-[12.5px] leading-relaxed text-foreground/85">
                {pattern.mock}
              </p>
            </div>
            <p className="text-[10.5px] leading-relaxed text-muted-foreground">
              Findings are recorded as pattern + grounding + reasoning with
              confidence — never an unexplained score.
            </p>
          </div>
        </div>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Data engine — detection pipeline doubles as a training-data loop     */
/* ------------------------------------------------------------------ */

const DATA_LOOP = [
  {
    key: "capture",
    label: "Capture",
    detail:
      "Each analyzed page is captured in both forms — the visual state and the structural DOM — with the user's normal browsing as the trigger.",
  },
  {
    key: "analyze",
    label: "Analyze",
    detail:
      "Structured analysis normalizes the raw capture into elements, text and layout roles a model can reason over.",
  },
  {
    key: "record",
    label: "Record",
    detail:
      "Findings are stored with their evidence: pattern, grounding, model reasoning and confidence — inspectable, comparable, reusable.",
  },
  {
    key: "curate",
    label: "Curate & annotate",
    detail:
      "Recorded pages feed a custom dataset creation and annotation workflow — the project's own data, labeled for model work.",
  },
  {
    key: "finetune",
    label: "Fine-tune",
    detail:
      "Vision–language model experiments and fine-tuning run against that recorded dataset, closing the loop between product usage and model work.",
  },
  {
    key: "evaluate",
    label: "Evaluate",
    detail:
      "Evaluation is conducted against the project's own recorded dataset — no public benchmark scores are documented, and none are claimed.",
  },
];

export function DataEngine({ accent }: { accent: string }) {
  const [active, setActive] = React.useState(3); // default: curate & annotate
  const stage = DATA_LOOP[active];

  return (
    <CaseSection num="04" title="The data engine — detection becomes training data">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        The pipeline doubles as a data engine: pages captured, analyzed and
        recorded in a way that supports custom dataset creation, VLM
        experimentation and fine-tuning. Every analysis is potential training
        signal.
      </p>

      {/* Loop rail */}
      <ol
        className="mt-6 flex flex-wrap items-stretch gap-1.5"
        aria-label="Data engine loop stages"
      >
        {DATA_LOOP.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.key} className="flex items-center">
              <button
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition-colors",
                  isActive
                    ? "bg-secondary"
                    : "border-border/60 hover:bg-secondary/50"
                )}
                style={
                  isActive
                    ? { borderColor: `color-mix(in oklch, ${accent} 45%, transparent)` }
                    : undefined
                }
              >
                <span
                  className="block font-mono text-[9.5px]"
                  style={{ color: isActive ? accent : "var(--muted-foreground)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[12px]",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < DATA_LOOP.length - 1 && (
                <span className="mx-1 font-mono text-[10px] text-muted-foreground" aria-hidden>
                  →
                </span>
              )}
              {i === DATA_LOOP.length - 1 && (
                <span
                  className="ml-1.5 flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground"
                  title="Evaluate feeds back into detection"
                >
                  <RotateCcw className="size-3" aria-hidden />
                  loop
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Detail */}
      <div
        className="mt-4 rounded-xl border p-5"
        style={{ borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }}
        aria-live="polite"
      >
        <div key={stage.key} className="stage-in">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Loop stage {String(active + 1).padStart(2, "0")} / {String(DATA_LOOP.length).padStart(2, "0")}
          </p>
          <p className="pa-text mt-2 text-base font-semibold">{stage.label}</p>
          <p className="mt-2.5 max-w-prose text-[13.5px] leading-relaxed text-foreground/80">
            {stage.detail}
          </p>
        </div>
      </div>

      {/* Owner-documented dataset collection stats (screenshot-provided) */}
      <div
        className="mt-5 rounded-xl border p-5"
        style={{ borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Dataset collection — owner-documented panel
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            ["98", "websites scanned"],
            ["794", "patterns found"],
            ["98.9%", "prevalence rate"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg bg-secondary/50 px-2 py-3">
              <dd className="font-mono text-lg font-semibold tracking-tight" style={{ color: accent }}>
                {v}
              </dd>
              <dt className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{l}</dt>
            </div>
          ))}
        </dl>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Most frequent recorded patterns">
          {[
            ["Reference pricing", "495"],
            ["Scarcity & popularity", "110"],
            ["Hidden information", "39"],
            ["FOMO / urgency", "39"],
          ].map(([name, n]) => (
            <li
              key={name}
              className="rounded-md border border-border/60 bg-background px-2 py-1 font-mono text-[10.5px] text-muted-foreground"
            >
              {name}: <span className="font-semibold text-foreground/90">{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
          Recordings export to training JSON, full-backup JSON, JSONL text, UI-TARS, COCO and YOLO
          formats — the curation stage feeds fine-tuning directly.
        </p>
      </div>

      {/* Honesty note */}
      <div className="mt-3 rounded-xl border border-border/70 bg-secondary/40 p-4">
        <p className="text-[13px] leading-relaxed text-foreground/85">
          <span className="font-medium">Stated plainly:</span> evaluation runs
          against the project&apos;s own recorded dataset — no public benchmark
          scores are documented for this system, and this page doesn&apos;t
          invent any.
        </p>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Product surface — owner-documented                                   */
/* ------------------------------------------------------------------ */

export function DphProductSurface({ accent }: { accent: string }) {
  return (
    <OwnerPanel title="Product surface" accent={accent}>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {[
          [
            "Bring-your-own inference",
            "Settings switches between three AI providers — OpenAI (cloud), OpenRouter free models (e.g. google/gemma-4-31b-it:free) and local AI via LM Studio (default host http://localhost:1234, model qwen3.5-4b shown active). Keys stay with the user.",
          ],
          [
            "Role-gated accounts",
            "Supabase auth — email/password plus Google and Facebook OAuth — with role checks: \u201cLimited account: AI settings are available only for admin and user roles.\u201d",
          ],
          [
            "Live Guard",
            "One-tap real-time scan — \u201cfull-page scan with scroll & interaction\u201d — with the active local model badged in the panel while it works.",
          ],
          [
            "Batch tooling",
            "Dataset Collection exposes Analyze Current Page, Batch Process (Manual URLs) and Batch Process (Auto Crawl) next to the export formats.",
          ],
        ].map(([t, d]) => (
          <li key={t} className="rounded-lg border border-border/60 bg-secondary/30 p-3.5">
            <p className="flex items-center gap-2 text-[12.5px] font-medium">
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: accent }}
                aria-hidden
              />
              {t}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
    </OwnerPanel>
  );
}
