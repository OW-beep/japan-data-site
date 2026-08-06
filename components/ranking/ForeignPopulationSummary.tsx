type Row = {
  name: string;
  ratio: number;
};

export default function ForeignPopulationSummary({
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
          background: "#fef9c3",
          color: "#a16207",
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
        外国人人口比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口に占める外国人の割合が最も高いのは
        <strong>{ranking[0].name}</strong>
        で{ranking[0].ratio.toFixed(1)}
        %。10位の<strong>{tenth.name}</strong>
        でも{tenth.ratio.toFixed(1)}
        %と、全国平均({average.toFixed(2)}%)を大きく
        上回っています。上位には、農業の担い手として外国人
        労働者を受け入れている高原野菜の産地や、製造業の
        工場労働者として外国人住民が多い「企業城下町」、
        多様な国籍の住民が集まる東京都心の区など、性質の
        異なる複数のパターンが混在しています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(2)}%</strong>
        です。産業構造分析の記事で紹介した町の多くが、
        今回のランキングにも再登場しています。
      </p>
    </section>
  );
}
