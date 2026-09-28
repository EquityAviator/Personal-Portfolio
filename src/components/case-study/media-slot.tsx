"use client";

import * as React from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { MediaAsset } from "@/content/types";
import { cn } from "@/lib/utils";
import { MediaLightbox, type LightboxItem } from "./lightbox";

/**
 * Media slot (V2 media architecture — screenshots deferred).
 *
 * Renders a real asset when `asset` is supplied (lazy-loaded, captioned,
 * aspect-ratio aware). With no asset it renders a typographic "case mark":
 * accent-tinted cover art that reads as designed — clearly decorative,
 * never a fake screenshot. Wiring a real hero later is a content change
 * (`media.hero`), not a component change.
 */
export function MediaSlot({
  asset,
  label,
  aspect = "16/9",
  className,
  priority = false,
  fit = "cover",
  accent,
  index,
  zoomItems,
  zoomIndex = 0,
}: {
  asset?: MediaAsset;
  /** Used for the case-mark title, e.g. the project name */
  label: string;
  /** Fallback aspect ratio when the asset doesn't declare one */
  aspect?: string;
  className?: string;
  priority?: boolean;
  /** Screenshots should use "contain" so no UI gets cropped. */
  fit?: "cover" | "contain";
  /** Project accent — tints the case-mark gradient. */
  accent?: string;
  /** Project index (01–04) shown on the case mark. */
  index?: string;
  /** When provided (screenshot galleries), the rendered image becomes a
   *  button that opens the fullscreen lightbox with arrow-key browsing. */
  zoomItems?: LightboxItem[];
  /** Position of this asset within zoomItems. */
  zoomIndex?: number;
}) {
  const [zoomOpen, setZoomOpen] = React.useState(false);
  // Current position within the shared gallery — re-initialised from this
  // slot's position each time the lightbox opens.
  const [zoomIdx, setZoomIdx] = React.useState(zoomIndex);

  if (asset?.src) {
    const image = (
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
        className={cn(fit === "contain" && "bg-secondary/40 object-contain p-2")}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    );
    return (
      <figure className={cn("group/media overflow-hidden rounded-xl border border-border/60 bg-card", className)}>
        <div className="relative w-full" style={{ aspectRatio: asset.aspectRatio ?? aspect }}>
          {zoomItems ? (
            <button
              type="button"
              onClick={() => {
                setZoomIdx(zoomIndex);
                setZoomOpen(true);
              }}
              aria-label={`View fullscreen: ${asset.alt}`}
              className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              {image}
              <span
                aria-hidden
                className="absolute bottom-2.5 right-2.5 flex size-7 items-center justify-center rounded-full border border-border/60 bg-background/85 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover/media:opacity-100 focus-visible:opacity-100"
              >
                <ZoomIn className="size-3.5" />
              </span>
            </button>
          ) : (
            image
          )}
        </div>
        {asset.caption && (
          <figcaption className="border-t border-border/50 px-3.5 py-2 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
            {asset.caption}
            {asset.credit && <span className="text-muted-foreground/70"> · {asset.credit}</span>}
          </figcaption>
        )}
        {zoomItems && (
          <MediaLightbox
            open={zoomOpen}
            onOpenChange={setZoomOpen}
            items={zoomItems}
            index={zoomIdx}
            onIndexChange={setZoomIdx}
          />
        )}
      </figure>
    );
  }

  // No asset yet — typographic case mark (decorative, honest).
  const tone = accent ?? "oklch(0.7 0.12 200)";
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60",
        className
      )}
      style={{ aspectRatio: asset?.aspectRatio ?? aspect }}
      role="img"
      aria-label={`${label} — case mark`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 95% at 12% 8%, color-mix(in oklch, ${tone} 30%, transparent), transparent 62%),
            radial-gradient(110% 85% at 92% 96%, color-mix(in oklch, ${tone} 16%, transparent), transparent 58%),
            var(--card)
          `,
        }}
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {index ? `${index} · ` : ""}case study
        </p>
        <div>
          <p
            className="text-balance text-xl font-semibold tracking-tight sm:text-2xl"
            style={{ color: `color-mix(in oklch, ${tone} 72%, var(--foreground))` }}
          >
            {label}
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
            visual documentation in preparation
          </p>
        </div>
      </div>
    </figure>
  );
}
