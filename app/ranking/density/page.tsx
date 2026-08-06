import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import DensitySummary from "../../../components/ranking/DensitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 人口密度ランキング",
  description:
    "全国自治体の人口密度(1平方キロメートルあたりの人口)をランキング形式で比較。都市部の過密と地方の過疎の差がわかります。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.populationDensity != null)
    .sort(
      (a, b) =>
        (b.populationDensity ?? 0) -
        (a.populationDensity ?? 0)
    )
    .slice(0, 50);

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
        🏙️ 人口密度ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/density-analysis"
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
        📖 なぜ東京都特別区が上位を独占するのか、分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口密度は1平方キロメートルあたりの人口です。"
        formula="人口密度 = 人口 ÷ 面積"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.populationDensity ?? 0,
        }}
      />

      <DensitySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.populationDensity ?? 0,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.populationDensity ?? 0}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}