import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getYoungFamilyAttractivenessScores } from "../../../lib/compositeScores";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          保育の受け皿、20代の純移動、婚姻の動きを合成した子育て世代吸引力指数では、墨田区、中央区、台東区、千代田区、品川区と東京の区が上位を占めました。保育環境と若い世代の転入が重なる地域が評価される設計で、都心に子育て世代が戻る動きを映しています。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方、下位には一宮町、白子町、岬町といった沿岸の町が並びます。この指数は相対的なスコアで、保育環境そのものは<a href="/ranking/daycare" style={{ color: "#2563eb" }}>保育所のランキング</a>など個別の指標でも確認できます。数字の背景にある「人の動き」とあわせて読むと、地域の将来像が見えてきます。
        </p>
      </RankingEditorial>

      <AdSense />

      <RankingInsightFAQ
        metricName="子育て世代吸引力指数"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.score.toFixed(2)}`,
        }))}
        topNote="保育・移住・婚姻に関する指標を統合したスコアが最も高く、子育て世代にとって魅力的な条件が揃っていることを示します。"
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

      <RankingCommentary slug="young-family-attractiveness-index" />

    </main>
  );
}
