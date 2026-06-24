import Link from "next/link";

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={title}>📊 ランキング一覧</h1>

      <div style={grid}>
        <Link href="/ranking/population" style={card}>
          🏙 人口ランキング
        </Link>

        <Link href="/ranking/child" style={card}>
          👶 子どもが多い自治体
        </Link>

        <Link href="/ranking/aging" style={card}>
          🧓 高齢化率ランキング
        </Link>

        <Link href="/ranking/decline" style={card}>
          📉 少人口ランキング
        </Link>
      </div>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
};

const title: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  marginBottom: 20,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};

const card: React.CSSProperties = {
  padding: 18,
  background: "white",
  borderRadius: 14,
  textDecoration: "none",
  color: "#111",
  fontWeight: 700,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};