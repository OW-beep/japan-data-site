import Link from "next/link";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import PopulationSummary from "../../../components/ranking/PopulationSummary";

import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
    // 東京都特別区除外
    .filter(
      (city) =>
        !(city.code >= "13101" && city.code <= "13123")
    )
    .sort((a, b) => b.population - a.population);

  const top50 = ranking.slice(0, 50);

  const average =
    ranking.reduce((sum, c) => sum + c.population, 0) /
    ranking.length;

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
        全国自治体 人口ランキング
      </h1>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        全国の自治体人口をランキング形式で掲載しています。
        <br />
        比較しやすさを考慮し、東京都特別区（23区）はランキング対象外です。
      </p>

      <MetricBox
        title="人口とは？"
        unit="人"
        definition="住民基本台帳をもとにした人口です。"
        formula="人口 = 住民登録人口"
        example={{
          name: top50[0].name,
          value: top50[0].population,
        }}
      />

      <PopulationSummary
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
            value={city.population}
            unit="人"
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
          <Link href="/ranking/birth-rate">
            出生率ランキング
          </Link>

          <Link href="/ranking/aging">
            高齢化率ランキング
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