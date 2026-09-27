"use client";

import { ArrowRight, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "./section";
import { useCaseStudy } from "@/components/case-study/case-study-overlay";
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
        <div className="mt-8">
          <button
            onClick={() => open("captionai")}
            className="group inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Explore the full CaptionAI experiment program
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
          <p className="mt-2.5 font-mono text-[11px] text-muted-foreground">
            10 model generations · 20 audited techniques · 10 documented failures · every metric protocol-annotated
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
