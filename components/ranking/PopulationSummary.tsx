type Props = {
  average: number;
  cityCount: number;
  top3?: { name: string; population: number }[];
};

export default function PopulationSummary({
  average,
  cityCount,
  top3,
}: Props) {
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

      <h2
        style={{
          marginTop: 0,
          fontSize: 24,
        }}
      >
        ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        全国{cityCount.toLocaleString()}自治体を比較すると、
        人口上位には政令指定都市や県庁所在地が多く並びます。
        {top3 && top3.length >= 3 && (
          <>
            {" "}
            今回のランキングでは
            <strong>{top3[0].name}</strong>が
            {top3[0].population.toLocaleString()}人で1位、
            続いて<strong>{top3[1].name}</strong>
            {top3[1].population.toLocaleString()}人、
            <strong>{top3[2].name}</strong>
            {top3[2].population.toLocaleString()}人という結果でした。
          </>
        )}
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        大都市では交通・教育・雇用が集中するため人口が集まりやすく、
        一方で地方では人口減少が進んでいる自治体も少なくありません。
        上位の自治体は、鉄道網や高速道路網が発達し、周辺市町村から
        通勤・通学者を吸収できる立地にあることが多く、単純な面積の
        大きさよりも、経済圏の中心であるかどうかがランキングを左右しています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均人口は
        <strong>
          {" "}
          {Math.round(average).toLocaleString()}人
        </strong>
        です。上位の自治体は平均を大きく上回る一方、大半の自治体は
        平均を下回っており、人口分布には大きな偏りがあることが分かります。
      </p>
    </section>
  );
}