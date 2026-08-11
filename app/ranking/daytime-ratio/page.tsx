import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import DaytimeRatioSummary from "../../../components/ranking/DaytimeRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/daytime-ratio" },
  title: "全国自治体 昼夜間人口比率ランキング｜千代田区は1355%",
  description:
    "夜間人口(常住人口)に対する昼間人口の割合(昼夜間人口比率)をランキング形式で比較。通勤・通学による人口移動の実態がわかります。",
};

export default function DaytimeRatioRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.daytimePopulation != null &&
        c.nighttimePopulation != null &&
        c.nighttimePopulation > 0
    )
    .map((c) => ({
      ...c,
      daytimeRatio: ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100,
    }))
    .sort((a, b) => b.daytimeRatio - a.daytimeRatio)
    .slice(0, 100);

  return (
    <main
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
        🌆 昼夜間人口比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/daytime-ratio-analysis"
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
        📖 分析記事「千代田区が1355%になる理由」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="夜間人口(常住人口)に対する昼間人口の割合です。100%を超えるほど、通勤・通学で流入する人が流出する人より多いことを意味します。令和2年(2020年)国勢調査に基づきます。"
        formula="昼間人口 ÷ 夜間人口 × 100"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.daytimeRatio?.toFixed(1) ?? "0.0"}`,
        }}
      />

      <DaytimeRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.daytimeRatio,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.daytimeRatio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </main>
  );
}
