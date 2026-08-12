import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DaycareSummary from "../../../components/ranking/DaycareSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/daycare" },
  title: "全国自治体 保育園あたり子ども人口ランキング｜保育の余裕度",
  description:
    "全国自治体の保育園1施設あたりの子ども人口をランキング形式で比較。数字が小さいほど、子どもの数に対して保育施設に余裕があることを意味します。データ上の注意点もあわせて解説します。",
};

export default function DaycareRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.daycareCount != null &&
        c.daycareCount > 0 &&
        c.childPopulation >= 500
    )
    .map((c) => ({
      ...c,
      childPerDaycare: c.childPopulation / (c.daycareCount ?? 1),
    }))
    .sort((a, b) => a.childPerDaycare - b.childPerDaycare)
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
        🧸 保育園あたり子ども人口ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/daycare-access"
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
        📖 分析記事「東京23区と大阪の差」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="保育園(保育所)1施設あたりの子ども人口(15歳未満人口)です。数字が小さいほど、子どもの数に対して保育施設に余裕があることを意味します。子ども人口500人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="子ども人口(15歳未満) ÷ 保育園数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.childPerDaycare?.toFixed(0) ?? "0"}`,
        }}
      source={dataSources["daycare"]}
      />

      <DaycareSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.childPerDaycare,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.childPerDaycare.toFixed(0)}
            unit="人/施設"
          />
        ))}
      </div>
    </main>
  );
}
