type Row = {
  name: string;
  value: number;
};

export default function RetailStoreSummary({
  ranking,
  zeroCount,
}: {
  ranking: Row[];
  zeroCount: number;
}) {
  if (ranking.length === 0) return null;

  const avg = ranking.reduce((s, r) => s + r.value, 0) / ranking.length;
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

      <h2 style={{ marginTop: 0, fontSize: 24 }}>
        大型小売店数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口1万人あたりの大型小売店数は、全国平均
        {avg.toFixed(2)}
        店に対し、1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(2)}
        店、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(2)}
        店と、平均を大きく上回りました。人口3,000人以上の
        自治体のうち{zeroCount}
        は大型小売店が1店舗もありません。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        上位には、大規模商業施設が1つあるだけで人口比の
        数値が跳ね上がる小規模な町村が目立ちます。買い物
        難民ランキング分析の記事とあわせて見ると、大型店の
        有無が地域の買い物環境に与える影響の大きさが、
        より具体的に見えてきます。
      </p>
    </section>
  );
}
