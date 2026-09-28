import { profile } from "@/content/site";
import { PrintResumeLink } from "@/components/site/resume-print";
import { MediaIngestLink } from "@/components/site/media-ingest";

const quickLinks = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const social: { label: string; href: string; download?: boolean }[] = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Contact card (.vcf)", href: "/api/vcard", download: true },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="mt-1 font-mono text-[12px] text-muted-foreground">
              {profile.role} — {profile.specialization.join(" · ")}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-[10.5px] text-primary">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              {profile.availability}
            </p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground print:hidden">
              <kbd className="kbd-chip">⌘</kbd>
              <kbd className="kbd-chip">K</kbd>
              to jump anywhere — work, skills, case studies
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Quick links
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Social
            </p>
            <ul className="mt-3 space-y-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.download ? { download: "hamza-mushtaq.vcf" } : {})}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="link-underline text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <PrintResumeLink className="text-[13px] text-muted-foreground transition-colors hover:text-foreground" />
              </li>
              <li>
                <MediaIngestLink />
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 font-mono text-[11px] text-muted-foreground">
          <p>© 2026 {profile.name}</p>
          <p className="max-w-xl text-right leading-relaxed">
            Built with Next.js · React · TypeScript · Tailwind CSS — designed and
            engineered by hand. No trackers, no cookies.
          </p>
        </div>
      </div>
    </footer>
  );
}
