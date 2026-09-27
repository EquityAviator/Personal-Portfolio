import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "./section";
import { howIBuild } from "@/content/site";

export function HowIBuild() {
  return (
    <Section
      id="process"
      eyebrow="How I build"
      title="An engineering workflow, not a stack of tools"
      description="Every project below followed the same loop — define the real problem, design the boundaries, build against typed contracts, validate under one protocol, ship operationally, and improve with evidence."
    >
      <Stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
        {howIBuild.map((item) => (
          <StaggerItem key={item.step} className="group bg-card p-5 transition-colors hover:bg-secondary/60 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-primary" aria-hidden>
                {item.step}
              </span>
              <span className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/40" aria-hidden />
            </div>
            <h3 className="mt-4 text-[15px] font-medium">{item.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
