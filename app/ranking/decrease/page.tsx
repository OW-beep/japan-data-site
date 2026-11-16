import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import SmallestPopulationSummary from "../../../components/ranking/SmallestPopulationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/decrease" },
  title: "全国自治体 人口が少ない自治体ランキング",
  description:
    "全国の市区町村を人口が少ない順にランキング。離島や山村など、日本で最も人口規模の小さな自治体を比較できます。",
};

export default function Page() {
  const ranking = getMunicipalities2025()
    .filter((c) => c.population > 0)
    .sort((a, b) => a.population - b.population)
    .slice(0, 50);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        📉 人口が少ない自治体ランキング
      </h1>

      <DataAsOf text="令和7年国勢調査(確定値、総務省統計局)" />

      <MetricBox
        title="指標定義"
        unit="人"
        definition="国勢調査による人口が少ない順に並べたランキング"
        formula="人口が少ない順にソート"
        example={{
          name: `例：${ranking[0].name}`,
          value: ranking[0].population,
        }}
      source={dataSources["decrease"]}
      />

      <SmallestPopulationSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          population: c.population,
        }))}
      />

      <AdSense />

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          日本で最も人口が少ない自治体は、東京都の青ヶ島村で168人
          (2025年国勢調査)。渡名喜村(沖縄・233人)、野迫川村
          (奈良・289人)と、離島と山村が並びます。人口1,000人未満の
          自治体は44、3,000人未満は192にのぼります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          「小さい=衰退」とは限りません。青ヶ島村の課題は人口の
          少なさそのものより、本土との交通アクセスです。本土では
          平成の大合併で自治体の大型化が進みましたが、離島には
          合併という選択肢自体がありません。一方で、職員体制や
          議会など自治体運営の固定費は人口に比例して下がらないため、
          小規模な自治体ほど財政は地方交付税への依存度で見る
          必要があります。
        </p>
      </RankingEditorial>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population.toLocaleString()}
            unit="人"
          />
        ))}
      </div>

      <RankingCommentary slug="decrease" />

    </div>
  );
}
