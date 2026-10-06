import Link from "next/link";

/**
 * 「このサイト独自の指標」セクション。
 * 公開データを組み合わせて独自に算出したスコア(複合指標)を、トップで前面に出す。
 */
const INDEXES = [
  {
    href: "/ranking/fiscal-health-composite",
    emoji: "🏅",
    title: "財政健全度スコア",
    desc: "財政力指数・経常収支比率・自主財源比率・実質公債費比率の4指標を統合。",
  },
  {
    href: "/ranking/young-family-attractiveness-index",
    emoji: "👨‍👩‍👧",
    title: "子育て世代吸引力指数",
    desc: "保育所定員・20代純移動率・婚姻率を統合。子育て世代を引きつける街は？",
  },
  {
    href: "/ranking/elderly-support-composite",
    emoji: "🏥",
    title: "高齢者支援体制スコア",
    desc: "医師数・老人ホーム定員・独居高齢者率を統合(高齢化率TOP300が対象)。",
  },
  {
    href: "/ranking/living-infrastructure-index",
    emoji: "🏘️",
    title: "生活基盤充実度指数",
    desc: "商業集積(小売・飲食店)・公民館数・空き家率を統合。暮らしの土台を比べる。",
  },
  {
    href: "/ranking/industry-diversity-index",
    emoji: "🏭",
    title: "産業の多様性指数(HHI)",
    desc: "第1〜3次産業の就業者比率から算出。特定の産業への一極集中度がわかる。",
  },
  {
    href: "/ranking/bedroom-town-finance",
    emoji: "🌆",
    title: "ベッドタウン財政力",
    desc: "昼夜間人口比率×財政力指数。雇用を生まなくても豊かなベッドタウンを探す。",
  },
];

export default function OriginalIndexSection() {
  return (
    <section style={{ marginTop: 8, marginBottom: 40 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
        ✨ このサイト独自の指標
      </h2>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
        公開データを組み合わせて、独自に算出したスコアです。単独の数字では見えない、自治体の「総合力」がわかります。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {INDEXES.map((x) => (
          <Link
            prefetch={false}
            key={x.href}
            href={x.href}
            style={{
              display: "block",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderTop: "3px solid var(--indigo)",
              padding: "14px 16px",
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              <span style={{ marginRight: 6 }}>{x.emoji}</span>
              {x.title}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>{x.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
