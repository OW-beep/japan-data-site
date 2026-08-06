type Row = {
  name: string;
  per10k: number;
};

export default function DoctorsSummary({
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
          background: "#dcfce7",
          color: "#15803d",
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
        医師数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口10万人あたりの医師数で見ると、<strong>{ranking[0].name}</strong>
        が{ranking[0].per10k.toFixed(0)}
        人で全国トップです。10位の<strong>{tenth.name}</strong>
        でも{tenth.per10k.toFixed(0)}
        人と、全国平均を大きく上回っています。上位の顔ぶれを見ると、
        福井大学(永平寺町)、岩手医科大学(矢巾町)、愛媛大学医学部
        (東温市)、自治医科大学(下野市)、埼玉医科大学(毛呂山町)
        など、医科大学の附属病院がある町が数多く並びます。人口
        自体は数万人規模でも、大学病院1つで多くの医師が登録される
        ため、こうした「医科大学の城下町」が上位を独占する結果に
        なっています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国平均(対象自治体平均)は
        <strong> {average.toFixed(0)}人</strong>
        です。一方で医師が1人も登録されていない自治体も29町村
        あり、医療アクセスの地域差は非常に大きくなっています。
      </p>
    </section>
  );
}
