import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import FinanceSummary from "../../../components/ranking/FinanceSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 財政力指数ランキング",
  description:
    "全国自治体の財政力指数をランキング形式で比較。自主財源だけで行政サービスをまかなえる「稼げる自治体」がわかります。",
};

export default function FinanceRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.financeIndex != null &&
        !Number.isNaN(c.financeIndex)
    )
    .sort(
      (a, b) =>
        (b.financeIndex ?? 0) -
        (a.financeIndex ?? 0)
    )
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
        💰 財政力指数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/finance-analysis"
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
        📖 なぜ小さな村が全国トップなのか、分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit=""
        definition="自治体が自前の税収でどれだけ行政サービスを賄えるかを表す指標です。"
        formula="基準財政収入額 ÷ 基準財政需要額"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.financeIndex?.toFixed(2) ??
            "0.00",
        }}
      />

      <FinanceSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.financeIndex ?? 0,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.financeIndex ?? 0).toFixed(2)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}