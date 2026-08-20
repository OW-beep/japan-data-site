import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DivorceRateSummary from "../../../components/ranking/DivorceRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/divorce-rate" },
  title: "全国自治体 離婚率ランキング｜人口千人あたりで比較",
  description:
    "人口千人あたりの離婚件数をランキング形式で比較。西日本の都市部で高く、東北・北陸地方で低いという地域差が見られます。人口規模の小さい自治体では数値が振れやすい点にご注意ください。",
};

export default function DivorceRateRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.divorces != null && c.population >= 3000
  );

  const ranking = base
    .map((c) => ({
      ...c,
      rate: ((c.divorces ?? 0) / c.population) * 1000,
    }))
    .sort((a, b) => b.rate - a.rate)
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
        💔 離婚率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/divorce-rate-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eef2ff",
          color: "#4338ca",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 離婚率ランキング分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit=""
        definition="人口1,000人あたりの離婚件数です。婚姻率ランキングと対になる人口動態統計の1つで、地域の家族構成の変化を示す指標として扱っています。"
        formula="離婚件数 ÷ 人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: Number(ranking[0]?.rate?.toFixed(2) ?? 0),
        }}
        source={dataSources["divorce-rate"]}
      />

      <DivorceRateSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.rate,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.rate.toFixed(2)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
