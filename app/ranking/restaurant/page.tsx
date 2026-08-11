import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import RestaurantSummary from "../../../components/ranking/RestaurantSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/restaurant" },
  title: "全国自治体 飲食店密度ランキング｜オフィス街と温泉地が上位に",
  description:
    "全国自治体の人口1,000人あたり飲食店数をランキング形式で比較。東京都心のオフィス街と、箱根町・白馬村など観光地・温泉地が上位を占める理由を解説します。",
};

export default function RestaurantRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.restaurantCount != null &&
        c.restaurantCount > 0 &&
        c.population >= 3000
    )
    .map((c) => ({
      ...c,
      restaurantPer1000: ((c.restaurantCount ?? 0) / c.population) * 1000,
    }))
    .sort((a, b) => b.restaurantPer1000 - a.restaurantPer1000)
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
        🍜 飲食店密度ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/restaurant-density"
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
        📖 分析記事「オフィス街と温泉地が上位」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="店"
        definition="人口1,000人あたりの飲食店数です。オフィス街や観光地では、住民登録人口に対して昼間人口や来訪者数がはるかに多いため、値が高くなる傾向があります。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="飲食店数 ÷ 総人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.restaurantPer1000?.toFixed(1) ?? "0.0"}`,
        }}
      />

      <RestaurantSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.restaurantPer1000,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.restaurantPer1000.toFixed(1)}
            unit="店"
          />
        ))}
      </div>
    </main>
  );
}
