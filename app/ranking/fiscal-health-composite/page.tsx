import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { getFiscalHealthScores } from "../../../lib/compositeScores";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RakutenGifts from "../../../components/RakutenGifts";
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
        対象は、人口3,000人以上で4指標が揃う1,552自治体です。
      </p>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          スコアは「平均的な自治体が0前後」になるよう標準化した相対値で、
          対象1,552自治体の中央値は−0.34です。上位20自治体のうち17は
          財政力指数が1.0以上で、4指標の中でも「自前の税収の厚み」が
          スコアを大きく左右していることが分かります。上位には
          愛知県飛島村(14.68)のような税源の偏在する町村に加え、
          製造業の集積する愛知県豊田市(10.36)のような大規模都市も
          入っています。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          注意したいのは両端の突出です。1位の飛島村14.68と最下位の
          北海道夕張市−23.80は、2位以下との差が大きく開いた外れ値で、
          スコアの差がそのまま財政の差の大きさを表すわけでは
          ありません。スコアはあくまで相対的な位置の目安として、
          元になった
          <a href="/ranking/finance" style={{ color: "#2563eb" }}>
            財政力指数
          </a>
          など4指標そのものとあわせてご覧ください。計算方法の詳細は
          <a href="/methodology" style={{ color: "#2563eb" }}>
            データの出典と算出方法
          </a>
          にまとめています。
        </p>
      </RankingEditorial>

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

      <RankingCommentary slug="fiscal-health-composite" />

      {/* 自治体の財政に関心を持った人向けに、ふるさと納税の返礼品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="ふるさと納税 返礼品"
        heading="楽天市場でふるさと納税の返礼品を見る"
        hits={5}
      />

    </main>
  );
}
