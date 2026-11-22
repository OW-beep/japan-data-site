import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import LibrarySummary from "../../../components/ranking/LibrarySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/library" },
  title: "全国自治体 図書館数ランキング｜人口10万人以上の都市で比較",
  description:
    "人口10万人以上の自治体を対象に、図書館1館あたりの人口をランキング形式で比較。図書館へのアクセスが良い自治体、人口の割に図書館が少ない自治体がわかります。",
};

export function generateMetadata() {
  return withTop1("library", baseMetadata);
}

export default function LibraryRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.libraryCount != null &&
        c.libraryCount > 0 &&
        c.population >= 100000
    )
    .map((c) => ({
      ...c,
      populationPerLibrary: c.population / (c.libraryCount ?? 1),
    }))
    .sort((a, b) => a.populationPerLibrary - b.populationPerLibrary)
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
        📚 図書館数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/library-child-ratio-analysis"
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
        📖 図書館の充実度と子供の割合の関係を分析した記事を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          このランキングは人口10万人以上の283自治体に対象を絞っています。図書館1館あたり人口の中央値は50,924人です。最も少ない青梅市は13,354人/館(10館)、一関市は13,992人/館(8館)、北見市は14,435人/館(8館)と、分館を細かく置いている市が上位に並びます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          逆に越谷市は1館あたり341,621人と、大きな図書館に集約する方式の市もあります。館の数は分館の数え方に左右されるため、蔵書数や貸出の実績とは別の物差しです。「身近な場所に図書館があるか」という近さの指標としてご覧ください。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="図書館1館あたりの人口です。数字が小さいほど、人口に対して図書館へのアクセスが良いことを意味します。人口10万人未満の自治体は、図書館数が1〜2館の違いで数値が大きく動くため対象から除外しています。"
        formula="人口 ÷ 図書館数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${Math.round(ranking[0]?.populationPerLibrary ?? 0).toLocaleString()}`,
        }}
      source={dataSources["library"]}
      />

      <LibrarySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.populationPerLibrary,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={Math.round(city.populationPerLibrary).toLocaleString()}
            unit="人/館"
          />
        ))}
      </div>

      <RankingCommentary slug="library" />

    </main>
  );
}
