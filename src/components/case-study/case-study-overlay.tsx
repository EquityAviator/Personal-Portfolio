"use client";

import * as React from "react";
import { Check, Link2, Printer } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/site";
import type { ProjectSlug } from "@/content/types";
import { StoryRail } from "./primitives";
import { CaseStudyBody, LinkRow, MetaChips } from "./case-study-body";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Section map — one ordered, uniquely-numbered list per case study.   */
/* Drives the desktop mini-TOC; ids (#cs-<num>) come from CaseSection. */
/* ------------------------------------------------------------------ */

const CASE_SECTIONS: Record<ProjectSlug, { num: string; title: string }[]> = {
  "dark-pattern-hunter": [
    { num: "01", title: "Overview" },
    { num: "02", title: "The pipeline" },
    { num: "03", title: "Capabilities" },
    { num: "04", title: "Engineering decisions" },
    { num: "05", title: "Built vs used" },
    { num: "06", title: "Technology stack" },
    { num: "07", title: "Design findings" },
    { num: "08", title: "Limitations" },
  ],
  captionai: [
    { num: "01", title: "Overview" },
    { num: "02", title: "The numbers" },
    { num: "03", title: "Experimental ladder" },
    { num: "04", title: "Champion vs baseline" },
    { num: "05", title: "What didn't work" },
    { num: "06", title: "Serving engineering" },
    { num: "07", title: "Engineering decisions" },
    { num: "08", title: "Built vs used" },
    { num: "09", title: "Technology stack" },
    { num: "10", title: "Design findings" },
    { num: "11", title: "Limitations" },
  ],
  chainproof: [
    { num: "01", title: "Overview" },
    { num: "02", title: "How it works" },
    { num: "03", title: "Review lifecycle" },
    { num: "04", title: "Trust stack" },
    { num: "05", title: "Public verification" },
    { num: "06", title: "Engineering decisions" },
    { num: "07", title: "Built vs used" },
    { num: "08", title: "Technology stack" },
    { num: "09", title: "Design findings" },
    { num: "10", title: "Limitations" },
  ],
  anglupol: [
    { num: "01", title: "Overview" },
    { num: "02", title: "Learning loop" },
    { num: "03", title: "Vocabulary foundation" },
    { num: "04", title: "FSRS-4.5" },
    { num: "05", title: "Security & realtime" },
    { num: "06", title: "Engineering decisions" },
    { num: "07", title: "Built vs used" },
    { num: "08", title: "Technology stack" },
    { num: "09", title: "Design findings" },
    { num: "10", title: "Limitations" },
  ],
};


/** Sections of a case study (ordered, uniquely numbered) — exported for the
 *  command palette so ⌘K can jump straight to a section. */
export function getCaseSections(slug: ProjectSlug) {
  return CASE_SECTIONS[slug] ?? [];
}

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

/** Rough reading time — implementation lives in the shared pure module
 *  `@/lib/reading` (server components need it too). Imported (not purely
 *  re-exported) because this module ALSO calls it locally in the overlay
 *  header — `export { X } from "..."` does not create a local binding, and
 *  the local call site would throw a ReferenceError at render time. */
import { estimateReadMinutes } from "@/lib/reading";
export { estimateReadMinutes };

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

