type Row = {
  name: string;
  density: number;
};

export default function SparseDensitySummary({
  ranking,
}: {
  ranking: Row[];
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
        人口密度が低い自治体ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国で最も人口密度が低いのは<strong>{ranking[0].name}</strong>
        で、1km²あたり{ranking[0].density.toFixed(1)}
        人です。10位の<strong>{tenth.name}</strong>
        でも{tenth.density.toFixed(1)}
        人と、いずれも1km²に1人前後、あるいはそれ以下という
        水準にとどまります。北海道の山間部の町村が上位の
        多くを占めており、広大な面積に対して人口が非常に
        少ない、日本の中でも特に人口希薄な地域です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        人口密度が高い自治体のランキングとあわせて見ることで、
        同じ日本の国土の中にある、暮らしの密度の大きな違いが
        見えてきます。
        <a href="/ranking/density" style={{ color: "#0e7490" }}>
          人口密度が高い自治体ランキング
        </a>
        もあわせてご覧ください。
      </p>
    </section>
  );
}
