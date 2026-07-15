type Row = {
  name: string;
  value: number;
};

export default function FinanceSummary({
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
        財政力指数は、自治体がどの程度自前の税収だけで行政サービスを
        維持できるかを示す代表的な財政指標です。
      </p>

      <ul
        style={{
          marginTop: 18,
          lineHeight: 2,
        }}
      >
        <li>
          TOP100平均：
          <strong>{avg.toFixed(2)}</strong>
        </li>

        <li>
          1位：
          <strong>{ranking[0].name}</strong>
          （{ranking[0].value.toFixed(2)}）
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
          ）
        </li>

        <li>
          一般的に1.00を超える自治体は、
          地方交付税に依存しない財政運営が可能とされています。
        </li>

        <li>
          都市部や工業・商業が盛んな自治体では
          高い財政力指数となる傾向があります。
        </li>
      </ul>

      <p
        style={{
          lineHeight: 1.9,
          color: "#374151",
          marginTop: 18,
        }}
      >
        財政力指数が高いからといって、住民サービスの水準が
        高いとは限りません。地方交付税は財政力の弱い自治体の
        歳入を補う仕組みのため、指数が低い自治体でも、
        制度を通じて一定の行政サービス水準が維持されています。

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