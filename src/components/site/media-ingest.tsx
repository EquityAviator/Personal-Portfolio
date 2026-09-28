"use client";

/**
 * Media ingest dropzone — the owner's private upload door, reachable on ANY
 * route via the `#media-ingest` hash (same deep-link pattern as case studies).
 *
 * Why this exists: the chat gateway stripped the "All Project Images" DOCX on
 * every upload attempt, so the file never reached the sandbox filesystem.
 * This dialog lets the owner drag the DOCX (or loose images) straight into
 * the running preview in the browser — no curl, no mounts, no gateway.
 *
 * It POSTs multipart files to /api/media/ingest (saved into upload/ + ingest
 * runs server-side: DOCX unpack → manifest match → WebP → public/media) and
 * renders the resulting report per project. Closed by default it renders
 * nothing at all, so the public portfolio stays clean.
 */

import * as React from "react";
import {
  BadgeCheck,
  ClipboardCopy,
  FileUp,
  ImageUp,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CASE_MEDIA } from "@/content/case-media";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

const HASH = "#media-ingest";
const INGEST_URL = "/api/media/ingest";
const ACCEPT = ".docx,.png,.jpg,.jpeg,.webp,.gif";
const MAX_FILE_MB = 48;

type Status = {
  manifestEntries: number;
  availableMedia: string[];
  uploadFiles: Array<{ path: string; bytes: number }>;
};

type PostReport = {
  ok: boolean;
  saved: string[];
  rejected: Array<{ name: string; reason: string }>;
  run: { exitCode: number; durationMs: number };
  report: {
    manifestEntries: number;
    candidates: number;
    converted: number;
    missing: string[];
    leftover: string[];
    availableIds: string[];
  };
  log: string;
  error?: string;
};

/** id prefix → project name, from the single manifest source of truth. */
const projectOf = (id: string) =>
  CASE_MEDIA.find((m) => m.id === id)?.project ?? null;

