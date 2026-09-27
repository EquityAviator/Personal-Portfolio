import { NextResponse } from "next/server";
import { buildResumeMarkdown } from "@/lib/resume-markdown";

/**
 * Résumé as a downloadable Markdown file.
 *
 * Same typed content the print résumé (PDF) uses — composed into plain-text
 * Markdown so the document survives ATS parsers and email copy-paste.
 * Served as an attachment so a normal <a download> link works anywhere,
 * including the (server-rendered) 404 page, without any client JS.
 */
export function GET() {
  const md = buildResumeMarkdown();

  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hamza-mushtaq-resume.md"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
