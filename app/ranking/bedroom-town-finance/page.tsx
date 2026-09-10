import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getBedroomTownFinanceScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/bedroom-town-finance" },
  title: "ベッドタウン財政力ランキング｜昼夜間人口比率×財政力指数",
  description:
    "昼夜間人口比率が低い(ベッドタウン度が高い)順に、財政力指数とあわせて比較。雇用を生まなくても財政力の高い「豊かなベッドタウン」を見つけられます。",
};

export default function BedroomTownFinanceRankingPage() {
  const ranking = getBedroomTownFinanceScores().slice(0, 100);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏘️ ベッドタウン財政力ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/bedroom-town-finance-analysis"
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
        📖 「豊かなベッドタウン」分析記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        昼夜間人口比率が低い(ベッドタウン度が高い)順に並べ、あわせて財政力指数を
        表示しています。財政力指数が高いほど、雇用を生まなくても税収基盤が強い
        「豊かなベッドタウン」であることを示します。
      </p>

      <AdSense />

      <RankingInsightFAQ
        metricName="ベッドタウン財政力スコア"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `昼夜比${c.dayNightRatio.toFixed(1)} / 財政力${c.score.toFixed(2)}`,
        }))}
        topNote="昼夜間人口比率が低い(通勤で人口が流出する)にもかかわらず、財政力指数が高いことを示します。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={`昼夜比${city.dayNightRatio.toFixed(1)} / 財政力${city.score.toFixed(2)}`}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
