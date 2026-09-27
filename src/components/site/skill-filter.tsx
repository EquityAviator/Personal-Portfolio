"use client";

import * as React from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { skillGroups } from "@/content/site";
import { skillEvidence } from "@/content/skill-evidence";
import { projects } from "@/content/projects";
import { useCaseStudy } from "@/components/case-study/case-study-context";
import type { ProjectSlug } from "@/content/types";
import { cn } from "@/lib/utils";

const TOTAL = skillGroups.reduce((n, g) => n + g.items.length, 0);

/**
 * Groups collapsed by default (Phase 6 "simplified default view").
 * These two carry no project-linked evidence rows and read as general
 * engineering practice; the toggle reveals the full technical inventory.
 * Filtering always searches everything — collapse never hides matches.
 */
const COLLAPSED_BY_DEFAULT = new Set(["Software Engineering", "DevOps & Tools"]);
const COLLAPSED_COUNT = skillGroups
  .filter((g) => COLLAPSED_BY_DEFAULT.has(g.name))
  .reduce((n, g) => n + g.items.length, 0);
const COLLAPSED_GROUPS_N = skillGroups.filter((g) =>
  COLLAPSED_BY_DEFAULT.has(g.name)
).length;

/**
 * Evidence links: which documented projects actually use a skill group?
 * Derived ONLY from the projects' typed content — stack groups, stack
 * preview, categories and domain — matched against the group's own items.
 * Nothing invented; a group with no match simply gets no row.
 */
function groupProvenance() {
  const map = new Map<string, { slug: ProjectSlug; name: string; accent: string }[]>();
  for (const g of skillGroups) {
    const proven = projects
      .filter((p) => {
        const haystack = [
          ...p.stackPreview,
          ...p.stack.flatMap((t) => t.items),
          ...p.categories,
          p.domain,
        ]
          .join(" | ")
          .toLowerCase();
        return g.items.some((item) => haystack.includes(item.toLowerCase()));
      })
      .map((p) => ({ slug: p.slug, name: p.name, accent: p.accent }));
    if (proven.length > 0) map.set(g.name, proven);
  }
  return map;
}

const PROVEN = groupProvenance();

/**
 * Skill-level evidence (Phase 6): exact-match items from the typed
 * skill-evidence content file, joined with project identity for the chips.
 */
const SKILL_EVIDENCE = (() => {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const map = new Map<
    string,
    { slug: ProjectSlug; name: string; accent: string; evidence: string }
  >();
  for (const e of skillEvidence) {
    const p = bySlug.get(e.slug);
    if (p) map.set(e.skill, { slug: p.slug, name: p.name, accent: p.accent, evidence: e.evidence });
  }
  return map;
})();
const EVIDENCE_COUNT = SKILL_EVIDENCE.size;

/**
 * Interactive filter over the grouped skill chips.
 * Empty query  → identical to the static grouping (no behavior change).
 * With a query → only matching chips are shown (accent-tinted), groups with
 * no matches are hidden, and a live count is announced to screen readers.
 */
