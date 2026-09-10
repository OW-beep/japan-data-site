import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getElderlySupportScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/elderly-support-composite" },
  title: "高齢者支援体制スコア ランキング｜医師数・老人ホーム・独居率を統合",
  description:
    "高齢化率TOP300自治体を対象に、医師数・老人ホーム定員・独居高齢者率を統合した「高齢者支援体制スコア」でランキングしました。",
};

export default function ElderlySupportRankingPage() {
  const ranking = getElderlySupportScores();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏥 高齢者支援体制スコア ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/elderly-support-composite"
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
        📖 高齢者支援体制スコアの解説記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        高齢化率TOP300の自治体を対象に、医師数・老人ホーム定員・独居高齢者率を
        Zスコア化して合算した、本サイト独自の複合指数です。数値が高いほど支援体制が
        手厚いことを示します。
      </p>

      <AdSense />

      <RankingInsightFAQ
        metricName="高齢者支援体制スコア"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: c.score.toFixed(2),
        }))}
        topNote="医師数・老人ホーム定員・独居高齢者率を統合したスコアが最も高く、高齢者の支援体制が手厚いことを示します。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.score.toFixed(2)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
