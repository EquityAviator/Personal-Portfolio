"use client";

import * as React from "react";
import { Check, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Hover/focus-revealed permalink for a main page section.
 * Copies a shareable deep link (`…/#<id>`) — the same anchor the nav and
 * footer already target — so any section can be linked directly.
 * Rendered inline after the section heading; reserves its own slot so the
 * heading layout stays stable.
 */
export function SectionAnchor({ id, title }: { id: string; title: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Section link copied", description: `#${id}` });
      setTimeout(() => setCopied(false), 2400);
    } catch {
      toast({ title: "Couldn't access clipboard", description: url });
    }
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      aria-label={`Copy link to the ${title} section`}
      className={`ml-1 inline-flex size-7 items-center justify-center rounded-md align-middle text-muted-foreground/50 transition-all hover:bg-secondary hover:text-foreground focus-visible:opacity-100 print:hidden ${
        copied ? "text-emerald-600 opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Hash className="size-3.5" aria-hidden />
      )}
    </button>
  );
}
