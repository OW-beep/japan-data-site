import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import SmallestPopulationSummary from "../../../components/ranking/SmallestPopulationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 人口が少ない自治体ランキング",
  description:
    "全国の市区町村を人口が少ない順にランキング。離島や山村など、日本で最も人口規模の小さな自治体を比較できます。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.population > 0)
    .sort((a, b) => a.population - b.population)
    .slice(0, 50);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        📉 人口が少ない自治体ランキング
      </h1>

      <DataAsOf />

      <MetricBox
        title="指標定義"
        unit="人"
        definition="住民基本台帳ベースの総人口が少ない順に並べたランキング"
        formula="人口が少ない順にソート"
        example={{
          name: `例：${ranking[0].name}`,
          value: ranking[0].population,
        }}
      />

      <SmallestPopulationSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          population: c.population,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population.toLocaleString()}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}
