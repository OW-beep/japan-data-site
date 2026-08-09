import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import YoungAdultMigrationSummary from "../../../components/ranking/YoungAdultMigrationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 20代純移動率ランキング｜若者に選ばれる街は？",
  description:
    "人口1,000人あたりの20代(20〜29歳)純移動数をランキング形式で比較。2025年の最新データで、進学・就職を機に若者がどこへ移動しているかがわかります。",
};

export default function YoungAdultMigrationRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.youngAdultNetMigration != null && c.population >= 3000
  );

  const positiveCount = base.filter(
    (c) => (c.youngAdultNetMigration ?? 0) > 0
  ).length;

  const ranking = base
    .map((c) => ({
      ...c,
      rate: ((c.youngAdultNetMigration ?? 0) / c.population) * 1000,
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
        🎒 20代純移動率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/young-adult-migration-analysis"
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
        📖 分析記事「若者に選ばれる街」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit=""
        definition="人口1,000人あたりの20代(20〜24歳+25〜29歳)純移動数(転入者数-転出者数)です。2025年の住民基本台帳人口移動報告に基づきます。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="20代純移動数 ÷ 人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.rate?.toFixed(1) ?? "0.0"}`,
        }}
      />

      <YoungAdultMigrationSummary
        positiveCount={positiveCount}
        totalCount={base.length}
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
            value={city.rate.toFixed(1)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
