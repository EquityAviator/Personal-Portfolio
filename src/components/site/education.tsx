import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "./section";
import { education } from "@/content/site";

/**
 * Education — a single chronological rail (most recent first, as in the
 * content data) with node dots per entry. Cards keep the shared card look;
 * the rail gives the "timeline" reading a CV would have.
 */
export function Education() {
  return (
    <Section
      id="education"
      eyebrow="Education"
      title="Academic foundation"
      description="Software engineering fundamentals — architecture, algorithms, databases and the AI/ML specialization that the project work is built on."
    >
      <div className="relative">
        {/* Timeline rail */}
        <div
          className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-border via-border/60 to-transparent print:hidden"
          aria-hidden
        />
        <div className="space-y-4">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.06}>
              <div className="relative">
                {/* Node dot */}
                <span
                  className="absolute left-0 top-7 z-10 grid size-[15px] -translate-x-0 place-items-center rounded-full border-2 border-primary bg-background"
                  aria-hidden
                >
                  <span className="size-[5px] rounded-full bg-primary" />
                </span>
                <article className="print-avoid-break ml-6 rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="flex items-start gap-3">
                      <GraduationCap
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <div>
                        <h3 className="text-[15px] font-medium">{e.degree}</h3>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {e.school}
                          {e.campus ? ` — ${e.campus}` : ""}
                        </p>
                      </div>
                    </div>
                    <time className="shrink-0 rounded-md bg-secondary px-2 py-0.5 font-mono text-[10.5px] tabular-nums text-muted-foreground">
                      {e.period}
                    </time>
                  </div>
                  <p className="mt-4 font-mono text-[12px] text-foreground/85">{e.detail}</p>
                  {e.focus.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Relevant areas">
                      {e.focus.map((f) => (
                        <li
                          key={f}
                          className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