export function SkillFilter() {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { open: openCase } = useCaseStudy();
  const q = query.trim().toLowerCase();

  const groups = React.useMemo(() => {
    if (!q) return skillGroups.map((g) => ({ name: g.name, items: [...g.items], filtered: false }));
    return skillGroups
      .map((g) => ({
        name: g.name,
        items: g.items.filter((i) => i.toLowerCase().includes(q)),
        filtered: true,
      }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  const matchCount = groups.reduce((n, g) => n + g.items.length, 0);
  const groupCount = groups.length;
  const filtering = q.length > 0;

  return (
    <div>
      {/* Filter input */}
      <div className="relative print:hidden">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter skills — try “PostgreSQL”, “GRPO”, “Docker”…"
          aria-label="Filter skills by keyword"
          className="h-9 w-full rounded-lg border border-border/70 bg-card pl-9 pr-9 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
        />
        {filtering && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear skill filter"
            className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      {/* Live result count for assistive tech */}
      <p aria-live="polite" className="sr-only">
        {filtering
          ? `${matchCount} of ${TOTAL} skills match, across ${groupCount} groups.`
          : `Showing all ${TOTAL} skills.`}
      </p>

      {/* Visible count */}
      <p className="mt-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground print:hidden">
        {filtering ? (
          <>
            <span className="text-primary">{matchCount}</span> / {TOTAL} skills ·{" "}
            {groupCount} group{groupCount === 1 ? "" : "s"}
          </>
        ) : (
          <>
            <span className="text-primary">{TOTAL}</span> skills · {skillGroups.length} groups
          </>
        )}
      </p>

      {/* Evidence legend — explains the accent dot on evidence chips */}
      <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground print:hidden">
        <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden />
        <span>
          {EVIDENCE_COUNT} skills carry a documented project link — hover a
          dotted chip for the evidence, click to open the case study.
        </span>
      </p>

      {/* Groups */}
      <div className="mt-6 space-y-7">
        {groups.map((group) => {
          const proven = PROVEN.get(group.name) ?? [];
          return (
          <div
            key={group.name}
            className={cn(!filtering && !expanded && COLLAPSED_BY_DEFAULT.has(group.name) && "hidden print:block")}
          >
            <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-block size-1 rounded-full bg-primary" aria-hidden />
              {group.name}
            </h3>
            {proven.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/70"
                >
                  proven in
                </span>
                {proven.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => openCase(p.slug)}
                    data-case-open
                    title={`Open the ${p.name} case study`}
                    aria-label={`Open the ${p.name} case study`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <span
                      className="inline-block size-1.5 shrink-0 rounded-full"
                      style={{ background: p.accent }}
                      aria-hidden
                    />
                    {p.name}
                  </button>
                ))}
              </p>
            )}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const ev = SKILL_EVIDENCE.get(item);
                if (ev) {
                  return (
                    <li key={item}>
                      <button
                        onClick={() => openCase(ev.slug)}
                        data-case-open
                        title={`${ev.evidence} — open the ${ev.name} case study`}
                        aria-label={`${item}: used in the ${ev.name} case study. ${ev.evidence}`}
                        className={cn(
                          "group/ev inline-flex max-w-[17rem] items-center gap-1.5 rounded-md border px-2.5 py-1 text-left text-[12.5px] transition-colors",
                          group.filtered
                            ? "border-primary/45 bg-primary/[0.06] text-foreground hover:border-primary/70"
                            : "border-border/70 bg-card text-foreground/80 hover:border-primary/45 hover:text-foreground"
                        )}
                      >
                        <span
                          className="inline-block size-1.5 shrink-0 rounded-full transition-transform group-hover/ev:scale-125"
                          style={{ background: ev.accent }}
                          aria-hidden
                        />
                        <span className="truncate">{item}</span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li
                    key={item}
                    className={
                      group.filtered
                        ? "rounded-md border px-2.5 py-1 text-[12.5px] transition-colors"
                        : "rounded-md border border-border/70 bg-card px-2.5 py-1 text-[12.5px] text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
                    }
                    style={
                      group.filtered
                        ? {
                            borderColor: "color-mix(in oklch, var(--primary) 45%, transparent)",
                            background: "color-mix(in oklch, var(--primary) 6%, transparent)",
                            color: "var(--foreground)",
                          }
                        : undefined
                    }
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          );
        })}

      </div>

      {/* Full technical inventory toggle — filtering always searches everything */}
      {!filtering && (
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-secondary/30 px-4 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground print:hidden"
        >
          <ChevronDown
            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
          {expanded
            ? "Collapse to core inventory"
            : `Full technical inventory — ${COLLAPSED_COUNT} more skills across ${COLLAPSED_GROUPS_N} groups`}
        </button>
      )}

      {/* Empty state (filtering only) */}
      <div className="mt-6 space-y-7">
        {filtering && groups.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/70 bg-secondary/30 p-6 text-center">
            <p className="text-[13.5px] text-foreground/80">
              No skills match <span className="font-mono text-primary">“{query.trim()}”</span>
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Try a broader term — or clear the filter to see all {TOTAL} skills.
            </p>
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card px-3 py-1.5 text-[12.5px] text-foreground transition-colors hover:border-primary/40"
            >
              <X className="size-3.5" aria-hidden />
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
