import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffaf9",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#b76e79",
            marginBottom: 24,
          }}
        >
          Wediingo
        </div>
        <div
          style={{
            fontSize: 72,
            color: "#171717",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Beautiful digital invitations,{" "}
          <span style={{ color: "#b76e79", fontStyle: "italic" }}>live in minutes</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
