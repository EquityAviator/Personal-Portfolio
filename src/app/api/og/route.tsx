import { ImageResponse } from "next/og";
import { projects } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";

/**
 * Dynamic Open Graph images — one per case study, plus the site default.
 * `/api/og` → site card; `/api/og?case=<slug>` → per-project card.
 * Content comes strictly from src/content (no invented copy). Accent hexes
 * are static equivalents of the content-model oklch accents (satori-safe).
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT_HEX: Record<ProjectSlug, string> = {
  "dark-pattern-hunter": "#d55242", // oklch(0.66 0.2 15)
  captionai: "#3fa39d", // oklch(0.7 0.13 178)
  chainproof: "#2fa583", // oklch(0.68 0.15 162)
  anglupol: "#e0a33c", // oklch(0.78 0.17 75)
};

const AMBER = "#e8a33d";
const INK = "#f3efe7";
const MUTED = "#a89f93";
const FAINT = "#9c948a";
const BG = "#161411";

function SiteCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        color: INK,
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 14, height: 56, background: AMBER, borderRadius: 7 }} />
        <div style={{ fontSize: 30, letterSpacing: 2, color: FAINT, display: "flex" }}>
          SOFTWARE &amp; AI ENGINEER
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          Muhammad Hamza Mushtaq
        </div>
        <div style={{ fontSize: 28, color: MUTED, display: "flex" }}>
          AI Systems · Machine Learning · Computer Vision · Full-Stack Engineering
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 22,
            color: MUTED,
          }}
        >
          {projects.map((p) => (
            <div key={p.slug} style={{ display: "flex", color: FAINT }}>
              <span style={{ color: AMBER, display: "flex", marginRight: 10 }}>—</span>
              {p.name}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: FAINT }}>
          github.com/EquityAviator
        </div>
      </div>
    </div>
  );
}

function CaseCard({
  name,
  index,
  categories,
  tagline,
  story,
  accent,
}: {
  name: string;
  index: string;
  categories: string[];
  tagline: string;
  story: { label: string }[];
  accent: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        color: INK,
        padding: "72px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* accent spine */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: accent,
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          marginTop: 28,
        }}
      >
        <div
          style={{
            fontSize: 21,
            letterSpacing: 3,
            lineHeight: 1.5,
            color: accent,
            display: "flex",
            maxWidth: 760,
          }}
        >
          CASE STUDY {index} — {categories.join(" · ").toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 20,
            color: FAINT,
            display: "flex",
            whiteSpace: "nowrap",
            paddingTop: 2,
          }}
        >
          hamza mushtaq — portfolio
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.35,
            color: MUTED,
            display: "flex",
            maxWidth: 940,
          }}
        >
          {tagline}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "1px solid #2a2620",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", gap: 18, fontSize: 26 }}>
          {story.map((s, i) => (
            <div key={s.label} style={{ display: "flex", gap: 18 }}>
              {i > 0 && (
                <span style={{ color: accent, display: "flex" }} aria-hidden>
                  ›
                </span>
              )}
              <span style={{ color: INK, display: "flex" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: accent }}>
          evidence-documented build
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("case");
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;

  const element = project ? (
    <CaseCard
      name={project.name}
      index={project.index}
      categories={project.categories}
      tagline={project.tagline}
      story={project.story}
      accent={ACCENT_HEX[project.slug]}
    />
  ) : (
    <SiteCard />
  );

  const res = new ImageResponse(element, size);
  res.headers.set(
    "Cache-Control",
    "public, max-age=86400, stale-while-revalidate=604800"
  );
  return res;
}
