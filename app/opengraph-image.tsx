import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LCTracker — Personal LeetCode Progress Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          backgroundColor: "#09090b",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Emerald glow blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Bottom-left subtle glow */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: 60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "sans-serif",
            }}
          >
            LC
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f4f4f5",
              fontFamily: "sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            LCTracker
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            fontFamily: "sans-serif",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ color: "#f4f4f5" }}>Master LeetCode.</span>
          <span style={{ color: "#10b981" }}>Track Every Step.</span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            fontFamily: "sans-serif",
            fontWeight: 400,
            marginBottom: 48,
            lineHeight: 1.5,
            maxWidth: 720,
          }}
        >
          63 curated problems · streaks · heatmap · syntax-highlighted solutions.
          No sign-up. All local.
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["63 Problems", "10 Topics", "Streak Tracking", "Free & Local"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.4)",
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "sans-serif",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
