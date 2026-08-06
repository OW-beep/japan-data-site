type Props = {
  ranking: {
    name: string;
    value: number;
  }[];
};

export default function AreaSummary({
  ranking,
}: Props) {
  const avg =
    ranking.reduce((s, c) => s + c.value, 0) /
    ranking.length;

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
        面積ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国の自治体面積を比較すると、
        北海道の自治体が上位を占めています。
        {ranking.length >= 3 && (
          <>
            {" "}
            今回のランキングでは<strong>{ranking[0].name}</strong>
            （{ranking[0].value.toLocaleString()}km²）が最も広く、
            <strong>{ranking[1].name}</strong>
            （{ranking[1].value.toLocaleString()}km²）、
            <strong>{ranking[2].name}</strong>
            （{ranking[2].value.toLocaleString()}km²）と続きます。
          </>
        )}
      </p>

      <p style={{ lineHeight: 1.9 }}>
        面積が広い自治体ほど
        人口密度が低いとは限らず、
        都市部では狭い面積でも
        多くの人口を抱える自治体があります。
        広大な面積を持つ自治体は山地や森林が大半を占めることが多く、
        可住地面積（実際に人が住める土地の面積）で見ると、
        単純な面積ランキングとは異なる姿が見えてきます。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {avg.toFixed(1)}km²</strong>
        です。
      </p>
    </section>
  );
}
