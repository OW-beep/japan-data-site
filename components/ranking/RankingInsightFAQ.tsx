import JsonLd from "@/components/JsonLd";

type Item = {
  name: string;
  displayValue: string;
};

type Props = {
  /** ランキングの指標名。例:「人口密度」「財政力指数」 */
  metricName: string;
  /** 表示順(通常は上位)のランキング配列。最低1件必要。 */
  items: Item[];
  /** ランキング対象の総数(表示件数とは別に、母集団全体の数を伝えたい場合に指定) */
  totalCount?: number;
  /** 対象の単位。例:「都道府県」「自治体」 */
  unitLabel?: string;
  /** 1位についての追加の一言コメント(任意) */
  topNote?: string;
};

/**
 * 単体のテーブルだけで終わっているランキングページに、
 * 最低限の解説文とFAQ(+FAQPage構造化データ)を自動生成して
 * 追加するための共通コンポーネント。
 *
 * 各ページの `ranking` 配列(既に計算済みのもの)をそのまま渡すだけで、
 * 記事を1本ずつ書かなくても、ページ固有の実データに基づいた
 * 解説文・FAQを表示できる。
 */
export default function RankingInsightFAQ({
  metricName,
  items,
  totalCount,
  unitLabel = "自治体",
  topNote,
}: Props) {
  if (items.length === 0) return null;

  const top = items[0];
  const bottom = items[items.length - 1];
  const count = totalCount ?? items.length;

  const faq = [
    {
      q: `${metricName}ランキングで1位はどこですか？`,
      a: `${top.name}です(${top.displayValue})。${
        topNote ?? ""
      }`.trim(),
    },
    ...(items.length > 1
      ? [
          {
            q: `${metricName}が最も低い(少ない)のはどこですか？`,
            a: `今回のランキングの中では${bottom.name}です(${bottom.displayValue})。`,
          },
        ]
      : []),
    {
      q: `このランキングは何${unitLabel}を対象にしていますか？`,
      a: `全国${count.toLocaleString()}${unitLabel}を対象に集計しています。`,
    },
  ];

  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>
        Q&amp;A：{metricName}ランキングについて
      </h2>

      {faq.map((item) => (
        <p key={item.q} style={{ lineHeight: 1.9 }}>
          <strong>Q. {item.q}</strong>
          <br />
          A. {item.a}
        </p>
      ))}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />
    </section>
  );
}