export function CaseStudyProvider({ children }: { children: React.ReactNode }) {
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
    if (!active) return;
    try {
      const prev = (JSON.parse(window.sessionStorage.getItem(VIEWED_KEY) ?? "[]") as string[]).filter(
        (s) => getProject(s)
      );
      if (!prev.includes(active)) {
        window.sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...prev, active]));
      }
    } catch {
      /* storage unavailable */
    }
    setViewed((v) => (v.includes(active) ? v : [...v, active]));
  }, [active]);

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

  return (
    <CaseStudyCtx.Provider value={{ open, close, active, viewed }}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      <CaseStudyOverlay active={active} onClose={close} onOpen={open} />
    </CaseStudyCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay                                                              */
/* ------------------------------------------------------------------ */

function CaseSwitcher({
  activeSlug,
  onOpen,
}: {
  activeSlug: ProjectSlug;
  onOpen: (slug: ProjectSlug) => void;
}) {
  return (
    <nav
      aria-label="Switch between case studies"
      className="mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
    >
      {projects.map((p) => {
        const isActive = p.slug === activeSlug;
        return (
          <button
            key={p.slug}
            onClick={() => onOpen(p.slug)}
            aria-current={isActive ? "true" : undefined}
            aria-pressed={isActive}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wide transition-colors",
              isActive
                ? "border-transparent text-foreground"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
            style={
              isActive
                ? {
                    background: `color-mix(in oklch, ${p.accent} 12%, transparent)`,
                    borderColor: `color-mix(in oklch, ${p.accent} 45%, transparent)`,
                  }
                : undefined
            }
          >
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: p.accent, opacity: isActive ? 1 : 0.55 }}
              aria-hidden
            />
            {p.name}
          </button>
        );
      })}
    </nav>
  );
}

/** Shared scroll-spy for case-study sections (drives desktop TOC + mobile dots).
 *  rAF-throttled; state changes only when the active section changes. */
function useCaseSectionSpy(
  sections: { num: string; title: string }[],
  scrollRef: React.RefObject<HTMLDivElement | null>,
) {
  const [activeNum, setActiveNum] = React.useState(sections[0]?.num ?? "01");

  // Reset when the case study (and therefore the section list) changes.
  React.useEffect(() => {
    setActiveNum(sections[0]?.num ?? "01");
  }, [sections]);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = scrollRef.current;
      if (!el) return;
      const marker = el.scrollTop + el.clientHeight * 0.3;
      let current = sections[0]?.num ?? "01";
      for (const s of sections) {
        const sec = el.querySelector(`#cs-${s.num}`) as HTMLElement | null;
        if (sec && sec.offsetTop <= marker) current = s.num;
      }
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        current = sections[sections.length - 1]?.num ?? current;
      }
      setActiveNum((prev) => (prev === current ? prev : current));
    };
    // Capture-phase listener on document: scroll events don't bubble, and this
    // survives the DialogContent portal mounting AFTER this effect runs (the
    // scroll container simply isn't the event target until it exists).
    const onScroll = (e: Event) => {
      if (e.target !== scrollRef.current) return;
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    // Initial sync — el may still be mounting; guarded, and the next scroll
    // event will correct the state anyway.
    frame = requestAnimationFrame(update);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections, scrollRef]);

  return activeNum;
}

