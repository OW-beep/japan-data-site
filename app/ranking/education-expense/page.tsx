import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import EducationExpenseSummary from "../../../components/ranking/EducationExpenseSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/education-expense" },
  title: "全国自治体 教育費ランキング｜住民一人あたりで比較",
  description:
    "住民一人あたりの教育費(小中学校の運営・整備等にかかる支出)をランキング形式で比較。学校の統廃合コストや施設更新の負担が大きい自治体ほど、一人あたりの金額が高くなる傾向があります。",
};

export default function EducationExpenseRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.educationExpense != null &&
        c.population > 0 &&
        c.population >= 3000
    )
    .map((c) => ({
      ...c,
      perCapita: ((c.educationExpense ?? 0) * 1000) / c.population,
    }))
    .sort((a, b) => b.perCapita - a.perCapita)
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
        🏫 教育費ランキング(住民一人あたり)
      </h1>

      <DataAsOf />

      <a
        href="/articles/education-expense-analysis"
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
        📖 教育費ランキング分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="円"
        definition="小中学校の運営・施設整備等にかかる教育費の決算額を、住民一人あたりに換算した金額です。人口3,000人未満の自治体は数値が不安定になるため対象から除外しています。"
        formula="教育費(千円) × 1,000 ÷ 人口"
        example={{
          name: ranking[0]?.name ?? "",
          value: Math.round(ranking[0]?.perCapita ?? 0),
        }}
      />

      <EducationExpenseSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.perCapita,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={Math.round(city.perCapita).toLocaleString()}
            unit="円"
          />
        ))}
      </div>
    </main>
  );
}
