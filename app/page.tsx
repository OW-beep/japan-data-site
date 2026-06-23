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
      <h1 style={{ fontSize: 28 }}>
        🇯🇵 日本自治体データランキング
      </h1>

      <p style={{ color: "#555", marginTop: 10 }}>
        全国1,900以上の市区町村データを可視化した統計サイト
      </p>

      <div style={{ marginTop: 30 }}>
        <Link
          href="/ranking/population"
          style={{
            display: "block",
            padding: 16,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: 12,
            textDecoration: "none",
            color: "#111",
          }}
        >
          📊 人口ランキングを見る
        </Link>

        <Link
          href="/pref/13"
          style={{
            display: "block",
            padding: 16,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            textDecoration: "none",
            color: "#111",
          }}
        >
          🗾 東京都データを見る
        </Link>
      </div>
    </main>
  );
}