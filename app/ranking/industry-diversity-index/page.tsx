import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getIndustryDiversityScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/industry-diversity-index" },
  title: "産業の多様性指数(HHI) ランキング｜産業集中度を独自算出",
  description:
    "第1次・第2次・第3次産業の就業者比率からハーフィンダール指数(HHI)を算出。値が高いほど特定の産業への一極集中度が高いことを示します。",
};

export default function IndustryDiversityRankingPage() {
  const ranking = getIndustryDiversityScores().slice(0, 100);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏭 産業の多様性指数(HHI) ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/industry-diversity-index"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fef2f2",
          color: "#b91c1c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 産業の多様性指数の解説記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        産業別就業者比率から算出したハーフィンダール・ハーシュマン指数(HHI)です。
        1.0に近いほど特定の産業への一極集中、0.33に近いほどバランス型を示します。
      </p>

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={`${city.score.toFixed(3)}(${city.dominantLabel}${city.dominantShare.toFixed(0)}%)`}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
