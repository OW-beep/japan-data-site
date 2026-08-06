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
        財政力指数ランキングから見える傾向
      </h2>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        財政力指数は、自治体がどの程度自前の税収だけで行政サービスを
        維持できるかを示す代表的な財政指標です。今回のランキングでは
        <strong>{ranking[0].name}</strong>
        が{ranking[0].value.toFixed(2)}で最も高く、10位の
        <strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(2)}と、一般的に1.00を超える
        自治体は、地方交付税に依存しない財政運営が可能とされています。
        都市部や工業・商業が盛んな自治体では高い財政力指数となる
        傾向があります。
      </p>

      <p
        style={{
          lineHeight: 1.9,
        }}
      >
        財政力指数が高いからといって、住民サービスの水準が
        高いとは限りません。地方交付税は財政力の弱い自治体の
        歳入を補う仕組みのため、指数が低い自治体でも、
        制度を通じて一定の行政サービス水準が維持されています。
      </p>

      <p
        style={{
          lineHeight: 1.9,
          marginBottom: 0,
        }}
      >
        全国平均（対象自治体平均）は
        <strong> {avg.toFixed(2)}</strong>
        です。
      </p>
    </section>
  );
}
