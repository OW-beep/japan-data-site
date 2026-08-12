import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import ForeignPopulationSummary from "../../../components/ranking/ForeignPopulationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/foreign-population" },
  title: "全国自治体 外国人人口比率ランキング",
  description:
    "全国自治体の人口に占める外国人住民の割合をランキング形式で比較。農業・製造業の担い手として外国人労働者が多い町から、多国籍化が進む都心の区まで紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) => c.foreignPopulation != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      ratio: ((c.foreignPopulation ?? 0) / c.population) * 100,
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.ratio, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🌏 外国人人口比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/foreign-population"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fefce8",
          color: "#a16207",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 外国人人口比率ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="人口に占める外国人住民の割合"
        formula="外国人人口比率 = 外国人人口 ÷ 総人口 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].ratio.toFixed(1)),
        }}
      source={dataSources["foreign-population"]}
      />

      <ForeignPopulationSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          ratio: c.ratio,
        }))}
        average={average}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.ratio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </div>
  );
}
