import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import PharmacistSummary from "../../../components/ranking/PharmacistSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/pharmacist" },
  title: "全国自治体 薬剤師数ランキング｜人口10万人あたりで比較",
  description:
    "人口10万人あたりの薬剤師数をランキング形式で比較。東京都心区に加え、国立長寿医療研究センター(愛知県大府市)のような大規模医療研究機関を抱える自治体が上位に入っています。",
};

export default function PharmacistRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.pharmacistsCount != null && c.population >= 3000
  );

  const zeroCount = base.filter((c) => c.pharmacistsCount === 0).length;

  const ranking = base
    .filter((c) => (c.pharmacistsCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      per100k: ((c.pharmacistsCount ?? 0) / c.population) * 100000,
    }))
    .sort((a, b) => b.per100k - a.per100k)
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
        💊 薬剤師数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/pharmacist-access-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#f0fdf4",
          color: "#15803d",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 薬剤師数ランキング分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口10万人あたりの薬剤師数です。勤務地ベースの集計のため、大規模な病院・薬局チェーンの本部・研究機関がある自治体に数値が集中する傾向があります。"
        formula="薬剤師数 ÷ 人口 × 100,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: Number(ranking[0]?.per100k?.toFixed(1) ?? 0),
        }}
        source={dataSources.pharmacist}
      />

      <PharmacistSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.per100k,
        }))}
      />

      <AdSense />

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: "#9ca3af",
        }}
      >
        薬剤師数が0人として登録されている自治体が{zeroCount}
        町村あります。
      </p>

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.per100k.toFixed(1)}
            unit="人"
          />
        ))}
      </div>
    </main>
  );
}
