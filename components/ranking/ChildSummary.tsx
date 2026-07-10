type Row = {
  name: string;
  value: number;
};

export default function ChildSummary({
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
        子ども人口割合は、総人口に占める15歳未満人口の割合です。
        子育て世帯の多さを知る一つの目安になります。
      </p>

      <ul
        style={{
          marginTop: 18,
          lineHeight: 2,
        }}
      >
        <li>
          全国平均（TOP50平均）
          <strong>
            {" "}
            {avg.toFixed(2)}%
          </strong>
        </li>

        <li>
          1位：
          <strong>
            {ranking[0].name}
          </strong>
          （{ranking[0].value.toFixed(2)}%）
        </li>

        <li>
          10位：
          <strong>
            {ranking[Math.min(9, ranking.length - 1)].name}
          </strong>
          （
          {ranking[
            Math.min(9, ranking.length - 1)
          ].value.toFixed(2)}
          %）
        </li>

        <li>
          上位自治体では子どもの割合が高く、
          新興住宅地や人口流入が続く地域が多い傾向があります。
        </li>
      </ul>

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