import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getIndustryDiversityScores } from "../../../lib/compositeScores";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          産業の集中度(HHI)が最も高いのは千代田区と草津町で、どちらも第3次産業が就業者の91.3%を占めます。都心のオフィス街と温泉観光の町は性格こそ違いますが、「1つの産業への特化」という点では同じ姿です。上位には渋谷区、港区、新宿区と都心が続きます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          逆に集中度が低い(産業が分散している)のは鮭川村(0.35)、鹿部町(0.35)、横浜町(0.34)で、第1次から第3次までが分散した農村・漁村です。産業への集中は専門性と効率の裏返しであり、分散は景気の波への強さと表裏一体です。どちらが良いかではなく、地域経済の「形」の違いとして読む指標です。
        </p>
      </RankingEditorial>

      <AdSense />

      <RankingInsightFAQ
        metricName="産業多様性指数"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.score.toFixed(3)}(${c.dominantLabel}${c.dominantShare.toFixed(0)}%)`,
        }))}
        topNote="特定の産業に偏らず、幅広い産業がバランス良く存在していることを示します。"
      />

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

      <RankingCommentary slug="industry-diversity-index" />

    </main>
  );
}
