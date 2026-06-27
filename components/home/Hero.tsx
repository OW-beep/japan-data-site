import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        padding: "80px 20px",
        marginBottom: 70,
        borderRadius: 24,
        background:
          "linear-gradient(135deg,#eff6ff,#ffffff)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.3,
          marginBottom: 24,
        }}
      >
        日本全国1747自治体を
        <br />
        データで比較しよう
      </h1>

      <p
        style={{
          maxWidth: 820,
          margin: "0 auto",
          fontSize: 20,
          color: "#4b5563",
          lineHeight: 1.9,
          marginBottom: 40,
        }}
      >
        人口・人口密度・面積・子ども人口・高齢化率・出生率など、
        オープンデータを使って全国の自治体をランキング形式で紹介しています。
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/ranking/population"
          style={{
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            padding: "16px 30px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          👥 人口ランキング
        </Link>

        <Link
          href="/ranking/area"
          style={{
            background: "#16a34a",
            color: "#fff",
            textDecoration: "none",
            padding: "16px 30px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          🗺 面積ランキング
        </Link>

        <Link
          href="/ranking/density"
          style={{
            background: "#ea580c",
            color: "#fff",
            textDecoration: "none",
            padding: "16px 30px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          🏙 人口密度ランキング
        </Link>
      </div>
    </section>
  );
}