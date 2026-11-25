import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DaytimeRatioSummary from "../../../components/ranking/DaytimeRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/daytime-ratio" },
  title: "昼夜間人口比率ランキング｜1位は千代田区1,355%・昼と夜で人口が入れ替わる自治体",
  description:
    "夜間人口(常住人口)に対する昼間人口の割合(昼夜間人口比率)をランキング形式で比較。通勤・通学による人口移動の実態がわかります。",
};

export default function DaytimeRatioRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.daytimePopulation != null &&
        c.nighttimePopulation != null &&
        c.nighttimePopulation > 0
    )
    .map((c) => ({
      ...c,
      daytimeRatio: ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100,
    }))
    .sort((a, b) => b.daytimeRatio - a.daytimeRatio)
    .slice(0, 100);

  return (
    <main
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
        🌆 昼夜間人口比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/daytime-ratio-analysis"
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
        📖 分析記事「千代田区が1355%になる理由」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          この比率が100%を超える自治体は586と、全体の3分の1にとどまります。
          上位は千代田区の1,355.4%を筆頭に、中央区374.4%、港区373.4%と
          都心のオフィス街が並び、夜の人口の何倍もの人が昼間に集まる
          「働く場所」そのものです。顔ぶれは都心だけではなく、名古屋港の
          物流・工場が集まる飛島村282.5%や、復興作業の拠点となっている
          大熊町588.6%など、産業の集積が昼の人口を押し上げる例も目立ちます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方で、七ヶ浜町67.1%や舟橋村70.7%のように100%を大きく
          下回る自治体は、住民が昼間に市街地へ出ていくベッドタウンです。
          比率の低さは衰退の印ではなく、「住む場所」として選ばれている
          ことの裏返しでもあります。昼の活気と夜の暮らしは別の顔なので、
          この比率は人口の多さと並べて見るのがおすすめです。昼間に人が
          集まる街では飲食店の集積も進みやすく、その関係は
          <a href="/articles/daytime-restaurant-density-analysis" style={{ color: "#2563eb" }}>
            昼間人口と飲食店密度の分析
          </a>
          で確かめています。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="夜間人口(常住人口)に対する昼間人口の割合です。100%を超えるほど、通勤・通学で流入する人が流出する人より多いことを意味します。令和2年(2020年)国勢調査に基づきます。"
        formula="昼間人口 ÷ 夜間人口 × 100"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.daytimeRatio?.toFixed(1) ?? "0.0"}`,
        }}
      source={dataSources["daytime-ratio"]}
      />

      <DaytimeRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.daytimeRatio,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.daytimeRatio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="daytime-ratio" />

    </main>
  );
}
