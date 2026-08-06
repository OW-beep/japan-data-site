type Row = {
  name: string;
  share: number;
};

export default function ManufacturingSummary({
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
        製造業就業者比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        就業者に占める第2次産業(製造業・建設業など)の割合が
        最も高いのは<strong>{ranking[0].name}</strong>
        で{ranking[0].share.toFixed(1)}
        %。10位の<strong>{tenth.name}</strong>
        でも{tenth.share.toFixed(1)}
        %と、全国平均({average.toFixed(1)}%)を大きく
        上回っています。上位には、ファナックの本社・工場
        がある山梨県忍野村、SUBARUの主力工場を持つ群馬県
        大泉町、トヨタ系部品メーカーが集積する愛知県高浜市・
        碧南市、ヤマハ・スズキ関連の静岡県湖西市など、特定の
        大手メーカーや産業集積地を抱える自治体が並びます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(1)}%</strong>
        です。農業中心の町や、サービス業中心の都市部とは
        対照的な「ものづくりの町」の姿が見えてきます。
      </p>
    </section>
  );
}
