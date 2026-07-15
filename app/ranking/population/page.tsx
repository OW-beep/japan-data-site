import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import PopulationSummary from "../../../components/ranking/PopulationSummary";
import AdSense from "../../../components/AdSense";

import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 人口ランキング【最新版】",
  description:
    "全国の市区町村の人口を多い順にランキング。政令指定都市・県庁所在地から町村まで、住民基本台帳ベースの最新人口データを比較できます。",
  openGraph: {
    title: "全国自治体 人口ランキング【最新版】",
    description:
      "全国の市区町村の人口を多い順にランキング。住民基本台帳ベースの最新データで比較。",
  },
};

export default function Page() {
  const ranking = getMunicipalities().sort(
    (a, b) => b.population - a.population
  );

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
        東京都の特別区(千代田区など)は独立した自治体として個別に、
        政令指定都市の区(横浜市港北区など)は市の内訳として、各市のページに掲載しています。
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
        top3={top50.slice(0, 3).map((c) => ({
          name: c.name,
          population: c.population,
        }))}
      />

      <AdSense />

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