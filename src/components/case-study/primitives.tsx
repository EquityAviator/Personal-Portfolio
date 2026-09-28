import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Callout, Finding, StoryStep, TechGroup } from "@/content/types";

/* ------------------------------------------------------------------ */
/* Owner-documented fact panel                                          */
/* ------------------------------------------------------------------ */

/**
 * Consistent container for facts read directly from the owner's product
 * captures. Content passed here must be visible in those screenshots —
 * quoted strings appear verbatim in them; nothing is invented.
 */
export function OwnerPanel({
  title,
  accent,
  children,
  className,
}: {
  title: string;
  /** Project accent → tinted border, matching the interactive modules. */
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mt-5 rounded-xl border bg-card p-5", className)}
      style={
        accent
          ? { borderColor: `color-mix(in oklch, ${accent} 25%, var(--border))` }
          : undefined
      }
    >
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <ScanSearch className="size-3.5 shrink-0" aria-hidden />
        <span>{title}</span>
        <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[9px] tracking-[0.14em]">
          owner-documented
        </span>
      </p>
      <div className="mt-3">{children}</div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Facts read from the owner&apos;s own product captures — quoted strings
        appear verbatim in those screenshots.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Case study section                                                   */
/* ------------------------------------------------------------------ */

export function CaseSection({
  num,
  title,
  children,
  className,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("px-5 py-8 sm:px-8", className)} aria-labelledby={`cs-${num}`}>
      <h3
        id={`cs-${num}`}
        className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        <span className="text-primary">{num}</span>
        {title}
        <span className="h-px flex-1 bg-border" aria-hidden />
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Storytelling rail                                                    */
/* ------------------------------------------------------------------ */

export function StoryRail({
  story,
  accent,
  compact = false,
}: {
  story: StoryStep[];
  accent: string;
  compact?: boolean;
}) {
  return (
    <ol className="flex flex-wrap items-stretch gap-1.5" aria-label="Project narrative">
      {story.map((s, i) => (
        <li key={s.label} className="flex items-stretch">
          <div
            className={cn(
              "rounded-md border px-2.5 py-1.5",
              compact ? "bg-secondary/60" : "bg-card"
            )}
            style={{ borderColor: `color-mix(in oklch, ${accent} 35%, transparent)` }}
            title={s.hint}
          >
            <p className="pa-text text-[12px] font-medium leading-tight">
              {s.label}
            </p>
            {!compact && (
              <p className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">
                {s.hint}
              </p>
            )}
          </div>
          {i < story.length - 1 && (
            <span
              className="mx-1 self-center font-mono text-[10px] text-muted-foreground"
              aria-hidden
            >
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Callout                                                              */
/* ------------------------------------------------------------------ */

const toneStyles: Record<string, string> = {
  accent: "border-primary/40 bg-primary/5",
  warn: "border-amber-500/40 bg-amber-500/5",
  danger: "border-red-500/40 bg-red-500/5",
  neutral: "border-border/70 bg-secondary/40",
};

export function CalloutCard({ callout }: { callout: Callout }) {
  const tone = callout.tone ?? "neutral";
  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", toneStyles[tone])}>
      <p className="text-sm font-semibold">{callout.title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/80">
        {callout.text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Built vs Used                                                        */
/* ------------------------------------------------------------------ */

export function SplitList({
  built,
  used,
}: {
  built: string[];
  used: string[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border/70 bg-card p-5">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/85">
          <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden />
          Built by me
        </p>
        <ul className="mt-4 space-y-2">
          {built.map((b) => (
            <li key={b} className="flex gap-2.5 text-[13px] leading-relaxed text-foreground/80">
              <span className="mt-[7px] inline-block size-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-border/70 bg-secondary/40 p-5">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-border" aria-hidden />
          Used as foundations
        </p>
        <ul className="mt-4 flex flex-wrap content-start gap-1.5">
          {used.map((u) => (
            <li
              key={u}
              className="rounded-md border border-border/60 px-2 py-1 text-[12px] text-muted-foreground"
            >
              {u}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground/80">
          Third-party foundations are never presented as personal model or product
          development.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack grid                                                           */
/* ------------------------------------------------------------------ */

export function StackGrid({ stack }: { stack: TechGroup[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stack.map((g) => (
        <div key={g.name} className="rounded-xl border border-border/70 bg-card p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {g.name}
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1">
            {g.items.map((i) => (
              <li key={i} className="text-[12px] text-foreground/75">
                {i}
                {g.items.indexOf(i) < g.items.length - 1 && (
                  <span className="text-muted-foreground/50" aria-hidden>
                    {" · "}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Findings                                                             */
/* ------------------------------------------------------------------ */

export function FindingsList({ findings }: { findings: Finding[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {findings.map((f, i) => (
        <li
          key={f.title}
          className="rounded-xl border border-border/70 bg-card p-4 sm:p-5"
        >
          <p className="font-mono text-[10px] text-primary" aria-hidden>
            FINDING {String(i + 1).padStart(2, "0")}
          </p>
          <p className="mt-1.5 text-[13.5px] font-medium leading-snug">{f.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {f.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Limitations                                                          */
/* ------------------------------------------------------------------ */

export function LimitationsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 rounded-xl border border-border/70 bg-secondary/30 p-5">
      {items.map((l) => (
        <li key={l} className="flex gap-3 text-[13px] leading-relaxed text-foreground/80">
          <span className="mt-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400" aria-hidden>
            ▲
          </span>
          {l}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Metric block (context-annotated)                                     */
/* ------------------------------------------------------------------ */

export function MetricGrid({
  metrics,
}: {
  metrics: { label: string; value: string; context?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border border-border/70 bg-card p-4">
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {m.label}
          </dt>
          <dd className="mt-1.5 font-mono text-lg font-semibold tracking-tight text-foreground">
            {m.value}
          </dd>
          {m.context && (
            <dd className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {m.context}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
