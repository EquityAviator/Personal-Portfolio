"use client";

import * as React from "react";

/**
 * Very thin reading-progress line pinned under the header.
 * Helpful on a long editorial page; respects reduced motion (no animation).
 */
export function ScrollProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
      data-slot="scroll-progress"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary/60 via-primary to-primary/80"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
}
