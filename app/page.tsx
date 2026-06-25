import Link from "next/link";

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <p
        style={{
          color: "#555",
          fontSize: 18,
          marginBottom: 24,
        }}
      >
        全国約1700自治体のオープンデータを分析・ランキング化
      </p>

      <section>
        <h2 style={sectionTitle}>ランキング</h2>

        <div style={grid}>
          <Link href="/ranking/population" style={card}>
            <h3>📊 人口ランキング</h3>
            <p>人口が多い自治体TOP50</p>
          </Link>

          <Link href="/ranking/child" style={card}>
            <h3>👶 子ども人口ランキング</h3>
            <p>子ども比率が高い自治体TOP50</p>
          </Link>

          <Link href="/ranking/aging" style={card}>
            <h3>👴 高齢化率ランキング</h3>
            <p>高齢化率が高い自治体TOP50</p>
          </Link>

          <Link href="/ranking/decline" style={card}>
            <h3>📉 人口減少ランキング</h3>
            <p>人口減少率が高い自治体TOP50</p>
          </Link>

          <Link href="/search" style={card}>
            <h3>🔎 自治体検索</h3>
            <p>自治体データを検索</p>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={sectionTitle}>データ分析記事</h2>

        <div style={grid}>
          <Link
            href="/articles/population-about"
            style={card}
          >
            <h3>人口ランキングとは？</h3>
            <p>人口データの見方を解説</p>
          </Link>

          <Link
            href="/articles/population-concentration"
            style={card}
          >
            <h3>人口集中地域を分析</h3>
            <p>日本の人口分布を解説</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 16,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  display: "block",
  padding: 20,
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  textDecoration: "none",
  color: "#111",
};