function CaseToc({
  sections,
  activeNum,
  onGo,
}: {
  sections: { num: string; title: string }[];
  activeNum: string;
  onGo: (num: string) => void;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-4 z-30 hidden w-48 items-center xl:flex print:hidden"
      aria-hidden={false}
    >
      <nav
        aria-label="Case study sections"
        className="case-toc pointer-events-auto max-h-full w-full overflow-y-auto rounded-xl border border-border/60 bg-popover/90 p-1.5 shadow-lg backdrop-blur-md"
      >
        <p className="px-2 pb-1.5 pt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Sections
        </p>
        {sections.map((s) => (
          <button
            key={s.num}
            data-active={activeNum === s.num}
            onClick={() => onGo(s.num)}
            className="flex w-full items-baseline gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-secondary/70"
            aria-current={activeNum === s.num ? "true" : undefined}
          >
            <span className="case-toc-num shrink-0 font-mono text-[9.5px] text-muted-foreground">
              {s.num}
            </span>
            <span
              className="case-toc-title truncate text-[11px] leading-tight text-muted-foreground"
              title={s.title}
            >
              {s.title}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/** Mobile/tablet section indicator (< xl): floating pill of dots, one per
 *  section. Active dot stretches into an accent pill. Tapping jumps to it.
 *  (xl+ uses the floating mini-TOC instead.) */
function CaseDots({
  sections,
  activeNum,
  accent,
  onGo,
}: {
  sections: { num: string; title: string }[];
  activeNum: string;
  accent: string;
  onGo: (num: string) => void;
}) {
  if (!sections.length) return null;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center xl:hidden print:hidden"
      aria-hidden={false}
    >
      <nav
        aria-label="Case study sections"
        className="case-dots pointer-events-auto flex items-center gap-2 rounded-full border border-border/60 bg-popover/90 py-1 pl-3 pr-1.5 shadow-lg backdrop-blur-md"
      >
        <span
          className="font-mono text-[9.5px] tracking-[0.14em] text-muted-foreground tabular-nums"
          aria-hidden
        >
          {activeNum}/{String(sections.length).padStart(2, "0")}
        </span>
        <span className="h-3 w-px bg-border" aria-hidden />
        <div className="flex items-center">
          {sections.map((s) => {
            const isActive = activeNum === s.num;
            return (
              <button
                key={s.num}
                onClick={() => onGo(s.num)}
                aria-label={`Go to section ${s.num} — ${s.title}`}
                aria-current={isActive ? "true" : undefined}
                className="group/dot grid h-6 w-4 place-items-center"
              >
                <span
                  data-active={isActive}
                  className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/35 transition-all duration-200 group-hover/dot:bg-foreground/60 data-[active=true]:w-3.5"
                  style={isActive ? { background: accent } : undefined}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function CaseStudyOverlay({
  active,
  onClose,
  onOpen,
}: {
  active: ProjectSlug | null;
  onClose: () => void;
  onOpen: (slug: ProjectSlug) => void;
}) {
  const project = active ? getProject(active) : undefined;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // When an overlay is open, printing should output the case study itself.
  // globals.css keys off body.case-print for that layout switch.
  React.useEffect(() => {
    document.body.classList.toggle("case-print", !!project);
    return () => document.body.classList.remove("case-print");
  }, [project]);

  // Reset scroll + progress when switching case studies
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
  }, [active]);

  // Reading progress: rAF-throttled, written directly to the bar's style
  // so scrolling never triggers a React re-render of the overlay.
  const frameRef = React.useRef(0);
  React.useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);
  const onBodyScroll = React.useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const el = scrollRef.current;
      const bar = progressRef.current;
      if (!el || !bar) return;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    });
  }, []);

  const next =
    project
      ? projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length]
      : undefined;
  const { toast } = useToast();
  const [linkCopied, setLinkCopied] = React.useState(false);
  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast({ title: "Case study link copied", description: url });
      setTimeout(() => setLinkCopied(false), 2400);
    } catch {
      toast({
        title: "Couldn't access clipboard",
        description: `Copy it manually: ${url}`,
      });
    }
  };


  // Keep og/twitter meta in sync with the open case study so a copied link
  // carries the right preview. Restores site defaults when the overlay closes.
  React.useEffect(() => {
    const set = (selector: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };
    if (!project) {
      set('meta[property="og:title"]', "Muhammad Hamza Mushtaq — Software & AI Engineer");
      set('meta[name="twitter:title"]', "Muhammad Hamza Mushtaq — Software & AI Engineer");
      set('meta[property="og:image"]', `${window.location.origin}/opengraph-image`);
      set('meta[name="twitter:image"]', `${window.location.origin}/opengraph-image`);
      return;
    }
    const title = `${project.name} — Case study`;
    const image = `${window.location.origin}/api/og?case=${project.slug}`;
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', project.tagline);
    set('meta[property="og:image"]', image);
    set('meta[name="twitter:title"]', title);
    set('meta[name="twitter:description"]', project.tagline);
    set('meta[name="twitter:image"]', image);
  }, [project]);

  const sections = project ? CASE_SECTIONS[project.slug] : [];
  const activeSection = useCaseSectionSpy(sections, scrollRef);
  const goToSection = React.useCallback(
    (num: string) => {
      const sec = scrollRef.current?.querySelector(`#cs-${num}`);
      sec?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [reduce]
  );

  // Command-palette bridge: ⌘K "Case study sections" dispatches CASE_JUMP_EVENT
  // so a section can be jumped to without owning the scroll container.
  React.useEffect(() => {
    const onJump = (e: Event) => {
      const num = (e as CustomEvent<CaseJumpDetail>).detail?.num;
      if (num) goToSection(num);
    };
    window.addEventListener(CASE_JUMP_EVENT, onJump);
    return () => window.removeEventListener(CASE_JUMP_EVENT, onJump);
  }, [goToSection]);

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        style={project ? ({ ["--pa" as string]: project.accent } as React.CSSProperties) : undefined}
        className={cn(
          "flex h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-background p-0",
          "sm:h-[min(48rem,calc(100dvh-3rem))] sm:w-[min(60rem,calc(100vw-2rem))] sm:max-w-[60rem] sm:rounded-xl sm:border"
        )}
      >
        {project && (
          <>
            {/* per-project accent identity hairline */}
            <div
              aria-hidden
              className="h-[3px] w-full shrink-0 print:hidden"
              style={{
                background: `linear-gradient(90deg, ${project.accent}, color-mix(in oklch, ${project.accent} 28%, transparent) 55%, transparent)`,
              }}
            />
            {/* ---------- Header ---------- */}
            <div className="shrink-0 border-b border-border/60 bg-card/60 px-5 pb-4 pt-5 backdrop-blur sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="pa-text font-mono text-[10px] uppercase tracking-[0.22em]">
                    Case study {project.index} — {project.categories.join(" · ")}
                  </p>
                  <DialogTitle className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                    {project.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 max-w-2xl text-balance text-[13.5px] leading-relaxed text-muted-foreground">
                    {project.tagline}
                  </DialogDescription>
                </div>
                <button
                  onClick={copyLink}
                  aria-label="Copy link to this case study"
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground print:hidden"
                >
                  {linkCopied ? (
                    <Check className="size-3.5 text-emerald-500" aria-hidden />
                  ) : (
                    <Link2 className="size-3.5" aria-hidden />
                  )}
                </button>
                <button
                  onClick={() => {
                    // start from the top so the printed document reads in order
                    scrollRef.current?.scrollTo({ top: 0 });
                    printCaseStudy();
                  }}
                  aria-label="Print this case study"
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground print:hidden"
                >
                  <Printer className="size-3.5" aria-hidden />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <StoryRail story={project.story} accent={project.accent} compact />
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <MetaChips project={project} />
                  <LinkRow project={project} />
                </div>
              </div>
              <CaseSwitcher activeSlug={project.slug} onOpen={onOpen} />
              {/* left-aligned so the xl+ floating TOC never covers it */}
              <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                {sections.length} sections · ~{estimateReadMinutes(project)} min read
                <span className="hidden items-center gap-1.5 pl-1 sm:inline-flex print:hidden" aria-hidden>
                  ·
                  <kbd className="kbd-chip">←</kbd>
                  <kbd className="kbd-chip">→</kbd>
                  switch
                </span>
              </p>
              {/* printed copies carry provenance: whose portfolio, which case */}
              <p className="mt-2 hidden border-t border-border/40 pt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground print:block">
                From the portfolio of {profile.name} — {profile.role} · {profile.github.replace("https://", "")} · case {project.index}
              </p>
            </div>

            {/* ---------- Scrollable body ---------- */}
            <div
              ref={scrollRef}
              onScroll={onBodyScroll}
              className="case-scroll relative flex-1 overflow-y-auto pb-14 xl:pb-6 xl:pr-52"
            >
              {/* reading progress — accent-tinted, scroll-driven (no re-render) */}
              <div
                ref={progressRef}
                className="sticky top-0 z-20 h-[2px] w-full origin-left print:hidden"
                style={{
                  transform: "scaleX(0)",
                  background: `linear-gradient(90deg, ${project.accent}, color-mix(in oklch, ${project.accent} 35%, transparent))`,
                }}
                aria-hidden
              />
              <CaseStudyBody project={project} next={next} onOpenNext={onOpen} />
            </div>
          </>
        )}
        {project && (
          <>
            <CaseDots
              key={`dots-${project.slug}`}
              sections={CASE_SECTIONS[project.slug]}
              activeNum={activeSection}
              accent={project.accent}
              onGo={goToSection}
            />
            <CaseToc
              key={project.slug}
              sections={CASE_SECTIONS[project.slug]}
              activeNum={activeSection}
              onGo={goToSection}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
