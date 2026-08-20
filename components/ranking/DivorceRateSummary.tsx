type Row = {
  name: string;
  value: number;
};

export default function DivorceRateSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg = ranking.reduce((s, r) => s + r.value, 0) / ranking.length;

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
          background: "#e0e7ff",
          color: "#4338ca",
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
        離婚率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口千人あたりの離婚件数は、全国平均{avg.toFixed(2)}
        でした。都道府県別に見ると、沖縄県・福岡県・大阪県
        などの西日本の都市部で高く、東北・北陸地方で低い
        という地域差が見られます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        この統計は婚姻率と同様、人口規模が小さい自治体ほど
        件数の増減で数値が大きく振れやすい傾向があります。
        件数がゼロの自治体も一定数ありますが、これは離婚が
        少ないことを示すというより、母数となる件数自体が
        少ないために起こりやすい統計上の現象です。
      </p>
    </section>
  );
}
