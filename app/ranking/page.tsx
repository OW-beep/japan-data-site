import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ランキング一覧",
  description:
    "全国自治体の人口・出生率・高齢化率・人口密度・面積・財政力指数など、全ランキングの一覧ページです。",
};

const rankings = [
  { href: "/ranking/population", emoji: "🏙", label: "人口ランキング" },
  { href: "/ranking/birth-rate", emoji: "👶", label: "出生率ランキング" },
  { href: "/ranking/child", emoji: "🧒", label: "子どもが多い自治体" },
  { href: "/ranking/aging", emoji: "🧓", label: "高齢化率ランキング" },
  { href: "/ranking/density", emoji: "🏘️", label: "人口密度ランキング" },
  { href: "/ranking/area", emoji: "🗺️", label: "面積ランキング" },
  { href: "/ranking/finance", emoji: "💰", label: "財政力指数ランキング" },
];

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={title}>📊 ランキング一覧</h1>

      <p style={lead}>
        全国自治体データランキングで公開している、すべてのランキングコンテンツです。
        気になる指標から自治体を比較してみてください。
      </p>

      <div style={grid}>
        {rankings.map((r) => (
          <Link key={r.href} href={r.href} style={card}>
            {r.emoji} {r.label}
          </Link>
        ))}
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
  marginBottom: 12,
};

const lead: React.CSSProperties = {
  color: "#4b5563",
  lineHeight: 1.8,
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
