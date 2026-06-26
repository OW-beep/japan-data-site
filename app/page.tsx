import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
          color: "#fff",
          padding: 36,
          borderRadius: 20,
          marginBottom: 36,
        }}
      >
        <h1
          style={{
            fontSize: 38,
            marginBottom: 12,
          }}
        >
          🇯🇵 日本自治体データランキング
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.8,
            opacity: 0.95,
          }}
        >
          全国の自治体データをランキング・比較・分析。
          人口、面積、人口密度、高齢化率などを分かりやすく掲載しています。
        </p>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link href="/search" style={heroButton}>
            🔎 自治体検索
          </Link>

          <Link href="/ranking/population" style={heroButtonWhite}>
            📊 ランキングを見る
          </Link>
        </div>
      </section>

      {/* ランキング */}
      <h2 style={sectionTitle}>
        📊 人気ランキング
      </h2>

      <div style={grid}>
        <Link href="/ranking/population" style={card}>
          <h3>👥 人口ランキング</h3>
          <p>人口が多い自治体TOP50</p>
        </Link>

        <Link href="/ranking/density" style={card}>
          <h3>🏙️ 人口密度ランキング</h3>
          <p>人口密度が高い自治体TOP50</p>
        </Link>

        <Link href="/ranking/area" style={card}>
          <h3>🗺️ 面積ランキング</h3>
          <p>面積が広い自治体TOP50</p>
        </Link>

        <Link href="/ranking/child" style={card}>
          <h3>👶 子ども人口ランキング</h3>
          <p>子ども人口が多い自治体</p>
        </Link>

        <Link href="/ranking/aging" style={card}>
          <h3>👴 高齢化率ランキング</h3>
          <p>高齢化率が高い自治体</p>
        </Link>
      </div>

      {/* 記事 */}
      <h2
        style={{
          ...sectionTitle,
          marginTop: 48,
        }}
      >
        📰 データで見る日本
      </h2>

      <div style={grid}>
        <Link href="/articles/population-japan" style={card}>
          <h3>日本で人口が多い自治体は？</h3>
          <p>ランキングから読み解く人口集中</p>
        </Link>

        <Link href="/articles/population-density" style={card}>
          <h3>人口密度が高い街とは？</h3>
          <p>都市部と地方を比較</p>
        </Link>

        <Link href="/articles/aging" style={card}>
          <h3>高齢化率から見る日本</h3>
          <p>自治体ごとの違いを分析</p>
        </Link>
      </div>

      {/* 検索 */}
      <section
        style={{
          marginTop: 50,
          background: "#eff6ff",
          padding: 28,
          borderRadius: 18,
        }}
      >
        <h2>🔎 自治体を検索</h2>

        <p>
          人口・面積・人口密度などを
          自治体ごとに確認できます。
        </p>

        <Link
          href="/search"
          style={heroButton}
        >
          自治体検索へ
        </Link>
      </section>
    </main>
  );
}

const heroButton = {
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: 10,
  fontWeight: 700,
};

const heroButtonWhite = {
  background: "#fff",
  color: "#2563eb",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: 10,
  fontWeight: 700,
};

const sectionTitle = {
  fontSize: 28,
  marginBottom: 18,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: 18,
};

const card: React.CSSProperties = {
  display: "block",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 22,
  color: "#111827",
  textDecoration: "none",
  boxShadow:
    "0 2px 8px rgba(0,0,0,.05)",
};