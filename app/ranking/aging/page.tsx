import Link from "next/link";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import AgingSummary from "../../../components/ranking/AgingSummary";

import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.elderlyPopulation && c.population)
    .map((c) => ({
      ...c,
      rate:
        (c.elderlyPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate);

  const top50 = ranking.slice(0, 50);

  const average =
    ranking.reduce(
      (sum, c) => sum + c.rate,
      0
    ) / ranking.length;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        全国自治体 高齢化率ランキング
      </h1>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国自治体の高齢化率を比較しています。
        高齢化率は65歳以上人口が総人口に占める割合です。
      </p>

      <MetricBox
        title="高齢化率とは？"
        definition="総人口に占める65歳以上人口の割合"
        unit="%"
        formula="高齢化率 = 高齢者人口 ÷ 総人口 ×100"
        example={{
          name: top50[0].name,
          value: Number(
            top50[0].rate.toFixed(2)
          ),
        }}
      />

      <AgingSummary
        average={average}
        cityCount={ranking.length}
      />

      <div
        style={{
          marginTop: 40,
        }}
      >
        {top50.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <section
        style={{
          marginTop: 60,
        }}
      >
        <h2>関連ランキング</h2>

        <div
          style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <Link href="/ranking/population">
            人口ランキング
          </Link>

          <Link href="/ranking/birth-rate">
            出生率ランキング
          </Link>

          <Link href="/ranking/child">
            子ども人口ランキング
          </Link>

          <Link href="/ranking/density">
            人口密度ランキング
          </Link>
        </div>
      </section>
    </main>
  );
}