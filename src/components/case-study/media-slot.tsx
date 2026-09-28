import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { MediaAsset } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Media-ready slot (V2 media architecture — screenshots deferred).
 *
 * Renders a real asset when `asset` is supplied (lazy-loaded, captioned,
 * aspect-ratio aware). When no asset exists yet — the current state for all
 * four projects — it renders a neutral technical placeholder so the layout
 * system is already proven: adding real screenshots later changes the
 * content file (`media.hero` …), never the components.
 */
export function MediaSlot({
  asset,
  label,
  aspect = "16/9",
  className,
  priority = false,
  fit = "cover",
}: {
  asset?: MediaAsset;
  /** Used for the placeholder label, e.g. the project name */
  label: string;
  /** Fallback aspect ratio when the asset doesn't declare one */
  aspect?: string;
  className?: string;
  priority?: boolean;
  /** Screenshots should use "contain" so no UI gets cropped. */
  fit?: "cover" | "contain";
}) {
  if (asset?.src) {
    return (
      <figure className={cn("overflow-hidden rounded-xl border border-border/60 bg-card", className)}>
        <div className="relative w-full" style={{ aspectRatio: asset.aspectRatio ?? aspect }}>
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
            className={cn(fit === "contain" && "bg-secondary/40 object-contain p-2")}
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>
        {asset.caption && (
          <figcaption className="border-t border-border/50 px-3.5 py-2 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
            {asset.caption}
            {asset.credit && <span className="text-muted-foreground/70"> · {asset.credit}</span>}
          </figcaption>
        )}
      </figure>
    );
  }

  // Neutral placeholder — a deliberate "media slot", not a fake screenshot.
  return (
    <figure
      className={cn(
        "media-slot relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-secondary/30",
        className
      )}
      style={{ aspectRatio: asset?.aspectRatio ?? aspect }}
      role="img"
      aria-label={`${label} — media slot reserved for a project screenshot`}
    >
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <ImageOff className="size-4 text-muted-foreground/70" aria-hidden />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
          media slot
        </p>
        <p className="max-w-[26ch] text-balance font-mono text-[10px] leading-relaxed text-muted-foreground/60">
          {label} — screenshot reserved, layout ready
        </p>
      </div>
    </figure>
  );
}
