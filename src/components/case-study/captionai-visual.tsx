"use client";

import * as React from "react";
import { Check, Star, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CaseSection, OwnerPanel } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * CaptionAI — the experimental ladder, trade-off table, failure ledger
 * and serving engineering, all data-driven from the research documentation.
 */

/* ------------------------------------------------------------------ */
/* Experimental ladder                                                  */
/* ------------------------------------------------------------------ */

interface LadderStage {
  gen: string;
  name: string;
  change: string;
  why: string;
  evidence: string;
  decision: "retained" | "rejected" | "champion" | "serving";
}

const LADDER: LadderStage[] = [
  {
    gen: "GEN 1",
    name: "DenseNet201 + LSTM",
    change: "Working baseline: ImageNet features → global pooling → LSTM decoder → beam search.",
    why: "Establish the starting point before changing anything.",
    evidence: "BLEU-1 0.5334 · BLEU-4 0.1218 · ROUGE-L 0.2216",
    decision: "retained",
  },
  {
    gen: "GEN 2",
    name: "Attention + BPE",
    change: "Bahdanau attention over 49 spatial locations + BPE tokenization (6,000 subwords).",
    why: "Global pooling loses spatial information; an 8,427-word vocabulary causes rare-word memorization.",
    evidence: "Spatial grounding recovered; encode/decode round-trip verified over all 40,455 captions.",
    decision: "retained",
  },
  {
    gen: "GEN 2-RL",
    name: "GRPO",
    change: "Reinforcement learning on top of CE training (G=5, CIDEr-D reward, EMA 0.999, lr 1e-5).",
    why: "Cross-entropy predicts token-by-token; captions are judged as whole sequences.",
    evidence: "BLEU-1 gain and reduced measured hallucination — with caption shortening and a CIDEr trade-off recorded, not hidden.",
    decision: "retained",
  },
  {
    gen: "GEN 3",
    name: "CLIP + CE",
    change: "Encoder swap: DenseNet201 → CLIP ViT-B/16 (196 tokens × 768-d, image-text aligned).",
    why: "Test whether language-aligned visual representation matters more than feature dimensionality.",
    evidence: "BLEU-1 0.6207 · CIDEr-D 0.6207 under beam protocol — a decisive feature-space gain.",
    decision: "retained",
  },
  {
    gen: "GEN 3-RL ★",
    name: "CLIP + Attention + LSTM + GRPO",
    change: "Final champion: CLIP features + Bahdanau attention + LSTM 512 + GRPO fine-tuning.",
    why: "Combine the two largest verified wins: representation alignment and sequence-level optimization.",
    evidence: "BLEU-1 0.6559 (+22.9% vs baseline) · 8.42M params · 32 MB · ~590 ms warm CPU serving.",
    decision: "champion",
  },
  {
    gen: "SERVING",
    name: "Calibration + OOD + guards",
    change: "Incremental beam search, decode-time guards, display-only temperature calibration, CLIP zero-shot OOD router with BLIP fallback, FastAPI + Next.js product.",
    why: "Research improvements must survive real serving constraints.",
    evidence: "~590 ms full served request · ECE 0.0862 · 9.97% real-photo diversion after router fix.",
    decision: "serving",
  },
];

const decisionChip = {
  retained: { label: "Retained", cls: "text-emerald-600 dark:text-emerald-400", icon: Check },
  rejected: { label: "Rejected", cls: "text-red-600 dark:text-red-400", icon: X },
  champion: { label: "Champion", cls: "text-primary", icon: Star },
  serving: { label: "Serving layer", cls: "text-foreground", icon: Check },
} as const;

