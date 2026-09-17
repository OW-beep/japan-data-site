import Link from "next/link";

/**
 * 新着ランキング・記事セクション。
 *
 * 注意: このリストは手動管理。新しいランキング/記事を追加したら、
 * 忘れずにここにも1エントリ追加すること(日付順で並べ替えて表示される)。
 * 過去に更新を忘れて長期間放置されていたことがあるため、
 * 新規コンテンツ追加時は必ずこのファイルもセットで編集する。
 */
const newItems = [
  {
    href: "/articles/corporate-growth-analysis",
    emoji: "🏢",
    title: "新設法人ランキング分析",
    type: "記事",
    date: "2026-09-18",
  },
  {
    href: "/ranking/corporate-growth",
    emoji: "🏢",
    title: "新設法人純増数ランキング",
    type: "ランキング",
    date: "2026-09-18",
  },
  {
    href: "/articles/real-estate-single-household-analysis",
    emoji: "🏠",
    title: "地価が高い自治体ほど単身世帯が多い",
    type: "記事",
    date: "2026-09-14",
  },
  {
    href: "/ranking/real-estate-price",
    emoji: "🏠",
    title: "不動産価格ランキング",
    type: "ランキング",
    date: "2026-09-14",
  },
  {
    href: "/ranking/capital-elevation",
    emoji: "⛰️",
    title: "県庁所在地 標高ランキング",
    type: "ランキング",
    date: "2026-09-13",
  },
  {
    href: "/articles/furusato-nozei-finance-analysis",
    emoji: "🎁",
    title: "ふるさと納税は財政力の弱い自治体を助けているか",
    type: "記事",
    date: "2026-09-13",
  },
  {
    href: "/ranking/furusato-nozei",
    emoji: "🎁",
    title: "ふるさと納税受入額ランキング",
    type: "ランキング",
    date: "2026-09-13",
  },
  {
    href: "/articles/duplicate-municipality-names",
    emoji: "🏘️",
    title: "同じ名前の自治体はいくつある？",
    type: "記事",
    date: "2026-09-13",
  },
];

function formatDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export default function NewArrivalsSection() {
  const sorted = [...newItems].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section style={{ marginTop: 40, marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 0,
          }}
        >
          🆕 新着ランキング・記事
        </h2>

        <Link
          prefetch={false}
          href="/articles"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--indigo)",
            textDecoration: "none",
          }}
        >
          すべて見る →
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {sorted.map((item) => (
          <Link
            prefetch={false}
            key={item.href}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              padding: "9px 16px",
              textDecoration: "none",
              color: "var(--ink)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>{item.emoji}</span>
            <span>{item.title}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--ochre)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatDate(item.date)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
