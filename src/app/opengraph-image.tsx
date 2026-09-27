import { ImageResponse } from "next/og";

export const alt =
  "Muhammad Hamza Mushtaq — Software & AI Engineer. AI Systems · Machine Learning · Computer Vision · Full-Stack Engineering.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161411",
          color: "#f3efe7",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top: identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 56,
              background: "#e8a33d",
              borderRadius: 7,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, letterSpacing: 2, color: "#9c948a" }}>
              SOFTWARE &amp; AI ENGINEER
            </div>
          </div>
        </div>

        {/* middle: name + statement */}
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
          <div style={{ fontSize: 28, color: "#a89f93", display: "flex" }}>
            AI Systems · Machine Learning · Computer Vision · Full-Stack Engineering
          </div>
        </div>

        {/* bottom: projects */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 22, color: "#c7bfb2" }}>
            <div style={{ display: "flex", color: "#e8a33d" }}>Dark Pattern Hunter — multimodal AI + browser intelligence</div>
            <div style={{ display: "flex", color: "#c7bfb2" }}>CaptionAI — evidence-driven ML research</div>
            <div style={{ display: "flex", color: "#c7bfb2" }}>ChainProof — AI moderation + cryptographic integrity</div>
            <div style={{ display: "flex", color: "#c7bfb2" }}>AngluPol — adaptive learning platform (FSRS-4.5)</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#9c948a" }}>
            github.com/EquityAviator
          </div>
        </div>
      </div>
    ),
    size
  );
}
