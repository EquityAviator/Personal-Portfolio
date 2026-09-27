import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { proofStrip } from "@/content/site";

export function ProofStrip() {
  return (
    <section aria-label="Credibility" className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Stagger className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
          {proofStrip.map((item) => (
            <StaggerItem key={item.index} className="flex gap-4 py-6 pr-6 sm:py-8 lg:pr-8">
              <span className="font-mono text-[11px] text-primary" aria-hidden>
                {item.index}
              </span>
              <div>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
