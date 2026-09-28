"use client";

import * as React from "react";
import { AlertTriangle, Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseSection, OwnerPanel } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * ChainProof — review lifecycle, trust stack and an interactive
 * public-verification simulation (clearly labeled demo data).
 */

/* ------------------------------------------------------------------ */
/* Review lifecycle (17 documented states, grouped)                     */
/* ------------------------------------------------------------------ */

const LIFECYCLE: { phase: string; states: string[] }[] = [
  { phase: "Ingestion", states: ["SUBMITTED", "AI_ANALYSIS"] },
  { phase: "Outcome", states: ["APPROVED", "FLAGGED", "REJECTED"] },
  { phase: "Human review", states: ["MANUAL_REVIEW"] },
  { phase: "Chain", states: ["BLOCKCHAIN_PENDING", "BLOCKCHAIN_CONFIRMED"] },
  { phase: "Rewards", states: ["REWARD_PENDING", "REWARDED", "BONUS_ELIGIBLE", "BONUS_AWARDED"] },
  { phase: "Archive", states: ["ARCHIVED"] },
];

export function LifecycleStates({ accent }: { accent: string }) {
  return (
    <CaseSection num="03" title="Review lifecycle — a workflow, not a row">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        Most review apps use pending / approved / rejected. ChainProof treats the
        process as a stateful, auditable workflow: <span className="font-medium text-foreground">17 documented
        lifecycle states</span>, every transition persisted in ReviewStateHistory, with
        audit logs preserving actor and context.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {LIFECYCLE.map((group) => (
          <div key={group.phase} className="rounded-lg border border-border/60 bg-card p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              {group.phase}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.states.map((s, i) => (
                <React.Fragment key={s}>
                  <span
                    className="rounded px-2 py-1 font-mono text-[10.5px]"
                    style={{
                      background: `color-mix(in oklch, ${accent} 10%, transparent)`,
                      color: `color-mix(in oklch, ${accent} 70%, var(--foreground))`,
                    }}
                  >
                    {s}
                  </span>
                  {i < group.states.length - 1 && (
                    <span className="self-center font-mono text-[9px] text-muted-foreground" aria-hidden>
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Trust stack                                                          */
/* ------------------------------------------------------------------ */

const TRUST_LAYERS = [
  { label: "PUBLIC VERIFY", text: "Anyone can recompute the hash — no account required" },
  { label: "CRYPTOGRAPHIC INTEGRITY", text: "Canonical SHA-256 · append-only ledger · tamper detection" },
  { label: "HUMAN MODERATION", text: "SLA buckets · claims · internal notes · audit" },
  { label: "AI ANALYSIS", text: "7 text tasks + vision moderation · schema-validated" },
  { label: "REVIEW", text: "AI-assisted composer · drafts · photo evidence" },
];

export function TrustStack({ accent }: { accent: string }) {
  return (
    <CaseSection num="04" title="The trust stack">
      <ol className="mx-auto max-w-xl space-y-1.5" aria-label="Trust layers">
        {TRUST_LAYERS.map((l, i) => (
          <li
            key={l.label}
            className="rounded-lg border p-3.5 text-center transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: `color-mix(in oklch, ${accent} ${10 + i * 10}%, transparent)`,
              background: `color-mix(in oklch, ${accent} ${3 + i * 3}%, transparent)`,
              width: `${58 + i * 10}%`,
              marginInline: "auto",
            }}
          >
            <p className="pa-text font-mono text-[11px] font-semibold tracking-[0.14em]">
              {l.label}
            </p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{l.text}</p>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-5 max-w-xl rounded-xl border border-border/70 bg-card p-4 text-center">
        <p className="text-[13px] leading-relaxed text-foreground/85">
          <span className="font-medium">AI determines whether a review can progress;
          cryptography preserves the integrity of what was approved.</span>{" "}
          The system deliberately separates those two jobs.
        </p>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Verify simulation                                                    */
/* ------------------------------------------------------------------ */

type VerifyPhase = "idle" | "loading" | "hashing" | "comparing" | "match" | "mismatch";

const DEMO_RECORD = {
  ref: "#CP-284",
  business: "Bright Coffee House",
  item: "Latte · 5 stars",
  hash: "abc8…91f",
  tamperedHash: "52ef…734",
};

export function VerifySim({ accent }: { accent: string }) {
  const [phase, setPhase] = React.useState<VerifyPhase>("idle");
  const [tampered, setTampered] = React.useState(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const stored = tampered ? DEMO_RECORD.tamperedHash : DEMO_RECORD.hash;
  const recomputed = tampered ? DEMO_RECORD.tamperedHash : DEMO_RECORD.hash;

  const run = () => {
    timers.current.forEach(clearTimeout);
    const seq: [number, VerifyPhase][] = [
      [0, "loading"],
      [550, "hashing"],
      [1250, "comparing"],
      [1950, tampered ? "mismatch" : "match"],
    ];
    seq.forEach(([t, p]) => {
      timers.current.push(setTimeout(() => setPhase(p), t));
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase("idle");
  };

  const stepCls = (active: boolean, done: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[12px] transition-colors",
      done ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400" : active ? "border-primary/40 bg-primary/5" : "border-border/60 text-muted-foreground"
    );

  return (
    <CaseSection num="05" title="Try it — public verification">
      <p className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground">
        The verifier doesn&apos;t need access to the private review workflow to check
        integrity — it recomputes the canonical hash and compares it against the
        ledger.{" "}
        <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
          demo data — mirrors the real /verify flow
        </span>
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Record card */}
        <div className="rounded-xl border border-border/70 bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                Review {DEMO_RECORD.ref}
              </p>
              <p className="mt-1 text-sm font-medium">{DEMO_RECORD.business}</p>
              <p className="text-[12.5px] text-muted-foreground">{DEMO_RECORD.item}</p>
            </div>
            <span className="flex gap-0.5 text-amber-500" aria-label="5 star rating">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} aria-hidden>{s}</span>
              ))}
            </span>
          </div>
          <dl className="mt-4 space-y-2 border-t border-border/60 pt-4 font-mono text-[11.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Canonical hash</dt>
              <dd>{stored}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Ledger</dt>
              <dd>block #15 · append-only</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Integrity</dt>
              <dd
                className={cn(
                  phase === "match" && "text-emerald-600 dark:text-emerald-400",
                  phase === "mismatch" && "text-red-600 dark:text-red-400"
                )}
              >
                {phase === "match"
                  ? "VALID"
                  : phase === "mismatch"
                    ? "MISMATCH"
                    : "—"}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8" onClick={run} disabled={phase !== "idle" && phase !== "match" && phase !== "mismatch"}>
              Verify integrity
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => {
                setTampered((t) => !t);
                reset();
              }}
              aria-pressed={tampered}
            >
              <AlertTriangle className="mr-1.5 size-3.5 text-amber-500" aria-hidden />
              {tampered ? "Restore original" : "Simulate tampering (rating 5 → 1)"}
            </Button>
          </div>
        </div>

        {/* Flow */}
        <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/70 bg-secondary/30 p-5" aria-live="polite">
          {[
            { key: "loading", label: "Loading record", icon: Loader2 },
            { key: "hashing", label: `Recomputing canonical hash → ${recomputed}`, icon: Lock },
            { key: "comparing", label: "Comparing against ledger", icon: Loader2 },
          ].map((s) => {
            const idx = ["loading", "hashing", "comparing"].indexOf(s.key);
            const curIdx = ["idle", "loading", "hashing", "comparing"].indexOf(phase);
            const done = phase === "match" || phase === "mismatch" || (curIdx > idx && curIdx !== -1);
            const active = phase === s.key;
            return (
              <div key={s.key} className={stepCls(active, done)}>
                <s.icon
                  className={cn("size-3.5", active && "animate-spin")}
                  aria-hidden
                />
                {s.label}
              </div>
            );
          })}
          {phase === "match" && (
            <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-3 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-4" aria-hidden />
              <p className="text-[13px] font-semibold">VERIFIED — hash match, record intact</p>
            </div>
          )}
          {phase === "mismatch" && (
            <div className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-red-700 dark:text-red-400">
              <p className="flex items-center gap-2 text-[13px] font-semibold">
                <AlertTriangle className="size-4" aria-hidden />
                INTEGRITY MISMATCH — tamper alert
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed">
                Stored {DEMO_RECORD.hash} ≠ recomputed {recomputed}. The integrity layer
                makes unauthorized changes detectable — it doesn&apos;t judge whether
                the review was truthful.
              </p>
            </div>
          )}
          {(phase === "match" || phase === "mismatch") && (
            <Button size="sm" variant="ghost" className="self-start" onClick={reset}>
              <Check className="mr-1.5 size-3.5" aria-hidden />
              Reset
            </Button>
          )}
        </div>
      </div>
    </CaseSection>
  );
}

/* ------------------------------------------------------------------ */
/* Platform surface — owner-documented                                  */
/* ------------------------------------------------------------------ */

export function CpPlatformSurface({ accent }: { accent: string }) {
  return (
    <OwnerPanel title="Platform surface" accent={accent}>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {[
          [
            "Admin console",
            "Moderation queue with per-review AI evidence (sentiment, fake-review probability, toxicity bars) and per-task inference records; users & businesses tables; AI settings with an LM Studio connection test; rewards & tokens; system health; audit logs with actor / action / entity / IP.",
          ],
          [
            "Business side",
            "Dashboard (avg rating 4.36 across 11 published reviews, 100% hash-verified, reply rate 27%), sentiment and weekly-engagement analytics, an embeddable verified-badge snippet, product catalog and replies with on-chain badges.",
          ],
          [
            "Customer side",
            "Reviewer journey with achievement badges, wallet (RTC balance + CSV export), an RTC-priced rewards marketplace, and an AI-assisted write flow (\u201cSuggest improvements\u201d, \u201cSentinel wording\u201d).",
          ],
          [
            "Public & demo",
            "A no-account verification page (paste a transaction hash), and the landing page exposes role-scoped demo accounts (admin / business / customer) so anyone can try the workflow.",
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
      <p className="mt-3 rounded-lg bg-secondary/40 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
        RTC economy values visible in the owner&apos;s capture: base reward 1 per
        confirmed review, 1.5× quality bonus, 100 RTC daily cap, and a
        configurable minimum account age against farming.
      </p>
    </OwnerPanel>
  );
}
