type Row = {
  name: string;
  value: number;
};

export default function DentistSummary({
  ranking,
  zeroCount,
}: {
  ranking: Row[];
  zeroCount: number;
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
        歯科医師数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口10万人あたりの歯科医師数は、全国平均
        {avg.toFixed(1)}
        人に対し、1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}
        人、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}
        人と、平均を大きく上回りました。一方、歯科医師が
        1人もいない自治体も{zeroCount}
        あります(人口3,000人以上の自治体に限定した集計)。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        医師数ランキングの記事と同様、都市部への集中に加え、
        大学の歯学部・附属病院を抱える自治体が突出して高い
        数値を示す傾向が見られます。人口あたりの数字だけを
        見て「歯科医療が手薄」と判断する前に、近隣の都市への
        アクセスも含めて確認することをおすすめします。
      </p>
    </section>
  );
}