export function MediaIngestDialog() {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status | null>(null);
  const [report, setReport] = React.useState<PostReport | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const fetchStatus = React.useCallback(async () => {
    try {
      const res = await fetch(INGEST_URL, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          manifestEntries: data.manifestEntries ?? 0,
          availableMedia: data.availableMedia ?? [],
          uploadFiles: data.upload?.files ?? [],
        });
      }
    } catch {
      /* status panel stays silent — upload path reports its own errors */
    }
  }, []);

  // Deep-link open/close: #media-ingest on any route (mount + hashchange),
  // mirroring the #case-<slug> overlay pattern.
  React.useEffect(() => {
    const onHash = () => {
      const isOpen = window.location.hash === HASH;
      setOpen(isOpen);
      if (isOpen) void fetchStatus();
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [fetchStatus]);

  const close = React.useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setOpen(false);
  }, []);

  const upload = React.useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const oversize = files.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
      if (oversize.length === files.length) {
        toast({ title: `All files exceed the ${MAX_FILE_MB} MB per-file limit`, variant: "destructive" });
        return;
      }
      const form = new FormData();
      let attached = 0;
      for (const f of files) {
        if (f.size <= MAX_FILE_MB * 1024 * 1024) {
          form.append("file", f);
          attached += 1;
        }
      }
      if (attached === 0) return;

      setBusy(true);
      setProgress(0);
      setReport(null);

      // XHR (not fetch) for upload progress — the DOCX can be tens of MB.
      const xhr = new XMLHttpRequest();
      xhr.open("POST", INGEST_URL);
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener("load", () => {
        setBusy(false);
        setProgress(100);
        try {
          const data = JSON.parse(xhr.responseText) as PostReport;
          if (xhr.status >= 200 && xhr.status < 300) {
            setReport(data);
            const n = data.report?.converted ?? 0;
            if (data.ok) {
              toast({
                title:
                  n > 0
                    ? `Ingest complete — ${n} screenshot${n === 1 ? "" : "s"} matched and converted`
                    : "Files saved, but nothing matched the manifest — see the report",
              });
            } else {
              toast({ title: "Ingest script failed — check the log below", variant: "destructive" });
            }
            void fetchStatus();
          } else {
            toast({ title: data.error ?? `Upload failed (${xhr.status})`, variant: "destructive" });
          }
        } catch {
          toast({ title: `Unexpected response (${xhr.status})`, variant: "destructive" });
        }
      });
      xhr.addEventListener("error", () => {
        setBusy(false);
        toast({ title: "Network error during upload", variant: "destructive" });
      });
      xhr.addEventListener("timeout", () => {
        setBusy(false);
        toast({ title: "Upload timed out (150 s server limit)", variant: "destructive" });
      });
      xhr.send(form);
    },
    [fetchStatus, toast]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!busy) upload(Array.from(e.dataTransfer.files ?? []));
  };

  const origin =
    typeof window === "undefined" ? "" : window.location.origin;
  const curl = `curl -F "file=@All-Project-Images.docx" "${origin}${INGEST_URL}"`;

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast({ title: "Clipboard unavailable — select the command manually", variant: "destructive" });
    }
  };

  // Per-project coverage: available ids mapped through the manifest.
  const perProject = projects.map((p) => {
    const total = CASE_MEDIA.filter((m) => m.project === p.slug).length;
    const have = status
      ? status.availableMedia.filter((id) => projectOf(id) === p.slug).length
      : 0;
    return { name: p.name, slug: p.slug, accent: p.accent, total, have };
  });

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      {open ? (
        <DialogContent
          className="max-h-[88dvh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.16em]">
              <ImageUp className="size-4 text-primary" aria-hidden />
              Media ingest
            </DialogTitle>
            <DialogDescription className="text-left text-[13px] leading-relaxed">
              Drop the <span className="font-medium text-foreground">All Project Images</span> DOCX
              (or loose PNG/JPG/WebP screenshots) here. Files are matched against the 30-entry
              screenshot manifest, converted to WebP and mounted into their documented case-study
              sections automatically.
            </DialogDescription>
          </DialogHeader>

          {/* Dropzone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload project screenshots"
            onClick={() => !busy && inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!busy) inputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              dragOver
                ? "border-primary bg-primary/10"
                : "border-border/70 bg-secondary/30 hover:border-primary/60 hover:bg-primary/5",
              busy && "pointer-events-none opacity-70"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="sr-only"
              onChange={(e) => {
                upload(Array.from(e.target.files ?? []));
                e.currentTarget.value = "";
              }}
            />
            {busy ? (
              <>
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
                <p className="text-[13px] font-medium">
                  Uploading &amp; ingesting… {progress}%
                </p>
                <Progress value={progress} className="mt-1 h-1.5 w-3/4" aria-hidden />
                <p className="font-mono text-[10.5px] text-muted-foreground">
                  DOCX unpack → manifest match → WebP conversion
                </p>
              </>
            ) : (
              <>
                <FileUp
                  className="size-6 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden
                />
                <p className="text-[13px] font-medium">
                  Drag &amp; drop, or <span className="text-primary underline underline-offset-4">browse</span>
                </p>
                <p className="font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                  DOCX / PNG / JPG / WebP / GIF · up to {MAX_FILE_MB} MB per file
                </p>
              </>
            )}
          </div>

          {/* Per-project coverage */}
          {status && (
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Screenshot coverage — {status.availableMedia.length}/{status.manifestEntries} ingested
              </p>
              <ul className="mt-3 grid gap-2.5">
                {perProject.map((p) => (
                  <li key={p.slug} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12.5px] font-medium">{p.name}</span>
                      <span className="font-mono text-[10.5px] text-muted-foreground">
                        {p.have}/{p.total}
                      </span>
                    </div>
                    <div
                      className="col-span-2 h-1 overflow-hidden rounded-full bg-border/60"
                      role="progressbar"
                      aria-valuenow={p.have}
                      aria-valuemin={0}
                      aria-valuemax={p.total}
                      aria-label={`${p.name}: ${p.have} of ${p.total} screenshots ingested`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${p.total === 0 ? 0 : Math.round((p.have / p.total) * 100)}%`,
                          background: p.accent,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {status.uploadFiles.length > 0 && (
                <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  upload/: {status.uploadFiles.map((f) => f.path).join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Ingest report */}
          {report && (
            <div
              className={cn(
                "rounded-xl border p-4",
                report.ok ? "border-border/60 bg-secondary/30" : "border-destructive/40 bg-destructive/5"
              )}
              aria-live="polite"
            >
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {report.ok ? (
                  <BadgeCheck className="size-3.5 text-primary" aria-hidden />
                ) : (
                  <TriangleAlert className="size-3.5 text-destructive" aria-hidden />
                )}
                Ingest report — {report.report.converted} converted ·{" "}
                {report.report.availableIds.length}/{report.report.manifestEntries} total live
                <span className="ml-auto normal-case tracking-normal">
                  {(report.run.durationMs / 1000).toFixed(1)}s
                </span>
              </p>

              {report.saved.length > 0 && (
                <p className="mt-2.5 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                  saved: {report.saved.join(", ")}
                </p>
              )}
              {report.rejected.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {report.rejected.map((r) => (
                    <li key={r.name} className="font-mono text-[10.5px] text-destructive">
                      rejected {r.name} — {r.reason}
                    </li>
                  ))}
                </ul>
              )}
              {report.report.converted === 0 && report.report.leftover.length > 0 && (
                <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
                  no manifest match — filename hints per entry live in
                  src/content/case-media.ts (each entry lists expected name tokens or DOCX position)
                </p>
              )}
              {report.report.missing.length > 0 && (
                <details className="mt-2.5">
                  <summary className="cursor-pointer font-mono text-[10.5px] text-muted-foreground hover:text-foreground">
                    still missing ({report.report.missing.length}) — open
                  </summary>
                  <ul className="mt-1.5 max-h-32 space-y-0.5 overflow-y-auto pr-1">
                    {report.report.missing.map((m) => (
                      <li key={m} className="font-mono text-[10px] text-muted-foreground">
                        {m}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {report.ok && (
                <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground">
                  Case-study galleries update on the next page load — open any{" "}
                  <span className="font-medium text-foreground">#case-&lt;project&gt;</span> view to
                  see the screenshots in their documented sections.
                </p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer font-mono text-[10.5px] text-muted-foreground hover:text-foreground">
                  raw log
                </summary>
                <pre className="mt-1.5 max-h-40 overflow-auto rounded-lg bg-background/70 p-2.5 font-mono text-[9.5px] leading-relaxed text-muted-foreground">
                  {report.log}
                </pre>
              </details>
            </div>
          )}

          {/* curl fallback */}
          <div className="rounded-xl border border-border/60 p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Prefer the terminal?
            </p>
            <div className="mt-2 flex items-start gap-2">
              <code className="min-w-0 flex-1 break-all rounded-lg bg-secondary/50 px-2.5 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                {curl}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1.5 px-2.5 font-mono text-[10.5px]"
                onClick={copyCurl}
                aria-label="Copy curl command"
              >
                {copied ? (
                  <BadgeCheck className="size-3.5" aria-hidden />
                ) : (
                  <ClipboardCopy className="size-3.5" aria-hidden />
                )}
                {copied ? "copied" : "copy"}
              </Button>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

/** Tiny footer affordance that opens the ingest door (hash-driven, so it
 *  works from every route and survives back/forward). Kept typographically
 *  quiet — a utility link, not a showcase element. */
export function MediaIngestLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.location.assign(HASH)}
      className={cn(
        "link-underline inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      aria-label="Open media ingest panel (owner utility)"
    >
      Media
    </button>
  );
}
