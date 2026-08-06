type Row = {
  name: string;
  rate: number;
};

export default function UnemploymentSummary({
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
          background: "#ffedd5",
          color: "#c2410c",
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
        完全失業率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        完全失業率が最も高いのは<strong>{ranking[0].name}</strong>
        で{ranking[0].rate.toFixed(1)}
        %。10位の<strong>{tenth.name}</strong>
        でも{tenth.rate.toFixed(1)}
        %と、全国平均({average.toFixed(1)}%)を大きく上回って
        います。上位には福岡県の福智町・水巻町・川崎町・大任町・
        香春町・糸田町など、筑豊(ちくほう)地方のかつての産炭地
        が数多く並びます。炭鉱閉山から半世紀以上が経った今も、
        新たな基幹産業への転換が難しく、雇用情勢の厳しさが
        統計にはっきりと表れています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        逆に完全失業率が低いのは、人口数百人規模の離島や山村が
        中心です。母数が小さいため数値が振れやすい点には注意が
        必要ですが、農業・漁業など地域に根ざした仕事の割合が
        高いことも背景にあると考えられます。
      </p>
    </section>
  );
}
