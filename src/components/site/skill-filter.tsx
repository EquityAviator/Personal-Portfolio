"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { skillGroups } from "@/content/site";
import { projects } from "@/content/projects";
import { useCaseStudy } from "@/components/case-study/case-study-overlay";
import type { ProjectSlug } from "@/content/types";

const TOTAL = skillGroups.reduce((n, g) => n + g.items.length, 0);

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
 * Interactive filter over the grouped skill chips.
 * Empty query  → identical to the static grouping (no behavior change).
 * With a query → only matching chips are shown (accent-tinted), groups with
 * no matches are hidden, and a live count is announced to screen readers.
 */
export function SkillFilter() {
  const [query, setQuery] = React.useState("");
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

      {/* Groups */}
      <div className="mt-6 space-y-7">
        {groups.map((group) => {
          const proven = PROVEN.get(group.name) ?? [];
          return (
          <div key={group.name}>
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
              {group.items.map((item) => (
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
              ))}
            </ul>
          </div>
          );
        })}

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
