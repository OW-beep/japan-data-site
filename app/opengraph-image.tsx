import { ImageResponse } from "next/og";
import cities from "@/data/cities.json";

export const runtime = "edge";

export default function Image() {
  const top = cities[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#2563eb,#60a5fa)",
          color: "white",
          fontSize: 60,
          fontWeight: 800,
          textAlign: "center",
          padding: 40,
        }}
      >
        <div>🇯🇵 日本自治体データランキング</div>

        <div
          style={{
            fontSize: 32,
            marginTop: 20,
            fontWeight: 500,
            opacity: 0.9,
          }}
        >
          例：{top?.name} 人口 {top?.population?.toLocaleString()}人
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}