type Props = {
  average: number;
  cityCount: number;
};

export default function PopulationSummary({
  average,
  cityCount,
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
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        大都市では交通・教育・雇用が集中するため人口が集まりやすく、
        一方で地方では人口減少が進んでいる自治体も少なくありません。
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
        です。
      </p>
    </section>
  );
}