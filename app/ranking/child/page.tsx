import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import ChildSummary from "../../../components/ranking/ChildSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { getAgeRows, nationalRates } from "../../../lib/ageRates";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/child" },
  title: "子ども人口割合ランキング【2025年国勢調査】子供が多い市町村TOP100",
  description:
    "令和7年国勢調査(確定値)に基づく、子ども(15歳未満)の割合が高い市区町村のランキング。子供が多い市町村の上位100自治体と、2020年からの全国の変化をまとめました。",
};

export function generateMetadata() {
  return withTop1("child", baseMetadata);
}

export default function Page() {
  const { rows, label, use2025 } = getAgeRows();
  const nat = nationalRates(rows);
  // 上位100自治体を表示(以前は50)
  const ranking = rows
    .map((c) => ({ ...c, rate: c.childRate }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 100);

  return (
    <div
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
        👶 子ども人口割合ランキング
      </h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

      {use2025 && (
        <p style={{ color: "#4b5563", lineHeight: 1.8 }}>
          全自治体を合わせた全国の子ども(15歳未満)の割合は{nat.child.toFixed(1)}%で、2020年の
          {nat.child2020.toFixed(1)}%から{Math.abs(nat.child - nat.child2020).toFixed(1)}ポイント
          {nat.child >= nat.child2020 ? "上昇" : "低下"}しました。
        </p>
      )}

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          全国の割合が10.8%まで下がるなか、上位には沖縄県と離島部が
          並びます。1位の三島村24.7%は全国の2倍超で、十島村20.1%、
          八重瀬町19.5%、南風原町18.7%と続きます。顔ぶれのもう一つの
          軸は、熊本市近郊の嘉島町18.7%のような、子育て世代が流入する
          大都市近郊の町で、「出生が多い地域」と「子育て世代が移り
          住む地域」の2タイプが上位を作っています。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          ただし、この割合は年齢構成の結果であり、「子育て支援の
          手厚さ」そのものを測る指標ではありません。15%以上の自治体は
          48しかなく、半数の869自治体は10%を下回ります。また人口の
          小さな村では、子どもの数が数十人動くだけで順位が大きく
          変わります。割合だけでなく子どもの実数や保育の受け皿と
          合わせて見ることが大切で、見方は
          <a href="/articles/child-friendly-city-data-guide" style={{ color: "#2563eb" }}>
            子育てしやすい街のデータガイド
          </a>
          にまとめています。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="総人口に占める15歳未満人口の割合"
        formula="子ども人口 ÷ 総人口 ×100"
        example={{
          name:
            ranking[0]?.name ?? "",
          value: Number(
            ranking[0]?.rate.toFixed(2) ??
              0
          ),
        }}
      source={dataSources["child"]}
      />

      <ChildSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.rate,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="child" />

    </div>
  );
}