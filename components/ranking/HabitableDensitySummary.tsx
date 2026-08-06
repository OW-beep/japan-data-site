type Row = {
  name: string;
  habitableDensity: number;
};

export default function HabitableDensitySummary({
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
          background: "#cffafe",
          color: "#0e7490",
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
        可住地人口密度ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        可住地面積(山地・湖沼などを除いた「住める土地」の面積)
        あたりの人口密度が最も高いのは<strong>{ranking[0].name}</strong>
        で、1km²あたり{Math.round(ranking[0].habitableDensity).toLocaleString()}
        人です。単純な人口密度ランキングでは目立たない三重県
        尾鷲市や和歌山県新宮市・那智勝浦町といった、山と海に
        挟まれ可住地が国土の1割程度しかない自治体が、この
        指標では大きく順位を上げます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {Math.round(average).toLocaleString()}人/km²</strong>
        です。同じ「人口密度が低い」自治体でも、平地が広い
        ために単に人口が少ないのか、可住地自体が狭いために
        密度が低く見えているだけなのかは、まったく違う実態を
        表しています。
      </p>
    </section>
  );
}
