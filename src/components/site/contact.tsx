"use client";

import * as React from "react";
import { ArrowUpRight, Check, Copy, FileCode2, FileDown, FileText, Github, Linkedin, Mail, Phone, Printer, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { useToast } from "@/hooks/use-toast";
import { printResume } from "@/components/site/resume-print";
import { profile } from "@/content/site";

/** Live Asia/Karachi clock — rendered client-side after mount. */
function LocalTime() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">{time ?? "--:--"}</span>
  );
}

export function Contact() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast({
        title: "Email address copied",
        description: profile.email,
      });
      setTimeout(() => setCopied(false), 2400);
    } catch {
      toast({
        title: "Couldn't access clipboard",
        description: "Use the email button instead — it opens your mail client.",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-border/60"
      aria-labelledby="contact-heading"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 rotate-180" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-6 bg-primary/60" aria-hidden />
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Have a project, role, or research opportunity?
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Direct contact works best — email reaches me fastest. I&apos;m open to
            software engineering, AI/ML and research-oriented roles.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="sm" className="h-10 px-5">
              <a href={`mailto:${profile.email}`}>
                <Mail className="mr-2 size-4" aria-hidden />
                {profile.email}
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              onClick={copyEmail}
              aria-label="Copy email address to clipboard"
            >
              {copied ? (
                <Check className="mr-2 size-4 text-emerald-500" aria-hidden />
              ) : (
                <Copy className="mr-2 size-4" aria-hidden />
              )}
              Copy
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10">
              <a href="/api/vcard" download="hamza-mushtaq.vcf">
                <UserRoundPlus className="mr-2 size-4" aria-hidden />
                Add to contacts
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10">
              <a href={profile.phoneHref}>
                <Phone className="mr-2 size-4" aria-hidden />
                {profile.phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 size-4" aria-hidden />
                GitHub
                <ArrowUpRight className="ml-1 size-3.5 text-muted-foreground" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 size-4" aria-hidden />
                LinkedIn
                <ArrowUpRight className="ml-1 size-3.5 text-muted-foreground" aria-hidden />
              </a>
            </Button>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-2 font-mono text-[11.5px] text-muted-foreground">
            <span>{profile.location}</span>
            <span aria-hidden>·</span>
            <span>{profile.timezone}</span>
            <span aria-hidden>·</span>
            <span>
              local time <LocalTime />
            </span>
          </p>
          {/* Documents — each action composes the same typed content into a
              different deliverable. Card grid keeps four options scannable
              where the old ghost-button row would crowd. */}
          <div
            className="mt-5 max-w-3xl"
            role="group"
            aria-label="Download and print documents"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Documents
            </p>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Résumé — standard print layout */}
              <button
                type="button"
                onClick={() => printResume()}
                className="group rounded-lg border border-border/70 bg-card/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Print résumé as PDF"
              >
                <FileDown className="size-4 text-primary" aria-hidden />
                <span className="mt-2 block text-[13px] font-medium">Résumé (PDF)</span>
                <span className="mt-0.5 block font-mono text-[10.5px] text-muted-foreground">
                  print-optimized · 2 pages
                </span>
              </button>
              {/* Résumé — one-page compressed layout */}
              <button
                type="button"
                onClick={() => printResume(true)}
                className="group rounded-lg border border-border/70 bg-card/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Print one-page résumé as PDF"
              >
                <FileText className="size-4 text-primary" aria-hidden />
                <span className="mt-2 block text-[13px] font-medium">One-page résumé (PDF)</span>
                <span className="mt-0.5 block font-mono text-[10.5px] text-muted-foreground">
                  same content · compressed
                </span>
              </button>
              {/* Résumé — Markdown for ATS / plain-text pipelines */}
              <a
                href="/api/resume-md"
                download="hamza-mushtaq-resume.md"
                className="group rounded-lg border border-border/70 bg-card/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Download résumé as Markdown"
              >
                <FileCode2 className="size-4 text-primary" aria-hidden />
                <span className="mt-2 block text-[13px] font-medium">Résumé (Markdown)</span>
                <span className="mt-0.5 block font-mono text-[10.5px] text-muted-foreground">
                  plain text · ATS-friendly
                </span>
              </a>
              {/* Full portfolio page as a PDF */}
              <button
                type="button"
                onClick={() => window.print()}
                className="group rounded-lg border border-border/70 bg-card/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Print this page or save as PDF"
              >
                <Printer className="size-4 text-primary" aria-hidden />
                <span className="mt-2 block text-[13px] font-medium">Print portfolio (PDF)</span>
                <span className="mt-0.5 block font-mono text-[10.5px] text-muted-foreground">
                  the page as shown
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
