type Row = {
  name: string;
  value: number;
};

export default function BalanceRatioSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg =
    ranking.reduce((s, r) => s + r.value, 0) /
    ranking.length;

  const tenth = ranking[Math.min(9, ranking.length - 1)];

  return (
    <section
      style={{
        marginTop: 35,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 30,
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#dbeafe",
          color: "#1d4ed8",
          padding: "4px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        運営者コメント
      </div>

      <h2
        style={{
          marginTop: 0,
          fontSize: 24,
        }}
      >
        経常収支比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        経常収支比率は、人件費や扶助費といった毎年必ずかかる
        経常的な支出が、地方税などの経常的な収入のうちどれだけを
        占めているかを示す指標です。財政力指数とは違い、
        <strong>低いほど「新しい事業に回せる財政的な余裕がある」</strong>
        ことを意味します。今回1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}%、10位の
        <strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}%と、全国平均
        {avg.toFixed(1)}%を大きく下回る水準でした。
      </p>

      <p style={{ lineHeight: 1.9 }}>
        上位には、原子力発電所を抱える北海道泊村・福井県高浜町・
        新潟県刈羽村や、震災前の福島県大熊町・広野町など、電源
        立地交付金や固定資産税収入によって、人口規模に比べて
        財政的な余裕が大きい自治体が目立ちます。財政力指数の
        分析記事でも触れましたが、特定の産業・施設に支えられた
        自治体は、一般的な人口統計だけでは説明できない財政の
        強さを持つことがあります。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        逆に比率が100%を超える自治体は、経常的な収入だけでは
        経常的な支出すら賄えていない、いわゆる「自転車操業」の
        状態にあります。かつて財政破綻した北海道夕張市が
        全国最下位となったのは、象徴的な結果と言えるでしょう。
      </p>
    </section>
  );
}
