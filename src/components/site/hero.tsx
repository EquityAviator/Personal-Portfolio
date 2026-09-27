"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { profile, heroValue } from "@/content/site";
import { projects } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";

/**
 * V2 signature interaction — the system map.
 *
 * INPUT → MODEL/LOGIC → SYSTEM → OUTPUT: hover, focus or pin a stage and the
 * work that demonstrates it is emphasized (everything else recedes). Nodes
 * are real buttons (keyboard-reachable), the active state is non-animated
 * under reduced motion, and every case chip links to its canonical route.
 */
const flowStages: {
  label: string;
  detail: string;
  cases: ProjectSlug[];
}[] = [
  { label: "INPUT", detail: "pages · images · text", cases: ["dark-pattern-hunter", "captionai"] },
  { label: "MODEL / LOGIC", detail: "VLM · CLIP · GRPO · FSRS", cases: ["captionai", "dark-pattern-hunter"] },
  { label: "SYSTEM", detail: "API · events · state machine", cases: ["chainproof", "anglupol"] },
  { label: "OUTPUT", detail: "live products · verified records", cases: ["chainproof", "anglupol"] },
];

function SystemFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);

  // Hover/focus previews; click pins. Pin survives pointer-leave.
  const shown = pinned ?? active;
  const set = (label: string | null) => setActive(label);

  return (
    <motion.ol
      className="relative space-y-0"
      initial="hidden"
      animate="show"
      aria-label="System map of Hamza's engineering profile — select a stage to highlight the projects that demonstrate it"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: 0.3 } },
      }}
      onMouseLeave={() => set(null)}
    >
      {flowStages.map((node, i) => {
        const isDimmed = shown !== null && shown !== node.label;
        return (
          <motion.li
            key={node.label}
            className="relative flex items-start gap-4"
            variants={{
              hidden: { opacity: 0, x: 12 },
              show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
            }}
          >
            {/* rail */}
            <div className="relative flex w-6 shrink-0 flex-col items-center" aria-hidden>
              <span
                className={`z-10 mt-1 size-2 rounded-full border transition-colors duration-200 ${
                  shown === node.label
                    ? "border-primary bg-primary"
                    : "border-border bg-background"
                }`}
              />
              {i < flowStages.length - 1 && (
                <span
                  className="flow-line h-10"
                  style={{ ["--fd" as string]: `${i * 0.55}s` }}
                />
              )}
            </div>

            <div className={`min-w-0 flex-1 pb-2 transition-opacity duration-200 ${isDimmed ? "opacity-45" : "opacity-100"}`}>
              <button
                type="button"
                onMouseEnter={() => set(node.label)}
                onFocus={() => set(node.label)}
                onBlur={() => set(null)}
                onClick={() => setPinned((p) => (p === node.label ? null : node.label))}
                aria-pressed={pinned === node.label}
                className="block rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <p
                  className={`font-mono text-[11px] tracking-[0.18em] transition-colors ${
                    shown === node.label ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {node.label}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {node.detail}
                </p>
              </button>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 print:hidden">
                {node.cases.map((slug) => {
                  const p = projects.find((pr) => pr.slug === slug);
                  if (!p) return null;
                  const emphasized = shown === null || shown === node.label;
                  return (
                    <Link
                      key={slug}
                      href={`/work/${slug}`}
                      aria-label={`${p.name} case study — demonstrates the ${node.label} stage`}
                      className={`group/case inline-flex items-center gap-1 font-mono text-[10px] transition-all duration-200 hover:text-[var(--pl)] focus-visible:text-[var(--pl)] ${
                        emphasized
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40"
                      }`}
                      style={{ ["--pl" as string]: p.accent }}
                    >
                      <span aria-hidden className="transition-transform group-hover/case:translate-x-0.5">
                        ↳
                      </span>
                      {p.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Introduction">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 tracking-[0.18em] text-primary">
                <span className="relative flex size-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                Available for work
              </span>
              <span aria-hidden>/</span>
              <span>{profile.location}</span>
              <span aria-hidden>/</span>
              <span>{profile.timezone}</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Muhammad Hamza
              <br />
              <span className="text-muted-foreground">Mushtaq</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {heroValue}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-7 flex flex-wrap gap-2"
              aria-label="Specializations"
            >
              {profile.specialization.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/80"
                >
                  {s}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-9 flex flex-wrap items-center gap-3 print:hidden"
            >
              <Button asChild size="sm" className="h-9 px-4 font-medium">
                <a href="#work">
                  View selected work
                  <ArrowDown className="ml-1.5 size-3.5" aria-hidden />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-9 px-4">
                <a href="#contact">
                  Contact me
                  <ArrowRight className="ml-1.5 size-3.5" aria-hidden />
                </a>
              </Button>
              <div className="ml-1 flex items-center gap-1" aria-label="Profiles">
                <Button asChild variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="GitHub profile">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github className="size-4" aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="LinkedIn profile">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="size-4" aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="Email">
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="size-4" aria-hidden />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Signature system map */}
          <div className="hidden rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-[2px] lg:block print:border-foreground/30 print:bg-transparent">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              system.profile — how i build
            </p>
            <SystemFlow />
            <p className="mt-3 border-t border-border/50 pt-3 font-mono text-[9.5px] leading-relaxed text-muted-foreground/80 print:hidden">
              hover or focus a stage — the work that proves it stays lit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
