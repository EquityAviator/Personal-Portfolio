import type { Project } from "./types";

/**
 * The four documented projects. Every metric, capability and limitation here
 * comes from the project documentation — nothing is invented.
 *
 * Storytelling identities (deliberately different per project):
 *   Dark Pattern Hunter → Observe · Detect · Ground · Verify
 *   CaptionAI           → Hypothesis · Experiment · Evidence · Decision
 *   ChainProof          → Review · Analyze · Seal · Verify
 *   AngluPol            → Learn · Remember · Practice · Reschedule · Monitor
 */

export const projects: Project[] = [
  {
    slug: "dark-pattern-hunter",
    index: "01",
    name: "Dark Pattern Hunter",
    shortTitle: "Dark Pattern Hunter",
    type: "ai-system",
    outcome:
      "Grounded evidence for every detection — pattern, page location and model reasoning, recorded for audit and reuse as training data.",
    tagline:
      "A multimodal AI system that helps users automatically identify manipulative interface patterns while browsing — detection, grounding, evidence and education in one pipeline.",
    categories: ["Multimodal AI", "Browser Intelligence", "VLM"],
    story: [
      { label: "Observe", hint: "Capture the page the user actually sees" },
      { label: "Detect", hint: "Reason over visuals + DOM with a VLM" },
      { label: "Ground", hint: "Attach evidence to specific page elements" },
      { label: "Verify", hint: "Record structured findings, not verdicts" },
    ],
    status: "Research system",
    role: "Solo developer — AI systems, extension architecture, backend",
    timeline: "2024 — 2025",
    accent: "oklch(0.66 0.2 15)",
    domain: "Consumer protection · human–computer interaction",
    summary:
      "Multimodal AI + browser intelligence: a Chrome extension and reasoning pipeline that observes pages, detects dark patterns with a vision-language model, grounds every detection in page evidence, and records findings users can inspect.",
    problem:
      "Dark patterns — manipulative interface tricks like false urgency, hidden costs and confirm-shaming — are easy to publish and hard to prove. Users had no practical way to automatically identify manipulative interface patterns while browsing.",
    cardMetrics: [
      { label: "Approach", value: "VLM + DOM reasoning" },
      { label: "Surface", value: "Chrome extension" },
      { label: "Evidence", value: "Grounded findings" },
    ],
    stackPreview: ["Qwen (VLM)", "Chrome MV3", "React", "Next.js", "PostgreSQL"],
    links: [
      {
        label: "GitHub profile",
        href: "https://github.com/EquityAviator",
        external: true,
        icon: "github",
      },
    ],
    intro: [
      "Dark Pattern Hunter is a multimodal AI system for browser intelligence: a Chrome extension plus a structured reasoning pipeline that observes the page a user actually sees, detects manipulative interface patterns with a vision–language model, grounds every finding in specific page evidence, and records results users can inspect and learn from.",
      "The system combines browser automation and DOM analysis with vision–language model reasoning. Detection output is treated as evidence — a pattern, its grounding and the model's structured reasoning with confidence — rather than an unexplained verdict.",
      "The detection pipeline also doubles as a data engine: pages are captured, analyzed and recorded in a way that supports custom dataset creation, vision–language model experimentation and fine-tuning.",
    ],
    features: [
      {
        title: "Detection",
        description:
          "Automatically analyzes page elements by combining visual context with structured DOM data.",
      },
      {
        title: "Recording",
        description:
          "Stores detected patterns together with the evidence that produced them — page context, model reasoning and confidence.",
      },
      {
        title: "Reporting",
        description:
          "Generates structured findings rather than raw model output, so results remain inspectable and comparable.",
      },
      {
        title: "Learning",
        description:
          "Provides educational context for each detected pattern, helping users recognize manipulative design themselves.",
      },
    ],
    callouts: [
      {
        title: "Evidence, not verdicts",
        text: "Every detection is recorded as a pattern + grounding + model reasoning with confidence. The system surfaces what it saw and why — it does not replace human judgment.",
        tone: "accent",
      },
      {
        title: "Vision + DOM, together",
        text: "Interface manipulation is partly visual and partly structural. The pipeline reasons over both the screenshot and the DOM context, so visual tricks and structural tricks are both covered.",
        tone: "neutral",
      },
    ],
    built: [
      "Browser extension architecture (Chrome Extension APIs, Manifest V3)",
      "Detection pipeline — page capture → structured analysis → model reasoning",
      "Structured reasoning system over VLM output",
      "Recording system for patterns, evidence and page context",
      "Backend API and storage layer",
      "Custom dataset creation and annotation workflow",
      "Fine-tuning and evaluation of vision–language models",
    ],
    used: [
      "React",
      "Next.js",
      "Qwen (vision–language model)",
      "PostgreSQL",
      "Chrome Extension APIs",
      "Manifest V3",
    ],
    stack: [
      { name: "Extension", items: ["Chrome Extension APIs", "Manifest V3", "Browser Automation", "DOM Analysis"] },
      { name: "AI / ML", items: ["Qwen (VLM)", "Vision-Language Reasoning", "Structured Outputs", "Dataset Creation", "Fine-Tuning"] },
      { name: "Application", items: ["React", "Next.js", "TypeScript"] },
      { name: "Backend", items: ["REST API", "PostgreSQL"] },
    ],
    findings: [
      {
        title: "Interface manipulation is multimodal",
        text: "Dark patterns live in both pixels and structure — a countdown timer is visual, a hidden subscription is structural. Combining screenshot and DOM context is what makes detection trustworthy.",
      },
      {
        title: "Evidence model beats verdict model",
        text: "Recording what the model saw, where it looked and why it decided makes findings auditable — and turns every page analyzed into potential training data.",
      },
    ],
    limitations: [
      "Detection confidence varies with page complexity; findings are recorded as evidence rather than absolute judgments.",
      "No public benchmark scores are documented for this project — evaluation was conducted against the project's own recorded dataset.",
    ],
    relatedProjects: ["captionai"],
    keywords: [
      "dark patterns",
      "vision-language models",
      "Chrome extension",
      "DOM analysis",
      "dataset creation",
      "fine-tuning",
      "consumer protection",
    ],
  },
  {
    slug: "captionai",
    index: "02",
    name: "CaptionAI",
    shortTitle: "CaptionAI",
    type: "research",
    outcome:
      "BLEU-1 0.5334 → 0.6559 under one fixed protocol — ten generations, twenty audited techniques, calibrated ~590 ms CPU serving.",
    tagline:
      "An evidence-driven improvement search for local multimodal learning — from a DenseNet + LSTM baseline to a CLIP + GRPO serving champion, one controlled experiment at a time.",
    categories: ["ML Research", "Computer Vision", "Local AI"],
    story: [
      { label: "Hypothesis", hint: "Name the current bottleneck" },
      { label: "Experiment", hint: "Change one variable, keep everything else" },
      { label: "Evidence", hint: "Same protocol, saved artifacts" },
      { label: "Decision", hint: "Keep only what the evidence justifies" },
    ],
    status: "Completed",
    role: "Solo researcher & engineer",
    timeline: "Sep 2026",
    accent: "oklch(0.7 0.13 178)",
    domain: "Multimodal learning · image captioning",
    summary:
      "A systematic machine-learning engineering study that improved a locally trained image-captioning system on Flickr8K across ten model generations and twenty audited techniques — ending in a calibrated, OOD-routed, 590 ms CPU-serving system.",
    problem:
      "How far can a locally trained multimodal captioning system be improved through systematic architectural, optimization, decoding, evaluation and serving experiments when the dataset and compute budget are intentionally constrained?",
    cardMetrics: [
      { label: "BLEU-1", value: "0.6559", context: "vs 0.5334 baseline (+22.9%)" },
      { label: "Experiments", value: "10 gen · 20 audited" },
      { label: "CPU serving", value: "~590 ms", context: "warm, 16 GB CPU-only" },
    ],
    stackPreview: ["PyTorch", "CLIP ViT-B/16", "GRPO", "FastAPI", "Next.js"],
    links: [
      {
        label: "GitHub profile",
        href: "https://github.com/EquityAviator",
        external: true,
        icon: "github",
      },
    ],
    intro: [
      "CaptionAI is an evidence-driven machine learning engineering study that systematically searched for improvements to a locally trained multimodal image-captioning system under Flickr8K and consumer-compute constraints.",
      "Instead of selecting a model from the literature and stopping at one benchmark score, CaptionAI treated model development as a search: identify the current bottleneck, attack it with a controlled change, measure the result under one fixed protocol, and retain the change only when the evidence justified it.",
      "Across ten model generations and twenty audited techniques, the project progressed from a DenseNet201 + LSTM baseline to a CLIP ViT-B/16 + Bahdanau-attention LSTM + GRPO serving champion — including documented failures, corrected results, calibration, hallucination auditing and an OOD router.",
    ],
    features: [
      {
        title: "Experimental ladder",
        description:
          "Ten documented generations — every stage answers what changed, why, what the evidence showed, and whether it was retained.",
      },
      {
        title: "Fixed evaluation protocol",
        description:
          "One protocol for every experiment: full 1,214-image validation split, seed 42, beam-5, GNMT α = 1.2, soft 2-gram penalty, NLTK method-1 smoothing.",
      },
      {
        title: "Serving engineering",
        description:
          "Incremental beam search, decode-time guards, display-only temperature calibration, CLIP zero-shot OOD routing with BLIP fallback, FastAPI serving and a Next.js dashboard.",
      },
      {
        title: "Research parity",
        description:
          "The product's Model Info page mirrors the research report's experiment ledger, so the serving application and research documentation stay synchronized.",
      },
    ],
    callouts: [
      {
        title: "10 wins · 10 documented failures",
        text: "Failed experiments were not discarded — they became evidence about the search space. A failed experiment was diagnosed, documented, and made the next experiment smarter.",
        tone: "accent",
      },
      {
        title: "Trade-offs are shown, not hidden",
        text: "GRPO improved BLEU-1/2/4, ROUGE-L, word precision and measured hallucination — but reduced full-split beam-search CIDEr-D relative to CLIP-CE. The trade-off is recorded as a finding, not a flaw to hide.",
        tone: "warn",
      },
      {
        title: "Results were audited and corrected",
        text: "The project re-audited its own results and corrected four previously reported figures — including the latency claim (75× → 53×) — treating result verification as part of the research.",
        tone: "warn",
      },
    ],
    built: [
      "Baseline reproduction (DenseNet201 + LSTM) and full PyTorch training stack",
      "Bahdanau attention model and BPE tokenization pipeline (6,000 subwords)",
      "GRPO reinforcement-learning training (G=5, CIDEr-D reward, EMA 0.999)",
      "Incremental beam-search implementation and decode-time guards",
      "Temperature-scaling calibration layer (display-only, post-decode)",
      "CLIP zero-shot OOD router with margin threshold and BLIP fallback",
      "Evaluation harness, experiment provenance and artifact ledger",
      "FastAPI inference service, model manager and Next.js research dashboard",
    ],
    used: [
      "PyTorch",
      "open_clip (CLIP ViT-B/16)",
      "BLIP (fallback captions)",
      "Flickr8K dataset",
      "FastAPI",
      "Next.js 16",
      "Tailwind CSS",
      "shadcn/ui",
    ],
    stack: [
      { name: "Research", items: ["PyTorch", "open_clip", "Flickr8K", "GRPO", "Bahdanau Attention"] },
      { name: "Evaluation", items: ["BLEU", "ROUGE-L", "CIDEr-D", "CHAIR-lite", "ECE calibration"] },
      { name: "Serving", items: ["FastAPI", "Model Manager", "Feature Cache", "Decode Guards"] },
      { name: "Product", items: ["Next.js 16", "Tailwind CSS", "shadcn/ui"] },
      { name: "Compute", items: ["Consumer GPU training (GTX 1080)", "16 GB CPU-only serving machine"] },
    ],
    findings: [
      {
        title: "Representation beat capacity",
        text: "At Flickr8K scale, the language-aligned CLIP feature space had greater impact than simply increasing decoder capacity — BLEU-1 0.5971 (DenseNet + GRPO) → 0.6559 (CLIP + GRPO).",
      },
      {
        title: "Recurrence acted as a regularizer",
        text: "A 23.4M-parameter Transformer decoder overfit the 8k-image dataset (BLEU-1 0.5546, worse than the LSTM system). At this data scale, recurrence beat capacity.",
      },
      {
        title: "Validation loss can lie",
        text: "BLIP pseudo-caption distillation improved validation loss (3.700 → 3.664) while generation quality collapsed (BLEU-1 0.609 → 0.489). A lower validation loss does not necessarily mean better generated language.",
      },
      {
        title: "Rewards shape behavior",
        text: "CIDEr-D reward optimization shortened captions and raised precision — evidence of precision bias in the reward. Two reward-side fixes were tested and rejected; the better solution was a decode-time guard.",
      },
      {
        title: "Evaluation is part of the method",
        text: "The research caught three evaluation bugs — incorrect GNMT length normalization, unfinished prefixes accepted as final hypotheses, and beam-search padding mismatched with training — plus artifact provenance that made every headline number traceable.",
      },
    ],
    limitations: [
      "Data ceiling: the model is trained only on Flickr8K — knowledge beyond the dataset does not exist.",
      "Hallucination remains: the CHAIR-lite protocol still reports unsupported nouns (47.3% of validation images).",
      "The OOD audit is small: 100% OOD recall is documented on a 10-image synthetic audit only.",
      "Router ambiguity: 9.97% of real validation photos are still diverted to fallback after the margin fix.",
      "CIDEr-D trade-off: the champion reduces full-split beam-search CIDEr-D relative to CLIP-CE (0.5243 vs 0.6207).",
    ],
    relatedProjects: ["dark-pattern-hunter"],
    keywords: [
      "image captioning",
      "Flickr8K",
      "GRPO",
      "CLIP",
      "model evaluation",
      "calibration",
      "OOD routing",
      "CPU serving",
    ],
  },
  {
    slug: "chainproof",
    index: "03",
    name: "ChainProof",
    shortTitle: "ChainProof",
    type: "product",
    outcome:
      "Approved reviews become canonical SHA-256 records — tamper-evident, publicly verifiable, with integrity kept separate from truth.",
    tagline:
      "An AI-moderated review platform that combines automated trust analysis, human moderation and cryptographic integrity verification — so published reviews are easier to verify and harder to tamper with.",
    categories: ["AI Systems", "Trust & Safety", "Blockchain"],
    story: [
      { label: "Review", hint: "Customer writes with AI assistance" },
      { label: "Analyze", hint: "AI signals + deterministic policy" },
      { label: "Seal", hint: "Canonical SHA-256 + append-only ledger" },
      { label: "Verify", hint: "Anyone can verify the record publicly" },
    ],
    status: "Live",
    role: "Solo full-stack & AI engineer",
    timeline: "2025",
    accent: "oklch(0.68 0.15 162)",
    domain: "Reviews · reputation · trust infrastructure",
    summary:
      "A full-stack trust and reputation platform where reviews pass through AI analysis, deterministic decision rules, human moderation when needed, cryptographic sealing, public verification and reward workflows.",
    problem:
      "Publishing a review and proving the integrity of that review are different problems. Online reviews influence purchasing decisions, but a published review does not automatically prove that it is authentic, unchanged or independently verifiable.",
    cardMetrics: [
      { label: "AI tasks", value: "8", context: "7 text + image moderation" },
      { label: "Lifecycle", value: "17 states", context: "auditable state machine" },
      { label: "Integrity", value: "SHA-256", context: "canonical hashing + ledger" },
    ],
    stackPreview: ["Next.js 16", "React 19", "Prisma", "LM Studio", "Socket.IO"],
    links: [
      {
        label: "Live demo",
        href: "https://chain-proof.space-z.ai",
        external: true,
        icon: "demo",
      },
      {
        label: "GitHub",
        href: "https://github.com/EquityAviator/ChainProof",
        external: true,
        icon: "github",
      },
    ],
    intro: [
      "ChainProof is a full-stack review and reputation platform designed around a simple problem: a review is easy to publish, but proving later that it is trustworthy is harder.",
      "The system combines AI-assisted analysis for sentiment, toxicity, suspicious/fake content and duplication with deterministic decision rules and human moderation for uncertain cases. Approved reviews are converted into canonical cryptographic records that can be verified later through a public verification interface.",
      "Around that trust pipeline, the platform provides three distinct experiences: customers write and track reviews and earn verified rewards; businesses manage reputation, respond and analyze feedback; administrators operate moderation, AI configuration, blockchain integrity, rewards, system health and audit workflows.",
    ],
    features: [
      {
        title: "AI analysis pipeline",
        description:
          "Task-routed inference across sentiment, toxicity, hate speech, fake/suspicious, duplicate, suggestion and sanitization — plus vision-model moderation of review photos.",
      },
      {
        title: "Human-in-the-loop moderation",
        description:
          "AI failure never silently approves a review. Flagged or unavailable cases route to MANUAL_REVIEW, with an operational moderation console, SLA buckets and audited claims.",
      },
      {
        title: "Cryptographic integrity",
        description:
          "Canonical sorted-key JSON + SHA-256 hashing, an append-only ledger with tamper detection, and recomputation-based public verification.",
      },
      {
        title: "Verified incentives",
        description:
          "Rewards are issued only after chain confirmation, with idempotent operations, popularity bonuses and a redemption marketplace.",
      },
      {
        title: "Async workflow engine",
        description:
          "A DB-backed background worker processes AI, blockchain and reward jobs with exponential backoff, bounded retries and dead-job visibility.",
      },
      {
        title: "Business analytics",
        description:
          "Rating distribution, sentiment, verified %, suspicious indicators, reply engagement, 8-week trends and RBAC-scoped CSV export.",
      },
    ],
    callouts: [
      {
        title: "AI is not the final authority",
        text: "Model output feeds a deterministic decision engine — never directly the workflow state. AI failure routes to manual review or fail; it can never silently approve.",
        tone: "accent",
      },
      {
        title: "Store proof on-chain, not private content",
        text: "On-chain payloads contain IDs, canonical content hashes, reviewer references, ratings and timestamps — never review text or personal information.",
        tone: "accent",
      },
      {
        title: "Integrity ≠ truth",
        text: "The integrity layer makes later unauthorized changes detectable; it does not prove that the reviewer's claims are factually true. The system distinguishes these on purpose.",
        tone: "warn",
      },
    ],
    built: [
      "Review workflow and 17-state lifecycle state machine with history + audit logs",
      "AI orchestration — provider abstraction, task-level model routing, schema-validated outputs, inference logging",
      "Deterministic decision engine and moderation workflow",
      "Canonical hashing, append-only ledger, public verification and trust badges",
      "EVM adapter architecture (internal ledger default, Ganache/Sepolia-ready)",
      "Reward engine, wallet, bonus logic and redemption marketplace",
      "Role-based customer / business / admin experiences",
      "Background job system with retries, idempotency and dead states",
      "Business analytics, RBAC-scoped CSV export and weekly reputation digests",
      "Audit logging with correlation IDs across reviews, jobs, inferences and audits",
    ],
    used: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui / Radix UI",
      "Prisma",
      "Zod",
      "LM Studio (local AI provider)",
      "EVM JSON-RPC infrastructure",
      "Recharts",
      "Framer Motion",
    ],
    stack: [
      { name: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "shadcn/ui", "Framer Motion", "Recharts"] },
      { name: "Backend", items: ["Next.js Route Handlers", "REST API", "Prisma", "Zod", "Background Worker"] },
      { name: "AI", items: ["Provider Abstraction", "Cloud Models", "LM Studio (local)", "Heuristic Fallback", "Vision AI", "Structured Outputs"] },
      { name: "Trust", items: ["SHA-256 Canonical Hashing", "Append-Only Ledger", "EVM Adapter", "QR Verification", "Trust Badge"] },
      { name: "Data", items: ["SQLite (dev)", "PostgreSQL-portable schema"] },
    ],
    findings: [
      {
        title: "AI assists, policy decides",
        text: "AI moderation is more useful when model output feeds deterministic policy rather than directly controlling business state.",
      },
      {
        title: "Two trust problems, two layers",
        text: "Cryptographic integrity and AI moderation solve different trust problems and work best as separate layers.",
      },
      {
        title: "Humans stay in the loop",
        text: "Human moderation remains important when AI output is uncertain or unavailable — and the workflow treats moderation as an operational queue with accountability.",
      },
      {
        title: "Async is required, not optional",
        text: "Asynchronous workflows are necessary when AI, blockchain and rewards introduce latency and failure states.",
      },
      {
        title: "Privacy-aware proof",
        text: "Privacy-aware integrity systems should prove content integrity without publishing the content itself.",
      },
    ],
    limitations: [
      "Current default chain: internal append-only SHA-256 ledger. An EVM adapter exists and is Ganache/Sepolia-ready; public-chain deployment depends on configuration.",
      "Designed for horizontal scaling through stateless APIs and asynchronous processing — dedicated load testing has not been completed.",
      "Core workflows were verified live against the running application; an automated CI test suite remains a documented follow-up.",
      "The BERT/transformers classifier seam exists in the AI provider layer but is not fully implemented.",
    ],
    relatedProjects: ["anglupol"],
    keywords: [
      "trust infrastructure",
      "SHA-256",
      "append-only ledger",
      "AI moderation",
      "state machine",
      "EVM adapter",
      "rewards",
    ],
  },
  {
    slug: "anglupol",
    index: "04",
    name: "AngluPol",
    shortTitle: "AngluPol",
    type: "learning",
    outcome:
      "15.6k English–Polish senses scheduled by FSRS-4.5 across four activity types — with a live teacher mirror and private student links.",
    tagline:
      "A modular English–Polish learning platform built around a shared FSRS-4.5 engine — 15.6k senses of structured vocabulary, four activity types, teacher tooling and live classroom monitoring.",
    categories: ["EdTech", "Adaptive Learning", "Full-Stack"],
    story: [
      { label: "Learn", hint: "Sense-based vocabulary foundation" },
      { label: "Remember", hint: "FSRS-4.5 schedules the return" },
      { label: "Practice", hint: "Four activities, one engine" },
      { label: "Reschedule", hint: "Every answer updates the state" },
      { label: "Monitor", hint: "Teachers see learning live" },
    ],
    status: "Live",
    role: "Solo product engineer",
    timeline: "2025",
    accent: "oklch(0.78 0.17 75)",
    domain: "English learning for Polish-speaking students",
    summary:
      "A personalized English-learning platform connecting a large sense-based English–Polish vocabulary knowledge base with adaptive spaced repetition, multiple learning activities, teacher management, real-time classroom monitoring and production-grade operational tooling.",
    problem:
      "Vocabulary learning is not only about presenting words. A useful platform must decide what to practice, how practice is evaluated, when a word should return, and how progress is represented — while teachers organize learners, prepare activities and monitor sessions without tracking every interaction manually.",
    cardMetrics: [
      { label: "Vocabulary", value: "15.6k senses", context: "sense-based, 100% translation coverage" },
      { label: "Engine", value: "FSRS-4.5", context: "deterministic scheduling" },
      { label: "Activities", value: "4", context: "one shared learning engine" },
    ],
    stackPreview: ["Next.js 16", "Prisma", "FSRS-4.5", "Socket.IO", "Docker"],
    links: [
      {
        label: "Open live platform",
        href: "https://anglupol.space-z.ai",
        external: true,
        icon: "demo",
      },
      {
        label: "GitHub",
        href: "https://github.com/EquityAviator/AngluPol",
        external: true,
        icon: "github",
      },
    ],
    intro: [
      "AngluPol is an English–Polish learning platform designed around adaptive vocabulary practice rather than simple content delivery. At its core is a structured, sense-based vocabulary system containing more than 15,000 words and 15,000 senses — enriched with translations, examples, frequency information, taxonomy and CEFR metadata.",
      "That content feeds a shared FSRS-4.5 learning engine that tracks each learner's progress, updates memory stability and difficulty, and determines when a vocabulary sense should return for review. Students practice through four activity types — Flashcards, Memory, Quiz and Fill-in-the-Blank — but all of them feed into the same underlying learning pipeline.",
      "The platform was engineered as a complete application rather than a classroom prototype: accountless student authentication, server-side grading, structured learning events, responsive mobile learning, Docker-based deployment, PostgreSQL production support, automatic HTTPS, backup/restore tooling and security controls across the API and realtime layers.",
    ],
    features: [
      {
        title: "Sense-based vocabulary foundation",
        description:
          "15,453 words · 15,641 senses (15,636 active) · 1,160 taxonomy nodes — built by a 13-stage reproducible Python pipeline with source provenance and quality control.",
      },
      {
        title: "FSRS-4.5 learning engine",
        description:
          "A pure, deterministic scheduler tracking difficulty, stability and retention targets — with the result processor as the single writer of learning state.",
      },
      {
        title: "Activity plugin architecture",
        description:
          "Flashcards, Memory, Quiz and Fill-in-the-Blank implement one ActivityModule contract; activities never directly own FSRS or learning-state logic.",
      },
      {
        title: "Teacher Studio",
        description:
          "11 operational views — dashboard, students, vocabulary, sets, activities, assignments, live monitor, data and settings — with KPIs, event feeds and a 4-step activity builder.",
      },
      {
        title: "Accountless student access",
        description:
          "Private student links use 32-byte CSPRNG tokens, stored as SHA-256 hashes, delivered in the URL fragment that browsers never send to servers.",
      },
      {
        title: "Live teacher mirror",
        description:
          "Socket.IO synchronization of structured learning state only — no webcam, microphone, screen or screenshot capture, enforced through Permissions-Policy.",
      },
    ],
    callouts: [
      {
        title: "Activities are replaceable. The engine is shared.",
        text: "The platform does not implement separate learning logic per activity. Every activity emits graded events into one shared result pipeline — the only writer of learning state.",
        tone: "accent",
      },
      {
        title: "Intelligence without an LLM",
        text: "Not every intelligent product needs a generative model. AngluPol uses an explicit learning algorithm and state model to make scheduling decisions deterministically — a deliberate counterpoint to the AI-heavy projects.",
        tone: "neutral",
      },
      {
        title: "Security by design",
        text: "Answer keys never leave the server; student tokens are hashed and travel in URL fragments; teacher sessions use httpOnly cookies with CSRF and object-level authorization.",
        tone: "warn",
      },
    ],
    built: [
      "Learning-state system, FSRS-4.5 integration and the shared result processor",
      "Activity plugin architecture and four activity players",
      "13-stage Python vocabulary pipeline (sources, caching, provenance, quality control)",
      "Teacher Studio — 11 operational views and the activity creation wizard",
      "Student application — mobile-first shell, due-for-review flows, My Words",
      "Assignment system with permanent / expiring / single-use links",
      "Realtime teacher mirror (Socket.IO sidecar with REST fallback and monotonic versions)",
      "Authentication and security layer (RBAC, CSRF, rate limiting, security headers)",
      "Docker Compose deployment — app, PostgreSQL 16, realtime sidecar, Caddy HTTPS",
      "Backup / restore tooling with restore verification",
    ],
    used: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Prisma",
      "Zod",
      "Socket.IO",
      "FSRS-4.5 methodology",
      "FreeDict · FrequencyWords · Oxford 3000",
      "PostgreSQL",
      "Docker",
      "Caddy",
    ],
    stack: [
      { name: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "shadcn/ui", "Radix UI"] },
      { name: "Core / Backend", items: ["Next.js App Router", "Prisma", "Zod", "FSRS-4.5", "Event Schema", "Result Processor"] },
      { name: "Realtime", items: ["Socket.IO", "WebSocket", "REST Fallback"] },
      { name: "Data Pipeline", items: ["Python", "FreeDict", "FrequencyWords", "Oxford 3000", "CEFR / Heuristics"] },
      { name: "Infrastructure", items: ["Docker Compose", "PostgreSQL 16", "Caddy (HTTPS)", "Backup / Restore"] },
    ],
    findings: [
      {
        title: "One kernel, many activities",
        text: "A shared learning kernel keeps multiple activity types consistent — and makes adding a fifth activity a registration task, not a redesign.",
      },
      {
        title: "Adaptive logic belongs in the domain core",
        text: "Learning scheduling lives in the domain engine, not inside UI components — which is what keeps four activities honest about the same memory model.",
      },
      {
        title: "Observability without surveillance",
        text: "Real-time classroom visibility can be implemented with structured state alone — no camera, microphone or screen capture required.",
      },
      {
        title: "Educational data is sensitive",
        text: "Learning records and answer keys are protected assets; access controls, hashed tokens and server-side grading are part of the product, not an afterthought.",
      },
      {
        title: "Operations complete the product",
        text: "Deployment, backups, restore testing, security and monitoring are part of the product rather than a final step — the platform can be operated, not merely used.",
      },
    ],
    limitations: [
      "Scope: English–Polish learning in the current implementation — not a general-purpose language SaaS.",
      "Learning modes are text-based; pronunciation/audio workflows are outside the present scope.",
      "The rate limiter is in-memory/single-node, with Redis documented as the scaling replacement — designed with a clear path from single-node deployment to horizontally scaled infrastructure.",
      "Core workflows were verified live through browser E2E; an automated CI test plan is documented for future implementation.",
    ],
    relatedProjects: ["chainproof"],
    keywords: [
      "FSRS-4.5",
      "spaced repetition",
      "adaptive learning",
      "EdTech",
      "realtime",
      "Socket.IO",
      "full-stack",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
