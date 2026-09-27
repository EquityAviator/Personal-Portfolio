import type { ProjectSlug } from "./types";

/**
 * Skill-level evidence mapping — the Phase 6 spec ask: specific skills link
 * to the specific case study that documents them in use.
 *
 * Honesty rules for this file:
 *   - `skill` MUST exactly match an item string in `skillGroups` (site.ts).
 *   - `evidence` MUST be restatable from the case-study content — no new
 *     metrics, no invented usage. If a skill has no documented project use,
 *     it gets NO row (absence is the honest default).
 *   - The four canonical anchors: GRPO → CaptionAI, FSRS-4.5 → AngluPol,
 *     Blockchain/EVM → ChainProof, Chrome Extension APIs → Dark Pattern
 *     Hunter.
 */

export interface SkillEvidence {
  skill: string;
  slug: ProjectSlug;
  evidence: string;
}

export const skillEvidence: SkillEvidence[] = [
  /* ---- AI · ML & Computer Vision ---- */
  {
    skill: "GRPO",
    slug: "captionai",
    evidence:
      "Sequence-level RL on top of CE training — GEN 2-RL in the ladder, and part of the serving champion",
  },
  {
    skill: "Attention Mechanisms",
    slug: "captionai",
    evidence:
      "Bahdanau attention carried from GEN 2 (49 spatial locations) through the CLIP champion",
  },
  {
    skill: "Image Captioning",
    slug: "captionai",
    evidence:
      "The research subject itself — Flickr8K under one fixed protocol, BLEU-1 0.5334 → 0.6559",
  },
  {
    skill: "Confidence Calibration",
    slug: "captionai",
    evidence:
      "Display-only temperature scaling — ECE 0.2542 → 0.0862 served, bit-exact generation preserved",
  },
  {
    skill: "OOD Detection & Routing",
    slug: "captionai",
    evidence:
      "CLIP zero-shot router with BLIP fallback; margin fix cut real-photo diversion to 9.97%",
  },
  {
    skill: "Hallucination Analysis",
    slug: "captionai",
    evidence:
      "CHAIR-img auditing — 47.3% for the champion vs 61.9% for CLIP-CE (CHAIR-lite protocol)",
  },
  {
    skill: "Dataset Creation & Annotation",
    slug: "dark-pattern-hunter",
    evidence:
      "The data engine loop — recorded pages feed a custom dataset creation and annotation workflow",
  },
  {
    skill: "Reinforcement Learning",
    slug: "captionai",
    evidence: "GRPO with G=5, CIDEr-D reward, EMA 0.999 — the documented RL stage of the ladder",
  },

  /* ---- AI Systems & Intelligent Applications ---- */
  {
    skill: "Structured AI Outputs",
    slug: "dark-pattern-hunter",
    evidence:
      "Decision engine converts model reasoning into a schema-validated verdict per pattern — never an unexplained score",
  },
  {
    skill: "AI Moderation",
    slug: "chainproof",
    evidence:
      "AI analysis layer — 7 text tasks + vision moderation, schema-validated before any review progress",
  },
  {
    skill: "Human-in-the-Loop Systems",
    slug: "chainproof",
    evidence:
      "AI determines progression; humans own moderation — SLA buckets, claims, internal notes, audit logs",
  },
  {
    skill: "Local LLM/VLM Inference",
    slug: "captionai",
    evidence:
      "Locally trained and served — 8.42M params, 32 MB checkpoint, ~590 ms warm CPU serving",
  },

  /* ---- Specialized ---- */
  {
    skill: "Chrome Extension APIs",
    slug: "dark-pattern-hunter",
    evidence:
      "The MV3 extension observes the active page and triggers analysis on demand — no background scraping",
  },
  {
    skill: "Manifest V3",
    slug: "dark-pattern-hunter",
    evidence:
      "Documented extension architecture — Chrome Extension APIs + Manifest V3 in the built list",
  },
  {
    skill: "Browser Automation",
    slug: "dark-pattern-hunter",
    evidence:
      "Page capture in two complementary forms — the visual state and the structural DOM behind it",
  },
  {
    skill: "DOM Analysis",
    slug: "dark-pattern-hunter",
    evidence:
      "Grounds every detection to the specific element it refers to — the exact node that carries the pattern",
  },
  {
    skill: "Cryptographic Hashing",
    slug: "chainproof",
    evidence:
      "Canonical SHA-256 per review; anyone can recompute it — integrity ≠ truth, by documented design",
  },
  {
    skill: "Blockchain / EVM Integration",
    slug: "chainproof",
    evidence:
      "Append-only ledger with BLOCKCHAIN_PENDING → BLOCKCHAIN_CONFIRMED lifecycle states",
  },
  {
    skill: "FSRS Spaced Repetition",
    slug: "anglupol",
    evidence:
      "FSRS-4.5 engine scheduling 15.6k English–Polish senses across four activity types",
  },

  /* ---- Backend & Data ---- */
  {
    skill: "Realtime Systems",
    slug: "anglupol",
    evidence:
      "Realtime teacher mirror — Socket.IO sidecar with REST fallback and monotonic versions",
  },
  {
    skill: "Background Jobs",
    slug: "chainproof",
    evidence: "Background job system with retries, idempotency and dead states",
  },
  {
    skill: "PostgreSQL",
    slug: "anglupol",
    evidence:
      "PostgreSQL 16 production deployment — app + realtime sidecar, backup/restore tooling documented",
  },
];
