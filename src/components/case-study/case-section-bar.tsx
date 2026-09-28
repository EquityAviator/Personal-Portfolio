"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky section navigation for the canonical /work/<slug> routes.
 *
 * The homepage overlay already has a desktop mini-TOC with scroll-spy inside
 * its dialog; canonical routes previously had none. This bar gives route
 * readers the same orientation on every viewport: a slim sticky rail of
 * section jumps that highlights the section currently in view.
 *
 * Scroll-spy runs on window scroll (the route scroll container), throttled
 * with rAF, and respects prefers-reduced-motion on jump.
 */

export interface CaseSectionBarProps {
  sections: { num: string; title: string }[];
  accent: string;
}

export function CaseSectionBar({ sections, accent }: CaseSectionBarProps) {
  const [active, setActive] = React.useState(sections[0]?.num ?? "");

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      // Last heading whose top cleared the sticky offset wins.
      const probe = 120;
      let current = sections[0]?.num ?? "";
      for (const s of sections) {
        const el = document.getElementById(`cs-${s.num}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = s.num;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const jump = (num: string) => {
    const el = document.getElementById(`cs-${num}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-14 z-30 border-y border-border/60 bg-background/85 backdrop-blur print:hidden"
    >
      <div className="case-scroll mx-auto w-full max-w-5xl px-2 sm:px-4">
        <ul
          className={cn(
            "flex items-stretch gap-0.5 overflow-x-auto py-1.5",
            // Mobile: fade both edges of the horizontal scroller so cut-off
            // labels read as "scrollable" rather than truncated. Desktop
            // (≥md) usually fits, so no static mask there.
            "max-md:[mask-image:linear-gradient(to_right,transparent,black_14px,black_calc(100%-14px),transparent)]"
          )}
        >
          {sections.map((s) => {
            const isActive = s.num === active;
            return (
              <li key={s.num} className="shrink-0">
                <button
                  onClick={() => jump(s.num)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-md px-2.5 py-1.5 text-left transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="font-mono text-[9.5px]" style={{ color: isActive ? accent : undefined }}>
                      {s.num}
                    </span>
                    <span className={cn("text-[11.5px]", isActive && "font-medium")}>
                      {s.title}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-2.5 -bottom-[7px] h-[2px] rounded-full"
                      style={{
                        background: `color-mix(in oklch, ${accent} 80%, transparent)`,
                      }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
