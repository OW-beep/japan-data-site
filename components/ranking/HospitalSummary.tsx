type Row = {
  name: string;
  value: number;
};

export default function HospitalSummary({
  ranking,
  zeroCount,
  total,
}: {
  ranking: Row[];
  zeroCount: number;
  total: number;
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
          background: "#fee2e2",
          color: "#b91c1c",
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
        病院数ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        1位の<strong>{ranking[0].name}</strong>は人口10万人
        あたり{ranking[0].value.toFixed(1)}、10位の
        <strong>{tenth.name}</strong>でも
        {tenth.value.toFixed(1)}という水準です。医師数
        ランキングとは対照的に、上位には人口数千人規模の
        小さな町村が並びます。人口が少ないほど、病院1施設
        あたりの人口あたり換算値が跳ね上がりやすいという
        統計上の特性が背景にあります。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        全国{total.toLocaleString()}自治体のうち
        {zeroCount.toLocaleString()}自治体には病院が
        1つもありません。ただしその多くは、病院より小規模な
        診療所でカバーされているケースが多く、病院の
        有無だけで医療アクセスの良し悪しを判断することは
        できません。
      </p>
    </section>
  );
}
