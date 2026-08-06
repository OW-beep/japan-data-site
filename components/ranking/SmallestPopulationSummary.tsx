type Row = {
  name: string;
  population: number;
};

export default function SmallestPopulationSummary({
  ranking,
}: {
  ranking: Row[];
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
        人口が最も少ない自治体ランキングから見える傾向
      </h2>

      <p style={{ lineHeight: 1.9 }}>
        全国で最も人口が少ないのは<strong>{ranking[0].name}</strong>
        で、{ranking[0].population.toLocaleString()}
        人です。10位の<strong>{tenth.name}</strong>
        でも{tenth.population.toLocaleString()}
        人と、いずれも1,000人に満たない小さな自治体が並んで
        います。上位には東京都の離島(青ヶ島村など)や、
        鹿児島県・沖縄県の離島村が多く、本土から離れた
        地理的条件が、人口規模の小ささと結びついている
        ことがうかがえます。
      </p>

      <p style={{ lineHeight: 1.9, marginBottom: 0 }}>
        人口が少ない自治体も、独自の産業や自然環境を活かして
        地域を維持しています。人口の多さだけが自治体の価値を
        決めるわけではないことは、
        <a href="/ranking/tax-ratio" style={{ color: "#1d4ed8" }}>
          地方税自主財源比率ランキング
        </a>
        など、他の指標もあわせて見ることで見えてきます。
      </p>
    </section>
  );
}
