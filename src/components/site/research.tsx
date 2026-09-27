"use client";

import { ArrowRight, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "./section";
import { useCaseStudy } from "@/components/case-study/case-study-context";
import { researchIntro } from "@/content/site";
import type { StoryStep } from "@/content/types";

const method: StoryStep[] = [
  { label: "Hypothesis", hint: "Name the bottleneck precisely" },
  { label: "Experiment", hint: "Change one variable, hold the rest" },
  { label: "Evidence", hint: "One protocol · saved artifacts" },
  { label: "Decision", hint: "Keep, reject, or correct — on record" },
];

const principles = [
  {
    title: "One fixed evaluation protocol",
    text: "Flickr8K · 1,214-image validation split · seed 42 · beam-5 · GNMT α = 1.2. Every experiment measured on the same protocol — no cherry-picked splits.",
  },
  {
    title: "Artifact provenance",
    text: "Every headline number traces back to a saved evaluation artifact — experiment → checkpoint → evaluation JSON → report.",
  },
  {
    title: "Results get audited",
    text: "The research re-audited its own conclusions and corrected four previously reported figures rather than assuming an earlier number was right.",
  },
  {
    title: "Beyond BLEU",
    text: "CHAIR-lite hallucination auditing, expected calibration error, and OOD routing evaluation — because a benchmark score alone hides what matters.",
  },
];

export function Research() {
  const { open } = useCaseStudy();
  return (
    <Section
      id="research"
      eyebrow="Research & evaluation"
      title="Experiments as a search, not a demo"
      description={researchIntro}
    >
      <Reveal>
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 lg:grid-cols-4" aria-label="Research method">
          {method.map((step, i) => (
            <li key={step.label} className="relative bg-card p-4 sm:p-5">
              <span className="font-mono text-[10px] text-muted-foreground" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm font-medium text-primary">{step.label}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {step.hint}
              </p>
              {i < method.length - 1 && (
                <ArrowRight
                  className="absolute right-3 top-1/2 hidden size-3.5 -translate-y-1/2 text-border lg:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="flex h-full gap-3.5 rounded-xl border border-border/70 bg-card p-5">
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <h3 className="text-sm font-medium">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        {/* Featured evidence — CaptionAI is the richest documented research
            program, so the section anchors on its headline verified numbers. */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-secondary/40 px-5 py-3">
            <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full" style={{ background: "oklch(0.7 0.13 178)" }} aria-hidden />
              Featured research — CaptionAI
            </p>
            <p className="hidden font-mono text-[10px] text-muted-foreground sm:block">
              image captioning · Flickr8K · local training
            </p>
          </div>
          <button
            onClick={() => open("captionai")}
            data-case-open
            className="group block w-full px-5 py-5 text-left transition-colors hover:bg-secondary/30 sm:px-6"
            aria-label="Open the CaptionAI case study"
          >
            <p className="max-w-2xl text-balance text-[15px] font-medium leading-snug tracking-tight">
              From a DenseNet + LSTM baseline to a CLIP + GRPO serving champion
              — one controlled experiment at a time.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {[
                ["BLEU-1", "0.5334 → 0.6559"],
                ["Audited techniques", "20"],
                ["CPU serving", "~590 ms warm"],
                ["ECE served", "0.0862"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-mono text-[13px] font-semibold text-foreground">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-primary">
              Explore the full experiment program
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </p>
          </button>
        </div>
        <p className="mt-2.5 font-mono text-[11px] text-muted-foreground">
          10 model generations · 20 audited techniques · 10 documented failures · every metric protocol-annotated
        </p>
      </Reveal>
    </Section>
  );
}
