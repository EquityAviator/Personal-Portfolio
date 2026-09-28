"use client";

/**
 * Case-study context — the LIGHT half of the overlay system.
 *
 * This module owns only the shared state (which case study is open, the
 * "already viewed" list, a11y announcements, deep-link hash handling) plus a
 * few tiny DOM helpers. The heavy overlay UI (dialog + full case bodies +
 * the four interactive visual modules) lives in `case-study-overlay.tsx`
 * and is loaded through `next/dynamic` on first open, so the initial page
 * bundle never pays for it. Splitting the two halves keeps
 * `useCaseStudy` cheap to import from anywhere (header, cards, skills,
 * research) without dragging the overlay graph into every chunk.
 */

import * as React from "react";
import dynamic from "next/dynamic";
import { getProject, projects } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";

/** Event bridge: the command palette dispatches this to scroll the open case
 *  study to a numbered section (the scroll container lives in the overlay). */
export const CASE_JUMP_EVENT = "case-study:jump";
export type CaseJumpDetail = { num: string };

/** sessionStorage key for the "already viewed" case-study list. */
const VIEWED_KEY = "case-study:viewed";

/** Print the open case study as a clean standalone document.
 *  Expands any collapsed accordion sections first so the printed copy is
 *  complete, then lets the body.case-print layout in globals.css take over. */
export function printCaseStudy() {
  const collapsed = document.querySelectorAll<HTMLElement>(
    '[data-slot="dialog-content"] [data-slot="accordion-item"][data-state="closed"] [data-slot="accordion-trigger"]'
  );
  collapsed.forEach((t) => t.click());
  window.setTimeout(() => window.print(), collapsed.length ? 380 : 0);
}

/* ------------------------------------------------------------------ */
/* Context                                                              */
/* ------------------------------------------------------------------ */

const CaseStudyCtx = React.createContext<{
  open: (slug: ProjectSlug) => void;
  close: () => void;
  active: ProjectSlug | null;
  /** Slugs already opened this browser session (sessionStorage-backed). */
  viewed: ProjectSlug[];
}>({ open: () => {}, close: () => {}, active: null, viewed: [] });

export const useCaseStudy = () => React.useContext(CaseStudyCtx);

/** Heavy overlay UI, code-split: fetched on first open, cached afterwards.
 *  While that first fetch is in flight a light scrim covers the page so the
 *  open action still feels acknowledged on slow connections. */
const importOverlay = () => import("./case-study-overlay");
const CaseOverlayLazy = dynamic(importOverlay, {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-[2px]"
      role="status"
      aria-label="Loading case study"
    >
      <span
        aria-hidden
        className="size-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
      />
    </div>
  ),
});

/** Warm the overlay chunk ahead of an open — called on hover/focus intent
 *  (see the [data-case-open] delegation in the provider). Idempotent: the
 *  dynamic module cache resolves repeat calls to the same fetched chunk. */
export function preloadCaseOverlay() {
  void importOverlay();
}

export function CaseStudyProvider({
  children,
  markViewed,
}: {
  children: React.ReactNode;
  /** Set on /work/<slug> routes so reading the canonical page also counts
   *  toward the session "already viewed" affordance (same storage key as
   *  overlay opens — one honest, unified list). */
  markViewed?: ProjectSlug;
}) {
  const [active, setActive] = React.useState<ProjectSlug | null>(null);
  // Screen-reader announcements on open/switch/close (visually hidden live region).
  // announceRef dedupes so re-renders and back/forward don't re-announce.
  const [announcement, setAnnouncement] = React.useState("");
  const announceRef = React.useRef<ProjectSlug | null>(null);
  // Session-persistent "already viewed" list (recruiter orientation affordance).
  const [viewed, setViewed] = React.useState<ProjectSlug[]>([]);

  const announce = React.useCallback((slug: ProjectSlug | null) => {
    if (slug === announceRef.current) return;
    announceRef.current = slug;
    setAnnouncement(
      slug ? `${getProject(slug)?.name ?? "Case study"} case study opened` : "Case study closed"
    );
  }, []);

  // Deep-linking: #case-<slug> opens the case study (and survives back/forward).
  React.useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/^#case-([a-z-]+)$/);
      if (m && getProject(m[1])) {
        announce(m[1] as ProjectSlug);
        setActive(m[1] as ProjectSlug);
      } else {
        announce(null);
        setActive(null);
      }
    };
    // Shared links of the form /?case=<slug> are normalized to the hash form
    // so every entry point (palette, links, history) behaves the same.
    const q = new URLSearchParams(window.location.search).get("case");
    if (q && getProject(q) && !/^#case-[a-z-]+$/.test(window.location.hash)) {
      window.history.replaceState(null, "", `#case-${q}`);
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [announce]);

  // "Viewed" tracking: hydrated from sessionStorage on mount, then kept in
  // sync as case studies are opened. Purely informational — nothing auto-opens.
  React.useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(VIEWED_KEY);
      if (raw) {
        const slugs = (JSON.parse(raw) as string[]).filter((s) => getProject(s));
        setViewed(slugs as ProjectSlug[]);
      }
    } catch {
      /* storage unavailable — affordance silently absent */
    }
  }, []);

  React.useEffect(() => {
    const slug = active ?? markViewed;
    if (!slug) return;
    try {
      const prev = (JSON.parse(window.sessionStorage.getItem(VIEWED_KEY) ?? "[]") as string[]).filter(
        (s) => getProject(s)
      );
      if (!prev.includes(slug)) {
        window.sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...prev, slug]));
      }
    } catch {
      /* storage unavailable */
    }
    setViewed((v) => (v.includes(slug) ? v : [...v, slug]));
  }, [active, markViewed]);

  const open = React.useCallback(
    (slug: ProjectSlug) => {
      window.history.replaceState(null, "", `#case-${slug}`);
      announce(slug);
      setActive(slug);
    },
    [announce]
  );

  // Arrow-key navigation between case studies while the overlay is open.
  // Left/Right are unused for vertical scrolling, so this is safe; guards skip
  // text inputs, editables and composite widgets (accordions, radiogroups).
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          target.closest('[role="radiogroup"], [role="listbox"], [role="menu"]'))
      )
        return;
      const idx = projects.findIndex((p) => p.slug === active);
      if (idx < 0) return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      e.preventDefault();
      open(projects[(idx + dir + projects.length) % projects.length].slug);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, open]);

  const close = React.useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    announce(null);
    setActive(null);
  }, [announce]);

  // Intent preloading: hovering or keyboard-focusing ANY element marked
  // [data-case-open] warms the overlay chunk so the first open is instant.
  // The dynamic import is cached, so repeat events cost ~nothing.
  React.useEffect(() => {
    const onIntent = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.("[data-case-open]")) preloadCaseOverlay();
    };
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    return () => {
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
    };
  }, []);

  return (
    <CaseStudyCtx.Provider value={{ open, close, active, viewed }}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {/* Conditional mount: the chunk is fetched on first open only —
          an unmounted dynamic component initiates no import(). */}
      {active ? <CaseOverlayLazy active={active} onClose={close} onOpen={open} /> : null}
    </CaseStudyCtx.Provider>
  );
}
