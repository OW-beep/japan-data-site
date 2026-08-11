import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import RetailAccessSummary from "../../../components/ranking/RetailAccessSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/retail-access" },
  title: "全国自治体 高齢者あたり小売店数ランキング",
  description:
    "高齢者人口1,000人あたりの小売店数が少ない自治体をランキング。「買い物難民」問題の実態を、都市近郊のニュータウンを中心に紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.retailStoreCount != null &&
        c.elderlyPopulation != null &&
        c.elderlyPopulation > 0 &&
        c.population > 5000
    )
    .map((c) => ({
      ...c,
      per1000elderly:
        ((c.retailStoreCount ?? 0) / (c.elderlyPopulation ?? 1)) *
        1000,
    }))
    .sort((a, b) => a.per1000elderly - b.per1000elderly)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.per1000elderly, 0) /
    ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🛒 高齢者あたり小売店数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/shopping-access"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fff7ed",
          color: "#c2410c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 買い物難民問題の分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="店"
        definition="高齢者(65歳以上)人口1,000人あたりの小売店数。人口5,000人以上の自治体が対象"
        formula="高齢者あたり小売店数 = 小売店数 ÷ 高齢者人口 × 1,000"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].per1000elderly.toFixed(1)),
        }}
      />

      <RetailAccessSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          per1000elderly: c.per1000elderly,
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
            value={c.per1000elderly.toFixed(1)}
            unit="店"
          />
        ))}
      </div>
    </div>
  );
}
