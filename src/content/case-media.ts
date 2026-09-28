import type { ProjectSlug } from "@/content/types";

/**
 * Case-study screenshot manifest — owner-provided captures ("All Project
 * Images" DOCX), analyzed and mapped to the case-study section each one
 * documents. Every fact quoted in a caption is visible in the owner's own
 * screenshot — nothing here is invented.
 *
 * The image binaries ship separately: drop them into the `upload/` folder
 * (loose image files or the original DOCX) and run
 *
 *     bun scripts/ingest-media.mjs
 *
 * which converts matches to `public/media/<slug>/<id>.webp` and regenerates
 * `case-media.generated.ts`. `CaseMedia` (case-study body) renders an entry
 * only when its converted file exists — until then the affected sections
 * simply show no gallery, so the layout never looks unfinished.
 */

export interface CaseMediaEntry {
  /** Stable id — also the output filename (<id>.webp). */
  id: string;
  project: ProjectSlug;
  /** Case-study section number this screenshot documents. */
  section: string;
  /** Lowercase substrings used to match a candidate upload filename. */
  match: string[];
  /** 1-based position in the DOCX media stream (word/media, natural order), when known. */
  docxIndex?: number;
  /** CSS aspect-ratio for the figure. */
  aspectRatio: string;
  alt: string;
  caption: string;
}

