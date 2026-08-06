type Row = {
  name: string;
  avgSize: number;
};

export default function HouseholdSizeSummary({
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
          background: "#ede9fe",
          color: "#6d28d9",
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
        平均世帯人員ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        平均世帯人員は、人口を世帯数で割った「1世帯あたりの
        平均人数」です。今回のランキングでは
        <strong>{ranking[0].name}</strong>
        が{ranking[0].avgSize.toFixed(2)}
        人で最も多く、10位の<strong>{tenth.name}</strong>
        でも{tenth.avgSize.toFixed(2)}
        人と、全国平均を大きく上回っています。上位には
        山形県・秋田県・宮城県など東北地方の農村部が数多く
        並び、祖父母・親・子の3世代が同居する伝統的な世帯
        構成が今も残っていることがうかがえます。実際、
        総務省の統計でも山形県は都道府県別の3世代同居率が
        全国トップクラスであることが知られています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        逆に平均世帯人員が少ない自治体は、東京都心の特別区
        (単身の若年層やDINKs世帯の集中)と、東日本大震災の
        被災地域(単身赴任の作業員や、家族と離れて仮設・
        復興住宅に暮らす住民)に分かれます。同じ「世帯人員が
        少ない」でも、都市部と被災地では背景がまったく
        異なります。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {average.toFixed(2)}人</strong>
        です。
      </p>
    </section>
  );
}
