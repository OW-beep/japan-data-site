import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HouseholdSizeSummary from "../../../components/ranking/HouseholdSizeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/household-size" },
  title: "全国自治体 平均世帯人員ランキング",
  description:
    "全国自治体の平均世帯人員(1世帯あたりの人数)をランキング形式で比較。3世代同居が多い東北の農村部と、単身世帯が多い都市部の違いを解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.households != null && c.households > 0)
    .map((c) => ({
      ...c,
      avgSize: c.population / (c.households ?? 1),
    }))
    .sort((a, b) => b.avgSize - a.avgSize)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.avgSize, 0) / ranking.length;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        👨‍👩‍👧‍👦 平均世帯人員ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/household-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eff6ff",
          color: "#1d4ed8",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 世帯データランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口を世帯数で割った、1世帯あたりの平均人数"
        formula="平均世帯人員 = 総人口 ÷ 総世帯数"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].avgSize.toFixed(2)),
        }}
      source={dataSources["household-size"]}
      />

      <HouseholdSizeSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          avgSize: c.avgSize,
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
            value={c.avgSize.toFixed(2)}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}
