import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getFiscalHealthScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/fiscal-health-composite" },
  title: "財政健全度スコア ランキング｜4指標統合の独自指数",
  description:
    "財政力指数・経常収支比率・自主財源比率・実質公債費比率を統合した、本サイト独自の「財政健全度スコア」の全自治体ランキングです。",
};

export default function FiscalHealthRankingPage() {
  const ranking = getFiscalHealthScores().slice(0, 100);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏅 財政健全度スコア ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/fiscal-health-composite"
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
        📖 財政健全度スコアの解説記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        財政力指数・経常収支比率・自主財源比率・実質公債費比率の4指標をZスコア化して
        合算した、本サイト独自の複合指数です。公式な財政健全度の判定基準ではありません。
      </p>

      <AdSense />

      <RankingInsightFAQ
        metricName="財政健全度スコア"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.score.toFixed(2)}`,
        }))}
        topNote="財政力指数・経常収支比率・自主財源比率・実質公債費比率の4指標を統合したスコアが最も高く、財政基盤が強いことを示します。"
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
