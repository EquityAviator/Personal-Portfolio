"use client";

import * as React from "react";
import { BookOpen, Layers, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseSection, OwnerPanel } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * AngluPol — learning loop, vocabulary scale, FSRS simulator,
 * learning-state machine and the activity plugin architecture.
 */

/* ------------------------------------------------------------------ */
/* Core learning loop                                                   */
/* ------------------------------------------------------------------ */

const LOOP = [
  "VOCABULARY",
  "ASSIGNMENT / PRACTICE",
  "STUDENT ACTIVITY",
  "ANSWER / RATING",
  "LEARNING EVENT",
  "FSRS",
  "LEARNING STATE",
  "NEXT REVIEW",
  "TEACHER / STUDENT PROGRESS",
];

export function LearningLoop({ accent }: { accent: string }) {
  return (
    <CaseSection num="02" title="The learning loop — the whole product">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        AngluPol is fundamentally a <span className="font-medium text-foreground">learning-state engine wrapped in multiple user
        experiences</span>. Individual screens matter less than this loop.
      </p>
      <ol className="mx-auto mt-6 max-w-md space-y-0" aria-label="Learning loop">
        {LOOP.map((step, i) => (
          <li key={step} className="relative flex flex-col items-center">
            <span
              className={cn(
                "w-full rounded-lg border px-4 py-2.5 text-center font-mono text-[11px] tracking-wide",
                step === "FSRS" || step === "LEARNING STATE"
                  ? "font-semibold"
                  : "text-foreground/80"
              )}
              style={{
                borderColor:
                  step === "FSRS" || step === "LEARNING STATE"
                    ? `color-mix(in oklch, ${accent} 45%, transparent)`
                    : "var(--border)",
                background:
                  step === "FSRS" || step === "LEARNING STATE"
                    ? `color-mix(in oklch, ${accent} 10%, transparent)`
                    : "var(--card)",
                color:
                  step === "FSRS" || step === "LEARNING STATE"
                    ? `color-mix(in oklch, ${accent} 65%, var(--foreground))`
                    : undefined,
              }}
            >
              {step}
            </span>
            {i < LOOP.length - 1 && (
              <span className="my-1 font-mono text-[10px] text-muted-foreground" aria-hidden>
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Vocabulary scale + sense-based representation                        */
/* ------------------------------------------------------------------ */

export function VocabularyFoundation() {
  const stats = [
    { value: "15,453", label: "words" },
    { value: "15,641", label: "senses" },
    { value: "15,636", label: "active senses" },
    { value: "1,160", label: "taxonomy nodes" },
    { value: "1,005", label: "taxonomy leaves" },
    { value: "100%", label: "translation coverage" },
    { value: "100%", label: "example coverage" },
    { value: "85%", label: "CEFR coverage" },
  ];
  return (
    <CaseSection num="03" title="Vocabulary foundation — sense-based, not word-based">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-card p-3.5 text-center">
            <dd className="font-mono text-lg font-semibold tracking-tight">{s.value}</dd>
            <dt className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            Sense-based representation
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/80">
            A word like <span className="font-mono font-semibold">bank</span> isn&apos;t one
            flashcard — it&apos;s distinct senses, each with its own translation,
            example, CEFR level, frequency and relationships:
          </p>
          <ul className="mt-3 space-y-1.5 font-mono text-[11.5px]">
            {[
              ["bank · sense 01", "financial institution"],
              ["bank · sense 02", "river bank"],
              ["bank · sense 03", "store / reserve"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center justify-between gap-3 rounded-md bg-secondary/60 px-3 py-1.5">
                <span className="text-foreground/85">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border/70 bg-secondary/40 p-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            13-stage reproducible pipeline
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/80">
            Vocabulary data is generated, not manually assembled. The Python pipeline
            records source metadata — URL, SHA-256, file size, timestamp, source,
            CEFR source and confidence — making the dataset rebuildable and traceable.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {[
              "public data", "download + cache", "clean", "extract senses",
              "EN–PL translations", "CEFR", "semantic relations", "frequency",
              "taxonomy", "examples", "quality control", "processed vocab", "database",
            ].map((step, i) => (
              <span
                key={step}
                className="rounded bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {String(i + 1).padStart(2, "0")} {step}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Sources: FreeDict · FrequencyWords · Oxford 3000 · CEFR-J / heuristic fallback ·
            curated A1/A2 data · original examples — with documented licensing and provenance.
          </p>
        </div>
      </div>

      {/* CEFR distribution — owner-documented teacher-dashboard panel */}
      <div className="mt-5 rounded-xl border border-border/70 bg-card p-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          Merged words by CEFR level — teacher dashboard
        </p>
        <dl className="mt-3 space-y-1.5">
          {[
            ["A1", 38, 2],
            ["A2", 505, 12],
            ["B1", 1040, 22],
            ["B2", 1549, 34],
            ["C1", 3513, 76],
            ["C2", 7103, 100],
            ["Unassigned", 2250, 49],
          ].map(([level, count, pct]) => (
            <div key={level as string} className="flex items-center gap-3">
              <dt className="w-20 shrink-0 font-mono text-[11px] text-muted-foreground">{level}</dt>
              <dd className="flex flex-1 items-center gap-2.5">
                <span className="h-2 overflow-hidden rounded-full bg-secondary" style={{ flex: 1 }}>
                  <span
                    className="block h-full rounded-full bg-[oklch(0.62_0.13_178)]"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-foreground/85">
                  {Number(count).toLocaleString("en-US")}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Bar length is relative to the C2 peak (7,103) — proportions as shown on the owner&apos;s
          dashboard capture, not a chart of the full 15.6k sense inventory.
        </p>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* FSRS simulator                                                       */
/* ------------------------------------------------------------------ */

type Rating = "again" | "hard" | "good" | "easy";

interface FsrsState {
  difficulty: number;
  stability: number;
  round: number;
  history: { rating: Rating; difficulty: number; stability: number; next: string }[];
}

const INITIAL: FsrsState = { difficulty: 5, stability: 0.5, round: 0, history: [] };

function fmtInterval(days: number): string {
  if (days < 1) return "later today";
  if (days < 2) return "tomorrow";
  if (days < 14) return `${Math.round(days)} days`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

/** Illustrative FSRS-style update — demonstrative values, not the production scheduler. */
function simulate(state: FsrsState, rating: Rating): FsrsState {
  let { difficulty, stability } = state;
  switch (rating) {
    case "again":
      difficulty = Math.min(10, difficulty + 0.6);
      stability = Math.max(0.3, stability * 0.25);
      break;
    case "hard":
      difficulty = Math.min(10, difficulty + 0.3);
      stability = stability * 1.4 + 0.3;
      break;
    case "good":
      stability = stability * 2.2 + 0.8;
      break;
    case "easy":
      difficulty = Math.max(1, difficulty - 0.5);
      stability = stability * 2.8 + 1.2;
      break;
  }
  return {
    difficulty: Math.round(difficulty * 10) / 10,
    stability: Math.round(stability * 10) / 10,
    round: state.round + 1,
    history: [
      ...state.history.slice(-4),
      { rating, difficulty, stability: Math.round(stability * 10) / 10, next: fmtInterval(stability) },
    ],
  };
}

const RATING_META: { key: Rating; label: string; cls: string }[] = [
  { key: "again", label: "Again", cls: "hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400" },
  { key: "hard", label: "Hard", cls: "hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400" },
  { key: "good", label: "Good", cls: "hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400" },
  { key: "easy", label: "Easy", cls: "hover:border-emerald-500/70 hover:text-emerald-600 dark:hover:text-emerald-300" },
];

export function FsrsSimulator({ accent }: { accent: string }) {
  const [state, setState] = React.useState<FsrsState>(INITIAL);
  const [revealed, setRevealed] = React.useState(false);

  const rate = (r: Rating) => {
    setState((s) => simulate(s, r));
    setRevealed(false);
  };

  return (
    <CaseSection num="04" title="FSRS-4.5 — the core intelligence">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        The scheduler tracks <span className="font-medium text-foreground">difficulty, stability, elapsed time and a retention target</span> to
        compute the next review. It is pure and deterministic — activities feed it,
        never the other way around.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* Card */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: `color-mix(in oklch, ${accent} 30%, var(--border))` }}
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              <BookOpen className="size-3.5" aria-hidden />
              Flashcard · EN → PL
            </p>
            <span className="font-mono text-[10.5px] text-muted-foreground">
              round {state.round}
            </span>
          </div>
          <p className="mt-4 text-center font-mono text-2xl font-semibold tracking-tight">
            abandon
          </p>
          <div className="mt-3 min-h-10 text-center">
            {revealed ? (
              <p className="text-[14px] text-muted-foreground">
                <span className="font-medium text-foreground">opuszczać · porzucać</span>{" "}
                — to leave behind / give up
              </p>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => setRevealed(true)}
              >
                Reveal answer
              </Button>
            )}
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {RATING_META.map((r) => (
              <button
                key={r.key}
                onClick={() => rate(r.key)}
                disabled={!revealed}
                className={cn(
                  "rounded-lg border border-border/70 py-2 font-mono text-[11.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  r.cls
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 px-3.5 py-2.5 font-mono text-[11.5px]">
            <span className="text-muted-foreground">
              D <span className="font-semibold text-foreground">{state.difficulty.toFixed(1)}</span>
              {" · "}
              S <span className="font-semibold text-foreground">{state.stability.toFixed(1)}d</span>
            </span>
            <span className="text-muted-foreground">
              next: <span className="font-semibold text-foreground">{state.round === 0 ? "—" : fmtInterval(state.stability)}</span>
            </span>
            <button
              onClick={() => setState(INITIAL)}
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Reset simulation"
            >
              <RotateCcw className="size-3" aria-hidden />
              reset
            </button>
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-muted-foreground/80">
            Illustrative simulation with demonstrative update rules — the production
            FSRS-4.5 implementation is deterministic and retention-driven.
          </p>
        </div>

        {/* History + state machine */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              Learning-state machine
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {["ASSIGNED", "ENCOUNTERED", "LEARNING", "REVIEWING", "MASTERED"].map((s, i) => (
                <React.Fragment key={s}>
                  <span
                    className={cn(
                      "rounded px-2 py-1 font-mono text-[10px]",
                      i >= 2 ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {s}
                  </span>
                  {i < 4 && <span className="font-mono text-[9px] text-muted-foreground" aria-hidden>→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
              Plus RETIRED and teacher override. Progress is a per-sense state with
              scheduling history — never a single percentage.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
            <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              <Layers className="size-3.5" aria-hidden />
              One engine, four activities
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["Flashcards", "recall + self-rating"],
                ["Memory", "EN ↔ PL matching"],
                ["Quiz", "multiple-choice recall"],
                ["Fill-in-the-Blank", "contextual completion"],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-lg bg-background px-3 py-2">
                  <p className="text-[12px] font-medium">{name}</p>
                  <p className="text-[10.5px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
              Each activity implements the same ActivityModule contract —{" "}
              <span className="font-mono text-foreground/80">build()</span>,{" "}
              <span className="font-mono text-foreground/80">grade()</span>, config,
              direction — while the core handles sessions, events, FSRS and result
              processing. Adding activity #5 means registering a module.
            </p>
          </div>
        </div>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Security & realtime                                                  */
/* ------------------------------------------------------------------ */

export function SecurityRealtime() {
  return (
    <CaseSection num="05" title="Security by design — and observability without surveillance">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="size-3.5" aria-hidden />
            Accountless students
          </p>
          <ol className="mt-3 space-y-1.5 font-mono text-[11px] text-muted-foreground">
            {[
              "teacher creates student",
              "private link generated",
              "32-byte CSPRNG token",
              "URL fragment (never sent)",
              "SHA-256 stored — 192-bit entropy",
              "bearer authentication",
            ].map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="text-primary" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
            The token lives in <span className="font-mono text-foreground/80">/#/s/private-token</span> —
            fragments are never included in HTTP requests, server logs or Referer headers.
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            Server-side grading
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
            Answer keys never live in the learner&apos;s browser. Students submit
            answers; the server grades against server-held keys and feeds the result
            into FSRS. Learners can&apos;t inspect payloads for correct answers —
            assessment integrity is part of the product.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1">
            {["scrypt", "httpOnly sessions", "CSRF", "RBAC + object authz", "rate limiting", "Zod", "CSP · HSTS", "Permissions-Policy"].map((t) => (
              <li key={t} className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            Live teacher mirror
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
            Teachers see the learner&apos;s current activity in real time through
            Socket.IO — <span className="font-medium">structured JSON state only</span>.
            No webcam, microphone, screen or screenshot capture, enforced via
            Permissions-Policy. Observe, not surveil.
          </p>
          <ul className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
            <li>+ REST fallback when realtime fails</li>
            <li>+ monotonic state versions (stale rejected)</li>
            <li>+ recent-event ring buffer for reconnect</li>
          </ul>
          <p className="mt-2.5 text-[11.5px] text-muted-foreground">
            Realtime is an enhancement — not a single point of failure.
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-border/70 bg-secondary/40 p-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          Production deployment
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
          Docker Compose — <span className="font-mono text-[12px]">app · postgres 16 · realtime sidecar · caddy</span> —
          with automatic HTTPS, migration deploy on database healthcheck, and operational
          backup / restore procedures with mandatory weekly restore verification.
        </p>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Coaching & classroom signals — owner-documented                      */
/* ------------------------------------------------------------------ */

export function ApCoachingSignals({ accent }: { accent: string }) {
  return (
    <OwnerPanel title="Coaching & classroom signals" accent={accent}>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {[
          [
            "Configurable coaching thresholds",
            "Teacher Settings tunes the dashboard's signals: struggling accuracy floor (50%), minimum answers before struggling applies (5), and the overdue backlog window (7 days).",
          ],
          [
            "Needs attention — with reasons",
            "The dashboard names why each student is flagged: accuracy dip (−37% shown), a falling streak, or a long absence (\u201c6 days since last seen\u201d) — each row carries a suggested nudge.",
          ],
          [
            "Leaderboard & activity mix",
            "A class leaderboard ranks the last 7 days by points with answered / learned counts; an activity-mix strip shows the share of flashcards, memory, quiz and fill-in-the-blank answers.",
          ],
          [
            "Student-side motivation",
            "Eight achievement badges (First Steps → Helpful Insider), day streaks, a due-for-review queue (\u201c5 cards — start review session\u201d) and results that extend the streak; teachers can extend assignment due dates from the Assignments table.",
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