export const CASE_MEDIA: CaseMediaEntry[] = [
  /* ---------------- Dark Pattern Hunter ---------------- */
  {
    id: "dph-dataset-collection",
    project: "dark-pattern-hunter",
    section: "04",
    match: ["dataset collection", "dataset-collection", "pattern counts", "export json"],
    docxIndex: 4,
    aspectRatio: "4 / 3.1",
    alt: "Dataset Collection panel: 98 websites scanned, 794 patterns found, 98.9% prevalence, pattern counts and export formats",
    caption:
      "Dataset collection panel — 98 websites scanned, 794 patterns found, 98.9% prevalence. Top patterns: reference pricing 495, scarcity & popularity 110, hidden information 39, FOMO/urgency 39. Exports: training JSON, full-backup JSON, JSONL text, UI-TARS, COCO, YOLO and annotated images.",
  },
  {
    id: "dph-label-review",
    project: "dark-pattern-hunter",
    section: "04",
    match: ["manual label", "label review", "review auto-generated"],
    docxIndex: 3,
    aspectRatio: "4 / 3.4",
    alt: "Manual Label Review dialog: model verdict vs human confirmation with location, evidence text, cropped screenshot and bounding box",
    caption:
      "Manual label review — each auto-generated label carries the model's human-verdict and confidence; a human confirms location, evidence text, cropped screenshot and bounding-box coordinates before the label is saved into the dataset.",
  },
  {
    id: "dph-bounding-box",
    project: "dark-pattern-hunter",
    section: "04",
    match: ["bounding", "edit bounding", "annotation", "draw box"],
    docxIndex: 2,
    aspectRatio: "4 / 3.4",
    alt: "Edit Bounding Box editor: draw box, zoom controls, severity chips (critical/high/medium/low) and annotation list on a captured page",
    caption:
      "Annotation editor — draw or adjust bounding boxes on the captured page, tag severity (critical / high / medium / low), zoom for precision; every box is grounded evidence for the finding it supports.",
  },
  {
    id: "dph-live-guard",
    project: "dark-pattern-hunter",
    section: "05",
    match: ["live guard", "live-guard", "scan current page"],
    docxIndex: 5,
    aspectRatio: "4 / 2.9",
    alt: "Live Guard panel: real-time dark pattern detection, full-page scan with scroll & interaction, using local AI qwen3.5-4b",
    caption:
      "Live Guard — real-time detection with a full-page scan (scroll & interaction), running on local AI (qwen3.5-4b via LM Studio).",
  },
  {
    id: "dph-ai-providers",
    project: "dark-pattern-hunter",
    section: "06",
    match: ["openrouter", "ai provider", "select ai provider", "local ai (lm studio)"],
    docxIndex: 7,
    aspectRatio: "4 / 3.5",
    alt: "Settings: AI provider selection between OpenAI cloud, OpenRouter free models and local LM Studio",
    caption:
      "Bring-your-own inference — three provider modes in Settings: OpenAI (cloud), OpenRouter free models (e.g. google/gemma-4-31b-it:free) and local AI via LM Studio (localhost:1234). Keys stay with the user.",
  },
  {
    id: "dph-supabase-auth",
    project: "dark-pattern-hunter",
    section: "08",
    match: ["log in", "register", "sign up", "supabase", "account"],
    docxIndex: 1,
    aspectRatio: "4 / 3.6",
    alt: "Settings → Account (Supabase): login with email/password, remember me and Google/Facebook sign-in",
    caption:
      "Accounts via Supabase auth — email/password plus Google and Facebook OAuth, with role-gated AI settings (admin / user roles).",
  },

  /* ---------------- CaptionAI ---------------- */
  {
    id: "cap-landing-hero",
    project: "captionai",
    section: "01",
    match: ["landing", "hero", "ai image caption", "everything you need"],
    docxIndex: 10,
    aspectRatio: "16 / 8.6",
    alt: "CaptionAI landing: AI Image Caption Generator hero with research-grade VLM pipeline badge and tech chips",
    caption:
      "Landing — 'AI Image Caption Generator' positioned as a research-grade VLM pipeline (CLIP ViT-B/16 + GRPO hard-trained LSTM), with feature cards for fast inference, GRPO-reinforced decoding, hybrid OOD routing and full responsiveness.",
  },
  {
    id: "cap-app-workspace",
    project: "captionai",
    section: "01",
    match: ["generate caption", "workspace", "history", "model info"],
    docxIndex: 15,
    aspectRatio: "16 / 9.4",
    alt: "CaptionAI app workspace: Generate Caption view with image preview, generated caption and confidence; History and Model Info pages",
    caption:
      "App workspace — Generate Caption (upload or URL → caption + confidence), History gallery and a Model Info page documenting the champion (CLIP+GRPO), its metrics and the full generation lineage.",
  },
  {
    id: "cap-metrics-board",
    project: "captionai",
    section: "02",
    match: ["numbers that tell", "metrics", "bleu-1 0.6559"],
    docxIndex: 14,
    aspectRatio: "16 / 9.2",
    alt: "Numbers that tell the story: BLEU-1 0.6559, BLEU-4 0.1727, ROUGE-L 0.2782, CIDEr-D 0.5243, vocabulary 8091, 6000 captions, 590 ms warm inference, 70.7% win rate",
    caption:
      "Metrics board — BLEU-1 0.6559, BLEU-4 0.1727, ROUGE-L 0.2782, CIDEr-D 0.5243, 8,091-word vocabulary, 6,000 training captions, ~590 ms warm CPU inference and a 70.7% human win rate vs the baseline — all measured on the same 1,214-image validation split.",
  },
  {
    id: "cap-model-generations",
    project: "captionai",
    section: "03",
    match: ["three generations", "encoder — clip", "one model"],
    docxIndex: 13,
    aspectRatio: "16 / 8.2",
    alt: "Three generations of research, one model: encoder CLIP ViT-B/16, decoder Attention LSTM + GRPO, tokenizer BPE-8k, training dataset Flickr8K cards",
    caption:
      "Model architecture cards — CLIP ViT-B/16 encoder (frozen backbone, 38M total params), GRPO-trained attention LSTM decoder, BPE-8k tokenizer and the Flickr8K split (6,000 train / 1,000 val / 1,000 test).",
  },
  {
    id: "cap-progress-table",
    project: "captionai",
    section: "03",
    match: ["measured progress", "v1", "validation split"],
    docxIndex: 16,
    aspectRatio: "16 / 9.6",
    alt: "Measured progress table across five generations and the current five-stage pipeline plus backend data pathway",
    caption:
      "Measured progress (full validation split) — BLEU-1 0.5334 (v1 DenseNet+LSTM) rising generation over generation to 0.6559 (v5 CLIP+GRPO); alongside the live five-stage pipeline and the backend data pathway (Redis, Firebase storage, Supabase metadata, TensorRT, Express worker).",
  },
  {
    id: "cap-engineering-panels",
    project: "captionai",
    section: "06",
    match: ["optimizations", "hyperparameters", "raw training metadata"],
    docxIndex: 17,
    aspectRatio: "16 / 9.2",
    alt: "Optimizations panel: 53 ms encoder inference, -70% decode time, 960→591 MB VRAM; live hyperparameters and raw checkpoint metadata",
    caption:
      "Serving optimizations — 53 ms encoder inference, −70% decode time, 960→591 MB VRAM and a 381 MB encoder bundle; live hyperparameters (batch 32, lr 3e-4, AdamW, beam 5, 25 epochs) exposed from the backend, plus raw checkpoint metadata.",
  },

  /* ---------------- ChainProof ---------------- */
  {
    id: "cp-landing",
    project: "chainproof",
    section: "01",
    match: ["trust, verified", "three pillars", "becomes verified"],
    docxIndex: 19,
    aspectRatio: "16 / 8.4",
    alt: "ChainProof landing: Trust, Verified by Technology with pillars, seven-stage verification flow and live stats",
    caption:
      "Landing — 'Trust, Verified by Technology': three pillars (AI moderation, blockchain integrity, token rewards), the seven-stage path from Submit to Verifiable forever, and live stats (2 businesses, 20 reviews, 100% verified integrity, <2 min epochs).",
  },
  {
    id: "cp-moderation-queue",
    project: "chainproof",
    section: "02",
    match: ["moderation queue", "ai evidence", "inference records"],
    docxIndex: 21,
    aspectRatio: "16 / 9.8",
    alt: "Moderation queue with AI evidence: per-review screening signals, inference records for seven tasks with model Qwen3.5-4B",
    caption:
      "Moderation queue — every review passes AI screening (sentiment, toxicity, abuse/defamation, scam/spam, duplicates) with a per-task inference record (Qwen3.5-4B, ~0.6 s each) before a human moderator sees it. AI never has the final word.",
  },
  {
    id: "cp-review-lifecycle",
    project: "chainproof",
    section: "03",
    match: ["life-cycle timeline", "lifecycle", "history"],
    docxIndex: 27,
    aspectRatio: "16 / 9.4",
    alt: "Review life-cycle timeline: submitted → AI analyzing → flagged → revision requested → approved → mining epoch → verified on-chain",
    caption:
      "Life-cycle timeline — every state transition is recorded: submitted → AI analyzing → flagged → revision requested → approved → mining epoch → verified on-chain.",
  },
  {
    id: "cp-blockchain-proof",
    project: "chainproof",
    section: "04",
    match: ["verified on-chain", "transaction", "chain transactions", "blockchain"],
    docxIndex: 26,
    aspectRatio: "16 / 9.4",
    alt: "Blockchain tab: verified on-chain card with transaction hashes, contract ChainProofReviews, network, epoch and chain transactions",
    caption:
      "Blockchain evidence — review hash and token-reward transactions with copies of the hashes, contract (ChainProofReviews), epoch number, confirmations and block-explorer links.",
  },
  {
    id: "cp-verify-page",
    project: "chainproof",
    section: "05",
    match: ["verify a review", "review's integrity", "paste transaction"],
    docxIndex: 30,
    aspectRatio: "16 / 9.2",
    alt: "Public verification page: paste a TX hash or transaction hash to verify any approved review, no account needed",
    caption:
      "Public verification — anyone can paste a review ID or transaction hash and re-run the SHA-256 proof; the page explains exactly what a pending block proves. No account required.",
  },
  {
    id: "cp-verify-proof",
    project: "chainproof",
    section: "05",
    match: ["cryptographic proof", "tamper", "hash values"],
    docxIndex: 31,
    aspectRatio: "16 / 9.6",
    alt: "Verification result: verified review with cryptographic proof — SHA-256 hashes, epoch, immutable flags and tamper detection test",
    caption:
      "Cryptographic proof — SHA-256 review/content/transaction hashes, epoch stamp, immutable flags and a documented tamper-detection test (rewriting a block breaks all four hashes).",
  },
  {
    id: "cp-admin-overview",
    project: "chainproof",
    section: "06",
    match: ["admin overview", "total users", "blockchain ledger"],
    docxIndex: 20,
    aspectRatio: "16 / 9.4",
    alt: "Admin overview dashboard: 8 users, 28 reviews, 19 on-chain confirmed, 41-block ledger, background jobs and review activity",
    caption:
      "Admin overview — 8 users, 28 reviews, 19 on-chain confirmed, 41-block ledger (41 confirmed / 0 pending), review activity over 14 days and background-job health.",
  },
  {
    id: "cp-token-economy",
    project: "chainproof",
    section: "06",
    match: ["rewards & tokens", "token symbol", "economy settings"],
    docxIndex: 24,
    aspectRatio: "16 / 9.2",
    alt: "Rewards & tokens settings: RTC token symbol, base reward 1, bonus multiplier 1.5x, epoch length 30000 ms, minimum account age",
    caption:
      "Token economy — configurable RTC economy: base reward 1 per confirmed review, quality bonus 1.5× for helpful reviews, daily caps, epoch length 30 s and a minimum account age that locks out drive-by farming.",
  },

  /* ---------------- AngluPol ---------------- */
  {
    id: "ap-landing",
    project: "anglupol",
    section: "01",
    match: ["personalized english", "polish speakers", "sense-based fsrs"],
    docxIndex: 32,
    aspectRatio: "16 / 8.8",
    alt: "AngluPol landing: Personalized English learning for Polish speakers, 15,642 senses, 15,457 words, four activity types",
    caption:
      "Landing — 15,642 word senses across 15,457 English words, four activity types, sense-based vocabulary with FSRS-4.5 scheduling, live teacher mirror and dashboards.",
  },
  {
    id: "ap-student-access",
    project: "anglupol",
    section: "02",
    match: ["student access", "random link"],
    docxIndex: 33,
    aspectRatio: "16 / 6.2",
    alt: "Student access page explaining private randomized links — no accounts or passwords",
    caption:
      "Student access — teachers hand out private randomized links; no accounts, no passwords. The link itself carries the student's identity and progress.",
  },
  {
    id: "ap-student-dashboard",
    project: "anglupol",
    section: "02",
    match: ["hi, abc", "achievements", "due for review", "quick practice"],
    docxIndex: 37,
    aspectRatio: "16 / 9.4",
    alt: "Student dashboard: level progress, achievements, streak, word training mix, due-for-review queue and quick practice activities",
    caption:
      "Student dashboard — level progress, achievements, streak, word training mix (FSRS-driven), a due-for-review queue ('5 cards, next due 1 day ago') and quick practice entry points for all four activity types.",
  },
  {
    id: "ap-teacher-dashboard",
    project: "anglupol",
    section: "02",
    match: ["needs attention", "class activity", "coaching"],
    docxIndex: 34,
    aspectRatio: "16 / 9.2",
    alt: "Teacher studio dashboard: needs-attention coaching panel, class activity heatmap, activity mix and skills pipeline",
    caption:
      "Teacher studio — a needs-attention panel with per-student coaching nudges, class activity heatmap (last 7 days), activity mix, learning-skills pipeline and live session events.",
  },
  {
    id: "ap-vocabulary-browser",
    project: "anglupol",
    section: "03",
    match: ["vocabulary", "word sets", "categories"],
    docxIndex: 36,
    aspectRatio: "16 / 9.2",
    alt: "Vocabulary browser with 15,642 entries, CEFR levels, category tree and word-set builder",
    caption:
      "Vocabulary browser — 15,642 senses with EN/PL translations, CEFR levels, categories and example sentences; teachers build curated word sets (Food & Drink, B1 Progress, A1–A2 Starter Pack) from the same base.",
  },
  {
    id: "ap-cefr-distribution",
    project: "anglupol",
    section: "03",
    match: ["cefr distribution", "merged words", "cefr"],
    docxIndex: 35,
    aspectRatio: "16 / 8.6",
    alt: "Merged words by CEFR level: A1 38, A2 505, B1 1040, B2 1549, C1 3513, C2 7103, unassigned 2250; class leaderboard above",
    caption:
      "CEFR distribution (teacher dashboard) — merged words by level: A1 38 · A2 505 · B1 1,040 · B2 1,549 · C1 3,513 · C2 7,103 · unassigned 2,250.",
  },
  {
    id: "ap-flashcard-practice",
    project: "anglupol",
    section: "04",
    match: ["flashcards", "reveal answer", "tak, wi"],
    docxIndex: 40,
    aspectRatio: "16 / 8.8",
    alt: "Flashcard practice: Polish front (tak, więc), revealed answer 'with' with FSRS Again/Hard/Good/Easy scheduling buttons",
    caption:
      "FSRS practice — Polish→English flashcards with Again / Hard / Good / Easy scheduling; each rating computes the next interval from the card's difficulty and stability.",
  },
  {
    id: "ap-my-words",
    project: "anglupol",
    section: "04",
    match: ["my words", "due now", "mastered"],
    docxIndex: 42,
    aspectRatio: "16 / 9.2",
    alt: "My words view: every sense tagged due now / learning / reviewing / mastered with FSRS intervals",
    caption:
      "My words — every sense carries its FSRS state (due now, learning, reviewing, mastered) with the computed next interval, so 'knowing a word' is always a specific, scheduled claim.",
  },
  {
    id: "ap-live-monitor",
    project: "anglupol",
    section: "05",
    match: ["live monitor", "active sessions", "paused"],
    docxIndex: 38,
    aspectRatio: "16 / 9.4",
    alt: "Live monitor: teachers see active sessions, student word states and a paused overlay in real time",
    caption:
      "Live monitor — teachers watch active sessions and word-level states in real time; even a paused session ('Take a breath — your teacher can see you paused') is part of the shared mirror.",
  },
  {
    id: "ap-data-export",
    project: "anglupol",
    section: "06",
    match: ["export", "weekly digest", "import", "csv"],
    docxIndex: 39,
    aspectRatio: "16 / 9.4",
    alt: "Data page: CSV / Excel / JSON export, weekly digest in Markdown or URL, and validated import",
    caption:
      "Data portability — one-click CSV / Excel / JSON export, a copy-ready weekly digest (Markdown or URL) for LMS posts, and an import flow with a validation report. Export is always free; import is validated before anything is written.",
  },
];

/** Manifest entries for one project + section, in manifest order. */
export function getCaseMediaFor(slug: ProjectSlug, section: string): CaseMediaEntry[] {
  return CASE_MEDIA.filter((m) => m.project === slug && m.section === section);
}