export function ExperimentLadder({ accent }: { accent: string }) {
  const [active, setActive] = React.useState(4);
  const stage = LADDER[active];
  const chip = decisionChip[stage.decision];
  const Icon = chip.icon;

  return (
    <CaseSection num="03" title="The experimental ladder">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        Every stage answers the same questions: what changed, why, what the evidence
        showed, and what was decided. Click a stage to inspect it.
      </p>

      {/* rail */}
      <ol className="mt-6 flex gap-1.5 overflow-x-auto pb-2" aria-label="Experiment generations">
        {LADDER.map((s, i) => {
          const isActive = i === active;
          const isChampion = s.decision === "champion";
          return (
            <li key={s.gen} className="flex shrink-0 items-center">
              <button
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative rounded-lg border px-3 py-2 text-left transition-all",
                  isActive ? "bg-secondary" : "border-border/60 hover:bg-secondary/50"
                )}
                style={
                  isActive
                    ? { borderColor: `color-mix(in oklch, ${accent} 45%, transparent)` }
                    : undefined
                }
              >
                <span
                  className={cn(
                    "block font-mono text-[10px] tracking-wide",
                    isChampion ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.gen}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[11px]",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.name.split(" + ")[0]}
                </span>
                {isChampion && (
                  <Star
                    className="absolute -right-1.5 -top-1.5 size-3.5 fill-primary text-primary"
                    aria-hidden
                  />
                )}
              </button>
              {i < LADDER.length - 1 && (
                <span className="mx-0.5 font-mono text-[10px] text-muted-foreground" aria-hidden>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* detail */}
      <div
        className="mt-4 rounded-xl border p-5"
        style={{ borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }}
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">
            <span className="font-mono text-[11px] text-muted-foreground">{stage.gen}</span>{" "}
            — {stage.name}
          </p>
          <span className={cn("inline-flex items-center gap-1.5 font-mono text-[11px]", chip.cls)}>
            <Icon className="size-3.5" aria-hidden />
            {chip.label}
          </span>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              What changed
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">{stage.change}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Why it was tested
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">{stage.why}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Evidence
            </dt>
            <dd className="mt-1.5 font-mono text-[12px] leading-relaxed text-foreground/85">
              {stage.evidence}
            </dd>
          </div>
        </dl>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Champion vs baseline                                                 */
/* ------------------------------------------------------------------ */

const METRIC_ROWS = [
  { metric: "BLEU-1", baseline: "0.5334", champion: "0.6559", change: "+22.9%", positive: true },
  { metric: "BLEU-4", baseline: "0.1218", champion: "0.1727", change: "+41.8%", positive: true },
  { metric: "ROUGE-L", baseline: "0.2216", champion: "0.2782", change: "+25.5%", positive: true },
  {
    metric: "CIDEr-D",
    baseline: "0.2216*",
    champion: "0.5243",
    change: "protocol differs",
    positive: undefined as boolean | undefined,
  },
  {
    metric: "CHAIR-img",
    baseline: "—",
    champion: "47.3%",
    change: "lower than CLIP-CE's 61.9%",
    positive: true,
  },
  {
    metric: "ECE (served)",
    baseline: "—",
    champion: "0.0862",
    change: "calibrated serving confidence",
    positive: true,
  },
];

export function ChampionTable() {
  return (
    <CaseSection num="04" title="Champion vs baseline — full validation split">
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">Metric</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Baseline</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Champion</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {METRIC_ROWS.map((r) => (
              <tr key={r.metric} className="border-b border-border/50 last:border-0">
                <th scope="row" className="px-4 py-2.5 font-medium text-foreground">{r.metric}</th>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{r.baseline}</td>
                <td className="px-4 py-2.5 font-mono font-semibold">{r.champion}</td>
                <td
                  className={cn(
                    "px-4 py-2.5 text-[12.5px]",
                    r.positive === true && "text-emerald-600 dark:text-emerald-400",
                    r.positive === false && "text-amber-600 dark:text-amber-400",
                    r.positive === undefined && "text-muted-foreground"
                  )}
                >
                  {r.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
        * CIDEr-D baseline comparison carries a protocol caveat: the exact comparable
        generation is CLIP-CE at 0.6207 — the GRPO champion sits at 0.5243 on the same
        protocol. The trade-off is documented, not hidden.
      </p>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Failure ledger                                                       */
/* ------------------------------------------------------------------ */

const FAILURES: { name: string; hypothesis: string; result: string }[] = [
  {
    name: "DenseNet fine-tuning",
    hypothesis: "Tuning the ImageNet encoder to the domain should help.",
    result: "Regressed — fine-tuning hurt validation quality on the small dataset.",
  },
  {
    name: "Hard trigram blocking",
    hypothesis: "Blocking repeated trigrams in decoding reduces repetition.",
    result: "Rejected — degraded fluency; soft penalties handled repetition better.",
  },
  {
    name: "Focal loss",
    hypothesis: "Down-weighting easy tokens should improve hard examples.",
    result: "Rejected — no measurable generation improvement.",
  },
  {
    name: "Mixed CIDEr + ROUGE reward",
    hypothesis: "Blending rewards balances metrics.",
    result: "Rejected — reward mixing produced unstable optimization behavior.",
  },
  {
    name: "Length-scaled reward",
    hypothesis: "Penalizing short captions fixes GRPO caption shortening.",
    result: "Rejected — reward surgery fought the metric rather than the behavior.",
  },
  {
    name: "Transformer decoder",
    hypothesis: "A more powerful decoder should outperform the LSTM.",
    result: "23.4M params → BLEU-1 0.5546. Severe overfitting on the 8k-image dataset; recurrence acted as a regularizer.",
  },
  {
    name: "Q-Former",
    hypothesis: "Query-based visual tokens should compress features efficiently.",
    result: "Rejected — underperformed the simpler attention path at this data scale.",
  },
  {
    name: "BLIP distillation",
    hypothesis: "34,022 BLIP pseudo-captions add supervision signal.",
    result: "Validation loss improved (3.700 → 3.664) but BLEU-1 collapsed (0.609 → 0.489). Lower loss ≠ better language.",
  },
  {
    name: "DistilBERT reranking",
    hypothesis: "Reranking beam candidates with a text model improves fluency.",
    result: "Rejected — gains did not justify added latency and complexity.",
  },
  {
    name: "Diverse Beam Search",
    hypothesis: "Diversity in decoding should raise CIDEr.",
    result: "Rejected — diversity reduced precision without improving quality metrics.",
  },
];

export function FailureLedger() {
  return (
    <CaseSection num="05" title="10 things that did not work">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        A failed experiment was not discarded — it became evidence about the search
        space. Failures are first-class content here, recorded with the same rigor as
        the wins.
      </p>
      <Accordion type="single" collapsible className="mt-5">
        {FAILURES.map((f, i) => (
          <AccordionItem key={f.name} value={`f-${i}`} className="border-border/60">
            <AccordionTrigger className="py-3.5 text-left hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <X className="size-3.5 shrink-0 text-red-500/80" aria-hidden />
                <span className="text-[13.5px] font-medium">{f.name}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Hypothesis
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/80">
                    {f.hypothesis}
                  </p>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
                    Measured result
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/80">
                    {f.result}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Latency + serving engineering                                        */
/* ------------------------------------------------------------------ */

const LATENCY = [
  { label: "Naive beam decoding", value: "31.6 s", note: "repeated prefix recomputation · O(T²)" },
  { label: "Incremental beam search", value: "~420 ms", note: "state-carrying beams · O(T)" },
  { label: "Full served request", value: "~590 ms", note: "+ display-only confidence pass" },
  { label: "Cached repeat request", value: "~135 ms", note: "feature cache hit" },
];

export function ServingEngineering() {
  const max = 31.6;
  return (
    <CaseSection num="06" title="Serving engineering — the latency story">
      <div className="space-y-3">
        {LATENCY.map((l, i) => (
          <div key={l.label} className="flex items-center gap-4">
            <div className="w-44 shrink-0 sm:w-52">
              <p className="text-[13px] font-medium">{l.label}</p>
              <p className="text-[11px] text-muted-foreground">{l.note}</p>
            </div>
            <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-secondary/50">
              <div
                className="absolute inset-y-0 left-0 rounded-md bg-primary/70 transition-all"
                style={{
                  width: `${Math.max(4, (Number(l.value.replace(/[^0-9.]/g, "")) / max) * 100)}%`,
                  opacity: 1 - i * 0.18,
                }}
                aria-hidden
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] font-semibold">
                {l.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            Calibration
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
            Raw ECE 0.2542 → temperature scaling (T = 1.3) → <span className="font-mono font-semibold">0.0862</span> served.
            Applied <span className="font-medium">display-only, post-decode</span> — caption generation stays bit-exact because modifying beam-search logits would silently change every headline metric.
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            OOD routing
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
            CLIP zero-shot router protects the specialist. A full audit exposed 40.2% of real photos initially misrouted on tiny cosine margins; a margin ≥ 0.02 fix reduced diversion to <span className="font-mono font-semibold">9.97%</span>, with 10/10 synthetic OOD detected on the documented (small) audit set.
          </p>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-border/70 bg-secondary/40 p-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          Evaluation had to be engineered too
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
          The research caught three evaluation bugs: incorrect GNMT length normalization,
          unfinished prefixes accepted as final hypotheses, and beam-search padding that
          didn&apos;t match training — which produced gibberish (BLEU ≈ 0.09) until
          corrected. Evaluation infrastructure is itself part of ML engineering.
        </p>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Product surface — owner-documented                                   */
/* ------------------------------------------------------------------ */

export function CapProductSurface() {
  return (
    <OwnerPanel title="Product surface">
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {[
          [
            "Research dashboard as an app",
            "Generate Caption (upload or URL → caption + confidence), a History gallery, a Model Info page documenting the champion and its lineage, and Settings (theme, animations, speech synthesis, auto-copy).",
          ],
          [
            "Serving options are explicit",
            "The app runs the hosted champion (\u201cAuto — hosted CLIP + GRPO\u201d), can serve a previous generation (Attention v2, with a version selector), call a Hugging Face endpoint, or stay in Notebook mode for research only.",
          ],
          [
            "Progress checkpoints",
            "The owner's progress table tracks BLEU-1 from v1 (DenseNet + LSTM, 0.5334) to v5 (CLIP + GRPO, 0.6559) on the same validation split — the ladder behind the headline number.",
          ],
          [
            "Live configuration",
            "The dashboard exposes the training configuration (batch size, learning rate, epochs, optimizer) straight from the backend, next to raw checkpoint metadata.",
          ],
        ].map(([t, d]) => (
          <li key={t} className="rounded-lg border border-border/60 bg-secondary/30 p-3.5">
            <p className="flex items-center gap-2 text-[12.5px] font-medium">
              <span
                className="inline-block size-1.5 rounded-full bg-[oklch(0.7_0.13_178)]"
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
