#!/usr/bin/env bun
/**
 * Media ingest — turn owner-provided screenshots into portfolio-ready assets.
 *
 *   bun scripts/ingest-media.mjs
 *
 * What it does:
 *  1. Collects candidate images from /home/z/my-project/upload (recursive),
 *     including images embedded inside any .docx found there (extracted via
 *     `unzip` into upload/extracted/<docx-stem>/, naturally ordered and
 *     prefixed docx-<n>- so manifest `docxIndex` can address them).
 *  2. Matches candidates to src/content/case-media.ts entries — first by
 *     docxIndex (for docx-prefixed files), then by substring tokens against
 *     the filename.
 *  3. Converts each match to WebP (max 1440px wide, q82) at
 *     public/media/<project>/<id>.webp.
 *  4. Regenerates src/content/case-media.generated.ts with the list of
 *     available ids — CaseMedia renders exactly those.
 *  5. Prints a full report (matched / missing / leftover candidates).
 *
 * Safe to re-run any time; only matched entries are rewritten.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";

const ROOT = "/home/z/my-project";
const UPLOAD = path.join(ROOT, "upload");
const EXTRACTED = path.join(UPLOAD, "extracted");
const PUBLIC_MEDIA = path.join(ROOT, "public", "media");
const GENERATED = path.join(ROOT, "src", "content", "case-media.generated.ts");

// ---- Load the manifest (regex parse of the flat literal array)
const manifestSrc = readFileSync(path.join(ROOT, "src/content/case-media.ts"), "utf8");

interface Entry {
  id: string;
  project: string;
  match: string[];
  docxIndex?: number;
}
const entries: Entry[] = [];
const entryRe =
  /id:\s*"([^"]+)"[\s\S]*?project:\s*"([^"]+)"[\s\S]*?match:\s*\[([^\]]*)\][\s\S]*?(?:docxIndex:\s*(\d+)[\s\S]*?)?aspectRatio:/g;
let m: RegExpExecArray | null;
while ((m = entryRe.exec(manifestSrc))) {
  const match = (m[3].match(/"([^"]+)"/g) ?? []).map((s) => s.slice(1, -1).toLowerCase());
  entries.push({
    id: m[1],
    project: m[2],
    match,
    docxIndex: m[4] ? Number(m[4]) : undefined,
  });
}
if (entries.length === 0) {
  console.error("No manifest entries parsed — aborting.");
  process.exit(1);
}

// ---- Helpers
const walkAll = (dir: string, out: string[]) => {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    const p = path.join(dir, name);
    let stat;
    try {
      stat = statSync(p);
    } catch {
      continue;
    }
    if (stat.isDirectory()) walkAll(p, out);
    else out.push(p);
  }
  return out;
};

// ---- 1. Collect candidates + extract DOCX media
const allFiles: string[] = existsSync(UPLOAD) ? walkAll(UPLOAD, []) ?? [] : [];
const docxFiles = allFiles.filter((p) => /\.docx$/i.test(p));
for (const docx of docxFiles) {
  const stem =
    path.basename(docx).replace(/\.docx$/i, "").replace(/[^a-z0-9_-]+/gi, "-").slice(0, 40) || "docx";
  const outDir = path.join(EXTRACTED, stem);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  try {
    execSync(`unzip -o -j "${docx}" "word/media/*" -d "${outDir}" >/dev/null 2>&1`);
    const media = readdirSync(outDir)
      .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
      .sort((a, b) => {
        const na = Number((a.match(/(\d+)/) ?? [])[1] ?? 0);
        const nb = Number((b.match(/(\d+)/) ?? [])[1] ?? 0);
        return na - nb;
      });
    media.forEach((f, i) => {
      const src = path.join(outDir, f);
      const dst = path.join(outDir, `docx-${i + 1}-${f}`);
      if (dst !== src) renameSync(src, dst);
    });
    console.log(`Extracted ${media.length} media files from ${path.basename(docx)} → ${path.relative(ROOT, outDir)}`);
  } catch (e) {
    console.warn(`Failed to extract ${path.basename(docx)}: ${e}`);
  }
}

const candidates: string[] = existsSync(UPLOAD) ? (walkAll(UPLOAD, []) ?? []).filter((p) => /\.(png|jpe?g|webp)$/i.test(p)) : [];

// ---- 2. Match entries → candidate files
const used = new Set<string>();
const assignment = new Map<string, string>(); // entry.id → candidate path
const byDocxIndex = new Map<number, string>();
for (const c of candidates) {
  const base = path.basename(c).toLowerCase();
  const dm = base.match(/^docx-(\d+)-/);
  if (dm && !byDocxIndex.has(Number(dm[1]))) byDocxIndex.set(Number(dm[1]), c);
}

for (const e of entries) {
  let hit: string | undefined;
  if (e.docxIndex && byDocxIndex.has(e.docxIndex)) hit = byDocxIndex.get(e.docxIndex);
  if (!hit) {
    hit = candidates.find((c) => {
      if (used.has(c)) return false;
      const base = path.basename(c).toLowerCase();
      return e.match.some((t) => base.includes(t));
    });
  }
  if (hit && !used.has(hit)) {
    used.add(hit);
    assignment.set(e.id, hit);
  }
}

// ---- 3. Convert matched
mkdirSync(PUBLIC_MEDIA, { recursive: true });
const available: string[] = [];
for (const e of entries) {
  const src = assignment.get(e.id);
  if (!src) continue;
  const outDir = path.join(PUBLIC_MEDIA, e.project);
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${e.id}.webp`);
  try {
    await sharp(src)
      .rotate()
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    available.push(e.id);
    console.log(`✓ ${e.id}.webp  ←  ${path.relative(ROOT, src)}`);
  } catch (err) {
    console.error(`✗ ${e.id}: conversion failed — ${err}`);
  }
}

// ---- 4. Regenerate availability module
const header = `/* GENERATED by scripts/ingest-media.mjs — do not edit by hand.
 * Ids of case-media entries whose converted WebP asset exists under
 * public/media/<project>/<id>.webp. Re-run the ingest script after adding
 * files to upload/. Client-safe (plain strings only). */
export const AVAILABLE_CASE_MEDIA: string[] = ${JSON.stringify(available, null, 2)};
`;
writeFileSync(GENERATED, header);

// ---- 5. Report
console.log("\n==== Ingest report ====");
console.log(`Manifest entries : ${entries.length}`);
console.log(`Candidates       : ${candidates.length}`);
console.log(`Converted        : ${available.length}`);
const missing = entries.filter((e) => !assignment.has(e.id));
if (missing.length) {
  console.log("\nMissing (no candidate matched):");
  for (const e of missing) console.log(`  - ${e.id} (tokens: ${e.match.join(", ")})`);
}
const leftover = candidates.filter((c) => !used.has(c));
if (leftover.length) {
  console.log("\nLeftover candidates (unmatched):");
  for (const c of leftover) console.log(`  - ${path.relative(ROOT, c)}`);
}
