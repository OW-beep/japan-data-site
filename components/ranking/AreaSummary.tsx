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
        margin: "32px 0",
        padding: 24,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        運営者コメント
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

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#fff",
          borderRadius: 8,
        }}
      >
        <strong>TOP50平均</strong>

        <div
          style={{
            fontSize: 30,
            color: "#2563eb",
            marginTop: 8,
          }}
        >
          {avg.toFixed(1)} km²
        </div>
      </div>
    </section>
  );
}