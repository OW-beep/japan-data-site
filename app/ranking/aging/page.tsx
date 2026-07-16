import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import AgingSummary from "../../../components/ranking/AgingSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";

import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 高齢化率ランキング【最新版】",
  description:
    "全国自治体の高齢化率(65歳以上人口の割合)をランキング形式で比較。地方と都市部の差、高齢化が進む自治体の特徴がわかります。",
};

export default function Page() {
  const ranking = getMunicipalities()
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

      <DataAsOf />

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
        top3={top50.slice(0, 3).map((c) => ({
          name: c.name,
          rate: c.rate,
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