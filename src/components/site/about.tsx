import { Reveal } from "@/components/motion/reveal";
import { Section } from "./section";
import { about, education, profile } from "@/content/site";
import { projects } from "@/content/projects";
import { totalReadingMinutes } from "@/lib/reading";

/**
 * "At a glance" evidence strip — every number is derived from the typed
 * content files (education periods/detail, case-study count, computed
 * reading time from the documented case-study words). Nothing invented.
 */
const glance = [
  {
    value: education[0].period.split("—")[1]?.trim() ?? education[0].period,
    label: "graduation · BSE",
  },
  {
    value: education[0].detail.replace(/^CGPA\s*/i, ""),
    label: "CGPA (of 4.00)",
  },
  {
    value: String(projects.length),
    label: "documented case studies",
  },
  {
    value: `~${totalReadingMinutes([...projects])} min`,
    label: "total case-study reading",
  },
] as const;

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Engineer first, AI specialist by practice"
    >
      {/* At-a-glance evidence strip */}
      <Reveal>
        <dl className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Key facts at a glance">
          {glance.map((g) => (
            <div
              key={g.label}
              className="rounded-xl border border-border/70 bg-card px-4 py-3.5"
            >
              <dd className="font-mono text-[15px] font-medium tabular-nums text-foreground">
                {g.value}
              </dd>
              <dt className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                {g.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="max-w-3xl space-y-4">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-pretty text-[15px] leading-relaxed text-foreground/85">
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.15}>
            <p className="mt-6 border-l-2 border-primary/50 pl-4 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
              {about.currently}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="rounded-xl border border-border/70 bg-card p-5 sm:p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Interests
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {about.interests.map((i) => (
                <li
                  key={i}
                  className="rounded-md border border-border/70 px-2.5 py-1 text-[12.5px] text-foreground/75 transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {i}
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-border/60 pt-5 font-mono text-[12px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Graduation</dt>
                <dd>2026</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">GitHub</dt>
                <dd className="truncate">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    EquityAviator
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
