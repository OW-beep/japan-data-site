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
  { href: "/ranking/decline", emoji: "📊", label: "社会増減率ランキング" },
  { href: "/ranking/household", emoji: "🏠", label: "単独世帯割合ランキング" },
  { href: "/ranking/household-size", emoji: "👨‍👩‍👧‍👦", label: "平均世帯人員ランキング" },
  { href: "/ranking/doctors", emoji: "🩺", label: "医師数ランキング" },
  { href: "/ranking/unemployment", emoji: "💼", label: "完全失業率ランキング" },
  { href: "/ranking/manufacturing", emoji: "🏭", label: "製造業就業者比率ランキング" },
  { href: "/ranking/tax-ratio", emoji: "💴", label: "地方税自主財源比率ランキング" },
  { href: "/ranking/school-crowding", emoji: "🏫", label: "小学校1校あたり子ども人口ランキング" },
  { href: "/ranking/welfare-ratio", emoji: "🤝", label: "民生費比率ランキング" },
  { href: "/ranking/habitable-density", emoji: "🏔️", label: "可住地人口密度ランキング" },
  { href: "/ranking/natural-change", emoji: "👶", label: "自然増減率ランキング" },
  { href: "/ranking/decrease", emoji: "📉", label: "人口が少ない自治体ランキング" },
  { href: "/ranking/sparse-density", emoji: "🏞️", label: "人口密度が低い自治体ランキング" },
  { href: "/ranking/foreign-population", emoji: "🌏", label: "外国人人口比率ランキング" },
  { href: "/ranking/retail-access", emoji: "🛒", label: "高齢者あたり小売店数ランキング" },
  { href: "/ranking/balance-ratio", emoji: "🧮", label: "経常収支比率ランキング" },
  { href: "/ranking/marriage-rate", emoji: "💍", label: "婚姻率ランキング" },
  { href: "/ranking/daycare", emoji: "🧸", label: "保育園あたり子ども人口ランキング" },
  { href: "/ranking/restaurant", emoji: "🍜", label: "飲食店密度ランキング" },
  { href: "/ranking/library", emoji: "📚", label: "図書館数ランキング" },
  { href: "/ranking/vacant-house", emoji: "🏚️", label: "空き家率ランキング" },
  { href: "/ranking/daytime-ratio", emoji: "🌆", label: "昼夜間人口比率ランキング" },
  { href: "/ranking/elderly-home", emoji: "🏡", label: "高齢者施設数ランキング" },
  { href: "/ranking/dentist", emoji: "🦷", label: "歯科医師数ランキング" },
  { href: "/ranking/retail-store", emoji: "🏬", label: "大型小売店数ランキング" },
  { href: "/ranking/young-adult-migration", emoji: "🎒", label: "20代純移動率ランキング" },
  { href: "/ranking/recycling-rate", emoji: "♻️", label: "ごみのリサイクル率ランキング" },
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
