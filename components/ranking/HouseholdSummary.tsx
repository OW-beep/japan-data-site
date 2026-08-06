type Row = {
  name: string;
  ratio: number;
};

export default function HouseholdSummary({
  ranking,
  average,
}: {
  ranking: Row[];
  average: number;
}) {
  if (ranking.length === 0) return null;

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
        単独世帯割合ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        単独世帯割合は、全世帯のうち一人暮らし世帯が占める割合です。
        今回のランキングでは<strong>{ranking[0].name}</strong>
        が{ranking[0].ratio.toFixed(1)}%で最も高く、10位の
        <strong>{tenth.name}</strong>
        でも{tenth.ratio.toFixed(1)}%と、全国平均を大きく
        上回っています。上位には、東京都心の特別区(単身世帯・
        DINKs世帯の集中)と、東日本大震災の被災地域(仮設住宅や
        復興関連住宅の入居形態の影響)という、まったく背景の
        異なる2種類の自治体が混在しています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        単独世帯割合が高いからといって、必ずしも「高齢者の
        一人暮らしが多い」ことを意味するわけではありません。
        都市部では進学・就職を機に転入した若年単身者が、
        地方の被災地域では仮設住宅の入居単位が、それぞれ
        単独世帯割合を押し上げる要因になっています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {average.toFixed(1)}%</strong>
        です。
      </p>
    </section>
  );
}
