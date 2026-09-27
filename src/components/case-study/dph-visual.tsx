"use client";

import * as React from "react";
import { CaseSection } from "./primitives";

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
