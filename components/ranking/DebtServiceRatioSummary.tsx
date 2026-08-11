type Row = {
  name: string;
  value: number;
};

export default function DebtServiceRatioSummary({
  ranking,
}: {
  ranking: Row[];
}) {
  if (ranking.length === 0) return null;

  const avg = ranking.reduce((s, r) => s + r.value, 0) / ranking.length;
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
          background: "#fee2e2",
          color: "#b91c1c",
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
        実質公債費比率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        実質公債費比率は、全国平均{avg.toFixed(1)}%に対し、
        1位の<strong>{ranking[0].name}</strong>は
        {ranking[0].value.toFixed(1)}%、10位の
        <strong>{tenth.name}</strong>でも{tenth.value.toFixed(1)}%
        と、過去の借金返済が財政を圧迫している状況がうかがえます。
        18%を超えると起債に都道府県の許可が必要になり、25%を
        超えると「早期健全化団体」に指定される基準です。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        逆にマイナスの数値になっている自治体もあり、これは
        積立金の運用収入などが負担額を上回っていることを示します。
        経常収支比率(財政の余裕度)とあわせて見ることで、
        「借金の多さ」と「日々の運営の余裕のなさ」という、
        別々の財政課題を切り分けて把握できます。
      </p>
    </section>
  );
}
