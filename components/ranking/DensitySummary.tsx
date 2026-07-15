type Row = {
  name: string;
  value: number;
};

export default function DensitySummary({
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

      <h2
        style={{
          marginTop: 0,
          fontSize: 24,
        }}
      >
        人口密度ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        人口密度は、1平方キロメートルあたりに何人住んでいるかを表す
        指標です。数値が高いほど都市部、低いほど郊外・山間部の
        傾向があります。今回のランキングでは
        <strong>{ranking[0].name}</strong>
        が1平方キロメートルあたり
        {ranking[0].value.toLocaleString()}人で最も高く、
        10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toLocaleString()}人/km²と、
        上位には東京都特別区や大都市中心部が多く、
        面積が小さく人口が集中する自治体が目立ちます。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        なお、横浜市・大阪市など政令指定都市の「区」は独立した自治体
        ではないため、このランキングには含めていません（各市のページに
        区ごとの内訳を掲載しています）。一方、東京都の特別区（千代田区
        など）は法律上独立した地方公共団体のため、他の市町村と同様に
        ランキングの対象としています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {avg.toFixed(0)}人/km²</strong>
        です。
      </p>
    </section>
  );
}
