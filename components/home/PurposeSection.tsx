import Link from "next/link";

const purposes = [
  {
    emoji: "🏠",
    title: "移住・引っ越し先を比較する",
    desc: "気になる2つの自治体を、人口・財政・医療など16指標で並べて比較できます。",
    href: "/compare",
    cta: "自治体比較ツールを使う",
  },
  {
    emoji: "👶",
    title: "子育て環境を調べる",
    desc: "出生率・保育園・学校規模・子ども人口割合など、子育てに関わるランキングをまとめて見られます。",
    href: "/articles/child-top50",
    cta: "子ども人口ランキング分析を見る",
  },
  {
    emoji: "💰",
    title: "自治体の財政を調べる",
    desc: "財政力指数・経常収支比率・自主財源比率など、自治体の「お財布事情」を分析しています。",
    href: "/articles/finance-analysis",
    cta: "財政力指数ランキング分析を見る",
  },
  {
    emoji: "👴",
    title: "高齢化・将来性を調べる",
    desc: "高齢化率・空き家率・20代純移動率など、街の将来を占う指標を集めています。",
    href: "/articles/aging-top50",
    cta: "高齢化率ランキング分析を見る",
  },
];

export default function PurposeSection() {
  return (
    <section style={{ marginTop: 40, marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        🎯 目的から探す
      </h2>
      <p
        style={{
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        何を調べたいかで、見るべきページは変わります。まずは目的から選んでみてください。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {purposes.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "20px 20px 18px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 6,
                color: "#111827",
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              {p.desc}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              {p.cta} →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
