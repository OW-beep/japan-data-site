type Row = {
  name: string;
  value: number;
};

export default function MarriageRateSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg =
    ranking.reduce((s, r) => s + r.value, 0) /
    ranking.length;

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
        婚姻率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        婚姻率は、人口1,000人あたりの婚姻件数を表す指標です。
        今回1位の<strong>{ranking[0].name}</strong>
        は人口1,000人あたり{ranking[0].value.toFixed(2)}
        件、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(2)}件と、全国平均
        {avg.toFixed(2)}件を大きく上回りました。
      </p>

      <p style={{ lineHeight: 1.9 }}>
        上位10自治体のうち7つを東京都の特別区(台東区・墨田区・
        千代田区・中央区・中野区・港区・渋谷区)が占めています。
        婚姻件数は結婚した夫婦の居住地をもとに集計されるため、
        単身の若い世代が多く集まる都心の区ほど、人口に対する
        婚姻件数の比率が高くなる傾向があります。子ども人口割合
        ランキングでは目立たない都心区が、婚姻率という切り口
        では上位に並ぶのは興味深い対比です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        一方、下位の自治体の多くは人口5,000人未満の小規模な
        町村です。母数となる人口が小さいため、婚姻件数が
        数件変わるだけで比率が大きく動く点には注意が必要ですが、
        全体として婚姻率が低い地域は、若い世代の人口そのものが
        少ないという、より根本的な課題を映し出しているとも
        言えます。
      </p>
    </section>
  );
}
