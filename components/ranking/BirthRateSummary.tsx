type Props = {
  average: number;
  cityCount: number;
  top3?: { name: string; rate: number }[];
};

export default function BirthRateSummary({
  average,
  cityCount,
  top3,
}: Props) {
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
        出生率ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        出生率は、1人の女性が一生のうちに産むとされる子どもの人数を表す指標です。
        {top3 && top3.length >= 3 && (
          <>
            {" "}
            今回のランキングでは<strong>{top3[0].name}</strong>
            （{top3[0].rate.toFixed(2)}）が最も高く、
            <strong>{top3[1].name}</strong>
            （{top3[1].rate.toFixed(2)}）、
            <strong>{top3[2].name}</strong>
            （{top3[2].rate.toFixed(2)}）が続きます。
          </>
        )}
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        全国的には都市部より地方部で出生率が高い傾向がありますが、
        人口規模や子育て支援、住宅事情など様々な要因が影響しています。
        特に、人口規模が小さい自治体は分母が小さいため、出生数の
        わずかな増減でも出生率が大きく変動しやすい点には注意が必要です。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        出生率が高くても人口が増加しているとは限らず、
        転出入や高齢化など他の人口動態も合わせて見ることが重要です。
        出生率が高い自治体でも、進学や就職で若年層が流出していれば
        総人口は減少することがあります。
      </p>

      <p
        style={{
          marginBottom: 0,
          fontWeight: 700,
        }}
      >
        全国平均：
        {average.toFixed(2)}
        （対象自治体 {cityCount.toLocaleString()}）
      </p>
    </section>
  );
}