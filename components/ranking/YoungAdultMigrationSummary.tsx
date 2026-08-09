type Row = {
  name: string;
  value: number;
};

export default function YoungAdultMigrationSummary({
  ranking,
  positiveCount,
  totalCount,
}: {
  ranking: Row[];
  positiveCount: number;
  totalCount: number;
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
        20代純移動率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口1,000人あたりの20代純移動数(全国平均
        {avg.toFixed(1)}
        )を見ると、1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}
        、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}
        と、20代が大きく流入している自治体が上位を占めました。
        ただし全国
        {totalCount.toLocaleString()}
        自治体のうち、20代の純移動がプラスなのはわずか
        {positiveCount.toLocaleString()}
        にとどまり、多くの自治体で若者の流出が続いている
        実態も見えてきます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        上位には東京23区だけでなく、大阪市の各区も数多く
        入っています。単身世帯割合・婚姻率ランキングの記事
        で見た都心区の傾向と、この20代流入の動きは強く
        重なっています。
      </p>
    </section>
  );
}
