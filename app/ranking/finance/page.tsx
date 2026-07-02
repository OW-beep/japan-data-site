import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function FinanceRankingPage() {
  const ranking = [...cities]
    .filter(
      (c: any) =>
        c.financeIndex != null &&
        !Number.isNaN(c.financeIndex)
    )
    .sort(
      (a: any, b: any) =>
        (b.financeIndex ?? 0) -
        (a.financeIndex ?? 0)
    )
    .slice(0, 100);

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        財政力指数ランキング
      </h1>

      <MetricBox
        title="財政力指数とは？"
        unit=""
        definition="自治体が自前の税収でどれだけ行政サービスを賄えるかを表す指標です。"
        formula="基準財政収入額 ÷ 基準財政需要額"
        example={{
          name: "目安",
          value: "1.00以上 → 地方交付税に依存しない財政力",
        }}
      />

      <div style={{ marginTop: 24 }}>
        {ranking.map((city: any, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.financeIndex.toFixed(2)}
            unit=""
          />
        ))}
      </div>

      <section
        style={{
          marginTop: 48,
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          ランキングの見方
        </h2>

        <ul
          style={{
            lineHeight: 2,
            color: "#374151",
          }}
        >
          <li>
            財政力指数が<strong>1.00以上</strong>の自治体は、地方交付税に頼らず行政運営できる財政力があります。
          </li>

          <li>
            数値が高いほど税収基盤が強い自治体です。
          </li>

          <li>
            数値が低い自治体ほど地方交付税への依存度が高くなります。
          </li>

          <li>
            本ランキングは e-Stat 公開データを利用しています。
          </li>
        </ul>
      </section>
    </main>
  );
}