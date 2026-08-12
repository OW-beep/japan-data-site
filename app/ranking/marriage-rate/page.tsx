import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import MarriageRateSummary from "../../../components/ranking/MarriageRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/marriage-rate" },
  title: "全国自治体 婚姻率ランキング｜東京都心の区がなぜ上位に",
  description:
    "全国自治体の人口1,000人あたり婚姻件数(婚姻率)をランキング形式で比較。台東区・墨田区など東京都心の特別区が上位を占める理由を解説します。",
};

export default function MarriageRateRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.marriages != null &&
        !Number.isNaN(c.marriages) &&
        c.population >= 3000
    )
    .map((c) => ({
      ...c,
      marriageRate: ((c.marriages ?? 0) / c.population) * 1000,
    }))
    .sort((a, b) => b.marriageRate - a.marriageRate)
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
        💍 婚姻率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/marriage-rate-analysis"
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
        📖 分析記事「都心と郊外でなぜ差が出るのか」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="件"
        definition="人口1,000人あたりの年間婚姻件数です。値が高いほど、人口に対して結婚した夫婦の数が多いことを意味します。人口3,000人未満の自治体は、母数が小さく数値が不安定になるため対象から除外しています。"
        formula="婚姻件数 ÷ 総人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.marriageRate?.toFixed(2) ?? "0.00"}`,
        }}
      source={dataSources["marriage-rate"]}
      />

      <MarriageRateSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.marriageRate,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.marriageRate.toFixed(2)}
            unit="件"
          />
        ))}
      </div>
    </main>
  );
}
