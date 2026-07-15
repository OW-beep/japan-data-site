type Row = {
  name: string;
  value: number;
};

export default function ChildSummary({
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
        子ども人口割合ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        子ども人口割合は、総人口に占める15歳未満人口の割合です。
        子育て世帯の多さを知る一つの目安になります。
        今回のランキングでは<strong>{ranking[0].name}</strong>
        が{ranking[0].value.toFixed(2)}%で最も高く、10位の
        <strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(2)}%と、上位自治体はいずれも
        全国平均を大きく上回っています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        上位自治体では子どもの割合が高く、
        新興住宅地や人口流入が続く地域が多い傾向があります。
        子ども人口割合が高い自治体は、必ずしも出生率そのものが
        高いとは限りません。子育て世代の転入が多いベッドタウンや、
        大規模な宅地開発が進んだ地域では、若い世帯が集まることで
        割合が押し上げられているケースも多く見られます。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {avg.toFixed(2)}%</strong>
        です。
      </p>
    </section>
  );
}
