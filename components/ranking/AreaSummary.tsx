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
      </p>

      <p style={{ lineHeight: 1.9 }}>
        面積が広い自治体ほど
        人口密度が低いとは限らず、
        都市部では狭い面積でも
        多くの人口を抱える自治体があります。
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