type Props = {
  totalCount: number;
  bandCounts: { over100: number; band70: number; band50: number };
  designatedCount: number;
  wardCount: number;
  otherCityNames: string[];
  topName: string;
  topPopulation: number;
  lastName: string;
  lastPopulation: number;
  populationShare: number; // 全国人口に占める割合(%)
};

export default function LargeCitySummary({
  totalCount,
  bandCounts,
  designatedCount,
  wardCount,
  otherCityNames,
  topName,
  topPopulation,
  lastName,
  lastPopulation,
  populationShare,
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

      <h2 style={{ marginTop: 0, fontSize: 24 }}>
        人口50万人以上の都市ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        人口50万人以上の自治体は全国で<strong>{totalCount}</strong>
        あり、人口100万人以上が{bandCounts.over100}、70万人台〜90万人台が
        {bandCounts.band70}、50万人台〜60万人台が{bandCounts.band50}
        という内訳です。最大は<strong>{topName}</strong>(
        {topPopulation.toLocaleString()}人)、このランキングの最小は
        {lastName}({lastPopulation.toLocaleString()}人)です。
        これらの自治体だけで全国の市区町村人口の約
        {populationShare.toFixed(0)}%を占めており、人口が一部の大都市に
        集まっている様子が分かります。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        区分別に見ると、政令指定都市が{designatedCount}市、東京都の特別区が
        {wardCount}区で、残りの
        {otherCityNames.length}
        市は政令指定都市ではない都市です
        {otherCityNames.length > 0
          ? `(${otherCityNames.join("・")})`
          : ""}
        。政令指定都市の法律上の指定要件は「人口50万人以上」ですが、
        人口が50万人を超えていても政令指定都市ではない都市があるように、
        指定は人口だけで決まるものではありません。
      </p>
    </section>
  );
}
