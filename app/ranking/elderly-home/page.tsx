import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import ElderlyHomeSummary from "../../../components/ranking/ElderlyHomeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/elderly-home" },
  title: "全国自治体 高齢者施設数ランキング｜旭川市が「福祉の街」の理由",
  description:
    "老人ホーム1施設あたりの高齢者人口をランキング形式で比較。介護老人福祉施設・養護老人ホーム・有料老人ホームを合算した、最新(2023年度)のデータです。",
};

export default function ElderlyHomeRankingPage() {
  const all = getMunicipalities2025().filter(
    (c) => c.elderlyHomeCount != null && c.elderlyPopulation > 0
  );

  const zeroCount = all.filter((c) => c.elderlyHomeCount === 0).length;

  const ranking = all
    .filter((c) => (c.elderlyHomeCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      elderlyPerFacility: c.elderlyPopulation / (c.elderlyHomeCount ?? 1),
    }))
    .sort((a, b) => a.elderlyPerFacility - b.elderlyPerFacility)
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
        🏡 高齢者施設数ランキング
      </h1>

      <DataAsOf text="施設数:2023年度、高齢者人口:令和7年国勢調査(確定値)" />

      <a
        href="/articles/elderly-home-analysis"
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
        📖 分析記事「旭川市が福祉の街と呼ばれる理由」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          老人ホーム1施設あたりの高齢者人口の中央値は1,380人です。最も少ない西興部村は165人、粟国村は245人、階上町は252人と、小規模な自治体ほど「高齢者あたりの施設」が多くなります。小さな施設でも地域の中にあれば、この数字は小さくなります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方で、老人ホームが1施設もない自治体は94あります。近隣市町村と広域で施設をまかなう地域も多く、「ない」ことは福祉の弱さと同義ではありません。ただ、住み慣れた地域で介護を受けたいという希望との距離は、老後の住まいを考えるときに確認しておきたい点です。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="老人ホーム(介護老人福祉施設・養護老人ホーム・有料老人ホームの合算)1施設あたりの高齢者人口です。数字が小さいほど、高齢者人口に対して施設に余裕があります。老人ホームが1施設もない自治体は対象から除外しています。"
        formula="高齢者人口 ÷ 老人ホーム数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${Math.round(ranking[0]?.elderlyPerFacility ?? 0).toLocaleString()}`,
        }}
      source={dataSources["elderly-home"]}
      />

      <ElderlyHomeSummary
        zeroCount={zeroCount}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.elderlyPerFacility,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={Math.round(city.elderlyPerFacility).toLocaleString()}
            unit="人/施設"
          />
        ))}
      </div>

      <RankingCommentary slug="elderly-home" />

    </main>
  );
}
