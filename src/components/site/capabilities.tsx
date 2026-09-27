import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "./section";
import { SkillFilter } from "./skill-filter";
import { technicalFocus } from "@/content/site";

/**
 * Capabilities: grouped, evidence-framed — no fake proficiency bars.
 * An optional keyword filter lets reviewers quickly answer "do they know X?".
 */
export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="Capabilities"
      title="What I can actually build"
      description="Technologies matter less than the systems they enable. Grouped by the layers they've been used in across the projects documented on this site."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <SkillFilter />

        <Stagger className="lg:sticky lg:top-24 lg:self-start" step={0.08}>
          <div className="rounded-xl border border-border/70 bg-card p-5 sm:p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Selected technical focus
            </h3>
            <div className="mt-5 space-y-5">
              {technicalFocus.map((f) => (
                <StaggerItem key={f.domain}>
                  <div className="border-l-2 border-primary/50 pl-4">
                    <p className="text-sm font-medium">{f.domain}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {f.items}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </Stagger>
      </div>
    </Section>
  );
}
