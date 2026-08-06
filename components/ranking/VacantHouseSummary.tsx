type Row = {
  name: string;
  value: number;
};

export default function VacantHouseSummary({
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
        空き家率ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国平均の空き家率は
        {avg.toFixed(1)}
        %でしたが、1位の<strong>{ranking[0].name}</strong>
        は{ranking[0].value.toFixed(1)}
        %、10位の<strong>{tenth.name}</strong>
        でも{tenth.value.toFixed(1)}
        %と、平均の3〜5倍近い水準でした。上位の顔ぶれを
        見ると、軽井沢町・那須町・熱海市・北杜市・白浜町
        といった別荘地・観光地と、夕張市・三笠市・歌志内市
        といった旧産炭地の町が混在しています。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        同じ「空き家率が高い」でも、別荘地は所有者が
        別にいて年に数回しか使わない「二次的住宅」が
        多くを占めるのに対し、旧産炭地の町は本当に
        住む人がいなくなった「放置空き家」が中心と
        考えられ、性質はまったく異なります。この統計
        だけでは両者を区別できないため、詳しくは
        分析記事もあわせてご覧ください。
      </p>
    </section>
  );
}
