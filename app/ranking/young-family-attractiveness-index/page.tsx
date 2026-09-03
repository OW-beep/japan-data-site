import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getYoungFamilyAttractivenessScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/young-family-attractiveness-index" },
  title: "子育て世代吸引力指数 ランキング｜保育・移住・婚姻を統合",
  description:
    "保育所定員・20代純移動率・婚姻率を統合した「子育て世代吸引力指数」の全自治体ランキングです。",
};

export default function YoungFamilyRankingPage() {
  const ranking = getYoungFamilyAttractivenessScores().slice(0, 100);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        👨‍👩‍👧 子育て世代吸引力指数 ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/young-family-attractiveness-index"
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
        📖 子育て世代吸引力指数の解説記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        保育所定員・20代純移動率・婚姻率をZスコア化して合算した、本サイト独自の
        複合指数です。
      </p>

      <AdSense />

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
