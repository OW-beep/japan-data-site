import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import RetailStoreSummary from "../../../components/ranking/RetailStoreSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 大型小売店数ランキング｜人口1万人あたりで比較",
  description:
    "人口1万人あたりの大型小売店数をランキング形式で比較。1店舗の有無で数値が大きく動く小規模自治体と、買い物難民ランキングとの関係を解説します。",
};

export default function RetailStoreRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.largeRetailStoreCount != null && c.population >= 3000
  );

  const zeroCount = base.filter((c) => c.largeRetailStoreCount === 0).length;

  const ranking = base
    .filter((c) => (c.largeRetailStoreCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      storesPer10k: ((c.largeRetailStoreCount ?? 0) / c.population) * 10000,
    }))
    .sort((a, b) => b.storesPer10k - a.storesPer10k)
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
        🏬 大型小売店数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/shopping-access"
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
        📖 買い物難民ランキング分析記事もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="店"
        definition="人口1万人あたりの大型小売店数です。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="大型小売店数 ÷ 人口 × 10,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.storesPer10k?.toFixed(2) ?? "0.00"}`,
        }}
      />

      <RetailStoreSummary
        zeroCount={zeroCount}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.storesPer10k,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.storesPer10k.toFixed(2)}
            unit="店"
          />
        ))}
      </div>
    </main>
  );
}
