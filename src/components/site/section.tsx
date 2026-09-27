import { Reveal } from "@/components/motion/reveal";
import { SectionAnchor } from "@/components/site/section-anchor";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Wider container for grids */
  wide?: boolean;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-20 py-16 sm:py-24", className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-6 bg-primary/60" aria-hidden />
              {eyebrow}
            </p>
            <h2
              id={id ? `${id}-heading` : undefined}
              className="group mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {title}
              {id ? <SectionAnchor id={id} title={title} /> : null}
            </h2>
            {description ? (
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
