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

  return (
    <section
      style={{
        margin: "32px 0",
        padding: 24,
        background: "#f8fafc",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          fontSize: 24,
          marginBottom: 18,
        }}
      >
        運営者コメント
      </h2>

      <p
        style={{
          lineHeight: 1.9,
          color: "#374151",
        }}
      >
        人口密度は、1平方キロメートルあたりに何人住んでいるかを表す指標です。
        数値が高いほど都市部、低いほど郊外・山間部の傾向があります。
      </p>

      <ul
        style={{
          marginTop: 18,
          lineHeight: 2,
        }}
      >
        <li>
          TOP50平均：
          <strong>{avg.toFixed(0)} 人/km²</strong>
        </li>

        <li>
          1位：
          <strong>{ranking[0].name}</strong>
          （{ranking[0].value.toLocaleString()} 人/km²）
        </li>

        <li>
          10位：
          <strong>
            {ranking[Math.min(9, ranking.length - 1)].name}
          </strong>
          （
          {ranking[
            Math.min(9, ranking.length - 1)
          ].value.toLocaleString()}
          人/km²）
        </li>

        <li>
          上位には東京都特別区や大都市中心部が多く、
          面積が小さく人口が集中する自治体が目立ちます。
        </li>
      </ul>

      <p
        style={{
          lineHeight: 1.9,
          color: "#374151",
          marginTop: 18,
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
          marginTop: 18,
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        ※本コメントは公開データをもとに運営者が作成しています。
      </p>
    </section>
  );
}