import Link from "next/link";

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>🇯🇵 日本自治体データランキング</h1>

      <p style={{ color: "#555" }}>
        全国1900以上の市区町村データを可視化
      </p>

      <div style={{ marginTop: 24 }}>
        <Link href="/ranking/population" style={card}>
          📊 人口ランキング
        </Link>

        <Link href="/search" style={card}>
          🔎 自治体検索
        </Link>
      </div>
    </main>
  );
}

const card = {
  display: "block",
  padding: 16,
  marginTop: 12,
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  textDecoration: "none",
  color: "#111",
};