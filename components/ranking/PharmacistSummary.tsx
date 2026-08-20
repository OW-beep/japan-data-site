type Row = {
  name: string;
  value: number;
};

export default function PharmacistSummary({
  ranking,
}: {
  ranking: Row[];
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
          background: "#dcfce7",
          color: "#15803d",
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
        薬剤師数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口10万人あたりの薬剤師数は、全国平均{avg.toFixed(1)}
        人に対し、1位の<strong>{ranking[0].name}</strong>は
        {ranking[0].value.toFixed(1)}人、10位の
        <strong>{tenth.name}</strong>でも
        {tenth.value.toFixed(1)}人と、平均を大きく上回っています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        上位には東京都心区に加えて、大規模な病院・研究機関を
        抱える自治体が入りやすい傾向があります。医師数・
        歯科医師数と同様、勤務地ベースの集計のため、実際に
        その地域の住民が薬局を利用しやすいかどうかとは、
        必ずしも一致しない点にご注意ください。
      </p>
    </section>
  );
}
