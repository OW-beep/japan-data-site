type Row = {
  name: string;
  taxRatio: number;
};

export default function TaxRatioSummary({
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
          background: "#d1fae5",
          color: "#047857",
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
        地方税自主財源比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        歳入に占める地方税の割合が最も高いのは
        <strong>{ranking[0].name}</strong>
        で{ranking[0].taxRatio.toFixed(1)}
        %。10位の<strong>{tenth.name}</strong>
        でも{tenth.taxRatio.toFixed(1)}
        %と、全国平均({average.toFixed(1)}%)を大きく
        上回っています。上位には、大企業の工場・港湾施設が
        集積する愛知県飛島村、東京ディズニーリゾートを
        擁する千葉県浦安市、軽井沢町・箱根町・山中湖村と
        いった別荘・リゾート地、原子力研究施設が立地する
        茨城県東海村など、特定の産業・観光資源によって
        自前の税収を確保できている自治体が並びます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(1)}%</strong>
        です。逆に比率が低い自治体は、人口数百人規模の
        離島・山村が中心で、地方交付税など国からの財政
        移転への依存度が非常に高くなっています。
      </p>
    </section>
  );
}
