"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * Screenshot lightbox — a native <dialog> shown via showModal(), so it lives
 * in the browser's top layer: above the Radix case-study dialog, with
 * browser-managed focus containment and Esc-to-close for free. Arrow keys
 * walk the gallery when more than one screenshot is open.
 */

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

export function MediaLightbox({
  open,
  onOpenChange,
  items,
  index,
  onIndexChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const item = items[index];

  // showModal()/close() are imperative — sync them with React state.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      closeRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Arrow-key gallery navigation while open (native Esc needs no handler —
  // the browser fires 'cancel', handled below).
  React.useEffect(() => {
    if (!open || items.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndexChange((index + 1) % items.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndexChange((index - 1 + items.length) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length, index, onIndexChange]);

  if (items.length === 0 || !item) return null;

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === ref.current) onOpenChange(false);
      }}
      className="fixed inset-0 z-[70] m-auto flex h-[92dvh] max-h-[92dvh] w-[min(96vw,1200px)] flex-col items-center justify-center rounded-xl border border-border/60 bg-background/95 p-3 shadow-2xl backdrop:bg-foreground/60 backdrop:backdrop-blur-sm sm:p-4"
      aria-label={item.alt}
    >
      <div className="flex w-full items-center justify-between gap-3 pb-2.5">
        <p className="min-w-0 truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          screenshot {index + 1} / {items.length}
        </p>
        <div className="flex items-center gap-2">
          {items.length > 1 && (
            <span className="hidden font-mono text-[10px] text-muted-foreground/80 sm:inline">
              ← → to browse · Esc to close
            </span>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close screenshot viewer"
            className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="relative flex min-h-[220px] w-full flex-1 items-center justify-center overflow-hidden rounded-lg bg-secondary/40">
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 96vw, 1200px"
          className="object-contain"
          priority
        />
      </div>
      {item.caption && (
        <p className="max-h-24 w-full overflow-y-auto pt-2.5 text-center font-mono text-[10.5px] leading-relaxed text-muted-foreground">
          {item.caption}
        </p>
      )}
    </dialog>
  );
}
