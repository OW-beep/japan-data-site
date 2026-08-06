type Row = {
  name: string;
  welfareRatio: number;
};

export default function WelfareRatioSummary({
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
        民生費比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        歳入に占める民生費(福祉関連支出)の割合が最も高いのは
        <strong>{ranking[0].name}</strong>
        で{ranking[0].welfareRatio.toFixed(1)}
        %。10位の<strong>{tenth.name}</strong>
        でも{tenth.welfareRatio.toFixed(1)}
        %と、全国平均({average.toFixed(1)}%)を大きく
        上回っています。意外にも、上位には東京都練馬区・
        大田区・足立区・板橋区といった都市部の区が並んで
        おり、高齢化率が高い自治体ほど比率が高いとは限らない
        点が特徴です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(1)}%</strong>
        です。詳しい背景は、あわせて公開している解説記事で
        紹介しています。
      </p>
    </section>
  );
}
