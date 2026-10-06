import Link from "next/link";

/**
 * 「注目の読み物」。
 * 以前のトップにあった「注目記事」「ニッチな読み物」「記事一覧」を、6本に絞って1つにまとめたもの。
 * 検索で最も読まれている記事(100万人都市)への内部リンクは、ここで残している。
 */
const ITEMS = [
  { href: "/articles/million-cities", title: "人口100万人以上の都市は12市｜全国一覧とランキング" },
  { href: "/articles/designated-cities-comparison", title: "政令指定都市20市を人口・面積・高齢化率で比べる" },
  { href: "/articles/birth-rate", title: "出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか" },
  { href: "/articles/doctors-analysis", title: "医師数ランキング分析：千代田区が全国1位" },
  { href: "/articles/daytime-ratio-analysis", title: "千代田区の昼間人口は夜間人口の13.5倍" },
  { href: "/articles/population-churn-analysis", title: "大熊町は住民の53.7%が1年で入れ替わる" },
];

export default function HighlightsSection() {
  return (
    <section style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>📖 注目の読み物</h2>
        <Link
          prefetch={false}
          href="/articles"
          style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)", textDecoration: "none" }}
        >
          記事一覧を見る →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 10,
        }}
      >
        {ITEMS.map((x) => (
          <Link
            prefetch={false}
            key={x.href}
            href={x.href}
            style={{
              display: "block",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--ochre)",
              color: "var(--ink)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            {x.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
