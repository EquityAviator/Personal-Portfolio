import { NextRequest, NextResponse } from "next/server";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";

/**
 * Media ingest bridge — makes the owner's screenshot pipeline reachable over
 * HTTP, so the DOCX/images can be delivered even when the sandbox upload
 * mount fails to sync (which has happened twice).
 *
 *   GET  /api/media/ingest          → status report (no side effects)
 *   POST /api/media/ingest          → run ingest on whatever is in upload/
 *   POST /api/media/ingest          → multipart form-data: file=<docx|png|jpg|webp|gif>
 *                                     (repeatable) → save into upload/ + run ingest
 *
 * Owner one-liner (from any machine with the file):
 *
 *   curl -F "file=@All-Project-Images.docx" \
 *     "https://<preview-host>/api/media/ingest"
 *
 * Optional shared secret: set MEDIA_INGEST_TOKEN in the environment and send
 * it as the `x-ingest-token` header (or `?token=`). Unset ⇒ open (sandbox).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOT = existsSync("/home/z/my-project") ? "/home/z/my-project" : process.cwd();
const UPLOAD = path.join(ROOT, "upload");
const PUBLIC_MEDIA = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "content", "case-media.ts");
const GENERATED = path.join(ROOT, "src", "content", "case-media.generated.ts");

const ALLOWED_EXT = /\.(docx|png|jpe?g|webp|gif)$/i;
const MAX_FILE_BYTES = 48 * 1024 * 1024; // 48 MB per file
const MAX_FILES_PER_POST = 12;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function walk(dir: string, out: Array<{ path: string; bytes: number }> = []) {
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    const p = path.join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, out);
    else out.push({ path: path.relative(ROOT, p), bytes: st.size });
  }
  return out;
}

function countManifestEntries(): number {
  try {
    const src = readFileSync(MANIFEST, "utf8");
    return (src.match(/^\s{4}id:\s*"/gm) ?? []).length;
  } catch {
    return 0;
  }
}

function readAvailableIds(): string[] {
  try {
    const src = readFileSync(GENERATED, "utf8");
    return JSON.parse(src.slice(src.indexOf("["))) as string[];
  } catch {
    return [];
  }
}

function listPublicMedia(): Array<{ path: string; bytes: number }> {
  return existsSync(PUBLIC_MEDIA) ? walk(PUBLIC_MEDIA) : [];
}

function sanitizeName(original: string): string {
  const base = path.basename(original).slice(0, 120);
  const cleaned = base.replace(/[^a-zA-Z0-9._ -]+/g, "-").replace(/\s+/g, "-");
  return cleaned || `upload-${Date.now()}`;
}

function runIngest(): Promise<{ code: number; log: string; ms: number }> {
  return new Promise((resolve) => {
    const started = Date.now();
    execFile(
      "bun",
      ["scripts/ingest-media.ts"],
      { cwd: ROOT, timeout: 150_000, maxBuffer: 16 * 1024 * 1024 },
      (err, stdout, stderr) => {
        const code =
          err && typeof (err as { code?: number }).code === "number"
            ? (err as { code: number }).code
            : err
              ? 1
              : 0;
        resolve({
          code,
          log: `${stdout ?? ""}${stderr ? `\n[stderr]\n${stderr}` : ""}`.slice(-12_000),
          ms: Date.now() - started,
        });
      },
    );
  });
}

function parseReport(log: string) {
  const grab = (re: RegExp) => Number(log.match(re)?.[1] ?? 0);
  const section = (header: string) => {
    const idx = log.indexOf(header);
    if (idx === -1) return [] as string[];
    const rest = log.slice(idx + header.length);
    const end = rest.indexOf("\n\n");
    return (end === -1 ? rest : rest.slice(0, end))
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "));
  };
  return {
    manifestEntries: grab(/Manifest entries\s*:\s*(\d+)/),
    candidates: grab(/Candidates\s*:\s*(\d+)/),
    converted: grab(/Converted\s*:\s*(\d+)/),
    missing: section("Missing (no candidate matched):"),
    leftover: section("Leftover candidates (unmatched):"),
  };
}

/* ---- naive in-memory rate limit: 10 ingest POSTs / minute / ip ---- */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const window = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  window.push(now);
  hits.set(ip, window);
  return window.length > 10;
}

function authorized(req: NextRequest): boolean {
  const token = process.env.MEDIA_INGEST_TOKEN;
  if (!token) return true;
  const given =
    req.headers.get("x-ingest-token") ?? req.nextUrl.searchParams.get("token") ?? "";
  return given === token;
}

/* ------------------------------------------------------------------ */
/* GET — status                                                        */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "invalid ingest token" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    upload: {
      exists: existsSync(UPLOAD),
      files: existsSync(UPLOAD) ? walk(UPLOAD) : [],
    },
    manifestEntries: countManifestEntries(),
    availableMedia: readAvailableIds(),
    mediaFiles: listPublicMedia(),
    hint: 'POST multipart "file" (docx/png/jpg/webp) to save + ingest, or POST empty JSON {} to ingest existing upload/ contents.',
  });
}

/* ------------------------------------------------------------------ */
/* POST — save + ingest                                                */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "invalid ingest token" }, { status: 401 });
  }
  if (rateLimited(req.headers.get("x-forwarded-for") ?? "local")) {
    return NextResponse.json({ error: "rate limited — try again in a minute" }, { status: 429 });
  }

  const saved: string[] = [];
  const rejected: Array<{ name: string; reason: string }> = [];
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ error: "malformed multipart body" }, { status: 400 });
    }
    mkdirSync(UPLOAD, { recursive: true });
    const files = [...form.getAll("file"), ...form.getAll("files")].filter(
      (f): f is File => f instanceof File,
    );
    if (files.length === 0) {
      return NextResponse.json({ error: "no file fields found (use name=file)" }, { status: 400 });
    }
    if (files.length > MAX_FILES_PER_POST) {
      return NextResponse.json(
        { error: `too many files (max ${MAX_FILES_PER_POST} per request)` },
        { status: 413 },
      );
    }
    for (const f of files) {
      const safe = sanitizeName(f.name || "upload.bin");
      if (!ALLOWED_EXT.test(safe)) {
        rejected.push({ name: safe, reason: "extension not allowed (docx/png/jpg/jpeg/webp/gif)" });
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        rejected.push({ name: safe, reason: `too large (${(f.size / 1e6).toFixed(1)} MB > 48 MB)` });
        continue;
      }
      let target = path.join(UPLOAD, safe);
      if (existsSync(target)) {
        const ext = path.extname(safe);
        target = path.join(UPLOAD, `${path.basename(safe, ext)}-${Date.now().toString(36)}${ext}`);
      }
      try {
        writeFileSync(target, Buffer.from(await f.arrayBuffer()));
        saved.push(path.relative(ROOT, target));
      } catch (e) {
        rejected.push({ name: safe, reason: `write failed: ${String(e).slice(0, 120)}` });
      }
    }
  } else if (contentType.includes("application/json")) {
    // empty JSON {} → just run ingest on existing upload/ contents
  } else if (contentType !== "") {
    return NextResponse.json(
      { error: "send multipart/form-data with file fields, or application/json {}" },
      { status: 415 },
    );
  }

  const run = await runIngest();
  const report = parseReport(run.log);

  return NextResponse.json({
    ok: run.code === 0,
    saved,
    rejected,
    run: { exitCode: run.code, durationMs: run.ms },
    report: {
      ...report,
      availableIds: readAvailableIds(),
      mediaFiles: listPublicMedia(),
    },
    log: run.log,
  });
}
