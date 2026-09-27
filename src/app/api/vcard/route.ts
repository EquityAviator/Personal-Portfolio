import { NextResponse } from "next/server";
import { profile } from "@/content/site";

/**
 * vCard 3.0 contact card — built only from the profile content file.
 * Lets recruiters save Hamza's real contact details in one click.
 */
export function GET() {
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc("Mushtaq")};${esc("Muhammad Hamza")};;;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(profile.role)}`,
    `EMAIL;TYPE=INTERNET;TYPE=WORK:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phoneHref.replace("tel:", "")}`,
    `URL:${profile.github}`,
    `URL;TYPE=linkedin:${profile.linkedin}`,
    `ADR;TYPE=HOME:;;${esc("Attock")};;;;Pakistan`,
    `NOTE:${esc(profile.availability)}`,
    "REV:" + new Date().toISOString(),
    "END:VCARD",
  ];

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hamza-mushtaq.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
