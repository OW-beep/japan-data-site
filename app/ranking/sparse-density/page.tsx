import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import SparseDensitySummary from "../../../components/ranking/SparseDensitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/sparse-density" },
  title: "全国自治体 人口密度が低い自治体ランキング",
  description:
    "全国の市区町村を人口密度が低い順にランキング。広大な面積に対して人口が非常に少ない、日本で最も人口が希薄な自治体を比較できます。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.populationDensity != null && c.populationDensity > 0)
    .sort(
      (a, b) => (a.populationDensity ?? 0) - (b.populationDensity ?? 0)
    )
    .slice(0, 50);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏞️ 人口密度が低い自治体ランキング
      </h1>

      <DataAsOf />

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口を面積で割った人口密度が低い順に並べたランキング"
        formula="人口密度が低い順にソート"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number((ranking[0].populationDensity ?? 0).toFixed(1)),
        }}
      source={dataSources["sparse-density"]}
      />

      <SparseDensitySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          density: c.populationDensity ?? 0,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={(c.populationDensity ?? 0).toFixed(1)}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}
