type Row = {
  name: string;
  value: number;
};

export default function EducationExpenseSummary({
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
        教育費ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        住民一人あたりの教育費は、全国平均{avg.toLocaleString(
          undefined,
          { maximumFractionDigits: 0 }
        )}
        円に対し、1位の<strong>{ranking[0].name}</strong>は
        {ranking[0].value.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
        円、10位の<strong>{tenth.name}</strong>でも
        {tenth.value.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
        円と、平均を大きく上回っています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        人口の少ない自治体ほど、学校の統廃合コストや老朽化した
        施設の改修費が住民一人あたりの金額を押し上げやすい
        傾向があります。単純に「教育に熱心な自治体」と
        読むのではなく、学校数・人口規模とあわせて見ることを
        おすすめします。
      </p>
    </section>
  );
}
