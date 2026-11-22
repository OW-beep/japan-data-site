import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import ManufacturingSummary from "../../../components/ranking/ManufacturingSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/manufacturing" },
  title: "全国自治体 第2次産業(製造業・建設業など)就業者比率ランキング",
  description:
    "全国自治体の就業者に占める第2次産業(製造業・建設業など)の割合をランキング形式で比較。ファナックやSUBARU、トヨタ系部品メーカーなど、特定企業が地域経済を支える「ものづくりの町」を紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.primaryIndustryWorkers != null &&
        c.secondaryIndustryWorkers != null &&
        c.tertiaryIndustryWorkers != null
    )
    .map((c) => {
      const total =
        (c.primaryIndustryWorkers ?? 0) +
        (c.secondaryIndustryWorkers ?? 0) +
        (c.tertiaryIndustryWorkers ?? 0);
      return {
        ...c,
        share:
          total > 0
            ? ((c.secondaryIndustryWorkers ?? 0) / total) * 100
            : 0,
      };
    })
    .filter((c) => c.share > 0)
    .sort((a, b) => b.share - a.share)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.share, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏭 第2次産業(製造業・建設業など)就業者比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/industry-structure"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eef2ff",
          color: "#4338ca",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 産業構造分析の記事を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          第2次産業(製造業・建設業など)の就業者比率の中央値は25.1%です。50%を超えるのは忍野村(53.6%)、大泉町(51.6%)、高浜市(51.1%)など4自治体だけで、大規模な工場を抱える自治体が並びます。40%以上の自治体も74にとどまり、「ものづくりの街」は全国的には少数派です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          上位には浪江町(51.4%)のように、復興事業を含む建設業が比率を押し上げている例もあります。第2次産業は製造業と建設業を合わせた区分のため、顔ぶれを見るときは中身の違いを意識すると読み違えません。雇用の形の多様さは、<a href="/ranking/industry-diversity-index" style={{ color: "#2563eb" }}>産業の集中度</a>の指標でも確認できます。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="就業者(第1〜3次産業合計)に占める第2次産業(製造業・建設業・鉱業など)就業者の割合"
        formula="第2次産業就業者比率 = 第2次産業就業者数 ÷ 全産業就業者数 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].share.toFixed(1)),
        }}
      source={dataSources["manufacturing"]}
      />

      <ManufacturingSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          share: c.share,
        }))}
        average={average}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.share.toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="manufacturing" />

    </div>
  );
}
