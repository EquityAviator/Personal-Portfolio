"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Command, FileDown, Moon, Sun, Terminal, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  CASE_JUMP_EVENT,
  printCaseStudy,
  useCaseStudy,
} from "@/components/case-study/case-study-overlay";
import { getCaseSections } from "@/lib/case-sections";
import { printResume } from "@/components/site/resume-print";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { navLinks, profile } from "@/content/site";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const { open: openCase, close: closeCase, active: activeCase } = useCaseStudy();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  // Section jump works on the homepage; from a case-study route it falls
  // back to navigating home with the hash (browser scrolls on arrival).
  const go = (href: string) =>
    run(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/${href}`);
      }
    });

  // While a case study is open, offer next/prev/close right in the palette.
  const activeIdx = projects.findIndex((p) => p.slug === activeCase);
  const prevCase = activeIdx >= 0
    ? projects[(activeIdx - 1 + projects.length) % projects.length]
    : undefined;
  const nextCase = activeIdx >= 0
    ? projects[(activeIdx + 1) % projects.length]
    : undefined;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 border-border/70 font-mono text-[11px] text-muted-foreground sm:inline-flex"
        onClick={() => setOpen(true)}
        aria-label="Open command palette (Ctrl K)"
      >
        <Command className="size-3" aria-hidden />
        <span aria-hidden>K</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects, sections, actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {activeCase && (
            <CommandGroup heading="This case study">
              {nextCase && (
                <CommandItem
                  value="next case study"
                  onSelect={() => run(() => openCase(nextCase.slug))}
                >
                  <span
                    className="mr-2 inline-block size-2 shrink-0 rounded-full"
                    style={{ background: nextCase.accent }}
                    aria-hidden
                  />
                  Next case study — {nextCase.name}
                </CommandItem>
              )}
              {prevCase && (
                <CommandItem
                  value="previous case study"
                  onSelect={() => run(() => openCase(prevCase.slug))}
                >
                  <span
                    className="mr-2 inline-block size-2 shrink-0 rounded-full"
                    style={{ background: prevCase.accent }}
                    aria-hidden
                  />
                  Previous case study — {prevCase.name}
                </CommandItem>
              )}
              <CommandItem value="close case study exit" onSelect={() => run(closeCase)}>
                Close case study
              </CommandItem>
              <CommandItem
                value="print case study save pdf"
                onSelect={() => run(printCaseStudy)}
              >
                Print this case study (PDF)
              </CommandItem>
            </CommandGroup>
          )}
          {activeCase && getCaseSections(activeCase).length > 1 && (
            <CommandGroup heading="Jump to section">
              {getCaseSections(activeCase).map((s) => (
                <CommandItem
                  key={s.num}
                  value={`section ${s.num} ${s.title}`}
                  onSelect={() =>
                    run(() =>
                      window.dispatchEvent(
                        new CustomEvent(CASE_JUMP_EVENT, { detail: { num: s.num } })
                      )
                    )
                  }
                >
                  <span
                    className="mr-2 font-mono text-[10px] text-muted-foreground tabular-nums"
                    aria-hidden
                  >
                    {s.num}
                  </span>
                  {s.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Case studies">
            {projects.map((p) => (
              <CommandItem
                key={p.slug}
                value={`${p.name} ${p.categories.join(" ")}`}
                onSelect={() => run(() => openCase(p.slug))}
              >
                <span
                  className="mr-2 inline-block size-2 shrink-0 rounded-full"
                  style={{ background: p.accent }}
                  aria-hidden
                />
                {p.name}
                <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                  {p.categories[0]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigate">
            {navLinks.map((l) => (
              <CommandItem key={l.href} value={l.label} onSelect={() => go(l.href)}>
                {l.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem
              value="email me"
              onSelect={() => run(() => (window.location.href = `mailto:${profile.email}`))}
            >
              Email me
            </CommandItem>
            <CommandItem
              value="copy email address"
              onSelect={() =>
                run(async () => {
                  try {
                    await navigator.clipboard.writeText(profile.email);
                  } catch {
                    /* clipboard unavailable — mailto still works */
                  }
                })
              }
            >
              Copy email address
            </CommandItem>
            <CommandItem
              value="add to contacts vcard download"
              onSelect={() =>
                run(() => {
                  const a = document.createElement("a");
                  a.href = "/api/vcard";
                  a.download = "hamza-mushtaq.vcf";
                  a.click();
                })
              }
            >
              Add to contacts (.vcf)
            </CommandItem>
            <CommandItem
              value="print or save as pdf"
              onSelect={() => run(() => window.print())}
            >
              Print / save as PDF
            </CommandItem>
            <CommandItem
              value="open github"
              onSelect={() => run(() => window.open(profile.github, "_blank"))}
            >
              Open GitHub
            </CommandItem>
            <CommandItem
              value="open linkedin"
              onSelect={() => run(() => window.open(profile.linkedin, "_blank"))}
            >
              Open LinkedIn
            </CommandItem>
            <CommandItem
              value="toggle theme"
              onSelect={() => {
                setOpen(false);
                setTheme(
                  document.documentElement.classList.contains("dark") ? "light" : "dark"
                );
              }}
            >
              Toggle dark / light
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      aria-label="Toggle dark / light theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </Button>
  );
}

/** Ordered section ids used for scroll-spy. `education` maps to no nav item. */
const SPY_SECTIONS = ["work", "process", "capabilities", "research", "education", "about", "contact"] as const;

function useActiveSection() {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.scrollY + window.innerHeight * 0.32;
      let current: string | null = null;
      for (const id of SPY_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }
      // At the very bottom, force contact active.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = "contact";
      }
      const mapped =
        current && navLinks.some((l) => l.href === `#${current}`) ? current : null;
      setActive(mapped);
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
  }, []);

  return active;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const active = useActiveSection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // From a case-study route, nav items link home with the hash.
  const navTarget = (href: string) => (isHome ? href : `/${href}`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {isHome ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span
              className="grid size-7 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary"
              aria-hidden
            >
              <Terminal className="size-3.5" />
            </span>
            <span className="font-mono text-[13px] font-medium tracking-tight text-foreground/90 group-hover:text-foreground">
              {profile.shortName}
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Back to home"
          >
            <span
              className="grid size-7 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary"
              aria-hidden
            >
              <Terminal className="size-3.5" />
            </span>
            <span className="font-mono text-[13px] font-medium tracking-tight text-foreground/90 group-hover:text-foreground">
              {profile.shortName}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground" aria-hidden>
              / home
            </span>
          </Link>
        )}

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {navLinks.map((l) => {
            const isActive = isHome && active === l.href.slice(1);
            return (
              <Link
                key={l.href}
                href={navTarget(l.href)}
                onClick={!isHome ? undefined : (e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "nav-link rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 border-border/70 font-mono text-[11px] text-muted-foreground sm:inline-flex"
            onClick={() => printResume()}
            aria-label="Print résumé (PDF)"
            title="Print résumé (PDF)"
          >
            <FileDown className="size-3.5" aria-hidden />
            <span aria-hidden>Résumé</span>
          </Button>
          <CommandPalette />
          <ThemeToggle />
          <button
            className="grid size-8 place-items-center rounded-md text-foreground md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-px w-full bg-foreground transition-transform ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-full bg-foreground transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-full bg-foreground transition-transform ${
                  menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-border/70 bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden",
          menuOpen ? "max-h-[27rem] border-t opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3" aria-label="Mobile">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={navTarget(l.href)}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-baseline gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-secondary hover:text-foreground",
                isHome && active === l.href.slice(1) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="font-mono text-[10px] text-primary" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm">{l.label}</span>
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex-1 gap-2 border-border/70 font-mono text-[11px] text-muted-foreground"
              onClick={() => {
                setMenuOpen(false);
                printResume();
              }}
            >
              <FileDown className="size-3.5" aria-hidden />
              Résumé (PDF)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex-1 gap-2 border-border/70 font-mono text-[11px] text-muted-foreground"
              asChild
            >
              <a href="/api/vcard" download="hamza-mushtaq.vcf">
                <UserRoundPlus className="size-3.5" aria-hidden />
                Contact card
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
